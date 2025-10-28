import React, { useState } from 'react';
import { BarChart3, Users, Target, Megaphone, FileText, Headphones, TrendingUp, Calendar, DollarSign } from 'lucide-react';

// Import CRM Components
import CRMDashboard from './CRMDashboard';
import Leads from './Leads';
import Opportunities from './Opportunities';
import MarketingCampaigns from './MarketingCampaigns';
import Contracts from './Contracts';
import CustomerService from './CustomerService';

const CRMIndex = () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');

  const components = {
    dashboard: CRMDashboard,
    leads: Leads,
    opportunities: Opportunities,
    campaigns: MarketingCampaigns,
    contracts: Contracts,
    service: CustomerService
  };

  const menuItems = [
    {
      id: 'dashboard',
      name: 'لوحة التحكم',
      icon: BarChart3,
      description: 'نظرة شاملة على أداء المبيعات وخدمة العملاء'
    },
    {
      id: 'leads',
      name: 'العملاء المحتملين',
      icon: Users,
      description: 'تتبع وإدارة العملاء المحتملين في رحلة المبيعات'
    },
    {
      id: 'opportunities',
      name: 'الفرص',
      icon: Target,
      description: 'إدارة فرص المبيعات في مسار المبيعات'
    },
    {
      id: 'campaigns',
      name: 'حملات التسويق',
      icon: Megaphone,
      description: 'إنشاء وإدارة الحملات التسويقية القابلة للقياس'
    },
    {
      id: 'contracts',
      name: 'العقود',
      icon: FileText,
      description: 'تتبع وإدارة العقود والإنجازات والمهام'
    },
    {
      id: 'service',
      name: 'خدمة العملاء',
      icon: Headphones,
      description: 'إدارة طلبات الدعم وتحليل سلوك العملاء'
    }
  ];

  const ActiveComponent = components[activeComponent];

  return (
    <div className="min-h-screen bg-gray-50">
      {activeComponent === 'dashboard' ? (
        <ActiveComponent />
      ) : (
        <div className="flex">
          {/* Sidebar */}
          <div className="w-80 bg-white shadow-lg border-l border-gray-200 min-h-screen">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">إدارة علاقات العملاء</h2>
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = activeComponent === item.id;
                  const isDashboard = item.id === 'dashboard';
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveComponent(item.id)}
                      className={`w-full text-right p-4 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <IconComponent className={`h-5 w-5 mt-1 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                        <div className="flex-1 text-right">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quick Stats in Sidebar */}
            <div className="p-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">إحصائيات سريعة</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700">معدل التحويل</span>
                  </div>
                  <span className="text-sm font-bold text-green-600">23.5%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-700">إجمالي المبيعات</span>
                  </div>
                  <span className="text-sm font-bold text-blue-600">2.4M</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-purple-700">العملاء الجدد</span>
                  </div>
                  <span className="text-sm font-bold text-purple-600">+127</span>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="p-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">النشاطات الأخيرة</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">تم إغلاق صفقة جديدة</p>
                    <p className="text-xs text-gray-500">منذ 5 دقائق</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">عميل محتمل جديد</p>
                    <p className="text-xs text-gray-500">منذ 15 دقيقة</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">تم توقيع عقد جديد</p>
                    <p className="text-xs text-gray-500">منذ 30 دقيقة</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <ActiveComponent />
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMIndex;