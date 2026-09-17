/*!
* HENDRIMIND Portfolio & Admin CMS Engine
*/

const STORAGE_KEY = "hendrimind_site_data";
const DEFAULT_PASSCODE = "admin";

const DEFAULT_SITE_DATA = {
    profile: {
        siteTitle: "HENDRIMIND",
        heroTitle: "HENDRIMIND",
        heroSub: "A professional photographer, focused on street photography and story telling.",
        aboutHeading: "My Name is Hendri Irawan",
        aboutText: "Create images by capturing light from the subject of the image with a camera or other photographic equipment, and generally think of arts and techniques to produce better photos and try to develop their knowledge",
        aboutImage: "assets/img/ipad.png"
    },
    contact: {
        address: "Brebes, Central Java, Indonesia",
        email: "magicmind354@gmail.com",
        phone: "+62 815 7830 8515",
        whatsapp: "6281578308515",
        twitter: "https://twitter.com/hendri_mind",
        facebook: "https://www.facebook.com/hendri.mind",
        instagram: "https://www.instagram.com/hendri_mind/"
    },
    settings: {
        showAdminInNav: false
    },
    photos: [
        {
            id: "1",
            title: "Story in Black and White",
            category: "street",
            categoryName: "Street Photography",
            description: "Life is about white or black, good or bad, trying or giving up, and there is no in between. The reward for all that is heaven or hell.",
            url: "assets/img/bg-masthead.jpg"
        },
        {
            id: "2",
            title: "Cheerful Laugh",
            category: "portrait",
            categoryName: "Portrait",
            description: "Being able to laugh when you are hurting yourself is one proof of how strong you can live this life.",
            url: "assets/img/demo-image-01.jpg"
        },
        {
            id: "3",
            title: "Two Ladies in Sunset",
            category: "nature",
            categoryName: "Nature & Sunset",
            description: "The sun has set. The moon appears. And life goes on.",
            url: "assets/img/demo-image-02.jpg"
        }
    ]
};

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

window.openAdminLoginModal = function() {
    window.openModalById("#adminLoginModal");
};

// Safely load site data with deep merge
function getSiteData() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && typeof parsed === 'object') {
                return {
                    profile: Object.assign({}, DEFAULT_SITE_DATA.profile, parsed.profile || {}),
                    contact: Object.assign({}, DEFAULT_SITE_DATA.contact, parsed.contact || {}),
                    settings: Object.assign({}, DEFAULT_SITE_DATA.settings, parsed.settings || {}),
                    photos: (Array.isArray(parsed.photos) && parsed.photos.length > 0) ? parsed.photos : DEFAULT_SITE_DATA.photos
                };
            }
        }
    } catch (e) {
        console.error("Error reading localStorage", e);
    }
    return DEFAULT_SITE_DATA;
}

// Save site data to localStorage
function saveSiteData(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        renderSite();
    } catch (e) {
        alert("Gagal menyimpan data: " + e.message);
    }
}

// Main Render Function
function renderSite() {
    const data = getSiteData();

    // 1. Profile / Hero Section
    const siteTitleEl = document.querySelector("#siteTitleDisplay");
    const heroTitleEl = document.querySelector("#heroTitleDisplay");
    const heroSubEl = document.querySelector("#heroSubDisplay");
    const aboutHeadingEl = document.querySelector("#aboutHeadingDisplay");
    const aboutTextEl = document.querySelector("#aboutTextDisplay");

    if (siteTitleEl) siteTitleEl.textContent = data.profile.siteTitle;
    if (heroTitleEl) heroTitleEl.textContent = data.profile.heroTitle;
    if (heroSubEl) heroSubEl.textContent = data.profile.heroSub;
    if (aboutHeadingEl) aboutHeadingEl.textContent = data.profile.aboutHeading;
    if (aboutTextEl) aboutTextEl.textContent = data.profile.aboutText;

    // 2. Contact Section
    const addressEl = document.querySelector("#contactAddressDisplay");
    const emailEl = document.querySelector("#contactEmailDisplay");
    const phoneEl = document.querySelector("#contactPhoneDisplay");
    const waLinkEl = document.querySelector("#whatsappFloatLink");
    const twitterLinkEl = document.querySelector("#twitterSocialLink");
    const fbLinkEl = document.querySelector("#facebookSocialLink");
    const igLinkEl = document.querySelector("#instagramSocialLink");

    if (addressEl) addressEl.textContent = data.contact.address;
    if (emailEl) {
        emailEl.textContent = data.contact.email;
        emailEl.href = "mailto:" + data.contact.email;
    }
    if (phoneEl) phoneEl.textContent = data.contact.phone;
    if (waLinkEl) waLinkEl.href = `https://api.whatsapp.com/send?phone=${(data.contact.whatsapp || '').replace(/[^0-9]/g, '')}`;
    if (twitterLinkEl) twitterLinkEl.href = data.contact.twitter || "#!";
    if (fbLinkEl) fbLinkEl.href = data.contact.facebook || "#!";
    if (igLinkEl) igLinkEl.href = data.contact.instagram || "#!";

    // 3. Admin Navbar Visibility
    const adminNavContainer = document.querySelector("#adminNavContainer");
    if (adminNavContainer) {
        if (data.settings && data.settings.showAdminInNav) {
            adminNavContainer.classList.remove("d-none");
        } else {
            adminNavContainer.classList.add("d-none");
        }
    }

    // 4. Render Public Gallery Grid
    renderGalleryGrid(data.photos);

    // 5. Render Admin Manage Photos List
    renderAdminPhotoList(data.photos);

    // 6. Populate Admin Edit Forms
    populateAdminForms(data);
}

