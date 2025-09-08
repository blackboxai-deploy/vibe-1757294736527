'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FoodAnalysisResult, AnalysisState } from '@/types';
import { analyzeWithProgress, foodAnalysisService } from '@/lib/foodAnalysis';
import { getSuggestionsForCalories } from '@/lib/activitySuggestions';
import { getUserProfile, storageService } from '@/lib/storage';

export default function CameraPage() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisState, setAnalysisState] = useState<AnalysisState | null>(null);
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysisResult | null>(null);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [error, setError] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const content = {
    en: {
      title: 'Food Analysis',
      backToDashboard: 'Back to Dashboard',
      capture: 'Capture Photo',
      uploadFromGallery: 'Upload from Gallery',
      retake: 'Retake Photo',
      analyze: 'Analyze Food',
      analyzing: 'Analyzing...',
      noCamera: 'Camera not available',
      cameraBlocked: 'Camera access blocked. Please enable camera permission.',
      enableCamera: 'Enable Camera',
      nutritionInfo: 'Nutrition Information',
      activitySuggestions: 'Suggested Activities',
      confidence: 'Confidence',
      totalNutrition: 'Total Nutrition',
      recognizedFoods: 'Recognized Foods',
      calories: 'Calories',
      protein: 'Protein',
      carbs: 'Carbs',
      fat: 'Fat',
      fiber: 'Fiber',
      sodium: 'Sodium',
      grams: 'grams',
      minutes: 'min',
      burnCalories: 'Burn Calories',
      tryAgain: 'Try Again',
      saveMeal: 'Save Meal',
      newAnalysis: 'New Analysis',
      tips: {
        title: 'Tips for Better Recognition',
        items: [
          'Ensure good lighting',
          'Keep food in center of frame', 
          'Avoid shadows on food',
          'Include the whole dish'
        ]
      }
    },
    ar: {
      title: 'تحليل الطعام',
      backToDashboard: 'العودة للوحة التحكم',
      capture: 'التقاط صورة',
      uploadFromGallery: 'رفع من المعرض',
      retake: 'إعادة التقاط',
      analyze: 'تحليل الطعام',
      analyzing: 'جاري التحليل...',
      noCamera: 'الكاميرا غير متوفرة',
      cameraBlocked: 'تم حجب الوصول للكاميرا. يرجى تفعيل إذن الكاميرا.',
      enableCamera: 'تفعيل الكاميرا',
      nutritionInfo: 'المعلومات الغذائية',
      activitySuggestions: 'الأنشطة المقترحة',
      confidence: 'مستوى الثقة',
      totalNutrition: 'إجمالي التغذية',
      recognizedFoods: 'الأطعمة المتعرف عليها',
      calories: 'سعرة حرارية',
      protein: 'بروتين',
      carbs: 'كربوهيدرات',
      fat: 'دهون',
      fiber: 'ألياف',
      sodium: 'صوديوم',
      grams: 'جرام',
      minutes: 'دقيقة',
      burnCalories: 'حرق السعرات',
      tryAgain: 'حاول مرة أخرى',
      saveMeal: 'حفظ الوجبة',
      newAnalysis: 'تحليل جديد',
      tips: {
        title: 'نصائح لتحسين التعرف',
        items: [
          'تأكد من الإضاءة الجيدة',
          'اجعل الطعام في وسط الإطار',
          'تجنب الظلال على الطعام',
          'اشمل الطبق بالكامل'
        ]
      }
    }
  };

  const t = content[language];

  // Initialize camera
  const initializeCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraPermission('granted');
        setError(null);
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraPermission('denied');
      setError('Camera access denied or not available');
    }
  }, []);

  // Check camera permission on load
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
      initializeCamera();
    }
  }, [initializeCamera]);

  // Capture photo from video stream
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(imageData);
      setAnalysisResult(null);
      setAnalysisState(null);
      setError(null);
    }
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
        setAnalysisResult(null);
        setAnalysisState(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Analyze captured image
  const analyzeImage = useCallback(async () => {
    if (!capturedImage) return;

    try {
      setError(null);
      
      // Use progressive analysis for better UX
      const progressGenerator = analyzeWithProgress(capturedImage);
      
      for await (const state of progressGenerator) {
        setAnalysisState(await state);
      }
      
      // Get final result
      const result = await foodAnalysisService.analyzeFoodImage(capturedImage);
      setAnalysisResult(result);
      setAnalysisState(null);
      
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Failed to analyze image. Please try again.');
      setAnalysisState(null);
    }
  }, [capturedImage]);

  // Save meal to storage
  const saveMeal = useCallback(() => {
    if (!analysisResult || !capturedImage) return;

    const mealEntry = {
      id: storageService.generateId(),
      userId: 'user',
      timestamp: new Date(),
      mealType: 'snack' as const,
      foods: analysisResult.foods,
      totalNutrition: analysisResult.totalNutrition,
      image: capturedImage
    };

    storageService.saveMealEntry(mealEntry);
    
    // Show success feedback (could be replaced with toast)
    alert(language === 'en' ? 'Meal saved successfully!' : 'تم حفظ الوجبة بنجاح!');
  }, [analysisResult, capturedImage, language]);

  // Get activity suggestions
  const getActivitySuggestions = useCallback(() => {
    if (!analysisResult) return [];

    const userProfile = getUserProfile();
    if (!userProfile) {
      // Default profile for demo
      return getSuggestionsForCalories(analysisResult.totalNutrition.calories, {
        id: 'demo',
        name: 'Demo User',
        age: 30,
        gender: 'male',
        weight: 70,
        height: 175,
        activityLevel: 'moderately_active',
        goal: 'maintain',
        dailyCalorieGoal: 2000,
        preferredLanguage: language,
        createdAt: new Date()
      }).slice(0, 3);
    }

    return getSuggestionsForCalories(
      analysisResult.totalNutrition.calories, 
      userProfile
    ).slice(0, 3);
  }, [analysisResult, language]);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 ${language === 'ar' ? 'font-arabic' : ''}`}>
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-green-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  ← {t.backToDashboard}
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-green-900">{t.title}</h1>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            >
              {language === 'en' ? 'العربية' : 'English'}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Camera Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>{language === 'en' ? 'Capture Food' : 'التقاط الطعام'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Camera/Image Display */}
                <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video">
                  {!capturedImage ? (
                    cameraPermission === 'granted' ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <div className="text-center space-y-4">
                          <div className="text-6xl">📷</div>
                          <p>{cameraPermission === 'denied' ? t.cameraBlocked : t.noCamera}</p>
                          {cameraPermission === 'denied' && (
                            <Button onClick={initializeCamera} variant="outline">
                              {t.enableCamera}
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  ) : (
                    <img
                      src={capturedImage}
                      alt="Captured food"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Camera Controls */}
                <div className="flex flex-wrap gap-3">
                  {!capturedImage ? (
                    <>
                      <Button
                        onClick={capturePhoto}
                        disabled={cameraPermission !== 'granted'}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        📸 {t.capture}
                      </Button>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="flex-1"
                      >
                        🖼️ {t.uploadFromGallery}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => setCapturedImage(null)}
                        variant="outline"
                      >
                        {t.retake}
                      </Button>
                      <Button
                        onClick={analyzeImage}
                        disabled={!!analysisState}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        {analysisState ? t.analyzing : `🔍 ${t.analyze}`}
                      </Button>
                    </>
                  )}
                </div>

                {/* Analysis Progress */}
                {analysisState && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {language === 'ar' ? analysisState.messageAr : analysisState.message}
                      </span>
                      <span className="text-sm text-gray-500">{analysisState.progress}%</span>
                    </div>
                    <Progress value={analysisState.progress} className="h-2" />
                  </div>
                )}

                {/* Error Display */}
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Tips */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-blue-800">{t.tips.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="text-sm text-blue-700 space-y-1">
                      {t.tips.items.map((tip, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {analysisResult && (
              <>
                {/* Nutrition Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {t.nutritionInfo}
                      <Badge 
                        className={`${
                          foodAnalysisService.getConfidenceDisplay(analysisResult.confidence, language).bgColor
                        } ${
                          foodAnalysisService.getConfidenceDisplay(analysisResult.confidence, language).color
                        }`}
                      >
                        {t.confidence}: {foodAnalysisService.getConfidenceDisplay(analysisResult.confidence, language).percentage}%
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Total Nutrition Summary */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-green-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {analysisResult.totalNutrition.calories}
                        </div>
                        <div className="text-sm text-gray-600">{t.calories}</div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{t.protein}:</span>
                          <span>{analysisResult.totalNutrition.protein}g</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{t.carbs}:</span>
                          <span>{analysisResult.totalNutrition.carbs}g</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{t.fat}:</span>
                          <span>{analysisResult.totalNutrition.fat}g</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Recognized Foods */}
                    <div>
                      <h4 className="font-semibold mb-3">{t.recognizedFoods}</h4>
                      <div className="space-y-2">
                        {analysisResult.foods.map((food, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div>
                              <span className="font-medium">
                                {language === 'ar' ? food.nameAr : food.name}
                              </span>
                              <span className="text-sm text-gray-500 ml-2">
                                ({food.estimatedGrams}{t.grams})
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">{food.nutrition.calories} cal</div>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  foodAnalysisService.getConfidenceDisplay(food.confidence, language).color
                                }`}
                              >
                                {Math.round(food.confidence * 100)}%
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button onClick={saveMeal} className="flex-1">
                        💾 {t.saveMeal}
                      </Button>
                      <Button 
                        onClick={() => {
                          setCapturedImage(null);
                          setAnalysisResult(null);
                        }}
                        variant="outline"
                        className="flex-1"
                      >
                        🔄 {t.newAnalysis}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Activity Suggestions */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t.activitySuggestions}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {getActivitySuggestions().map((suggestion, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <div>
                            <div className="font-medium">
                              {language === 'ar' ? suggestion.activity.nameAr : suggestion.activity.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {suggestion.duration} {t.minutes} • {suggestion.totalCalories} cal
                            </div>
                          </div>
                          <Badge className="bg-orange-100 text-orange-800">
                            {suggestion.matchPercentage}%
                          </Badge>
                        </div>
                      ))}
                      <div className="text-center pt-2">
                        <span className="text-sm text-gray-500">
                          {language === 'en' 
                            ? `Activities to burn ~${analysisResult.totalNutrition.calories} calories`
                            : `أنشطة لحرق ~${analysisResult.totalNutrition.calories} سعرة حرارية`
                          }
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {!capturedImage && !analysisResult && (
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="text-center py-12">
                  <div className="text-6xl mb-4">🍽️</div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Ready to Analyze' : 'جاهز للتحليل'}
                  </h3>
                  <p className="text-gray-500">
                    {language === 'en' 
                      ? 'Capture or upload a photo of your food to get started'
                      : 'التقط أو ارفع صورة طعامك للبدء'
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />

      <style jsx global>{`
        .font-arabic {
          font-family: 'Noto Sans Arabic', sans-serif;
        }
      `}</style>
    </div>
  );
}