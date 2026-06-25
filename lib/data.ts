// ─── Types ───────────────────────────────────────────────────────────────────

/** Top-level product category */
export type Category = "part" | "smartphone";
export type Condition = "new" | "used";

export interface Product {
  id: number;
  /** "part" | "smartphone" — top-level catalog split */
  category: Category;
  brand: string;
  /** Sub-category for parts (displays, batteries…). null for smartphones. */
  subCategory: string | null;
  name: string;
  /** Compatible phone model — used in search and detail page */
  model: string;
  sku: string;
  price: number;           // UZS
  inStock: boolean;
  image: string;
  popular: boolean;
  /** null for parts */
  condition: Condition | null;
  /** Cosmetic description for used phones */
  visualCondition?: string;
  /** Long product description shown on detail page */
  description: string;
  /** Key specs shown in a table on detail page */
  specs: Record<string, string>;
}

// ─── Brands ──────────────────────────────────────────────────────────────────

export const BRANDS = [
  { id: "apple",   name: "Apple" },
  { id: "samsung", name: "Samsung" },
  { id: "xiaomi",  name: "Xiaomi" },
  { id: "huawei",  name: "Huawei" },
  { id: "realme",  name: "Realme" },
  { id: "oppo",    name: "OPPO" },
];

// ─── Part sub-categories ─────────────────────────────────────────────────────

export const PART_CATEGORIES = [
  { id: "displays",  name: "Дисплеи" },
  { id: "batteries", name: "Аккумуляторы" },
  { id: "cables",    name: "Шлейфы" },
  { id: "cameras",   name: "Камеры" },
  { id: "cases",     name: "Корпуса" },
  { id: "charging",  name: "Зарядка / Разъёмы" },
];

// Legacy alias
export const CATEGORIES = PART_CATEGORIES;

// ─── Products ─────────────────────────────────────────────────────────────────

