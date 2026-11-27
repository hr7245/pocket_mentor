const CATEGORIES = [
  {
    id: "beauty_skincare",
    name: "Beauty, Skincare & Personal Care",
    margin: [60, 75],
    rto: [8, 15],
    moq: "200–500 units",
    channel: "Nano-influencer seeding + before/after UGC",
    compliance: [
      "Cosmetic manufacturing/import license",
      "Full ingredient list & batch/expiry labeling",
      "Patch-test / dermatological safety disclaimer"
    ]
  },
  {
    id: "food_beverage",
    name: "Packaged Food, Beverages & Snacks",
    margin: [50, 65],
    rto: [5, 12],
    moq: "300–500 units",
    channel: "Local pop-ups, tasting samples + WhatsApp reorder loops",
    compliance: [
      "Food safety registration (FSSAI / FDA)",
      "Nutritional facts, allergens & shelf-life testing",
      "Tamper-evident food-grade packaging"
    ]
  },
  {
    id: "apparel_fashion",
    name: "Apparel, Footwear & Fashion",
    margin: [55, 70],
    rto: [18, 28],
    moq: "50–150 units per size/color",
    channel: "Founder styling Reels/TikToks + micro-creator try-on hauls",
    compliance: [
      "Wash-care & fabric composition labels",
      "Clear size chart with model measurements"
    ]
  },
  {
    id: "home_lifestyle",
    name: "Home, Kitchen & Lifestyle",
    margin: [55, 68],
    rto: [8, 15],
    moq: "100–300 units",
    channel: "Aesthetic unboxing videos + Pinterest/Instagram Reels",
    compliance: [
      "Drop-test packaging for fragile items",
      "Material safety (BPA-free / food-safe if kitchenware)"
    ]
  },
  {
    id: "pet_care",
    name: "Pet Care & Supplies",
    margin: [55, 70],
    rto: [6, 12],
    moq: "200–400 units",
    channel: "Pet-parent communities + cute UGC challenges",
    compliance: [
      "Pet food/supplement safety & ingredient disclosure",
      "Non-toxic material certification for toys"
    ]
  },
  {
    id: "supplements_wellness",
    name: "Health, Wellness & Supplements",
    margin: [65, 80],
    rto: [8, 15],
    moq: "300–500 units",
    channel: "Educational content + 30/60-day replenishment",
    compliance: [
      "Nutraceutical / FSSAI / FDA compliance",
      "Lab-tested COA (Certificate of Analysis) per batch",
      "Avoid illegal medical/cure claims in ads"
    ]
  },
  {
    id: "gadgets_electronics",
    name: "Consumer Gadgets & Accessories",
    margin: [45, 60],
    rto: [10, 18],
    moq: "100–300 units",
    channel: "Tech/desk-setup Shorts + problem-solving demos",
    compliance: [
      "Safety certifications (BIS / CE / FCC / RoHS)",
      "Clear 6–12 month warranty & replacement policy"
    ]
  }
];

const STAGES = {
  0: [
    "Do NOT rent an office, hire an agency, or run Meta ads on Day 1.",
    "Split budget 40% Inventory / 30% Content & Store / 30% Buffer.",
    "Pick 1–3 hero SKUs only (avoid trapped cash in 10+ SKUs).",
    "If partnering with a co-founder, run a 30-day sprint + 4-yr vesting (1-yr cliff).",
    "Check trademark/domain/handle availability before printing labels."
  ],
  1: [
    "Order physical samples from at least 3 manufacturers before committing.",
    "Negotiate low MOQ (200–500 units) by paying raw materials upfront.",
    "Verify Gross Margin is 55–65%+ using the Unit Economics calculator.",
    "While waiting for stock: build a 1-page waitlist & film behind-the-scenes content.",
    "While waiting for stock: list 50 nano-influencers (1k–15k) to gift on launch."
  ],
  2: [
    "Pack & ship your first 100–300 orders from home using a shipping aggregator.",
    "Enable automated WhatsApp/SMS confirmation on COD orders to cut RTO.",
    "Seed 50 nano-influencers with free product + handwritten note (no ad spend).",
    "Set up 3 Day-1 flows: Abandoned Cart, Post-Purchase Care, Replenishment.",
    "Include a 'Tag us for 15% off' card inside every box."
  ],
  3: [
    "Only test paid ads after 50–100+ organic sales & positive CM1 (>45%).",
    "Hire part-time/freelancers first (Ops/Support & Video Editor) with paid test tasks.",
    "Move to a 3PL only when shipping 300+ orders/month consistently.",
    "Track 5 investor metrics: Revenue, CM1/CM2, True CAC, Repeat Rate, Cash Cycle.",
    "Build your 10-slide D2C Pitch Deck only when raising for inventory/proven ads."
  ]
};

