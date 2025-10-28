// ======================================
// Financial Forecasting Page - التنبؤات المالية
// ======================================

import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { 
  FaChartLine,
  FaChartBar,
  FaChartPie,
  FaBrain,
  FaCog,
  FaDownload,
  FaRefreshCw,
  FaEye,
  FaLightbulb,
  FaDollarSign,
  FaPercentage,
  FaArrowUp,
  FaArrowDown,
  FaCalendarAlt,
  FaFilter,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle,
  FaTrendingUp,
  FaTrendingDown,
  FaCrosshairs,
  FaTarget,
  FaClock,
  FaDatabase,
  FaGlobe,
  FaShieldAlt
} from 'react-icons/fa';

const FinancialForecasting = () => {
  const { salesInvoices, purchaseInvoices, products, customers } = useData();
  const [selectedForecast, setSelectedForecast] = useState('revenue');
  const [timeHorizon, setTimeHorizon] = useState('12'); // أشهر
  const [confidenceLevel, setConfidenceLevel] = useState('85');
  const [scenario, setScenario] = useState('realistic'); // optimistic, realistic, pessimistic
  const [autoRefresh, setAutoRefresh] = useState(false);

  // إنشاء بيانات التنبؤات المالية
  const generateForecastData = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // حساب البيانات الحالية
    const currentRevenue = salesInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
    const currentExpenses = purchaseInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
    const currentProfit = currentRevenue - currentExpenses;

    // معدل النمو التاريخي
    const growthRate = 0.12; // 12% نمو سنوي

    // سيناريوهات مختلفة
    const scenarioMultipliers = {
      optimistic: 1.25,
      realistic: 1.0,
      pessimistic: 0.75
    };

    const multiplier = scenarioMultipliers[scenario];

    // إنشاء التنبؤات للأشهر القادمة
    const monthlyForecasts = [];
    for (let i = 0; i < parseInt(timeHorizon); i++) {
      const forecastDate = new Date(currentYear, currentMonth + i, 1);
      const seasonalFactor = getSeasonalFactor(forecastDate.getMonth());
      const trendFactor = Math.pow(1 + growthRate, i / 12);
      
      const baseRevenue = currentRevenue * seasonalFactor * trendFactor;
      const baseExpenses = currentExpenses * seasonalFactor * (1 + (growthRate * 0.7));
      
      const forecast = {
        month: forecastDate.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' }),
        monthIndex: i,
        revenue: baseRevenue * multiplier,
        expenses: baseExpenses * multiplier,
        profit: (baseRevenue - baseExpenses) * multiplier,
        confidenceLevel: Math.max(50, 95 - (i * 3)), // انخفاض الثقة مع الوقت
        riskFactors: generateRiskFactors(i),
        opportunities: generateOpportunities(i)
      };
      
      monthlyForecasts.push(forecast);
    }

    // تحليل الاتجاهات
    const trends = {
      revenue: {
        direction: 'up',
        strength: 'strong',
        prediction: currentRevenue * 1.15,
        confidence: 88
      },
      expenses: {
        direction: 'up',
        strength: 'moderate',
        prediction: currentExpenses * 1.08,
        confidence: 82
      },
      profit: {
        direction: 'up',
        strength: 'strong',
        prediction: currentProfit * 1.22,
        confidence: 85
      }
    };

    // تحليل المخاطر والفرص
    const riskAnalysis = {
      high: [
        { factor: 'التضخم', impact: 'ارتفاع التكاليف بنسبة 8-12%', probability: 75 },
        { factor: 'المنافسة', impact: 'انخفاض حصة السوق', probability: 60 },
        { factor: 'تغيير القوانين', impact: 'زيادة الضرائب', probability: 40 }
      ],
      medium: [
        { factor: 'تقلبات أسعار الصرف', impact: 'تأثير على الواردات', probability: 50 },
        { factor: 'المواسم', impact: 'انخفاض المبيعات في مواسم معينة', probability: 70 }
      ],
      low: [
        { factor: 'التكنولوجيا', impact: 'تحديث الأنظمة', probability: 25 }
      ]
    };

    const opportunities = [
      { opportunity: 'التوسع في أسواق جديدة', potential: 150000, timeline: '6 أشهر' },
      { opportunity: 'تحسين الكفاءة التشغيلية', potential: 75000, timeline: '3 أشهر' },
      { opportunity: 'شراكات استراتيجية', potential: 200000, timeline: '12 شهر' }
    ];

    return {
      monthlyForecasts,
      currentMetrics: {
        revenue: currentRevenue,
        expenses: currentExpenses,
        profit: currentProfit,
        margin: currentRevenue > 0 ? (currentProfit / currentRevenue) * 100 : 0
      },
      trends,
      riskAnalysis,
      opportunities,
      summary: {
        nextMonthRevenue: monthlyForecasts[0]?.revenue || 0,
        nextYearRevenue: monthlyForecasts.reduce((sum, f) => sum + f.revenue, 0),
        averageGrowth: (monthlyForecasts[monthlyForecasts.length - 1]?.revenue / currentRevenue - 1) * 100,
        totalProfit: monthlyForecasts.reduce((sum, f) => sum + f.profit, 0)
      }
    };
  };

  // الحصول على عامل موسمي
  const getSeasonalFactor = (month) => {
    const seasonalFactors = [0.8, 0.9, 1.1, 1.2, 1.3, 1.1, 0.9, 0.8, 0.9, 1.0, 1.2, 1.4];
    return seasonalFactors[month] || 1.0;
  };

  // إنشاء عوامل المخاطر
  const generateRiskFactors = (month) => {
    const risks = ['التضخم', 'المنافسة', 'تقلبات السوق', 'تغيير القوانين'];
    return risks.slice(0, Math.floor(Math.random() * 2) + 1);
  };

  // إنشاء الفرص
  const generateOpportunities = (month) => {
    const opportunities = ['توسع السوق', 'تحسين الكفاءة', 'شراكات جديدة'];
    return opportunities.slice(0, Math.floor(Math.random() * 2) + 1);
  };

  const forecastData = generateForecastData();

  // أنواع التنبؤات
  const forecastTypes = [
    {
      id: 'revenue',
      name: 'توقعات الإيرادات',
      icon: <FaDollarSign />,
      color: 'green'
    },
    {
      id: 'expenses',
      name: 'توقعات المصروفات',
      icon: <FaChartBar />,
      color: 'red'
    },
    {
      id: 'profit',
      name: 'توقعات الأرباح',
      icon: <FaTrendingUp />,
      color: 'blue'
    },
    {
      id: 'cashflow',
      name: 'التدفق النقدي',
      icon: <FaDatabase />,
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              التنبؤات المالية
            </h1>
            <p className="text-gray-600 mt-2 text-lg">تحليل وتوقع الأداء المالي المستقبلي بالذكاء الاصطناعي</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Scenario Selector */}
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="optimistic">متفائل</option>
              <option value="realistic">واقعي</option>
              <option value="pessimistic">متشائم</option>
            </select>

            {/* Confidence Level */}
            <select
              value={confidenceLevel}
              onChange={(e) => setConfidenceLevel(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="75">ثقة 75%</option>
              <option value="85">ثقة 85%</option>
              <option value="95">ثقة 95%</option>
            </select>

            {/* Auto Refresh */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                autoRefresh 
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaRefreshCw className={autoRefresh ? 'animate-spin' : ''} />
              تحديث تلقائي
            </button>

            {/* Export */}
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center gap-2">
              <FaDownload />
              تصدير التنبؤات
            </button>
          </div>
        </div>

        {/* Time Horizon */}
        <div className="flex items-center gap-4 mb-6">
          <FaCalendarAlt className="text-gray-400" />
          <span className="text-sm font-medium text-gray-700">الأفق الزمني:</span>
          <div className="flex gap-2">
            {[3, 6, 12, 24].map(months => (
              <button
                key={months}
                onClick={() => setTimeHorizon(months.toString())}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeHorizon === months.toString()
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {months} شهر
              </button>
            ))}
          </div>
        </div>

        {/* Current Financial Status */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">الوضع المالي الحالي</h2>
              <p className="opacity-90">آخر تحديث: {new Date().toLocaleDateString('ar-EG')}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                {forecastData.currentMetrics.revenue.toLocaleString()} ج.م
              </div>
              <p className="opacity-90">إجمالي الإيرادات</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            <div className="bg-white bg-opacity-20 rounded-xl p-4">
              <h4 className="font-semibold mb-1">الإيرادات</h4>
              <p className="text-2xl font-bold">{forecastData.currentMetrics.revenue.toLocaleString()}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-4">
              <h4 className="font-semibold mb-1">المصروفات</h4>
              <p className="text-2xl font-bold">{forecastData.currentMetrics.expenses.toLocaleString()}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-4">
              <h4 className="font-semibold mb-1">الأرباح</h4>
              <p className="text-2xl font-bold">{forecastData.currentMetrics.profit.toLocaleString()}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-4">
              <h4 className="font-semibold mb-1">هامش الربح</h4>
              <p className="text-2xl font-bold">{forecastData.currentMetrics.margin.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Forecast Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {forecastTypes.map(type => (
          <button
            key={type.id}
            onClick={() => setSelectedForecast(type.id)}
            className={`p-4 rounded-xl border-2 transition-all text-right ${
              selectedForecast === type.id
                ? `border-${type.color}-500 bg-${type.color}-50`
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className={`p-3 rounded-lg ${
              selectedForecast === type.id 
                ? `bg-${type.color}-500 text-white` 
                : 'bg-gray-100 text-gray-600'
            } mb-3`}>
              {type.icon}
            </div>
            <h3 className="font-semibold text-gray-800">{type.name}</h3>
          </button>
        ))}
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-lg p-8 text-white mb-8">
        <div className="flex items-center gap-4 mb-6">
          <FaBrain className="text-3xl" />
          <h3 className="text-2xl font-bold">تحليلات ذكية مدعومة بالذكاء الاصطناعي</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white bg-opacity-20 rounded-xl p-4">
            <FaLightbulb className="text-2xl mb-2" />
            <h4 className="font-semibold mb-2">توصيات استراتيجية</h4>
            <p className="text-sm opacity-90">
              زيادة الاستثمار في التسويق الرقمي قد يحقق عائد 25% إضافية
            </p>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-xl p-4">
            <FaTarget className="text-2xl mb-2" />
            <h4 className="font-semibold mb-2">أهداف مقترحة</h4>
            <p className="text-sm opacity-90">
              هدف الإيرادات للشهر القادم: {forecastData.summary.nextMonthRevenue.toLocaleString()} ج.م
            </p>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-xl p-4">
            <FaShieldAlt className="text-2xl mb-2" />
            <h4 className="font-semibold mb-2">إدارة المخاطر</h4>
            <p className="text-sm opacity-90">
              مستوى المخاطر الحالية: متوسط - يفضل تنويع مصادر الإيرادات
            </p>
          </div>
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">منحنى التنبؤات المالية</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">الإيرادات</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">المصروفات</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">الأرباح</span>
            </div>
          </div>
        </div>
        
        {/* Chart Placeholder */}
        <div className="h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
          <div className="text-center text-gray-500">
            <FaChartLine className="text-6xl mx-auto mb-4 opacity-50" />
            <p className="text-xl font-semibold">رسم بياني تفاعلي للتنبؤات</p>
            <p className="text-sm">عرض الاتجاهات والتوقعات المستقبلية</p>
          </div>
        </div>
      </div>

      {/* Monthly Forecasts Table */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">التنبؤات الشهرية التفصيلية</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 font-semibold text-gray-800">الشهر</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-800">الإيرادات</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-800">المصروفات</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-800">الأرباح</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-800">مستوى الثقة</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-800">اتجاه</th>
              </tr>
            </thead>
            <tbody>
              {forecastData.monthlyForecasts.map((forecast, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-800">{forecast.month}</td>
                  <td className="py-3 px-4 text-gray-700">{forecast.revenue.toLocaleString()} ج.م</td>
                  <td className="py-3 px-4 text-gray-700">{forecast.expenses.toLocaleString()} ج.م</td>
                  <td className="py-3 px-4 text-gray-700">{forecast.profit.toLocaleString()} ج.م</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-emerald-500 h-2 rounded-full" 
                          style={{ width: `${forecast.confidenceLevel}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{forecast.confidenceLevel}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <FaArrowUp className="text-green-600" />
                      <span className="text-green-600 text-sm">نمو</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risk Analysis & Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Risk Analysis */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-500 p-2 rounded-lg text-white">
              <FaExclamationTriangle />
            </div>
            <h3 className="text-xl font-bold text-gray-800">تحليل المخاطر</h3>
          </div>
          
          <div className="space-y-6">
            {/* High Risk */}
            <div>
              <h4 className="font-semibold text-red-600 mb-3">مخاطر عالية</h4>
              <div className="space-y-3">
                {forecastData.riskAnalysis.high.map((risk, index) => (
                  <div key={index} className="p-3 bg-red-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-800">{risk.factor}</span>
                      <span className="text-sm text-red-600">{risk.probability}%</span>
                    </div>
                    <p className="text-sm text-gray-600">{risk.impact}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Medium Risk */}
            <div>
              <h4 className="font-semibold text-yellow-600 mb-3">مخاطر متوسطة</h4>
              <div className="space-y-3">
                {forecastData.riskAnalysis.medium.map((risk, index) => (
                  <div key={index} className="p-3 bg-yellow-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-800">{risk.factor}</span>
                      <span className="text-sm text-yellow-600">{risk.probability}%</span>
                    </div>
                    <p className="text-sm text-gray-600">{risk.impact}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Low Risk */}
            <div>
              <h4 className="font-semibold text-green-600 mb-3">مخاطر منخفضة</h4>
              <div className="space-y-3">
                {forecastData.riskAnalysis.low.map((risk, index) => (
                  <div key={index} className="p-3 bg-green-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-800">{risk.factor}</span>
                      <span className="text-sm text-green-600">{risk.probability}%</span>
                    </div>
                    <p className="text-sm text-gray-600">{risk.impact}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Opportunities */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-500 p-2 rounded-lg text-white">
              <FaLightbulb />
            </div>
            <h3 className="text-xl font-bold text-gray-800">الفرص الاستثمارية</h3>
          </div>
          
          <div className="space-y-4">
            {forecastData.opportunities.map((opp, index) => (
              <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">{opp.opportunity}</h4>
                  <span className="text-green-600 font-bold">{opp.potential.toLocaleString()} ج.م</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{opp.potential > 150000 ? 'عائد عالي' : 'عائد متوسط'}</p>
                <div className="flex items-center gap-2">
                  <FaClock className="text-gray-400 text-sm" />
                  <span className="text-sm text-gray-600">{opp.timeline}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Recommendations */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">توصيات الذكاء الاصطناعي</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• تنويع مصادر الإيرادات لتقليل المخاطر</li>
              <li>• زيادة الاستثمار في التكنولوجيا لتحسين الكفاءة</li>
              <li>• تطوير استراتيجية تسويق رقمي متقدمة</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-500 p-3 rounded-xl text-white">
              <FaDollarSign />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">إيرادات الشهر القادم</h3>
              <p className="text-2xl font-bold text-green-600">
                {forecastData.summary.nextMonthRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500 p-3 rounded-xl text-white">
              <FaChartLine />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">إيرادات العام القادم</h3>
              <p className="text-2xl font-bold text-blue-600">
                {forecastData.summary.nextYearRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-500 p-3 rounded-xl text-white">
              <FaTrendingUp />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">متوسط النمو</h3>
              <p className="text-2xl font-bold text-purple-600">
                +{forecastData.summary.averageGrowth.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-yellow-500 p-3 rounded-xl text-white">
              <FaTarget />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">إجمالي الأرباح المتوقعة</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {forecastData.summary.totalProfit.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialForecasting;