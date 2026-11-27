// Serverless function for Vercel / Netlify (/api/mentor)
// Environment variables required:
//   GEMINI_API_KEY
//   SUPABASE_URL
//   SUPABASE_ANON_KEY

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { question, categoryName, categoryId, userId, brandName, history } = req.body;
  if (!question) return res.status(400).json({ error: "Question is required" });

  const systemPrompt = `You are a blunt, experience-led D2C Pocket Mentor for bootstrapped, first-time founders.
Founder/Brand: ${brandName || "Founder"}. Selected Category: ${categoryName || "General D2C"}.
Rules:
1. Personalize your tone and examples to ${brandName || "this founder"}—never give generic, robotic, or identical boilerplate.
2. Give practical, cash-efficient, step-by-step advice with real numbers (MOQ, COGS, Gross Margin, RTO, CAC).
3. If the user's product clearly does NOT belong in "${categoryName}", point out the mismatch and include at the very end:
[NEW_CATEGORY: {"id":"custom_slug","name":"Suggested Category Name","margin":[55,70],"rto":[8,15],"moq":"200-500 units","channel":"Top 0-to-1 channel","compliance":["Key compliance 1","Key compliance 2"]}]`;

  try {
    // 0. Retrieve relevant chunks from Supabase full-text search (no embeddings needed)
    let ragContext = "";
    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
      try {
        const matchRes = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/match_knowledge`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.SUPABASE_ANON_KEY,
            Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({ search_query: question, match_count: 4 })
        });
        const matches = await matchRes.json();
        if (Array.isArray(matches) && matches.length) {
          ragContext = "\n\nRelevant Mentor Corpus Excerpts (use these to give grounded, specific advice):\n"
            + matches.map((m) => `[${m.source_title}]: ${m.content}`).join("\n---\n");
        }
      } catch (_) {}
    }

    const contents = [
      ...(Array.isArray(history) ? history.slice(-4).map((m) => ({ role: m.role === "user" ? "user" : "model", parts: [{ text: m.text }] })) : []),
      { role: "user", parts: [{ text: question + ragContext }] }
    ];

    const callGemini = async (useSearch) => {
      const body = {
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: { temperature: 0.85 }
      };
      if (useSearch) body.tools = [{ google_search: {} }];

      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
      );
      return { ok: r.ok, status: r.status, data: await r.json() };
    };

    // 1. Try Gemini with Google Search Grounding; if 429 (free-tier search limit), retry without search
    let result = await callGemini(true);
    if (result.status === 429) {
      result = await callGemini(false);
    }

    if (!result.ok || result.data.error) {
      return res.status(result.status || 503).json({
        error: result.data?.error?.message || "Gemini temporarily unavailable"
      });
    }
    const answer =
      result.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Could not generate a response. Check your GEMINI_API_KEY.";

    // 2. Save to Supabase learned_brain + chat_history (if configured)
    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
      const headers = {
        "Content-Type": "application/json",
        apikey: process.env.SUPABASE_ANON_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`
      };

      await fetch(`${process.env.SUPABASE_URL}/rest/v1/learned_brain`, {
        method: "POST",
        headers,
        body: JSON.stringify({ question, answer, category_id: categoryId })
      });

      if (userId) {
        await fetch(`${process.env.SUPABASE_URL}/rest/v1/chat_history`, {
          method: "POST",
          headers,
          body: JSON.stringify([
            { user_id: userId, role: "user", message: question },
            { user_id: userId, role: "mentor", message: answer }
          ])
        });
      }
    }

    return res.status(200).json({ answer });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