const BRAIN_SNIPPETS = [
  { title: "Company Registration & Incorporation", body: "Don't incorporate before validating demand. You can run a waitlist, pre-orders, or small-batch tests first. Once you have consistent sales, start lean (Sole Proprietorship / LLC, or Pvt Ltd only if raising VC) and register for GST/local tax." },
  { title: "What NOT to do from Day 1", body: "Never rent an office, order high-MOQ custom boxes, hire an agency, or run Meta ads before 50–100 organic sales. Launch with 1–3 hero SKUs only." },
  { title: "Negotiating Low MOQs", body: "Offer to pay 100% of raw material cost upfront and labor on dispatch. Position as a 200-unit test batch before a 1,000-unit reorder. Always test samples from 3+ suppliers." },
  { title: "What to do while waiting for products", body: "Build a waitlist page, film 'build in public' videos, line up 50 nano-influencers, set up Shopify/WhatsApp flows, and interview 10 target customers." },
  { title: "True CAC & RTO Math", body: "True CAC = Ad Spend per Order / (1 - RTO Rate). If CPP is 400 and RTO is 25%, True CAC is 533." },
  { title: "Cutting COD & RTO Losses", body: "Send instant WhatsApp/IVR confirmation for COD orders; auto-cancel unconfirmed orders. Incentivize prepaid with free shipping or a small discount." },
  { title: "First 100 Orders (Zero-Budget)", body: "Seed 50 nano-influencers (1k–15k followers) with free product, post founder-led 'build in public' Reels, and engage in niche communities." },
  { title: "10-Slide D2C Pitch Deck", body: "1. Hook, 2. Problem, 3. Solution, 4. Market, 5. Traction, 6. Unit Economics (CM1/CM2), 7. GTM, 8. Competition, 9. Team, 10. Ask & Use of Funds." },
  { title: "Co-founder & Hiring Rules", body: "Test co-founders with a 30-day sprint and 4-year vesting (1-year cliff). Hire freelancers for Ops & Video Editing before any full-time hire." }
];

let currentUser = JSON.parse(localStorage.getItem("d2c_current_user") || "null");
const userKey = (suffix) => `${currentUser ? currentUser.email : "guest"}_${suffix}`;

let currentCat = CATEGORIES[0];
let currentStage = 0;
let completed = JSON.parse(localStorage.getItem(userKey("completed")) || "{}");
let learnings = JSON.parse(localStorage.getItem(userKey("learnings")) || "[]");
let chatHistory = JSON.parse(localStorage.getItem(userKey("chat")) || "[]");

function initCategorySelect() {
  const sel = document.getElementById("categorySelect");
  CATEGORIES.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.name;
    sel.appendChild(opt);
  });
  sel.addEventListener("change", (e) => {
    currentCat = CATEGORIES.find((c) => c.id === e.target.value);
    renderCategory();
    calcEcon();
  });
  renderCategory();
}

