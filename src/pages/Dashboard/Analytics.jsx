// ======================================
// Analytics Page - التحليلات المتقدمة
// ======================================

import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { 
  FaChartLine,
  FaChartBar,
  FaChartPie,
  FaAnalytics,
  FaDatabase,
  FaBrain,
  FaCog,
  FaDownload,
  FaFilter,
  FaSearch,
  FaCalendarAlt,
  FaRefreshCw,
  FaEye,
  FaLightbulb,
  FaTrendUp,
  FaTrendDown,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaDotCircle,
  FaGlobe,
  FaMobile,
  FaDesktop,
  FaTablet
} from 'react-icons/fa';

const Analytics = () => {
  const { products, customers, suppliers, salesInvoices, purchaseInvoices } = useData();
  const [selectedAnalysis, setSelectedAnalysis] = useState('overview');
  const [timeRange, setTimeRange] = useState('30');
  const [autoRefresh, setAutoRefresh] = useState(false);

  // بيانات التحليلات المتقدمة
  const generateAdvancedAnalytics = () => {
    const today = new Date();
    
    // تحليل المبيعات
    const salesData = salesInvoices.map(invoice => ({
      ...invoice,
      profitMargin: invoice.total > 0 ? ((invoice.total - (invoice.total * 0.7)) / invoice.total) * 100 : 0,
      customerSegment: customers.find(c => c.id === invoice.customerId)?.segment || 'عام',
      seasonality: getSeasonality(new Date(invoice.date)),
      growth: Math.random() * 20 - 10 // نمو عشوائي
    }));

    // تحليل العملاء
    const customerAnalytics = {
      totalCustomers: customers.length,
      activeCustomers: Math.floor(customers.length * 0.75),
      newCustomers: Math.floor(customers.length * 0.15),
      customerRetention: 85.5,
      customerLifetimeValue: 15000,
      customerSegments: {
        premium: Math.floor(customers.length * 0.2),
        regular: Math.floor(customers.length * 0.6),
        basic: Math.floor(customers.length * 0.2)
      },
      geographicDistribution: {
        cairo: 45,
        alexandria: 25,
        giza: 15,
        other: 15
      }
    };

    // تحليل المنتجات
    const productAnalytics = {
      totalProducts: products.length,
      topSelling: products.slice(0, 5).map(p => ({
        name: p.name,
        sales: Math.floor(Math.random() * 1000) + 500,
        growth: Math.random() * 30 - 10,
        profitMargin: Math.random() * 40 + 10
      })),
      slowMoving: products.filter(p => (p.mainQuantity || 0) < 5).length,
      fastMoving: products.filter(p => (p.mainQuantity || 0) > 50).length,
      categoryPerformance: [
        { category: 'إلكترونيات', sales: 150000, growth: 12.5 },
        { category: 'ملابس', sales: 80000, growth: -3.2 },
        { category: 'طعام', sales: 120000, growth: 8.7 },
        { category: 'أثاث', sales: 60000, growth: 15.3 }
      ]
    };

    // تحليل السوق والاتجاهات
    const marketInsights = {
      marketShare: 15.3,
      competitorAnalysis: {
        competitorA: 25.5,
        competitorB: 18.7,
        competitorC: 12.1,
        others: 28.4
      },
      seasonalTrends: [
        { month: 'يناير', sales: 85000, growth: 5.2 },
        { month: 'فبراير', sales: 92000, growth: 8.1 },
        { month: 'مارس', sales: 110000, growth: 19.6 },
        { month: 'أبريل', sales: 105000, growth: -4.5 },
        { month: 'مايو', sales: 125000, growth: 19.0 },
        { month: 'يونيو', sales: 135000, growth: 8.0 }
      ],
      predictiveInsights: {
        nextMonthSales: 145000,
        confidenceLevel: 87.5,
        riskFactors: ['موسمية', 'منافسة', 'اقتصاد'],
        opportunities: ['توسع رقمي', 'شراكات جديدة', 'تحسين المنتجات']
      }
    };

    // تحليل الأداء التشغيلي
    const operationalMetrics = {
      efficiency: 82.5,
      automationLevel: 65.0,
      costReduction: 12.3,
      processOptimization: 78.9,
      resourceUtilization: {
        warehouse: 75.0,
        staff: 88.0,
        technology: 70.0
      },
      qualityMetrics: {
        defectRate: 0.8,
        customerSatisfaction: 4.2,
        onTimeDelivery: 94.5,
        returnRate: 2.1
      }
    };

    return {
      sales: salesData,
      customers: customerAnalytics,
      products: productAnalytics,
      market: marketInsights,
      operations: operationalMetrics
    };
  };

  const analytics = generateAdvancedAnalytics();

  // الحصول على موسمية التاريخ
  const getSeasonality = (date) => {
    const month = date.getMonth() + 1;
    if ([12, 1, 2].includes(month)) return 'شتاء';
    if ([3, 4, 5].includes(month)) return 'ربيع';
    if ([6, 7, 8].includes(month)) return 'صيف';
    return 'خريف';
  };

  // أنواع التحليلات
  const analysisTypes = [
    { id: 'overview', name: 'نظرة عامة', icon: <FaAnalytics /> },
    { id: 'sales', name: 'تحليل المبيعات', icon: <FaChartLine /> },
    { id: 'customers', name: 'تحليل العملاء', icon: <FaDotCircle /> },
    { id: 'products', name: 'تحليل المنتجات', icon: <FaDatabase /> },
    { id: 'market', name: 'تحليل السوق', icon: <FaGlobe /> },
    { id: 'operations', name: 'الأداء التشغيلي', icon: <FaCog /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              التحليلات المتقدمة
            </h1>
            <p className="text-gray-600 mt-2 text-lg">تحليل عميق ومتقدم للبيانات والأنماط والاتجاهات</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Time Range */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="7">آخر 7 أيام</option>
              <option value="30">آخر 30 يوم</option>
              <option value="90">آخر 3 أشهر</option>
              <option value="365">آخر سنة</option>
            </select>

            {/* Auto Refresh */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                autoRefresh 
                  ? 'bg-purple-500 text-white hover:bg-purple-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaRefreshCw className={autoRefresh ? 'animate-spin' : ''} />
              تحديث تلقائي
            </button>

            {/* Export */}
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2">
              <FaDownload />
              تصدير التحليل
            </button>
          </div>
        </div>

        {/* Analysis Type Selector */}
        <div className="flex flex-wrap gap-3 mb-6">
          {analysisTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedAnalysis(type.id)}
              className={`px-6 py-3 rounded-xl flex items-center gap-3 font-medium transition-all ${
                selectedAnalysis === type.id
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
              }`}
            >
              {type.icon}
              {type.name}
            </button>
          ))}
        </div>
      </div>

      {/* Analysis Content */}
      {selectedAnalysis === 'overview' && (
        <div className="space-y-8">
          {/* KPI Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-500 p-3 rounded-xl text-white">
                  <FaChartLine className="text-2xl" />
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">إجمالي المبيعات</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {salesInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-green-600">+12.5%</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-500 p-3 rounded-xl text-white">
                  <FaDotCircle className="text-2xl" />
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">العملاء النشطون</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {Math.floor(customers.length * 0.75)}
                  </div>
                  <div className="text-sm text-green-600">+8.3%</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-500 p-3 rounded-xl text-white">
                  <FaDatabase className="text-2xl" />
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">المنتجات</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {products.length}
                  </div>
                  <div className="text-sm text-blue-600">+5.2%</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-yellow-500 p-3 rounded-xl text-white">
                  <FaCog className="text-2xl" />
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">كفاءة العمليات</div>
                  <div className="text-2xl font-bold text-gray-800">82.5%</div>
                  <div className="text-sm text-green-600">+3.1%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Trend Analysis */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">تحليل اتجاه المبيعات</h3>
              <div className="h-80 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <FaChartLine className="text-5xl mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-semibold">رسم بياني تفاعلي</p>
                  <p className="text-sm">تحليل الاتجاهات والأنماط</p>
                </div>
              </div>
            </div>

            {/* Customer Segmentation */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">تقسيم العملاء</h3>
              <div className="h-80 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <FaChartPie className="text-5xl mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-semibold">رسم بياني دائري</p>
                  <p className="text-sm">تقسيم العملاء حسب الفئات</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-lg p-8 text-white">
            <div className="flex items-center gap-4 mb-6">
              <FaBrain className="text-3xl" />
              <h3 className="text-2xl font-bold">تحليلات ذكية مدعومة بالذكاء الاصطناعي</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white bg-opacity-20 rounded-xl p-4">
                <FaLightbulb className="text-2xl mb-2" />
                <h4 className="font-semibold mb-2">رؤى السوق</h4>
                <p className="text-sm opacity-90">
                  تحليل السوق يشير إلى نمو محتمل بنسبة 15% في قطاع الإلكترونيات
                </p>
              </div>
              
              <div className="bg-white bg-opacity-20 rounded-xl p-4">
                <FaTrendUp className="text-2xl mb-2" />
                <h4 className="font-semibold mb-2">فرص النمو</h4>
                <p className="text-sm opacity-90">
                  توسيع الخط التجاري الرقمي قد يحقق عائد 25% إضافية
                </p>
              </div>
              
              <div className="bg-white bg-opacity-20 rounded-xl p-4">
                <FaEye className="text-2xl mb-2" />
                <h4 className="font-semibold mb-2">توقعات</h4>
                <p className="text-sm opacity-90">
                  النمو المتوقع للشهر القادم: 145,000 ج.م بدقة 87.5%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedAnalysis === 'sales' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">تحليل المبيعات المتقدم</h3>
            
            {/* Sales Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">متوسط قيمة الطلب</span>
                  <FaChartLine className="text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-gray-800">2,450 ج.م</div>
                <div className="text-sm text-green-600">+8.2%</div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">معدل التحويل</span>
                  <FaArrowUp className="text-green-500" />
                </div>
                <div className="text-2xl font-bold text-gray-800">24.5%</div>
                <div className="text-sm text-green-600">+2.1%</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">هامش الربح</span>
                  <FaMinus className="text-purple-500" />
                </div>
                <div className="text-2xl font-bold text-gray-800">28.3%</div>
                <div className="text-sm text-red-600">-1.5%</div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">القيمة الحياتية</span>
                  <FaTrendUp className="text-yellow-500" />
                </div>
                <div className="text-2xl font-bold text-gray-800">15,000 ج.م</div>
                <div className="text-sm text-green-600">+12.7%</div>
              </div>
            </div>

            {/* Sales Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <FaChartBar className="text-4xl mx-auto mb-2 opacity-50" />
                  <p>تحليل المبيعات الشهرية</p>
                </div>
              </div>
              
              <div className="h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <FaChartLine className="text-4xl mx-auto mb-2 opacity-50" />
                  <p>اتجاهات النمو</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedAnalysis === 'customers' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">تحليل العملاء المتقدم</h3>
            
            {/* Customer Analytics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-4">التوزيع الجغرافي</h4>
                <div className="space-y-3">
                  {Object.entries(analytics.customers.geographicDistribution).map(([city, percentage]) => (
                    <div key={city} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{city}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-500 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold">{percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-4">شرائح العملاء</h4>
                <div className="space-y-3">
                  {Object.entries(analytics.customers.customerSegments).map(([segment, count]) => (
                    <div key={segment} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">{segment}</span>
                      <span className="font-semibold text-green-600">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-4">مقاييس العملاء</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">معدل الاحتفاظ</span>
                    <span className="font-semibold text-purple-600">{analytics.customers.customerRetention}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">قيمة العمر</span>
                    <span className="font-semibold text-purple-600">{analytics.customers.customerLifetimeValue.toLocaleString()} ج.م</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Behavior Analysis */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-800 mb-4">تحليل سلوك العملاء</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-64 bg-white rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <FaChartPie className="text-4xl mx-auto mb-2 opacity-50" />
                    <p>خرائط سلوك العملاء</p>
                  </div>
                </div>
                
                <div className="h-64 bg-white rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <FaTrendUp className="text-4xl mx-auto mb-2 opacity-50" />
                    <p>تحليل دورة حياة العميل</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedAnalysis === 'products' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">تحليل المنتجات المتقدم</h3>
            
            {/* Product Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="font-semibold text-gray-800 mb-4">أفضل المنتجات مبيعاً</h4>
                <div className="space-y-3">
                  {analytics.products.topSelling.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{product.name}</p>
                        <p className="text-sm text-gray-600">هامش الربح: {product.profitMargin.toFixed(1)}%</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">{product.sales} وحدة</p>
                        <p className={`text-sm ${product.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {product.growth > 0 ? '+' : ''}{product.growth.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-4">أداء الفئات</h4>
                <div className="space-y-3">
                  {analytics.products.categoryPerformance.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-800">{category.category}</span>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">{category.sales.toLocaleString()} ج.م</p>
                        <p className={`text-sm ${category.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {category.growth > 0 ? '+' : ''}{category.growth.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <FaChartBar className="text-4xl mx-auto mb-2 opacity-50" />
                  <p>تحليل دوران المخزون</p>
                </div>
              </div>
              
              <div className="h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <FaChartLine className="text-4xl mx-auto mb-2 opacity-50" />
                  <p>توقعات الطلب</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedAnalysis === 'market' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">تحليل السوق والمنافسة</h3>
            
            {/* Market Share */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="font-semibold text-gray-800 mb-4">حصة السوق</h4>
                <div className="space-y-4">
                  {Object.entries(analytics.market.competitorAnalysis).map(([competitor, share]) => (
                    <div key={competitor} className="flex items-center justify-between">
                      <span className="text-gray-700 capitalize">
                        {competitor === 'others' ? 'أخرى' : competitor}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full" 
                            style={{ width: `${share}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold text-gray-800 w-12">{share}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-4">الاتجاهات الموسمية</h4>
                <div className="space-y-3">
                  {analytics.market.seasonalTrends.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-gray-700">{trend.month}</span>
                      <div className="text-right">
                        <span className="font-semibold text-gray-800">{trend.sales.toLocaleString()} ج.م</span>
                        <span className={`text-sm ml-2 ${trend.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ({trend.growth > 0 ? '+' : ''}{trend.growth.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Predictive Insights */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-800 mb-4">التوقعات والتنبؤات</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {analytics.market.predictiveInsights.nextMonthSales.toLocaleString()}
                  </div>
                  <p className="text-gray-600">المبيعات المتوقعة للشهر القادم</p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {analytics.market.predictiveInsights.confidenceLevel}%
                  </div>
                  <p className="text-gray-600">مستوى الثقة في التوقعات</p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {analytics.market.riskFactors.length}
                  </div>
                  <p className="text-gray-600">عوامل المخاطر المحددة</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedAnalysis === 'operations' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">تحليل الأداء التشغيلي</h3>
            
            {/* Operational Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl text-center">
                <FaCog className="text-3xl mx-auto mb-3 text-blue-600" />
                <div className="text-2xl font-bold text-gray-800 mb-1">{analytics.operations.efficiency}%</div>
                <p className="text-gray-600 text-sm">كفاءة العمليات</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl text-center">
                <FaDatabase className="text-3xl mx-auto mb-3 text-green-600" />
                <div className="text-2xl font-bold text-gray-800 mb-1">{analytics.operations.automationLevel}%</div>
                <p className="text-gray-600 text-sm">مستوى الأتمتة</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl text-center">
                <FaTrendDown className="text-3xl mx-auto mb-3 text-purple-600" />
                <div className="text-2xl font-bold text-gray-800 mb-1">{analytics.operations.costReduction}%</div>
                <p className="text-gray-600 text-sm">تقليل التكاليف</p>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl text-center">
                <FaLightbulb className="text-3xl mx-auto mb-3 text-yellow-600" />
                <div className="text-2xl font-bold text-gray-800 mb-1">{analytics.operations.processOptimization}%</div>
                <p className="text-gray-600 text-sm">تحسين العمليات</p>
              </div>
            </div>

            {/* Resource Utilization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="font-semibold text-gray-800 mb-4">استخدام الموارد</h4>
                <div className="space-y-4">
                  {Object.entries(analytics.operations.resourceUtilization).map(([resource, utilization]) => (
                    <div key={resource} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-700 capitalize">{resource}</span>
                        <span className="font-semibold text-gray-800">{utilization}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${
                            utilization >= 80 ? 'bg-green-500' :
                            utilization >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${utilization}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-4">مقاييس الجودة</h4>
                <div className="space-y-3">
                  {Object.entries(analytics.operations.qualityMetrics).map(([metric, value]) => (
                    <div key={metric} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700 capitalize">
                        {metric === 'defectRate' ? 'معدل العيوب' :
                         metric === 'customerSatisfaction' ? 'رضا العملاء' :
                         metric === 'onTimeDelivery' ? 'التسليم في الوقت' :
                         'معدل المرتجعات'}
                      </span>
                      <span className="font-semibold text-gray-800">
                        {metric === 'customerSatisfaction' ? `${value}/5` : `${value}${metric === 'onTimeDelivery' ? '%' : ''}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Operational Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <FaChartBar className="text-4xl mx-auto mb-2 opacity-50" />
                  <p>تحليل الأداء التشغيلي</p>
                </div>
              </div>
              
              <div className="h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <FaTrendUp className="text-4xl mx-auto mb-2 opacity-50" />
                  <p>تحسين العمليات</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;