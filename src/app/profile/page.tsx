'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserProfile, AppSettings } from '@/types';
import { storageService, getUserProfile } from '@/lib/storage';
import { calculateCalorieGoal, calculateMacroGoals } from '@/lib/nutritionCalculator';

export default function ProfilePage() {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [appSettings, setAppSettings] = useState<AppSettings | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male' as 'male' | 'female',
    weight: '',
    height: '',
    activityLevel: 'moderately_active' as UserProfile['activityLevel'],
    goal: 'maintain' as UserProfile['goal']
  });

  const content = {
    en: {
      title: 'Profile Settings',
      backToDashboard: 'Back to Dashboard',
      personalInfo: 'Personal Information',
      nutritionGoals: 'Nutrition Goals',
      appPreferences: 'App Preferences',
      name: 'Full Name',
      age: 'Age',
      gender: 'Gender',
      male: 'Male',
      female: 'Female',
      weight: 'Weight (kg)',
      height: 'Height (cm)',
      activityLevel: 'Activity Level',
      goal: 'Goal',
      language: 'Language',
      theme: 'Theme',
      notifications: 'Notifications',
      autoAnalysis: 'Auto Analysis',
      saveToHistory: 'Save to History',
      shareData: 'Share Data',
      edit: 'Edit Profile',
      save: 'Save Changes',
      cancel: 'Cancel',
      creating: 'Creating Profile...',
      saving: 'Saving Changes...',
      profileSaved: 'Profile saved successfully!',
      settingsSaved: 'Settings saved successfully!',
      dailyCalorieGoal: 'Daily Calorie Goal',
      proteinGoal: 'Protein Goal',
      carbsGoal: 'Carbs Goal',
      fatGoal: 'Fat Goal',
      fiberGoal: 'Fiber Goal',
      calories: 'calories',
      grams: 'grams',
      activityLevels: {
        sedentary: 'Sedentary (little or no exercise)',
        lightly_active: 'Lightly active (light exercise 1-3 days/week)',
        moderately_active: 'Moderately active (moderate exercise 3-5 days/week)',
        very_active: 'Very active (hard exercise 6-7 days/week)'
      },
      goals: {
        lose: 'Lose weight',
        maintain: 'Maintain weight',
        gain: 'Gain weight'
      },
      themes: {
        light: 'Light',
        dark: 'Dark',
        system: 'System'
      },
      languages: {
        en: 'English',
        ar: 'العربية'
      }
    },
    ar: {
      title: 'إعدادات الملف الشخصي',
      backToDashboard: 'العودة للوحة التحكم',
      personalInfo: 'المعلومات الشخصية',
      nutritionGoals: 'الأهداف الغذائية',
      appPreferences: 'تفضيلات التطبيق',
      name: 'الاسم الكامل',
      age: 'العمر',
      gender: 'الجنس',
      male: 'ذكر',
      female: 'أنثى',
      weight: 'الوزن (كجم)',
      height: 'الطول (سم)',
      activityLevel: 'مستوى النشاط',
      goal: 'الهدف',
      language: 'اللغة',
      theme: 'المظهر',
      notifications: 'الإشعارات',
      autoAnalysis: 'التحليل التلقائي',
      saveToHistory: 'حفظ في التاريخ',
      shareData: 'مشاركة البيانات',
      edit: 'تعديل الملف الشخصي',
      save: 'حفظ التغييرات',
      cancel: 'إلغاء',
      creating: 'جاري إنشاء الملف الشخصي...',
      saving: 'جاري حفظ التغييرات...',
      profileSaved: 'تم حفظ الملف الشخصي بنجاح!',
      settingsSaved: 'تم حفظ الإعدادات بنجاح!',
      dailyCalorieGoal: 'الهدف اليومي من السعرات',
      proteinGoal: 'هدف البروتين',
      carbsGoal: 'هدف الكربوهيدرات',
      fatGoal: 'هدف الدهون',
      fiberGoal: 'هدف الألياف',
      calories: 'سعرة حرارية',
      grams: 'جرام',
      activityLevels: {
        sedentary: 'خامل (قليل أو بدون تمرين)',
        lightly_active: 'نشط قليلاً (تمرين خفيف 1-3 أيام/أسبوع)',
        moderately_active: 'نشط معتدل (تمرين معتدل 3-5 أيام/أسبوع)',
        very_active: 'نشط جداً (تمرين شاق 6-7 أيام/أسبوع)'
      },
      goals: {
        lose: 'فقدان الوزن',
        maintain: 'الحفاظ على الوزن',
        gain: 'زيادة الوزن'
      },
      themes: {
        light: 'فاتح',
        dark: 'داكن',
        system: 'النظام'
      },
      languages: {
        en: 'English',
        ar: 'العربية'
      }
    }
  };

  const t = content[language];

  // Load data on mount
  useEffect(() => {
    const profile = getUserProfile();
    const settings = storageService.getAppSettings();
    
    setUserProfile(profile);
    setAppSettings(settings);
    
    if (profile) {
      setFormData({
        name: profile.name,
        age: profile.age.toString(),
        gender: profile.gender,
        weight: profile.weight.toString(),
        height: profile.height.toString(),
        activityLevel: profile.activityLevel,
        goal: profile.goal
      });
    } else {
      setIsEditing(true); // Start in edit mode if no profile exists
    }

    // Set language from settings
    if (settings.language !== language) {
      setLanguage(settings.language);
    }
  }, []);

  // Calculate nutrition goals based on current form data
  const calculateCurrentGoals = () => {
    if (!formData.weight || !formData.height || !formData.age) return null;
    
    const tempProfile: UserProfile = {
      id: 'temp',
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      activityLevel: formData.activityLevel,
      goal: formData.goal,
      dailyCalorieGoal: 0,
      preferredLanguage: language,
      createdAt: new Date()
    };
    
    const dailyCalories = calculateCalorieGoal(tempProfile);
    tempProfile.dailyCalorieGoal = dailyCalories;
    
    return {
      profile: tempProfile,
      goals: calculateMacroGoals(dailyCalories)
    };
  };

  const currentGoals = calculateCurrentGoals();

  // Handle form submission
  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const profile: UserProfile = {
        id: userProfile?.id || storageService.generateId(),
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender,
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        activityLevel: formData.activityLevel,
        goal: formData.goal,
        dailyCalorieGoal: currentGoals?.goals.calories || 2000,
        preferredLanguage: language,
        createdAt: userProfile?.createdAt || new Date()
      };

      storageService.saveUserProfile(profile);
      setUserProfile(profile);
      setIsEditing(false);
      setSaveMessage(t.profileSaved);
      
      // Auto-hide success message
      setTimeout(() => setSaveMessage(null), 3000);
      
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveMessage('Error saving profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle settings update
  const handleSettingsUpdate = (updates: Partial<AppSettings>) => {
    if (!appSettings) return;
    
    const newSettings = { ...appSettings, ...updates };
    storageService.updateAppSettings(newSettings);
    setAppSettings(newSettings);
    setSaveMessage(t.settingsSaved);
    
    // Update language if changed
    if (updates.language && updates.language !== language) {
      setLanguage(updates.language);
    }
    
    // Auto-hide success message
    setTimeout(() => setSaveMessage(null), 3000);
  };

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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Success Message */}
        {saveMessage && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">
              {saveMessage}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t.personalInfo}</CardTitle>
              {userProfile && !isEditing && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                >
                  {t.edit}
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t.name}</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={t.name}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">{t.age}</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      placeholder="25"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t.gender}</Label>
                    <RadioGroup
                      value={formData.gender}
                      onValueChange={(value) => setFormData({ ...formData, gender: value as 'male' | 'female' })}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">{t.male}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">{t.female}</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">{t.weight}</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      placeholder="70"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height">{t.height}</Label>
                    <Input
                      id="height"
                      type="number"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      placeholder="175"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t.activityLevel}</Label>
                    <Select
                      value={formData.activityLevel}
                      onValueChange={(value) => setFormData({ ...formData, activityLevel: value as UserProfile['activityLevel'] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(t.activityLevels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t.goal}</Label>
                    <Select
                      value={formData.goal}
                      onValueChange={(value) => setFormData({ ...formData, goal: value as UserProfile['goal'] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(t.goals).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2 flex space-x-4 pt-4">
                    <Button
                      onClick={handleSave}
                      disabled={isSaving || !formData.name || !formData.age || !formData.weight || !formData.height}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {isSaving ? (userProfile ? t.saving : t.creating) : t.save}
                    </Button>
                    {userProfile && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          // Reset form data
                          if (userProfile) {
                            setFormData({
                              name: userProfile.name,
                              age: userProfile.age.toString(),
                              gender: userProfile.gender,
                              weight: userProfile.weight.toString(),
                              height: userProfile.height.toString(),
                              activityLevel: userProfile.activityLevel,
                              goal: userProfile.goal
                            });
                          }
                        }}
                        className="flex-1"
                      >
                        {t.cancel}
                      </Button>
                    )}
                  </div>
                </div>
              ) : userProfile ? (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">{t.name}</Label>
                    <div className="font-medium">{userProfile.name}</div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">{t.age}</Label>
                    <div className="font-medium">{userProfile.age} {language === 'en' ? 'years' : 'سنة'}</div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">{t.gender}</Label>
                    <div className="font-medium">{userProfile.gender === 'male' ? t.male : t.female}</div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">{t.weight}</Label>
                    <div className="font-medium">{userProfile.weight} kg</div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">{t.height}</Label>
                    <div className="font-medium">{userProfile.height} cm</div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">{t.activityLevel}</Label>
                    <div className="font-medium">{t.activityLevels[userProfile.activityLevel]}</div>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm text-gray-600">{t.goal}</Label>
                    <div className="font-medium">{t.goals[userProfile.goal]}</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">👤</div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Create Your Profile' : 'أنشئ ملفك الشخصي'}
                  </h3>
                  <p className="text-gray-500">
                    {language === 'en' 
                      ? 'Set up your profile to get personalized nutrition goals'
                      : 'أعد إعداد ملفك الشخصي للحصول على أهداف تغذية مخصصة'
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Nutrition Goals */}
          {currentGoals && (
            <Card>
              <CardHeader>
                <CardTitle>{t.nutritionGoals}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {currentGoals.goals.calories}
                    </div>
                    <div className="text-sm text-gray-600">{t.dailyCalorieGoal}</div>
                    <div className="text-xs text-gray-500">{t.calories}</div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-xl font-bold text-blue-600">
                      {currentGoals.goals.protein.min}-{currentGoals.goals.protein.max}
                    </div>
                    <div className="text-sm text-gray-600">{t.proteinGoal}</div>
                    <div className="text-xs text-gray-500">{t.grams}</div>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <div className="text-xl font-bold text-orange-600">
                      {currentGoals.goals.carbs.min}-{currentGoals.goals.carbs.max}
                    </div>
                    <div className="text-sm text-gray-600">{t.carbsGoal}</div>
                    <div className="text-xs text-gray-500">{t.grams}</div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-xl font-bold text-purple-600">
                      {currentGoals.goals.fat.min}-{currentGoals.goals.fat.max}
                    </div>
                    <div className="text-sm text-gray-600">{t.fatGoal}</div>
                    <div className="text-xs text-gray-500">{t.grams}</div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <div className="text-xl font-bold text-yellow-600">
                      {currentGoals.goals.fiber}
                    </div>
                    <div className="text-sm text-gray-600">{t.fiberGoal}</div>
                    <div className="text-xs text-gray-500">{t.grams}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* App Preferences */}
          {appSettings && (
            <Card>
              <CardHeader>
                <CardTitle>{t.appPreferences}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>{t.language}</Label>
                    <Select
                      value={appSettings.language}
                      onValueChange={(value) => handleSettingsUpdate({ language: value as 'en' | 'ar' })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(t.languages).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t.theme}</Label>
                    <Select
                      value={appSettings.theme}
                      onValueChange={(value) => handleSettingsUpdate({ theme: value as AppSettings['theme'] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(t.themes).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">{t.notifications}</Label>
                      <p className="text-xs text-gray-500">
                        {language === 'en' 
                          ? 'Receive notifications for meal reminders and progress updates'
                          : 'تلقي إشعارات لتذكيرات الوجبات وتحديثات التقدم'
                        }
                      </p>
                    </div>
                    <Switch
                      checked={appSettings.notifications}
                      onCheckedChange={(checked) => handleSettingsUpdate({ notifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">{t.autoAnalysis}</Label>
                      <p className="text-xs text-gray-500">
                        {language === 'en' 
                          ? 'Automatically analyze photos when captured'
                          : 'تحليل الصور تلقائياً عند التقاطها'
                        }
                      </p>
                    </div>
                    <Switch
                      checked={appSettings.autoAnalysis}
                      onCheckedChange={(checked) => handleSettingsUpdate({ autoAnalysis: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">{t.saveToHistory}</Label>
                      <p className="text-xs text-gray-500">
                        {language === 'en' 
                          ? 'Save analyzed meals to your history'
                          : 'حفظ الوجبات المحللة في سجلك'
                        }
                      </p>
                    </div>
                    <Switch
                      checked={appSettings.saveToHistory}
                      onCheckedChange={(checked) => handleSettingsUpdate({ saveToHistory: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">{t.shareData}</Label>
                      <p className="text-xs text-gray-500">
                        {language === 'en' 
                          ? 'Share anonymous usage data to improve the app'
                          : 'مشاركة بيانات الاستخدام المجهولة لتحسين التطبيق'
                        }
                      </p>
                    </div>
                    <Switch
                      checked={appSettings.shareData}
                      onCheckedChange={(checked) => handleSettingsUpdate({ shareData: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <style jsx global>{`
        .font-arabic {
          font-family: 'Noto Sans Arabic', sans-serif;
        }
      `}</style>
    </div>
  );
}