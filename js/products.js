/* ============================================================
   ТОВАРЫ КАТАЛОГА
   Здесь хранятся все товары. Легко менять и добавлять.
   ============================================================
   Формат товара:
   {
     id: 1,                    // уникальный ID
     cat: 'shampoo',           // категория (см. ниже)
     name: 'X-WASH',           // название
     brand: 'Chemical Russian',// бренд
     volume: '20 л',           // объём
     price: 2490,              // цена в рублях
     bonus: 120,               // бонусов кешбека
     img: 'images/x-wash.jpg', // путь к фото
     hit: true,                // бейдж "ХИТ"
     stock: true               // в наличии?
   }
   
   Категории:
   - shampoo      — Шампуни
   - black        — Чернение
   - chemistry    — Химчистка
   - protection   — Защита
   - accessories  — Аксессуары
   - sale         — Скидки тут!
   ============================================================ */

const PRODUCTS = [

  // ===== ШАМПУНИ =====
  {
    id: 1,
    cat: 'shampoo',
    name: 'Chemical Russian Base Wash — шампунь для ручной мойки авто, 20 л',
    brand: 'Chemical Russian',
    volume: '20 л',
    price: 5999,
    bonus: 300,
    img: 'images/basewash.jpg',
    hit: true,
    stock: true
  },

  // ===== ЧЕРНЕНИЕ =====
  {
    id: 2,
    cat: 'black',
    name: 'Chemical Russian Satin — сатиновое чернение шин, 500 мл',
    brand: 'Chemical Russian',
    volume: '500 мл',
    price: 629,
    bonus: 30,
    img: 'images/satin.jpg',
    hit: true,
    stock: true
  },

  // ===== ХИМЧИСТКА =====
  {
    id: 3,
    cat: 'chemistry',
    name: 'Chemical Russian Delicate Cleaner — очиститель интерьера (концентрат), 20 л pH 7',
    brand: 'Chemical Russian',
    volume: '20 л',
    price: 5999,
    bonus: 300,
    img: 'images/delicatecleaner.jpg',
    hit: false,
    stock: true
  },

  // ===== ЗАЩИТА =====
  {
    id: 4,
    cat: 'protection',
    name: 'Chemical Russian Fast Coat — кварцевое покрытие для мощного гидрофоба и блеска, 20 л',
    brand: 'Chemical Russian',
    volume: '20 л',
    price: 15499,
    bonus: 700,
    img: 'images/fastcoat.jpg',
    hit: true,
    stock: true
  },

  // ===== АКСЕССУАРЫ (пока пусто) =====
  {
    id: 5,
    cat: 'accessories',
    name: 'Скоро здесь появятся аксессуары',
    brand: '',
    volume: '',
    price: 0,
    bonus: 0,
    img: '',
    hit: false,
    stock: false
  },

  // ===== СКИДКИ ТУТ! (пока пусто) =====
  {
    id: 6,
    cat: 'sale',
    name: 'Скоро здесь появятся скидки',
    brand: '',
    volume: '',
    price: 0,
    bonus: 0,
    img: '',
    hit: false,
    stock: false
  }

];

/* Категории для табов */
const CATEGORIES = [
  { key: 'shampoo',     name: 'Шампуни' },
  { key: 'black',       name: 'Чернение' },
  { key: 'chemistry',   name: 'Химчистка' },
  { key: 'protection',  name: 'Защита' },
  { key: 'accessories', name: 'Аксессуары' },
  { key: 'sale',        name: 'СКИДКИ ТУТ!' }
];