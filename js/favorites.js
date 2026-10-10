/* ============================================================
   ИЗБРАННОЕ
   Работает через localStorage (без аккаунта)
   ============================================================
   Ключ в localStorage: 'standart_favorites'
   Формат: JSON-массив ID товаров, например [1, 3, 5]
   ============================================================ */

(function initFavorites(){
  const STORAGE_KEY = 'standart_favorites';

  /* ===== Получить массив ID избранных ===== */
  function getFavorites(){
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch(e){
      return [];
    }
  }

  /* ===== Сохранить массив ===== */
  function saveFavorites(ids){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    updateCounters();
    // Событие для других вкладок / компонентов
    window.dispatchEvent(new CustomEvent('favoritesChanged'));
  }

  /* ===== Проверить, в избранном ли товар ===== */
  function isFavorite(id){
    return getFavorites().includes(id);
  }

  /* ===== Добавить / убрать (toggle) ===== */
  function toggleFavorite(id){
    let ids = getFavorites();
    id = Number(id);
    if (ids.includes(id)) {
      ids = ids.filter(x => x !== id);
    } else {
      ids.push(id);
    }
    saveFavorites(ids);
    return ids.includes(id); // вернули true если теперь в избранном
  }

  /* ===== Обновить счётчики в шапке ===== */
  function updateCounters(){
    const count = getFavorites().length;
    document.querySelectorAll('.h-icon__counter').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  /* ===== Рисуем сердечки на карточках ===== */
  function refreshHearts(){
    document.querySelectorAll('[data-fav-id]').forEach(btn => {
      const id = Number(btn.getAttribute('data-fav-id'));
      if (isFavorite(id)) {
        btn.classList.add('is-active');
        btn.setAttribute('aria-label', 'Убрать из избранного');
      } else {
        btn.classList.remove('is-active');
        btn.setAttribute('aria-label', 'Добавить в избранное');
      }
    });
  }

  /* ===== Делегирование кликов (работает для динамически добавленных) ===== */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-fav-id]');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const id = Number(btn.getAttribute('data-fav-id'));
    toggleFavorite(id);
    refreshHearts();
  });

  /* ===== Публичные методы ===== */
  window.Favorites = {
    get: getFavorites,
    isFavorite,
    toggle: toggleFavorite,
    refresh: function(){
      updateCounters();
      refreshHearts();
    }
  };

  /* ===== Инициализация при загрузке ===== */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      updateCounters();
      refreshHearts();
    });
  } else {
    updateCounters();
    refreshHearts();
  }

  // Следим за изменениями в других вкладках
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      updateCounters();
      refreshHearts();
    }
  });

  // При смене избранного внутри страницы
  window.addEventListener('favoritesChanged', () => {
    refreshHearts();
  });

})();