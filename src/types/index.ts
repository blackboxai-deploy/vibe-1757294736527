// Core data types for Calo Lens application

export interface FoodItem {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  caloriesPer100g: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  image?: string;
  commonPortions: Portion[];
}

export interface Portion {
  name: string;
  nameAr: string;
  grams: number;
}

export interface RecognizedFood {
  foodId: string;
  name: string;
  nameAr: string;
  confidence: number;
  estimatedGrams: number;
  boundingBox?: BoundingBox;
  nutrition: NutritionInfo;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

export interface FoodAnalysisResult {
  foods: RecognizedFood[];
  totalNutrition: NutritionInfo;
  confidence: number;
  processTime: number;
}

export interface Activity {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  caloriesPerMinute: number;
  intensity: 'low' | 'medium' | 'high';
  description: string;
  descriptionAr: string;
  equipment?: string;
  duration?: number;
}

export interface ActivitySuggestion {
  activity: Activity;
  duration: number;
  totalCalories: number;
  matchPercentage: number;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  weight: number;
  height: number;
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
  goal: 'maintain' | 'lose' | 'gain';
  dailyCalorieGoal: number;
  preferredLanguage: 'en' | 'ar';
  createdAt: Date;
}

export interface MealEntry {
  id: string;
  userId: string;
  timestamp: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: RecognizedFood[];
  totalNutrition: NutritionInfo;
  image?: string;
  notes?: string;
}

export interface DailyProgress {
  date: string;
  caloriesConsumed: number;
  caloriesGoal: number;
  nutrition: NutritionInfo;
  meals: MealEntry[];
  activitiesPerformed?: ActivitySuggestion[];
}

export interface CameraCapture {
  imageData: string;
  timestamp: Date;
  source: 'camera' | 'gallery';
}

export interface AnalysisState {
  isAnalyzing: boolean;
  progress: number;
  stage: 'uploading' | 'processing' | 'analyzing' | 'complete' | 'error';
  message: string;
  messageAr: string;
}

export interface BarcodeProduct {
  barcode: string;
  name: string;
  nameAr: string;
  brand: string;
  nutrition: NutritionInfo;
  servingSize: number;
  servingSizeUnit: string;
  image?: string;
}

export interface AppSettings {
  language: 'en' | 'ar';
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  autoAnalysis: boolean;
  saveToHistory: boolean;
  shareData: boolean;
}

// API Response types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Food recognition confidence levels
export type ConfidenceLevel = 'very_high' | 'high' | 'medium' | 'low';

export interface ConfidenceThreshold {
  veryHigh: number; // 90%+
  high: number;     // 75%+
  medium: number;   // 60%+
  low: number;      // 45%+
}

// Nutrition goals and ranges
export interface NutritionGoals {
  calories: number;
  protein: { min: number; max: number };
  carbs: { min: number; max: number };
  fat: { min: number; max: number };
  fiber: number;
  sodium: number;
}

// Chart data for progress visualization
export interface ChartDataPoint {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  goal: number;
}

export interface WeeklyProgress {
  week: string;
  days: ChartDataPoint[];
  averages: NutritionInfo;
  goalAchievement: number; // percentage
}