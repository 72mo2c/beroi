import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Target, DollarSign, Phone, Mail, Calendar, BarChart3, PieChart, Activity } from 'lucide-react';

const CRMDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalLeads: 1247,
    totalOpportunities: 89,
    totalRevenue: 2456789,
    conversionRate: 23.5,
    activeCampaigns: 12,
    customerSatisfaction: 94.2
  });

  const [recentActivities] = useState([
    { id: 1, type: 'lead', message: 'عميل محتمل جديد: أحمد محمد', time: 'منذ 5 دقائق', icon: Users, color: 'text-blue-600' },
    { id: 2, type: 'opportunity', message: 'فرصة جديدة: مشروع بقيمة 150,000 ريال', time: 'منذ 15 دقيقة', icon: Target, color: 'text-green-600' },
    { id: 3, type: 'contract', message: 'تم توقيع عقد جديد مع شركة النجاح', time: 'منذ 30 دقيقة', icon: DollarSign, color: 'text-purple-600' },
    { id: 4, type: 'call', message: 'اتصال ناجح مع العميل سارة أحمد', time: 'منذ ساعة', icon: Phone, color: 'text-orange-600' },
  ]);

  const [performanceData] = useState([
    { month: 'يناير', leads: 85, conversions: 20, revenue: 180000 },
    { month: 'فبراير', leads: 92, conversions: 24, revenue: 220000 },
    { month: 'مارس', leads: 78, conversions: 18, revenue: 165000 },
    { month: 'أبريل', leads: 105, conversions: 28, revenue: 285000 },
    { month: 'مايو', leads: 118, conversions: 32, revenue: 320000 },
    { month: 'يونيو', leads: 95, conversions: 25, revenue: 245000 },
  ]);

  const getPerformanceChart = () => {
    const maxLeads = Math.max(...performanceData.map(d => d.leads));
    const maxConversions = Math.max(...performanceData.map(d => d.conversions));
    
    return performanceData.map((data, index) => ({
      ...data,
      leadWidth: (data.leads / maxLeads) * 100,
      conversionWidth: (data.conversions / maxConversions) * 100
    }));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">لوحة تحكم إدارة علاقات العملاء</h1>
        <p className="text-gray-600">نظرة شاملة على أداء المبيعات وخدمة العملاء</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي العملاء المحتملين</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.totalLeads.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 ml-1" />
            <span className="text-sm text-green-600">+12% من الشهر الماضي</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">الفرص النشطة</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.totalOpportunities}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Target className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 ml-1" />
            <span className="text-sm text-green-600">+8% من الشهر الماضي</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي الإيرادات</p>
              <p className="text-2xl font-bold text-gray-900">{(dashboardData.totalRevenue / 1000000).toFixed(1)}M</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 ml-1" />
            <span className="text-sm text-green-600">+15% من الشهر الماضي</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">معدل التحويل</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.conversionRate}%</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 ml-1" />
            <span className="text-sm text-green-600">+3.2% من الشهر الماضي</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">الحملات النشطة</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.activeCampaigns}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <Activity className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <Activity className="h-4 w-4 text-blue-500 ml-1" />
            <span className="text-sm text-blue-600">جميعها تعمل بكفاءة</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">رضا العملاء</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.customerSatisfaction}%</p>
            </div>
            <div className="p-3 bg-pink-100 rounded-full">
              <PieChart className="h-6 w-6 text-pink-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 ml-1" />
            <span className="text-sm text-green-600">+2.1% من الشهر الماضي</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Performance Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">أداء المبيعات الشهري</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {getPerformanceChart().map((data, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{data.month}</span>
                  <div className="flex space-x-4 text-sm">
                    <span className="text-blue-600">العملاء: {data.leads}</span>
                    <span className="text-green-600">التحويلات: {data.conversions}</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="flex space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${data.leadWidth}%` }}
                      ></div>
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${data.conversionWidth}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">النشاطات الأخيرة</h3>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const IconComponent = activity.icon;
              return (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`p-2 rounded-full bg-gray-100 ${activity.color}`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{activity.message}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">الإجراءات السريعة</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-gray-700">إضافة عميل محتمل</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Target className="h-5 w-5 text-green-600" />
            <span className="font-medium text-gray-700">إنشاء فرصة</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <DollarSign className="h-5 w-5 text-purple-600" />
            <span className="font-medium text-gray-700">إنشاء عقد</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar className="h-5 w-5 text-orange-600" />
            <span className="font-medium text-gray-700">جدولة اجتماع</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CRMDashboard;