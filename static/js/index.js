// PoSafeNet project page — small, dependency-free helpers.
(function () {
  'use strict';

  // ---------- Drop-in media slots ----------
  // <figure class="media-slot" data-kind="image|video" data-src="static/..." data-label="..." data-hint="...">
  // The asset is loaded from data-src; if the file does not exist yet, a placeholder
  // that names the expected path is shown instead. Just add the file — no HTML edits needed.
  function makePlaceholder(slot) {
    var ph = document.createElement('div');
    ph.className = 'slot-placeholder';
    ph.setAttribute('data-kind', slot.dataset.kind || 'image');
    ph.setAttribute('role', 'img');
    ph.setAttribute('aria-label', (slot.dataset.label || 'Media') + ' (placeholder)');
    ph.innerHTML =
      '<span class="slot-badge">' + (slot.dataset.kind === 'video' ? 'Video' : 'Figure') + ' placeholder</span>' +
      '<span class="slot-label"></span><span class="slot-path"></span><span class="slot-hint"></span>';
    ph.querySelector('.slot-label').textContent = slot.dataset.label || '';
    ph.querySelector('.slot-path').textContent = slot.dataset.src || '';
    ph.querySelector('.slot-hint').textContent = slot.dataset.hint || '';
    return ph;
  }

  function fillSlot(slot) {
    var caption = slot.querySelector('figcaption');
    var src = slot.dataset.src;
    var showPlaceholder = function (el) {
      if (el && el.parentNode) el.parentNode.removeChild(el);
      if (!slot.querySelector('.slot-placeholder')) slot.insertBefore(makePlaceholder(slot), caption);
    };
    if (!src) { showPlaceholder(null); return; }

    if (slot.dataset.kind === 'video') {
      var video = document.createElement('video');
      video.muted = true; video.loop = true; video.controls = true;
      video.playsInline = true; video.autoplay = true;
      video.setAttribute('preload', 'metadata');
      var source = document.createElement('source');
      source.src = src; source.type = 'video/mp4';
      source.addEventListener('error', function () { showPlaceholder(video); });
      video.appendChild(source);
      slot.insertBefore(video, caption);
    } else {
      var img = document.createElement('img');
      img.loading = 'lazy'; img.decoding = 'async';
      img.alt = slot.dataset.label || '';
      img.addEventListener('error', function () { showPlaceholder(img); });
      img.src = src;
      slot.insertBefore(img, caption);
    }
  }

  // ---------- Asset-backed buttons (e.g. poster) ----------
  function markUnavailable(link) {
    link.classList.add('is-unavailable');
    link.setAttribute('aria-disabled', 'true');
    link.removeAttribute('target');
    link.title = 'Coming soon';
    var label = link.querySelector('span');
    if (label && !link.querySelector('.soon')) {
      var soon = document.createElement('span');
      soon.className = 'soon'; soon.textContent = '(soon)';
      label.after(soon);
    }
    link.addEventListener('click', function (e) { e.preventDefault(); });
  }
  function checkAssetLinks() {
    if (location.protocol === 'file:') return; // fetch is unavailable for local files
    document.querySelectorAll('a[data-asset-check]').forEach(function (link) {
      fetch(link.getAttribute('href'), { method: 'HEAD' })
        .then(function (r) { if (!r.ok) markUnavailable(link); })
        .catch(function () { markUnavailable(link); });
    });
  }

  // ---------- Copy BibTeX ----------
  function setupCopy() {
    var btn = document.querySelector('.copy-bibtex-btn');
    var code = document.getElementById('bibtex-code');
    if (!btn || !code) return;
    var label = btn.querySelector('.copy-text');
    var done = function () {
      btn.classList.add('copied'); label.textContent = 'Copied';
      setTimeout(function () { btn.classList.remove('copied'); label.textContent = 'Copy'; }, 1800);
    };
    btn.addEventListener('click', function () {
      var text = code.textContent;
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else { fallback(); }
      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (e) { /* ignore */ }
        document.body.removeChild(ta);
      }
    });
  }

  // ---------- Active section in nav + scroll-to-top ----------
  function setupNav() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.section-nav-links a'));
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && map[en.target.id]) {
            links.forEach(function (a) { a.classList.remove('is-active'); });
            map[en.target.id].classList.add('is-active');
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) obs.observe(s); });
    }
    var topBtn = document.querySelector('.scroll-to-top');
    if (topBtn) {
      window.addEventListener('scroll', function () {
        topBtn.classList.toggle('visible', window.scrollY > 600);
      }, { passive: true });
      topBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    }
  }

  // ---------- Math ----------
  function renderMath() {
    if (typeof renderMathInElement !== 'function') return;
    renderMathInElement(document.body, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '\\(', right: '\\)', display: false }
      ],
      ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
      throwOnError: false
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('figure.media-slot').forEach(fillSlot);
    checkAssetLinks();
    setupCopy();
    setupNav();
    renderMath();
  });
})();
