/*!
* HENDRIMIND Portfolio - Front-end Engine
* Semua konten dikonfigurasi langsung melalui coding (index.html).
*/

// ── Backend API Configuration ────────────────────────────
// Saat development: http://localhost:3000/api
// Saat production (GitHub Pages): ganti ke URL backend Anda
const API_URL = window.location.hostname === "localhost"
  ? "http://localhost:3000/api"
  : "https://hendrimind-api.onrender.com/api"; // Ganti dengan URL backend production Anda

let galleryData = [];
let currentFilter = "all";

// Robust Helper to Open Modal
window.openModalById = function(modalId) {
    const modalEl = document.querySelector(modalId);
    if (!modalEl) return;

    try {
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            const instance = bootstrap.Modal.getOrCreateInstance(modalEl);
            if (instance) {
                instance.show();
                return;
            }
        }
    } catch (e) {
        console.warn("Bootstrap Modal API fallback:", e);
    }

    // Manual Fallback
    modalEl.classList.add("show");
    modalEl.style.display = "block";
    modalEl.removeAttribute("aria-hidden");
    modalEl.setAttribute("aria-modal", "true");
    modalEl.setAttribute("role", "dialog");
    document.body.classList.add("modal-open");

    let backdrop = document.querySelector(".modal-backdrop");
    if (!backdrop) {
        backdrop = document.createElement("div");
        backdrop.className = "modal-backdrop fade show";
        backdrop.addEventListener("click", () => window.closeModalById(modalId));
        document.body.appendChild(backdrop);
    }
};

// Robust Helper to Close Modal
window.closeModalById = function(modalId) {
    const modalEl = document.querySelector(modalId);
    if (!modalEl) return;

    try {
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            const instance = bootstrap.Modal.getInstance(modalEl);
            if (instance) {
                instance.hide();
                return;
            }
        }
    } catch (e) {}

    modalEl.classList.remove("show");
    modalEl.style.display = "none";
    modalEl.setAttribute("aria-hidden", "true");
    modalEl.removeAttribute("aria-modal");
    document.body.classList.remove("modal-open");
    const backdrop = document.querySelector(".modal-backdrop");
    if (backdrop) backdrop.remove();
};

// Helper HTML Escape
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function(m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
}

// ── Load Gallery from Backend API ────────────────────────
async function loadGalleryFromAPI() {
    try {
        const res = await fetch(`${API_URL}/gallery`);
        const data = await res.json();
        galleryData = data.data || [];

        const grid = document.getElementById("galleryGrid");
        if (!grid) return;

        grid.innerHTML = "";

        galleryData.forEach((item) => {
            const imgSrc = item.image.startsWith("http")
                ? item.image
                : item.image.startsWith("/uploads")
                    ? API_URL.replace("/api", "") + item.image
                    : item.image;

            const catLabel = {
                street: "Street Photography",
                portrait: "Portrait",
                nature: "Nature & Sunset",
            }[item.category] || item.category;

            const div = document.createElement("div");
            div.className = "col-md-6 col-lg-4 mb-4 gallery-item";
            div.setAttribute("data-category", item.category);
            div.innerHTML = `
                <div class="gallery-card h-100 shadow-sm" onclick="openLightbox('${item.id}')">
                    <div class="gallery-img-wrapper">
                        <img src="${imgSrc}" alt="${escapeHtml(item.title)}" class="gallery-img">
                        <div class="gallery-overlay">
                            <span class="badge bg-primary text-uppercase mb-2">${catLabel}</span>
                            <h5 class="text-white font-weight-bold mb-1">${escapeHtml(item.title)}</h5>
                            <p class="text-white-50 small mb-0">${escapeHtml(item.description)}</p>
                            <button class="btn btn-sm btn-outline-light mt-3 rounded-pill">
                                <i class="fas fa-search-plus me-1"></i> Perbesar
                            </button>
                        </div>
                    </div>
                </div>`;
            grid.appendChild(div);
        });

        applyGalleryFilter(currentFilter);
    } catch (err) {
        console.warn("Gagal memuat galeri dari API, menggunakan data default dari HTML:", err);
    }
}

// ── Open Lightbox dari data API ──────────────────────────
window.openLightbox = function (photoId) {
    const item = galleryData.find(g => String(g.id) === String(photoId));
    if (!item) return;

    const imgSrc = item.image.startsWith("http")
        ? item.image
        : item.image.startsWith("/uploads")
            ? API_URL.replace("/api", "") + item.image
            : item.image;

    const catLabel = {
        street: "Street Photography",
        portrait: "Portrait",
        nature: "Nature & Sunset",
    }[item.category] || item.category;

    document.querySelector("#lightboxImage").src = imgSrc;
    document.querySelector("#lightboxTitle").textContent = item.title;
    document.querySelector("#lightboxCategory").textContent = catLabel;
    document.querySelector("#lightboxDescription").textContent = item.description;

    window.openModalById("#galleryLightbox");
};

// ── Gallery Filter - toggle visibility based on data-category
function applyGalleryFilter(filter) {
    const items = document.querySelectorAll("#galleryGrid .gallery-item");
    items.forEach(item => {
        const cat = item.getAttribute("data-category");
        if (filter === "all" || cat === filter) {
            item.style.display = "";
        } else {
            item.style.display = "none";
        }
    });
}

// ── Contact/Subscribe Form Submission ────────────────────
async function handleContactFormSubmit(e) {
    e.preventDefault();
    const emailInput = document.getElementById("emailAddress");
    const email = emailInput.value.trim();
    const submitBtn = document.getElementById("submitButton");
    const successMsg = document.getElementById("submitSuccessMessage");
    const errorMsg = document.getElementById("submitErrorMessage");

    successMsg.classList.add("d-none");
    errorMsg.classList.add("d-none");
    submitBtn.disabled = true;
    submitBtn.textContent = "Mengirim...";

    try {
        const res = await fetch(`${API_URL}/contact`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        const data = await res.json();

        if (res.ok) {
            successMsg.classList.remove("d-none");
            emailInput.value = "";
        } else {
            errorMsg.querySelector("div").textContent = data.error || "Error sending message!";
            errorMsg.classList.remove("d-none");
        }
    } catch (err) {
        errorMsg.classList.remove("d-none");
    }

    submitBtn.disabled = false;
    submitBtn.textContent = "Notify Me!";
}

// Global DOM Ready Handlers
window.addEventListener('DOMContentLoaded', () => {
    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) return;
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink');
        } else {
            navbarCollapsible.classList.add('navbar-shrink');
        }
    };

    navbarShrink();
    document.addEventListener('scroll', navbarShrink);

    // Bootstrap scrollspy
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav && typeof bootstrap !== 'undefined' && bootstrap.ScrollSpy) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    }

    // Collapse responsive navbar
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (navbarToggler && window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Gallery Filter Click Listener
    const filterBtns = document.querySelectorAll(".gallery-filter-btn");
    filterBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            filterBtns.forEach(b => b.classList.remove("active", "btn-primary"));
            filterBtns.forEach(b => b.classList.add("btn-outline-light"));
            btn.classList.remove("btn-outline-light");
            btn.classList.add("active", "btn-primary");

            currentFilter = btn.getAttribute("data-filter") || "all";
            applyGalleryFilter(currentFilter);
        });
    });

    // Apply initial filter
    applyGalleryFilter(currentFilter);

    // ── Load gallery from API & attach form handler ──────
    loadGalleryFromAPI();

    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", handleContactFormSubmit);
    }
});
