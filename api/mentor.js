// Serverless function for Vercel / Netlify (/api/mentor)
// Environment variables required:
//   GEMINI_API_KEY
//   SUPABASE_URL
//   SUPABASE_ANON_KEY

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { question, categoryName, categoryId, userId } = req.body;
  if (!question) return res.status(400).json({ error: "Question is required" });

  const systemPrompt = `You are a blunt, experience-led D2C Pocket Mentor for bootstrapped, first-time founders.
Category: ${categoryName || "General D2C"}.
Give practical, cash-efficient, step-by-step advice. Avoid generic fluff.`;

  try {
    // 1. Call Gemini API (Free Tier) with Google Search Grounding
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: "user", parts: [{ text: question }] }],
          tools: [{ google_search: {} }]
        })
      }
    );

    const data = await geminiRes.json();
    if (!geminiRes.ok || data.error) {
      const msg = data?.error?.message || `Gemini API error (${geminiRes.status})`;
      return res.status(200).json({ answer: `API Error: ${msg}` });
    }
    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
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
