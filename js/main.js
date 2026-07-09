const canvas = document.querySelector("#hero-canvas");
const ctx = canvas.getContext("2d");
const particles = [];
const particleCount = 74;

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function seedParticles() {
  particles.length = 0;
  for (let i = 0; i < particleCount; i += 1) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.55,
      vy: (Math.random() - 0.5) * 0.55,
      r: 1 + Math.random() * 2.4,
      hue: Math.random() > 0.5 ? 192 : 45,
    });
  }
}

function drawNetwork() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (const dot of particles) {
    dot.x += dot.vx;
    dot.y += dot.vy;
    if (dot.x < -20) dot.x = window.innerWidth + 20;
    if (dot.x > window.innerWidth + 20) dot.x = -20;
    if (dot.y < -20) dot.y = window.innerHeight + 20;
    if (dot.y > window.innerHeight + 20) dot.y = -20;

    ctx.beginPath();
    ctx.fillStyle = `hsla(${dot.hue}, 100%, 65%, 0.78)`;
    ctx.shadowColor = `hsla(${dot.hue}, 100%, 65%, 0.8)`;
    ctx.shadowBlur = 14;
    ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const a = particles[i];
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 140) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(84, 214, 255, ${0.16 * (1 - dist / 140)})`;
        ctx.lineWidth = 1;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(drawNetwork);
}

resizeCanvas();
seedParticles();
drawNetwork();
window.addEventListener("resize", () => {
  resizeCanvas();
  seedParticles();
});

const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        document.querySelectorAll(".site-nav a").forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
);

document.querySelectorAll("main section[id]").forEach((section) => observer.observe(section));

document.querySelectorAll("[data-count]").forEach((item) => {
  const target = Number(item.dataset.count);
  const countObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      const start = performance.now();
      const duration = 1100;
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        item.textContent = Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      countObserver.disconnect();
    },
    { threshold: 0.7 }
  );
  countObserver.observe(item);
});

document.querySelectorAll(".course-track article").forEach((card) => {
  card.dataset.glow = card.querySelector("b").textContent;
});

const campusModal = document.querySelector(".campus-modal");
const campusTitle = campusModal?.querySelector("h3");
const campusAddress = campusModal?.querySelector(".campus-address");
const campusClose = document.querySelector(".campus-close");

document.querySelectorAll(".campus-band button").forEach((button) => {
  button.addEventListener("click", () => {
    if (!campusModal || !campusTitle || !campusAddress) return;
    campusTitle.textContent = `${button.dataset.city}校区`;
    campusAddress.textContent = button.dataset.address;
    campusModal.hidden = false;
    document.body.classList.add("is-lightbox-open");
  });
});

function closeCampusModal() {
  if (!campusModal) return;
  campusModal.hidden = true;
  document.body.classList.remove("is-lightbox-open");
}

campusClose?.addEventListener("click", closeCampusModal);
campusModal?.addEventListener("click", (event) => {
  if (event.target === campusModal) closeCampusModal();
});

const caseGrid = document.querySelector(".case-grid");
const caseToggle = document.querySelector(".case-toggle");
const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox?.querySelector("img");
const lightboxCaption = lightbox?.querySelector("figcaption");
const lightboxClose = document.querySelector(".lightbox-close");

caseToggle?.addEventListener("click", () => {
  const isExpanded = caseGrid.classList.toggle("is-expanded");
  caseToggle.setAttribute("aria-expanded", String(isExpanded));
  caseToggle.textContent = isExpanded ? "收起案例" : "展开全部 19 个案例";
});

document.querySelectorAll(".case-card").forEach((card) => {
  card.addEventListener("click", () => {
    if (!lightbox || !lightboxImage || !lightboxCaption) return;
    lightboxImage.src = card.dataset.full;
    lightboxImage.alt = `${card.dataset.title}学生案例完整图`;
    lightboxCaption.textContent = card.dataset.title;
    lightbox.hidden = false;
    document.body.classList.add("is-lightbox-open");
  });
});

function closeLightbox() {
  if (!lightbox || !lightboxImage) return;
  lightbox.hidden = true;
  lightboxImage.src = "";
  document.body.classList.remove("is-lightbox-open");
}

function openLightbox(src, title) {
  if (!lightbox || !lightboxImage || !lightboxCaption) return;
  lightboxImage.src = src;
  lightboxImage.alt = title;
  lightboxCaption.textContent = title;
  lightbox.hidden = false;
  document.body.classList.add("is-lightbox-open");
}

const galleryData = window.rayGalleryData || [];
const galleryTabs = document.querySelector(".gallery-tabs");
const galleryGrid = document.querySelector(".gallery-grid");
const galleryToggle = document.querySelector(".gallery-toggle");
let activeGalleryKey = galleryData[0]?.key;
let galleryExpanded = false;
const galleryPreviewCount = 8;

function renderGalleryTabs() {
  if (!galleryTabs) return;
  galleryTabs.innerHTML = "";
  galleryData.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `${category.label} ${category.count}`;
    button.classList.toggle("is-active", category.key === activeGalleryKey);
    button.addEventListener("click", () => {
      activeGalleryKey = category.key;
      galleryExpanded = false;
      renderGallery();
    });
    galleryTabs.appendChild(button);
  });
}

function renderGallery() {
  if (!galleryGrid || !galleryToggle) return;
  renderGalleryTabs();
  const category = galleryData.find((item) => item.key === activeGalleryKey);
  if (!category) return;
  const images = galleryExpanded ? category.images : category.images.slice(0, galleryPreviewCount);
  galleryGrid.innerHTML = "";
  images.forEach((image, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "gallery-card";
    card.innerHTML = `<img loading="lazy" src="${image.src}" alt="${image.alt}"><span>${category.label} ${index + 1}</span>`;
    card.addEventListener("click", () => openLightbox(image.src, image.alt));
    galleryGrid.appendChild(card);
  });
  galleryToggle.hidden = category.images.length <= galleryPreviewCount;
  galleryToggle.setAttribute("aria-expanded", String(galleryExpanded));
  galleryToggle.textContent = galleryExpanded
    ? "收起"
    : `展开全部 ${category.count} 张${category.label}`;
}

galleryToggle?.addEventListener("click", () => {
  galleryExpanded = !galleryExpanded;
  renderGallery();
});

renderGallery();

const wallForm = document.querySelector(".wall-form");
const wallList = document.querySelector(".wall-list");
const wallSubmitButton = wallForm?.querySelector("button[type='submit']");
const supabaseUrl = "https://yyhlbkkqilfefkqwiprj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5aGxia2txaWxmZWZrcXdpcHJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1NzI2ODEsImV4cCI6MjA5OTE0ODY4MX0.W2L-jqObcpZG1k6Ebmstc75Pb6B0u-WkyOpBakfrldY";
const wallEndpoint = `${supabaseUrl}/rest/v1/student_messages`;

function formatWallDate(value) {
  if (!value) return "刚刚";
  return new Date(value).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

async function requestWallMessages(path = "") {
  const response = await fetch(`${wallEndpoint}${path}`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      Accept: "application/json",
    },
  });
  if (!response.ok) throw new Error("留言加载失败");
  return response.json();
}

async function createWallMessage(name, review) {
  const response = await fetch(wallEndpoint, {
    method: "POST",
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ name, review }),
  });
  if (!response.ok) throw new Error("留言发布失败");
}

function renderWallMessages(messages = []) {
  if (!wallList) return;
  wallList.innerHTML = "";
  if (!messages.length) {
    wallList.innerHTML = '<p class="wall-empty">还没有留言，写下第一条评价吧。</p>';
    return;
  }
  messages.forEach((message) => {
    const card = document.createElement("article");
    card.className = "wall-message";
    card.innerHTML = `<strong></strong><p></p><small></small>`;
    card.querySelector("strong").textContent = message.name;
    card.querySelector("p").textContent = message.review;
    card.querySelector("small").textContent = formatWallDate(message.created_at);
    wallList.appendChild(card);
  });
}

async function loadWallMessages() {
  if (!wallList) return;
  wallList.innerHTML = '<p class="wall-empty">正在加载真实留言...</p>';
  try {
    const messages = await requestWallMessages("?select=id,name,review,created_at&order=created_at.desc&limit=60");
    renderWallMessages(messages);
  } catch {
    wallList.innerHTML = '<p class="wall-empty">留言暂时加载失败，请稍后刷新页面。</p>';
  }
}

wallForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(wallForm);
  const name = String(formData.get("studentName") || "").trim();
  const review = String(formData.get("studentReview") || "").trim();
  if (!name || !review) return;
  if (wallSubmitButton) {
    wallSubmitButton.disabled = true;
    wallSubmitButton.textContent = "发布中...";
  }
  try {
    await createWallMessage(name.slice(0, 20), review.slice(0, 180));
    wallForm.reset();
    await loadWallMessages();
    wallList.insertAdjacentHTML(
      "afterbegin",
      '<p class="wall-empty wall-success">已提交成功，Ray 审核后会展示在留言墙。</p>'
    );
  } catch {
    wallList.insertAdjacentHTML("afterbegin", '<p class="wall-empty">发布失败，请稍后再试。</p>');
  } finally {
    if (wallSubmitButton) {
      wallSubmitButton.disabled = false;
      wallSubmitButton.textContent = "发布留言";
    }
  }
});

loadWallMessages();

lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox && !lightbox.hidden) closeLightbox();
  if (event.key === "Escape" && campusModal && !campusModal.hidden) closeCampusModal();
});
