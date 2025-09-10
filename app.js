/* app.js
 - Maneja catálogo, carrito (persistente en localStorage), dropdown del carrito y la página cart.html
 - Reemplaza YOUR_WHATSAPP_NUMBER por el número destino real (ej: 51912345678)
*/

const STORAGE_KEY = 'montcao_cart_v1';

/* ---------------------------
   Catálogo real de MONTCAO
   --------------------------- */
const PRODUCTS = [
  { id: 'quinua-kiwicha', name: 'Quinua y Kiwicha', desc: 'Chocolate al 70% cacao con cereales andinos (Quinua y Kiwicha).', price: 15.00, sizeLabel: '70g', img: 'imagen/quinua-kiwicha.jpg' },
  { id: 'aguaymanto', name: 'Aguaymanto', desc: 'Chocolate al 70% cacao con Aguaymanto.', price: 15.00, sizeLabel: '70g', img: 'imagen/aguaymanto.jpg' },
  { id: 'mix-frutas', name: 'Mix de Frutas', desc: 'Chocolate al 70% cacao con mix de frutas.', price: 15.00, sizeLabel: '70g', img: 'imagen/mix-frutas.jpg' },
  { id: 'pina', name: 'Piña', desc: 'Chocolate al 70% cacao con Piña.', price: 15.00, sizeLabel: '70g', img: 'imagen/pina.jpg' },
  { id: 'cerezas', name: 'Cerezas', desc: 'Chocolate al 70% cacao con Cerezas.', price: 15.00, sizeLabel: '70g', img: 'imagen/cerezas.jpg' },
  { id: 'lucuma', name: 'Lúcuma', desc: 'Chocolate al 70% cacao con Lúcuma.', price: 15.00, sizeLabel: '70g', img: 'imagen/lucuma.jpg' },
  { id: 'dark', name: 'Chocolate Dark', desc: 'Chocolate Dark al 70% cacao.', price: 15.00, sizeLabel: '70g', img: 'imagen/dark.jpg' },
  { id: 'arandanos', name: 'Arándanos', desc: 'Chocolate al 70% cacao con incrustaciones de Arándanos.', price: 15.00, sizeLabel: '70g', img: 'imagen/arandanos.jpg' },
  { id: 'almendras', name: 'Almendras', desc: 'Chocolate con leche al 50% cacao con granos de Almendra.', price: 15.00, sizeLabel: '70g', img: 'imagen/almendras.jpg' },
  { id: 'mani', name: 'Maní', desc: 'Chocolate con leche al 50% cacao con granos de Maní.', price: 15.00, sizeLabel: '70g', img: 'imagen/mani.jpg' },
  { id: 'cafe', name: 'Café', desc: 'Chocolate con leche al 50% cacao con el mejor café.', price: 15.00, sizeLabel: '70g', img: 'imagen/cafe.jpg' },
  { id: 'almendras-mani', name: 'Almendras y Maní', desc: 'Chocolate con leche al 50% cacao con granos de Almendras y Maní.', price: 15.00, sizeLabel: '70g', img: 'imagen/almendras-mani.jpg' },
  { id: 'arandanos100', name: 'Arándanos 100g', desc: 'Arándanos deshidratados bañados en chocolate al 70% cacao.', price: 17.00, sizeLabel: '100g', img: 'imagen/arandanos-100.jpg' },
  { id: 'almendras100', name: 'Almendras 100g', desc: 'Almendras tostadas bañadas en chocolate al 70% cacao.', price: 17.00, sizeLabel: '100g', img: 'imagen/almendras-100.jpg' },
];


/* ---------------------------
   Carrito: persistencia y utilitarios
   --------------------------- */
let cart = loadCart();

function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  renderCartDropdown();
}

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error cargando carrito', e);
    return [];
  }
}

const formatMoney = v => `S/ ${(v).toFixed(2)}`;

/* ---------------------------
   Funciones: catálogo (index)
   --------------------------- */


function addToCart(productId, qty = 1) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      sizeLabel: product.sizeLabel,
      unitPrice: product.price,
      qty,
      img: product.img
    });
  }
  saveCart();
  flashAdded();
}



