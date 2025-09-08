import { FoodItem } from '@/types';

// Comprehensive food database with Arabic and Middle Eastern cuisine
export const foodDatabase: FoodItem[] = [
  // Arabic/Middle Eastern Foods
  {
    id: 'hummus',
    name: 'Hummus',
    nameAr: 'حمص',
    category: 'appetizer',
    caloriesPer100g: 166,
    protein: 8.0,
    carbs: 14.3,
    fat: 9.6,
    fiber: 6.0,
    sugar: 0.3,
    sodium: 379,
    commonPortions: [
      { name: '1 tablespoon', nameAr: 'ملعقة كبيرة واحدة', grams: 15 },
      { name: '1/4 cup', nameAr: 'ربع كوب', grams: 60 },
      { name: 'Small bowl', nameAr: 'وعاء صغير', grams: 100 }
    ]
  },
  {
    id: 'falafel',
    name: 'Falafel',
    nameAr: 'فلافل',
    category: 'main_dish',
    caloriesPer100g: 333,
    protein: 13.3,
    carbs: 31.8,
    fat: 17.8,
    fiber: 4.9,
    sugar: 1.9,
    sodium: 294,
    commonPortions: [
      { name: '1 piece', nameAr: 'قطعة واحدة', grams: 30 },
      { name: '3 pieces', nameAr: '3 قطع', grams: 90 },
      { name: '5 pieces', nameAr: '5 قطع', grams: 150 }
    ]
  },
  {
    id: 'tabbouleh',
    name: 'Tabbouleh',
    nameAr: 'تبولة',
    category: 'salad',
    caloriesPer100g: 36,
    protein: 2.2,
    carbs: 7.1,
    fat: 0.4,
    fiber: 2.8,
    sugar: 1.8,
    sodium: 11,
    commonPortions: [
      { name: 'Small bowl', nameAr: 'وعاء صغير', grams: 100 },
      { name: 'Large serving', nameAr: 'طبق كبير', grams: 200 }
    ]
  },
  {
    id: 'kabsa',
    name: 'Kabsa',
    nameAr: 'كبسة',
    category: 'main_dish',
    caloriesPer100g: 195,
    protein: 12.4,
    carbs: 22.1,
    fat: 6.8,
    fiber: 1.2,
    sugar: 2.1,
    sodium: 458,
    commonPortions: [
      { name: 'Small plate', nameAr: 'طبق صغير', grams: 200 },
      { name: 'Regular serving', nameAr: 'طبق عادي', grams: 300 },
      { name: 'Large plate', nameAr: 'طبق كبير', grams: 400 }
    ]
  },
  {
    id: 'shawarma',
    name: 'Chicken Shawarma',
    nameAr: 'شاورما دجاج',
    category: 'main_dish',
    caloriesPer100g: 215,
    protein: 16.0,
    carbs: 15.2,
    fat: 11.5,
    fiber: 2.1,
    sugar: 3.4,
    sodium: 512,
    commonPortions: [
      { name: 'Small wrap', nameAr: 'لفة صغيرة', grams: 150 },
      { name: 'Regular wrap', nameAr: 'لفة عادية', grams: 200 },
      { name: 'Large wrap', nameAr: 'لفة كبيرة', grams: 250 }
    ]
  },
  {
    id: 'manakish',
    name: 'Manakish Zaatar',
    nameAr: 'مناقيش زعتر',
    category: 'breakfast',
    caloriesPer100g: 284,
    protein: 7.2,
    carbs: 45.1,
    fat: 9.3,
    fiber: 3.2,
    sugar: 1.8,
    sodium: 623,
    commonPortions: [
      { name: '1 small piece', nameAr: 'قطعة صغيرة', grams: 80 },
      { name: '1 regular piece', nameAr: 'قطعة عادية', grams: 120 },
      { name: '1 large piece', nameAr: 'قطعة كبيرة', grams: 160 }
    ]
  },

  // Common International Foods
  {
    id: 'chicken_breast',
    name: 'Grilled Chicken Breast',
    nameAr: 'صدر دجاج مشوي',
    category: 'protein',
    caloriesPer100g: 165,
    protein: 31.0,
    carbs: 0.0,
    fat: 3.6,
    fiber: 0.0,
    sugar: 0.0,
    sodium: 74,
    commonPortions: [
      { name: 'Small piece', nameAr: 'قطعة صغيرة', grams: 100 },
      { name: 'Medium piece', nameAr: 'قطعة متوسطة', grams: 150 },
      { name: 'Large piece', nameAr: 'قطعة كبيرة', grams: 200 }
    ]
  },
  {
    id: 'white_rice',
    name: 'White Rice',
    nameAr: 'أرز أبيض',
    category: 'grain',
    caloriesPer100g: 130,
    protein: 2.7,
    carbs: 28.0,
    fat: 0.3,
    fiber: 0.4,
    sugar: 0.1,
    sodium: 1,
    commonPortions: [
      { name: '1/2 cup cooked', nameAr: 'نصف كوب مطبوخ', grams: 90 },
      { name: '1 cup cooked', nameAr: 'كوب مطبوخ', grams: 180 },
      { name: '1.5 cups cooked', nameAr: 'كوب ونصف مطبوخ', grams: 270 }
    ]
  },
  {
    id: 'salmon',
    name: 'Grilled Salmon',
    nameAr: 'سلمون مشوي',
    category: 'protein',
    caloriesPer100g: 206,
    protein: 25.4,
    carbs: 0.0,
    fat: 11.0,
    fiber: 0.0,
    sugar: 0.0,
    sodium: 52,
    commonPortions: [
      { name: 'Small fillet', nameAr: 'شريحة صغيرة', grams: 100 },
      { name: 'Regular fillet', nameAr: 'شريحة عادية', grams: 150 },
      { name: 'Large fillet', nameAr: 'شريحة كبيرة', grams: 200 }
    ]
  },
  {
    id: 'pasta',
    name: 'Spaghetti with Tomato Sauce',
    nameAr: 'معكرونة بصلصة الطماطم',
    category: 'main_dish',
    caloriesPer100g: 158,
    protein: 5.8,
    carbs: 30.9,
    fat: 1.1,
    fiber: 2.5,
    sugar: 5.3,
    sodium: 325,
    commonPortions: [
      { name: 'Small bowl', nameAr: 'وعاء صغير', grams: 150 },
      { name: 'Regular serving', nameAr: 'طبق عادي', grams: 200 },
      { name: 'Large bowl', nameAr: 'وعاء كبير', grams: 300 }
    ]
  },
  {
    id: 'greek_salad',
    name: 'Greek Salad',
    nameAr: 'سلطة يونانية',
    category: 'salad',
    caloriesPer100g: 85,
    protein: 2.1,
    carbs: 7.2,
    fat: 5.8,
    fiber: 2.3,
    sugar: 4.1,
    sodium: 312,
    commonPortions: [
      { name: 'Side salad', nameAr: 'سلطة جانبية', grams: 100 },
      { name: 'Regular serving', nameAr: 'طبق عادي', grams: 200 },
      { name: 'Large bowl', nameAr: 'وعاء كبير', grams: 300 }
    ]
  },
  {
    id: 'avocado',
    name: 'Avocado',
    nameAr: 'أفوكادو',
    category: 'fruit',
    caloriesPer100g: 160,
    protein: 2.0,
    carbs: 8.5,
    fat: 14.7,
    fiber: 6.7,
    sugar: 0.7,
    sodium: 7,
    commonPortions: [
      { name: 'Half avocado', nameAr: 'نصف حبة أفوكادو', grams: 75 },
      { name: '1 whole avocado', nameAr: 'حبة أفوكادو كاملة', grams: 150 },
      { name: '1/4 avocado', nameAr: 'ربع حبة أفوكادو', grams: 40 }
    ]
  },
  {
    id: 'banana',
    name: 'Banana',
    nameAr: 'موز',
    category: 'fruit',
    caloriesPer100g: 89,
    protein: 1.1,
    carbs: 22.8,
    fat: 0.3,
    fiber: 2.6,
    sugar: 12.2,
    sodium: 1,
    commonPortions: [
      { name: 'Small banana', nameAr: 'موزة صغيرة', grams: 90 },
      { name: 'Medium banana', nameAr: 'موزة متوسطة', grams: 118 },
      { name: 'Large banana', nameAr: 'موزة كبيرة', grams: 136 }
    ]
  },
  {
    id: 'apple',
    name: 'Apple',
    nameAr: 'تفاحة',
    category: 'fruit',
    caloriesPer100g: 52,
    protein: 0.3,
    carbs: 13.8,
    fat: 0.2,
    fiber: 2.4,
    sugar: 10.4,
    sodium: 1,
    commonPortions: [
      { name: 'Small apple', nameAr: 'تفاحة صغيرة', grams: 130 },
      { name: 'Medium apple', nameAr: 'تفاحة متوسطة', grams: 180 },
      { name: 'Large apple', nameAr: 'تفاحة كبيرة', grams: 220 }
    ]
  },
  {
    id: 'yogurt',
    name: 'Greek Yogurt',
    nameAr: 'زبادي يوناني',
    category: 'dairy',
    caloriesPer100g: 97,
    protein: 10.0,
    carbs: 3.6,
    fat: 5.0,
    fiber: 0.0,
    sugar: 3.6,
    sodium: 36,
    commonPortions: [
      { name: 'Small cup', nameAr: 'كوب صغير', grams: 100 },
      { name: 'Regular cup', nameAr: 'كوب عادي', grams: 170 },
      { name: 'Large container', nameAr: 'علبة كبيرة', grams: 200 }
    ]
  },
  {
    id: 'bread',
    name: 'Whole Wheat Bread',
    nameAr: 'خبز قمح كامل',
    category: 'grain',
    caloriesPer100g: 247,
    protein: 13.2,
    carbs: 41.0,
    fat: 4.2,
    fiber: 6.8,
    sugar: 5.9,
    sodium: 400,
    commonPortions: [
      { name: '1 slice', nameAr: 'شريحة واحدة', grams: 28 },
      { name: '2 slices', nameAr: 'شريحتان', grams: 56 },
      { name: '3 slices', nameAr: '3 شرائح', grams: 84 }
    ]
  }
];

