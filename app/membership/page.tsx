"use client"

import { useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { useLanguage } from '@/components/providers/language-provider';
import { Button } from '@/components/ui/button';
import { membershipBenefits, MembershipTier } from '@/lib/user-store';
import { 
  Crown, Check, Sparkles, Shield, Zap, Users, 
  ArrowLeft, Star, Gift, Clock
} from 'lucide-react';
import Link from 'next/link';

export default function MembershipPage() {
  const { user, membershipStatus, upgrade, isAuthenticated } = useAuth();
  const { lang } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<MembershipTier>('premium');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const handleUpgrade = (tier: MembershipTier) => {
    if (!isAuthenticated) {
      window.location.href = '/user';
      return;
    }
    
    const days = billingCycle === 'yearly' ? 365 : 30;
    upgrade(tier, days);
    alert(lang === 'zh' ? '升级成功！感谢您的支持！' : 'Upgrade successful! Thank you for your support!');
  };

  const plans = [
    { tier: 'basic' as const, icon: Zap, popular: false },
    { tier: 'premium' as const, icon: Crown, popular: true },
    { tier: 'professional' as const, icon: Shield, popular: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-white/70 hover:text-white mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {lang === 'zh' ? '返回首页' : 'Back to Home'}
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full text-purple-300 text-sm mb-4">
            <Gift className="w-4 h-4" />
            {lang === 'zh' ? '限时优惠 年付立省20%' : 'Limited Offer: Save 20% Yearly'}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {lang === 'zh' ? '选择适合你的方案' : 'Choose Your Plan'}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {lang === 'zh' 
              ? '解锁全部功能，获得AI智能分析、无限训练和专业报告' 
              : 'Unlock all features with AI analysis, unlimited training and professional reports'}
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-1 flex">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === 'monthly' 
                  ? 'bg-white text-gray-900' 
                  : 'text-white hover:text-white/80'
              }`}
            >
              {lang === 'zh' ? '月付' : 'Monthly'}
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                billingCycle === 'yearly' 
                  ? 'bg-white text-gray-900' 
                  : 'text-white hover:text-white/80'
              }`}
            >
              {lang === 'zh' ? '年付' : 'Yearly'}
              <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">-20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          {plans.map(({ tier, icon: Icon, popular }) => {
            const benefit = membershipBenefits[tier];
            const price = billingCycle === 'yearly' 
              ? (benefit.price * 12 * 0.8).toFixed(0) 
              : benefit.price.toFixed(0);
            const monthlyPrice = billingCycle === 'yearly'
              ? (benefit.price * 0.8).toFixed(1)
              : benefit.price.toFixed(0);
            const isCurrentPlan = membershipStatus.tier === tier;

            return (
              <div
                key={tier}
                className={`relative rounded-3xl p-8 transition-all ${
                  popular 
                    ? 'bg-gradient-to-b from-purple-600 to-purple-900 scale-105 shadow-2xl shadow-purple-500/30' 
                    : 'bg-white/10 backdrop-blur-sm hover:bg-white/15'
                } ${selectedPlan === tier ? 'ring-2 ring-purple-400' : ''}`}
                onClick={() => setSelectedPlan(tier)}
              >
                {popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full text-sm font-bold text-white flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {lang === 'zh' ? '最受欢迎' : 'Most Popular'}
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-xl ${popular ? 'bg-white/20' : 'bg-purple-500/20'}`}>
                    <Icon className={`w-6 h-6 ${popular ? 'text-white' : 'text-purple-400'}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {lang === 'zh' ? benefit.name : benefit.nameEn}
                    </h3>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">¥{monthlyPrice}</span>
                    <span className="text-gray-300">/{lang === 'zh' ? '月' : 'mo'}</span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <p className="text-sm text-gray-400 mt-1">
                      {lang === 'zh' ? `年付 ¥${price}` : `¥${price} billed yearly`}
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {(lang === 'zh' ? benefit.features : benefit.featuresEn).map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-200">
                      <Check className={`w-5 h-5 flex-shrink-0 ${popular ? 'text-green-400' : 'text-purple-400'}`} />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleUpgrade(tier)}
                  disabled={isCurrentPlan}
                  className={`w-full py-3 rounded-xl font-medium ${
                    popular
                      ? 'bg-white text-purple-900 hover:bg-gray-100'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  } ${isCurrentPlan ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isCurrentPlan 
                    ? (lang === 'zh' ? '当前方案' : 'Current Plan')
                    : (lang === 'zh' ? '立即升级' : 'Upgrade Now')}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Features Comparison */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            {lang === 'zh' ? '功能对比' : 'Feature Comparison'}
          </h2>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-gray-300">{lang === 'zh' ? '功能' : 'Feature'}</th>
                  <th className="text-center p-4 text-gray-300">{lang === 'zh' ? '免费' : 'Free'}</th>
                  <th className="text-center p-4 text-gray-300">{lang === 'zh' ? '基础' : 'Basic'}</th>
                  <th className="text-center p-4 text-purple-300">{lang === 'zh' ? '高级' : 'Premium'}</th>
                  <th className="text-center p-4 text-gray-300">{lang === 'zh' ? '专业' : 'Pro'}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: lang === 'zh' ? '每日训练次数' : 'Daily Training', free: '1', basic: '5', premium: '∞', pro: '∞' },
                  { feature: lang === 'zh' ? '历史记录' : 'History', free: '7天', basic: '30天', premium: '180天', pro: '永久' },
                  { feature: lang === 'zh' ? 'AI智能分析' : 'AI Analysis', free: '✗', basic: '✗', premium: '✓', pro: '✓' },
                  { feature: lang === 'zh' ? '分享卡片' : 'Share Cards', free: '✗', basic: '✓', premium: '✓', pro: '✓' },
                  { feature: lang === 'zh' ? '数据导出' : 'Data Export', free: '✗', basic: '✗', premium: '✓', pro: '✓' },
                  { feature: lang === 'zh' ? '论文解读' : 'Paper Analysis', free: '✗', basic: '✗', premium: '✓', pro: '✓' },
                  { feature: lang === 'zh' ? '家庭共享' : 'Family Sharing', free: '✗', basic: '✗', premium: '✗', pro: '5人' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="p-4 text-white">{row.feature}</td>
                    <td className="text-center p-4 text-gray-400">{row.free}</td>
                    <td className="text-center p-4 text-gray-300">{row.basic}</td>
                    <td className="text-center p-4 text-purple-300 font-medium">{row.premium}</td>
                    <td className="text-center p-4 text-gray-300">{row.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            {lang === 'zh' ? '常见问题' : 'FAQ'}
          </h2>
          <div className="space-y-4">
            {[
              {
                q: lang === 'zh' ? '可以随时取消订阅吗？' : 'Can I cancel anytime?',
                a: lang === 'zh' ? '是的，您可以随时取消订阅，当前周期内的功能将继续可用直到到期。' : 'Yes, you can cancel anytime. Your features will remain available until the end of your billing period.',
              },
              {
                q: lang === 'zh' ? '支持哪些支付方式？' : 'What payment methods are supported?',
                a: lang === 'zh' ? '支持微信支付、支付宝、信用卡和银联卡。' : 'We support WeChat Pay, Alipay, credit cards, and UnionPay.',
              },
              {
                q: lang === 'zh' ? 'AI分析是如何工作的？' : 'How does AI analysis work?',
                a: lang === 'zh' ? 'AI分析基于您的测试数据和训练历史，结合最新的眼科研究，为您提供个性化的健康建议。' : 'AI analysis uses your test data and training history, combined with latest ophthalmology research, to provide personalized health recommendations.',
              },
            ].map((faq, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                <h4 className="text-lg font-medium text-white mb-2">{faq.q}</h4>
                <p className="text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16 pb-8">
          <p className="text-gray-400 mb-4">
            {lang === 'zh' ? '还有疑问？' : 'Still have questions?'}
          </p>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            {lang === 'zh' ? '联系客服' : 'Contact Support'}
          </Button>
        </div>
      </div>
    </div>
  );
}
