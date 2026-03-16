/* ========================================
   CRITICAL.JS - Navigation & Core Interactions
   Load this first for immediate functionality
   ======================================== */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  document.getElementById("mainNavbar").innerHTML = `
  <div class="container-fluid px-lg-5">
            <a class="navbar-brand" href="index.html">
                <img src="images/BrandLogo.webp" alt="Suhani Industries">
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileMenu">
                <div class="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </button>
            
            <!-- Desktop Menu -->
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto align-items-center">
                    <li class="nav-item">
                        <a class="nav-link " href="index.html">
                            <span class="nav-indicator"></span>
                            HOME
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="about.html">
                            <span class="nav-indicator"></span>
                            ABOUT
                        </a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="services.html" data-bs-toggle="dropdown">
                            <span class="nav-indicator"></span>
                            SERVICES
                        </a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="product-view.html?id=3d-carving">3D CARVING</a></li>
                            <li><a class="dropdown-item" href="product-view.html?id=2d-carving">2D CARVING</a></li>
                            <li><a class="dropdown-item" href="product-view.html?id=wave-board">WAVE BOARD</a></li>
                            <li><a class="dropdown-item" href="product-view.html?id=metal-cnc">METAL CNC</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="updates.html">
                            <span class="nav-indicator"></span>
                            UPDATES
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="gallery.html">
                            <span class="nav-indicator"></span>
                            GALLERY
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="contact.html">
                            <span class="nav-indicator"></span>
                            CONTACT
                        </a>
                    </li>
                    <li class="nav-item nav-cta">
                        <a class="btn-neon" href="contact.html">
                            <span class="btn-text">GET QUOTE</span>
                            <span class="btn-glitch"></span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <!-- Neon Line -->
        <div class="nav-neon-line"></div>`;

  document.getElementById("mobileMenu").innerHTML = `
  <div class="offcanvas-header">
            <div class="brand-wrapper">
                <img src="images/BrandLogo.webp" alt="Suhani Industries">
            </div>
            <button type="button" class="btn-close-custom" data-bs-dismiss="offcanvas">
                <span></span>
                <span></span>
            </button>
        </div>
        <div class="offcanvas-body">
            <ul class="mobile-nav">
                <li><a href="index.html" class="active">HOME</a></li>
                <li><a href="about.html">ABOUT</a></li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                        SERVICES
                    </a>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="product-view.html?id=3d-carving">3D CARVING</a></li>
                        <li><a class="dropdown-item" href="product-view.html?id=2d-carving">2D CARVING</a></li>
                        <li><a class="dropdown-item" href="product-view.html?id=wave-board">WAVE BOARD</a></li>
                        <li><a class="dropdown-item" href="product-view.html?id=metal-cnc">METAL CNC</a></li>
                    </ul>
                </li>
                <li><a href="updates.html">UPDATES</a></li>
                <li><a href="gallery.html">GALLERY</a></li>
                <li><a href="contact.html">CONTACT</a></li>
            </ul>
            <a href="contact.html" class="btn-neon mobile-cta">
                <span class="btn-text">GET QUOTE</span>
            </a>
        </div>
        <div class="offcanvas-footer">
            <div class="social-links">
                <a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https://www.suhaniindustries.in"><i class="bi bi-facebook"></i></a>
                <a target="_blank" href="https://x.com/intent/post?text=Check%20out%20SUHANI%20INDUSTRIES%E2%80%99s%20website.%20Follow%20the%20latest%20updates%20and%20offers%20regularly.&url=https%3A%2F%2Fwww.suhaniindustries.in"><i class="bi bi-twitter-x"></i></a>
                <a target="_blank" href="https://www.linkedin.com/uas/login?session_redirect=https%3A%2F%2Fwww.linkedin.com%2FshareArticle%3Furl%3Dhttps%3A%2F%2Fwww.suhaniindustries.in"><i class="bi bi-linkedin"></i></a>
                <a target="_blank" href="https://www.pinterest.com/pin/create/button/?https://www.suhaniindustries.in"><i class="bi bi-pinterest"></i></a>
            </div>
        </div>`;

  // ===== ACTIVE LINK HANDLING =====
  function setActiveNavItem() {
    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(
      ".navbar-nav .nav-link, .mobile-nav a",
    );

    navLinks.forEach((link) => {
      // Remove any pre-existing active classes (just in case)
      link.classList.remove("active");

      const linkHref = link.getAttribute("href");

      // Check for exact match or if it's the home page
      if (linkHref === currentPage) {
        link.classList.add("active");
      }
    });
  }

  setActiveNavItem();

  // ===== NAVBAR SCROLL BEHAVIOR =====
  const navbar = document.getElementById("mainNavbar");
  const navHeight = 100;

  function handleNavbarScroll() {
    if (window.scrollY > navHeight) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", handleNavbarScroll);
  handleNavbarScroll();

  // ===== MOBILE DROPDOWN HANDLING =====
  const mobileMenu = document.getElementById("mobileMenu");
  if (mobileMenu) {
    // Reset dropdowns when offcanvas is closed
    mobileMenu.addEventListener("hidden.bs.offcanvas", function () {
      const openDropdowns = mobileMenu.querySelectorAll(".dropdown-menu.show");
      openDropdowns.forEach((d) => d.classList.remove("show"));
      const activeToggles = mobileMenu.querySelectorAll(
        ".dropdown-toggle.show",
      );
      activeToggles.forEach((t) => {
        t.classList.remove("show");
        t.setAttribute("aria-expanded", "false");
      });
    });

    // Close dropdown if clicked outside (but inside nav)
    mobileMenu.addEventListener("click", function (e) {
      if (
        !e.target.closest(".dropdown-menu") &&
        !e.target.closest(".dropdown-toggle")
      ) {
        const openDropdowns = mobileMenu.querySelectorAll(
          ".dropdown-menu.show",
        );
        openDropdowns.forEach((d) => d.classList.remove("show"));
        const activeToggles = mobileMenu.querySelectorAll(
          ".dropdown-toggle.show",
        );
        activeToggles.forEach((t) => {
          t.classList.remove("show");
          t.setAttribute("aria-expanded", "false");
        });
      }
    });
  }

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      // FIX: Ignore links that don't start with # (like WhatsApp/LinkedIn)

      if (!href.startsWith("#")) {
        return;
      }

      if (href === "#") {
        e.preventDefault();
        return;
      }

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPosition =
          target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetPosition, behavior: "smooth" });
      }
    });
  });
});