export const PRODUCTS: Product[] = [
  // ── Запчасти ────────────────────────────────────────────────────────────
  {
    id: 1,
    category: "part",
    brand: "Apple",
    subCategory: "displays",
    name: "Дисплей для iPhone 14 Pro Max Original OLED",
    model: "iPhone 14 Pro Max",
    sku: "DSP-APL-14PM-OR",
    price: 1_750_000,
    inStock: true,
    image: "/products/iphone-display.jpg",
    popular: true,
    condition: null,
    description:
      "Оригинальный OLED-дисплей для iPhone 14 Pro Max с разрешением 2796×1290 пикселей. Поддерживает технологию ProMotion 120 Гц, True Tone и HDR. Идеально подходит для замены разбитого или нефункционирующего экрана. В комплекте идут монтажные инструменты и инструкция по замене.",
    specs: {
      "Тип матрицы":      "Super Retina XDR OLED",
      "Разрешение":       "2796 × 1290 px, 460 ppi",
      "Частота обновления":"120 Гц (ProMotion)",
      "Яркость":          "До 2000 нит (пиковая)",
      "Совместимость":    "iPhone 14 Pro Max",
      "Гарантия":         "6 месяцев",
    },
  },
  {
    id: 2,
    category: "part",
    brand: "Samsung",
    subCategory: "displays",
    name: "Дисплей Samsung Galaxy S23 Ultra AMOLED",
    model: "Galaxy S23 Ultra",
    sku: "DSP-SAM-S23U-AM",
    price: 1_246_000,
    inStock: true,
    image: "/products/samsung-display.jpg",
    popular: true,
    condition: null,
    description:
      "Dynamic AMOLED 2X дисплей для Samsung Galaxy S23 Ultra. Обеспечивает насыщенные цвета, глубокий чёрный и плавную анимацию. Оригинальная запчасть от производителя.",
    specs: {
      "Тип матрицы":      "Dynamic AMOLED 2X",
      "Разрешение":       "3088 × 1440 px, 500 ppi",
      "Частота обновления":"120 Гц",
      "Яркость":          "До 1750 нит",
      "Совместимость":    "Samsung Galaxy S23 Ultra",
      "Гарантия":         "6 месяцев",
    },
  },
  {
    id: 3,
    category: "part",
    brand: "Apple",
    subCategory: "batteries",
    name: "Аккумулятор для iPhone 13 Original",
    model: "iPhone 13",
    sku: "BAT-APL-13-OR",
    price: 392_000,
    inStock: true,
    image: "/products/iphone-battery.jpg",
    popular: false,
    condition: null,
    description:
      "Оригинальный аккумулятор для iPhone 13 ёмкостью 3227 мАч. Восстанавливает работу устройства до 100% ёмкости. Прошит оригинальным Apple-контроллером — отображается корректная ёмкость в настройках.",
    specs: {
      "Ёмкость":          "3227 мАч",
      "Напряжение":       "3.85 В",
      "Тип":              "Li-Ion (оригинал Apple)",
      "Совместимость":    "iPhone 13",
      "Гарантия":         "6 месяцев",
    },
  },
  {
    id: 4,
    category: "part",
    brand: "Xiaomi",
    subCategory: "batteries",
    name: "Аккумулятор Xiaomi Redmi Note 12 Pro",
    model: "Redmi Note 12 Pro",
    sku: "BAT-XMI-RN12P",
    price: 210_000,
    inStock: false,
    image: "/products/xiaomi-battery.jpg",
    popular: false,
    condition: null,
    description:
      "Сменный аккумулятор для Xiaomi Redmi Note 12 Pro. Высокая ёмкость 5000 мАч обеспечивает до двух дней автономной работы.",
    specs: {
      "Ёмкость":          "5000 мАч",
      "Напряжение":       "3.87 В",
      "Тип":              "Li-Polymer",
      "Совместимость":    "Redmi Note 12 Pro",
      "Гарантия":         "3 месяца",
    },
  },
  {
    id: 5,
    category: "part",
    brand: "Samsung",
    subCategory: "cameras",
    name: "Камера задняя Samsung Galaxy S22 Ultra 108MP",
    model: "Galaxy S22 Ultra",
    sku: "CAM-SAM-S22U-108",
    price: 784_000,
    inStock: true,
    image: "/products/samsung-camera.jpg",
    popular: true,
    condition: null,
    description:
      "Оригинальный модуль основной камеры для Samsung Galaxy S22 Ultra. 108 МП, оптическая стабилизация, поддержка Space Zoom 100×.",
    specs: {
      "Разрешение":       "108 МП",
      "Апертура":         "f/1.8",
      "Фокусное расстояние":"23 мм (экв.)",
      "Стабилизация":     "OIS",
      "Совместимость":    "Galaxy S22 Ultra",
      "Гарантия":         "3 месяца",
    },
  },
  {
    id: 6,
    category: "part",
    brand: "Apple",
    subCategory: "cables",
    name: "Шлейф кнопки питания iPhone 12",
    model: "iPhone 12",
    sku: "FLX-APL-12-PWR",
    price: 91_000,
    inStock: true,
    image: "/products/cable.jpg",
    popular: false,
    condition: null,
    description:
      "Шлейф кнопки питания (боковой кнопки) для iPhone 12. Включает кнопку включения и боковую кнопку регулировки громкости. Оригинальное качество.",
    specs: {
      "Совместимость":    "iPhone 12",
      "В комплекте":      "Шлейф + кнопки",
      "Гарантия":         "3 месяца",
    },
  },
  {
    id: 7,
    category: "part",
    brand: "Samsung",
    subCategory: "charging",
    name: "Разъём зарядки Samsung Galaxy A54",
    model: "Galaxy A54",
    sku: "CHG-SAM-A54-USB",
    price: 126_000,
    inStock: true,
    image: "/products/charging.jpg",
    popular: false,
    condition: null,
    description:
      "Модуль разъёма USB-C для Samsung Galaxy A54. Совместим с быстрой зарядкой 25 Вт. Восстанавливает зарядку при механическом повреждении порта.",
    specs: {
      "Тип разъёма":      "USB Type-C",
      "Быстрая зарядка":  "25 Вт (SuperVOOC)",
      "Совместимость":    "Galaxy A54",
      "Гарантия":         "3 месяца",
    },
  },
  {
    id: 8,
    category: "part",
    brand: "Xiaomi",
    subCategory: "displays",
    name: "Дисплей Xiaomi Redmi Note 13 Pro AMOLED",
    model: "Redmi Note 13 Pro",
    sku: "DSP-XMI-RN13P-AM",
    price: 630_000,
    inStock: true,
    image: "/products/xiaomi-display.jpg",
    popular: true,
    condition: null,
    description:
      "AMOLED-дисплей для Xiaomi Redmi Note 13 Pro с частотой 120 Гц и разрешением FHD+. Поддерживает Dolby Vision и HDR10+.",
    specs: {
      "Тип матрицы":      "AMOLED",
      "Разрешение":       "2400 × 1080 px",
      "Частота обновления":"120 Гц",
      "Яркость":          "До 1800 нит",
      "Совместимость":    "Redmi Note 13 Pro",
      "Гарантия":         "3 месяца",
    },
  },

  // ── Новые смартфоны ───────────────────────────────────────────────────────
  {
    id: 101,
    category: "smartphone",
    brand: "Apple",
    subCategory: null,
    name: "Apple iPhone 15 Pro Max 256GB Natural Titanium",
    model: "iPhone 15 Pro Max",
    sku: "PHN-APL-15PM-256-NT",
    price: 17_500_000,
    inStock: true,
    image: "/products/iphone15pm.jpg",
    popular: true,
    condition: "new",
    description:
      "Флагманский iPhone 15 Pro Max с чипом Apple A17 Pro, камерой 48 МП с 5× оптическим зумом и титановым корпусом. Работает на iOS 17. Запечатанная коробка, оригинальная гарантия Apple.",
    specs: {
      "Чипсет":           "Apple A17 Pro",
      "Дисплей":          "6.7\" Super Retina XDR OLED, 120 Гц",
      "Память":           "256 ГБ NVMe",
      "ОЗУ":              "8 ГБ",
      "Основная камера":  "48 МП + 12 МП + 12 МП (5× зум)",
      "Аккумулятор":      "4422 мАч",
      "Цвет":             "Natural Titanium",
      "ОС":               "iOS 17",
      "Комплектация":     "Коробка, кабель USB-C, документы",
    },
  },
  {
    id: 102,
    category: "smartphone",
    brand: "Apple",
    subCategory: null,
    name: "Apple iPhone 15 128GB Black",
    model: "iPhone 15",
    sku: "PHN-APL-15-128-BLK",
    price: 12_600_000,
    inStock: true,
    image: "/products/iphone15.jpg",
    popular: true,
    condition: "new",
    description:
      "iPhone 15 с Dynamic Island, чипом A16 Bionic и переходом на USB-C. 48 МП основная камера с улучшенной ночной съёмкой. Запечатан, оригинальный.",
    specs: {
      "Чипсет":           "Apple A16 Bionic",
      "Дисплей":          "6.1\" Super Retina XDR OLED",
      "Память":           "128 ГБ",
      "ОЗУ":              "6 ГБ",
      "Основная камера":  "48 МП + 12 МП",
      "Аккумулятор":      "3877 мАч",
      "Цвет":             "Black",
      "ОС":               "iOS 17",
    },
  },
  {
    id: 103,
    category: "smartphone",
    brand: "Samsung",
    subCategory: null,
    name: "Samsung Galaxy S24 Ultra 256GB Titanium Gray",
    model: "Galaxy S24 Ultra",
    sku: "PHN-SAM-S24U-256-GR",
    price: 16_800_000,
    inStock: true,
    image: "/products/s24ultra.jpg",
    popular: true,
    condition: "new",
    description:
      "Galaxy S24 Ultra — флагман Samsung со встроенным S Pen, чипом Snapdragon 8 Gen 3 и камерой 200 МП. Поддерживает Galaxy AI. Официальный, запечатанный.",
    specs: {
      "Чипсет":           "Snapdragon 8 Gen 3",
      "Дисплей":          "6.8\" QHD+ Dynamic AMOLED 2X, 120 Гц",
      "Память":           "256 ГБ UFS 4.0",
      "ОЗУ":              "12 ГБ",
      "Основная камера":  "200 МП + 12 МП + 50 МП + 10 МП",
      "Аккумулятор":      "5000 мАч",
      "Цвет":             "Titanium Gray",
      "ОС":               "Android 14, One UI 6.1",
      "S Pen":            "В комплекте",
    },
  },
  {
    id: 104,
    category: "smartphone",
    brand: "Xiaomi",
    subCategory: null,
    name: "Xiaomi 14 Pro 512GB Black",
    model: "Xiaomi 14 Pro",
    sku: "PHN-XMI-14P-512-BLK",
    price: 11_200_000,
    inStock: false,
    image: "/products/xiaomi14pro.jpg",
    popular: false,
    condition: "new",
    description:
      "Xiaomi 14 Pro с Leica-камерой, Snapdragon 8 Gen 3 и зарядкой 120 Вт. Один из самых быстро заряжающихся флагманов 2024 года.",
    specs: {
      "Чипсет":           "Snapdragon 8 Gen 3",
      "Дисплей":          "6.73\" LTPO AMOLED, 120 Гц",
      "Память":           "512 ГБ UFS 4.0",
      "ОЗУ":              "12 ГБ",
      "Основная камера":  "50 МП Leica + 50 МП + 50 МП",
      "Аккумулятор":      "4880 мАч",
      "Зарядка":          "120 Вт проводная",
      "Цвет":             "Black",
      "ОС":               "Android 14, MIUI 15",
    },
  },

  // ── Б/У смартфоны ────────────────────────────────────────────────────────
  {
    id: 201,
    category: "smartphone",
    brand: "Apple",
    subCategory: null,
    name: "Apple iPhone 14 Pro 256GB Deep Purple (Б/У)",
    model: "iPhone 14 Pro",
    sku: "PHN-APL-14P-256-DP-U",
    price: 8_900_000,
    inStock: true,
    image: "/products/iphone14pro-used.jpg",
    popular: true,
    condition: "used",
    visualCondition:
      "Состояние отличное (Grade A). Небольшая царапина на алюминиевой рамке снизу, незаметна в чехле. Дисплей без повреждений, сенсор работает идеально. Батарея 89% (мы проверили через диагностику). Все функции работают.",
    description:
      "iPhone 14 Pro в отличном состоянии. Перед продажей прошёл полную диагностику в нашем сервисном центре. Сброс до заводских настроек. Поставляется с зарядным кабелем.",
    specs: {
      "Чипсет":           "Apple A16 Bionic",
      "Дисплей":          "6.1\" Super Retina XDR OLED, 120 Гц",
      "Память":           "256 ГБ",
      "Основная камера":  "48 МП + 12 МП + 12 МП",
      "Аккумулятор":      "3200 мАч (остаток 89%)",
      "Цвет":             "Deep Purple",
      "ОС":               "iOS 17 (обновлена)",
      "Состояние":        "Grade A — Отличное",
    },
  },
  {
    id: 202,
    category: "smartphone",
    brand: "Samsung",
    subCategory: null,
    name: "Samsung Galaxy S23 256GB Phantom Black (Б/У)",
    model: "Galaxy S23",
    sku: "PHN-SAM-S23-256-BLK-U",
    price: 5_600_000,
    inStock: true,
    image: "/products/s23-used.jpg",
    popular: false,
    condition: "used",
    visualCondition:
      "Хорошее состояние (Grade B). Мелкие царапины на задней крышке от ежедневного использования — типичный wear. Дисплей идеальный, без потёртостей. Батарея 92%.",
    description:
      "Galaxy S23 в хорошем состоянии. Полная диагностика пройдена. Все камеры, динамики, микрофоны и сенсоры работают без нареканий.",
    specs: {
      "Чипсет":           "Snapdragon 8 Gen 2",
      "Дисплей":          "6.1\" Dynamic AMOLED 2X, 120 Гц",
      "Память":           "256 ГБ",
      "Основная камера":  "50 МП + 12 МП + 10 МП",
      "Аккумулятор":      "3900 мАч (остаток 92%)",
      "Цвет":             "Phantom Black",
      "ОС":               "Android 14, One UI 6.1",
      "Состояние":        "Grade B — Хорошее",
    },
  },
  {
    id: 203,
    category: "smartphone",
    brand: "Apple",
    subCategory: null,
    name: "Apple iPhone 13 128GB Midnight (Б/У)",
    model: "iPhone 13",
    sku: "PHN-APL-13-128-MN-U",
    price: 6_300_000,
    inStock: false,
    image: "/products/iphone13-used.jpg",
    popular: false,
    condition: "used",
    visualCondition:
      "Состояние удовлетворительное (Grade C). Небольшой скол на нижней рамке ~2 мм. Дисплей без трещин, но есть незначительные потёртости. Батарея 81% — рекомендуем замену в нашем сервисе.",
    description:
      "iPhone 13 по выгодной цене. Все функции работают. Мы честно описали косметические дефекты. Рекомендуем заменить батарею.",
    specs: {
      "Чипсет":           "Apple A15 Bionic",
      "Дисплей":          "6.1\" Super Retina XDR OLED",
      "Память":           "128 ГБ",
      "Основная камера":  "12 МП + 12 МП",
      "Аккумулятор":      "3227 мАч (остаток 81%)",
      "Цвет":             "Midnight",
      "ОС":               "iOS 17",
      "Состояние":        "Grade C — Удовлетворительное",
    },
  },
  {
    id: 204,
    category: "smartphone",
    brand: "Xiaomi",
    subCategory: null,
    name: "Xiaomi Redmi Note 12 Pro 128GB Blue (Б/У)",
    model: "Redmi Note 12 Pro",
    sku: "PHN-XMI-RN12P-128-BLU-U",
    price: 2_800_000,
    inStock: true,
    image: "/products/rn12pro-used.jpg",
    popular: false,
    condition: "used",
    visualCondition:
      "Удовлетворительное состояние (Grade C). Царапины на дисплее хорошо заметны при ярком боковом освещении. Задняя крышка без сколов. Батарея 78%.",
    description:
      "Доступный смартфон для тех, кому важна функциональность, а не внешний вид. Все системы работают штатно.",
    specs: {
      "Чипсет":           "MediaTek Dimensity 1080",
      "Дисплей":          "6.67\" AMOLED, 120 Гц",
      "Память":           "128 ГБ",
      "Основная камера":  "200 МП + 8 МП + 2 МП",
      "Аккумулятор":      "5000 мАч (остаток 78%)",
      "Цвет":             "Blue",
      "ОС":               "Android 13, MIUI 14",
      "Состояние":        "Grade C — Удовлетворительное",
    },
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const PARTS = PRODUCTS.filter(p => p.category === "part");
export const SMARTPHONES = PRODUCTS.filter(p => p.category === "smartphone");

export function getProductById(id: number): Product | undefined {
  return PRODUCTS.find(p => p.id === id);
}

// ─── Repair services ─────────────────────────────────────────────────────────

export const REPAIR_SERVICES = [
  { id: "screen",   icon: "monitor",          title: "Замена экрана",           desc: "Оригинальные дисплеи с гарантией 6 месяцев",   priceFrom: 252_000, duration: "1–2 часа" },
  { id: "battery",  icon: "battery-charging", title: "Замена аккумулятора",     desc: "Восстановите ёмкость батареи до 100%",         priceFrom: 126_000, duration: "30–60 мин" },
  { id: "board",    icon: "cpu",              title: "Ремонт платы",            desc: "Микропайка, BGA-реболлинг, диагностика",       priceFrom: 350_000, duration: "1–3 дня" },
  { id: "camera",   icon: "camera",           title: "Замена камеры",           desc: "Замена фронтальной и основной камеры",         priceFrom: 168_000, duration: "1–2 часа" },
];

// ─── Repair calculator ────────────────────────────────────────────────────────

export const REPAIR_CALCULATOR = {
  brands: ["Apple", "Samsung", "Xiaomi", "Huawei", "Realme", "OPPO"],
  models: {
    Apple:   ["iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 14 Pro Max", "iPhone 14", "iPhone 13", "iPhone 12"],
    Samsung: ["Galaxy S24 Ultra", "Galaxy S23 Ultra", "Galaxy S22", "Galaxy A54", "Galaxy A34"],
    Xiaomi:  ["Xiaomi 14 Pro", "Redmi Note 13 Pro", "Redmi Note 12 Pro", "POCO X5 Pro"],
    Huawei:  ["P60 Pro", "P50 Pro", "Mate 50 Pro", "Nova 11"],
    Realme:  ["GT5 Pro", "GT Neo 5", "11 Pro+"],
    OPPO:    ["Find X6 Pro", "Reno 11 Pro", "A98"],
  } as Record<string, string[]>,
  issues: [
    { id: "screen",   name: "Разбит экран / дисплей",         basePrice: 252_000, days: 1 },
    { id: "battery",  name: "Не держит батарея",              basePrice: 126_000, days: 1 },
    { id: "charging", name: "Не заряжается",                  basePrice:  98_000, days: 1 },
    { id: "camera",   name: "Не работает камера",             basePrice: 168_000, days: 1 },
    { id: "board",    name: "Не включается / ремонт платы",   basePrice: 350_000, days: 3 },
    { id: "water",    name: "Попала вода",                    basePrice: 210_000, days: 2 },
    { id: "speaker",  name: "Не работает динамик / микрофон", basePrice:  84_000, days: 1 },
  ],
};

// ─── Orders ───────────────────────────────────────────────────────────────────

export const ORDERS = [
  { id: "ORD-001", name: "Алексей Петров",  phone: "+998 90 123-45-67", product: "Дисплей iPhone 14 Pro",    amount: 1_750_000, status: "Доставлен" },
  { id: "ORD-002", name: "Мария Иванова",   phone: "+998 91 987-65-43", product: "Аккумулятор Samsung S23",  amount:   308_000, status: "В пути"    },
  { id: "ORD-003", name: "Дмитрий Козлов",  phone: "+998 93 456-78-90", product: "Камера Xiaomi 13 Pro",     amount:   672_000, status: "Обработан" },
  { id: "ORD-004", name: "Анна Смирнова",   phone: "+998 97 234-56-78", product: "Шлейф кнопки iPhone 12",  amount:    91_000, status: "Доставлен" },
];
