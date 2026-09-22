/*!
* HENDRIMIND Portfolio - Front-end Engine
* Semua konten dikonfigurasi langsung melalui coding (index.html).
*/

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

// Open Lightbox Modal - reads data from the clicked gallery card
window.openLightbox = function(photoId) {
    const card = document.querySelector(`.gallery-card[onclick="openLightbox('${photoId}')"]`);
    if (!card) return;

    const img = card.querySelector(".gallery-img");
    const badge = card.querySelector(".gallery-overlay .badge");
    const title = card.querySelector(".gallery-overlay h5");
    const desc = card.querySelector(".gallery-overlay p");

    document.querySelector("#lightboxImage").src = img ? img.src : "";
    document.querySelector("#lightboxTitle").textContent = title ? escapeHtml(title.textContent) : "";
    document.querySelector("#lightboxCategory").textContent = badge ? escapeHtml(badge.textContent) : "";
    document.querySelector("#lightboxDescription").textContent = desc ? escapeHtml(desc.textContent) : "";

    window.openModalById("#galleryLightbox");
};

// Gallery Filter - toggle visibility based on data-category
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
});
