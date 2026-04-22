/* =========================================================
   ZT Flores — Shared Components & Logic
   Injects header, footer, splash, WhatsApp float, cart,
   language overlay, and i18n translation system.
   ========================================================= */

const ZT = {
  whatsappNumber: '5519996638193',
  whatsappDefault: 'Olá! Vim pelo site da ZT Flores e gostaria de saber mais sobre os produtos.',
  cloudinaryCloud: 'dqcs4rqjx',

  pages: [
    { label: 'nav.home', href: 'home.html', id: 'home' },
    { label: 'nav.catalog', href: 'lista_de_produtos_marketplace.html', id: 'catalogo' },
    { label: 'nav.gallery', href: 'galeria.html', id: 'galeria' },
    { label: 'nav.history', href: 'nossa_historia.html', id: 'historia' },
  ],

  currentLang: 'pt',

  // ========================
  // CLOUDINARY HELPER
  // ========================
  cloudinaryUrl(publicId, width = 800) {
    if (!this.cloudinaryCloud) return publicId;
    return `https://res.cloudinary.com/${this.cloudinaryCloud}/image/upload/f_auto,q_auto,w_${width},dpr_auto/${publicId}`;
  },

  // Detect current page
  getCurrentPage() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('lista_de_produtos') || path.includes('catalogo')) return 'catalogo';
    if (path.includes('galeria')) return 'galeria';
    if (path.includes('nossa_historia') || path.includes('historia')) return 'historia';
    return 'home';
  },

  // ========================
  // i18n TRANSLATION
  // ========================
  t(key) {
    return zt_t(key, this.currentLang);
  },

  setLanguage(lang) {
    if (lang === this.currentLang && document.querySelectorAll('[data-i18n]').length > 0) {
      // Already in this language, skip overlay
      return;
    }

    const flagMap = { pt: '🇧🇷', en: '🇺🇸', es: '🇪🇸' };
    const nameMap = { pt: 'Português', en: 'English', es: 'Español' };

    // Show overlay
    const overlay = document.getElementById('zt-lang-overlay');
    if (overlay) {
      overlay.querySelector('.lang-overlay-flag').textContent = flagMap[lang] || '🌐';
      overlay.querySelector('.lang-overlay-name').textContent = nameMap[lang] || '';
      overlay.classList.add('active');
    }

    // Apply translations after a brief delay
    setTimeout(() => {
      this.currentLang = lang;
      localStorage.setItem('zt-lang', lang);

      // Update all data-i18n elements
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translated = this.t(key);
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = translated;
        } else {
          el.textContent = translated;
        }
      });

      // Update data-i18n-html elements (for elements with inner HTML)
      document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        el.innerHTML = this.t(key);
      });

      // Update active states on lang selectors
      document.querySelectorAll('[data-lang]').forEach(b => {
        b.classList.toggle('active', b.dataset.lang === lang);
        if (!b.closest('.zt-mobile-drawer') && !b.closest('.zt-footer-bottom')) {
          b.style.opacity = b.dataset.lang === lang ? '1' : '0.55';
        }
      });

      // Update HTML lang attribute
      document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : 'es-ES';

      // Hide overlay
      setTimeout(() => {
        if (overlay) overlay.classList.remove('active');
      }, 500);
    }, 300);
  },

  // ========================
  // LOGO SPLASH
  // ========================
  initSplash() {
    const splash = document.getElementById('logo-splash');
    if (!splash) return;

    const video = splash.querySelector('video');
    if (!video) { splash.classList.add('hidden'); return; }

    const isTabSwitch = sessionStorage.getItem('zt-visited');
    
    if (isTabSwitch) {
      video.playbackRate = 2.0;
      setTimeout(() => splash.classList.add('hidden'), 1200);
    } else {
      video.playbackRate = 1.0;
      video.addEventListener('ended', () => {
        setTimeout(() => splash.classList.add('hidden'), 300);
      });
      setTimeout(() => splash.classList.add('hidden'), 4000);
    }

    sessionStorage.setItem('zt-visited', 'true');
    video.play().catch(() => {
      splash.classList.add('hidden');
    });
  },

  // ========================
  // HEADER
  // ========================
  buildHeader() {
    const currentPage = this.getCurrentPage();
    const lang = this.currentLang;

    const navLinks = this.pages.map(p =>
      `<a href="${p.href}" class="${currentPage === p.id ? 'active' : ''}" data-i18n="${p.label}">${this.t(p.label)}</a>`
    ).join('');

    const cartCount = this.getCartCount();

    return `
    <header class="zt-header" id="zt-header">
      <div class="zt-header-inner">
        <div style="display:flex;align-items:center;gap:32px;">
          <a href="home.html" class="zt-logo">
            <img src="ZTlogo.png" alt="ZT Flores">
            <span>ZT Flores</span>
          </a>
          <nav class="zt-nav">${navLinks}</nav>
        </div>
        <div class="zt-header-right">
          <div class="zt-lang">
            <a href="#" class="${lang === 'pt' ? 'active' : ''}" data-lang="pt"><span class="flag">🇧🇷</span> PT</a>
            <a href="#" class="${lang === 'en' ? 'active' : ''}" data-lang="en"><span class="flag">🇺🇸</span> EN</a>
            <a href="#" class="${lang === 'es' ? 'active' : ''}" data-lang="es"><span class="flag">🇪🇸</span> ES</a>
          </div>
          <button class="zt-cart-btn" onclick="ZT.toggleCart()" title="Sua Seleção">
            <span class="material-symbols-outlined">shopping_bag</span>
            <span class="zt-cart-badge" data-count="${cartCount}">${cartCount}</span>
          </button>
          <a href="https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(this.whatsappDefault)}" 
             target="_blank" class="btn-header-cta" data-i18n="header.cta">${this.t('header.cta')}</a>
          <button class="zt-menu-btn" onclick="ZT.toggleMobileMenu()" aria-label="Menu">
            <span class="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </header>`;
  },

  // ========================
  // MOBILE DRAWER
  // ========================
  buildMobileDrawer() {
    const currentPage = this.getCurrentPage();
    const lang = this.currentLang;
    const navLinks = this.pages.map(p =>
      `<a href="${p.href}" class="${currentPage === p.id ? 'active' : ''}" data-i18n="${p.label}">${this.t(p.label)}</a>`
    ).join('');

    return `
    <div class="zt-mobile-drawer" id="zt-mobile-drawer">
      <div class="overlay" onclick="ZT.toggleMobileMenu()"></div>
      <div class="drawer-panel">
        <button class="drawer-close" onclick="ZT.toggleMobileMenu()">
          <span class="material-symbols-outlined">close</span>
        </button>
        <a href="home.html" class="zt-logo" style="margin-bottom:8px;">
          <img src="ZTlogo.png" alt="ZT Flores" style="height:36px;">
          <span style="font-size:1.1rem;font-weight:800;color:var(--plum);">ZT Flores</span>
        </a>
        <nav>${navLinks}</nav>
        <div class="drawer-lang">
          <a href="#" class="${lang === 'pt' ? 'active' : ''}" data-lang="pt"><span>🇧🇷</span> PT</a>
          <a href="#" class="${lang === 'en' ? 'active' : ''}" data-lang="en"><span>🇺🇸</span> EN</a>
          <a href="#" class="${lang === 'es' ? 'active' : ''}" data-lang="es"><span>🇪🇸</span> ES</a>
        </div>
        <a href="https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(this.whatsappDefault)}" 
           target="_blank" class="btn-primary" style="margin-top:auto;" data-i18n="home.cta.btn_whatsapp">
          ${this.t('home.cta.btn_whatsapp')}
        </a>
      </div>
    </div>`;
  },

  toggleMobileMenu() {
    document.getElementById('zt-mobile-drawer')?.classList.toggle('open');
  },

  // ========================
  // FOOTER
  // ========================
  buildFooter() {
    const lang = this.currentLang;
    return `
    <footer class="zt-footer">
      <div class="zt-footer-inner">
        <div class="zt-footer-grid">
          <div class="footer-brand">
            <img src="ZTlogo.png" alt="ZT Flores">
            <p data-i18n="footer.brand_desc">${this.t('footer.brand_desc')}</p>
            <div class="footer-social">
              <a href="https://www.instagram.com/ztflores_holambra/" target="_blank" title="Instagram">
                <svg width="16" height="16" fill="rgba(255,255,255,0.7)" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="#" title="Facebook">
                <svg width="16" height="16" fill="rgba(255,255,255,0.7)" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            </div>
          </div>
          <div>
            <h4 data-i18n="footer.nav">${this.t('footer.nav')}</h4>
            <ul>
              <li><a href="home.html" data-i18n="nav.home">${this.t('nav.home')}</a></li>
              <li><a href="lista_de_produtos_marketplace.html" data-i18n="nav.catalog">${this.t('nav.catalog')}</a></li>
              <li><a href="galeria.html" data-i18n="nav.gallery">${this.t('nav.gallery')}</a></li>
              <li><a href="nossa_historia.html" data-i18n="nav.history">${this.t('nav.history')}</a></li>
            </ul>
          </div>
          <div>
            <h4 data-i18n="footer.institutional">${this.t('footer.institutional')}</h4>
            <ul>
              <li><a href="nossa_historia.html" data-i18n="footer.about">${this.t('footer.about')}</a></li>
              <li><a href="#" data-i18n="footer.sustainability">${this.t('footer.sustainability')}</a></li>
              <li><a href="#" data-i18n="footer.care_guide">${this.t('footer.care_guide')}</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 data-i18n="footer.contact">${this.t('footer.contact')}</h4>
            <ul>
              <li><a href="https://wa.me/${this.whatsappNumber}" target="_blank">WhatsApp</a></li>
              <li><a href="#">contato@ztflores.com</a></li>
              <li><a href="#">Holambra, SP</a></li>
            </ul>
            <a href="https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(this.whatsappDefault)}"
               target="_blank"
               style="display:inline-flex;align-items:center;gap:8px;margin-top:16px;background:var(--brand);color:#fff;padding:10px 20px;border-radius:var(--radius-full);font-size:0.8rem;font-weight:700;"
               data-i18n="footer.contact_btn">${this.t('footer.contact_btn')}</a>
          </div>
        </div>
        <div class="zt-footer-bottom">
          <p data-i18n="footer.rights">${this.t('footer.rights')}</p>
          <div class="footer-lang">
            <a href="#" data-lang="pt"><span>🇧🇷</span> Português</a>
            <a href="#" data-lang="en"><span>🇺🇸</span> English</a>
            <a href="#" data-lang="es"><span>🇪🇸</span> Español</a>
          </div>
        </div>
      </div>
    </footer>`;
  },

  // ========================
  // WHATSAPP FLOATING BUTTON
  // ========================
  buildWhatsAppFloat() {
    return `
    <a href="https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(this.whatsappDefault)}" 
       target="_blank" class="zt-whatsapp-float" id="zt-whatsapp-float">
      <span class="pulse-dot"></span>
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.634 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      <span data-i18n="whatsapp.float">${this.t('whatsapp.float')}</span>
    </a>`;
  },

  // ========================
  // SPLASH OVERLAY
  // ========================
  buildSplash() {
    return `
    <div id="logo-splash">
      <video muted playsinline>
        <source src="logo_animada.mp4" type="video/mp4">
      </video>
    </div>`;
  },

  // ========================
  // LANGUAGE OVERLAY
  // ========================
  buildLangOverlay() {
    return `
    <div class="zt-lang-overlay" id="zt-lang-overlay">
      <div class="lang-overlay-content">
        <span class="lang-overlay-flag">🇧🇷</span>
        <span class="lang-overlay-name">Português</span>
      </div>
    </div>`;
  },

  // ========================
  // CART DRAWER (no prices)
  // ========================
  buildCartDrawer() {
    return `
    <div class="zt-cart-drawer" id="zt-cart-drawer">
      <div class="overlay" onclick="ZT.toggleCart()"></div>
      <div class="drawer-content">
        <div class="drawer-header">
          <h3 data-i18n="cart.title">${this.t('cart.title')}</h3>
          <button onclick="ZT.toggleCart()"><span class="material-symbols-outlined">close</span></button>
        </div>
        <div class="drawer-items" id="zt-cart-items"></div>
        <div class="drawer-footer" id="zt-cart-footer" style="display:none;">
          <button class="btn-whatsapp-checkout" onclick="ZT.checkoutWhatsApp()">
            <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.634 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            <span data-i18n="cart.checkout">${this.t('cart.checkout')}</span>
          </button>
        </div>
      </div>
    </div>`;
  },

  // ========================
  // CART LOGIC (name + image only)
  // ========================
  getCart() {
    try { return JSON.parse(localStorage.getItem('zt-cart') || '[]'); }
    catch { return []; }
  },

  saveCart(cart) {
    localStorage.setItem('zt-cart', JSON.stringify(cart));
    this.updateCartUI();
  },

  getCartCount() {
    return this.getCart().length;
  },

  addToCart(name, image) {
    const cart = this.getCart();
    const existing = cart.find(i => i.name === name);
    if (!existing) {
      cart.push({ name, image });
      this.saveCart(cart);
    }
    this.showAddedFeedback(name);
  },

  removeFromCart(name) {
    let cart = this.getCart().filter(i => i.name !== name);
    this.saveCart(cart);
  },

  clearCart() {
    localStorage.removeItem('zt-cart');
    this.updateCartUI();
  },

  updateCartUI() {
    const cart = this.getCart();
    const count = cart.length;

    // Update badge
    document.querySelectorAll('.zt-cart-badge').forEach(b => {
      b.textContent = count;
      b.dataset.count = count;
      b.style.display = count > 0 ? 'flex' : 'none';
    });

    // Update cart drawer items
    const itemsEl = document.getElementById('zt-cart-items');
    const footerEl = document.getElementById('zt-cart-footer');
    if (!itemsEl) return;

    if (cart.length === 0) {
      itemsEl.innerHTML = `
        <div class="drawer-empty">
          <span class="material-symbols-outlined">local_florist</span>
          <p style="font-weight:600;" data-i18n="cart.empty.title">${this.t('cart.empty.title')}</p>
          <p style="font-size:0.8rem;margin-top:4px;" data-i18n="cart.empty.desc">${this.t('cart.empty.desc')}</p>
        </div>`;
      if (footerEl) footerEl.style.display = 'none';
    } else {
      itemsEl.innerHTML = cart.map(item => {
        return `
          <div class="cart-item">
            <img src="${item.image || ''}" alt="${item.name}">
            <div class="cart-item-info">
              <div class="cart-item-name">${item.name}</div>
            </div>
            <button class="cart-item-remove" onclick="ZT.removeFromCart('${item.name.replace(/'/g, "\\'")}')">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>`;
      }).join('');
      if (footerEl) {
        footerEl.style.display = 'flex';
      }
    }
  },

  showAddedFeedback(name) {
    // Find the button that triggered this add and animate it
    const buttons = document.querySelectorAll('.btn-add-selection');
    buttons.forEach(btn => {
      // Match by checking if the onclick contains the product name
      if (btn.closest('.zt-card') || btn.closest('.card-body')) {
        const card = btn.closest('.zt-card');
        if (card) {
          const title = card.querySelector('.card-title');
          if (title && title.textContent.trim() === name) {
            // Animate this specific button
            btn.classList.add('added');
            const origHTML = btn.innerHTML;
            btn.innerHTML = `<span class="material-symbols-outlined" style="font-size:1.1rem;">check_circle</span> ${this.t('btn.added')}`;
            btn.disabled = true;
            setTimeout(() => {
              btn.classList.remove('added');
              btn.innerHTML = origHTML;
              btn.disabled = false;
            }, 1800);
          }
        }
      }
    });

    // Also animate the cart icon
    const cartBtn = document.querySelector('.zt-cart-btn');
    if (cartBtn) {
      cartBtn.classList.add('zt-cart-bounce');
      setTimeout(() => cartBtn.classList.remove('zt-cart-bounce'), 600);
    }
  },

  toggleCart() {
    const drawer = document.getElementById('zt-cart-drawer');
    if (drawer) {
      drawer.classList.toggle('open');
      this.updateCartUI();
    }
  },

  checkoutWhatsApp() {
    const cart = this.getCart();
    if (cart.length === 0) return;

    const lines = cart.map(item => `🌸 ${item.name}`);
    const greeting = this.t('checkout.greeting');
    const closing = this.t('checkout.closing');

    const message = `${greeting}\n\n${lines.join('\n')}\n\n${closing}`;

    window.open(`https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  },

  // ========================
  // SCROLL & ANIMATION
  // ========================
  initScrollEffects() {
    const header = document.getElementById('zt-header');
    if (header) {
      window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 10);
      }, { passive: true });
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
  },

  // ========================
  // LANGUAGE SELECTOR
  // ========================
  initLanguageSelector() {
    document.addEventListener('click', (e) => {
      const langLink = e.target.closest('[data-lang]');
      if (!langLink) return;
      e.preventDefault();
      const lang = langLink.dataset.lang;
      this.setLanguage(lang);
    });
  },

  // ========================
  // INSTAGRAM LAZY LOAD
  // ========================
  initInstagramEmbed() {
    const section = document.getElementById('zt-instagram-section');
    if (!section) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Load Instagram embed script
          if (!document.querySelector('script[src*="instagram.com/embed.js"]')) {
            const script = document.createElement('script');
            script.src = 'https://www.instagram.com/embed.js';
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
            script.onload = () => {
              if (window.instgrm) {
                window.instgrm.Embeds.process();
              }
            };
          } else if (window.instgrm) {
            window.instgrm.Embeds.process();
          }
          observer.unobserve(section);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(section);
  },

  // ========================
  // INIT — Call on every page
  // ========================
  init() {
    // Load saved language before building components
    this.currentLang = localStorage.getItem('zt-lang') || 'pt';

    const body = document.body;
    
    // Splash
    body.insertAdjacentHTML('afterbegin', this.buildSplash());

    // Remove existing header/footer
    const existingHeader = body.querySelector('header');
    const existingFooter = body.querySelector('footer');
    const main = body.querySelector('main') || body.querySelector('.main-content');

    if (existingHeader) existingHeader.remove();
    if (existingFooter) existingFooter.remove();

    // Remove old WhatsApp float if exists
    body.querySelectorAll('a[href*="wa.me"], .fixed.bottom-6, .fixed.bottom-8').forEach(el => {
      if (el.closest('main') === null && el.closest('footer') === null && el.closest('header') === null) {
        if (el.style.position === 'fixed' || el.classList.contains('fixed')) {
          el.remove();
        }
      }
    });

    // Inject new shared components
    if (main) {
      main.insertAdjacentHTML('beforebegin', this.buildHeader());
      main.insertAdjacentHTML('afterend', this.buildFooter());
    } else {
      body.insertAdjacentHTML('afterbegin', this.buildHeader());
      body.insertAdjacentHTML('beforeend', this.buildFooter());
    }

    body.insertAdjacentHTML('beforeend', this.buildMobileDrawer());
    body.insertAdjacentHTML('beforeend', this.buildCartDrawer());
    body.insertAdjacentHTML('beforeend', this.buildWhatsAppFloat());
    body.insertAdjacentHTML('beforeend', this.buildLangOverlay());

    // Initialize behaviors
    this.initSplash();
    this.initScrollEffects();
    this.initLanguageSelector();
    this.updateCartUI();
    this.initInstagramEmbed();

    // Apply saved language translations (without overlay on initial load)
    if (this.currentLang !== 'pt') {
      // For non-default languages, apply translations immediately
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translated = this.t(key);
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = translated;
        } else {
          el.textContent = translated;
        }
      });
      document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        el.innerHTML = this.t(key);
      });
    }

    // Fade-in init
    requestAnimationFrame(() => {
      document.querySelectorAll('.fade-in').forEach(el => {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });
        observer.observe(el);
      });
    });
  }
};

// Auto-init when DOM is ready
document.addEventListener('DOMContentLoaded', () => ZT.init());