function renderCategory() {
  document.getElementById("catTitle").textContent = currentCat.name;
  document.getElementById("catMoq").textContent = `MOQ: ${currentCat.moq}`;
  document.getElementById("catMargin").textContent = `${currentCat.margin[0]}% – ${currentCat.margin[1]}%`;
  document.getElementById("catRto").textContent = `${currentCat.rto[0]}% – ${currentCat.rto[1]}%`;
  document.getElementById("catChannel").textContent = currentCat.channel;
  const ul = document.getElementById("catCompliance");
  ul.innerHTML = currentCat.compliance.map((item) => `<li>${item}</li>`).join("");
}

function renderStage() {
  const list = document.getElementById("stageContent");
  const tasks = STAGES[currentStage];
  list.innerHTML = "";
  tasks.forEach((text, idx) => {
    const key = `${currentStage}_${idx}`;
    const isDone = !!completed[key];
    const div = document.createElement("label");
    div.className = `task-item ${isDone ? "done" : ""}`;
    div.innerHTML = `<input type="checkbox" ${isDone ? "checked" : ""} /> <span>${text}</span>`;
    div.querySelector("input").addEventListener("change", (e) => {
      completed[key] = e.target.checked;
      localStorage.setItem("d2c_completed", JSON.stringify(completed));
      renderStage();
    });
    list.appendChild(div);
  });
  updateProgress();
}

function updateProgress() {
  const total = Object.values(STAGES).reduce((acc, arr) => acc + arr.length, 0);
  const doneCount = Object.values(completed).filter(Boolean).length;
  document.getElementById("progressText").textContent = `${Math.round((doneCount / total) * 100)}% Done`;
}

document.getElementById("stageTabs").addEventListener("click", (e) => {
  if (!e.target.classList.contains("tab")) return;
  document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
  e.target.classList.add("active");
  currentStage = Number(e.target.dataset.stage);
  renderStage();
});

function calcEcon() {
  const price = Number(document.getElementById("price").value) || 0;
  const cogs = Number(document.getElementById("cogs").value) || 0;
  const shipping = Number(document.getElementById("shipping").value) || 0;
  const rtoPct = (Number(document.getElementById("rto").value) || 0) / 100;
  const gwPct = (Number(document.getElementById("gateway").value) || 0) / 100;
  const cpp = Number(document.getElementById("cpp").value) || 0;

  const grossMargin = price > 0 ? ((price - cogs) / price) * 100 : 0;
  const gatewayFee = price * gwPct;
  const cm1 = price - cogs - shipping - gatewayFee;
  const trueCac = rtoPct < 1 ? cpp / (1 - rtoPct) : cpp;
  const netProfit = cm1 - trueCac;

  const verdict = document.getElementById("econVerdict");
  if (grossMargin >= currentCat.margin[0] && netProfit > 0) {
    verdict.textContent = "Healthy Unit Economics";
    verdict.className = "badge good";
  } else if (netProfit > 0) {
    verdict.textContent = "Thin Margin — Watch Costs";
    verdict.className = "badge warn";
  } else {
    verdict.textContent = "Losing Money Per Order";
    verdict.className = "badge bad";
  }

  document.getElementById("econResults").innerHTML = `
    <div><span>Gross Margin</span><strong>${grossMargin.toFixed(1)}%</strong> (Target: ${currentCat.margin[0]}%+)</div>
    <div><span>CM1 (Before Ads)</span><strong>${cm1.toFixed(0)}</strong></div>
    <div><span>True CAC (After RTO)</span><strong>${trueCac.toFixed(0)}</strong></div>
    <div><span>Net Profit / Delivered Order</span><strong>${netProfit.toFixed(0)}</strong></div>
  `;
}

document.getElementById("econForm").addEventListener("input", calcEcon);

function renderBrainSearch(query = "") {
  const q = query.trim().toLowerCase();
  const hits = q
    ? BRAIN_SNIPPETS.filter((s) => s.title.toLowerCase().includes(q) || s.body.toLowerCase().includes(q))
    : BRAIN_SNIPPETS.slice(0, 3);
  document.getElementById("brainResults").innerHTML = hits.length
    ? hits.map((h) => `<div class="brain-hit"><strong>${h.title}</strong>${h.body}</div>`).join("")
    : `<div class="brain-hit">No exact match. Try 'MOQ', 'RTO', 'ads', 'waiting', or 'pitch deck'.</div>`;
}

