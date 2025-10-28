// ======================================
// وحدة التخطيط والميزانية - Budgeting & Planning Module
// ======================================

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import PlanningDashboard from './PlanningDashboard';
import Budgets from './Budgets';
import Forecasts from './Forecasts';
import ProductionPlans from './ProductionPlans';
import PurchasePlans from './PurchasePlans';
import Reports from './Reports';
import { 
  FaWallet, 
  FaChartLine, 
  FaCogs, 
  FaShoppingCart,
  FaPieChart,
  FaArrowLeft,
  FaArrowRight,
  FaTasks,
  FaClipboardList,
  FaFileAlt,
  FaChartBar,
  FaTrendingUp,
  FaCalculator,
  FaCalendarAlt,
  FaEye,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaDownload,
  FaUpload
} from 'react-icons/fa';

const BudgetingIndex = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // التحقق من المسار الحالي لعرض المحتوى المناسب
  const currentPath = location.pathname;
  
  // إذا كان المسار هو وحدة التخطيط والميزانية الأساسية
  if (currentPath === '/budgeting' || currentPath === '/budgeting/') {
    return <PlanningDashboard />;
  }

  // توجيه إلى الصفحات الفرعية
  if (currentPath.includes('/budgeting/budgets')) {
    return <Budgets />;
  }
  
  if (currentPath.includes('/budgeting/forecasts')) {
    return <Forecasts />;
  }
  
  if (currentPath.includes('/budgeting/production-plans')) {
    return <ProductionPlans />;
  }
  
  if (currentPath.includes('/budgeting/purchase-plans')) {
    return <PurchasePlans />;
  }
  
  if (currentPath.includes('/budgeting/reports')) {
    return <Reports />;
  }

  // إذا لم يتم العثور على مسار، عرض قائمة الوحدات
  return <BudgetingMainMenu navigate={navigate} />;
};

