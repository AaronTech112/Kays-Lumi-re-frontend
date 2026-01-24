// Data + storage
const storageKey = "kaysLumiereCart";

const products = [
  {
    id: "lumiere-solitaire",
    name: "Lumière Solitaire Ring",
    price: 650000,
    image: "assets/images/product-1.jpg",
    category: "engagement",
    description: "A timeless symbol of enduring love, the Lumière Solitaire Ring features a brilliant-cut diamond set in 18k yellow gold. Each stone is hand-selected for its exceptional clarity and radiance.",
  },
  {
    id: "aurora-necklace",
    name: "Aurora Diamond Necklace",
    price: 920000,
    image: "assets/images/product-2.jpg",
    category: "bridal",
    description: "Inspired by the northern lights, the Aurora Diamond Necklace cascades with light. Featuring a sequence of graduated diamonds, it sits perfectly on the collarbone for a look of effortless elegance.",
  },
  {
    id: "celeste-bracelet",
    name: "Celeste Tennis Bracelet",
    price: 480000,
    image: "assets/images/product-3.jpg",
    category: "everyday",
    description: "The Celeste Tennis Bracelet is a modern classic. A continuous line of ethically sourced diamonds encircles the wrist, offering a subtle yet captivating sparkle suitable for day or night.",
  },
  {
    id: "monarch-signature",
    name: "Monarch Signet",
    price: 560000,
    image: "assets/images/product-1.jpg",
    category: "mens",
    description: "Bold and distinguished, the Monarch Signet ring is crafted from solid gold. Its substantial weight and polished finish make it a statement piece of heirloom quality.",
  },
  {
    id: "seraphina-earrings",
    name: "Seraphina Earrings",
    price: 310000,
    image: "assets/images/product-2.jpg",
    category: "everyday",
    description: "Delicate and divine, the Seraphina Earrings feature a halo of micro-pavé diamonds surrounding a central stone. They are the perfect finishing touch for any ensemble.",
  },
  {
    id: "legacy-pendant",
    name: "Legacy Radiance Pendant",
    price: 740000,
    image: "assets/images/product-3.jpg",
    category: "legacy",
    description: "Part of our heritage collection, the Legacy Radiance Pendant honors traditional craftsmanship. Intricate metalwork supports a stunning center stone, creating a piece rich in history and beauty.",
  },
];

// Helpers
const formatCurrency = (value) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);

// Cart operations
const getCart = () => {
  const raw = localStorage.getItem(storageKey);
  return raw ? JSON.parse(raw) : [];
};

const setCart = (cart) => {
  localStorage.setItem(storageKey, JSON.stringify(cart));
};

// UI updates
const updateCartBadge = () => {
  const countEl = document.querySelector("[data-cart-count]");
  if (!countEl) return;
  const total = getCart().reduce((sum, item) => sum + item.quantity, 0);
  countEl.textContent = total;
};

const addToCart = (productId, quantity = 1) => {
  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id: productId, quantity });
  }
  setCart(cart);
  updateCartBadge();
};

const removeFromCart = (productId) => {
  const cart = getCart().filter((item) => item.id !== productId);
  setCart(cart);
  updateCartBadge();
};

const updateQuantity = (productId, delta) => {
  const cart = getCart();
  const item = cart.find((entry) => entry.id === productId);
  if (!item) return;
  item.quantity = Math.max(1, item.quantity + delta);
  setCart(cart);
  updateCartBadge();
};

