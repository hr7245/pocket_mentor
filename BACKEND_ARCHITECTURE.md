# Free & Safe Backend Architecture (Auth, Memory & Self-Improving Brain)

To take the **D2C Pocket Mentor** from a local MVP to a multi-user web app with **zero monthly cost**, use this free, safe stack:

## 1. Authentication & Persistent User Memory: **Supabase (Free Tier)**
* **Why:** Free up to 50,000 monthly active users, includes Email/Magic-Link/Google Sign-In + Postgres database.
* **Tables to create:**
  * `profiles` (`id`, `email`, `brand_name`, `category_id`, `current_stage`)
  * `chat_history` (`id`, `user_id`, `role`, `message`, `created_at`)
  * `learned_brain` (`id`, `question`, `answer`, `source_url`, `category_id`, `created_at`) — stores new Q&As discovered via web search so the brain grows with every user.

## 2. AI Mentor + Web Search: **Gemini API (Free Tier) + Google Search Grounding**
* **Why:** Free tier available in Google AI Studio, and supports **built-in Google Search grounding**—so if a founder asks a new, product-specific question not in `knowledge-brain/`, Gemini searches the web, gives an experience-led answer, and your backend saves the Q&A into `learned_brain`.

## 3. Hosting: **Vercel or Netlify (Free Tier)**
* Host the `app/` frontend for free, and use a single Serverless Function (`/api/mentor`) to keep your Gemini API key safe on the server.