// مكون القائمة الرئيسية لوحدة التخطيط والميزانية
const BudgetingMainMenu = ({ navigate }) => {
  const budgetingModules = [
    {
      id: 'dashboard',
      title: 'لوحة التحكم',
      description: 'نظرة شاملة على أداء التخطيط والميزانية',
      icon: FaChartBar,
      path: '/budgeting',
      color: 'from-blue-500 to-blue-600',
      features: ['مؤشرات الأداء الرئيسية', 'متابعة الميزانية', 'التنبيهات', 'الأنشطة الأخيرة']
    },
    {
      id: 'budgets',
      title: 'إدارة الميزانيات',
      description: 'إدارة ومتابعة ميزانيات الأقسام المختلفة',
      icon: FaWallet,
      path: '/budgeting/budgets',
      color: 'from-green-500 to-green-600',
      features: ['إنشاء الميزانيات', 'مراحل الاعتماد', 'تتبع الإنفاق', 'تقارير الميزانية']
    },
    {
      id: 'forecasts',
      title: 'التنبؤات المالية',
      description: 'تحليل وتنبؤ بالاتجاهات المالية والتشغيلية',
      icon: FaChartLine,
      path: '/budgeting/forecasts',
      color: 'from-purple-500 to-purple-600',
      features: ['توقعات الإيرادات', 'تنبؤ المصروفات', 'التنبؤات التشغيلية', 'تحليل الاتجاهات']
    },
    {
      id: 'production-plans',
      title: 'خطط الإنتاج',
      description: 'تخطيط وإدارة خطط الإنتاج والتصنيع',
      icon: FaCogs,
      path: '/budgeting/production-plans',
      color: 'from-orange-500 to-orange-600',
      features: ['تخطيط الإنتاج', 'إدارة القدرات', 'متابعة التقدم', 'تحليل الكفاءة']
    },
    {
      id: 'purchase-plans',
      title: 'خطط المشتريات',
      description: 'تخطيط وإدارة مشتريات المؤسسة',
      icon: FaShoppingCart,
      path: '/budgeting/purchase-plans',
      color: 'from-indigo-500 to-indigo-600',
      features: ['تخطيط المشتريات', 'إدارة الموردين', 'تحليل التكلفة', 'تتبع الأداء']
    },
    {
      id: 'reports',
      title: 'التقارير والتحليلات',
      description: 'تقارير تفاعلية ورسوم بيانية شاملة',
      icon: FaPieChart,
      path: '/budgeting/reports',
      color: 'from-pink-500 to-pink-600',
      features: ['تقارير الميزانية', 'تحليل الأداء', 'رسوم بيانية', 'تصدير البيانات']
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* العنوان الرئيسي */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
            <FaCalculator className="text-white text-3xl" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">وحدة التخطيط والميزانية</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          نظام متكامل لإدارة التخطيط والميزانية يشمل التنبؤات، تخطيط الإنتاج، خطط المشتريات، والتقارير التحليلية
        </p>
      </div>

      {/* بطاقات الوحدات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {budgetingModules.map((module) => {
          const IconComponent = module.icon;
          
          return (
            <Card 
              key={module.id} 
              className="group hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              onClick={() => navigate(module.path)}
            >
              <div className={`h-2 bg-gradient-to-r ${module.color} rounded-t-xl -m-6 mb-6`}></div>
              
              <div className="text-center mb-6">
                <div className={`inline-flex p-4 bg-gradient-to-r ${module.color} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="text-white text-3xl" />
                </div>
              </div>

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{module.title}</h3>
                <p className="text-gray-600 leading-relaxed">{module.description}</p>
              </div>

              <div className="space-y-2 mb-6">
                {module.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                variant="primary" 
                className="w-full group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-red-500 transition-all duration-300"
                icon={FaArrowRight}
              >
                دخول الوحدة
              </Button>
            </Card>
          );
        })}
      </div>

      {/* قسم المزايا الرئيسية */}
      <div className="bg-gradient-to-r from-gray-50 to-orange-50 rounded-2xl p-8 mb-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">مزايا وحدة التخطيط والميزانية</h2>
          <p className="text-gray-600">توفر حلول متكاملة لإدارة التخطيط والميزانية</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-3">
              <FaWallet className="text-blue-600 text-2xl" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">إدارة الميزانية</h3>
            <p className="text-sm text-gray-600">تخطيط وتتبع الميزانيات بكفاءة عالية</p>
          </div>

          <div className="text-center">
            <div className="p-3 bg-green-100 rounded-lg w-fit mx-auto mb-3">
              <FaChartLine className="text-green-600 text-2xl" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">التنبؤات الذكية</h3>
            <p className="text-sm text-gray-600">تحليل البيانات واتخاذ قرارات مدروسة</p>
          </div>

          <div className="text-center">
            <div className="p-3 bg-purple-100 rounded-lg w-fit mx-auto mb-3">
              <FaCogs className="text-purple-600 text-2xl" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">تخطيط العمليات</h3>
            <p className="text-sm text-gray-600">تنسيق خطط الإنتاج والمشتريات</p>
          </div>

          <div className="text-center">
            <div className="p-3 bg-orange-100 rounded-lg w-fit mx-auto mb-3">
              <FaPieChart className="text-orange-600 text-2xl" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">تقارير تحليلية</h3>
            <p className="text-sm text-gray-600">رؤى عميقة وبيانات قابلة للتنفيذ</p>
          </div>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">45</div>
          <div className="text-sm text-gray-600">إجمالي الميزانيات</div>
        </Card>

        <Card className="text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">28</div>
          <div className="text-sm text-gray-600">خطط نشطة</div>
        </Card>

        <Card className="text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">89.5%</div>
          <div className="text-sm text-gray-600">دقة التنبؤات</div>
        </Card>

        <Card className="text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">12.5M</div>
          <div className="text-sm text-gray-600">ريال الميزانية</div>
        </Card>
      </div>
    </div>
  );
};

export default BudgetingIndex;