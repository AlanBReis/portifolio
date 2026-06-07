/* =========================================================
   Portfolio — Alan Reis | interações (vanilla JS)
   ========================================================= */

/* ---- Loader ---- */
window.addEventListener("load", function () {
	var loader = document.querySelector(".loader");
	if (!loader) return;
	loader.style.transition = "opacity 0.5s ease";
	loader.style.opacity = "0";
	setTimeout(function () { loader.style.display = "none"; }, 550);
});


document.addEventListener("DOMContentLoaded", function () {

	/* ---- Tema (claro / escuro) ---- */
	var root = document.documentElement;
	var savedTheme = localStorage.getItem("theme");
	if (savedTheme === "dark") root.setAttribute("data-theme", "dark");

	var themeToggle = document.getElementById("themeToggle");
	if (themeToggle) {
		themeToggle.addEventListener("click", function () {
			var isDark = root.getAttribute("data-theme") === "dark";
			if (isDark) {
				root.removeAttribute("data-theme");
				localStorage.setItem("theme", "light");
			} else {
				root.setAttribute("data-theme", "dark");
				localStorage.setItem("theme", "dark");
			}
		});
	}

	/* ---- Menu mobile (drawer) ---- */
	var navToggle   = document.getElementById("navToggle");
	var navBackdrop = document.getElementById("navBackdrop");

	function closeMenu() {
		document.body.classList.remove("nav-open");
		if (navToggle) navToggle.setAttribute("aria-expanded", "false");
	}
	function toggleMenu() {
		var open = document.body.classList.toggle("nav-open");
		if (navToggle) navToggle.setAttribute("aria-expanded", open ? "true" : "false");
	}

	if (navToggle)   navToggle.addEventListener("click", toggleMenu);
	if (navBackdrop) navBackdrop.addEventListener("click", closeMenu);
	document.addEventListener("keydown", function (e) {
		if (e.key === "Escape") closeMenu();
	});

	/* ---- Nav: fundo ao rolar + fechar drawer ao clicar ---- */
	var nav = document.getElementById("navigation");
	var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-links .nav-link"));

	function onScroll() {
		if (!nav) return;
		if (window.scrollY > 40) nav.classList.add("scrolled");
		else nav.classList.remove("scrolled");
	}
	window.addEventListener("scroll", onScroll, { passive: true });
	onScroll();

	navLinks.forEach(function (link) {
		link.addEventListener("click", closeMenu);
	});

	/* ---- Scroll-spy: marca a seção visível no menu ---- */
	var sections = navLinks
		.map(function (link) {
			var href = link.getAttribute("href");
			return href && href.charAt(0) === "#" ? document.querySelector(href) : null;
		})
		.filter(Boolean);

	if ("IntersectionObserver" in window && sections.length) {
		var spy = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (!entry.isIntersecting) return;
				var id = "#" + entry.target.id;
				navLinks.forEach(function (l) {
					l.classList.toggle("active", l.getAttribute("href") === id);
				});
			});
		}, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
		sections.forEach(function (s) { spy.observe(s); });
	}

	/* ---- Timeline: ver mais / ver menos ---- */
	var visibleItems = 2;
	var items = document.querySelectorAll(".timeline-item");
	var loadMoreButton = document.getElementById("loadMore");
	var loadLessButton = document.getElementById("loadLess");

	function updateVisibility() {
		items.forEach(function (item, index) {
			item.style.display = index < visibleItems ? "block" : "none";
		});
		if (loadMoreButton) loadMoreButton.style.display = visibleItems >= items.length ? "none" : "block";
		if (loadLessButton) loadLessButton.style.display = visibleItems > 2 ? "block" : "none";
	}

	if (loadMoreButton) {
		loadMoreButton.addEventListener("click", function () {
			visibleItems = Math.min(visibleItems + 2, items.length);
			updateVisibility();
		});
	}
	if (loadLessButton) {
		loadLessButton.addEventListener("click", function () {
			visibleItems = Math.max(2, visibleItems - 2);
			updateVisibility();
		});
	}
	if (items.length) updateVisibility();

	/* ---- Carrossel de BIs (Power BI) ---- */
	(function () {
		var carousel = document.getElementById("biCarousel");
		if (!carousel) return;
		var slides = Array.prototype.slice.call(carousel.querySelectorAll(".bi-slide"));
		var dots   = Array.prototype.slice.call(carousel.querySelectorAll(".bi-dot"));
		if (slides.length < 2) {
			// 1 imagem: esconde setas/dots e mantém estática
			carousel.querySelectorAll(".bi-arrow, .bi-dots").forEach(function (el) { el.style.display = "none"; });
			return;
		}
		var current = 0;
		var timer = null;

		function go(i) {
			current = (i + slides.length) % slides.length;
			slides.forEach(function (s, idx) { s.classList.toggle("is-active", idx === current); });
			dots.forEach(function (d, idx) { d.classList.toggle("is-active", idx === current); });
		}
		function start() { stop(); timer = setInterval(function () { go(current + 1); }, 5000); }
		function stop()  { if (timer) { clearInterval(timer); timer = null; } }

		var next = carousel.querySelector(".bi-next");
		var prev = carousel.querySelector(".bi-prev");
		if (next) next.addEventListener("click", function () { go(current + 1); start(); });
		if (prev) prev.addEventListener("click", function () { go(current - 1); start(); });
		dots.forEach(function (d) {
			d.addEventListener("click", function () { go(parseInt(d.getAttribute("data-go"), 10) || 0); start(); });
		});
		carousel.addEventListener("mouseenter", stop);
		carousel.addEventListener("mouseleave", start);
		start();
	})();
});
