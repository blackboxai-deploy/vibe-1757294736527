import { FoodItem, NutritionInfo, UserProfile, NutritionGoals } from '@/types';

// Calculate nutrition information for a specific portion of food
export function calculateNutrition(food: FoodItem, grams: number): NutritionInfo {
  const multiplier = grams / 100; // Convert from per-100g to actual portion
  
  return {
    calories: Math.round(food.caloriesPer100g * multiplier),
    protein: Math.round((food.protein * multiplier) * 10) / 10,
    carbs: Math.round((food.carbs * multiplier) * 10) / 10,
    fat: Math.round((food.fat * multiplier) * 10) / 10,
    fiber: Math.round((food.fiber * multiplier) * 10) / 10,
    sugar: Math.round((food.sugar * multiplier) * 10) / 10,
    sodium: Math.round(food.sodium * multiplier)
  };
}

// Calculate total nutrition from multiple food items
export function calculateTotalNutrition(nutritionList: NutritionInfo[]): NutritionInfo {
  return nutritionList.reduce((total, nutrition) => ({
    calories: total.calories + nutrition.calories,
    protein: Math.round((total.protein + nutrition.protein) * 10) / 10,
    carbs: Math.round((total.carbs + nutrition.carbs) * 10) / 10,
    fat: Math.round((total.fat + nutrition.fat) * 10) / 10,
    fiber: Math.round((total.fiber + nutrition.fiber) * 10) / 10,
    sugar: Math.round((total.sugar + nutrition.sugar) * 10) / 10,
    sodium: total.sodium + nutrition.sodium
  }), {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0
  });
}