function removeFromCart(index) {
  if (index < 0 || index >= cart.length) return;
  cart.splice(index, 1);
  saveCart();
}

function clearCart() {
  cart = [];
  saveCart();
}

/* Totales */
function calcTotals() {
  const subtotal = cart.reduce((s, it) => s + it.unitPrice * it.qty, 0);
  const shipping = subtotal >= 80 && subtotal > 0 ? 0 : (subtotal > 0 ? 8.00 : 0.00);
  const total = subtotal + shipping;
  return { subtotal, shipping, total };
}

/* ---------------------------
   Dropdown del header
   --------------------------- */
function renderCartDropdown() {
  const countEl = document.getElementById('cart-count');
  const dd = document.getElementById('dropdown-items');
  const subtotalEl = document.getElementById('dd-subtotal');
  if (countEl) countEl.textContent = cart.reduce((s, it) => s + it.qty, 0);
  if (!dd) return;
  dd.innerHTML = '';
  if (cart.length === 0) {
    dd.innerHTML = '<p class="empty">No hay productos aún.</p>';
  } else {
    cart.forEach((item, idx) => {
      const div = document.createElement('div');
      div.className = 'dd-item';
      div.innerHTML = `
        <img src="${item.img}" alt="${escapeHtml(item.name)}">
        <div class="meta">
          <strong class="cart-item-name">${escapeHtml(item.name)}</strong>
          <div class="cart-item-details">${escapeHtml(item.sizeLabel)} • x${item.qty}</div>
          <div class="cart-item-price">${formatMoney(item.unitPrice * item.qty)}</div>
        </div>
        <div><button class="remove" data-idx="${idx}" aria-label="Eliminar">✕</button></div>
      `;
      dd.appendChild(div);
    });

    // attach remove listeners
    dd.querySelectorAll('.remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // evita que se cierre el dropdown
        const idx = Number(btn.dataset.idx);
        removeFromCart(idx);
        renderCartDropdown();
        renderCartPage();

        // mantener abierto si ya lo estaba
        const dropdown = document.getElementById('cart-dropdown');
        if (dropdown) {
          dropdown.classList.add('open');
          dropdown.setAttribute('aria-hidden', 'false');
        }
      });
    });
  }

  // update subtotal
  const totals = calcTotals();
  if (subtotalEl) subtotalEl.textContent = formatMoney(totals.subtotal);
}


/* ---------------------------
   Página carrito (cart.html)
   --------------------------- */
function renderCartPage() {
  const container = document.getElementById('cart-page-items');
  if (!container) return;
  container.innerHTML = '';
  if (cart.length === 0) {
    container.innerHTML = '<p class="empty">El carrito está vacío. Ve a la <a href="index.html#productos">tienda</a> y agrega productos.</p>';
    document.getElementById('cart-summary-page').style.display = 'none';
    return;
  }

  cart.forEach((item, idx) => {
    const row = document.createElement('div');
    row.className = 'cart-row';
    row.innerHTML = `
      <img src="${item.img}" alt="${escapeHtml(item.name)}">
      <div class="meta">
        <strong>${escapeHtml(item.name)}</strong>
        <div style="color:var(--muted)">${escapeHtml(item.sizeLabel)}</div>
        <div style="margin-top:8px;display:flex;gap:8px;align-items:center">
          <div class="qty">Cant: <strong>${item.qty}</strong></div>
          <div style="margin-left:auto;font-weight:700">${formatMoney(item.unitPrice * item.qty)}</div>
          <button class="remove" data-idx="${idx}" aria-label="Eliminar">✕</button>
        </div>
      </div>
    `;
    container.appendChild(row);
  });

  // attach remove listeners
  container.querySelectorAll('.remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.idx);
      removeFromCart(idx);
      renderCartPage();
      renderCartDropdown();
    });
  });

  // mostrar resumen
  const totals = calcTotals();
  document.getElementById('page-subtotal').textContent = formatMoney(totals.subtotal);
  document.getElementById('page-shipping').textContent = formatMoney(totals.shipping);
  document.getElementById('page-total').textContent = formatMoney(totals.total);
  document.getElementById('cart-summary-page').style.display = 'block';
}

