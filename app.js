// CÓDIGO COMPLETO Y FINAL PARA APP.JS

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. ESTADO Y DATOS ---
  const PRODUCTS = [
    { id: 'quinua-kiwicha', name: 'Quinua y Kiwicha', desc: 'Chocolate al 70% cacao con un crujiente mix de superalimentos andinos: Quinua y Kiwicha. Una tableta llena de textura y sabor.', price: 15.00, img: 'imagen/quinua-kiwicha.jpg' },
    { id: 'aguaymanto', name: 'Aguaymanto', desc: 'El balance perfecto entre el dulzor y la acidez del aguaymanto deshidratado, cubierto por nuestro intenso chocolate al 70% cacao.', price: 15.00, img: 'imagen/aguaymanto.jpg' },
    { id: 'mix-frutas', name: 'Mix de Frutas', desc: 'Una explosión de sabores tropicales. Chocolate al 70% cacao con un mix de nuestras mejores frutas deshidratadas.', price: 15.00, img: 'imagen/mix-frutas.jpg' },
    { id: 'pina', name: 'Piña Tropical', desc: 'Trozos de piña deshidratada que aportan un toque dulce y exótico a nuestro clásico chocolate al 70% cacao.', price: 15.00, img: 'imagen/pina.jpg' },
    { id: 'arandanos-70', name: 'Arándanos', desc: 'Chocolate al 70% cacao con incrustaciones de arándanos, conocidos por sus propiedades antioxidantes y su delicioso sabor.', price: 15.00, img: 'imagen/arandanos.jpg' },
    { id: 'almendras', name: 'Almendras Clásicas', desc: 'Chocolate con leche al 50% cacao con trozos generosos de almendras tostadas. Un clásico irresistible.', price: 15.00, img: 'imagen/almendras.jpg' },
    { id: 'cafe', name: 'Café de Altura', desc: 'Para los amantes del café, nuestro chocolate con leche al 50% se fusiona con granos de café de origen único, molidos finamente.', price: 15.00, img: 'imagen/cafe.jpg' },
    { id: 'arandanos-100g', name: 'Arándanos Bañados', desc: 'Arándanos deshidratados, jugosos y suaves, sumergidos uno a uno en nuestro más puro chocolate al 70% cacao. Presentación de 100g.', price: 17.00, img: 'imagen/arandanos-100.jpg' },
    { id: 'almendras-100g', name: 'Almendras Bañadas', desc: 'Almendras enteras y tostadas, cubiertas por una capa gruesa de chocolate al 70% cacao. Un snack perfecto en presentación de 100g.', price: 17.00, img: 'imagen/almendras-100.jpg' },
  ];
  let cart = [];

  // --- 2. FUNCIONES DE UTILIDAD ---
  const formatMoney = value => `S/ ${value.toFixed(2)}`;
  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 && subtotal < 80 ? 8.00 : 0;
    const grandTotal = subtotal + shipping;
    return { subtotal, shipping, grandTotal };
  };

  // --- 3. PERSISTENCIA DEL CARRITO ---
  const saveCart = () => localStorage.setItem('montcao_cart_v2', JSON.stringify(cart));
  const loadCart = () => { cart = JSON.parse(localStorage.getItem('montcao_cart_v2')) || []; };

  // --- 4. LÓGICA PÁGINA PRINCIPAL (INDEX) ---
  function initIndexPage() {
    const catalogGrid = document.getElementById('catalog-grid');
    const cartCountEl = document.getElementById('cart-count');
    const cartButton = document.getElementById('cart-button');
    const modal = document.getElementById('product-modal');
    const sideCart = document.getElementById('side-cart');
    const cartOverlay = document.getElementById('cart-overlay');
    const toast = document.getElementById('toast-notification');
    const hamburgerBtn = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const closeCartBtn = document.getElementById('close-cart-btn');

    const updateCartCount = () => {
      cartCountEl.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
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
                <p><strong>${item.name}</strong></p> <p>${formatMoney(item.price)}</p>
                <div class="cart-item-actions">
                    <div class="quantity-selector">
                    <button class="quantity-btn" data-action="decrease">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" readonly>
                    <button class="quantity-btn" data-action="increase">+</button>
                    </div>
                    <button class="remove-item-btn" data-id="${item.id}">Quitar</button>
                </div></div></div>`).join('');
        }
        subtotalEl.textContent = formatMoney(calculateTotals().subtotal);
    };

    const updateUI = () => { updateCartCount(); renderSideCart(); saveCart(); };
    
    const addToCart = (id, qty) => {
        const product = PRODUCTS.find(p => p.id === id);
        if (!product) return;
        const item = cart.find(i => i.id === id);
        if (item) { item.quantity += qty; }
        else { cart.push({ ...product, quantity: qty }); }
        showToast(`"${product.name}" fue agregado.`);
        updateUI();
    };

    const updateCartItemQuantity = (id, newQty) => {
        const item = cart.find(i => i.id === id);
        if (!item) return;
        if (newQty <= 0) { cart = cart.filter(i => i.id !== id); }
        else { item.quantity = newQty; }
        updateUI();
    };

    const renderProducts = () => {
        catalogGrid.innerHTML = PRODUCTS.map(p => `
        <div class="product-card" data-id="${p.id}"><div class="product-image-container">
            <img src="${p.img}" alt="${p.name}" class="product-image">
            <button class="quick-view-btn" data-id="${p.id}">Vista Rápida</button>
        </div><div class="product-info">
            <h3 class="product-name">${p.name}</h3><p class="product-price">${formatMoney(p.price)}</p>
            <div class="product-actions"><div class="quantity-selector">
            <button class="quantity-btn" data-action="decrease">-</button>
            <input type="number" class="quantity-input" value="1" min="1" readonly>
            <button class="quantity-btn" data-action="increase">+</button>
            </div><button class="add-to-cart-btn" data-id="${p.id}">Añadir</button>
            </div></div></div>`).join('');
    };
    const showToast = (msg) => {
        const toastMsg = document.getElementById('toast-message');
        toastMsg.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    };

    // Lógica de componentes (modal, cart, etc.)
    const openModal = (id) => {
        const p = PRODUCTS.find(p => p.id === id);
        if (!p) return;
        modal.querySelector('#modal-img').src = p.img;
        modal.querySelector('#modal-name').textContent = p.name;
        modal.querySelector('#modal-price').textContent = formatMoney(p.price);
        modal.querySelector('#modal-desc').textContent = p.desc;
        modal.querySelector('#modal-add-to-cart-btn').dataset.id = id;
        modal.querySelector('.quantity-input').value = 1;
        modal.classList.add('active');
    };
    const closeModal = () => modal.classList.remove('active');
    const openCart = () => { sideCart.classList.add('active'); cartOverlay.classList.add('active'); };
    const closeCart = () => { sideCart.classList.remove('active'); cartOverlay.classList.remove('active'); };

    // --- Eventos Página Principal ---
    renderProducts();
    updateUI();
    new Swiper('.review-slider', { loop: true, autoplay: { delay: 5000 }, pagination: { el: '.swiper-pagination', clickable: true }, grabCursor: true });
    
    catalogGrid.addEventListener('click', e => {
      const card = e.target.closest('.product-card');
      if (!card) return;
      const id = card.dataset.id;
      const qtyInput = card.querySelector('.quantity-input');
      if (e.target.matches('.quick-view-btn')) openModal(id);
      if (e.target.matches('.add-to-cart-btn')) { addToCart(id, parseInt(qtyInput.value)); qtyInput.value = 1; }
      if (e.target.matches('.quantity-btn')) {
        let qty = parseInt(qtyInput.value);
        if (e.target.dataset.action === 'increase') qty++;
        else if (qty > 1) qty--;
        qtyInput.value = qty;
      }
    });

    modal.addEventListener('click', e => {
      if (e.target.matches('.modal-overlay, .modal-close-btn')) closeModal();
      if (e.target.matches('#modal-add-to-cart-btn')) {
        const id = e.target.dataset.id;
        const qty = parseInt(modal.querySelector('.quantity-input').value);
        addToCart(id, qty);
        closeModal();
      }
    });

    cartButton.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
    
    sideCart.addEventListener('click', e => {
        const item = e.target.closest('.cart-item');
        if(!item) return;
        const id = item.dataset.id;
        if(e.target.matches('.remove-item-btn')) updateCartItemQuantity(id, 0);
        if(e.target.matches('.quantity-btn')) {
            let qty = parseInt(item.querySelector('.quantity-input').value);
            if (e.target.dataset.action === 'increase') qty++; else qty--;
            updateCartItemQuantity(id, qty);
        }
    });

    hamburgerBtn.addEventListener('click', () => navLinks.classList.toggle('active'));
    navLinks.addEventListener('click', e => { if (e.target.matches('a')) navLinks.classList.remove('active'); });
  }

  // --- 5. LÓGICA PÁGINA CHECKOUT (CART) ---
  function initCheckoutPage() {
    const summaryContainer = document.getElementById('summary-items-container');
    const subtotalEl = document.getElementById('summary-subtotal');
    const shippingEl = document.getElementById('summary-shipping');
    const grandTotalEl = document.getElementById('summary-grand-total');
    const sendWhatsAppBtn = document.getElementById('send-whatsapp-btn');
    
    const renderCheckoutSummary = () => {
      if (cart.length === 0) {
        summaryContainer.innerHTML = `<p>Tu carrito está vacío. <a href="index.html">Vuelve a la tienda</a> para agregar productos.</p>`;
        sendWhatsAppBtn.disabled = true;
        sendWhatsAppBtn.style.cssText = 'opacity: 0.6; cursor: not-allowed;';
      } else {
        summaryContainer.innerHTML = cart.map(item => `
          <div class="summary-item"><img src="${item.img}" alt="${item.name}" class="summary-item-img">
            <div class="summary-item-details"><p><strong>${item.name}</strong></p><p>Cantidad: ${item.quantity}</p></div>
            <span class="summary-item-price">${formatMoney(item.price * item.quantity)}</span>
          </div>`).join('');
      }
      const { subtotal, shipping, grandTotal } = calculateTotals();
      subtotalEl.textContent = formatMoney(subtotal);
      shippingEl.textContent = formatMoney(shipping);
      grandTotalEl.textContent = formatMoney(grandTotal);
    };

    const sendWhatsAppMessage = () => {
      if (cart.length === 0) { alert("Tu carrito está vacío."); return; }
      
      const WHATSAPP_NUMBER = '51967122591'; // ¡IMPORTANTE! Reemplaza este número
      
      const { subtotal, shipping, grandTotal } = calculateTotals();
      let message = `*¡Hola MONTCAO!* 🍫\n\nQuisiera hacer el siguiente pedido:\n\n`;
      cart.forEach(item => {
        message += `• ${item.name} (x${item.quantity}) - ${formatMoney(item.price * item.quantity)}\n`;
      });
      message += `\n-------------------------\n*Subtotal:* ${formatMoney(subtotal)}\n*Envío:* ${formatMoney(shipping)}\n*TOTAL A PAGAR:* *${formatMoney(grandTotal)}*\n\nQuedo a la espera de la confirmación para coordinar la entrega. ¡Gracias!`;
      
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    };

    renderCheckoutSummary();
    sendWhatsAppBtn.addEventListener('click', sendWhatsAppMessage);
  }

  // --- 6. INICIALIZADOR GENERAL ---
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