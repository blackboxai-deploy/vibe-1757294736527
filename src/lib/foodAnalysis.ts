import { FoodAnalysisResult, RecognizedFood, AnalysisState, ConfidenceLevel } from '@/types';
import { foodDatabase, getFoodById } from '@/data/foodDatabase';
import { calculateNutrition } from './nutritionCalculator';

// Confidence thresholds for food recognition
export const CONFIDENCE_THRESHOLDS = {
  veryHigh: 0.90,
  high: 0.75,
  medium: 0.60,
  low: 0.45
};

// Mock AI service that simulates food recognition
export class FoodAnalysisService {
  private static instance: FoodAnalysisService;
  
  private constructor() {}
  
  public static getInstance(): FoodAnalysisService {
    if (!FoodAnalysisService.instance) {
      FoodAnalysisService.instance = new FoodAnalysisService();
    }
    return FoodAnalysisService.instance;
  }

  // Simulate food recognition analysis
  async analyzeFoodImage(_imageData: string): Promise<FoodAnalysisResult> {
    // Simulate API processing delay
    await this.delay(2000 + Math.random() * 3000);

    // Mock recognition results with realistic confidence scores
    const recognizedFoods = this.generateMockRecognition();
    
    // Calculate total nutrition
    const totalNutrition = recognizedFoods.reduce((total, food) => ({
      calories: total.calories + food.nutrition.calories,
      protein: total.protein + food.nutrition.protein,
      carbs: total.carbs + food.nutrition.carbs,
      fat: total.fat + food.nutrition.fat,
      fiber: total.fiber + food.nutrition.fiber,
      sugar: total.sugar + food.nutrition.sugar,
      sodium: total.sodium + food.nutrition.sodium
    }), {
      calories: 0, protein: 0, carbs: 0, fat: 0, 
      fiber: 0, sugar: 0, sodium: 0
    });

    // Calculate overall confidence based on individual food confidences
    const overallConfidence = recognizedFoods.length > 0 
      ? recognizedFoods.reduce((sum, food) => sum + food.confidence, 0) / recognizedFoods.length
      : 0;

    return {
      foods: recognizedFoods,
      totalNutrition,
      confidence: overallConfidence,
      processTime: 2500 + Math.random() * 2000
    };
  }

  // Generate realistic mock food recognition results
  private generateMockRecognition(): RecognizedFood[] {
    const possibleFoods = this.getRandomFoods(1 + Math.floor(Math.random() * 3));
    
    return possibleFoods.map(food => {
      const confidence = this.generateRealisticConfidence();
      const estimatedGrams = this.generatePortionSize(food.id);
      const nutrition = calculateNutrition(food, estimatedGrams);
      
      return {
        foodId: food.id,
        name: food.name,
        nameAr: food.nameAr,
        confidence,
        estimatedGrams,
        nutrition,
        boundingBox: this.generateBoundingBox()
      };
    });
  }

