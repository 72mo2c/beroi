// ======================================
// Executive Dashboard - لوحة التحكم التنفيذية
// ======================================

import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { 
  FaChartLine,
  FaMoneyBillWave,
  FaBox,
  FaUsers,
  FaTruck,
  FaArrowUp,
  FaArrowDown,
  FaPercentage,
  FaEye,
  FaDownload,
  FaRefresh,
  FaCalendarAlt,
  FaChartPie,
  FaChartBar,
  FaStar,
  FaTrendingUp,
  FaWallet,
  FaFileInvoice,
  FaClipboardList,
  FaBell,
  FaFilter
} from 'react-icons/fa';

// بيانات تجريبية للتوضيح
const generateMockData = () => {
  const today = new Date();
  const data = [];
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      sales: Math.floor(Math.random() * 50000) + 10000,
      purchases: Math.floor(Math.random() * 30000) + 5000,
      customers: Math.floor(Math.random() * 20) + 1,
      products: Math.floor(Math.random() * 100) + 50
    });
  }
  
  return data;
};

const ExecutiveDashboard = () => {
  const { warehouses, products, suppliers, customers, purchaseInvoices, salesInvoices, treasuryBalance } = useData();
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [realTimeData, setRealTimeData] = useState(generateMockData());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // تحديث البيانات كل 30 ثانية
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setRealTimeData(generateMockData());
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // حساب المؤشرات الرئيسية
  const currentStats = {
    totalRevenue: salesInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0),
    totalExpenses: purchaseInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0),
    totalProducts: products.length,
    totalCustomers: customers.length,
    totalSuppliers: suppliers.length,
    treasuryBalance: treasuryBalance || 0,
    inventoryValue: products.reduce((sum, p) => sum + ((p.mainPrice || 0) * (p.mainQuantity || 0)), 0),
    lowStockItems: products.filter(p => (p.mainQuantity || 0) < 10).length
  };

  // حساب النسب والمقارنات
  const calculateGrowth = (current, previous) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // الحصول على بيانات الفترة المحددة
  const getPeriodData = (days) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));
    
    return realTimeData.filter(d => new Date(d.date) >= cutoffDate);
  };

  const periodData = getPeriodData(selectedPeriod);
  const previousPeriodData = getPeriodData(parseInt(selectedPeriod) * 2).slice(0, periodData.length);

  // حساب المتوسطات للنمو
  const currentAvgSales = periodData.reduce((sum, d) => sum + d.sales, 0) / periodData.length;
  const previousAvgSales = previousPeriodData.reduce((sum, d) => sum + d.sales, 0) / previousPeriodData.length;
  const salesGrowth = calculateGrowth(currentAvgSales, previousAvgSales);

  const currentAvgPurchases = periodData.reduce((sum, d) => sum + d.purchases, 0) / periodData.length;
  const previousAvgPurchases = previousPeriodData.reduce((sum, d) => sum + d.purchases, 0) / previousPeriodData.length;
  const purchasesGrowth = calculateGrowth(currentAvgPurchases, previousAvgPurchases);

  // بطاقات المؤشرات الرئيسية
  const kpiCards = [
    {
      title: 'إجمالي المبيعات',
      value: currentStats.totalRevenue.toLocaleString(),
      growth: salesGrowth,
      icon: <FaMoneyBillWave />,
      gradient: 'from-green-400 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
      suffix: 'ج.م',
      period: `${selectedPeriod} يوم`
    },
    {
      title: 'إجمالي المشتريات',
      value: currentStats.totalExpenses.toLocaleString(),
      growth: purchasesGrowth,
      icon: <FaTruck />,
      gradient: 'from-blue-400 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      suffix: 'ج.م',
      period: `${selectedPeriod} يوم`
    },
    {
      title: 'رصيد الخزينة',
      value: currentStats.treasuryBalance.toLocaleString(),
      growth: 0, // ثابت حالياً
      icon: <FaWallet />,
      gradient: 'from-yellow-400 to-yellow-600',
      bgGradient: 'from-yellow-50 to-yellow-100',
      suffix: 'ج.م',
      period: 'فوري'
    },
    {
      title: 'قيمة المخزون',
      value: currentStats.inventoryValue.toLocaleString(),
      growth: 0, // حساب لاحقاً
      icon: <FaBox />,
      gradient: 'from-purple-400 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      suffix: 'ج.م',
      period: 'فوري'
    },
    {
      title: 'العملاء النشطون',
      value: currentStats.totalCustomers.toString(),
      growth: 15.3, // نمو العملاء
      icon: <FaUsers />,
      gradient: 'from-indigo-400 to-indigo-600',
      bgGradient: 'from-indigo-50 to-indigo-100',
      suffix: 'عميل',
      period: 'إجمالي'
    },
    {
      title: 'المنتجات',
      value: currentStats.totalProducts.toString(),
      growth: 8.7, // نمو المنتجات
      icon: <FaBox />,
      gradient: 'from-teal-400 to-teal-600',
      bgGradient: 'from-teal-50 to-teal-100',
      suffix: 'منتج',
      period: 'إجمالي'
    }
  ];

  // مؤشر الأداء العام
  const overallPerformance = {
    score: 85,
    status: 'ممتاز',
    color: 'text-green-600'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              لوحة التحكم التنفيذية
            </h1>
            <p className="text-gray-600 mt-2 text-lg">نظرة شاملة على أداء الشركة والمؤشرات الرئيسية</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Period Selector */}
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="7">آخر 7 أيام</option>
              <option value="30">آخر 30 يوم</option>
              <option value="90">آخر 3 أشهر</option>
              <option value="365">آخر سنة</option>
            </select>

            {/* Auto Refresh Toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                autoRefresh 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaRefresh className={autoRefresh ? 'animate-spin' : ''} />
              تحديث تلقائي
            </button>

            {/* Actions */}
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
              <FaDownload />
              تصدير التقرير
            </button>
          </div>
        </div>

        {/* Overall Performance */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 rounded-xl text-white">
                <FaStar className="text-3xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">الأداء العام للشركة</h3>
                <p className="text-gray-600">تقييم شامل للمؤشرات والأداء</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className={`text-5xl font-bold ${overallPerformance.color}`}>
                {overallPerformance.score}%
              </div>
              <p className="text-gray-600 font-semibold">{overallPerformance.status}</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {kpiCards.map((kpi, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className={`bg-gradient-to-r ${kpi.gradient} p-4 text-white`}>
              <div className="flex items-center justify-between">
                <div className="text-2xl opacity-90">
                  {kpi.icon}
                </div>
                <div className="text-right">
                  <div className="text-sm opacity-90">{kpi.period}</div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">{kpi.title}</h3>
              <div className="flex items-end justify-between mb-3">
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {kpi.value}
                  </p>
                  {kpi.suffix && (
                    <p className="text-sm text-gray-500">{kpi.suffix}</p>
                  )}
                </div>
                
                {kpi.growth !== 0 && (
                  <div className={`flex items-center gap-1 ${
                    kpi.growth > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi.growth > 0 ? (
                      <FaArrowUp className="text-sm" />
                    ) : (
                      <FaArrowDown className="text-sm" />
                    )}
                    <span className="text-sm font-semibold">
                      {Math.abs(kpi.growth).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`bg-gradient-to-r ${kpi.gradient} h-2 rounded-full transition-all duration-500`}
                  style={{ 
                    width: `${Math.min(Math.abs(kpi.growth || 0) * 5, 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales & Purchases Trend */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">اتجاه المبيعات والمشتريات</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaChartLine />
              آخر {selectedPeriod} يوم
            </div>
          </div>
          
          {/* Chart Placeholder */}
          <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
            <div className="text-center text-gray-500">
              <FaChartBar className="text-4xl mx-auto mb-2 opacity-50" />
              <p>رسم بياني تفاعلي</p>
              <p className="text-sm">سيتم عرض البيانات الحية هنا</p>
            </div>
          </div>
        </div>

        {/* Revenue Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">توزيع الإيرادات</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaChartPie />
              نسبة مئوية
            </div>
          </div>
          
          {/* Chart Placeholder */}
          <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
            <div className="text-center text-gray-500">
              <FaChartPie className="text-4xl mx-auto mb-2 opacity-50" />
              <p>رسم بياني دائري</p>
              <p className="text-sm">سيتم عرض توزيع الإيرادات هنا</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Low Stock Alert */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-yellow-500 p-2 rounded-lg text-white">
              <FaBell />
            </div>
            <h3 className="text-lg font-bold text-gray-800">تنبيهات المخزون</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm text-gray-700">مخزون منخفض</span>
              <span className="font-semibold text-yellow-600">{currentStats.lowStockItems} منتج</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-sm text-gray-700">نفاد مخزون</span>
              <span className="font-semibold text-red-600">
                {products.filter(p => (p.mainQuantity || 0) === 0).length} منتج
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500 p-2 rounded-lg text-white">
              <FaTrendingUp />
            </div>
            <h3 className="text-lg font-bold text-gray-800">إحصائيات سريعة</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">الموردين</span>
              <span className="font-semibold text-gray-800">{currentStats.totalSuppliers}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">المخازن</span>
              <span className="font-semibold text-gray-800">{warehouses.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">فواتير المبيعات</span>
              <span className="font-semibold text-gray-800">{salesInvoices.length}</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-500 p-2 rounded-lg text-white">
              <FaEye />
            </div>
            <h3 className="text-lg font-bold text-gray-800">الأنشطة الحديثة</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">فاتورة مبيعات جديدة</span>
            </div>
            <div className="flex items-center gap-3 p-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">شراء جديد من المورد</span>
            </div>
            <div className="flex items-center gap-3 p-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">تحديث المخزون</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;