document.getElementById("brainSearch").addEventListener("input", (e) => renderBrainSearch(e.target.value));

function renderLearnings() {
  document.getElementById("learningsList").innerHTML = learnings
    .map((l) => `<li>${l}</li>`)
    .join("");
}

document.getElementById("saveLearningBtn").addEventListener("click", () => {
  const input = document.getElementById("learningInput");
  const val = input.value.trim();
  if (!val) return;
  learnings.unshift(val);
  localStorage.setItem("d2c_learnings", JSON.stringify(learnings));
  input.value = "";
  renderLearnings();
});

initCategorySelect();
renderStage();
calcEcon();
renderBrainSearch();
renderLearnings();
renderAuth();
renderChat();

function renderAuth() {
  const btn = document.getElementById("authBtn");
  btn.textContent = currentUser ? `${currentUser.brand || currentUser.email} (Switch)` : "Sign In";
}

document.getElementById("authBtn").addEventListener("click", () => {
  document.getElementById("authModal").classList.remove("hidden");
});
document.getElementById("authCancel").addEventListener("click", () => {
  document.getElementById("authModal").classList.add("hidden");
});
document.getElementById("authSubmit").addEventListener("click", () => {
  const email = document.getElementById("authEmail").value.trim();
  const brand = document.getElementById("authBrand").value.trim();
  if (!email) return;
  currentUser = { email, brand };
  localStorage.setItem("d2c_current_user", JSON.stringify(currentUser));
  completed = JSON.parse(localStorage.getItem(userKey("completed")) || "{}");
  learnings = JSON.parse(localStorage.getItem(userKey("learnings")) || "[]");
  chatHistory = JSON.parse(localStorage.getItem(userKey("chat")) || "[]");
  document.getElementById("authModal").classList.add("hidden");
  renderAuth();
  renderStage();
  renderLearnings();
  renderChat();
});

function renderChat() {
  const box = document.getElementById("chatMessages");
  if (!chatHistory.length) {
    box.innerHTML = `<div class="chat-msg mentor"><small>Pocket Mentor (${currentCat.name})</small>Ask me anything about your product, pricing, MOQs, or first 100 orders. I'll tailor advice to your category's ${currentCat.margin[0]}–${currentCat.margin[1]}% margin target.</div>`;
    return;
  }
  box.innerHTML = chatHistory
    .map((m) => `<div class="chat-msg ${m.role}"><small>${m.role === "user" ? (currentUser?.brand || "Founder") : "Pocket Mentor"}</small>${m.text}</div>`)
    .join("");
  box.scrollTop = box.scrollHeight;
}

const CATEGORY_KEYWORDS = {
  beauty_skincare: ["serum", "cream", "skincare", "face", "hair", "shampoo", "soap", "cosmetic", "beauty", "lip", "sunscreen"],
  food_beverage: ["snack", "coffee", "tea", "chocolate", "drink", "beverage", "sauce", "food", "cookie", "bar"],
  apparel_fashion: ["shirt", "t-shirt", "hoodie", "jeans", "dress", "apparel", "clothing", "fashion", "shoe", "sneaker"],
  home_lifestyle: ["kitchen", "candle", "pan", "mug", "decor", "home", "desk", "organizer", "bottle", "lamp"],
  pet_care: ["dog", "cat", "pet", "treat", "kibble", "leash", "collar", "grooming"],
  supplements_wellness: ["protein", "superyou", "supplement", "whey", "vitamin", "gummy", "creatine", "collagen", "nutrition", "probiotic"],
  gadgets_electronics: ["charger", "earbud", "watch", "gadget", "electronic", "cable", "speaker", "tech"]
};

