// app.js
document.addEventListener('DOMContentLoaded', () => {

  // ===================================
  // 1. DATOS Y ESTADO DE LA APLICACIÓN
  // ===================================
  const PRODUCTS = [
    { id: 'quinua-kiwicha', name: 'Quinua y Kiwicha', desc: 'Chocolate en barra al 70% cacao con un crujiente mix de superalimentos andinos.', price: 15.90, img: 'imagen/quinua-kiwicha.jpg' },
    { id: 'mix-frutas', name: 'Mix de Frutas', desc: 'Una explosión de sabores tropicales en barra con fruta deshidratada y chocolate al 70% cacao.', price: 15.90, img: 'imagen/mix-frutas.jpg' },
    { id: 'chocolate dark', name: 'Chocolate Dark', desc: 'Deliciosa barra de chocolate oscuro al 70% cacao.', price: 15.90, img: 'imagen/chocolatedark.jpg' },
    { id: 'arandanos-70', name: 'Arándanos', desc: 'Chocolate en barra al 70% cacao con incrustaciones de arándanos antioxidantes.', price: 15.90, img: 'imagen/arandanos.jpg' },
    { id: 'cerezas', name: 'Cerezas seleccionadas', desc: 'Barra de chocolate al 70% de cacao fusionado con cerezas deshidratadas de la mejor cosecha.', price: 15.90, img: 'imagen/cereza.jpg' },
    { id: 'pina', name: 'Piña Tropical', desc: 'En barra con trozos de piña deshidratada que aportan un toque exótico a nuestro chocolate.', price: 15.90, img: 'imagen/pina.jpg' },
    { id: 'lúcuma', name: 'Lúcumas Clásicas', desc: 'Deliciosos trozos de lúcuma en barra bañados con leche al 50% cacao.', price: 15.90, img: 'imagen/lucuma.jpg' },
    { id: 'aguaymanto', name: 'Aguaymanto', desc: 'Chocolate en barra con el balance perfecto entre el dulzor y la acidez del aguaymanto deshidratado.', price: 15.90, img: 'imagen/aguaymanto.jpg' },
    { id: 'almendras y maní', name: 'Almendras y Maní', desc: 'Deliciosa barra de chocolate con leche al 50% cacao, con granos de Almendras y Maní.', price: 15.90, img: 'imagen/almendrasymani.jpg' },
    { id: 'almendras', name: 'Almendras Clásicas', desc: 'Chocolate en barra con leche al 50% cacao con trozos generosos de almendras tostadas.', price: 15.90, img: 'imagen/almendras.jpg' },
    { id: 'cafe', name: 'Café de Altura', desc: 'Chocolate en barra con leche al 50% fusionado con granos de café de origen único.', price: 15.90, img: 'imagen/cafe.jpg' },
    { id: 'maní', name: 'Maní', desc: 'Deliciosa barra de chocolate con leche al 50% cacao, con granos de Maní.', price: 15.90, img: 'imagen/mani.jpg' },
    { id: 'Bombones de Frambuesa', name: 'Bombones Frambuesa', desc: 'Bombones de frambuesa liofilizados , doble chocolate 70% cacao', price: 18.90, img: 'imagen/frambuesa.jpg' },
    { id: 'almendras-100g', name: 'Almendras Bañadas', desc: 'Almendras enteras tostadas, cubiertas por chocolate al 70% cacao (100g).', price: 17.90, img: 'imagen/almendras-100.jpg' },
    { id: 'arandanos-100g', name: 'Arándanos Bañados', desc: 'Arándanos deshidratados sumergidos en nuestro más puro chocolate al 70% cacao (100g).', price: 17.90, img: 'imagen/arandanos-100.jpg' },
    { id: 'quinua-pop-100g', name: 'Quinua Pop', desc: 'Crujiente quinua pop bañada en la intensidad de nuestro chocolate artesanal con 70% cacao. Una experiencia de sabor y textura única en cada bocado (100g).', price: 17.90, img: 'imagen/quinua-pop-100.jpg' },
  ];
  // Nueva lista de productos que estarán "pronto disponibles"
  const COMING_SOON_PRODUCTS = ['aguaymanto', 'pina', 'lúcuma', 'almendras y maní'];

  let cart = [];
  // ===================================
  // 2. FUNCIONES DE DATOS (Manipulan el carrito, no el DOM)
  // ===================================
  const saveCart = () => localStorage.setItem('montcao_cart_v2', JSON.stringify(cart));
  const loadCart = () => { cart = JSON.parse(localStorage.getItem('montcao_cart_v2')) || []; };

  const addToCart = (id, qty, isReservation = false) => {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) return;
    const item = cart.find(i => i.id === id);
    if (item) {
      item.quantity += qty;
    } else {
      cart.push({ id: product.id, name: product.name, price: product.price, img: product.img, quantity: qty, isReservation });
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
    const shipping = 0;
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
        container.innerHTML = cart.map(item => {
          const reservationText = item.isReservation ? ' <span class="reservation-text">(Reserva)</span>' : '';
          return `
          <div class="cart-item" data-id="${item.id}">
            <img src="${item.img}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
              <p><strong>${item.name}${reservationText}</strong></p><p>${formatMoney(item.price)}</p>
              <div class="cart-item-actions">
                <div class="quantity-selector"><button class="quantity-btn" data-action="decrease">-</button><input type="number" class="quantity-input" value="${item.quantity}" readonly><button class="quantity-btn" data-action="increase">+</button></div>
                <button class="remove-item-btn">Quitar</button>
              </div>
            </div>
          </div>`;
        }).join('');
      }
      subtotalEl.textContent = formatMoney(calculateTotals().subtotal);
    };
    const renderProducts = (category = 'todos') => {
      let filteredProducts = PRODUCTS;

      if (category === 'barras') {
        filteredProducts = PRODUCTS.filter(p => p.desc.toLowerCase().includes('barra'));
      } else if (category === 'grajeas') {
        filteredProducts = PRODUCTS.filter(p => p.desc.toLowerCase().includes('(100g)'));
      } else if (category === 'bombones') {
        filteredProducts = PRODUCTS.filter(p => p.desc.toLowerCase().includes('bombones'));
      }

      if (filteredProducts.length === 0) {
        catalogGrid.innerHTML = `<p class="empty-category-message">No hay productos en esta categoría.</p>`;
        return;
      }

      // 👇 ESTA ES LA PARTE QUE FALTABA
      catalogGrid.innerHTML = filteredProducts.map(p => {
        const isComingSoon = COMING_SOON_PRODUCTS.includes(p.id);

        const statusHtml = isComingSoon ? `<p class="product-status-text">Pronto disponible</p>` : '';

        const actionHtml = isComingSoon
          ? `<button class="btn btn-coming-soon" data-id="${p.id}">Reserva ahora</button>`
          : `
        <div class="product-actions">
          <div class="quantity-selector">
            <button class="quantity-btn" data-action="decrease">-</button>
            <input type="number" class="quantity-input" value="1" min="1" readonly>
            <button class="quantity-btn" data-action="increase">+</button>
          </div>
          <button class="btn btn-primary add-to-cart-btn">Añadir</button>
        </div>
      `;

        return `
      <div class="product-card" data-id="${p.id}">
        <div class="product-image-container">
          <img src="${p.img}" alt="${p.name}" class="product-image">
          <div class="product-overlay">
            <button class="quick-view-btn">Vista Rápida</button>
          </div>
          ${statusHtml}
        </div>
        <div class="product-info">
          <h3 class="product-name">${p.name}</h3>
          <p class="product-price">${formatMoney(p.price)}</p>
          ${actionHtml}
        </div>
      </div>
    `;
      }).join('');
    };

    // Reemplaza la función original con esta versión mejorada


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
    // --- Lógica del Modal (VISTA RÁPIDA) ---
    const openModal = (id) => {
      const modal = document.getElementById('product-modal');
      const product = PRODUCTS.find(p => p.id === id);
      if (!product) return;

      const isComingSoon = COMING_SOON_PRODUCTS.includes(id);
      const modalActions = modal.querySelector('.modal-actions');

      modal.querySelector('#modal-img').src = product.img;
      modal.querySelector('#modal-name').textContent = product.name;
      modal.querySelector('#modal-price').textContent = formatMoney(product.price);
      modal.querySelector('#modal-desc').textContent = product.desc;

      // Actualizar el botón y el input de cantidad en el modal
      if (isComingSoon) {
        modalActions.innerHTML = `<button class="btn btn-coming-soon">Pronto disponible</button>`;
      } else {
        modalActions.innerHTML = `
          <div class="quantity-selector">
            <button class="quantity-btn" data-action="decrease">-</button>
            <input type="number" class="quantity-input" value="1" min="1">
            <button class="quantity-btn" data-action="increase">+</button>
          </div>
          <button id="modal-add-to-cart-btn" class="btn btn-primary" data-id="${id}">Agregar al Carrito</button>
        `;
      }
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

    // --- Lógica para el Menú de Categorías ---
    const categoryMenu = document.querySelector('.category-menu');
    if (categoryMenu) {
      categoryMenu.addEventListener('click', e => {
        const link = e.target.closest('a'); // Buscamos el enlace más cercano al clic
        if (!link) return; // Si no se hizo clic en un enlace, no hacemos nada

        const category = link.dataset.category;

        // Si el enlace tiene una categoría para filtrar (no es el de promociones)
        if (category) {
          e.preventDefault(); // Evitamos que la página salte hacia arriba

          // Actualizamos cuál es el elemento activo para que se vea resaltado
          const activeLi = categoryMenu.querySelector('li.active');
          if (activeLi) {
            activeLi.classList.remove('active');
          }
          link.closest('li').classList.add('active');

          // Finalmente, volvemos a dibujar los productos con el filtro aplicado
          renderProducts(category);
          document.getElementById('productos').scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
    catalogGrid.addEventListener('click', e => {
      const card = e.target.closest('.product-card');
      if (!card) return;
      const id = card.dataset.id;
      const qtyInput = card.querySelector('.quantity-input');

      // Abre el modal al hacer clic en la imagen o el botón de vista rápida
      if (e.target.closest('.product-image-container') || e.target.matches('.quick-view-btn')) {
        openModal(id);
      }
      // Lógica para el botón "Añadir"
      if (e.target.matches('.add-to-cart-btn')) {
        addToCart(id, parseInt(qtyInput.value));
        showToast(`"${PRODUCTS.find(p => p.id === id).name}" agregado.`);
        flashCartIcon();
        updateCartCount();
        renderSideCart();
        qtyInput.value = 1;
      }
      // Lógica para el botón "Reserva ahora"
      if (e.target.matches('.btn-coming-soon')) {
        addToCart(id, 1, true); // Añade el producto como reserva
        showToast(`"${PRODUCTS.find(p => p.id === id).name}" agregado como reserva.`);
        flashCartIcon();
        updateCartCount();
        renderSideCart();
      }
      // Lógica para los botones de cantidad
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
        if (!COMING_SOON_PRODUCTS.includes(id)) {
          const qty = parseInt(modal.querySelector('.quantity-input').value);
          addToCart(id, qty);
          showToast(`"${PRODUCTS.find(p => p.id === id).name}" agregado.`);
          flashCartIcon();
          updateCartCount();
          renderSideCart();
          closeModal();
        }
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
