'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DailyProgress, MealEntry, UserProfile, NutritionGoals } from '@/types';
import { storageService, getUserProfile } from '@/lib/storage';
import { calculateCalorieGoal, calculateMacroGoals, calculateGoalProgress, getNutritionQualityScore } from '@/lib/nutritionCalculator';

export default function DashboardPage() {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [selectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailyProgress, setDailyProgress] = useState<DailyProgress | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [weeklyData, setWeeklyData] = useState<DailyProgress[]>([]);

  const content = {
    en: {
      title: 'Nutrition Dashboard',
      today: 'Today',
      week: 'Week',
      month: 'Month',
      profile: 'Profile',
      scanFood: 'Scan Food',
      caloriesConsumed: 'Calories Consumed',
      caloriesGoal: 'Daily Goal',
      caloriesRemaining: 'Remaining',
      nutritionBreakdown: 'Nutrition Breakdown',
      recentMeals: 'Recent Meals',
      weeklyProgress: 'Weekly Progress',
      qualityScore: 'Nutrition Quality',
      noMealsToday: 'No meals logged today',
      scanFirstMeal: 'Scan your first meal to get started',
      breakfast: 'Breakfast',
      lunch: 'Lunch',
      dinner: 'Dinner',
      snack: 'Snack',
      protein: 'Protein',
      carbs: 'Carbs',
      fat: 'Fat',
      fiber: 'Fiber',
      sodium: 'Sodium',
      calories: 'calories',
      grams: 'g',
      milligrams: 'mg',
      excellent: 'Excellent',
      good: 'Good',
      fair: 'Fair',
      needsImprovement: 'Needs Improvement',
      setupProfile: 'Set up your profile to get personalized nutrition goals and recommendations.',
      createProfile: 'Create Profile'
    },
    ar: {
      title: 'لوحة التحكم الغذائية',
      today: 'اليوم',
      week: 'الأسبوع',
      month: 'الشهر',
      profile: 'الملف الشخصي',
      scanFood: 'مسح الطعام',
      caloriesConsumed: 'السعرات المستهلكة',
      caloriesGoal: 'الهدف اليومي',
      caloriesRemaining: 'المتبقية',
      nutritionBreakdown: 'تفصيل التغذية',
      recentMeals: 'الوجبات الأخيرة',
      weeklyProgress: 'التقدم الأسبوعي',
      qualityScore: 'جودة التغذية',
      noMealsToday: 'لم يتم تسجيل وجبات اليوم',
      scanFirstMeal: 'امسح وجبتك الأولى للبدء',
      breakfast: 'إفطار',
      lunch: 'غداء',
      dinner: 'عشاء',
      snack: 'وجبة خفيفة',
      protein: 'بروتين',
      carbs: 'كربوهيدرات',
      fat: 'دهون',
      fiber: 'ألياف',
      sodium: 'صوديوم',
      calories: 'سعرة حرارية',
      grams: 'جم',
      milligrams: 'مجم',
      excellent: 'ممتاز',
      good: 'جيد',
      fair: 'مقبول',
      needsImprovement: 'يحتاج تحسين',
      setupProfile: 'أعد إعداد ملفك الشخصي للحصول على أهداف تغذية مخصصة وتوصيات.',
      createProfile: 'إنشاء ملف شخصي'
    }
  };

  const t = content[language];

  // Load data on mount
  useEffect(() => {
    loadDashboardData();
  }, [selectedDate]);

  const loadDashboardData = () => {
    const profile = getUserProfile();
    setUserProfile(profile);

    // Get today's meals and progress
    const todaysMeals = storageService.getMealEntriesByDate(selectedDate);
    const existingProgress = storageService.getDailyProgressByDate(selectedDate);

    // Calculate total nutrition for today
    const totalNutrition = todaysMeals.reduce((total, meal) => ({
      calories: total.calories + meal.totalNutrition.calories,
      protein: total.protein + meal.totalNutrition.protein,
      carbs: total.carbs + meal.totalNutrition.carbs,
      fat: total.fat + meal.totalNutrition.fat,
      fiber: total.fiber + meal.totalNutrition.fiber,
      sugar: total.sugar + meal.totalNutrition.sugar,
      sodium: total.sodium + meal.totalNutrition.sodium
    }), {
      calories: 0, protein: 0, carbs: 0, fat: 0, 
      fiber: 0, sugar: 0, sodium: 0
    });

    const caloriesGoal = profile ? calculateCalorieGoal(profile) : 2000;

    const progress: DailyProgress = existingProgress || {
      date: selectedDate,
      caloriesConsumed: totalNutrition.calories,
      caloriesGoal,
      nutrition: totalNutrition,
      meals: todaysMeals
    };

    // Update progress if different
    if (!existingProgress || existingProgress.caloriesConsumed !== totalNutrition.calories) {
      progress.caloriesConsumed = totalNutrition.calories;
      progress.nutrition = totalNutrition;
      progress.meals = todaysMeals;
      storageService.saveDailyProgress(progress);
    }

    setDailyProgress(progress);

    // Load weekly data
    const weekStart = new Date(selectedDate);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of week
    const weekStartString = weekStart.toISOString().split('T')[0];
    const weekly = storageService.getWeeklyProgress(weekStartString);
    setWeeklyData(weekly);
  };

  // Calculated values
  const nutritionGoals = useMemo((): NutritionGoals | null => {
    if (!userProfile || !dailyProgress) return null;
    return calculateMacroGoals(dailyProgress.caloriesGoal);
  }, [userProfile, dailyProgress]);

  const goalProgress = useMemo(() => {
    if (!dailyProgress || !nutritionGoals) return null;
    return calculateGoalProgress(dailyProgress.nutrition, nutritionGoals);
  }, [dailyProgress, nutritionGoals]);

  const qualityScore = useMemo(() => {
    if (!dailyProgress || !nutritionGoals) return 0;
    return getNutritionQualityScore(dailyProgress.nutrition, nutritionGoals);
  }, [dailyProgress, nutritionGoals]);

  const getQualityScoreLabel = (score: number) => {
    if (score >= 85) return { label: t.excellent, color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 70) return { label: t.good, color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 50) return { label: t.fair, color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { label: t.needsImprovement, color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getMealTypeLabel = (mealType: MealEntry['mealType']) => {
    const labels = {
      breakfast: t.breakfast,
      lunch: t.lunch,
      dinner: t.dinner,
      snack: t.snack
    };
    return labels[mealType];
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const caloriesRemaining = dailyProgress 
    ? Math.max(0, dailyProgress.caloriesGoal - dailyProgress.caloriesConsumed)
    : 0;

  const caloriesProgress = dailyProgress 
    ? Math.min(100, (dailyProgress.caloriesConsumed / dailyProgress.caloriesGoal) * 100)
    : 0;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 ${language === 'ar' ? 'font-arabic' : ''}`}>
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-green-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CL</span>
                </div>
              </Link>
              <h1 className="text-xl font-bold text-green-900">{t.title}</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              >
                {language === 'en' ? 'العربية' : 'English'}
              </Button>
              <Link href="/camera">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  📸 {t.scanFood}
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline" size="sm">
                  👤 {t.profile}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Profile Setup Alert */}
        {!userProfile && (
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <AlertDescription className="flex items-center justify-between">
              <span className="text-blue-800">{t.setupProfile}</span>
              <Link href="/profile">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  {t.createProfile}
                </Button>
              </Link>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="today" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-md">
            <TabsTrigger value="today">{t.today}</TabsTrigger>
            <TabsTrigger value="week">{t.week}</TabsTrigger>
            <TabsTrigger value="month">{t.month}</TabsTrigger>
            <TabsTrigger value="profile">{t.profile}</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-6">
            {dailyProgress ? (
              <div className="grid gap-6">
                {/* Calories Overview */}
                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{t.caloriesConsumed}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {dailyProgress.caloriesConsumed}
                      </div>
                      <Progress value={caloriesProgress} className="h-2 mb-2" />
                      <div className="text-sm text-gray-600">
                        {Math.round(caloriesProgress)}% of {dailyProgress.caloriesGoal} {t.calories}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{t.caloriesRemaining}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {caloriesRemaining}
                      </div>
                      <div className="text-sm text-gray-600">
                        {caloriesRemaining > 0 
                          ? (language === 'en' ? 'Calories left for today' : 'سعرة متبقية لليوم')
                          : (language === 'en' ? 'Goal reached!' : 'تم الوصول للهدف!')
                        }
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{t.qualityScore}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl font-bold text-purple-600">
                          {qualityScore}
                        </div>
                        <Badge className={`${getQualityScoreLabel(qualityScore).bg} ${getQualityScoreLabel(qualityScore).color}`}>
                          {getQualityScoreLabel(qualityScore).label}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Nutrition Breakdown */}
                {goalProgress && nutritionGoals && (
                  <Card>
                    <CardHeader>
                      <CardTitle>{t.nutritionBreakdown}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{t.protein}</span>
                            <span>{dailyProgress.nutrition.protein}{t.grams}</span>
                          </div>
                          <Progress value={Math.min(100, goalProgress.protein)} className="h-2" />
                          <div className="text-xs text-gray-500">
                            {Math.round(goalProgress.protein)}% of goal
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{t.carbs}</span>
                            <span>{dailyProgress.nutrition.carbs}{t.grams}</span>
                          </div>
                          <Progress value={Math.min(100, goalProgress.carbs)} className="h-2" />
                          <div className="text-xs text-gray-500">
                            {Math.round(goalProgress.carbs)}% of goal
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{t.fat}</span>
                            <span>{dailyProgress.nutrition.fat}{t.grams}</span>
                          </div>
                          <Progress value={Math.min(100, goalProgress.fat)} className="h-2" />
                          <div className="text-xs text-gray-500">
                            {Math.round(goalProgress.fat)}% of goal
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{t.fiber}</span>
                            <span>{dailyProgress.nutrition.fiber}{t.grams}</span>
                          </div>
                          <Progress value={Math.min(100, goalProgress.fiber)} className="h-2" />
                          <div className="text-xs text-gray-500">
                            {Math.round(goalProgress.fiber)}% of goal
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recent Meals */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t.recentMeals}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {dailyProgress.meals.length > 0 ? (
                      <div className="space-y-3">
                        {dailyProgress.meals.map((meal, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Badge variant="outline">
                                {getMealTypeLabel(meal.mealType)}
                              </Badge>
                              <div>
                                <div className="font-medium">
                                  {meal.foods.length} {language === 'en' ? 'items' : 'عناصر'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {formatTime(meal.timestamp)}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-green-600">
                                {meal.totalNutrition.calories} {language === 'en' ? 'cal' : 'سعرة'}
                              </div>
                              <div className="text-xs text-gray-500">
                                P:{meal.totalNutrition.protein}g C:{meal.totalNutrition.carbs}g F:{meal.totalNutrition.fat}g
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-6xl mb-4">🍽️</div>
                        <h3 className="text-lg font-medium text-gray-700 mb-2">
                          {t.noMealsToday}
                        </h3>
                        <p className="text-gray-500 mb-4">
                          {t.scanFirstMeal}
                        </p>
                        <Link href="/camera">
                          <Button className="bg-green-600 hover:bg-green-700">
                            📸 {t.scanFood}
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'No Data Available' : 'لا توجد بيانات متاحة'}
                  </h3>
                  <p className="text-gray-500">
                    {language === 'en' 
                      ? 'Start tracking your meals to see your progress'
                      : 'ابدأ تتبع وجباتك لرؤية تقدمك'
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="week" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.weeklyProgress}</CardTitle>
                <CardDescription>
                  {language === 'en' 
                    ? 'Your nutrition progress over the past 7 days'
                    : 'تقدم تغذيتك خلال الـ 7 أيام الماضية'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {weeklyData.length > 0 ? (
                  <div className="space-y-4">
                    {weeklyData.map((day, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">
                            {new Date(day.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
                              weekday: 'long',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="text-sm text-gray-500">
                            {day.meals.length} {language === 'en' ? 'meals logged' : 'وجبة مسجلة'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">
                            {day.caloriesConsumed} / {day.caloriesGoal} {language === 'en' ? 'cal' : 'سعرة'}
                          </div>
                          <div className="w-24">
                            <Progress 
                              value={Math.min(100, (day.caloriesConsumed / day.caloriesGoal) * 100)} 
                              className="h-1"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">📈</div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'No Weekly Data' : 'لا توجد بيانات أسبوعية'}
                    </h3>
                    <p className="text-gray-500">
                      {language === 'en' 
                        ? 'Track meals for a few days to see your weekly progress'
                        : 'تتبع الوجبات لعدة أيام لرؤية تقدمك الأسبوعي'
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="month">
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">🗓️</div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Monthly View Coming Soon' : 'العرض الشهري قريباً'}
                </h3>
                <p className="text-gray-500">
                  {language === 'en' 
                    ? 'Monthly progress tracking will be available in the next update'
                    : 'سيتوفر تتبع التقدم الشهري في التحديث القادم'
                  }
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">👤</div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Profile Management' : 'إدارة الملف الشخصي'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {language === 'en' 
                    ? 'Set up your profile to get personalized nutrition goals'
                    : 'أعد إعداد ملفك الشخصي للحصول على أهداف تغذية مخصصة'
                  }
                </p>
                <Link href="/profile">
                  <Button className="bg-green-600 hover:bg-green-700">
                    {userProfile ? (language === 'en' ? 'Edit Profile' : 'تعديل الملف الشخصي') : t.createProfile}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <style jsx global>{`
        .font-arabic {
          font-family: 'Noto Sans Arabic', sans-serif;
        }
      `}</style>
    </div>
  );
}