// Calculate Basic Metabolic Rate (BMR) using Mifflin-St Jeor Equation
export function calculateBMR(profile: UserProfile): number {
  const { weight, height, age, gender } = profile;
  
  if (gender === 'male') {
    return (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else {
    return (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }
}

// Calculate Total Daily Energy Expenditure (TDEE)
export function calculateTDEE(profile: UserProfile): number {
  const bmr = calculateBMR(profile);
  
  const activityMultipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725
  };
  
  return Math.round(bmr * activityMultipliers[profile.activityLevel]);
}

// Calculate daily calorie goal based on user's goal
export function calculateCalorieGoal(profile: UserProfile): number {
  const tdee = calculateTDEE(profile);
  
  switch (profile.goal) {
    case 'lose':
      return Math.round(tdee - 500); // 1 lb per week weight loss
    case 'gain':
      return Math.round(tdee + 500); // 1 lb per week weight gain
    case 'maintain':
    default:
      return Math.round(tdee);
  }
}

// Calculate recommended macro distribution
export function calculateMacroGoals(dailyCalories: number): NutritionGoals {
  // Standard macro distribution (can be customized per user)
  const proteinCalories = dailyCalories * 0.25; // 25% protein
  const carbCalories = dailyCalories * 0.45;    // 45% carbs
  const fatCalories = dailyCalories * 0.30;     // 30% fat
  
  return {
    calories: dailyCalories,
    protein: {
      min: Math.round((proteinCalories * 0.8) / 4), // 4 calories per gram protein
      max: Math.round((proteinCalories * 1.2) / 4)
    },
    carbs: {
      min: Math.round((carbCalories * 0.8) / 4), // 4 calories per gram carbs
      max: Math.round((carbCalories * 1.2) / 4)
    },
    fat: {
      min: Math.round((fatCalories * 0.8) / 9), // 9 calories per gram fat
      max: Math.round((fatCalories * 1.2) / 9)
    },
    fiber: Math.round(dailyCalories / 1000 * 14), // 14g per 1000 calories
    sodium: 2300 // mg per day (WHO recommendation)
  };
}

// Calculate percentage of daily goal achieved
export function calculateGoalProgress(consumed: NutritionInfo, goals: NutritionGoals): {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
} {
  return {
    calories: Math.round((consumed.calories / goals.calories) * 100),
    protein: Math.round((consumed.protein / ((goals.protein.min + goals.protein.max) / 2)) * 100),
    carbs: Math.round((consumed.carbs / ((goals.carbs.min + goals.carbs.max) / 2)) * 100),
    fat: Math.round((consumed.fat / ((goals.fat.min + goals.fat.max) / 2)) * 100),
    fiber: Math.round((consumed.fiber / goals.fiber) * 100),
    sodium: Math.round((consumed.sodium / goals.sodium) * 100)
  };
}

// Get nutrition quality score (0-100)
export function getNutritionQualityScore(nutrition: NutritionInfo, goals: NutritionGoals): number {
  const progress = calculateGoalProgress(nutrition, goals);
  
  // Ideal ranges for each macro (as percentage of goal)
  const idealRanges = {
    calories: { min: 90, max: 110 },
    protein: { min: 80, max: 120 },
    carbs: { min: 80, max: 120 },
    fat: { min: 80, max: 120 },
    fiber: { min: 100, max: 150 },
    sodium: { min: 0, max: 80 } // Lower is better for sodium
  };
  
  let totalScore = 0;
  let components = 0;
  
  // Score each component
  Object.entries(progress).forEach(([key, value]) => {
    if (key in idealRanges) {
      const range = idealRanges[key as keyof typeof idealRanges];
      let score = 0;
      
      if (key === 'sodium') {
        // For sodium, lower is better
        score = value <= range.max ? 100 : Math.max(0, 100 - (value - range.max));
      } else {
        // For other nutrients, aim for ideal range
        if (value >= range.min && value <= range.max) {
          score = 100;
        } else if (value < range.min) {
          score = Math.max(0, (value / range.min) * 100);
        } else {
          score = Math.max(0, 100 - ((value - range.max) / range.max * 50));
        }
      }
      
      totalScore += score;
      components++;
    }
  });
  
  return components > 0 ? Math.round(totalScore / components) : 0;
}

// Calculate calories needed to burn for weight loss
export function calculateCaloriesToBurn(consumed: number, goal: number): number {
  return Math.max(0, consumed - goal);
}

// Estimate calories burned during exercise
export function calculateExerciseCalories(
  activityMET: number,
  weightKg: number,
  durationMinutes: number
): number {
  // Calories burned = MET × weight (kg) × time (hours)
  return Math.round(activityMET * weightKg * (durationMinutes / 60));
}

// Get nutrition label color coding for UI
export function getNutritionColor(value: number, goal: number, type: 'calories' | 'macro' | 'sodium' = 'macro') {
  const percentage = (value / goal) * 100;
  
  if (type === 'sodium') {
    // For sodium, lower is better
    if (percentage <= 50) return 'text-green-600';
    if (percentage <= 75) return 'text-yellow-600';
    return 'text-red-600';
  } else if (type === 'calories') {
    // For calories, aim for close to goal
    if (percentage >= 90 && percentage <= 110) return 'text-green-600';
    if (percentage >= 80 && percentage <= 120) return 'text-yellow-600';
    return 'text-red-600';
  } else {
    // For macros, aim for balanced intake
    if (percentage >= 80 && percentage <= 120) return 'text-green-600';
    if (percentage >= 60 && percentage <= 140) return 'text-yellow-600';
    return 'text-red-600';
  }
}

// Format nutrition values for display
export function formatNutritionValue(value: number, unit: string): string {
  if (unit === 'g') {
    return value < 10 ? `${value.toFixed(1)}g` : `${Math.round(value)}g`;
  } else if (unit === 'mg') {
    return `${Math.round(value)}mg`;
  } else if (unit === 'cal' || unit === 'kcal') {
    return `${Math.round(value)}`;
  }
  return `${value}${unit}`;
}

// Get recommended water intake based on calories
export function getWaterIntakeRecommendation(dailyCalories: number): number {
  // Basic formula: 1ml per calorie, minimum 2L
  return Math.max(2000, dailyCalories);
}