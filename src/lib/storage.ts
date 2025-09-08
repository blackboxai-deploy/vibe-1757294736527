import { UserProfile, MealEntry, DailyProgress, AppSettings } from '@/types';

// Local storage keys
const STORAGE_KEYS = {
  USER_PROFILE: 'calo_lens_user_profile',
  MEAL_ENTRIES: 'calo_lens_meal_entries',
  DAILY_PROGRESS: 'calo_lens_daily_progress',
  APP_SETTINGS: 'calo_lens_app_settings',
  ONBOARDING_COMPLETE: 'calo_lens_onboarding_complete'
} as const;

// Storage service for managing user data
export class StorageService {
  private static instance: StorageService;
  
  private constructor() {}
  
  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // Generic storage methods
  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  private getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return null;
    }
  }

  private removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  }

  // User Profile Management
  saveUserProfile(profile: UserProfile): void {
    this.setItem(STORAGE_KEYS.USER_PROFILE, profile);
  }

  getUserProfile(): UserProfile | null {
    return this.getItem<UserProfile>(STORAGE_KEYS.USER_PROFILE);
  }

  updateUserProfile(updates: Partial<UserProfile>): void {
    const currentProfile = this.getUserProfile();
    if (currentProfile) {
      const updatedProfile = { ...currentProfile, ...updates };
      this.saveUserProfile(updatedProfile);
    }
  }

  // Meal Entries Management
  saveMealEntry(entry: MealEntry): void {
    const entries = this.getMealEntries();
    entries.push(entry);
    this.setItem(STORAGE_KEYS.MEAL_ENTRIES, entries);
  }

  getMealEntries(): MealEntry[] {
    return this.getItem<MealEntry[]>(STORAGE_KEYS.MEAL_ENTRIES) || [];
  }

  getMealEntriesByDate(date: string): MealEntry[] {
    const entries = this.getMealEntries();
    return entries.filter(entry => {
      const entryDate = new Date(entry.timestamp).toISOString().split('T')[0];
      return entryDate === date;
    });
  }

  getMealEntriesByDateRange(startDate: string, endDate: string): MealEntry[] {
    const entries = this.getMealEntries();
    return entries.filter(entry => {
      const entryDate = new Date(entry.timestamp).toISOString().split('T')[0];
      return entryDate >= startDate && entryDate <= endDate;
    });
  }

  updateMealEntry(entryId: string, updates: Partial<MealEntry>): void {
    const entries = this.getMealEntries();
    const index = entries.findIndex(entry => entry.id === entryId);
    if (index !== -1) {
      entries[index] = { ...entries[index], ...updates };
      this.setItem(STORAGE_KEYS.MEAL_ENTRIES, entries);
    }
  }

  deleteMealEntry(entryId: string): void {
    const entries = this.getMealEntries();
    const filteredEntries = entries.filter(entry => entry.id !== entryId);
    this.setItem(STORAGE_KEYS.MEAL_ENTRIES, filteredEntries);
  }

  // Daily Progress Management
  saveDailyProgress(progress: DailyProgress): void {
    const allProgress = this.getDailyProgress();
    const existingIndex = allProgress.findIndex(p => p.date === progress.date);
    
    if (existingIndex !== -1) {
      allProgress[existingIndex] = progress;
    } else {
      allProgress.push(progress);
    }
    
    // Keep only last 90 days of progress
    const sortedProgress = allProgress
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 90);
    
    this.setItem(STORAGE_KEYS.DAILY_PROGRESS, sortedProgress);
  }

  getDailyProgress(): DailyProgress[] {
    return this.getItem<DailyProgress[]>(STORAGE_KEYS.DAILY_PROGRESS) || [];
  }

  getDailyProgressByDate(date: string): DailyProgress | null {
    const allProgress = this.getDailyProgress();
    return allProgress.find(progress => progress.date === date) || null;
  }

  getWeeklyProgress(weekStartDate: string): DailyProgress[] {
    const allProgress = this.getDailyProgress();
    const weekStart = new Date(weekStartDate);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    return allProgress.filter(progress => {
      const progressDate = new Date(progress.date);
      return progressDate >= weekStart && progressDate <= weekEnd;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  // App Settings Management
  saveAppSettings(settings: AppSettings): void {
    this.setItem(STORAGE_KEYS.APP_SETTINGS, settings);
  }

  getAppSettings(): AppSettings {
    return this.getItem<AppSettings>(STORAGE_KEYS.APP_SETTINGS) || {
      language: 'en',
      theme: 'system',
      notifications: true,
      autoAnalysis: true,
      saveToHistory: true,
      shareData: false
    };
  }

  updateAppSettings(updates: Partial<AppSettings>): void {
    const currentSettings = this.getAppSettings();
    const updatedSettings = { ...currentSettings, ...updates };
    this.saveAppSettings(updatedSettings);
  }

  // Onboarding Status
  setOnboardingComplete(complete: boolean = true): void {
    this.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, complete);
  }

  isOnboardingComplete(): boolean {
    return this.getItem<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETE) || false;
  }

  // Statistics and Analytics
  getStatistics(): {
    totalMeals: number;
    totalDays: number;
    averageCaloriesPerDay: number;
    mostLoggedMealType: string;
    streakDays: number;
  } {
    const entries = this.getMealEntries();
    const progress = this.getDailyProgress();
    
    // Calculate total calories over all days
    const totalCalories = progress.reduce((sum, day) => sum + day.caloriesConsumed, 0);
    const averageCaloriesPerDay = progress.length > 0 ? totalCalories / progress.length : 0;
    
    // Find most logged meal type
    const mealTypeCounts: Record<string, number> = {};
    entries.forEach(entry => {
      mealTypeCounts[entry.mealType] = (mealTypeCounts[entry.mealType] || 0) + 1;
    });
    
    const mostLoggedMealType = Object.entries(mealTypeCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'breakfast';
    
    // Calculate current streak (consecutive days with logged meals)
    let streakDays = 0;
    const sortedDates = progress
      .map(p => p.date)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    const today = new Date().toISOString().split('T')[0];
    let currentDate = today;
    
    for (const date of sortedDates) {
      if (date === currentDate) {
        streakDays++;
        const nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() - 1);
        currentDate = nextDate.toISOString().split('T')[0];
      } else {
        break;
      }
    }
    
    return {
      totalMeals: entries.length,
      totalDays: progress.length,
      averageCaloriesPerDay: Math.round(averageCaloriesPerDay),
      mostLoggedMealType,
      streakDays
    };
  }

  // Data Export/Import
  exportData(): string {
    const data = {
      userProfile: this.getUserProfile(),
      mealEntries: this.getMealEntries(),
      dailyProgress: this.getDailyProgress(),
      appSettings: this.getAppSettings(),
      exportDate: new Date().toISOString()
    };
    
    return JSON.stringify(data, null, 2);
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.userProfile) this.saveUserProfile(data.userProfile);
      if (data.mealEntries) this.setItem(STORAGE_KEYS.MEAL_ENTRIES, data.mealEntries);
      if (data.dailyProgress) this.setItem(STORAGE_KEYS.DAILY_PROGRESS, data.dailyProgress);
      if (data.appSettings) this.saveAppSettings(data.appSettings);
      
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  // Clear all data
  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      this.removeItem(key);
    });
  }

  // Generate today's date string
  getTodayDateString(): string {
    return new Date().toISOString().split('T')[0];
  }

  // Generate unique ID
  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// Export singleton instance
export const storageService = StorageService.getInstance();

// Convenience functions
export function saveUserProfile(profile: UserProfile): void {
  storageService.saveUserProfile(profile);
}

export function getUserProfile(): UserProfile | null {
  return storageService.getUserProfile();
}

export function saveMealEntry(entry: MealEntry): void {
  storageService.saveMealEntry(entry);
}

export function getMealEntriesByDate(date: string): MealEntry[] {
  return storageService.getMealEntriesByDate(date);
}

export function getAppSettings(): AppSettings {
  return storageService.getAppSettings();
}

export function updateAppSettings(updates: Partial<AppSettings>): void {
  storageService.updateAppSettings(updates);
}