function detectCategoryMismatch(query, selectedCatId) {
  const ql = query.toLowerCase();
  for (const [catId, words] of Object.entries(CATEGORY_KEYWORDS)) {
    if (catId !== selectedCatId && words.some((w) => ql.includes(w))) {
      return CATEGORIES.find((c) => c.id === catId);
    }
  }
  return null;
}

window.switchCategoryFromChat = (catId) => {
  const found = CATEGORIES.find((c) => c.id === catId);
  if (!found) return;
  currentCat = found;
  document.getElementById("categorySelect").value = catId;
  renderCategory();
  calcEcon();
  chatHistory.push({ role: "mentor", text: `Switched your category to <strong>${found.name}</strong>! Ask your question again and I'll tailor it to ${found.margin[0]}–${found.margin[1]}% margins & ${found.moq} MOQ.` });
  localStorage.setItem(userKey("chat"), JSON.stringify(chatHistory));
  renderChat();
};

document.getElementById("chatForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentUser) {
    const guestTries = Number(localStorage.getItem("d2c_guest_tries") || "0");
    if (guestTries >= 5) {
      document.getElementById("authModal").classList.remove("hidden");
      return;
    }
    localStorage.setItem("d2c_guest_tries", String(guestTries + 1));
  }

  const input = document.getElementById("chatInput");
  const q = input.value.trim();
  if (!q) return;
  chatHistory.push({ role: "user", text: q });
  input.value = "";
  renderChat();

  const mismatch = detectCategoryMismatch(q, currentCat.id);
  if (mismatch) {
    const msg = `It looks like you're asking about <strong>${mismatch.name}</strong>, but you currently have <strong>${currentCat.name}</strong> selected.<br/>Should I switch your category so my margin, compliance, and MOQ advice is accurate?<br/><button class="switch-cat-btn" onclick="switchCategoryFromChat('${mismatch.id}')">Switch to ${mismatch.name}</button>`;
    chatHistory.push({ role: "mentor", text: msg });
    localStorage.setItem(userKey("chat"), JSON.stringify(chatHistory));
    renderChat();
    return;
  }

  let reply = "";
  try {
    const res = await fetch("/api/mentor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: q,
        categoryName: currentCat.name,
        categoryId: currentCat.id,
        userId: currentUser?.email || null
      })
    });
    if (res.ok) {
      const data = await res.json();
      reply = data.answer;
    }
  } catch (_) {
    // Fallback to local brain when running offline/locally without Vercel
  }

  if (!reply) {
    const ql = q.toLowerCase();
    const match = BRAIN_SNIPPETS.find(
      (s) =>
        ql.includes(s.title.toLowerCase().split(" ")[0]) ||
        s.title.toLowerCase().split(" ").some((w) => w.length > 3 && ql.includes(w)) ||
        s.body.toLowerCase().split(" ").some((w) => w.length > 4 && ql.includes(w))
    );
    const followUp = `<br/><br/><strong>To give you sharper advice for ${currentCat.name}:</strong><br/>1. What is your target selling price &amp; landed COGS?<br/>2. Have you already sold to 10+ strangers, or are you still pre-launch?`;
    reply = match
      ? `<strong>${match.title} (${currentCat.name}):</strong> ${match.body}<br/><br/><em>Category Guardrail:</em> Target ${currentCat.margin[0]}%+ Gross Margin &amp; watch RTO around ${currentCat.rto[0]}–${currentCat.rto[1]}%.${followUp}`
      : `<strong>Pocket Mentor (${currentCat.name}):</strong> Focus on validating demand with 1–3 hero SKUs before spending on inventory or ads. Target a ${currentCat.margin[0]}%+ gross margin and start with ${currentCat.channel}.${followUp}`;
  }

  chatHistory.push({ role: "mentor", text: reply });
  localStorage.setItem(userKey("chat"), JSON.stringify(chatHistory));
  renderChat();
});
