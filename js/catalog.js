/* ============================================================
   ЛОГИКА КАТАЛОГА
   Читает URL-параметр ?cat= и показывает нужную категорию
   ============================================================ */

(function initCatalog(){
  const tabsWrap = document.getElementById('catalogTabs');
  const gridWrap = document.getElementById('catalogGrid');
  const titleWrap = document.getElementById('catalogTitle');

  // Если мы не на странице каталога — выходим
  if (!tabsWrap || !gridWrap) return;

  /* ===== Определяем активную категорию из URL ===== */
  function getActiveCategory(){
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('cat');
    // Проверяем, что такая категория существует
    if (cat && CATEGORIES.some(c => c.key === cat)) return cat;
    // По умолчанию — первая
    return CATEGORIES[0].key;
  }

  /* ===== Рисуем табы категорий ===== */
  function renderTabs(activeKey){
    tabsWrap.innerHTML = CATEGORIES.map(cat => `
      <a href="catalog.html?cat=${cat.key}"
         class="cat-tab ${cat.key === activeKey ? 'cat-tab--active' : ''}">
        ${cat.name}
      </a>
    `).join('');
  }

  /* ===== Рисуем сетку товаров ===== */
  function renderProducts(activeKey){
    const cat = CATEGORIES.find(c => c.key === activeKey);
    const items = PRODUCTS.filter(p => p.cat === activeKey);

    // Обновляем заголовок в крошках
    if (titleWrap && cat) titleWrap.textContent = cat.name;

    // Если товаров нет — заглушка
    if (items.length === 0) {
      gridWrap.innerHTML = `
        <div class="catalog-empty">
          <div class="catalog-empty__icon">📦</div>
          <div class="catalog-empty__title">В этой категории пока нет товаров</div>
          <div class="catalog-empty__text">Скоро здесь появятся новые позиции</div>
        </div>`;
      return;
    }

    // Рисуем карточки
    gridWrap.innerHTML = items.map(p => {
      const img = p.img
        ? `<img src="${p.img}" alt="${p.name}" onerror="this.src='https://placehold.co/300x300/FF6A00/FFFFFF?text=${encodeURIComponent(p.name)}'">`
        : `<img src="https://placehold.co/300x300/FF6A00/FFFFFF?text=${encodeURIComponent(p.name)}" alt="${p.name}">`;

      const badges = [];
      if (p.hit) badges.push('<span class="badge-hot">ХИТ</span>');
      if (p.volume) badges.push(`<span class="badge-vol">${p.volume}</span>`);

      const stockHtml = p.stock
        ? '<div class="stock">В наличии на складе</div>'
        : '<div class="stock stock--out">Нет в наличии</div>';

      const priceHtml = p.price > 0
        ? `<div class="price">${p.price.toLocaleString('ru-RU')} ₽</div>
           ${p.bonus ? `<div class="bonus">+${p.bonus}.00 бонусов</div>` : ''}`
        : `<div class="price price--soon">Скоро</div>`;

      const cartBtn = p.price > 0 && p.stock
        ? `<button class="btn-cart">🛒 В корзину</button>`
        : '';

      return `
  <div class="product-card">
    <button class="fav-btn" data-fav-id="${p.id}" aria-label="Добавить в избранное" type="button">
      <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>
      </svg>
    </button>
    <div class="product-card__top">
      <div style="display:flex;gap:6px;flex-wrap:wrap">${badges.join('')}</div>
    </div>
    <div class="product-card__img">${img}</div>
    <div class="product-card__title">${p.name}</div>
    ${p.brand ? `<div class="product-card__brand">Бренд: ${p.brand}</div>` : ''}
    ${stockHtml}
    <div class="price-row">
      <div>${priceHtml}</div>
      ${cartBtn}
    </div>
  </div>`;
        }).join('');

    // Обновить состояние сердечек
    if (window.Favorites) window.Favorites.refresh();
  }

  /* ===== Запуск ===== */
  const activeCat = getActiveCategory();
  renderTabs(activeCat);
  renderProducts(activeCat);

})();