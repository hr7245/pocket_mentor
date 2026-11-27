// Run with: GEMINI_API_KEY=... SUPABASE_URL=... SUPABASE_ANON_KEY=... node scripts/ingest.mjs
// Ingests foundational essays & podcast RSS descriptions into Supabase pgvector (knowledge_chunks)

const SOURCES = [
  { title: "How to Get Startup Ideas (Paul Graham)", url: "https://paulgraham.com/startupideas.html" },
  { title: "Do Things That Don't Scale (Paul Graham)", url: "https://paulgraham.com/ds.html" },
  { title: "Default Alive or Default Dead (Paul Graham)", url: "https://paulgraham.com/aord.html" },
  { title: "Ramen Profitable (Paul Graham)", url: "https://paulgraham.com/ramenprofitable.html" },
  { title: "The Bootstrapped Founder RSS", url: "https://feeds.transistor.fm/the-bootstrapped-founder" },
  { title: "Founder Thesis RSS", url: "https://feeds.hubhopper.com/245832.rss" },
  { title: "Startups For the Rest of Us RSS", url: "https://feeds.feedburner.com/StartupsForTheRestOfUs" }
];

const stripHtml = (html) =>
  html.replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const chunkText = (text, size = 900) => {
  const chunks = [];
  for (let i = 0; i < text.length; i += size) chunks.push(text.slice(i, i + size));
  return chunks.slice(0, 12); // Cap per source to stay within free-tier rate limits
};

const EMBEDDING_MODELS = [
  "gemini-embedding-exp-03-07",
  "text-embedding-004",
  "embedding-001"
];

async function embed(text) {
  for (const model of EMBEDDING_MODELS) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: { parts: [{ text }] } })
      }
    );
    const data = await res.json();
    if (res.ok && data?.embedding?.values) {
      console.log(`  ✓ Embedded with ${model}`);
      return data.embedding.values;
    }
    console.error(`  ⚠ ${model} failed (${res.status}):`, data?.error?.message || "unknown");
  }
  return null;
}

async function run() {
  for (const src of SOURCES) {
    try {
      console.log(`Fetching: ${src.title}`);
      const html = await (await fetch(src.url)).text();
      const clean = stripHtml(html);
      const chunks = chunkText(clean);

      let inserted = 0;
      for (const content of chunks) {
        const embedding = await embed(content);
        // Store chunk even without embedding (falls back to keyword search in mentor)
        const payload = { source_title: src.title, source_url: src.url, content };
        if (embedding) payload.embedding = embedding;
        const sbRes = await fetch(`${process.env.SUPABASE_URL}/rest/v1/knowledge_chunks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.SUPABASE_ANON_KEY,
            Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
            Prefer: "return=minimal"
          },
          body: JSON.stringify(payload)
        });
        if (!sbRes.ok) {
          const errText = await sbRes.text();
          console.error(`  ❌ Supabase insert failed (${sbRes.status}):`, errText);
        } else {
          inserted++;
        }
      }
      console.log(`✅ ${inserted}/${chunks.length} chunks saved from ${src.title}`);
    } catch (err) {
      console.error(`Failed ${src.title}:`, err.message);
    }
  }
}

run();
