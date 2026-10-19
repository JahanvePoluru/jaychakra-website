(function () {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const waNumber = (typeof SITE_CONFIG !== "undefined" && SITE_CONFIG.whatsappNumber) || "";

  $("#year").textContent = new Date().getFullYear();
  $("#waFloat").href = `https://wa.me/${waNumber}?text=${encodeURIComponent("Hi, I'm interested in Jay Chakra Infra Properties LLP projects.")}`;

  window.addEventListener("load", () => setTimeout(() => $("#loader").classList.add("done"), 400));
  setTimeout(() => $("#loader").classList.add("done"), 3500);

  // Nav
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const burger = $("#burger");
  const links = $("#navLinks");
  burger.addEventListener("click", () => {
    burger.classList.toggle("open");
    links.classList.toggle("open");
  });
  $$("a", links).forEach(a => a.addEventListener("click", () => {
    burger.classList.remove("open");
    links.classList.remove("open");
  }));

  // Projects
  const grid = $("#projectGrid");
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const projects = typeof PROJECTS !== "undefined" && Array.isArray(PROJECTS) ? PROJECTS : [];

  grid.innerHTML = projects.map((p, i) => `
    <article class="card reveal" data-index="${i}" data-category="${esc(p.category)}" data-status="${esc(p.status)}" tabindex="0">
      <img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy" />
      <div class="card-glare"></div>
      <div class="card-body">
        <span class="tag ${p.status === "Ongoing" ? "ongoing" : ""}">${esc(p.status)} · ${esc(p.category)}</span>
        <h3>${esc(p.title)}</h3>
        <p class="meta">${esc([p.location, p.size].filter(Boolean).join(" · "))}</p>
        <span class="view">View details →</span>
      </div>
    </article>`).join("") || `<p class="empty">Projects coming soon.</p>`;

  $$(".filters button").forEach(btn => {
    const f = btn.dataset.filter;
    if (f !== "all" && !projects.some(p => p.category === f || p.status === f)) btn.remove();
  });

  $$(".filters button").forEach(btn => btn.addEventListener("click", () => {
    $$(".filters button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;
    $$(".card", grid).forEach(card => {
      const show = f === "all" || card.dataset.category === f || card.dataset.status === f;
      card.classList.toggle("hide", !show);
    });
  }));

  // Modal
  const modal = $("#modal");
  let lastFocus = null;
  const openModal = i => {
    const p = projects[i];
    if (!p) return;
    lastFocus = document.activeElement;
    $("#modalImg").src = p.image;
    $("#modalImg").alt = p.title;
    $("#modalTag").textContent = `${p.status} · ${p.category}`;
    $("#modalTag").className = "tag" + (p.status === "Ongoing" ? " ongoing" : "");
    $("#modalTitle").textContent = p.title;
    $("#modalMeta").textContent = [p.location, p.year, p.size].filter(Boolean).join(" · ");
    $("#modalDesc").textContent = p.description || "";
    modal.dataset.project = p.title;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    $("#modalClose").focus();
  };
  const closeModal = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  };
  grid.addEventListener("click", e => {
    const card = e.target.closest(".card");
    if (card) openModal(+card.dataset.index);
  });
  grid.addEventListener("keydown", e => {
    const card = e.target.closest(".card");
    if (card && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openModal(+card.dataset.index); }
  });
  $("#modalClose").addEventListener("click", closeModal);
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && modal.classList.contains("open")) closeModal(); });
  $("#modalCta").addEventListener("click", () => {
    const msg = $("#contactForm textarea[name=message]");
    msg.value = `I'm interested in "${modal.dataset.project}". Please share more details.`;
    closeModal();
  });

  // 3D tilt
  if (finePointer && !reduceMotion) {
    const tilt = (el, max) => {
      el.addEventListener("mousemove", e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        el.style.transform = `rotateY(${(x - .5) * max}deg) rotateX(${(.5 - y) * max}deg) translateZ(0)`;
        el.style.setProperty("--gx", `${x * 100}%`);
        el.style.setProperty("--gy", `${y * 100}%`);
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    };
    $$(".card").forEach(c => tilt(c, 12));
    $$(".tilt").forEach(c => tilt(c, 10));
  }

  // Reveal on scroll
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    io.observe(el);
  });

  // Counters
  const countIO = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || "";
      const start = performance.now();
      const dur = 1800;
      const step = now => {
        const t = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3))) + suffix;
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      countIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  $$("[data-count]").forEach(el => countIO.observe(el));

  // Contact form -> WhatsApp
  const form = $("#contactForm");
  const status = $("#formStatus");
  form.addEventListener("submit", e => {
    e.preventDefault();
    $$(".invalid", form).forEach(el => el.classList.remove("invalid"));
    const invalid = $$("input, select, textarea", form).filter(el => !el.checkValidity());
    if (invalid.length) {
      invalid.forEach(el => el.classList.add("invalid"));
      status.className = "form-status error";
      status.textContent = "Please enter your name and a valid phone number.";
      invalid[0].focus();
      return;
    }
    const d = Object.fromEntries(new FormData(form));
    const text = [
      "New enquiry – Jay Chakra Infra Properties LLP",
      `Name: ${d.name}`,
      `Phone: ${d.phone}`,
      d.email && `Email: ${d.email}`,
      `Interested in: ${d.interest}`,
      `City: ${d.city}`,
      d.message && `Message: ${d.message}`
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    status.className = "form-status";
    status.textContent = "Thank you! Opening WhatsApp to send your enquiry…";
    form.reset();
  });

  // Three.js 3D city hero
  const canvas = $("#city3d");
  if (!window.THREE || !canvas) return;
  try {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0b0d12, 40, 120);
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 300);
    camera.position.set(18, 16, 42);

    scene.add(new THREE.AmbientLight(0x404660, 1.2));
    const sun = new THREE.DirectionalLight(0xffd9a0, 1.6);
    sun.position.set(-30, 50, 20);
    scene.add(sun);
    const rim = new THREE.DirectionalLight(0x6f86ff, 0.6);
    rim.position.set(30, 20, -40);
    scene.add(rim);

    const city = new THREE.Group();
    scene.add(city);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.MeshStandardMaterial({ color: 0x0e1118, roughness: 1 })
    );
    ground.rotation.x = -Math.PI / 2;
    city.add(ground);
    const gridHelper = new THREE.GridHelper(200, 80, 0xc9a45c, 0x1b2030);
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.25;
    gridHelper.position.y = 0.01;
    city.add(gridHelper);

    // Window texture
    const tex = (() => {
      const c = document.createElement("canvas");
      c.width = 64; c.height = 128;
      const g = c.getContext("2d");
      g.fillStyle = "#151925"; g.fillRect(0, 0, 64, 128);
      for (let y = 4; y < 128; y += 8) for (let x = 4; x < 64; x += 8) {
        const lit = Math.random() < 0.35;
        g.fillStyle = lit ? (Math.random() < 0.7 ? "#ffcf7a" : "#fff1d0") : "#1f2433";
        g.fillRect(x, y, 4, 5);
      }
      const t = new THREE.CanvasTexture(c);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      return t;
    })();

    const buildings = [];
    const rand = (a, b) => a + Math.random() * (b - a);
    for (let i = 0; i < 140; i++) {
      const x = rand(-60, 60), z = rand(-70, 20);
      if (Math.abs(x) < 4 && z > -8) continue;
      const w = rand(2, 5), d = rand(2, 5);
      const dist = Math.hypot(x - 12, z + 20);
      const h = Math.max(3, rand(4, 26) * (1.4 - Math.min(dist, 60) / 60));
      const map = tex.clone();
      map.needsUpdate = true;
      map.repeat.set(Math.max(1, Math.round(w / 2)), Math.max(1, Math.round(h / 4)));
      const mat = new THREE.MeshStandardMaterial({
        color: 0xffffff, map, emissive: 0xffffff, emissiveMap: map, emissiveIntensity: 0.55,
        roughness: 0.6, metalness: 0.3
      });
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      b.position.set(x, 0, z);
      b.scale.y = 0.001;
      b.userData = { h, delay: Math.random() * 1.2 };
      city.add(b);
      buildings.push(b);

      if (h > 16 && Math.random() < 0.6) {
        const edge = new THREE.LineSegments(
          new THREE.EdgesGeometry(b.geometry),
          new THREE.LineBasicMaterial({ color: 0xc9a45c, transparent: true, opacity: 0.5 })
        );
        b.add(edge);
      }
    }

    // Floating gold particles
    const pGeo = new THREE.BufferGeometry();
    const pts = new Float32Array(600 * 3);
    for (let i = 0; i < pts.length; i += 3) {
      pts[i] = rand(-70, 70); pts[i + 1] = rand(2, 40); pts[i + 2] = rand(-80, 20);
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xe8cf94, size: 0.18, transparent: true, opacity: 0.7 }));
    scene.add(particles);

    const resize = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", resize);
    resize();

    let mx = 0, my = 0;
    window.addEventListener("mousemove", e => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
    }, { passive: true });

    let visible = true;
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(canvas);

    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      if (!visible) return;
      const t = clock.getElapsedTime();
      buildings.forEach(b => {
        const p = Math.min(Math.max((t - b.userData.delay) / 1.4, 0), 1);
        const e = 1 - Math.pow(1 - p, 3);
        b.scale.y = Math.max(e, 0.001);
        b.position.y = (b.userData.h * b.scale.y) / 2;
      });
      if (!reduceMotion) city.rotation.y = Math.sin(t * 0.05) * 0.15 + t * 0.01;
      particles.rotation.y = t * 0.01;
      const scrollY = Math.min(window.scrollY / window.innerHeight, 1);
      camera.position.x += ((18 + mx * 8) - camera.position.x) * 0.04;
      camera.position.y += ((16 - my * 5 + scrollY * 12) - camera.position.y) * 0.04;
      camera.position.z += ((camera.aspect < 1 ? 62 : 42) - camera.position.z) * 0.04;
      camera.lookAt(6, 6, -14);
      renderer.render(scene, camera);
    };
    animate();
  } catch (err) {
    console.warn("3D scene unavailable:", err);
  }
})();
