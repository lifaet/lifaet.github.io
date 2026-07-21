/* ============================================================
   API CONFIG
   ============================================================ */
const API_URL = "https://lifaet.pages.dev/api";
const API_HEADERS = { "x-api-client": "portfolio-client" };

/* ============================================================
   HELPERS
   ============================================================ */
const el = (id) => document.getElementById(id);
const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const html = (strings, ...vals) => strings.reduce((a, s, i) => a + s + (vals[i] ?? ""), "");
const esc = (str) => String(str ?? "").replace(/[&<>"']/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[c]));

let SITE = null; // normalized data, populated after fetch

/* ============================================================
   FETCH + NORMALIZE
   ============================================================ */
function loadJSONData() {
  return fetch(API_URL, { headers: API_HEADERS })
    .then((response) => {
      if (!response.ok) throw new Error("Cannot load site data");
      return response.json();
    });
}

function normalizeData(raw) {
  const subtitleRoles = (raw.subtitle || "")
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);

  const experience = (raw.experience || []).map((e) => {
    const parts = String(e.company || "").split(",").map((s) => s.trim()).filter(Boolean);
    return {
      role: e.title || "",
      company: parts[0] || e.company || "",
      location: parts.slice(1).join(", "),
      period: e.date || "",
      achievements: e.achievements || []
    };
  });

  const education = (raw.education || []).map((ed) => ({
    degree: ed.title || "",
    institution: ed.institute || "",
    period: ed.duration || "",
    achievements: ed.achievements || []
  }));

  const certifications = (raw.certifications || []).map((c) => ({
    name: c.title || "",
    issuer: c.issuer || "",
    credentials: c.credentials || "",
    link: c.link || ""
  }));

  const skills = (raw.skills || []).map((s) => ({
    category: s.category || "",
    icon: s.icon || "fas fa-code",
    items: (s.items || []).map((i) => ({
      name: i.name || "",
      level: Math.max(0, Math.min(100, parseInt(i.level, 10) || 0))
    }))
  }));

  const languages = (raw.languages || []).map((l) => ({
    name: l.name || "",
    rating: Math.max(0, Math.min(5, parseFloat(l.rating) || 0))
  }));

  const projects = (raw.projects || []).map((p) => ({
    title: p.name || "",
    description: p.details || "",
    tags: p.tags || [],
    link: p.link || "",
    category: (p.category || []).map((c) => String(c).toLowerCase())
  }));

  return {
    meta: {
      title: raw.title || raw.name || "Portfolio",
      description: raw.description || "",
      keywords: raw.keywords || "",
      author: raw.author || raw.name || ""
    },
    name: raw.name || "",
    avatarSrc: raw.avatar || "",
    title: subtitleRoles[0] || raw.subtitle || "",
    typedRoles: subtitleRoles.length ? subtitleRoles : (raw.subtitle ? [raw.subtitle] : []),
    greeting: raw.headline || "Hi, I'm",
    highlight: raw.highlight || raw.name || "",
    bio: raw.careerObjective || "",
    mapEmbed: raw.mapUrl || "",
    copyright: raw.copyright || "",
    cvRedirectBase: raw.cvRedirectBase || "",
    formEndpoint: (raw.formScriptBase && raw.formScriptId)
      ? `${raw.formScriptBase}${raw.formScriptId}/exec`
      : "",
    social: (raw.socialLinks || []).map((s) => ({ icon: s.icon, url: s.url, label: s.name })),
    contact: [
      raw.location ? { icon: "fas fa-location-dot", label: "Location", value: raw.location } : null,
      raw.email ? { icon: "fas fa-envelope", label: "Email", value: raw.email } : null
    ].filter(Boolean),
    nav: (raw.menu || []).map((m) => ({
      page: m.id, icon: m.icon, desktopLabel: m.desktopLabel, mobileLabel: m.mobileLabel
    })),
    experience,
    education,
    certifications,
    skills,
    languages,
    projects
  };
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener("DOMContentLoaded", init);

function init() {
  showOverlay("loading");
  loadJSONData()
    .then((raw) => {
      SITE = normalizeData(raw);
      renderAll();
      hideOverlay();
    })
    .catch((err) => {
      console.error("Portfolio data load failed:", err);
      showOverlay("error");
    });

  const retryBtn = el("app-retry-btn");
  if (retryBtn) retryBtn.addEventListener("click", init);
}

function showOverlay(state) {
  const overlay = el("app-overlay");
  const box = qs(".app-overlay-box", overlay);
  const text = el("app-overlay-text");
  const retryBtn = el("app-retry-btn");
  const appContainer = el("app-container");

  overlay.style.display = "flex";
  appContainer.style.display = "none";

  if (state === "loading") {
    box.classList.remove("is-error");
    text.textContent = "Loading …";
    retryBtn.style.display = "none";
  } else {
    box.classList.add("is-error");
    text.textContent = "Couldn't load portfolio data. Please check your connection and try again.";
    retryBtn.style.display = "inline-block";
  }
}

function hideOverlay() {
  el("app-overlay").style.display = "none";
  el("app-container").style.display = "flex";
}

function renderAll() {
  buildMeta();
  buildNav();
  buildHome();
  buildExperience();
  buildEducation();
  buildSkills();
  buildLanguages();
  buildProjects();
  buildContact();
  initNavigation();
  initRouting();
  initTyped();
  initContactForm();
  initCvForm();
  initProjectsToggle();
  initScrollAnimations();
}

/* ============================================================
   META / PROFILE
   ============================================================ */
function buildMeta() {
  document.title = SITE.meta.title;

  const descMeta = qs('meta[name="description"]');
  if (descMeta) descMeta.setAttribute("content", SITE.meta.description);
  const kwMeta = qs('meta[name="keywords"]');
  if (kwMeta) kwMeta.setAttribute("content", SITE.meta.keywords);
  const authorMeta = qs('meta[name="author"]');
  if (authorMeta) authorMeta.setAttribute("content", SITE.meta.author);

  const avatarHtml = SITE.avatarSrc
    ? `<img src="${esc(SITE.avatarSrc)}" alt="${esc(SITE.name)}" onerror="this.closest('.profile-image, .mobile-profile-link').classList.add('avatar-fallback')">`
    : `<div class="avatar-initials">${esc(initials(SITE.name))}</div>`;

  qsa(".profile-image").forEach((e) => (e.innerHTML = avatarHtml));
  qsa(".profile-name").forEach((e) => (e.textContent = SITE.name));
  qsa(".profile-title").forEach((e) => (e.textContent = SITE.title));
  qsa(".mobile-profile-name").forEach((e) => (e.textContent = SITE.name));

  qsa(".mobile-profile-link img").forEach((img) => {
    if (SITE.avatarSrc) {
      img.src = SITE.avatarSrc;
      img.alt = SITE.name;
    } else {
      img.replaceWith(Object.assign(document.createElement("span"), {
        className: "mobile-avatar-initials",
        textContent: initials(SITE.name)
      }));
    }
  });

  qsa(".copyright p:first-child").forEach((p) => (p.textContent = SITE.copyright));

  const mapIframe = qs(".map-section iframe");
  if (mapIframe && SITE.mapEmbed) mapIframe.src = SITE.mapEmbed;
}

function initials(name) {
  return (name || "").split(" ").filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

/* ============================================================
   NAV
   ============================================================ */
function buildNav() {
  const desktopContainer = qs(".sidebar");
  const mobileContainer = qs(".mobile-bottom-nav");
  if (!desktopContainer || !mobileContainer) return;

  qsa(".menu-btn", desktopContainer).forEach((b) => b.remove());
  qsa(".nav-btn", mobileContainer).forEach((b) => b.remove());

  SITE.nav.forEach((item, idx) => {
    const active = idx === 0 ? "active" : "";

    const dBtn = document.createElement("button");
    dBtn.className = `menu-btn ${active}`;
    dBtn.dataset.page = item.page;
    dBtn.innerHTML = `<i class="${esc(item.icon)}" aria-hidden="true"></i><span>${esc(item.desktopLabel)}</span>`;

    const mBtn = document.createElement("button");
    mBtn.className = `nav-btn ${active}`;
    mBtn.dataset.page = item.page;
    mBtn.innerHTML = `
      <span class="nav-btn-row">
        <i class="${esc(item.icon)}" aria-hidden="true"></i>
        <span class="nav-btn-label">${esc(item.mobileLabel.toUpperCase())}</span>
      </span>
      <span class="nav-btn-indicator"></span>`;

    const copyright = qs(".copyright", desktopContainer);
    desktopContainer.insertBefore(dBtn, copyright);
    mobileContainer.appendChild(mBtn);
  });
}

/* ============================================================
   HOME
   ============================================================ */
function buildHome() {
  const intro = qs(".intro-text");
  if (!intro) return;

  intro.innerHTML = html`
    <h1 class="name-title"><span class="greeting-inline">${esc(SITE.greeting)}</span> <span class="name-highlight">${esc(SITE.highlight || SITE.name)}</span></h1>
    <p class="typed-role"><span id="typed-text"></span><span class="typed-cursor">|</span></p>
    <blockquote class="bio">${esc(SITE.bio)}</blockquote>
    <div class="home-cta">
      <button class="btn-primary" onclick="navigateTo('contact')">Get in touch</button>
      <button class="btn-outline" onclick="navigateTo('projects')">View work</button>
    </div>`;

  buildSocialLinks(qs(".home-content .social-links"));
}

function buildSocialLinks(container) {
  if (!container) return;
  container.innerHTML = SITE.social.map((s) => html`
    <a href="${esc(s.url)}" class="social-link" aria-label="${esc(s.label)}" target="_blank" rel="noopener">
      <i class="${esc(s.icon)}" aria-hidden="true"></i>
    </a>`).join("");
}

/* ============================================================
   EXPERIENCE
   ============================================================ */
function buildExperience() {
  const grid = qs(".timeline-grid");
  if (!grid) return;

  if (!SITE.experience.length) {
    grid.innerHTML = `<p class="no-results">No experience listed yet.</p>`;
    return;
  }

  grid.innerHTML = SITE.experience.map((exp, i) => html`
    <div class="timeline-item reveal" style="--delay:${i * 80}ms">
      <div class="timeline-dot"></div>
      <div class="timeline-card">
        <div class="tc-header">
          <div>
            <h3 class="tc-role">${esc(exp.role)}</h3>
            <p class="tc-company">${esc(exp.company)}</p>
          </div>
          <div class="tc-meta">
            ${exp.period ? `<span class="badge badge-period"><i class="fa-regular fa-calendar" aria-hidden="true"></i> ${esc(exp.period)}</span>` : ""}
            ${exp.location ? `<span class="badge badge-location"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${esc(exp.location)}</span>` : ""}
          </div>
        </div>
        ${exp.achievements.length ? `<ul class="tc-achievements">${exp.achievements.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>` : ""}
      </div>
    </div>`).join("");
}

/* ============================================================
   EDUCATION
   ============================================================ */
function buildEducation() {
  const grid = qs(".education-grid");
  const certGrid = qs(".cert-grid");

  if (grid) {
    grid.innerHTML = SITE.education.length
      ? SITE.education.map((edu, i) => html`
        <div class="edu-card reveal" style="--delay:${i * 80}ms">
          <div class="edu-icon"><i class="fa-solid fa-graduation-cap" aria-hidden="true"></i></div>
          <div>
            <h3>${esc(edu.degree)}</h3>
            <p class="edu-inst">${esc(edu.institution)}</p>
            <p class="edu-period">${esc(edu.period)}</p>
            ${edu.achievements.length ? `<ul class="edu-achievements">${edu.achievements.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>` : ""}
          </div>
        </div>`).join("")
      : `<p class="no-results">No education listed yet.</p>`;
  }

  if (certGrid) {
    certGrid.innerHTML = SITE.certifications.length
      ? SITE.certifications.map((cert, i) => {
        const nameHtml = cert.link
          ? `<span class="cert-name-link">${esc(cert.name)} <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></span>`
          : esc(cert.name);
        const meta = [cert.issuer, cert.credentials].filter(Boolean).join(" · ");
        const inner = html`
          <i class="fa-solid fa-certificate cert-icon" aria-hidden="true"></i>
          <div>
            <p class="cert-name">${nameHtml}</p>
            ${meta ? `<p class="cert-meta">${esc(meta)}</p>` : ""}
          </div>`;
        return cert.link
          ? `<a href="${esc(cert.link)}" class="cert-card reveal" style="--delay:${i * 80}ms" target="_blank" rel="noopener">${inner}</a>`
          : `<div class="cert-card reveal" style="--delay:${i * 80}ms">${inner}</div>`;
      }).join("")
      : `<p class="no-results">No certifications listed yet.</p>`;
  }
}

/* ============================================================
   SKILLS
   ============================================================ */
let activeSkillFilter = "All";

function buildSkills() {
  const filtersEl = qs(".skill-filters");
  const grid = qs(".skills-grid");
  if (!grid) return;

  if (!SITE.skills.length) {
    if (filtersEl) filtersEl.innerHTML = "";
    grid.innerHTML = `<p class="no-results">No skills listed yet.</p>`;
    return;
  }

  const categories = ["All", ...SITE.skills.map((s) => s.category)];
  if (filtersEl) {
    filtersEl.innerHTML = categories.map((cat) => `
      <button class="filter-tab ${cat === activeSkillFilter ? "active" : ""}" role="tab"
        aria-selected="${cat === activeSkillFilter}" data-skill-filter="${esc(cat)}">${esc(cat)}</button>`).join("");
  }

  renderSkillCards();
}

function renderSkillCards() {
  const grid = qs(".skills-grid");
  if (!grid) return;

  const filtered = activeSkillFilter === "All"
    ? SITE.skills
    : SITE.skills.filter((s) => s.category === activeSkillFilter);

  grid.innerHTML = filtered.length
    ? filtered.map((cat, i) => html`
      <div class="skill-category reveal" style="--delay:${i * 60}ms">
        <h3 class="skill-cat-title"><span class="skill-cat-icon"><i class="${esc(cat.icon)}" aria-hidden="true"></i></span> ${esc(cat.category)}</h3>
        <div class="skill-bars">
          ${cat.items.map((item) => html`
            <div class="skill-bar-item">
              <div class="skill-bar-top">
                <span class="skill-bar-name">${esc(item.name)}</span>
                <span class="skill-bar-pct">${item.level}%</span>
              </div>
              <div class="skill-bar-track">
                <div class="skill-bar-fill" style="width:${item.level}%"></div>
              </div>
            </div>`).join("")}
        </div>
      </div>`).join("")
    : `<p class="no-results">No skills in this category.</p>`;

  triggerReveal(qs(".page.active"));
}

/* ============================================================
   LANGUAGES
   ============================================================ */
function buildLanguages() {
  const section = qs(".languages-section");
  const grid = qs(".languages-grid");
  if (!grid) return;

  if (!SITE.languages.length) {
    if (section) section.style.display = "none";
    return;
  }
  if (section) section.style.display = "";

  grid.innerHTML = SITE.languages.map((lang, i) => {
    const full = Math.floor(lang.rating);
    const hasHalf = lang.rating - full >= 0.5;
    const stars = Array.from({ length: 5 }, (_, idx) => {
      if (idx < full) return `<i class="fa-solid fa-star filled" aria-hidden="true"></i>`;
      if (idx === full && hasHalf) return `<i class="fa-solid fa-star half" aria-hidden="true"></i>`;
      return `<i class="fa-solid fa-star" aria-hidden="true"></i>`;
    }).join("");

    return html`
      <div class="language-card reveal" style="--delay:${i * 60}ms">
        <div class="lang-top">
          <span class="lang-name">${esc(lang.name)}</span>
          <span class="lang-rating">${lang.rating}/5</span>
        </div>
        <div class="lang-stars">${stars}</div>
      </div>`;
  }).join("");
}

/* ============================================================
   PROJECTS
   ============================================================ */
let projectView = "grid";
let activeFilter = "All";

function buildProjects() {
  const filtersEl = qs(".project-filters");
  const gridEl = qs(".projects-grid");
  if (!filtersEl || !gridEl) return;

  const categorySet = new Set();
  SITE.projects.forEach((p) => p.category.forEach((c) => categorySet.add(c)));
  const categories = ["All", ...[...categorySet].sort()];

  filtersEl.innerHTML = `
    <div class="filter-row">
      <div class="filter-tabs" role="tablist">
        ${categories.map((cat) => `
          <button class="filter-tab ${cat === "All" ? "active" : ""}" role="tab"
            aria-selected="${cat === "All"}" data-filter="${esc(cat)}">${esc(capitalize(cat))}</button>`).join("")}
      </div>
      <div class="view-toggle" aria-label="Toggle view">
        <button class="view-btn active" data-view="grid" title="Grid view">
          <i class="fa-solid fa-grip" aria-hidden="true"></i>
        </button>
        <button class="view-btn" data-view="list" title="List view">
          <i class="fa-solid fa-list" aria-hidden="true"></i>
        </button>
      </div>
    </div>`;

  renderProjectCards();
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function renderProjectCards() {
  const gridEl = qs(".projects-grid");
  if (!gridEl) return;

  const filtered = activeFilter === "All"
    ? SITE.projects
    : SITE.projects.filter((p) => p.category.includes(activeFilter));

  gridEl.className = `projects-grid view-${projectView}`;

  gridEl.innerHTML = filtered.length
    ? filtered.map((p, i) => projectCardHtml(p, i)).join("")
    : `<p class="no-results">No projects in this category.</p>`;

  triggerReveal(qs(".page.active"));
}

function projectCardHtml(p, i) {
  let linkHtml = `<span class="proj-nolink">Private / not public</span>`;
  if (p.link) {
    const isSource = p.link.includes("github.com");
    linkHtml = `<a href="${esc(p.link)}" class="proj-link" target="_blank" rel="noopener" aria-label="${isSource ? "Source code" : "View project"}">
      <i class="fa-${isSource ? "brands fa-github" : "solid fa-arrow-up-right-from-square"}" aria-hidden="true"></i> ${isSource ? "Source" : "View"}
    </a>`;
  }

  return html`
    <article class="project-card reveal" style="--delay:${i * 60}ms">
      <div class="proj-body">
        <div class="proj-top">
          <div class="proj-title-row">
            <h3 class="proj-title">${esc(p.title)}</h3>
          </div>
          <div class="proj-meta">
            <div class="proj-categories">
              ${p.category.map((c) => `<span class="proj-cat-badge">${esc(capitalize(c))}</span>`).join("")}
            </div>
          </div>
          <p class="proj-desc">${esc(p.description)}</p>
        </div>
        <div class="proj-footer">
          <div class="tag-list">${p.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
          <div class="proj-links">${linkHtml}</div>
        </div>
      </div>
    </article>`;
}

function initProjectsToggle() {
  document.addEventListener("click", (e) => {
    const tab = e.target.closest(".filter-tab[data-filter]");
    if (tab) {
      activeFilter = tab.dataset.filter;
      qsa(".filter-tab[data-filter]").forEach((b) => {
        b.classList.toggle("active", b.dataset.filter === activeFilter);
        b.setAttribute("aria-selected", b.dataset.filter === activeFilter);
      });
      renderProjectCards();
      return;
    }

    const viewBtn = e.target.closest(".view-btn");
    if (viewBtn) {
      projectView = viewBtn.dataset.view;
      qsa(".view-btn").forEach((b) => b.classList.toggle("active", b.dataset.view === projectView));
      renderProjectCards();
      return;
    }

    const skillTab = e.target.closest(".filter-tab[data-skill-filter]");
    if (skillTab) {
      activeSkillFilter = skillTab.dataset.skillFilter;
      qsa(".filter-tab[data-skill-filter]").forEach((b) => {
        b.classList.toggle("active", b.dataset.skillFilter === activeSkillFilter);
        b.setAttribute("aria-selected", b.dataset.skillFilter === activeSkillFilter);
      });
      renderSkillCards();
    }
  });
}

/* ============================================================
   CONTACT
   ============================================================ */
function buildContact() {
  const infoEl = qs(".contact-info");
  if (infoEl) {
    infoEl.innerHTML = SITE.contact.map((c) => html`
      <div class="contact-card">
        <i class="${esc(c.icon)}" aria-hidden="true"></i>
        <div>
          <p class="cc-label">${esc(c.label)}</p>
          <p class="cc-value">${esc(c.value)}</p>
        </div>
      </div>`).join("");
  }

  buildSocialLinks(qs("#contact .social-links"));
}

/* ============================================================
   NAVIGATION
   ============================================================ */
// Aliases let a URL like ?view=cv resolve to an existing page
// (here, the Contact page, which hosts the CV download section)
// while still remembering which sub-target was requested so we
// can scroll straight to it.
const VIEW_ALIASES = {
  cv: { page: "contact", scrollTo: "cv" },
  resume: { page: "contact", scrollTo: "cv" }
};

function initNavigation() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-page]");
    if (btn && (btn.classList.contains("menu-btn") || btn.classList.contains("nav-btn"))) {
      navigateTo(btn.dataset.page);
    }
  });

  window.addEventListener("popstate", () => applyViewFromURL());
}

function initRouting() {
  applyViewFromURL();
}

function resolveView(rawView) {
  if (!rawView) return null;
  const normalized = rawView.toLowerCase();
  if (VIEW_ALIASES[normalized]) return VIEW_ALIASES[normalized];
  const validIds = SITE.nav.map((n) => n.page);
  if (validIds.includes(normalized)) return { page: normalized, scrollTo: null };
  return null;
}

function applyViewFromURL() {
  const rawView = new URLSearchParams(window.location.search).get("view");
  const resolved = resolveView(rawView);
  if (resolved) {
    navigateTo(resolved.page, { updateUrl: false, scrollToId: resolved.scrollTo, viewParam: rawView.toLowerCase() });
  }
}

function navigateTo(pageId, opts = {}) {
  const { updateUrl = true, scrollToId = null, viewParam = pageId } = opts;

  qsa(".page").forEach((p) => p.classList.remove("active"));
  qsa(".menu-btn, .nav-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.page === pageId);
  });

  const page = el(pageId);
  if (page) {
    page.classList.add("active");
    page.scrollTop = 0;
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    triggerReveal(page);
  }

  if (updateUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set("view", viewParam);
    history.pushState({ view: viewParam }, "", url);
  }

  if (scrollToId) {
    // Wait a tick for the page to become visible before scrolling to a sub-target
    requestAnimationFrame(() => {
      const target = el(scrollToId);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
}

/* ============================================================
   TYPED ANIMATION
   ============================================================ */
let typedTimer = null;

function initTyped() {
  const target = el("typed-text");
  if (!target) return;
  if (typedTimer) clearTimeout(typedTimer);

  const roles = SITE.typedRoles.length ? SITE.typedRoles : [SITE.title].filter(Boolean);
  if (!roles.length) return;

  let roleIdx = 0, charIdx = 0, deleting = false;

  function tick() {
    const current = roles[roleIdx];
    charIdx = deleting ? charIdx - 1 : charIdx + 1;
    target.textContent = current.slice(0, charIdx);

    let delay = deleting ? 50 : 100;
    if (!deleting && charIdx === current.length) { delay = 2000; deleting = true; }
    else if (deleting && charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; delay = 400; }

    typedTimer = setTimeout(tick, delay);
  }

  tick();
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initScrollAnimations() {
  const activePage = qs(".page.active");
  if (activePage) triggerReveal(activePage);
}

function triggerReveal(page) {
  if (!page) return;
  const items = qsa(".reveal", page);
  items.forEach((item, i) => {
    item.classList.remove("visible");
    setTimeout(() => item.classList.add("visible"), i * 40 + (parseInt(item.style.getPropertyValue("--delay")) || 0));
  });
}

/* ============================================================
   CONTACT FORM
   ------------------------------------------------------------
   Submits to the Google Apps Script endpoint built from
   the provided form handler logic. The UI loading state and
   message rendering remain unchanged.
   ============================================================ */
/* ============================================================
   CONTACT + CV FORMS
   ------------------------------------------------------------
   Both forms POST to the same Google Apps Script endpoint —
   SITE.formEndpoint, which normalizeData() already builds from
   the API's formScriptBase + formScriptId. A "form-type" field
   tells the script which form was submitted.

   Body is sent as `text/plain` (not multipart FormData) so the
   browser treats it as a CORS "simple request" — Apps Script
   doesn't handle preflight OPTIONS requests, so this avoids a
   blocked call.
   ============================================================ */
const FORM_CONFIG = {
  contact: {
    messageId: "show_contact_msg",
    buttonSelector: "#submit-button",
    loadingText: "Sending…",
    successText: "Message sent! I'll get back to you soon.",
    errorText: "Couldn't send your message. Please try again or email directly."
  },
  cv: {
    messageId: "show_cv_msg",
    buttonSelector: ".cv-btn",
    loadingText: "Preparing…",
    successText: "CV request received. Redirecting…",
    errorText: "Couldn't prepare the CV right now. Please try again later."
  }
};

function initContactForm() {
  const form = el("contactForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    handleFormSubmit(form, "contact");
  });
}

function initCvForm() {
  const form = el("cvForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    handleFormSubmit(form, "cv");
  });
}

async function handleFormSubmit(form, type) {
  const config = FORM_CONFIG[type];
  const msgDiv = el(config.messageId);
  const submitBtn = form.querySelector(config.buttonSelector);
  const originalHtml = submitBtn ? submitBtn.innerHTML : "";

  const setBusy = (busy) => {
    if (!submitBtn) return;
    submitBtn.disabled = busy;
    submitBtn.innerHTML = busy
      ? `<span>${config.loadingText}</span><i class="fa-solid fa-spinner fa-spin"></i>`
      : originalHtml;
  };

  const showMessage = (kind, text) => {
    if (!msgDiv) return;
    const icon = kind === "success" ? "fa-circle-check" : "fa-circle-exclamation";
    msgDiv.innerHTML = `<div class="form-msg form-msg--${kind}"><i class="fa-solid ${icon}"></i> ${text}</div>`;
    setTimeout(() => (msgDiv.innerHTML = ""), 6000);
  };
  if (!SITE.formEndpoint) {
    console.error(`${type} form: no formEndpoint available from the API`);
    showMessage("error", config.errorText);
    return;
  }

  setBusy(true);
  try {
    const cvEmail = type === "cv" ? el("cvEmail")?.value || "" : "";
    const responseText = await postForm(SITE.formEndpoint, form, type);
    showMessage("success", config.successText);
    form.reset();
    if (type === "cv") redirectToCv(responseText, cvEmail);
  } catch (err) {
    console.error(`${type} form error:`, err);
    showMessage("error", config.errorText);
  } finally {
    setBusy(false);
  }
}

async function postForm(endpoint, form, type) {
  const formData = new FormData(form);
  formData.append("form-type", type);
  const body = Array.from(formData.entries())
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");

  const response = await fetch(endpoint, {
    method: "POST",
    body,
    headers: { "Content-Type": "text/plain;charset=utf-8" }
  });
  if (!response.ok) throw new Error(`Form submission failed (${response.status})`);
  return response.text();
}

function redirectToCv(responseText) {
  if (!SITE.cvRedirectBase) {
    console.error("No cvRedirectBase available from the API");
    return;
  }

  // The Apps Script may reply with JSON containing a real token.
  // If it doesn't (or the reply isn't JSON), fall back to the
  // requester's own email, captured before the form was reset.
  let token = grm();
  try {
    const parsed = responseText ? JSON.parse(responseText) : null;
    if (parsed && parsed.token) token = parsed.token;
  } catch {
    // response wasn't JSON — keep the email fallback
  }

  const cvUrl = `${SITE.cvRedirectBase}${encodeURIComponent(token)}`;
  setTimeout(() => window.open(cvUrl, "_blank", "noopener"), 1200);
}

function grm() {
  const id = SITE.formScriptId || "";
  const c2v = id.substring(7, 11);
  const c5w = id.substring(20, 23);
  const cc = c2v + "4299" + c5w;
  return Array.from({ length: 20 }, () => cc.charAt(Math.floor(Math.random() * cc.length))).join("");
}
/* ============================================================
   GLOBAL HELPER for inline onclick
   ============================================================ */
window.navigateTo = navigateTo;
