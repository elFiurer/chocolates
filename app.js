document.addEventListener('DOMContentLoaded', () => {

  // ===================================
  // 1. DATOS Y ESTADO DE LA APLICACIÓN
  // ===================================
  const PRODUCTS = [
    { id: 'quinua-kiwicha', name: 'Quinua y Kiwicha', desc: 'Chocolate al 70% cacao con un crujiente mix de superalimentos andinos.', price: 15.00, img: 'imagen/quinua-kiwicha.jpg' },
    { id: 'aguaymanto', name: 'Aguaymanto', desc: 'El balance perfecto entre el dulzor y la acidez del aguaymanto deshidratado.', price: 15.00, img: 'imagen/aguaymanto.jpg' },
    { id: 'mix-frutas', name: 'Mix de Frutas', desc: 'Una explosión de sabores tropicales con nuestro chocolate al 70% cacao.', price: 15.00, img: 'imagen/mix-frutas.jpg' },
    { id: 'pina', name: 'Piña Tropical', desc: 'Trozos de piña deshidratada que aportan un toque exótico a nuestro chocolate.', price: 15.00, img: 'imagen/pina.jpg' },
    { id: 'arandanos-70', name: 'Arándanos', desc: 'Chocolate al 70% cacao con incrustaciones de arándanos antioxidantes.', price: 15.00, img: 'imagen/arandanos.jpg' },
    { id: 'almendras', name: 'Almendras Clásicas', desc: 'Chocolate con leche al 50% cacao con trozos generosos de almendras tostadas.', price: 15.00, img: 'imagen/almendras.jpg' },
    { id: 'cafe', name: 'Café de Altura', desc: 'Chocolate con leche al 50% fusionado con granos de café de origen único.', price: 15.00, img: 'imagen/cafe.jpg' },
    { id: 'lúcuma', name: 'Lúcumas Clásicas', desc: 'Deliciosos trozos de lúcuma bañados con leche al 50% cacao.', price: 15.00, img: 'imagen/lucuma.jpg' },
    { id: 'cerezas', name: 'Cerezas seleccionadas', desc: 'Chocolate con leche al 50% fusionado con cerezas de la mejor cosecha.', price: 15.00, img: 'imagen/cereza.jpg' },
    { id: 'chocolate dark', name: 'Chocolate Dark', desc: 'Deliciosa barra de chocolate al 70% cacao.', price: 15.00, img: 'imagen/chocolatedark.jpg' },
    { id: 'maní', name: 'Maní', desc: 'Deliciosa barra de chocolate con leche al 50% cacao, con granos de Maní.', price: 15.00, img: 'imagen/mani.jpg' },
    { id: 'almendras y maní', name: 'Almendras y Maní', desc: 'Deliciosa barra de chocolate con leche al 50% cacao, con granos de Almendras y Maní.', price: 15.00, img: 'imagen/almendrasymani.jpg' },
    { id: 'Bombones de Frambuesa', name: 'Bombones Frambuesa', desc: 'Bombones de frambuesa liofilizados , doble chocolate 70% cacao', price: 15.00, img: 'imagen/frambuesa.jpg' },
    { id: 'arandanos-100g', name: 'Arándanos Bañados', desc: 'Arándanos jugosos sumergidos en nuestro más puro chocolate al 70% cacao (100g).', price: 17.00, img: 'imagen/arandanos-100.jpg' },
    { id: 'almendras-100g', name: 'Almendras Bañadas', desc: 'Almendras enteras tostadas, cubiertas por chocolate al 70% cacao (100g).', price: 17.00, img: 'imagen/almendras-100.jpg' },
  ];
  let cart = [];
  // ===================================
  // 2. FUNCIONES DE DATOS (Manipulan el carrito, no el DOM)
  // ===================================
  const saveCart = () => localStorage.setItem('montcao_cart_v2', JSON.stringify(cart));
  const loadCart = () => { cart = JSON.parse(localStorage.getItem('montcao_cart_v2')) || []; };

  const addToCart = (id, qty) => {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) return;
    const item = cart.find(i => i.id === id);
    if (item) {
      item.quantity += qty;
    } else {
      cart.push({ id: product.id, name: product.name, price: product.price, img: product.img, quantity: qty });
    }
    saveCart();
  };

  const updateCartItemQuantity = (id, newQty) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    if (newQty <= 0) {
      cart = cart.filter(i => i.id !== id);
    } else {
      item.quantity = newQty;
    }
    saveCart();
  };

  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 && subtotal < 80 ? 8.00 : 0;
    const grandTotal = subtotal + shipping;
    return { subtotal, shipping, grandTotal };
  };

  const formatMoney = value => `S/ ${value.toFixed(2)}`;
  // ======================================================
  // 3. LÓGICA Y EVENTOS DE LA PÁGINA PRINCIPAL (index.html)
  // ======================================================
  function initIndexPage() {
    // --- Selectores del DOM ---
    const catalogGrid = document.getElementById('catalog-grid');
    const cartButton = document.getElementById('cart-button');
    const sideCart = document.getElementById('side-cart');
    const cartOverlay = document.getElementById('cart-overlay');

    // --- Funciones de Renderizado (UI) ---
    const updateCartCount = () => {
      document.getElementById('cart-count').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    };

    const renderSideCart = () => {
      const container = document.getElementById('side-cart-items');
      const subtotalEl = document.getElementById('cart-subtotal');
      if (cart.length === 0) {
        container.innerHTML = `<p class="empty-cart-message">Tu carrito está vacío.</p>`;
      } else {
        container.innerHTML = cart.map(item => `
          <div class="cart-item" data-id="${item.id}">
            <img src="${item.img}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
              <p><strong>${item.name}</strong></p><p>${formatMoney(item.price)}</p>
              <div class="cart-item-actions">
                <div class="quantity-selector"><button class="quantity-btn" data-action="decrease">-</button><input type="number" class="quantity-input" value="${item.quantity}" readonly><button class="quantity-btn" data-action="increase">+</button></div>
                <button class="remove-item-btn">Quitar</button>
              </div>
            </div>
          </div>`).join('');
      }
      subtotalEl.textContent = formatMoney(calculateTotals().subtotal);
    };

    const renderProducts = () => {
      catalogGrid.innerHTML = PRODUCTS.map(p => `
        <div class="product-card" data-id="${p.id}">
          <div class="product-image-container"><img src="${p.img}" alt="${p.name}" class="product-image"><button class="quick-view-btn">Vista Rápida</button></div>
          <div class="product-info">
            <h3 class="product-name">${p.name}</h3><p class="product-price">${formatMoney(p.price)}</p>
            <div class="product-actions"><div class="quantity-selector"><button class="quantity-btn" data-action="decrease">-</button><input type="number" class="quantity-input" value="1" min="1" readonly><button class="quantity-btn" data-action="increase">+</button></div><button class="add-to-cart-btn">Añadir</button></div>
          </div>
          <a href="catalogo.pdf" download="Catalogo-Montcao.pdf" class="download-catalog-btn">
    Descargar Catálogo
</a>
        </div>`).join('');
    };

    const showToast = (message) => {
      const toast = document.getElementById('toast-notification');
      toast.querySelector('#toast-message').textContent = message;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3000);
    };

    const flashCartIcon = () => {
      cartButton.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.2)' }, { transform: 'scale(1)' }], { duration: 300 });
    };
    // --- Lógica del Modal (VISTA RÁPIDA) ---
    const openModal = (id) => {
      const modal = document.getElementById('product-modal');
      const product = PRODUCTS.find(p => p.id === id);
      if (!product) return;

      modal.querySelector('#modal-img').src = product.img;
      modal.querySelector('#modal-name').textContent = product.name;
      modal.querySelector('#modal-price').textContent = formatMoney(product.price);
      modal.querySelector('#modal-desc').textContent = product.desc;
      modal.querySelector('#modal-add-to-cart-btn').dataset.id = id;
      modal.querySelector('.quantity-input').value = 1;
      modal.classList.add('active');
    };

    const closeModal = () => {
      const modal = document.getElementById('product-modal');
      modal.classList.remove('active');
    };

    // --- Inicialización y Eventos ---
    renderProducts();
    updateCartCount();
    renderSideCart();
    new Swiper('.review-slider', { loop: true, autoplay: { delay: 5000 }, pagination: { el: '.swiper-pagination', clickable: true } });

    // --- Lógica para el Menú Hamburguesa ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const pageLinks = document.querySelectorAll('.nav-links a'); // Selecciona todos los links del menú

    // 1. Abre y cierra el menú al hacer clic en la hamburguesa
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // 2. Cierra el menú automáticamente al hacer clic en un enlace
    pageLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
        }
      });
    });
    catalogGrid.addEventListener('click', e => {
      const card = e.target.closest('.product-card');
      if (!card) return;
      const id = card.dataset.id;
      const qtyInput = card.querySelector('.quantity-input');

      // CAMBIO: Ahora escucha el clic en el contenedor de la imagen
      if (e.target.closest('.product-image-container')) {
        openModal(id);
      }

      if (e.target.matches('.add-to-cart-btn')) {
        addToCart(id, parseInt(qtyInput.value));
        showToast(`"${PRODUCTS.find(p => p.id === id).name}" agregado.`);
        flashCartIcon();
        updateCartCount();
        renderSideCart();
        qtyInput.value = 1;
      }
      if (e.target.matches('.quantity-btn')) {
        let qty = parseInt(qtyInput.value);
        if (e.target.dataset.action === 'increase') qty++;
        else if (qty > 1) qty--;
        qtyInput.value = qty;
      }
    });
    // Eventos para el modal: cerrar, cantidad y agregar
    const modal = document.getElementById('product-modal');
    modal.addEventListener('click', e => {
      // Lógica para cerrar el modal
      if (e.target.matches('.modal-overlay, .modal-close-btn')) {
        closeModal();
      }

      // LÓGICA AÑADIDA: Para los botones de cantidad +/-
      if (e.target.matches('.quantity-btn')) {
        const qtyInput = modal.querySelector('.quantity-input');
        let qty = parseInt(qtyInput.value);
        if (e.target.dataset.action === 'increase') {
          qty++;
        } else if (qty > 1) {
          qty--;
        }
        qtyInput.value = qty;
      }

      // Lógica para el botón de "Agregar al Carrito"
      if (e.target.matches('#modal-add-to-cart-btn')) {
        const id = e.target.dataset.id;
        const qty = parseInt(modal.querySelector('.quantity-input').value);
        addToCart(id, qty);
        showToast(`"${PRODUCTS.find(p => p.id === id).name}" agregado.`);
        flashCartIcon();
        updateCartCount();
        renderSideCart();
        closeModal();
      }
    });



    cartButton.addEventListener('click', () => { sideCart.classList.add('active'); cartOverlay.classList.add('active'); });
    document.getElementById('close-cart-btn').addEventListener('click', () => { sideCart.classList.remove('active'); cartOverlay.classList.remove('active'); });
    cartOverlay.addEventListener('click', () => { sideCart.classList.remove('active'); cartOverlay.classList.remove('active'); });

    sideCart.addEventListener('click', e => {
      const itemNode = e.target.closest('.cart-item');
      if (!itemNode) return;
      const id = itemNode.dataset.id;

      if (e.target.matches('.remove-item-btn')) {
        updateCartItemQuantity(id, 0);
      } else if (e.target.matches('.quantity-btn')) {
        const itemData = cart.find(i => i.id === id);
        let qty = itemData.quantity;
        if (e.target.dataset.action === 'increase') qty++;
        else if (qty > 0) qty--; // Permite bajar hasta 0 para eliminar
        updateCartItemQuantity(id, qty);
      }
      updateCartCount();
      renderSideCart();
    });
  }
  // ======================================================
  // 4. LÓGICA Y EVENTOS DE LA PÁGINA DE CHECKOUT (cart.html)
  // ======================================================
  function initCheckoutPage() {
    const summaryContainer = document.getElementById('summary-items-container');
    const sendWhatsAppBtn = document.getElementById('send-whatsapp-btn');

    const renderCheckoutSummary = () => {
      const subtotalEl = document.getElementById('summary-subtotal');
      const shippingEl = document.getElementById('summary-shipping');
      const grandTotalEl = document.getElementById('summary-grand-total');

      if (cart.length === 0) {
        summaryContainer.innerHTML = `<p>Tu carrito está vacío. <a href="index.html">Vuelve a la tienda</a>.</p>`;
        sendWhatsAppBtn.disabled = true;
        sendWhatsAppBtn.style.opacity = '0.6';
      } else {
        summaryContainer.innerHTML = cart.map(item => `
          <div class="summary-item" data-id="${item.id}">
            <img src="${item.img}" alt="${item.name}" class="summary-item-img">
            <div class="summary-item-details">
              <p><strong>${item.name}</strong></p>
              <div class="summary-item-actions">
                <div class="quantity-selector"><button class="quantity-btn" data-action="decrease">-</button><input type="number" class="quantity-input" value="${item.quantity}" readonly><button class="quantity-btn" data-action="increase">+</button></div>
                <button class="remove-item-btn">Eliminar</button>
              </div>
            </div>
            <span class="summary-item-price">${formatMoney(item.price * item.quantity)}</span>
          </div>`).join('');
        sendWhatsAppBtn.disabled = false;
        sendWhatsAppBtn.style.opacity = '1';
      }

      const { subtotal, shipping, grandTotal } = calculateTotals();
      subtotalEl.textContent = formatMoney(subtotal);
      shippingEl.textContent = formatMoney(shipping);
      grandTotalEl.textContent = formatMoney(grandTotal);
    };

    summaryContainer.addEventListener('click', e => {
      const itemNode = e.target.closest('.summary-item');
      if (!itemNode) return;
      const id = itemNode.dataset.id;

      if (e.target.matches('.remove-item-btn')) {
        updateCartItemQuantity(id, 0);
      } else if (e.target.matches('.quantity-btn')) {
        const itemData = cart.find(i => i.id === id);
        let qty = itemData.quantity;
        if (e.target.dataset.action === 'increase') {
          qty++;
        } else if (qty > 1) { // En checkout, no permitimos bajar de 1, se usa el botón eliminar
          qty--;
        }
        updateCartItemQuantity(id, qty);
      }
      renderCheckoutSummary(); // Vuelve a dibujar todo el resumen
    });

    sendWhatsAppBtn.addEventListener('click', () => {
      if (cart.length === 0) return;
      const WHATSAPP_NUMBER = '51967122591'; // Reemplaza con tu número
      const { subtotal, shipping, grandTotal } = calculateTotals();
      let message = `*¡Hola MONTCAO!* 🍫\n\nQuisiera hacer el siguiente pedido:\n\n`;
      cart.forEach(item => {
        message += `• ${item.name} (x${item.quantity}) - ${formatMoney(item.price * item.quantity)}\n`;
      });
      message += `\n-------------------------\n*Subtotal:* ${formatMoney(subtotal)}\n*Envío:* ${formatMoney(shipping)}\n*TOTAL A PAGAR:* *${formatMoney(grandTotal)}*\n\nQuedo a la espera de la confirmación.`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    });

    renderCheckoutSummary();
  }
  // ===================================
  // 5. INICIALIZADOR GENERAL
  // ===================================
  function init() {
    loadCart();
    if (document.getElementById('catalog-grid')) {
      initIndexPage();
    } else if (document.getElementById('checkout-page')) {
      initCheckoutPage();
    }
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  init();
});