// Render Gallery Grid with Filter
function renderGalleryGrid(photos) {
    const gridEl = document.querySelector("#galleryGrid");
    if (!gridEl) return;

    gridEl.innerHTML = "";

    const filtered = photos.filter(item => {
        if (currentFilter === "all") return true;
        return item.category === currentFilter;
    });

    if (filtered.length === 0) {
        gridEl.innerHTML = `
            <div class="col-12 text-center py-5 text-muted">
                <i class="fas fa-images fa-3x mb-3"></i>
                <p>Belum ada foto dalam kategori ini.</p>
            </div>
        `;
        return;
    }

    filtered.forEach(photo => {
        const col = document.createElement("div");
        col.className = "col-md-6 col-lg-4 mb-4 gallery-item";
        col.innerHTML = `
            <div class="gallery-card h-100 shadow-sm" onclick="openLightbox('${photo.id}')">
                <div class="gallery-img-wrapper">
                    <img src="${photo.url}" alt="${escapeHtml(photo.title)}" class="gallery-img" onerror="this.src='assets/img/bg-masthead.jpg'">
                    <div class="gallery-overlay">
                        <span class="badge bg-primary text-uppercase mb-2">${escapeHtml(photo.categoryName || photo.category)}</span>
                        <h5 class="text-white font-weight-bold mb-1">${escapeHtml(photo.title)}</h5>
                        <p class="text-white-50 small mb-0">${escapeHtml(photo.description || '')}</p>
                        <button class="btn btn-sm btn-outline-light mt-3 rounded-pill">
                            <i class="fas fa-search-plus me-1"></i> Perbesar
                        </button>
                    </div>
                </div>
            </div>
        `;
        gridEl.appendChild(col);
    });
}

// Open Lightbox Modal
window.openLightbox = function(photoId) {
    const data = getSiteData();
    const photo = data.photos.find(p => p.id === photoId);
    if (!photo) return;

    document.querySelector("#lightboxImage").src = photo.url;
    document.querySelector("#lightboxTitle").textContent = photo.title;
    document.querySelector("#lightboxCategory").textContent = photo.categoryName || photo.category;
    document.querySelector("#lightboxDescription").textContent = photo.description || "";

    window.openModalById("#galleryLightbox");
};