// Categories for filtering and organization
export const foodCategories = {
  en: [
    { id: 'all', name: 'All Foods' },
    { id: 'main_dish', name: 'Main Dishes' },
    { id: 'appetizer', name: 'Appetizers' },
    { id: 'salad', name: 'Salads' },
    { id: 'breakfast', name: 'Breakfast' },
    { id: 'protein', name: 'Proteins' },
    { id: 'grain', name: 'Grains' },
    { id: 'fruit', name: 'Fruits' },
    { id: 'dairy', name: 'Dairy' },
    { id: 'snack', name: 'Snacks' }
  ],
  ar: [
    { id: 'all', name: 'جميع الأطعمة' },
    { id: 'main_dish', name: 'الأطباق الرئيسية' },
    { id: 'appetizer', name: 'المقبلات' },
    { id: 'salad', name: 'السلطات' },
    { id: 'breakfast', name: 'الإفطار' },
    { id: 'protein', name: 'البروتينات' },
    { id: 'grain', name: 'الحبوب' },
    { id: 'fruit', name: 'الفواكه' },
    { id: 'dairy', name: 'منتجات الألبان' },
    { id: 'snack', name: 'الوجبات الخفيفة' }
  ]
};

// Helper function to find food by ID
export const getFoodById = (id: string): FoodItem | undefined => {
  return foodDatabase.find(food => food.id === id);
};

// Helper function to search foods by name
export const searchFoods = (query: string, language: 'en' | 'ar' = 'en'): FoodItem[] => {
  const searchTerm = query.toLowerCase();
  return foodDatabase.filter(food => {
    const name = language === 'ar' ? food.nameAr : food.name;
    return name.toLowerCase().includes(searchTerm);
  });
};

// Helper function to get foods by category
export const getFoodsByCategory = (category: string): FoodItem[] => {
  if (category === 'all') return foodDatabase;
  return foodDatabase.filter(food => food.category === category);
};