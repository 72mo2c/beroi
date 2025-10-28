// ======================================
// KPIs Page - مؤشرات الأداء الرئيسية
// ======================================

import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { 
  FaChartLine,
  FaPercentage,
  FaTarget,
  FaTrophy,
  FaArrowUp,
  FaArrowDown,
  FaDollarSign,
  FaUsers,
  FaBox,
  FaClock,
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle,
  FaFilter,
  FaSearch,
  FaCalendarAlt,
  FaRefreshCw,
  FaEye,
  FaDownload,
  FaBell,
  FaCog,
  FaPlay,
  FaPause
} from 'react-icons/fa';

const KPIs = () => {
  const { products, customers, suppliers, salesInvoices, purchaseInvoices, warehouses } = useData();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);

  // حساب KPIs
  const calculateKPIs = () => {
    const today = new Date();
    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();
    
    // فلاتر البيانات حسب الفترة
    const getFilteredData = (data, dateField) => {
      return data.filter(item => {
        const itemDate = new Date(item[dateField]);
        return itemDate.getMonth() === thisMonth && itemDate.getFullYear() === thisYear;
      });
    };

    const monthlySales = getFilteredData(salesInvoices, 'date');
    const monthlyPurchases = getFilteredData(purchaseInvoices, 'date');

    // حسابات أساسية
    const totalSales = salesInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
    const totalPurchases = purchaseInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
    const monthlySalesTotal = monthlySales.reduce((sum, inv) => sum + (inv.total || 0), 0);
    const monthlyPurchasesTotal = monthlyPurchases.reduce((sum, inv) => sum + (inv.total || 0), 0);
    
    const netProfit = totalSales - totalPurchases;
    const inventoryValue = products.reduce((sum, p) => sum + ((p.mainPrice || 0) * (p.mainQuantity || 0)), 0);
    
    // حساب النسب والنسب المئوية
    const profitMargin = totalSales > 0 ? (netProfit / totalSales) * 100 : 0;
    const growthRate = 15.3; // معدل نمو افتراضي
    const customerSatisfaction = 92.5; // رضا العملاء
    const inventoryTurnover = 4.2; // معدل دوران المخزون
    
    return {
      financial: [
        {
          id: 1,
          title: 'إجمالي المبيعات',
          value: totalSales.toLocaleString(),
          target: '500,000',
          achievement: 85.2,
          trend: 'up',
          change: 12.5,
          status: 'excellent',
          icon: <FaDollarSign />,
          color: 'green',
          unit: 'ج.م'
        },
        {
          id: 2,
          title: 'صافي الربح',
          value: netProfit.toLocaleString(),
          target: '100,000',
          achievement: 78.9,
          trend: 'up',
          change: 8.3,
          status: 'good',
          icon: <FaChartLine />,
          color: 'blue',
          unit: 'ج.م'
        },
        {
          id: 3,
          title: 'هامش الربح',
          value: profitMargin.toFixed(1),
          target: '25',
          achievement: 80.0,
          trend: 'down',
          change: -2.1,
          status: 'warning',
          icon: <FaPercentage />,
          color: 'yellow',
          unit: '%'
        },
        {
          id: 4,
          title: 'معدل دوران المخزون',
          value: inventoryTurnover.toFixed(1),
          target: '6.0',
          achievement: 70.0,
          trend: 'up',
          change: 5.2,
          status: 'good',
          icon: <FaBox />,
          color: 'purple',
          unit: 'مرة/سنة'
        }
      ],
      operational: [
        {
          id: 5,
          title: 'عدد العملاء النشطين',
          value: customers.length.toString(),
          target: '500',
          achievement: 85.0,
          trend: 'up',
          change: 15.8,
          status: 'excellent',
          icon: <FaUsers />,
          color: 'indigo',
          unit: 'عميل'
        },
        {
          id: 6,
          title: 'رضا العملاء',
          value: customerSatisfaction.toFixed(1),
          target: '90',
          achievement: 92.5,
          trend: 'up',
          change: 3.2,
          status: 'excellent',
          icon: <FaTrophy />,
          color: 'green',
          unit: '%'
        },
        {
          id: 7,
          title: 'عدد الموردين',
          value: suppliers.length.toString(),
          target: '100',
          achievement: 75.0,
          trend: 'up',
          change: 5.0,
          status: 'good',
          icon: <FaTarget />,
          color: 'blue',
          unit: 'مورد'
        },
        {
          id: 8,
          title: 'عدد المخازن',
          value: warehouses.length.toString(),
          target: '10',
          achievement: 80.0,
          trend: 'stable',
          change: 0,
          status: 'good',
          icon: <FaBox />,
          color: 'purple',
          unit: 'مستودع'
        }
      ],
      alerts: [
        {
          id: 9,
          title: 'مخزون منخفض',
          value: products.filter(p => (p.mainQuantity || 0) < 10).length.toString(),
          target: '5',
          achievement: 120.0,
          trend: 'up',
          change: 25.0,
          status: 'critical',
          icon: <FaExclamationTriangle />,
          color: 'red',
          unit: 'منتج',
          critical: true
        },
        {
          id: 10,
          title: 'منتجات منتهية الصلاحية',
          value: '3',
          target: '0',
          achievement: 0,
          trend: 'up',
          change: 50.0,
          status: 'critical',
          icon: <FaClock />,
          color: 'red',
          unit: 'منتج',
          critical: true
        }
      ]
    };
  };

  const kpis = calculateKPIs();

  // جميع KPIs في مصفوفة واحدة
  const allKPIs = [...kpis.financial, ...kpis.operational, ...kpis.alerts];

  // فلترة KPIs
  const filteredKPIs = selectedCategory === 'all' 
    ? allKPIs 
    : selectedCategory === 'financial' 
    ? kpis.financial
    : selectedCategory === 'operational' 
    ? kpis.operational
    : kpis.alerts;

  // تحديث تلقائي
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // هنا يمكن إضافة منطق تحديث البيانات
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // تحديد حالة المؤشر
  const getStatusConfig = (status) => {
    switch (status) {
      case 'excellent':
        return { 
          bgColor: 'bg-green-100', 
          textColor: 'text-green-800', 
          borderColor: 'border-green-200',
          icon: <FaCheckCircle className="text-green-600" />
        };
      case 'good':
        return { 
          bgColor: 'bg-blue-100', 
          textColor: 'text-blue-800', 
          borderColor: 'border-blue-200',
          icon: <FaCheckCircle className="text-blue-600" />
        };
      case 'warning':
        return { 
          bgColor: 'bg-yellow-100', 
          textColor: 'text-yellow-800', 
          borderColor: 'border-yellow-200',
          icon: <FaInfoCircle className="text-yellow-600" />
        };
      case 'critical':
        return { 
          bgColor: 'bg-red-100', 
          textColor: 'text-red-800', 
          borderColor: 'border-red-200',
          icon: <FaExclamationTriangle className="text-red-600" />
        };
      default:
        return { 
          bgColor: 'bg-gray-100', 
          textColor: 'text-gray-800', 
          borderColor: 'border-gray-200',
          icon: <FaInfoCircle className="text-gray-600" />
        };
    }
  };

  // تصنيفات KPIs
  const categories = [
    { id: 'all', name: 'جميع المؤشرات', count: allKPIs.length },
    { id: 'financial', name: 'المؤشرات المالية', count: kpis.financial.length },
    { id: 'operational', name: 'المؤشرات التشغيلية', count: kpis.operational.length },
    { id: 'alerts', name: 'التنبيهات', count: kpis.alerts.length }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              مؤشرات الأداء الرئيسية
            </h1>
            <p className="text-gray-600 mt-2 text-lg">متابعة شاملة لأداء الشركة والمؤشرات الحيوية</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Real-time Toggle */}
            <button
              onClick={() => setRealTimeUpdates(!realTimeUpdates)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                realTimeUpdates 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {realTimeUpdates ? <FaPlay /> : <FaPause />}
              {realTimeUpdates ? 'مباشر' : 'متوقف'}
            </button>

            {/* Auto Refresh */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                autoRefresh 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaRefreshCw className={autoRefresh ? 'animate-spin' : ''} />
              تحديث تلقائي
            </button>

            {/* Export */}
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
              <FaDownload />
              تصدير
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700">التصنيف:</span>
          </div>
          
          <div className="flex gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-gray-400" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            >
              <option value="daily">يومي</option>
              <option value="weekly">أسبوعي</option>
              <option value="monthly">شهري</option>
              <option value="quarterly">ربع سنوي</option>
              <option value="yearly">سنوي</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {filteredKPIs.map((kpi) => {
          const statusConfig = getStatusConfig(kpi.status);
          
          return (
            <div key={kpi.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${
                    kpi.color === 'green' ? 'from-green-400 to-green-600' :
                    kpi.color === 'blue' ? 'from-blue-400 to-blue-600' :
                    kpi.color === 'yellow' ? 'from-yellow-400 to-yellow-600' :
                    kpi.color === 'purple' ? 'from-purple-400 to-purple-600' :
                    kpi.color === 'indigo' ? 'from-indigo-400 to-indigo-600' :
                    'from-red-400 to-red-600'
                  } text-white text-xl`}>
                    {kpi.icon}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {statusConfig.icon}
                    {realTimeUpdates && (
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-2">{kpi.title}</h3>
                
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-3xl font-bold text-gray-800">
                      {kpi.value}
                      {kpi.unit && <span className="text-lg text-gray-500 mr-1">{kpi.unit}</span>}
                    </p>
                    <p className="text-sm text-gray-500">المستهدف: {kpi.target}</p>
                  </div>
                  
                  {kpi.change !== 0 && (
                    <div className={`flex items-center gap-1 ${
                      kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {kpi.trend === 'up' ? (
                        <FaArrowUp className="text-sm" />
                      ) : (
                        <FaArrowDown className="text-sm" />
                      )}
                      <span className="text-sm font-semibold">
                        {Math.abs(kpi.change).toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">نسبة الإنجاز</span>
                    <span className="text-sm font-semibold text-gray-800">{kpi.achievement.toFixed(1)}%</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        kpi.status === 'excellent' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                        kpi.status === 'good' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                        kpi.status === 'warning' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                        'bg-gradient-to-r from-red-400 to-red-600'
                      }`}
                      style={{ 
                        width: `${Math.min(kpi.achievement, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor} border`}>
                  {statusConfig.icon}
                  <span>
                    {kpi.status === 'excellent' ? 'ممتاز' :
                     kpi.status === 'good' ? 'جيد' :
                     kpi.status === 'warning' ? 'تحذير' :
                     kpi.status === 'critical' ? 'حرج' : 'متوسط'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">نظرة عامة على الأداء</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">المؤشرات الممتازة</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-semibold text-green-600">
                  {allKPIs.filter(kpi => kpi.status === 'excellent').length}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">المؤشرات الجيدة</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="font-semibold text-blue-600">
                  {allKPIs.filter(kpi => kpi.status === 'good').length}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">التحذيرات</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="font-semibold text-yellow-600">
                  {allKPIs.filter(kpi => kpi.status === 'warning').length}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">الحالات الحرجة</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="font-semibold text-red-600">
                  {allKPIs.filter(kpi => kpi.status === 'critical').length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Trends */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">اتجاهات الأداء</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-gray-700">مؤشرات في نمو</span>
              <span className="font-semibold text-green-600">
                {allKPIs.filter(kpi => kpi.trend === 'up').length}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-gray-700">مؤشرات في انخفاض</span>
              <span className="font-semibold text-red-600">
                {allKPIs.filter(kpi => kpi.trend === 'down').length}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">مؤشرات مستقرة</span>
              <span className="font-semibold text-gray-600">
                {allKPIs.filter(kpi => kpi.trend === 'stable').length}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">إجراءات سريعة</h3>
          
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
              <FaBell className="text-blue-600" />
              <span>إعداد تنبيهات جديدة</span>
            </button>
            
            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
              <FaCog className="text-gray-600" />
              <span>إعدادات المؤشرات</span>
            </button>
            
            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
              <FaEye className="text-purple-600" />
              <span>عرض تفاصيل المؤشرات</span>
            </button>
            
            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
              <FaDownload className="text-green-600" />
              <span>تصدير تقرير شامل</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPIs;