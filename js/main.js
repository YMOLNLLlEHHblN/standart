/* ============================================================
   СТАНДАРТ ЧИСТОТЫ — Основные скрипты
   Обновлено: свежие координаты + защита от ошибок
   ============================================================ */

/* ================= КАРУСЕЛЬ HERO (только на главной) ================= */
(function initHeroCarousel(){
  const hero = document.querySelector('.hero');
  const nextBtn = document.querySelector('.hero__nav--next');
  const prevBtn = document.querySelector('.hero__nav--prev');
  const dots = document.querySelectorAll('.hero__dots span');

  // Если элементов нет — выходим (значит, мы не на главной)
  if (!hero || !nextBtn || !prevBtn || dots.length === 0) return;

  let slide = 0;
  const slides = [
    { badge:'СТАНДАРТ ЧИСТОТЫ', title:'Профессиональная автохимия для вашего бизнеса', text:'Лучшие условия на рынке, большой ассортимент, современная автохимия. Работаем с автомойками, детейлинг-центрами и автосервисами.' },
    { badge:'НОВИНКА', title:'Кислотный шампунь ACID WASH', text:'Эффективно удаляет водный камень, ржавчину и налёт. Подходит для ручной и бесконтактной мойки.' },
    { badge:'ХИТ ПРОДАЖ', title:'X-WASH — шампунь для ручной мойки', text:'Отличные моющие свойства, придаёт насыщение цвета и создаёт гидрофобный эффект.' }
  ];

  function renderSlide(i){
    const badgeEl = hero.querySelector('.hero__badge');
    const titleEl = hero.querySelector('h1');
    const textEl = hero.querySelector('p');
    if (badgeEl) badgeEl.textContent = slides[i].badge;
    if (titleEl) titleEl.textContent = slides[i].title;
    if (textEl) textEl.textContent = slides[i].text;
    dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
  }

  nextBtn.onclick = () => { slide = (slide + 1) % slides.length; renderSlide(slide); };
  prevBtn.onclick = () => { slide = (slide - 1 + slides.length) % slides.length; renderSlide(slide); };
  dots.forEach((d, idx) => d.onclick = () => { slide = idx; renderSlide(slide); });
})();

/* ================= МОДАЛКА «ЗАКАЗАТЬ ЗВОНОК» ================= */
(function initCallModal(){
  const callModal = document.getElementById('callModal');
  const phoneInput = document.getElementById('phoneInput');
  const submitCall = document.getElementById('submitCall');

  // Если модалки нет на странице — выходим
  if (!callModal || !phoneInput || !submitCall) return;

  function openCallModal(){
    callModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => phoneInput.focus(), 100);
  }
  function closeCallModal(){
    callModal.classList.remove('active');
    document.body.style.overflow = '';
    phoneInput.value = '';
    submitCall.disabled = true;
    submitCall.classList.remove('active');
  }

  // Делаем функции глобальными, чтобы работали onclick в HTML
  window.openCallModal = openCallModal;
  window.closeCallModal = closeCallModal;

  // Закрытие по клику на фон
  callModal.addEventListener('click', (e) => {
    if (e.target === callModal) closeCallModal();
  });

  // Закрытие по Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && callModal.classList.contains('active')) closeCallModal();
  });

  /* ===== МАСКА ТЕЛЕФОНА +7 (___) ___-__-__ ===== */
  phoneInput.addEventListener('input', (e) => {
    let digits = e.target.value.replace(/\D/g, '');
    if (digits.startsWith('8')) digits = '7' + digits.slice(1);
    if (!digits.startsWith('7')) digits = '7' + digits;
    digits = digits.slice(0, 11);

    let formatted = '+7';
    if (digits.length > 1) formatted += ' (' + digits.slice(1, 4);
    if (digits.length >= 5) formatted += ') ' + digits.slice(4, 7);
    if (digits.length >= 8) formatted += '-' + digits.slice(7, 9);
    if (digits.length >= 10) formatted += '-' + digits.slice(9, 11);

    e.target.value = formatted;

    const ready = digits.length === 11;
    submitCall.disabled = !ready;
    submitCall.classList.toggle('active', ready);
  });

  /* ===== ОТПРАВКА (пока заглушка) ===== */
  submitCall.addEventListener('click', () => {
    if (submitCall.disabled) return;
    alert('Заявка отправлена!\nНомер: ' + phoneInput.value + '\n\n(пока это заглушка, позже подключим отправку)');
    closeCallModal();
  });
})();

/* ================= SCROLL-АНИМАЦИИ ================= */
(function initRevealAnimations(){
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => observer.observe(el));
})();

/* ================= ЯНДЕКС.КАРТА ================= */
(function initMap(){
  const mapEl = document.getElementById('map');

  // Карты нет на этой странице — выходим
  if (!mapEl) return;

  function showMapPlaceholder(text){
    mapEl.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#999;font-size:14px;text-align:center;padding:20px;background:#f5f5f5;border-radius:6px;min-height:340px">' + text + '</div>';
  }

  function waitForYmaps(attempts){
    attempts = attempts || 20;

    if (typeof ymaps !== 'undefined') {
      ymaps.ready(function(){
        // ⚠️ АКТУАЛЬНЫЕ КООРДИНАТЫ: Челябинск, 2-я Базовая, 56
        var coords = [55.101087, 61.354152];

        var map = new ymaps.Map('map', {
          center: coords,
          zoom: 16,
          controls: ['zoomControl', 'fullscreenControl']
        });

        var placemark = new ymaps.Placemark(coords, {
          balloonContentHeader: 'Стандарт чистоты',
          balloonContentBody: 'г. Челябинск, 2-я Базовая, 56<br>Тел: +7 (922) 737-08-08',
          hintContent: 'Стандарт чистоты'
        }, {
          preset: 'islands#orangeIcon'
        });

        map.geoObjects.add(placemark);
        map.behaviors.disable('scrollZoom');
      });
    } else if (attempts > 0) {
      setTimeout(function(){ waitForYmaps(attempts - 1); }, 200);
    } else {
      showMapPlaceholder('Карта временно недоступна.<br>Мы находимся по адресу: г. Челябинск, 2-я Базовая, 56');
    }
  }

  waitForYmaps();
})();
/* ================= КНОПКА «НАВЕРХ» ================= */
(function initToTop(){
  const btn = document.getElementById('toTop');
  if (!btn) return;

  // Показываем/скрываем кнопку при скролле
  function toggleVisibility(){
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility(); // проверка при загрузке

  // Плавный скролл наверх
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();