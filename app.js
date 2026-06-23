/*
 * app.js — reads window.REPOS and paints the index.
 * No framework, no build step. All user data is inserted via
 * textContent (never innerHTML), so it is HTML-escaped by construction.
 */
(function () {
  'use strict';

  var REPOS = Array.isArray(window.REPOS) ? window.REPOS : [];

  /* Each language ("code type") maps to a crayon-toned ink, hue-faithful to
     its usual color but normalised to a mid tone that reads on both the
     manila and chalk backgrounds. This ink IS the per-row highlight. */
  var LANG_COLORS = {
    JavaScript: '#e0a52b', TypeScript: '#2f86d0', Python: '#4577b8',
    Go: '#1fa6bf', Rust: '#c2703a', Ruby: '#d8443f', Java: '#b9772e',
    'C': '#8d8474', 'C++': '#e25b86', 'C#': '#3f9e57', Swift: '#e9683a',
    Kotlin: '#8a6fd0', PHP: '#6d72c4', Shell: '#5aa84a', HTML: '#d9603a',
    CSS: '#8064c0', SCSS: '#cf6597', Svelte: '#e2542f', Vue: '#43a986',
    Dart: '#2aa6b0', Elixir: '#8763b0', Haskell: '#7a6aa8', Lua: '#5a5fc0',
    'Objective-C': '#4a86d0', Scala: '#d24a44', Clojure: '#5ba85f',
    Zig: '#d98a4a', Nix: '#6a78d0', Markdown: '#3f7fc9'
  };

  function langColor(lang) { return LANG_COLORS[lang] || '#9c8f76'; }

  /* most common language among a set of repos (ties -> the newest/first) */
  function dominantLang(items) {
    var counts = {}, best = null, bestN = 0;
    items.forEach(function (r) {
      var l = r.lang;
      if (!l) return;
      counts[l] = (counts[l] || 0) + 1;
      if (counts[l] > bestN) { bestN = counts[l]; best = l; }
    });
    return best;
  }

  function fmt(n) { return (Number(n) || 0).toLocaleString('en-US'); }

  function year(dateStr) { return String(dateStr || '').slice(0, 4); }

  function yearMonth(dateStr) {
    var s = String(dateStr || '');
    return s.length >= 7 ? s.slice(0, 4) + '.' + s.slice(5, 7) : s;
  }

  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  /* Small DOM builder. `text` always goes through textContent (safe). */
  function h(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        if (!Object.prototype.hasOwnProperty.call(attrs, k)) continue;
        var v = attrs[k];
        if (v == null) continue;
        if (k === 'class') node.className = v;
        else if (k === 'text') node.textContent = v;
        else node.setAttribute(k, v);
      }
    }
    if (children != null) {
      var list = Array.isArray(children) ? children : [children];
      for (var i = 0; i < list.length; i++) {
        var c = list[i];
        if (c == null) continue;
        node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
      }
    }
    return node;
  }

  /* ---- Header stats, derived from the data ---- */
  function renderStats() {
    var host = document.getElementById('stats');
    if (!host) return;

    var stars = 0, commits = 0, minYear = Infinity;
    REPOS.forEach(function (r) {
      stars += Number(r.stars) || 0;
      commits += Number(r.commits) || 0;
      var y = parseInt(year(r.date), 10);
      if (y) minYear = Math.min(minYear, y);
    });

    var stats = [
      ['projects', fmt(REPOS.length)],
      ['stars', fmt(stars)],
      ['commits', fmt(commits)],
      ['since', isFinite(minYear) ? String(minYear) : '—']
    ];

    stats.forEach(function (s) {
      host.appendChild(
        h('div', { class: 'stat' }, [
          h('span', { class: 'n', text: s[1] }),
          h('span', { class: 'l', text: s[0] })
        ])
      );
    });
  }

  /* ---- One project row ---- */
  function buildRow(repo, n) {
    var title = String(repo.name || '');
    var org = null;
    var slash = title.indexOf('/');
    if (slash > -1) {
      org = title.slice(0, slash);
      title = title.slice(slash + 1);
    }

    /* title line: optional org badge + linked title with a trailing arrow */
    var titleLine = [];
    if (org) titleLine.push(h('span', { class: 'org', text: org }));
    titleLine.push(
      h('a', {
        class: 'row-title',
        href: repo.url || '#',
        rel: 'noopener',
        target: '_blank'
      }, [title, h('span', { class: 'arr', 'aria-hidden': 'true' }, '↗')])
    );

    var headline = [h('div', { class: 'row-title-line' }, titleLine)];

    var top = h('div', { class: 'row-top' }, [
      h('span', { class: 'row-index', text: pad2(n) }),
      h('div', { class: 'row-headline' }, headline)
    ]);

    var kids = [top];

    if (repo.description) {
      kids.push(h('p', { class: 'row-desc', text: repo.description }));
    }

    /* meta line */
    var meta = [];
    meta.push(h('span', { class: 'date', text: yearMonth(repo.date) }));
    if (Number(repo.stars) >= 1) {
      meta.push(h('span', { class: 'stars', text: '★ ' + fmt(repo.stars) }));
    }
    meta.push(h('span', { class: 'commits' }, [
      h('b', { text: fmt(repo.commits) }), ' commits'
    ]));
    if (repo.lang) {
      meta.push(h('span', { class: 'lang' }, [
        h('i', { class: 'dot' }),
        repo.lang
      ]));
    }
    if (repo.live) {
      meta.push(h('a', {
        class: 'live', href: repo.live, rel: 'noopener', target: '_blank',
        text: 'Live ↗'
      }));
    }
    kids.push(h('div', { class: 'row-meta' }, meta));

    return h('div', { class: 'row reveal', style: '--accent:' + langColor(repo.lang) }, kids);
  }

  /* ---- One year block (sticky giant year + its rows) ---- */
  function buildYearBlock(group, startIndex) {
    var rows = group.items.map(function (repo, i) {
      return buildRow(repo, startIndex + i);
    });

    var rail = h('div', { class: 'year-rail', style: '--accent:' + langColor(dominantLang(group.items)) }, [
      h('div', { class: 'year-num reveal', text: group.year }),
      h('div', { class: 'year-meta' }, [
        h('span', { class: 'count', text: pad2(group.items.length) + ' ' + (group.items.length === 1 ? 'project' : 'projects') }),
        h('span', { class: 'bar', 'aria-hidden': 'true' })
      ])
    ]);

    return h('section', { class: 'year-block' }, [
      rail,
      h('div', { class: 'year-list' }, rows)
    ]);
  }

  /* ---- Render the index (data is assumed already newest-first) ---- */
  function renderTimeline() {
    var root = document.getElementById('timeline');
    if (!root) return;

    /* group consecutive repos by year, preserving order */
    var groups = [];
    var current = null;
    REPOS.forEach(function (repo) {
      var y = year(repo.date);
      if (!current || current.year !== y) {
        current = { year: y, items: [] };
        groups.push(current);
      }
      current.items.push(repo);
    });

    var frag = document.createDocumentFragment();
    var counter = 1;
    groups.forEach(function (g) {
      frag.appendChild(buildYearBlock(g, counter));
      counter += g.items.length;
    });

    if (REPOS.length) {
      frag.appendChild(h('div', { class: 'tl-end reveal', text: '— the beginning · ' + (groups.length ? groups[groups.length - 1].year : '') + ' —' }));
    }

    var siteLang = dominantLang(REPOS);
    if (siteLang) document.documentElement.style.setProperty('--accent', langColor(siteLang));

    root.appendChild(frag);
  }

  /* ---- Reveal on scroll ----
     Primary mechanism is IntersectionObserver. A geometry-based pass on
     load + scroll + resize runs alongside it as a safety net so content
     always appears, even where IO callbacks are unreliable. */
  function observeReveals() {
    var els = [].slice.call(document.querySelectorAll('.reveal'));
    if (!els.length) return;

    var io = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
      els.forEach(function (el) { io.observe(el); });
    }

    var pending = els.slice();
    var ticking = false;

    function check() {
      ticking = false;
      var vh = window.innerHeight || document.documentElement.clientHeight;
      pending = pending.filter(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) {
          el.classList.add('is-visible');
          if (io) io.unobserve(el);
          return false;
        }
        return true;
      });
      if (!pending.length) {
        window.removeEventListener('scroll', onScroll, true);
        window.removeEventListener('resize', onScroll);
      }
    }

    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(check); }
    }

    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll);
    check();
  }

  /* ---- Theme toggle (persisted in localStorage) ---- */
  function initTheme() {
    var btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    var label = btn.querySelector('.tt-label');

    function apply(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      if (label) label.textContent = theme;
      btn.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' theme');
    }

    apply(document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

    btn.addEventListener('click', function () {
      var cur = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      var next = cur === 'dark' ? 'light' : 'dark';
      apply(next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  function start() {
    initTheme();
    renderStats();
    renderTimeline();
    observeReveals();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