/* ---------------------------
   WhatsApp: arma mensaje y abre wa.me
   --------------------------- */
function sendWhatsAppFromCart() {
  if (cart.length === 0) {
    alert('El carrito está vacío. Agrega al menos un producto antes de enviar el pedido.');
    return;
  }

  const phone = '51967122591'; // <-- REEMPLAZA por tu número (ej: 51912345678)

  const lines = [];
  lines.push('Pedido desde *MONTCAO*');
  lines.push('');
  cart.forEach((it, i) => {
    lines.push(`${i + 1}. ${it.name} - ${it.sizeLabel} x ${it.qty} — ${formatMoney(it.unitPrice * it.qty)}`);
  });
  const totals = calcTotals();
  lines.push('');
  lines.push(`Subtotal: ${formatMoney(totals.subtotal)}`);
  lines.push(`Envío: ${formatMoney(totals.shipping)}`);
  lines.push(`Total: ${formatMoney(totals.total)}`);
  lines.push('');
  lines.push('Datos de cliente:');
  lines.push('Nombre:');
  lines.push('Dirección:');
  lines.push('Teléfono:');
  lines.push('');
  lines.push('Método de pago: (Yape / BCP / Interbank / BBVA)');

  const text = encodeURIComponent(lines.join('\n'));
  const url = `https://wa.me/${phone}?text=${text}`;
  window.open(url, '_blank');
}

/* ---------------------------
   Interactividad del dropdown (abrir/cerrar)
   --------------------------- */
function setupDropdown() {
  const toggle = document.getElementById('cart-toggle');
  const dropdown = document.getElementById('cart-dropdown');
  const ddWhatsapp = document.getElementById('dd-whatsapp');

  if (toggle && dropdown) {
    toggle.addEventListener('click', (e) => {
      const open = dropdown.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      dropdown.setAttribute('aria-hidden', open ? 'false' : 'true');
    });

    // cerrar si se hace click fuera
    document.addEventListener('click', (e) => {
      if (!dropdown.classList.contains('open')) return;
      const wrapper = dropdown.closest('.cart-dropdown-wrapper');
      if (!wrapper.contains(e.target)) {
        dropdown.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        dropdown.setAttribute('aria-hidden', 'true');
      }
    });
  }

  if (ddWhatsapp) {
    ddWhatsapp.addEventListener('click', sendWhatsAppFromCart);
  }
}

/* ---------------------------
   Util: escape html
   --------------------------- */
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, function (m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
  });
}

/* ---------------------------
   Pequeña animación al agregar
   --------------------------- */
function flashAdded() {
  const toggle = document.getElementById('cart-toggle');
  if (!toggle) return;
  toggle.animate([
    { transform: 'translateY(0) scale(1)' },
    { transform: 'translateY(-6px) scale(1.06)' },
    { transform: 'translateY(0) scale(1)' }
  ], { duration: 350, easing: 'ease-out' });
}

/* ---------------------------
   Inicialización según página
   --------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // update year in any page
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  renderCartDropdown();
  setupDropdown();
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const header = document.querySelector('header'); // ajusta si tu header tiene otro selector
        const headerHeight = header ? header.offsetHeight : 0;
        const y = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });


  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      addToCart(btn.dataset.id);
      renderCartDropdown();
    });
  });

  // index page
  if (document.getElementById('index-page')) {

    // attach dd-whatsapp already in setupDropdown
  }

  // cart page
  if (document.getElementById('cart-page')) {
    renderCartPage();
    // botones en la página
    const pageWhats = document.getElementById('page-whatsapp');
    const clearBtn = document.getElementById('clear-cart');
    if (pageWhats) pageWhats.addEventListener('click', sendWhatsAppFromCart);
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('¿Vaciar todo el carrito?')) {
          clearCart();
          renderCartPage();
          renderCartDropdown();
        }
      });
    }
  }
});
// Toggle menú hamburguesa
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
});