  // Get random foods from database for mock recognition
  private getRandomFoods(count: number) {
    const shuffled = [...foodDatabase].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Generate realistic confidence scores with weighted distribution
  private generateRealisticConfidence(): number {
    const rand = Math.random();
    
    // Weight distribution towards higher confidence for better UX
    if (rand < 0.3) {
      // 30% chance of very high confidence (90-98%)
      return 0.90 + Math.random() * 0.08;
    } else if (rand < 0.6) {
      // 30% chance of high confidence (75-89%)
      return 0.75 + Math.random() * 0.14;
    } else if (rand < 0.85) {
      // 25% chance of medium confidence (60-74%)
      return 0.60 + Math.random() * 0.14;
    } else {
      // 15% chance of low confidence (45-59%)
      return 0.45 + Math.random() * 0.14;
    }
  }

  // Generate realistic portion sizes based on food type
  private generatePortionSize(foodId: string): number {
    const food = getFoodById(foodId);
    if (!food) return 100;

    const commonPortion = food.commonPortions[
      Math.floor(Math.random() * food.commonPortions.length)
    ];
    
    // Add some variation to the common portion size
    const variation = 0.8 + Math.random() * 0.4; // ±20% variation
    return Math.round(commonPortion.grams * variation);
  }

  // Generate mock bounding box coordinates
  private generateBoundingBox() {
    return {
      x: Math.random() * 0.3, // 0-30% from left
      y: Math.random() * 0.3, // 0-30% from top
      width: 0.2 + Math.random() * 0.5, // 20-70% width
      height: 0.2 + Math.random() * 0.5  // 20-70% height
    };
  }

  // Get confidence level category
  getConfidenceLevel(confidence: number): ConfidenceLevel {
    if (confidence >= CONFIDENCE_THRESHOLDS.veryHigh) return 'very_high';
    if (confidence >= CONFIDENCE_THRESHOLDS.high) return 'high';
    if (confidence >= CONFIDENCE_THRESHOLDS.medium) return 'medium';
    return 'low';
  }

  // Get confidence level display info
  getConfidenceDisplay(confidence: number, language: 'en' | 'ar' = 'en') {
    const level = this.getConfidenceLevel(confidence);
    const percentage = Math.round(confidence * 100);
    
    const displays = {
      en: {
        very_high: { text: 'Very High', color: 'text-green-600', bgColor: 'bg-green-100' },
        high: { text: 'High', color: 'text-green-500', bgColor: 'bg-green-50' },
        medium: { text: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
        low: { text: 'Low', color: 'text-red-500', bgColor: 'bg-red-100' }
      },
      ar: {
        very_high: { text: 'عالية جداً', color: 'text-green-600', bgColor: 'bg-green-100' },
        high: { text: 'عالية', color: 'text-green-500', bgColor: 'bg-green-50' },
        medium: { text: 'متوسطة', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
        low: { text: 'منخفضة', color: 'text-red-500', bgColor: 'bg-red-100' }
      }
    };
    
    return {
      ...displays[language][level],
      percentage,
      level
    };
  }

  // Progressive analysis state updates for UI feedback
  async *analyzeWithProgress(_imageData: string): AsyncGenerator<AnalysisState, void, unknown> {
    const stages = [
      {
        stage: 'uploading' as const,
        progress: 20,
        message: 'Uploading image...',
        messageAr: 'جاري رفع الصورة...',
        delay: 800
      },
      {
        stage: 'processing' as const,
        progress: 40,
        message: 'Processing image...',
        messageAr: 'جاري معالجة الصورة...',
        delay: 1200
      },
      {
        stage: 'analyzing' as const,
        progress: 80,
        message: 'Recognizing foods...',
        messageAr: 'جاري التعرف على الأطعمة...',
        delay: 1500
      },
      {
        stage: 'complete' as const,
        progress: 100,
        message: 'Analysis complete!',
        messageAr: 'تم التحليل بنجاح!',
        delay: 500
      }
    ];

    for (const stage of stages) {
      yield {
        isAnalyzing: stage.stage !== 'complete',
        ...stage
      };
      await this.delay(stage.delay);
    }
  }

  // Simulate barcode scanning
  async scanBarcode(barcode: string) {
    await this.delay(1000);
    
    // Mock barcode database
    const mockProducts: Record<string, any> = {
      '1234567890123': {
        barcode,
        name: 'Almarai Milk',
        nameAr: 'حليب المراعي',
        brand: 'Almarai',
        nutrition: {
          calories: 42,
          protein: 3.4,
          carbs: 5.0,
          fat: 1.0,
          fiber: 0,
          sugar: 5.0,
          sodium: 44
        },
        servingSize: 100,
        servingSizeUnit: 'ml'
      },
      '9876543210987': {
        barcode,
        name: 'Pringles Original',
        nameAr: 'برينجلز أصلي',
        brand: 'Pringles',
        nutrition: {
          calories: 536,
          protein: 4.0,
          carbs: 49.0,
          fat: 35.0,
          fiber: 2.0,
          sugar: 2.0,
          sodium: 1042
        },
        servingSize: 100,
        servingSizeUnit: 'g'
      }
    };
    
    return mockProducts[barcode] || null;
  }

  // Utility delay function
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const foodAnalysisService = FoodAnalysisService.getInstance();

// Helper function for quick analysis
export async function analyzeFoodImage(imageData: string): Promise<FoodAnalysisResult> {
  return foodAnalysisService.analyzeFoodImage(imageData);
}

// Helper function for progressive analysis
export function analyzeWithProgress(imageData: string): AsyncGenerator<AnalysisState, void, unknown> {
  return foodAnalysisService.analyzeWithProgress(imageData);
}