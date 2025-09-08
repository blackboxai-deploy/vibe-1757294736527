import { Activity, ActivitySuggestion, UserProfile } from '@/types';

// Comprehensive activity database with MET values
export const activityDatabase: Activity[] = [
  // Cardio Activities
  {
    id: 'walking_moderate',
    name: 'Brisk Walking',
    nameAr: 'المشي السريع',
    category: 'cardio',
    caloriesPerMinute: 4.5,
    intensity: 'low',
    description: 'Walk at a brisk pace (3.5-4 mph) on flat terrain',
    descriptionAr: 'المشي بخطوة سريعة على أرض مستوية'
  },
  {
    id: 'jogging',
    name: 'Jogging',
    nameAr: 'الهرولة',
    category: 'cardio',
    caloriesPerMinute: 8.0,
    intensity: 'medium',
    description: 'Light jogging at 5-6 mph pace',
    descriptionAr: 'الهرولة الخفيفة بوتيرة معتدلة'
  },
  {
    id: 'running',
    name: 'Running',
    nameAr: 'الجري',
    category: 'cardio',
    caloriesPerMinute: 11.5,
    intensity: 'high',
    description: 'Running at 7-8 mph pace',
    descriptionAr: 'الجري بوتيرة سريعة'
  },
  {
    id: 'cycling_leisure',
    name: 'Leisure Cycling',
    nameAr: 'ركوب الدراجة الترفيهي',
    category: 'cardio',
    caloriesPerMinute: 6.0,
    intensity: 'low',
    description: 'Cycling at a leisurely pace (10-12 mph)',
    descriptionAr: 'ركوب الدراجة بوتيرة مريحة'
  },
  {
    id: 'cycling_moderate',
    name: 'Moderate Cycling',
    nameAr: 'ركوب الدراجة المعتدل',
    category: 'cardio',
    caloriesPerMinute: 8.5,
    intensity: 'medium',
    description: 'Cycling at moderate pace (12-14 mph)',
    descriptionAr: 'ركوب الدراجة بوتيرة معتدلة'
  },
  {
    id: 'swimming',
    name: 'Swimming',
    nameAr: 'السباحة',
    category: 'cardio',
    caloriesPerMinute: 10.0,
    intensity: 'medium',
    description: 'General swimming, moderate pace',
    descriptionAr: 'السباحة العامة بوتيرة معتدلة'
  },
  
  // Strength Training
  {
    id: 'weight_training_light',
    name: 'Light Weight Training',
    nameAr: 'تدريب الأوزان الخفيفة',
    category: 'strength',
    caloriesPerMinute: 4.0,
    intensity: 'low',
    description: 'Light to moderate weight training',
    descriptionAr: 'تدريب الأوزان الخفيفة إلى المعتدلة'
  },
  {
    id: 'weight_training_heavy',
    name: 'Heavy Weight Training',
    nameAr: 'تدريب الأوزان الثقيلة',
    category: 'strength',
    caloriesPerMinute: 6.0,
    intensity: 'high',
    description: 'Intense weight training with heavy weights',
    descriptionAr: 'تدريب الأوزان المكثف بأوزان ثقيلة'
  },
  {
    id: 'bodyweight_exercises',
    name: 'Bodyweight Exercises',
    nameAr: 'تمارين بوزن الجسم',
    category: 'strength',
    caloriesPerMinute: 5.5,
    intensity: 'medium',
    description: 'Push-ups, pull-ups, squats, burpees',
    descriptionAr: 'تمارين الضغط والعقلة والقرفصاء'
  },
  
  // Sports
  {
    id: 'football',
    name: 'Football/Soccer',
    nameAr: 'كرة القدم',
    category: 'sports',
    caloriesPerMinute: 9.0,
    intensity: 'high',
    description: 'Playing football/soccer, general',
    descriptionAr: 'لعب كرة القدم بشكل عام'
  },
  {
    id: 'basketball',
    name: 'Basketball',
    nameAr: 'كرة السلة',
    category: 'sports',
    caloriesPerMinute: 8.5,
    intensity: 'high',
    description: 'Playing basketball, general',
    descriptionAr: 'لعب كرة السلة بشكل عام'
  },
  {
    id: 'tennis',
    name: 'Tennis',
    nameAr: 'التنس',
    category: 'sports',
    caloriesPerMinute: 7.0,
    intensity: 'medium',
    description: 'Playing tennis, general',
    descriptionAr: 'لعب التنس بشكل عام'
  },
  
  // Home Activities
  {
    id: 'stairs_climbing',
    name: 'Stair Climbing',
    nameAr: 'صعود الدرج',
    category: 'daily',
    caloriesPerMinute: 9.0,
    intensity: 'medium',
    description: 'Climbing stairs at moderate pace',
    descriptionAr: 'صعود الدرج بوتيرة معتدلة'
  },
  {
    id: 'cleaning',
    name: 'House Cleaning',
    nameAr: 'تنظيف المنزل',
    category: 'daily',
    caloriesPerMinute: 3.5,
    intensity: 'low',
    description: 'General house cleaning activities',
    descriptionAr: 'أنشطة تنظيف المنزل العامة'
  },
  {
    id: 'gardening',
    name: 'Gardening',
    nameAr: 'البستنة',
    category: 'daily',
    caloriesPerMinute: 4.0,
    intensity: 'low',
    description: 'General gardening activities',
    descriptionAr: 'أنشطة البستنة العامة'
  },
  
  // Fitness Classes
  {
    id: 'yoga',
    name: 'Yoga',
    nameAr: 'اليوغا',
    category: 'fitness',
    caloriesPerMinute: 3.0,
    intensity: 'low',
    description: 'Hatha yoga, general',
    descriptionAr: 'يوغا هاثا عامة'
  },
  {
    id: 'pilates',
    name: 'Pilates',
    nameAr: 'البيلاتس',
    category: 'fitness',
    caloriesPerMinute: 4.5,
    intensity: 'low',
    description: 'Pilates, general',
    descriptionAr: 'البيلاتس بشكل عام'
  },
  {
    id: 'aerobics',
    name: 'Aerobics',
    nameAr: 'الأيروبك',
    category: 'fitness',
    caloriesPerMinute: 7.5,
    intensity: 'medium',
    description: 'Aerobics, general',
    descriptionAr: 'الأيروبك بشكل عام'
  },
  {
    id: 'hiit',
    name: 'HIIT Training',
    nameAr: 'تدريب عالي الكثافة',
    category: 'fitness',
    caloriesPerMinute: 12.0,
    intensity: 'high',
    description: 'High-intensity interval training',
    descriptionAr: 'تدريب متقطع عالي الكثافة'
  },
  
  // Dance
  {
    id: 'dancing',
    name: 'Dancing',
    nameAr: 'الرقص',
    category: 'dance',
    caloriesPerMinute: 6.5,
    intensity: 'medium',
    description: 'Dancing, general',
    descriptionAr: 'الرقص بشكل عام'
  }
];

export class ActivitySuggestionEngine {
  private static instance: ActivitySuggestionEngine;
  
  private constructor() {}
  
  public static getInstance(): ActivitySuggestionEngine {
    if (!ActivitySuggestionEngine.instance) {
      ActivitySuggestionEngine.instance = new ActivitySuggestionEngine();
    }
    return ActivitySuggestionEngine.instance;
  }

  // Get activity suggestions to burn specific calories
  getSuggestionsForCalories(
    targetCalories: number,
    userProfile: UserProfile,
    preferences?: {
      categories?: string[];
      intensity?: ('low' | 'medium' | 'high')[];
      maxDuration?: number;
    }
  ): ActivitySuggestion[] {
    let filteredActivities = activityDatabase;
    
    // Apply filters based on preferences
    if (preferences?.categories && preferences.categories.length > 0) {
      filteredActivities = filteredActivities.filter(activity => 
        preferences.categories!.includes(activity.category)
      );
    }
    
    if (preferences?.intensity && preferences.intensity.length > 0) {
      filteredActivities = filteredActivities.filter(activity => 
        preferences.intensity!.includes(activity.intensity)
      );
    }

    // Calculate suggestions for each activity
    const suggestions = filteredActivities.map(activity => {
      // Adjust calories per minute based on user weight (rough estimation)
      const adjustedCaloriesPerMinute = this.adjustCaloriesForWeight(
        activity.caloriesPerMinute,
        userProfile.weight
      );
      
      // Calculate duration needed
      const duration = Math.ceil(targetCalories / adjustedCaloriesPerMinute);
      
      // Skip if duration exceeds max duration preference
      if (preferences?.maxDuration && duration > preferences.maxDuration) {
        return null;
      }
      
      // Calculate match percentage based on various factors
      const matchPercentage = this.calculateMatchPercentage(
        activity,
        duration,
        userProfile,
        targetCalories
      );
      
      return {
        activity,
        duration,
        totalCalories: Math.round(adjustedCaloriesPerMinute * duration),
        matchPercentage
      };
    }).filter(Boolean) as ActivitySuggestion[];

    // Sort by match percentage (best matches first)
    return suggestions
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 8); // Return top 8 suggestions
  }

  // Adjust calories per minute based on user weight
  private adjustCaloriesForWeight(baseCalories: number, weightKg: number): number {
    // Base calculation assumes 70kg person
    const baseWeight = 70;
    const weightFactor = weightKg / baseWeight;
    return baseCalories * weightFactor;
  }

  // Calculate how well an activity matches user preferences and constraints
  private calculateMatchPercentage(
    activity: Activity,
    duration: number,
    userProfile: UserProfile,
    targetCalories: number
  ): number {
    let score = 0;
    let factors = 0;

    // Duration factor (prefer moderate durations)
    if (duration >= 10 && duration <= 45) {
      score += 30; // Ideal duration range
    } else if (duration >= 5 && duration <= 60) {
      score += 20; // Acceptable range
    } else {
      score += 10; // Less ideal
    }
    factors++;

    // Intensity matching based on activity level
    const preferredIntensities = this.getPreferredIntensities(userProfile.activityLevel);
    if (preferredIntensities.includes(activity.intensity)) {
      score += 25;
    } else {
      score += 10;
    }
    factors++;

    // Calorie efficiency (how close the activity gets to target)
    const calorieAccuracy = Math.abs(targetCalories - (activity.caloriesPerMinute * duration));
    if (calorieAccuracy <= targetCalories * 0.1) {
      score += 25; // Very accurate
    } else if (calorieAccuracy <= targetCalories * 0.2) {
      score += 20; // Good accuracy
    } else {
      score += 15; // Acceptable accuracy
    }
    factors++;

    // Activity category bonus (some categories are generally more appealing)
    const categoryScores: Record<string, number> = {
      cardio: 20,
      sports: 25,
      fitness: 20,
      strength: 18,
      dance: 22,
      daily: 15
    };
    score += categoryScores[activity.category] || 15;
    factors++;

    return Math.min(100, Math.round(score / factors * 4)); // Scale to 0-100
  }

  // Get preferred activity intensities based on user's activity level
  private getPreferredIntensities(activityLevel: UserProfile['activityLevel']): Activity['intensity'][] {
    switch (activityLevel) {
      case 'sedentary':
        return ['low'];
      case 'lightly_active':
        return ['low', 'medium'];
      case 'moderately_active':
        return ['medium'];
      case 'very_active':
        return ['medium', 'high'];
      default:
        return ['low', 'medium'];
    }
  }

  // Get activities by category
  getActivitiesByCategory(category: string): Activity[] {
    if (category === 'all') return activityDatabase;
    return activityDatabase.filter(activity => activity.category === category);
  }

  // Search activities by name
  searchActivities(query: string, language: 'en' | 'ar' = 'en'): Activity[] {
    const searchTerm = query.toLowerCase();
    return activityDatabase.filter(activity => {
      const name = language === 'ar' ? activity.nameAr : activity.name;
      const description = language === 'ar' ? activity.descriptionAr : activity.description;
      return name.toLowerCase().includes(searchTerm) || 
             description.toLowerCase().includes(searchTerm);
    });
  }

  // Get quick suggestions for common calorie amounts
  getQuickSuggestions(userProfile: UserProfile): Record<string, ActivitySuggestion[]> {
    const calorieAmounts = [100, 200, 300, 500];
    const quickSuggestions: Record<string, ActivitySuggestion[]> = {};
    
    calorieAmounts.forEach(calories => {
      quickSuggestions[`${calories}cal`] = this.getSuggestionsForCalories(
        calories,
        userProfile,
        { maxDuration: 60, categories: ['cardio', 'fitness', 'sports'] }
      ).slice(0, 3);
    });
    
    return quickSuggestions;
  }
}

