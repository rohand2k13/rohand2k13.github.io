(() => {
  const S = window.SITE || {};
  const main = document.getElementById("main");
  let POSTS = null, NEWS = null;

  // ── helpers ──────────────────────────────────────────────
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmtDate = d => { const x = new Date(d); return isNaN(x) ? esc(d) : x.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); };
  // Note dates may include a time: "2026-11-04 18:30" (read as India time)
  const parseDate = d => {
    if (!d) return new Date(NaN);
    let x = String(d).trim().replace(" ", "T");
    if (/T\d\d:\d\d$/.test(x)) x += ":00";
    if (/T/.test(x) && !/[zZ]|[+-]\d\d:?\d\d$/.test(x)) x += "+05:30";
    return new Date(x);
  };
  const relTime = d => {
    const t = parseDate(d); if (isNaN(t)) return esc(d);
    const hasTime = /\d\d:\d\d/.test(String(d));
    const m = Math.round((Date.now() - t) / 60000);
    if (hasTime && m < 1) return "now";
    if (hasTime && m < 60) return `${m}m`;
    if (hasTime && m < 1440) return `${Math.round(m / 60)}h`;
    const days = Math.floor(m / 1440);
    if (days >= 1 && days < 7) return `${days}d`;
    if (!hasTime && days < 1) return "today";
    return t.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: t.getFullYear() === new Date().getFullYear() ? undefined : "numeric" });
  };
  const ago = iso => {
    if (!iso) return "";
    const m = Math.round((Date.now() - new Date(iso)) / 60000);
    if (m < 1) return "just now"; if (m < 60) return `${m}m ago`;
    const h = Math.round(m / 60); if (h < 24) return `${h}h ago`;
    return `${Math.round(h / 24)}d ago`;
  };
  const getJSON = async url => { try { const r = await fetch(url, { cache: "no-cache" }); return r.ok ? r.json() : null; } catch { return null; } };

  const ICONS = {
    LinkedIn: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.6h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.6 4.77 6v5.46h-4v-4.84c0-1.16-.02-2.64-1.6-2.64-1.62 0-1.86 1.26-1.86 2.56v4.92h-4V9.75Z"/></svg>',
    Instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"/></svg>',
    Facebook: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-7.6h2.6l.4-3h-3V8.5c0-.87.25-1.46 1.5-1.46h1.6V4.36A21 21 0 0 0 14.27 4.2c-2.3 0-3.87 1.4-3.87 3.98v2.22H7.8v3h2.6V21h3.1Z"/></svg>',
    X: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.75 3h3.07l-6.72 7.68L22 21h-6.19l-4.85-6.34L5.4 21H2.33l7.19-8.21L2 3h6.35l4.38 5.79L17.75 3Zm-1.08 16.2h1.7L7.4 4.73H5.58l11.09 14.47Z"/></svg>',
    GitHub: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2.2Z"/></svg>',
    home: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><path d="M3 9.2 10 3.5l7 5.7V16a1 1 0 0 1-1 1h-3.6v-4.6H7.6V17H4a1 1 0 0 1-1-1V9.2Z"/></svg>',
    work: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><rect x="2.8" y="6" width="14.4" height="10.5" rx="1.8"/><path d="M7.2 6V4.6c0-.6.5-1.1 1.1-1.1h3.4c.6 0 1.1.5 1.1 1.1V6M2.8 10.6h14.4"/></svg>',
    open: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 4H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3M11 4h5v5M16 4l-7 7"/></svg>',
    share: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 3v9.5M6.5 6.5 10 3l3.5 3.5M4 11.5v4a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-4"/></svg>',
    Gmail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/></svg>',
    arrow: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  const socials = S.socials || [];
  const emails = S.emails || [];
  const inboxUrl = a => `https://mail.google.com/mail/u/?authuser=${encodeURIComponent(a)}`;

  // ── static bits ──────────────────────────────────────────
  document.getElementById("brand-name").textContent = S.name || "Me";
  document.getElementById("footer-name").textContent = `© ${new Date().getFullYear()} ${S.name || ""}`;
  document.getElementById("header-icons").innerHTML =
    socials.map(s => `<a class="icon-btn" href="${esc(s.url)}" target="_blank" rel="noopener" aria-label="${esc(s.name)}" title="${esc(s.name)}">${ICONS[s.name] || ICONS.arrow}</a>`).join("") +
    (S.showGmailShortcut && emails[0] ? `<a class="icon-btn" href="${inboxUrl(emails[0].address)}" target="_blank" rel="noopener" aria-label="Open Gmail" title="Open Gmail">${ICONS.Gmail}</a>` : "");
  addEventListener("scroll", () => document.querySelector(".site-header").classList.toggle("scrolled", scrollY > 8), { passive: true });

  // ── pieces ───────────────────────────────────────────────
  const shortcutsHTML = () => {
    const soc = socials.filter(s => s.tile !== false).map(s => `
      <a class="shortcut${s.featured ? " featured" : ""}" href="${esc(s.follow || s.url)}" target="_blank" rel="noopener" aria-label="Follow on ${esc(s.name)}">
        <span class="glyph tint-${esc(s.name.toLowerCase())}">${ICONS[s.name] || ICONS.arrow}</span>
        <span><strong>${esc(s.name)}</strong><small>${s.featured ? "Most active" : "@" + esc(S.handle || "")}</small></span>
        <span class="follow-pill">Follow</span>
      </a>`).join("");
    const mail = !S.showGmailShortcut ? "" : emails.map(e => `
      <a class="shortcut" href="${inboxUrl(e.address)}" target="_blank" rel="noopener">
        <span class="glyph tint-gmail">${ICONS.Gmail}</span>
        <span><strong>${esc(e.label || "Gmail")}</strong><small>Open inbox</small></span>
        <span class="arrow">${ICONS.arrow}</span>
      </a>`).join("");
    return `<div class="shortcuts">${soc}${mail}</div>`;
  };

  const initials = (S.name || "?").split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase();
  const avatarHTML = cls => S.avatar
    ? `<img class="${cls}" src="${esc(S.avatar)}" alt="" width="44" height="44">`
    : `<span class="${cls} initials" aria-hidden="true">${esc(initials)}</span>`;
  const postUrl = slug => `${location.origin}${location.pathname}#/post/${encodeURIComponent(slug)}`;

  const noteCard = (p, open) => `
    <article class="feed-post${open ? " open" : ""}" aria-label="Note from ${fmtDate(p.date)}">
      ${avatarHTML("feed-avatar")}
      <div class="feed-main">
        <header class="feed-head">
          <strong>${esc(S.name)}</strong>
          <span>@${esc(S.handle || "")} · <time datetime="${esc(p.date)}" title="${fmtDate(p.date)}">${relTime(p.date)}</time></span>
        </header>
        <div class="feed-body">${p.html}</div>
        <footer class="feed-actions">
          ${open ? "" : `<a class="act" href="#/post/${encodeURIComponent(p.slug)}">${ICONS.open}<span>Open</span></a>`}
          <button type="button" class="act" data-share="${esc(p.slug)}" data-title="${esc(p.title)}">${ICONS.share}<span>Share</span></button>
        </footer>
      </div>
    </article>`;

  async function sharePost(btn) {
    const url = postUrl(btn.dataset.share), label = btn.querySelector("span");
    try {
      if (navigator.share) { await navigator.share({ title: btn.dataset.title, url }); return; }
      await navigator.clipboard.writeText(url);
      label.textContent = "Link copied";
    } catch { label.textContent = "Copy failed"; }
    setTimeout(() => (label.textContent = "Share"), 1800);
  }
  document.addEventListener("click", e => { const b = e.target.closest("[data-share]"); if (b) sharePost(b); });

  const postCard = p => p.type === "short"
    ? noteCard(p)
    : `<a class="post-card" href="#/post/${encodeURIComponent(p.slug)}">
         <div class="meta"><span class="kind">Essay</span><span>${fmtDate(p.date)}</span><span>${p.minutes} min read</span></div>
         <h3>${esc(p.title)}</h3><p>${esc(p.summary)}</p></a>`;

  const newsHTML = () => `
    <section class="news" id="news" aria-labelledby="news-h">
      <div class="news-top">
        <h2 id="news-h">Today's briefing</h2>
        <span class="updated" id="news-updated" aria-live="polite"></span>
        <button type="button" class="refresh" id="news-refresh" aria-label="Refresh headlines" title="Refresh headlines">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9M13.5 2.5v3h-3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
      <div class="tabs" role="tablist" aria-label="News topics" id="news-tabs"></div>
      <div id="news-list" role="tabpanel"></div>
    </section>`;

  // ── live news: each tab fetches its own feed when opened ──
  // Google News doesn't allow browsers to read its feeds directly, so we go through
  // free public relays. If they're down, the tab shows the copy saved at the last hourly build.
  const LIVE = {};                    // tab id → { items, at }
  const LIVE_TTL = 10 * 60 * 1000;    // re-fetch a tab after 10 minutes
  let currentTab = null;

  const fetchT = async (url, ms = 7000) => {
    const c = new AbortController(); const t = setTimeout(() => c.abort(), ms);
    try { const r = await fetch(url, { signal: c.signal }); if (!r.ok) throw new Error(r.status); return r; }
    finally { clearTimeout(t); }
  };
  const cleanTitle = (title, source) => source && title.endsWith(` - ${source}`) ? title.slice(0, -(source.length + 3)) : title;

  async function viaAllOrigins(feed) {
    const r = await fetchT(`https://api.allorigins.win/raw?url=${encodeURIComponent(feed)}`);
    const doc = new DOMParser().parseFromString(await r.text(), "text/xml");
    const items = [...doc.querySelectorAll("item")].map(it => {
      const g = n => it.querySelector(n)?.textContent?.trim() || "";
      const source = g("source"), d = new Date(g("pubDate"));
      return { title: cleanTitle(g("title"), source), link: g("link"), source, published: isNaN(d) ? null : d.toISOString() };
    });
    if (!items.length) throw new Error("empty");
    return items;
  }
  async function viaRss2Json(feed) {
    const r = await fetchT(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed)}`);
    const j = await r.json();
    if (j.status !== "ok" || !j.items?.length) throw new Error("empty");
    return j.items.map(it => {
      const m = it.title.match(/^(.*) - ([^-]+)$/);
      const d = new Date((it.pubDate || "").replace(" ", "T") + "Z");
      return { title: m ? m[1] : it.title, link: it.link, source: m ? m[2] : (it.author || ""), published: isNaN(d) ? null : d.toISOString() };
    });
  }
  async function liveFetch(tab, force) {
    const hit = LIVE[tab.id];
    if (!force && hit && Date.now() - hit.at < LIVE_TTL) return hit.items;
    if (!tab.url) return null;
    for (const fn of [viaAllOrigins, viaRss2Json]) {
      try {
        const seen = new Set();
        const items = (await fn(tab.url)).filter(i => {
          const k = i.title.toLowerCase().slice(0, 60);
          if (!i.title || seen.has(k)) return false; seen.add(k); return true;
        }).slice(0, NEWS.perTab || 8);
        LIVE[tab.id] = { items, at: Date.now() };
        return items;
      } catch { /* try the next relay */ }
    }
    return null;
  }

  function setStatus(text, live) {
    const el = document.getElementById("news-updated");
    if (!el) return;
    el.textContent = text;
    el.classList.toggle("live", !!live);
  }

  function mountNews(active, force) {
    const tabsEl = document.getElementById("news-tabs");
    if (!tabsEl) return;
    const tabs = NEWS?.tabs || [];
    if (!tabs.length) {
      tabsEl.remove();
      document.getElementById("news-list").innerHTML = `<p class="news-empty">Headlines appear here once the site is live — they refresh automatically every hour.</p>`;
      return;
    }
    const cur = active || currentTab || tabs[0].id;
    currentTab = cur;
    tabsEl.innerHTML = "";
    tabs.forEach(t => {
      const b = document.createElement("button");
      b.type = "button"; b.role = "tab"; b.textContent = t.label;
      b.setAttribute("aria-selected", t.id === cur);
      b.onclick = () => mountNews(t.id);
      tabsEl.appendChild(b);
    });
    const tab = tabs.find(t => t.id === cur);
    const hit = LIVE[tab.id];
    if (hit && !force) {
      renderItems(hit.items);
      setStatus(`Live · ${ago(new Date(hit.at).toISOString())}`, true);
      if (Date.now() - hit.at < LIVE_TTL) return;
    } else {
      renderItems(tab.items, true);
      setStatus("Fetching latest…");
    }
    const refresh = document.getElementById("news-refresh");
    refresh?.setAttribute("aria-busy", "true");
    liveFetch(tab, force).then(items => {
      refresh?.removeAttribute("aria-busy");
      if (currentTab !== tab.id || !document.getElementById("news-list")) return; // user moved on
      if (items?.length) { renderItems(items); setStatus("Live · just now", true); }
      else setStatus(NEWS.updated ? `Saved copy · ${ago(NEWS.updated)}` : "Couldn't reach the news right now");
    });
  }

  function renderItems(items, loading) {
    const list = document.getElementById("news-list");
    list.innerHTML = "";
    if (!items.length) {
      list.innerHTML = `<p class="news-empty">${loading ? "Loading headlines…" : "No fresh headlines in this topic right now."}</p>`;
      return;
    }
    const ol = document.createElement("ol");
    items.slice(0, 6).forEach(it => {
      const li = document.createElement("li"), a = document.createElement("a");
      a.href = it.link; a.target = "_blank"; a.rel = "noopener";
      const h = document.createElement("span"); h.className = "h"; h.textContent = it.title;
      const s = document.createElement("span"); s.className = "s"; s.textContent = [it.source, ago(it.published)].filter(Boolean).join(" · ");
      a.append(h, s); li.appendChild(a); ol.appendChild(li);
    });
    list.appendChild(ol);
  }

  // ── followers (GitHub is the only network that shares its follower list publicly) ──
  let FOLLOWERS = null;
  async function loadFollowers() {
    if (FOLLOWERS) return FOLLOWERS;
    FOLLOWERS = await getJSON("data/followers.json");
    if (!FOLLOWERS && S.githubUser) {                 // no saved copy: ask GitHub directly
      try {
        const u = S.githubUser;
        const [info, list] = await Promise.all([
          fetchT(`https://api.github.com/users/${u}`).then(r => r.json()),
          fetchT(`https://api.github.com/users/${u}/followers?per_page=60`).then(r => r.json())
        ]);
        FOLLOWERS = { user: u, count: info.followers ?? list.length, people: list.map(f => ({ login: f.login, avatar: f.avatar_url, url: f.html_url })) };
      } catch { FOLLOWERS = null; }
    }
    return FOLLOWERS;
  }
  async function mountFollowers() {
    const box = document.getElementById("followers");
    if (!box) return;
    const f = await loadFollowers();
    const user = (f && f.user) || S.githubUser;
    const follow = `<a class="btn solid small block" href="https://github.com/${encodeURIComponent(user)}" target="_blank" rel="noopener">${ICONS.GitHub} Follow on GitHub</a>`;
    if (!f) { box.innerHTML = `<div class="followers-head"><strong>People who follow me</strong><span>Shown from GitHub, where follower lists are public.</span></div>${follow}`; return; }
    const people = f.people || [];
    const shown = people.slice(0, 24);
    box.innerHTML = `
      <div class="followers-head">
        <strong>${f.count} ${f.count === 1 ? "follower" : "followers"} on GitHub</strong>
        <span>${people.length ? "Follow me there to appear here." : "No followers yet. Be the first."}</span>
      </div>
      ${shown.length ? `<ul class="faces">${shown.map(p => `
        <li><a href="${esc(p.url)}" target="_blank" rel="noopener" title="@${esc(p.login)}" aria-label="@${esc(p.login)}">
          <img src="${esc(p.avatar)}&s=96" alt="" width="36" height="36" loading="lazy"></a></li>`).join("")}
        ${f.count > shown.length ? `<li class="more"><a href="https://github.com/${encodeURIComponent(user)}?tab=followers" target="_blank" rel="noopener">+${f.count - shown.length}</a></li>` : ""}
      </ul>` : ""}
      ${follow}`;
  }

  // ── views ────────────────────────────────────────────────
  function viewHome(anchor) {
    const longs = POSTS.filter(p => p.type === "long").slice(0, 3);
    const shorts = POSTS.filter(p => p.type === "short").slice(0, 4);
    const placesHTML = (S.places || []).length ? `<ul class="places" aria-label="Where I am">${S.places.map(pl => `
          <li class="place ${pl.kind === "work" ? "work" : "home"}" title="${pl.kind === "work" ? "Work" : "Home"}: ${esc(pl.city)}">
            ${pl.kind === "work" ? ICONS.work : ICONS.home}
            <strong>${esc(pl.code)}</strong><span>${esc(pl.city)}</span>
            <em>${pl.kind === "work" ? "Work" : "Home"}</em>
          </li>`).join("")}</ul>` : "";
    main.innerHTML = `
      <div class="wrap bento">
        <section class="card b-hero" aria-label="Introduction">
          <p class="eyebrow accent">${esc(S.role)}${S.company ? " · " + esc(S.company) : ""}</p>
          <h1>${esc(S.headline)}</h1>
          <p class="hero-intro">${esc(S.intro)}</p>
          ${placesHTML}
        </section>

        <section class="card b-follow" id="connect" aria-labelledby="connect-h">
          <div class="card-head"><h2 id="connect-h">Follow me</h2><span class="handle">@${esc(S.handle || "")}</span></div>
          ${shortcutsHTML()}
          ${S.githubUser ? `<div class="followers" id="followers" aria-live="polite"></div>` : ""}
        </section>

        <section class="card b-about" id="about" aria-labelledby="about-h">
          <p class="eyebrow accent" id="about-h">About</p>
          ${(S.about || []).map((l, i) => `<p class="about-line${i ? " sub" : ""}">${esc(l)}</p>`).join("")}
        </section>

        ${(S.beyond || []).length ? `
        <section class="card b-beyond" aria-label="Beyond work">
          <p class="eyebrow">Beyond work</p>
          <ul class="chips">${S.beyond.map((b, i) => `<li class="chip t${i % 5}">${esc(b)}</li>`).join("")}</ul>
        </section>` : ""}

        <section class="card b-notes" id="notes" aria-labelledby="notes-h">
          <div class="card-head"><h2 id="notes-h">Notes</h2><a class="link" href="#/notes">All notes →</a></div>
          <div class="feed">
            ${shorts.map(p => noteCard(p)).join("") || `<p class="empty">No notes yet.</p>`}
          </div>
        </section>

        <section class="card b-blog" aria-labelledby="blog-h">
          <div class="card-head"><h2 id="blog-h">Essays</h2><a class="link" href="#/blog">All posts →</a></div>
          <div class="post-list">
            ${longs.map(postCard).join("") || `<p class="empty">No essays yet. Add one to the posts folder.</p>`}
          </div>
        </section>



        <div class="b-news">${newsHTML()}</div>
      </div>

      ${emails.filter(e => e.showPublicly).map(e => `
        <div class="wrap"><div class="mail-row">
          <div class="who"><strong>Write to me</strong><small>${esc(e.address)}</small></div>
          <a class="btn" href="https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(e.address)}" target="_blank" rel="noopener">Compose in Gmail</a>
          <a class="btn solid" href="mailto:${esc(e.address)}">Email me</a>
        </div></div>`).join("")}`;
    mountNews();
    mountFollowers();
    document.getElementById("news-refresh").onclick = () => mountNews(currentTab, true);
    if (anchor) document.getElementById(anchor)?.scrollIntoView();
    else scrollTo(0, 0);
  }

  function viewBlog(filter = "all") {
    const list = POSTS.filter(p => filter === "all" || p.type === filter);
    main.innerHTML = `
      <section class="wrap section">
        <div class="section-head">
          <div><p class="eyebrow accent">Blog</p><h2>Essays &amp; notes</h2></div>
          <div class="filters" role="group" aria-label="Filter posts">
            <button type="button" data-f="all" aria-pressed="${filter === "all"}">All</button>
            <button type="button" data-f="long" aria-pressed="${filter === "long"}">Essays</button>
            <button type="button" data-f="short" aria-pressed="${filter === "short"}">Notes</button>
          </div>
        </div>
        <div class="post-list">${list.map(postCard).join("") || `<p class="empty">Nothing here yet.</p>`}</div>
      </section>`;
    main.querySelectorAll("[data-f]").forEach(b => b.onclick = () => viewBlog(b.dataset.f));
  }

  function viewPost(slug) {
    const p = POSTS.find(x => x.slug === slug);
    if (!p) { main.innerHTML = `<section class="wrap article"><a class="back" href="#/blog">← All posts</a><h1>Post not found</h1></section>`; return; }
    document.title = `${p.title} — ${S.name}`;
    if (p.type === "short") {
      main.innerHTML = `
      <div class="wrap"><div class="article note-page">
        <a class="back" href="#/notes">← All notes</a>
        ${noteCard(p, true)}
      </div></div>`;
      scrollTo(0, 0); return;
    }
    main.innerHTML = `
      <article class="wrap"><div class="article">
        <a class="back" href="#/blog">← All posts</a>
        <div class="meta" style="margin-top:18px"><span class="kind">${p.type === "short" ? "Note" : "Essay"}</span><span>${fmtDate(p.date)}</span><span>${p.minutes} min read</span>${p.tags.map(t => `<span>#${esc(t)}</span>`).join("")}</div>
        <h1>${esc(p.title)}</h1>
        ${p.cover ? `<img class="cover" src="${esc(p.cover)}" alt="">` : ""}
        <div class="prose">${p.html}</div>
      </div></article>`;
    scrollTo(0, 0);
  }

  // ── router ───────────────────────────────────────────────
  function route() {
    const h = location.hash || "#/";
    document.title = `${S.name} — engineer, traveller, writer`;
    let r = "home";
    if (h.startsWith("#/post/")) { r = "blog"; viewPost(decodeURIComponent(h.slice(7))); }
    else if (h.startsWith("#/notes")) { r = "blog"; viewBlog("short"); }
    else if (h.startsWith("#/blog")) { r = "blog"; viewBlog(); }
    else if (h.startsWith("#/") || h === "") viewHome();
    else { r = h.slice(1); viewHome(h.slice(1)); }       // #news, #connect
    document.querySelectorAll(".nav a").forEach(a => a.classList.toggle("active", a.dataset.route === r));
    main.focus({ preventScroll: true });
  }

  Promise.all([getJSON("data/posts.json"), getJSON("data/news.json")]).then(async ([p, n]) => {
    if (!n || !n.tabs?.length) {            // no saved copy yet: build tabs from the feed list and fetch live
      const f = await getJSON("scripts/feeds.json");
      if (f?.tabs) n = { updated: null, perTab: f.perTab || 8, tabs: f.tabs.map(t => ({
        id: t.id, label: t.label, items: [],
        url: t.url || `https://news.google.com/rss/search?q=${encodeURIComponent(t.query)}&hl=en-IN&gl=IN&ceid=IN:en`
      })) };
    }
    POSTS = p || []; NEWS = n;
    addEventListener("hashchange", route);
    route();
  });
})();
