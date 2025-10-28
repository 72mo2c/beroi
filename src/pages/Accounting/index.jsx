// ======================================
// Accounting Module - وحدة المحاسبة
// ======================================

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import { 
  FaSitemap, 
  FaClipboardList, 
  FaBook, 
  FaBalanceScale, 
  FaChartLine, 
  FaUniversity, 
  FaMoneyBillWave,
  FaArrowLeft,
  FaArrowRight,
  FaCalculator,
  FaTrendingUp,
  FaFileAlt,
  FaPrint,
  FaDownload
} from 'react-icons/fa';

const AccountingIndex = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const accountingModules = [
    {
      id: 'chart-of-accounts',
      title: 'دليل الحسابات',
      description: 'إدارة وتنظيم حسابات الشركة بشكل هرمي',
      icon: FaSitemap,
      path: '/accounting/chart-of-accounts',
      color: 'from-blue-500 to-blue-600',
      features: ['إضافة وتعديل الحسابات', 'الهيكل الهرمي', 'فلترة وبحث متقدم', 'تصدير البيانات']
    },
    {
      id: 'journal-entries',
      title: 'الدفتر اليومية',
      description: 'تسجيل ومراقبة القيود المحاسبية',
      icon: FaClipboardList,
      path: '/accounting/journal-entries',
      color: 'from-green-500 to-green-600',
      features: ['إنشاء قيود محاسبية', 'تتبع حالات القيود', 'فحص التوازن التلقائي', 'تقارير مفصلة']
    },
    {
      id: 'ledger',
      title: 'دفتر الأستاذ',
      description: 'عرض تفصيلي لحركات وأرصدة الحسابات',
      icon: FaBook,
      path: '/accounting/ledger',
      color: 'from-purple-500 to-purple-600',
      features: ['حركات تفصيلية للحسابات', 'الرصيد التراكمي', 'فلترة حسب الفترة', 'مقارنات زمنية']
    },
    {
      id: 'balance-sheet',
      title: 'الميزانية العمومية',
      description: 'الوضع المالي للشركة في تاريخ معين',
      icon: FaBalanceScale,
      path: '/accounting/balance-sheet',
      color: 'from-orange-500 to-orange-600',
      features: ['الأصول والخصوم وحقوق الملكية', 'النسب المالية', 'مقارنات زمنية', 'طباعة وتصدير']
    },
    {
      id: 'income-statement',
      title: 'قائمة الدخل',
      description: 'الأرباح والخسائر لفترة زمنية محددة',
      icon: FaChartLine,
      path: '/accounting/income-statement',
      color: 'from-indigo-500 to-indigo-600',
      features: ['الإيرادات والمصروفات', 'هامش الربح', 'النسب المالية', 'تحليل الاتجاهات']
    },
    {
      id: 'bank-accounts',
      title: 'الحسابات البنكية',
      description: 'إدارة ومراقبة الحسابات البنكية',
      icon: FaUniversity,
      path: '/accounting/bank-accounts',
      color: 'from-teal-500 to-teal-600',
      features: ['إدارة الحسابات البنكية', 'تتبع المعاملات', 'أرصدة متعددة البنوك', 'تنبيهات للحد الأدنى']
    },
    {
      id: 'payments',
      title: 'المدفوعات والمقبوضات',
      description: 'إدارة جميع المدفوعات والمقبوضات',
      icon: FaMoneyBillWave,
      path: '/accounting/payments',
      color: 'from-cyan-500 to-cyan-600',
      features: ['تتبع المدفوعات والمقبوضات', 'طرق دفع متعددة', 'حالات المعاملات', 'التدفق النقدي']
    }
  ];

  const quickStats = [
    {
      label: 'إجمالي الحسابات',
      value: '25',
      icon: FaSitemap,
      color: 'text-blue-600'
    },
    {
      label: 'القيود المعلقة',
      value: '12',
      icon: FaClipboardList,
      color: 'text-yellow-600'
    },
    {
      label: 'صافي الربح',
      value: '125,000',
      icon: FaTrendingUp,
      color: 'text-green-600'
    },
    {
      label: 'التدفق النقدي',
      value: '85,000',
      icon: FaMoneyBillWave,
      color: 'text-purple-600'
    }
  ];

  const handleModuleClick = (module) => {
    navigate(module.path);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3 mb-4">
          <FaCalculator className="text-blue-600" />
          وحدة المحاسبة
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          نظام محاسبي متكامل يوفر جميع الأدوات اللازمة لإدارة الحسابات والقيود والتقارير المالية
        </p>
      </div>

      {/* Quick Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <stat.icon className={`text-3xl ${stat.color}`} />
            </div>
          </Card>
        ))}
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accountingModules.map((module) => (
          <Card 
            key={module.id} 
            className="hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            onClick={() => handleModuleClick(module)}
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${module.color} flex items-center justify-center`}>
                  <module.icon className="text-white text-xl" />
                </div>
                <FaArrowLeft className="text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>

              {/* Content */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{module.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{module.description}</p>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700">المميزات الرئيسية:</h4>
                <div className="grid grid-cols-1 gap-1">
                  {module.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-gray-100">
                <Button 
                  className="w-full group-hover:bg-blue-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleModuleClick(module);
                  }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <FaFileAlt />
                    فتح الوحدة
                    <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <FaCalculator className="text-blue-600 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-900">إجراءات سريعة</h3>
              <p className="text-blue-700">ابدأ بالمهام الأكثر استخداماً</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
              onClick={() => navigate('/accounting/journal-entries')}
            >
              <FaClipboardList className="ml-2" />
              قيد جديد
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate('/accounting/payments')}
            >
              <FaMoneyBillWave className="ml-2" />
              دفعة جديدة
            </Button>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FaFileAlt className="text-blue-600" />
            آخر الأنشطة
          </h3>
          <Button variant="outline" size="sm">
            عرض الكل
          </Button>
        </div>

        <div className="space-y-4">
          {[
            { type: 'journal', title: 'قيد محاسبي جديد', time: 'منذ ساعتين', icon: FaClipboardList, color: 'text-green-600' },
            { type: 'payment', title: 'دفعة للموردين', time: 'منذ 4 ساعات', icon: FaMoneyBillWave, color: 'text-blue-600' },
            { type: 'bank', title: 'إيداع في البنك الأهلي', time: 'أمس', icon: FaUniversity, color: 'text-purple-600' },
            { type: 'report', title: 'تحديث الميزانية العمومية', time: 'منذ يومين', icon: FaBalanceScale, color: 'text-orange-600' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <activity.icon className={`text-lg ${activity.color}`} />
                <div>
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                عرض
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-50 border border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <div>
              <p className="font-semibold text-green-800">النظام يعمل بشكل طبيعي</p>
              <p className="text-sm text-green-600">جميع الوحدات متاحة</p>
            </div>
          </div>
        </Card>

        <Card className="bg-blue-50 border border-blue-200">
          <div className="flex items-center gap-3">
            <FaTrendingUp className="text-blue-600" />
            <div>
              <p className="font-semibold text-blue-800">آخر نسخة احتياطية</p>
              <p className="text-sm text-blue-600">اليوم 03:00 صباحاً</p>
            </div>
          </div>
        </Card>

        <Card className="bg-purple-50 border border-purple-200">
          <div className="flex items-center gap-3">
            <FaCalculator className="text-purple-600" />
            <div>
              <p className="font-semibold text-purple-800">التحديثات المتاحة</p>
              <p className="text-sm text-purple-600">2 تحديث متاح</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AccountingIndex;