// Export singleton instance
export const activitySuggestionEngine = ActivitySuggestionEngine.getInstance();

// Activity categories for filtering
export const activityCategories = {
  en: [
    { id: 'all', name: 'All Activities' },
    { id: 'cardio', name: 'Cardio' },
    { id: 'strength', name: 'Strength' },
    { id: 'sports', name: 'Sports' },
    { id: 'fitness', name: 'Fitness Classes' },
    { id: 'dance', name: 'Dance' },
    { id: 'daily', name: 'Daily Activities' }
  ],
  ar: [
    { id: 'all', name: 'جميع الأنشطة' },
    { id: 'cardio', name: 'تمارين القلب' },
    { id: 'strength', name: 'تمارين القوة' },
    { id: 'sports', name: 'الرياضات' },
    { id: 'fitness', name: 'حصص اللياقة' },
    { id: 'dance', name: 'الرقص' },
    { id: 'daily', name: 'الأنشطة اليومية' }
  ]
};

// Helper functions
export function getSuggestionsForCalories(
  targetCalories: number,
  userProfile: UserProfile,
  preferences?: {
    categories?: string[];
    intensity?: ('low' | 'medium' | 'high')[];
    maxDuration?: number;
  }
): ActivitySuggestion[] {
  return activitySuggestionEngine.getSuggestionsForCalories(targetCalories, userProfile, preferences);
}

export function getQuickSuggestions(userProfile: UserProfile): Record<string, ActivitySuggestion[]> {
  return activitySuggestionEngine.getQuickSuggestions(userProfile);
}