'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    // Set RTL direction based on language
    setIsRTL(language === 'ar');
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const content = {
    en: {
      title: 'Calo Lens',
      subtitle: 'Smart Food Recognition & Nutrition Tracking',
      tagline: 'Capture, Know, Move — One app to calculate your meal calories and suggest how to burn them. Simple, fast, and accurate enough to start today.',
      features: [
        {
          title: 'AI Food Recognition',
          description: 'Advanced AI instantly identifies foods from your camera with high accuracy',
          badge: 'Smart'
        },
        {
          title: 'Instant Nutrition Analysis',
          description: 'Get detailed nutritional breakdown including calories, macros, and more',
          badge: 'Fast'
        },
        {
          title: 'Activity Suggestions',
          description: 'Personalized exercise recommendations to burn consumed calories',
          badge: 'Personalized'
        },
        {
          title: 'Arabic Support',
          description: 'Full Arabic language support with local cuisine recognition',
          badge: 'Local'
        },
        {
          title: 'Progress Tracking',
          description: 'Monitor your daily nutrition goals and weekly progress',
          badge: 'Insights'
        },
        {
          title: 'Barcode Scanning',
          description: 'Quick product information lookup by scanning barcodes',
          badge: 'Convenient'
        }
      ],
      cta: {
        primary: 'Start Analyzing Food',
        secondary: 'View Dashboard'
      },
      howItWorks: {
        title: 'How It Works',
        steps: [
          {
            number: '01',
            title: 'Capture',
            description: 'Take a photo of your meal using your camera or upload from gallery'
          },
          {
            number: '02',
            title: 'Analyze',
            description: 'AI recognizes food items and calculates nutritional information'
          },
          {
            number: '03',
            title: 'Track',
            description: 'Monitor your daily nutrition goals and progress over time'
          },
          {
            number: '04',
            title: 'Move',
            description: 'Get personalized activity suggestions to burn calories'
          }
        ]
      },
      stats: [
        { number: '50+', label: 'Food Items Recognized' },
        { number: '98%', label: 'Recognition Accuracy' },
        { number: '<3s', label: 'Analysis Time' },
        { number: '100+', label: 'Activity Suggestions' }
      ]
    },
    ar: {
      title: 'كالو لينس',
      subtitle: 'التعرف الذكي على الطعام وتتبع التغذية',
      tagline: 'التقط، اعرف، تحرّك — تطبيق واحد يحسب سعرات وجبتك ويقترح كيف تحرقها. بسيط، سريع، ودقيق بما يكفي لتبدأ اليوم.',
      features: [
        {
          title: 'التعرف الذكي على الطعام',
          description: 'ذكاء اصطناعي متقدم يتعرف على الأطعمة من الكاميرا بدقة عالية',
          badge: 'ذكي'
        },
        {
          title: 'تحليل غذائي فوري',
          description: 'احصل على تفصيل غذائي شامل يتضمن السعرات والعناصر الغذائية',
          badge: 'سريع'
        },
        {
          title: 'اقتراحات نشاط',
          description: 'توصيات تمارين مخصصة لحرق السعرات المستهلكة',
          badge: 'مخصص'
        },
        {
          title: 'دعم العربية',
          description: 'دعم كامل للغة العربية مع التعرف على المأكولات المحلية',
          badge: 'محلي'
        },
        {
          title: 'تتبع التقدم',
          description: 'راقب أهدافك الغذائية اليومية والتقدم الأسبوعي',
          badge: 'رؤى'
        },
        {
          title: 'مسح الباركود',
          description: 'بحث سريع عن معلومات المنتج عبر مسح الباركود',
          badge: 'مريح'
        }
      ],
      cta: {
        primary: 'ابدأ تحليل الطعام',
        secondary: 'عرض لوحة التحكم'
      },
      howItWorks: {
        title: 'كيف يعمل',
        steps: [
          {
            number: '٠١',
            title: 'التقط',
            description: 'التقط صورة لوجبتك باستخدام الكاميرا أو ارفع من المعرض'
          },
          {
            number: '٠٢',
            title: 'حلل',
            description: 'الذكاء الاصطناعي يتعرف على الأطعمة ويحسب المعلومات الغذائية'
          },
          {
            number: '٠٣',
            title: 'تتبع',
            description: 'راقب أهدافك الغذائية اليومية والتقدم عبر الوقت'
          },
          {
            number: '٠٤',
            title: 'تحرك',
            description: 'احصل على اقتراحات أنشطة مخصصة لحرق السعرات'
          }
        ]
      },
      stats: [
        { number: '+٥٠', label: 'صنف طعام متعرف عليه' },
        { number: '٩٨٪', label: 'دقة التعرف' },
        { number: '<٣ث', label: 'وقت التحليل' },
        { number: '+١٠٠', label: 'اقتراح نشاط' }
      ]
    }
  };

  const t = content[language];

  return (
    <div className={`min-h-screen ${isRTL ? 'font-arabic' : ''}`}>
      {/* Header */}
      <header className="relative z-10 bg-white/95 backdrop-blur-sm border-b border-green-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CL</span>
              </div>
              <h1 className="text-xl font-bold text-green-900">{t.title}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                className="min-w-[60px]"
              >
                {language === 'en' ? 'العربية' : 'English'}
              </Button>
              <Link href="/camera">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  {language === 'en' ? 'Get Started' : 'ابدأ الآن'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="mb-8">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 mb-4">
              {language === 'en' ? '🚀 AI-Powered' : '🚀 مدعوم بالذكاء الاصطناعي'}
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {t.subtitle}
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t.tagline}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/camera">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 text-lg"
              >
                📸 {t.cta.primary}
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button 
                variant="outline" 
                size="lg"
                className="border-green-600 text-green-700 hover:bg-green-50 px-8 py-3 text-lg"
              >
                📊 {t.cta.secondary}
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {t.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t.howItWorks.title}
            </h3>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {t.howItWorks.steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">{step.number}</span>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h4>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {language === 'en' ? 'Powerful Features' : 'ميزات قوية'}
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {language === 'en' 
                ? 'Everything you need to track nutrition and maintain a healthy lifestyle'
                : 'كل ما تحتاجه لتتبع التغذية والحفاظ على نمط حياة صحي'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {t.features.map((feature, index) => (
              <Card key={index} className="border-green-100 hover:border-green-300 transition-colors duration-200">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {feature.title}
                    </CardTitle>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {feature.badge}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">CL</span>
              </div>
              <h4 className="text-2xl font-bold">{t.title}</h4>
            </div>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              {language === 'en'
                ? 'Empowering healthier food choices through AI-powered nutrition tracking'
                : 'تمكين الخيارات الغذائية الأكثر صحة من خلال تتبع التغذية بالذكاء الاصطناعي'
              }
            </p>
            <div className="text-sm text-gray-500">
              © 2024 Calo Lens. {language === 'en' ? 'All rights reserved.' : 'جميع الحقوق محفوظة.'}
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .font-arabic {
          font-family: 'Noto Sans Arabic', sans-serif;
        }
      `}</style>
    </div>
  );
}