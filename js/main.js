/* ===== Aurelia Estates – main.js ===== */
(function () {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const page = document.body.dataset.page || 'home';
  const hasGsap = !!window.gsap;
  const fmt = n => '$' + n.toLocaleString('en-US');
  const priceOf = p => p.rent ? fmt(p.price) + ' <small style="font-size:.9rem;color:var(--mute)">/ month</small>' : fmt(p.price);

  /* ---------- layout injection ---------- */
  const links = [
    ['index.html', 'Home', 'home'], ['about.html', 'About', 'about'], ['properties.html', 'Properties', 'properties'],
    ['services.html', 'Services', 'services'], ['agents.html', 'Agents', 'agents'], ['blog.html', 'Journal', 'blog'], ['contact.html', 'Contact', 'contact']
  ];
  const activeKey = page === 'details' ? 'properties' : page;

  document.body.insertAdjacentHTML('afterbegin', `
    <div id="loader"><div class="logo-big">AURELIA</div><div class="bar"><i></i></div></div>
    <div id="cursor"></div>
    <header class="nav"><div class="wrap">
      <a href="index.html" class="logo"><i class="fa-solid fa-gem"></i>AURELIA<span>.</span></a>
      <nav class="menu">${links.map(l => `<a href="${l[0]}" class="${l[2] === activeKey ? 'active' : ''}">${l[1]}</a>`).join('')}</nav>
      <a href="contact.html" class="btn">Book a Viewing <i class="fa-solid fa-arrow-right"></i></a>
      <button class="burger" aria-label="Menu"><i class="fa-solid fa-bars"></i></button>
    </div></header>
    <button id="totop" aria-label="Back to top"><i class="fa-solid fa-arrow-up"></i></button>`);

  const scrollEl = $('#scroll');
  scrollEl.insertAdjacentHTML('beforeend', `
    <footer class="foot"><div class="wrap">
      <div class="fgrid">
        <div><a href="index.html" class="logo"><i class="fa-solid fa-gem"></i>AURELIA<span>.</span></a>
          <p style="margin-top:22px;max-width:340px">Curating the world’s most exceptional residences for discerning clients since 2004.</p>
          <div class="soc">
            <a href="#"><i class="fa-brands fa-instagram"></i></a><a href="#"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="#"><i class="fa-brands fa-linkedin-in"></i></a><a href="#"><i class="fa-brands fa-x-twitter"></i></a>
          </div></div>
        <div><h4>Explore</h4><ul>${links.map(l => `<li><a href="${l[0]}">${l[1]}</a></li>`).join('')}</ul></div>
        <div><h4>Contact</h4><ul>
          <li><a href="#"><i class="fa-solid fa-location-dot" style="color:var(--gold);margin-right:10px"></i>720 Fifth Avenue, New York</a></li>
          <li><a href="tel:+12125550188"><i class="fa-solid fa-phone" style="color:var(--gold);margin-right:10px"></i>+1 212 555 0188</a></li>
          <li><a href="mailto:hello@aurelia-estates.com"><i class="fa-solid fa-envelope" style="color:var(--gold);margin-right:10px"></i>hello@aurelia-estates.com</a></li></ul></div>
        <div><h4>Private Newsletter</h4><p>Off-market listings, delivered first.</p>
          <form class="nl"><input type="email" placeholder="Your email" required><button aria-label="Subscribe"><i class="fa-solid fa-paper-plane"></i></button></form></div>
      </div>
      <div class="copy"><span>© 2026 Aurelia Estates. All rights reserved.</span><span>Privacy · Terms · Cookies</span></div>
    </div></footer>`);

  /* ---------- data renderers ---------- */
  const card = p => `
    <a class="card" href="property-details.html?id=${p.id}" data-reveal>
      <div class="im"><img src="${p.img}" alt="${p.title}" loading="lazy" onerror="this.style.opacity=.15"><span class="tag ${p.rent ? 'rent' : ''}">${p.status}</span></div>
      <div class="info">
        <div class="loc"><i class="fa-solid fa-location-dot"></i>${p.location}</div>
        <h3>${p.title}</h3>
        <div class="price">${priceOf(p)}</div>
        <div class="meta"><span><i class="fa-solid fa-bed"></i>${p.beds} Beds</span><span><i class="fa-solid fa-bath"></i>${p.baths} Baths</span><span><i class="fa-solid fa-vector-square"></i>${p.area.toLocaleString()} sqft</span></div>
      </div></a>`;

  $$('[data-properties]').forEach(box => {
    let list = PROPERTIES.slice();
    if (box.dataset.properties === 'featured') list = list.filter(p => p.featured).slice(0, 6);
    if (box.dataset.properties === 'related') {
      const id = +new URLSearchParams(location.search).get('id') || 1;
      list = list.filter(p => p.id !== id).slice(0, 3);
    }
    if (box.dataset.properties === 'all') return; // handled below
    box.innerHTML = list.map(card).join('');
  });

  const allBox = $('[data-properties="all"]');
  if (allBox) {
    const params = new URLSearchParams(location.search);
    const state = { type: params.get('type') || 'All', status: params.get('status') || 'All', q: (params.get('q') || '').toLowerCase(), max: +params.get('max') || 0, sort: 'new' };
    const draw = () => {
      let l = PROPERTIES.filter(p =>
        (state.type === 'All' || p.type === state.type) &&
        (state.status === 'All' || p.status === state.status) &&
        (!state.q || (p.title + p.location).toLowerCase().includes(state.q)) &&
        (!state.max || (p.rent ? p.price * 12 : p.price) <= state.max));
      if (state.sort === 'low') l.sort((a, b) => a.price - b.price);
      if (state.sort === 'high') l.sort((a, b) => b.price - a.price);
      allBox.innerHTML = l.length ? l.map(card).join('') : '<div class="empty">No properties match your search.</div>';
      const cnt = $('#count'); if (cnt) cnt.textContent = l.length + ' properties';
      reveal(allBox);
      window.ScrollTrigger && ScrollTrigger.refresh();
    };
    const types = ['All', ...new Set(PROPERTIES.map(p => p.type))];
    $('#pills').innerHTML = types.map(t => `<button class="pill ${t === state.type ? 'on' : ''}" data-t="${t}">${t}</button>`).join('');
    $('#pills').addEventListener('click', e => {
      const b = e.target.closest('.pill'); if (!b) return;
      $$('.pill').forEach(x => x.classList.remove('on')); b.classList.add('on'); state.type = b.dataset.t; draw();
    });
    const s = $('#sort'); if (s) s.addEventListener('change', () => { state.sort = s.value; draw(); });
    const sq = $('#q'); if (sq) { sq.value = params.get('q') || ''; sq.addEventListener('input', () => { state.q = sq.value.toLowerCase(); draw(); }); }
    draw();
  }

  const ag = $('[data-agents]');
  if (ag) ag.innerHTML = AGENTS.slice(0, +ag.dataset.agents || 4).map(a => `
    <div class="agent" data-reveal><div class="im"><img src="${a.img}" alt="${a.name}" loading="lazy" onerror="this.style.opacity=.15">
      <div class="soc"><a href="#"><i class="fa-brands fa-linkedin-in"></i></a><a href="#"><i class="fa-brands fa-instagram"></i></a><a href="#"><i class="fa-solid fa-envelope"></i></a></div></div>
      <h3>${a.name}</h3><span>${a.role}</span><p>${a.deals}</p></div>`).join('');

  const bl = $('[data-posts]');
  if (bl) bl.innerHTML = POSTS.slice(0, +bl.dataset.posts || 3).map(p => `
    <a href="#" class="post" data-reveal><div class="im"><img src="${p.img}" alt="${p.title}" loading="lazy" onerror="this.style.opacity=.15"></div>
      <div class="d">${p.cat} · ${p.date}</div><h3>${p.title}</h3><span class="more">Read article</span></a>`).join('');

  /* property details page */
  const dr = $('#detail-root');
  if (dr) {
    const id = +new URLSearchParams(location.search).get('id') || 1;
    const p = PROPERTIES.find(x => x.id === id) || PROPERTIES[0];
    document.title = p.title + ' – Aurelia Estates';
    $('#d-title').textContent = p.title;
    $('#d-crumb').textContent = p.title;
    $('#d-hero').style.backgroundImage = `url(${p.img})`;
    dr.innerHTML = `
      <div class="gallery" data-reveal>${p.gallery.map(g => `<div><img src="${g}" alt="${p.title}" onerror="this.style.opacity=.15"></div>`).join('')}</div>
      <div class="detail">
        <div data-reveal>
          <div class="eyebrow">${p.status} · ${p.type}</div>
          <h2>${p.title}</h2>
          <div class="loc" style="margin-top:14px;color:var(--mute)"><i class="fa-solid fa-location-dot" style="color:var(--gold);margin-right:8px"></i>${p.location}</div>
          <div class="facts">
            <div><i class="fa-solid fa-bed"></i><b>${p.beds}</b><span>Bedrooms</span></div>
            <div><i class="fa-solid fa-bath"></i><b>${p.baths}</b><span>Bathrooms</span></div>
            <div><i class="fa-solid fa-vector-square"></i><b>${p.area.toLocaleString()}</b><span>Sq Ft</span></div>
            <div><i class="fa-solid fa-car"></i><b>${Math.max(2, Math.round(p.beds / 2))}</b><span>Garage</span></div>
          </div>
          <h3>Description</h3><p style="margin-top:14px">${p.desc} Every detail has been curated to the highest standard, with materials sourced from the finest ateliers and an uncompromising focus on privacy and light.</p>
          <h3 style="margin-top:44px">Amenities</h3>
          <ul class="amen">${['Infinity Pool', 'Private Cinema', 'Wine Cellar', 'Smart Home System', 'Spa & Sauna', '24/7 Security', 'Chef’s Kitchen', 'Landscaped Gardens'].map(a => `<li><i class="fa-solid fa-circle-check"></i>${a}</li>`).join('')}</ul>
        </div>
        <aside class="side" data-reveal>
          <div class="price">${priceOf(p)}</div>
          <form class="form contact-form">
            <div class="field"><input required placeholder="Full name"></div>
            <div class="field"><input type="email" required placeholder="Email address"></div>
            <div class="field"><input placeholder="Phone"></div>
            <div class="field"><textarea placeholder="I’d like to schedule a private viewing of ${p.title}."></textarea></div>
            <button class="btn solid" type="submit">Request Viewing <i class="fa-solid fa-arrow-right"></i></button>
            <div class="ok">Thank you — our advisor will contact you shortly.</div>
          </form>
        </aside>
      </div>`;
    const lb = document.createElement('div'); lb.id = 'lightbox'; lb.innerHTML = '<button aria-label="Close"><i class="fa-solid fa-xmark"></i></button><img alt="">';
    document.body.appendChild(lb);
    dr.addEventListener('click', e => { const d = e.target.closest('.gallery div'); if (!d) return; $('img', lb).src = $('img', d).src; lb.classList.add('on'); });
    lb.addEventListener('click', () => lb.classList.remove('on'));
  }

  /* ---------- forms ---------- */
  document.addEventListener('submit', e => {
    const f = e.target;
    if (f.classList.contains('contact-form')) {
      e.preventDefault(); const ok = $('.ok', f); if (ok) ok.style.display = 'block'; f.reset();
    }
    if (f.classList.contains('nl')) { e.preventDefault(); f.innerHTML = '<p style="padding:14px">Thank you for subscribing.</p>'; }
  });

  /* ---------- testimonials ---------- */
  const slides = $$('.testi .slide');
  if (slides.length) {
    const dots = $('.dots'); let cur = 0;
    dots.innerHTML = slides.map((_, i) => `<button data-i="${i}"></button>`).join('');
    const show = i => { cur = i; slides.forEach((s, k) => s.classList.toggle('on', k === i)); $$('button', dots).forEach((b, k) => b.classList.toggle('on', k === i));
      if (window.gsap) gsap.fromTo(slides[i], { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .9, ease: 'power3.out' }); };
    dots.addEventListener('click', e => { const b = e.target.closest('button'); if (b) show(+b.dataset.i); });
    show(0); setInterval(() => show((cur + 1) % slides.length), 6500);
  }

  /* ---------- mobile menu ---------- */
  const menu = $('.menu'), burger = $('.burger');
  burger.addEventListener('click', () => {
    menu.classList.toggle('open');
    burger.innerHTML = menu.classList.contains('open') ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });

  /* ---------- cursor ---------- */
  const cur = $('#cursor');
  let mx = 0, my = 0, cx = 0, cy = 0;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function loop() { cx += (mx - cx) * .18; cy += (my - cy) * .18; cur.style.left = cx + 'px'; cur.style.top = cy + 'px'; requestAnimationFrame(loop); })();
  document.addEventListener('mouseover', e => cur.classList.toggle('big', !!e.target.closest('a,button,.card,.gallery div,.pill')));

  /* ---------- smooth scrollbar + ScrollTrigger ---------- */
  let sb = null;
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  if (window.Scrollbar && hasGsap) {
    sb = Scrollbar.init(scrollEl, { damping: 0.075, thumbMinSize: 30, renderByPixels: true, alwaysShowTracks: false });
    ScrollTrigger.scrollerProxy(scrollEl, {
      scrollTop(v) { if (arguments.length) sb.scrollTop = v; return sb.scrollTop; },
      getBoundingClientRect() { return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }; }
    });
    sb.addListener(ScrollTrigger.update);
    ScrollTrigger.defaults({ scroller: scrollEl });
  } else {
    document.body.classList.add('no-sb');
    scrollEl.style.cssText = 'position:static;overflow:visible';
    document.documentElement.style.overflow = 'auto';
  }

  const getY = () => sb ? sb.scrollTop : window.scrollY;
  const header = $('header.nav'), totop = $('#totop');
  let lastY = 0;
  const onScroll = () => {
    const y = getY();
    header.classList.toggle('scrolled', y > 60);
    header.classList.toggle('hide', y > lastY && y > 500);
    totop.classList.toggle('show', y > 700);
    lastY = y;
  };
  sb ? sb.addListener(onScroll) : window.addEventListener('scroll', onScroll);
  totop.addEventListener('click', () => sb ? sb.scrollTo(0, 0, 1400) : window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- animations ---------- */
  function splitLines(el) {
    // splits on <br> into masked lines; keeps <em>
    const parts = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = parts.map(t => `<span class="line"><span>${t.trim()}</span></span>`).join('');
  }
  function reveal(root = document) {
    if (!hasGsap) return;
    $$('[data-reveal]:not(.done)', root).forEach(el => {
      el.classList.add('done');
      gsap.fromTo(el, { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', delay: 0,
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' } });
    });
  }

  function intro() {
    if (!hasGsap) { $('#loader').remove(); return; }
    const tl = gsap.timeline();
    tl.to('#loader .bar i', { width: '100%', duration: 1.1, ease: 'power2.inOut' })
      .to('#loader', { yPercent: -100, duration: 1, ease: 'power4.inOut' })
      .set('#loader', { display: 'none' })
      .from('header.nav', { y: -80, opacity: 0, duration: .9, ease: 'power3.out' }, '-=.4')
      .to('.hero .line>span, .page-hero .line>span', { y: 0, duration: 1.3, ease: 'power4.out', stagger: .14 }, '-=.8')
      .from('.hero p, .hero .actions, .page-hero .crumbs, .hero .eyebrow, .page-hero .eyebrow', { y: 30, opacity: 0, duration: 1, stagger: .12, ease: 'power3.out' }, '-=.9')
      .from('.scroll-hint', { opacity: 0, duration: 1 }, '-=.5');
  }

  if (hasGsap) {
    $$('.split-text').forEach(splitLines);
    // headings in sections: reveal lines on scroll
    $$('section h2.split-text').forEach(h => {
      gsap.to($$('.line>span', h), { y: 0, duration: 1.2, ease: 'power4.out', stagger: .12, scrollTrigger: { trigger: h, start: 'top 88%' } });
    });
    reveal();

    // parallax images
    $$('.parallax').forEach(box => {
      const im = $('img', box);
      if (im) gsap.fromTo(im, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: box, scrub: true, start: 'top bottom', end: 'bottom top' } });
    });
    $$('.imgs .a img, .imgs .b img').forEach(im => {
      gsap.fromTo(im, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: im.parentElement, scrub: true, start: 'top bottom', end: 'bottom top' } });
    });
    $$('.hero .bgimg, .page-hero .bgimg, .cta .bgimg').forEach(bg => {
      gsap.fromTo(bg, { yPercent: -6 }, { yPercent: 10, ease: 'none', scrollTrigger: { trigger: bg.parentElement, scrub: true, start: 'top top', end: 'bottom top' } });
    });

    // counters
    $$('[data-count]').forEach(el => {
      const end = +el.dataset.count, suf = el.dataset.suffix || '';
      const o = { v: 0 };
      gsap.to(o, { v: end, duration: 2.4, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%' },
        onUpdate: () => el.textContent = Math.round(o.v).toLocaleString() + suf });
    });

    // service cards / steps stagger
    ['.svc', '.step'].forEach(sel => {
      const items = $$(sel); if (!items.length) return;
      gsap.from(items, { y: 60, opacity: 0, duration: 1, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: items[0].parentElement, start: 'top 85%' } });
    });

    // horizontal-feel marquee speeds with scroll
    const tr = $('.marquee .track');
    if (tr) {
      tr.innerHTML += tr.innerHTML;
      gsap.to(tr, { x: -200, ease: 'none', scrollTrigger: { trigger: '.marquee', scrub: 1, start: 'top bottom', end: 'bottom top' } });
    }

    // magnetic buttons
    $$('.btn').forEach(b => {
      b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .25, y: (e.clientY - r.top - r.height / 2) * .35, duration: .4 }); });
      b.addEventListener('mouseleave', () => gsap.to(b, { x: 0, y: 0, duration: .6, ease: 'elastic.out(1,.4)' }));
    });
  }

  window.addEventListener('load', () => { intro(); hasGsap && ScrollTrigger.refresh(); });

  /* anchor links inside smooth scroll */
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href'); if (id.length < 2) return;
    const t = $(id); if (!t) return; e.preventDefault();
    sb ? sb.scrollIntoView(t, { offsetTop: 80 }) : t.scrollIntoView({ behavior: 'smooth' });
  }));

  /* ---------- THREE.JS hero scenes ---------- */
  const canvas = $('#hero-canvas');
  if (canvas && window.THREE) {
    const mode = canvas.dataset.mode || 'city';
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const GOLD = 0xC5A059;
    scene.fog = new THREE.FogExp2(0x1E1E24, mode === 'city' ? 0.035 : 0.05);
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
    const group = new THREE.Group(); scene.add(group);

    scene.add(new THREE.AmbientLight(0xffffff, .5));
    const pl = new THREE.PointLight(GOLD, 2.2, 60); pl.position.set(6, 10, 6); scene.add(pl);

    if (mode === 'city') {
      camera.position.set(0, 7, 22);
      const boxMat = new THREE.MeshStandardMaterial({ color: 0x2C2C35, metalness: .85, roughness: .35 });
      const edgeMat = new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: .55 });
      for (let x = -14; x <= 14; x += 2.2) for (let z = -26; z <= 6; z += 2.2) {
        if (Math.random() < .25) continue;
        const h = 1 + Math.pow(Math.random(), 2.2) * 12 * (1 - Math.abs(x) / 24);
        const geo = new THREE.BoxGeometry(1.4, h, 1.4);
        const m = new THREE.Mesh(geo, boxMat); m.position.set(x, h / 2, z);
        const e = new THREE.LineSegments(new THREE.EdgesGeometry(geo), edgeMat); e.position.copy(m.position);
        group.add(m, e);
      }
      const grid = new THREE.GridHelper(80, 60, GOLD, 0x3a3a44); grid.material.transparent = true; grid.material.opacity = .25; group.add(grid);
    } else {
      camera.position.set(0, 0, 9);
      // wireframe villa
      const mat = new THREE.LineBasicMaterial({ color: GOLD });
      const mk = (g, x, y, z) => { const l = new THREE.LineSegments(new THREE.EdgesGeometry(g), mat); l.position.set(x, y, z); group.add(l); return l; };
      mk(new THREE.BoxGeometry(4, 1.6, 2.4), 0, -.4, 0);
      mk(new THREE.BoxGeometry(2, 1.4, 2.2), -1.5, 1, 0);
      mk(new THREE.BoxGeometry(2.6, .15, 3), 1.1, .5, 0);
      mk(new THREE.CylinderGeometry(.18, .18, 1.6, 8), 2.2, -.4, 1.3);
      mk(new THREE.CylinderGeometry(.18, .18, 1.6, 8), -2.2, -.4, 1.3);
      group.position.set(3.2, 0, 0); group.scale.setScalar(.9);
    }

    // particles
    const N = 700, pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) { pos[i * 3] = (Math.random() - .5) * 60; pos[i * 3 + 1] = Math.random() * 25 - 3; pos[i * 3 + 2] = (Math.random() - .5) * 60; }
    const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pts = new THREE.Points(pg, new THREE.PointsMaterial({ color: GOLD, size: .09, transparent: true, opacity: .8 }));
    scene.add(pts);

    const resize = () => { const w = canvas.clientWidth, h = canvas.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
    resize(); window.addEventListener('resize', resize);

    let tx = 0, ty = 0, scrollP = 0;
    window.addEventListener('mousemove', e => { tx = (e.clientX / innerWidth - .5); ty = (e.clientY / innerHeight - .5); });
    sb ? sb.addListener(s => scrollP = Math.min(1, s.offset.y / innerHeight)) : window.addEventListener('scroll', () => scrollP = Math.min(1, scrollY / innerHeight));

    const clock = new THREE.Clock();
    (function tick() {
      const t = clock.getElapsedTime();
      if (mode === 'city') {
        camera.position.x += (tx * 6 - camera.position.x) * .04;
        camera.position.y += (7 - ty * 3 + scrollP * 8 - camera.position.y) * .04;
        camera.position.z = 22 - scrollP * 12;
        camera.lookAt(0, 3 + scrollP * 4, -6);
        group.rotation.y = Math.sin(t * .1) * .12;
      } else {
        group.rotation.y = t * .35 + tx;
        group.rotation.x = .25 + ty * .4;
        group.position.y = Math.sin(t) * .15 - scrollP * 2;
      }
      pts.rotation.y = t * .015;
      pts.position.y = -scrollP * 4;
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    })();
  }
})();