// Render Admin CMS Photo List
function renderAdminPhotoList(photos) {
    const adminListEl = document.querySelector("#adminPhotoList");
    if (!adminListEl) return;

    adminListEl.innerHTML = "";

    if (photos.length === 0) {
        adminListEl.innerHTML = `<div class="alert alert-info">Belum ada foto. Silakan tambah foto baru.</div>`;
        return;
    }

    photos.forEach(photo => {
        const item = document.createElement("div");
        item.className = "card mb-3 bg-dark text-white border-secondary";
        item.innerHTML = `
            <div class="row g-0 align-items-center p-2">
                <div class="col-3 col-md-2">
                    <img src="${photo.url}" class="img-fluid rounded" alt="${escapeHtml(photo.title)}" style="max-height: 70px; object-fit: cover; width: 100%;">
                </div>
                <div class="col-6 col-md-7 ps-3">
                    <h6 class="mb-1 text-white">${escapeHtml(photo.title)}</h6>
                    <span class="badge bg-secondary text-uppercase">${escapeHtml(photo.category)}</span>
                    <p class="small text-muted mb-0 text-truncate">${escapeHtml(photo.description)}</p>
                </div>
                <div class="col-3 col-md-3 text-end pe-2">
                    <button class="btn btn-sm btn-outline-warning me-1" onclick="editPhotoPrompt('${photo.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deletePhoto('${photo.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        adminListEl.appendChild(item);
    });
}

// Populate Admin Forms with current data
function populateAdminForms(data) {
    // Profile
    const siteTitleInput = document.querySelector("#adminSiteTitle");
    const heroTitleInput = document.querySelector("#adminHeroTitle");
    const heroSubInput = document.querySelector("#adminHeroSub");
    const aboutHeadingInput = document.querySelector("#adminAboutHeading");
    const aboutTextInput = document.querySelector("#adminAboutText");

    if (siteTitleInput) siteTitleInput.value = data.profile.siteTitle || "";
    if (heroTitleInput) heroTitleInput.value = data.profile.heroTitle || "";
    if (heroSubInput) heroSubInput.value = data.profile.heroSub || "";
    if (aboutHeadingInput) aboutHeadingInput.value = data.profile.aboutHeading || "";
    if (aboutTextInput) aboutTextInput.value = data.profile.aboutText || "";

    // Contact
    const addressInput = document.querySelector("#adminAddress");
    const emailInput = document.querySelector("#adminEmail");
    const phoneInput = document.querySelector("#adminPhone");
    const waInput = document.querySelector("#adminWhatsapp");
    const twitterInput = document.querySelector("#adminTwitter");
    const fbInput = document.querySelector("#adminFacebook");
    const igInput = document.querySelector("#adminInstagram");

    if (addressInput) addressInput.value = data.contact.address || "";
    if (emailInput) emailInput.value = data.contact.email || "";
    if (phoneInput) phoneInput.value = data.contact.phone || "";
    if (waInput) waInput.value = data.contact.whatsapp || "";
    if (twitterInput) twitterInput.value = data.contact.twitter || "";
    if (fbInput) fbInput.value = data.contact.facebook || "";
    if (igInput) igInput.value = data.contact.instagram || "";

    // Settings
    const toggleAdminSwitch = document.querySelector("#toggleAdminNavSwitch");
    if (toggleAdminSwitch) {
        toggleAdminSwitch.checked = !!(data.settings && data.settings.showAdminInNav);
    }
}

// Helper HTML Escape
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function(m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
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
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Initialize Site Data Rendering
    renderSite();

    // Gallery Filter Click Listener
    const filterBtns = document.querySelectorAll(".gallery-filter-btn");
    filterBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            filterBtns.forEach(b => b.classList.remove("active", "btn-primary"));
            filterBtns.forEach(b => b.classList.add("btn-outline-light"));
            btn.classList.remove("btn-outline-light");
            btn.classList.add("active", "btn-primary");

            currentFilter = btn.getAttribute("data-filter") || "all";
            const data = getSiteData();
            renderGalleryGrid(data.photos);
        });
    });

    // Admin Login Form Submit
    const loginForm = document.querySelector("#adminLoginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const passwordInput = document.querySelector("#adminPasswordInput");
            const savedPass = localStorage.getItem("admin_pass") || DEFAULT_PASSCODE;
            
            if (passwordInput.value === savedPass) {
                window.closeModalById("#adminLoginModal");
                passwordInput.value = "";
                
                // Show Admin Dashboard Modal
                setTimeout(() => {
                    window.openModalById("#adminDashboardModal");
                }, 200);
            } else {
                alert("Password salah!");
            }
        });
    }

    // Add Photo Form Submit
    const addPhotoForm = document.querySelector("#adminAddPhotoForm");
    if (addPhotoForm) {
        addPhotoForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const title = document.querySelector("#photoTitleInput").value;
            const categorySelect = document.querySelector("#photoCategoryInput");
            const category = categorySelect.value;
            const categoryName = categorySelect.options[categorySelect.selectedIndex].text;
            const url = document.querySelector("#photoUrlInput").value;
            const description = document.querySelector("#photoDescInput").value;

            const data = getSiteData();
            const newPhoto = {
                id: Date.now().toString(),
                title,
                category,
                categoryName,
                url,
                description
            };

            data.photos.unshift(newPhoto);
            saveSiteData(data);

            addPhotoForm.reset();
            alert("Foto berhasil ditambahkan ke Galeri!");
        });
    }

    // Save Profile Form Submit
    const profileForm = document.querySelector("#adminProfileForm");
    if (profileForm) {
        profileForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const data = getSiteData();
            data.profile.siteTitle = document.querySelector("#adminSiteTitle").value;
            data.profile.heroTitle = document.querySelector("#adminHeroTitle").value;
            data.profile.heroSub = document.querySelector("#adminHeroSub").value;
            data.profile.aboutHeading = document.querySelector("#adminAboutHeading").value;
            data.profile.aboutText = document.querySelector("#adminAboutText").value;

            saveSiteData(data);
            alert("Profil berhasil diperbarui!");
        });
    }

    // Save Contact Form Submit
    const contactForm = document.querySelector("#adminContactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const data = getSiteData();
            data.contact.address = document.querySelector("#adminAddress").value;
            data.contact.email = document.querySelector("#adminEmail").value;
            data.contact.phone = document.querySelector("#adminPhone").value;
            data.contact.whatsapp = document.querySelector("#adminWhatsapp").value;
            data.contact.twitter = document.querySelector("#adminTwitter").value;
            data.contact.facebook = document.querySelector("#adminFacebook").value;
            data.contact.instagram = document.querySelector("#adminInstagram").value;

            saveSiteData(data);
            alert("Informasi Kontak berhasil diperbarui!");
        });
    }

    // Export Backup JSON
    const exportBtn = document.querySelector("#adminExportBtn");
    if (exportBtn) {
        exportBtn.addEventListener("click", () => {
            const data = getSiteData();
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", "hendrimind_backup.json");
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
        });
    }

    // Import Backup JSON
    const importInput = document.querySelector("#adminImportInput");
    if (importInput) {
        importInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const importedData = JSON.parse(event.target.result);
                    if (importedData && importedData.photos && importedData.profile) {
                        saveSiteData(importedData);
                        alert("Data berhasil di-import!");
                    } else {
                        alert("Format file JSON tidak valid.");
                    }
                } catch (err) {
                    alert("Error membaca file JSON: " + err.message);
                }
            };
            reader.readAsText(file);
        });
    }

    // Reset to Default Data
    const resetBtn = document.querySelector("#adminResetBtn");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            if (confirm("Apakah Anda yakin ingin mengembalikan semua data ke pengaturan awal? Perubahan lokal Anda akan dihapus.")) {
                saveSiteData(DEFAULT_SITE_DATA);
                alert("Data berhasil dikembalikan ke pengaturan awal.");
            }
        });
    }

    // Toggle Admin Nav Switch
    const toggleAdminSwitch = document.querySelector("#toggleAdminNavSwitch");
    if (toggleAdminSwitch) {
        toggleAdminSwitch.addEventListener("change", (e) => {
            const data = getSiteData();
            if (!data.settings) data.settings = {};
            data.settings.showAdminInNav = e.target.checked;
            saveSiteData(data);
        });
    }

    // Ganti Password Form
    const passwordForm = document.querySelector("#adminPasswordForm");
    if (passwordForm) {
        passwordForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const oldPass = document.querySelector("#oldPassword").value;
            const newPass = document.querySelector("#newPassword").value;
            const confirmPass = document.querySelector("#confirmPassword").value;

            const currentPass = localStorage.getItem("admin_pass") || DEFAULT_PASSCODE;

            if (oldPass !== currentPass) {
                alert("Password lama salah!");
                return;
            }
            if (newPass !== confirmPass) {
                alert("Password baru tidak cocok!");
                return;
            }

            localStorage.setItem("admin_pass", newPass);
            alert("Password berhasil diubah!");
            passwordForm.reset();
        });
    }

    // Secret Admin Triggers
    // 1. Shortcut Key: Ctrl + Shift + A / Cmd + Shift + A / Alt + A
    document.addEventListener("keydown", (e) => {
        if (((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "A" || e.key === "a")) || (e.altKey && (e.key === "A" || e.key === "a"))) {
            e.preventDefault();
            window.openAdminLoginModal();
        }
    });

    // 2. Secret Triple Click on Footer Copyright text
    let footerClicks = 0;
    let footerTimer = null;
    const secretFooter = document.querySelector("#secretFooterAdmin");
    if (secretFooter) {
        secretFooter.addEventListener("click", () => {
            footerClicks++;
            if (footerClicks >= 3) {
                footerClicks = 0;
                clearTimeout(footerTimer);
                window.openAdminLoginModal();
            } else {
                clearTimeout(footerTimer);
                footerTimer = setTimeout(() => { footerClicks = 0; }, 1000);
            }
        });
    }

    // 3. Secret URL Hash: #admin
    if (window.location.hash === "#admin") {
        window.openAdminLoginModal();
    }
    window.addEventListener("hashchange", () => {
        if (window.location.hash === "#admin") {
            window.openAdminLoginModal();
        }
    });
});

// Delete Photo Admin Action
window.deletePhoto = function(photoId) {
    if (!confirm("Apakah Anda yakin ingin menghapus foto ini?")) return;
    const data = getSiteData();
    data.photos = data.photos.filter(p => p.id !== photoId);
    saveSiteData(data);
};

// Edit Photo Prompt Admin Action
window.editPhotoPrompt = function(photoId) {
    const data = getSiteData();
    const photo = data.photos.find(p => p.id === photoId);
    if (!photo) return;

    const newTitle = prompt("Edit Judul Foto:", photo.title);
    if (newTitle === null) return;

    const newUrl = prompt("Edit URL Gambar:", photo.url);
    if (newUrl === null) return;

    const newDesc = prompt("Edit Deskripsi Foto:", photo.description);
    if (newDesc === null) return;

    photo.title = newTitle;
    photo.url = newUrl;
    photo.description = newDesc;

    saveSiteData(data);
};