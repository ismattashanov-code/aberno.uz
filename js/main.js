/* =========================================================
   ABERNO — umumiy skriptlar
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initMobileMenu();
  initActiveLink();
  initReveal();
  initCounters();
  initToTop();
  initProductFilter();
  initJobs();
  initContactForm();
  setYear();
});

/* Scroll bo'lganda header soyasi */
function initHeader() {
  const header = document.querySelector(".header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* Mobil menyu */
function initMobileMenu() {
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".nav");
  if (!burger || !nav) return;

  const close = () => {
    burger.classList.remove("is-open");
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  };

  burger.addEventListener("click", () => {
    const open = !nav.classList.contains("is-open");
    burger.classList.toggle("is-open", open);
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  document.addEventListener("keydown", (e) => e.key === "Escape" && close());
  window.addEventListener("resize", () => window.innerWidth > 880 && close());
}

/* Joriy sahifani menyuda belgilash */
function initActiveLink() {
  const current = location.pathname.split("/").pop() || "index.html";
  const page = document.body.dataset.page;
  document.querySelectorAll(".nav__link").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === current || (page && link.dataset.page === page)) {
      link.classList.add("is-active");
    }
  });
}

/* Ko'rinishga kirganda paydo bo'lish */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  items.forEach((el) => io.observe(el));

  // Tez scroll qilinganda o'tib ketilgan elementlarni ham ko'rsatish
  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => {
          if (el.getBoundingClientRect().top < window.innerHeight) {
            el.classList.add("is-visible");
            io.unobserve(el);
          }
        });
        ticking = false;
      });
    },
    { passive: true }
  );
}

/* Raqamlarni sanash animatsiyasi */
function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const animate = (el) => {
    const target = Number(el.dataset.count);
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString("ru-RU");
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (!("IntersectionObserver" in window)) {
    counters.forEach((el) => (el.textContent = el.dataset.count));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((el) => io.observe(el));
}

/* Yuqoriga qaytish tugmasi */
function initToTop() {
  const btn = document.querySelector(".to-top");
  if (!btn) return;
  window.addEventListener(
    "scroll",
    () => btn.classList.toggle("is-visible", window.scrollY > 600),
    { passive: true }
  );
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* Mahsulotlarni brend bo'yicha filtrlash */
function initProductFilter() {
  const filters = document.querySelectorAll(".filter");
  const products = document.querySelectorAll(".product");
  if (!filters.length) return;

  const apply = (value) => {
    filters.forEach((f) => f.classList.toggle("is-active", f.dataset.filter === value));
    products.forEach((p) => {
      p.classList.toggle("is-hidden", value !== "all" && p.dataset.brand !== value);
    });
  };

  filters.forEach((f) => f.addEventListener("click", () => apply(f.dataset.filter)));

  // URL orqali filtr: products.html#smaylo
  const hash = location.hash.replace("#", "");
  if (hash && document.querySelector(`.filter[data-filter="${hash}"]`)) apply(hash);
}

/* Vakansiyalar akkordeoni */
function initJobs() {
  document.querySelectorAll(".job").forEach((job) => {
    const head = job.querySelector(".job__head");
    const body = job.querySelector(".job__body");
    head.addEventListener("click", () => {
      const open = job.classList.toggle("is-open");
      head.setAttribute("aria-expanded", String(open));
      body.style.maxHeight = open ? body.scrollHeight + "px" : "0";
    });
  });

  // "Ariza topshirish" tugmasi vakansiyani formaga o'tkazadi
  document.querySelectorAll("[data-apply]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const select = document.querySelector("#position");
      if (select) select.value = btn.dataset.apply;
    });
  });
}

/* Aloqa / ariza formasi tekshiruvi */
function initContactForm() {
  document.querySelectorAll("form[data-validate]").forEach((form) => {
    const success = form.querySelector(".form__success");

    const rules = {
      name: (v) => v.trim().length >= 2 || "Ismingizni kiriting (kamida 2 ta harf)",
      phone: (v) =>
        /^\+?998[\s-]?\(?\d{2}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/.test(v.trim()) ||
        "Telefon raqamini +998 XX XXX XX XX formatida kiriting",
      email: (v) => !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || "Email manzili noto'g'ri",
      message: (v) => v.trim().length >= 10 || "Xabar kamida 10 ta belgidan iborat bo'lsin",
      position: (v) => v !== "" || "Lavozimni tanlang",
      subject: (v) => v !== "" || "Mavzuni tanlang",
    };

    const validateField = (input) => {
      const rule = rules[input.name];
      if (!rule) return true;
      const result = rule(input.value);
      const field = input.closest(".field");
      const error = field.querySelector(".field__error");
      if (result === true) {
        field.classList.remove("has-error");
        return true;
      }
      field.classList.add("has-error");
      if (error) error.textContent = result;
      return false;
    };

    form.querySelectorAll("input, textarea, select").forEach((input) => {
      input.addEventListener("blur", () => validateField(input));
      input.addEventListener("input", () => {
        if (input.closest(".field")?.classList.contains("has-error")) validateField(input);
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const inputs = [...form.querySelectorAll("input, textarea, select")];
      const valid = inputs.map(validateField).every(Boolean);
      if (!valid) {
        form.querySelector(".has-error input, .has-error textarea, .has-error select")?.focus();
        return;
      }
      form.reset();
      if (success) {
        success.classList.add("is-visible");
        setTimeout(() => success.classList.remove("is-visible"), 6000);
      }
    });
  });
}

function setYear() {
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
}