const renderCart = () => {
  const cartWrapper = document.querySelector("[data-cart-items]");
  const summaryTotals = document.querySelectorAll("[data-cart-total]");
  const cart = getCart();
  let total = 0;
  cart.forEach((item) => {
    const product = products.find((entry) => entry.id === item.id);
    if (!product) return;
    total += product.price * item.quantity;
  });
  summaryTotals.forEach((el) => {
    el.textContent = formatCurrency(total);
  });
  if (!cartWrapper) return;
  cartWrapper.innerHTML = "";
  cart.forEach((item) => {
    const product = products.find((entry) => entry.id === item.id);
    if (!product) return;
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <img src="${product.image}" alt="${product.name}" loading="lazy">
      <div>
        <h3 class="product-title">${product.name}</h3>
        <p class="price">${formatCurrency(product.price)}</p>
        <div class="quantity" aria-label="Quantity selector">
          <button type="button" data-qty-minus="${product.id}" aria-label="Decrease quantity">-</button>
          <span>${item.quantity}</span>
          <button type="button" data-qty-plus="${product.id}" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <div>
        <button class="btn btn-outline" type="button" data-remove="${product.id}">Remove</button>
      </div>
    `;
    cartWrapper.appendChild(row);
  });
};

// Interactions
const initNavbar = () => {
  const header = document.querySelector("header");
  if (!header) return;
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add("shrink");
    } else {
      header.classList.remove("shrink");
    }
  };
  window.addEventListener("scroll", handleScroll);
  handleScroll();
};

const initNavDrawer = () => {
  const toggles = document.querySelectorAll("[data-nav-toggle]");
  const drawer = document.querySelector("[data-nav-drawer]");
  const overlay = document.querySelector("[data-nav-overlay]");
  const closeButton = document.querySelector("[data-nav-close]");
  if (!toggles.length || !drawer || !overlay) return;
  const openNav = () => {
    document.body.classList.add("nav-open");
    drawer.setAttribute("aria-hidden", "false");
    overlay.setAttribute("aria-hidden", "false");
  };
  const closeNav = () => {
    document.body.classList.remove("nav-open");
    drawer.setAttribute("aria-hidden", "true");
    overlay.setAttribute("aria-hidden", "true");
  };
  toggles.forEach((toggle) => toggle.addEventListener("click", openNav));
  if (closeButton) {
    closeButton.addEventListener("click", closeNav);
  }
  overlay.addEventListener("click", closeNav);
  drawer.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNav));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("nav-open")) {
      closeNav();
    }
  });
};

const initFadeIn = () => {
  const elements = document.querySelectorAll(".fade-in");
  if (!elements.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.2 }
  );
  elements.forEach((el) => observer.observe(el));
};

const initLightbox = () => {
  const triggers = document.querySelectorAll("[data-lightbox-trigger]");
  if (!triggers.length) return;
  let lightbox = document.querySelector("[data-lightbox]");
  if (!lightbox) {
    lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.dataset.lightbox = "";
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-label", "Image preview");
    lightbox.innerHTML = `
      <button class="lightbox-close" type="button" data-lightbox-close aria-label="Close image">
        Close
      </button>
      <img src="" alt="" data-lightbox-image />
    `;
    document.body.appendChild(lightbox);
  }
  const image = lightbox.querySelector("[data-lightbox-image]");
  const closeButton = lightbox.querySelector("[data-lightbox-close]");
  const openLightbox = (src, alt) => {
    if (!image) return;
    image.src = src;
    image.alt = alt || "";
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
  };
  const closeLightbox = () => {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
  };
  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      openLightbox(trigger.src, trigger.alt);
    });
  });
  if (closeButton) {
    closeButton.addEventListener("click", closeLightbox);
  }
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("active")) {
      closeLightbox();
    }
  });
};

const initFilters = () => {
  const filterButtons = document.querySelectorAll("[data-filter]");
  const productsGrid = document.querySelectorAll("[data-category]");
  if (!filterButtons.length || !productsGrid.length) return;
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      const filter = button.dataset.filter;
      productsGrid.forEach((card) => {
        const match = filter === "all" || card.dataset.category === filter;
        card.style.display = match ? "block" : "none";
      });
    });
  });
};

const initFAQ = () => {
  const toggles = document.querySelectorAll(".faq-toggle");
  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const item = toggle.closest(".faq-item");
      const isActive = item.classList.contains("active");

      // Optional: Close others
      document.querySelectorAll(".faq-item").forEach((i) => {
        i.classList.remove("active");
        i.querySelector(".faq-toggle").setAttribute("aria-expanded", "false");
      });

      if (!isActive) {
        item.classList.add("active");
        toggle.setAttribute("aria-expanded", "true");
      }
    });
  });
};

const initProductDetails = () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  // Only run on product detail page
  const isProductPage = document.querySelector("[data-product-name]");
  if (!isProductPage) return;

  if (!productId) {
    // Default to first product if no ID provided (or handle 404)
    // For this demo, let's just use the first product so the page isn't empty
    // window.location.search = `?id=${products[0].id}`;
    return;
  }

  const product = products.find((p) => p.id === productId);
  if (!product) return;

  // Update Main Info
  const els = {
    title: document.querySelector("[data-product-name]"),
    price: document.querySelector("[data-product-price]"),
    desc: document.querySelector("[data-product-description]"),
    mainImg: document.querySelector("[data-main-image]"),
    addToCart: document.querySelector("[data-add-to-cart]"),
  };

  if (els.title) els.title.textContent = product.name;
  if (els.price) els.price.textContent = formatCurrency(product.price);
  if (els.desc && product.description) els.desc.textContent = product.description;
  if (els.mainImg) {
    els.mainImg.src = product.image;
    els.mainImg.alt = product.name;
  }
  if (els.addToCart) {
    els.addToCart.dataset.addToCart = product.id;
  }

  // Update Active Thumb
  const thumbs = document.querySelectorAll("[data-thumb]");
  thumbs.forEach((thumb) => {
    thumb.classList.remove("active");
    if (thumb.getAttribute("src") === product.image) {
      thumb.classList.add("active");
    }
  });

  // Update Related Products
  const relatedContainer = document.querySelector("[data-related-products]");
  if (relatedContainer) {
    const related = products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 3);
    
    // Fill with others if needed
    if (related.length < 3) {
      const others = products.filter(
        (p) => p.category !== product.category && p.id !== product.id
      );
      while (related.length < 3 && others.length > 0) {
        related.push(others.shift());
      }
    }

    relatedContainer.innerHTML = related
      .map(
        (p) => `
        <article class="card product-card">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
          <div class="product-info">
            <h3 class="product-title">${p.name}</h3>
            <p class="price">${formatCurrency(p.price)}</p>
            <a class="btn btn-outline" href="product.html?id=${p.id}">View Details</a>
          </div>
        </article>
      `
      )
      .join("");
  }
};

const initAddToCart = () => {
  document.querySelectorAll("[data-add-to-cart]").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.addToCart;
      if (!productId) return;
      addToCart(productId, 1);
      button.textContent = "Added to Cart";
      setTimeout(() => {
        button.textContent = "Add to Cart";
      }, 1200);
    });
  });
};

const initGallery = () => {
  const mainImage = document.querySelector("[data-main-image]");
  const thumbs = document.querySelectorAll("[data-thumb]");
  if (!mainImage || !thumbs.length) return;
  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      mainImage.src = thumb.src;
      thumbs.forEach((img) => img.classList.remove("active"));
      thumb.classList.add("active");
    });
  });
};

const initCartActions = () => {
  document.addEventListener("click", (event) => {
    const plus = event.target.closest("[data-qty-plus]");
    const minus = event.target.closest("[data-qty-minus]");
    const remove = event.target.closest("[data-remove]");
    if (plus) {
      updateQuantity(plus.dataset.qtyPlus, 1);
      renderCart();
    }
    if (minus) {
      updateQuantity(minus.dataset.qtyMinus, -1);
      renderCart();
    }
    if (remove) {
      removeFromCart(remove.dataset.remove);
      renderCart();
    }
  });
};

// Boot
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initNavDrawer();
  initFadeIn();
  initLightbox();
  initFilters();
  initProductDetails();
  initFAQ();
  initAddToCart();
  initGallery();
  initCartActions();
  updateCartBadge();
  renderCart();
});
