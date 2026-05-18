const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const navLinks = [...document.querySelectorAll(".nav-links a")];
const sections = [...document.querySelectorAll("main section[id]")];

menuToggle?.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
});

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuToggle?.setAttribute("aria-expanded", "false");
        if (menuToggle) {
            menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
    });
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.16 });

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) {
            return;
        }

        navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
    });
}, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

sections.forEach((section) => activeObserver.observe(section));

const spotlightTargets = document.querySelectorAll(
    ".hero-inner, .signal-card, .stack-panel, .timeline-item, .service-card, .project-card, .contact-card",
);

const supportsFinePointer = window.matchMedia("(pointer: fine)").matches;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (supportsFinePointer && !prefersReducedMotion) {
    spotlightTargets.forEach((target) => {
        target.addEventListener("pointermove", (event) => {
            const rect = target.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            target.style.setProperty("--spotlight-x", `${x}px`);
            target.style.setProperty("--spotlight-y", `${y}px`);
        });
    });
}

const lightbox = document.querySelector("[data-lightbox-modal]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");
const lightboxClose = document.querySelector("[data-lightbox-close]");

document.querySelectorAll("[data-lightbox]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
        const src = trigger.getAttribute("data-lightbox");
        const title = trigger.getAttribute("data-title") || "Project image";

        lightboxImage.src = src;
        lightboxImage.alt = title;
        lightboxCaption.textContent = title;
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    });
});

function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    document.body.style.overflow = "";
}

lightboxClose?.addEventListener("click", closeLightbox);

lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("open")) {
        closeLightbox();
    }
});
