// ======================================
// Business Intelligence Page - ذكاء الأعمال
// ======================================

import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { 
  FaBrain,
  FaLightbulb,
  FaCogs,
  FaChartLine,
  FaChartBar,
  FaChartPie,
  FaDatabase,
  FaEye,
  FaTarget,
  FaRocket,
  FaTrophy,
  FaTrendingUp,
  FaTrendingDown,
  FaArrowUp,
  FaArrowDown,
  FaDownload,
  FaRefreshCw,
  FaFilter,
  FaSearch,
  FaCalendarAlt,
  FaUsers,
  FaGlobe,
  FaMobile,
  FaDesktop,
  FaTablet,
  FaBell,
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle,
  FaCrosshairs,
  FaMicroscope,
  FaBinoculars,
  FaCompass,
  FaRocketLaunch,
  FaGear,
  FaWrench,
  FaHammer,
  FaTools,
  FaUserTie,
  FaBuilding,
  FaBox,
  FaDollarSign
} from 'react-icons/fa';

const BusinessIntelligence = () => {
  const { products, customers, suppliers, salesInvoices, purchaseInvoices, warehouses } = useData();
  const [selectedDashboard, setSelectedDashboard] = useState('executive');
  const [viewMode, setViewMode] = useState('dashboard');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [realTimeData, setRealTimeData] = useState(true);
  const [aiInsights, setAiInsights] = useState(true);

  // بيانات ذكاء الأعمال
  const generateBusinessIntelligence = () => {
    const currentDate = new Date();
    
    // تحليل الأداء التشغيلي
    const operationalMetrics = {
      overallEfficiency: 87.5,
      processAutomation: 73.2,
      qualityScore: 4.2,
      productivityIndex: 125.8,
      costOptimization: 15.3,
      resourceUtilization: {
        human: 85.0,
        technology: 78.5,
        physical: 82.3,
        financial: 91.2
      }
    };

    // تحليل رضا العملاء
    const customerIntelligence = {
      satisfactionScore: 4.3,
      nps: 67,
      customerLifetimeValue: 15000,
      retentionRate: 89.5,
      churnRate: 10.5,
      acquisitionCost: 250,
      customerSegments: {
        enterprise: { count: 45, value: 850000, satisfaction: 4.5 },
        midMarket: { count: 120, value: 420000, satisfaction: 4.2 },
        smallBusiness: { count: 285, value: 280000, satisfaction: 4.0 },
        individual: { count: 450, value: 180000, satisfaction: 4.1 }
      },
      behavioralPatterns: {
        peakHours: ['10:00-12:00', '14:00-16:00', '19:00-21:00'],
        popularChannels: ['online', 'mobile', 'phone'],
        responseTime: '2.3 hours',
        resolutionRate: 94.7
      }
    };

    // تحليل السوق والمنافسة
    const marketIntelligence = {
      marketShare: 15.8,
      competitivePosition: 'challenger',
      brandRecognition: 67.3,
      marketTrends: [
        { trend: 'التحول الرقمي', impact: 'high', growth: 25.3 },
        { trend: 'الاستدامة', impact: 'medium', growth: 18.7 },
        { trend: 'التجارة الإلكترونية', impact: 'high', growth: 42.1 },
        { trend: 'الذكاء الاصطناعي', impact: 'high', growth: 67.8 },
        { trend: 'العمل عن بُعد', impact: 'medium', growth: 31.4 }
      ],
      competitorAnalysis: [
        { name: 'منافس A', marketShare: 28.5, strengths: ['تكنولوجيا متقدمة', 'قوة العلامة التجارية'], weaknesses: ['تكلفة عالية', 'خدمة عملاء ضعيفة'] },
        { name: 'منافس B', marketShare: 19.2, strengths: ['أسعار تنافسية', 'توزيع واسع'], weaknesses: ['جودة متغيرة', 'ابتكار محدود'] },
        { name: 'منافس C', marketShare: 12.7, strengths: ['ابتكار', 'خدمة عملاء'], weaknesses: ['حصة سوق صغيرة', 'موارد محدودة'] }
      ],
      opportunities: [
        { opportunity: 'التوسع في المدن الجديدة', potential: 500000, timeline: '6 أشهر', feasibility: 'high' },
        { opportunity: 'تطوير منتجات رقمية', potential: 300000, timeline: '12 شهر', feasibility: 'medium' },
        { opportunity: 'الشراكات الاستراتيجية', potential: 750000, timeline: '18 شهر', feasibility: 'high' }
      ]
    };

    // تحليل الابتكار والتكنولوجيا
    const innovationMetrics = {
      rdInvestment: 12.5, // نسبة من الإيرادات
      newProductRatio: 23.7,
      patentCount: 15,
      technologyAdoption: 78.9,
      digitalTransformation: 65.4,
      automationLevel: 71.8,
      innovationPipeline: [
        { project: 'تطبيق الهاتف الذكي', progress: 75, investment: 250000, expectedROI: 180 },
        { project: 'نظام إدارة ذكي', progress: 60, investment: 400000, expectedROI: 220 },
        { project: 'منصة التجارة الإلكترونية', progress: 85, investment: 180000, expectedROI: 150 },
        { project: 'ذكاء اصطناعي للتنبؤات', progress: 40, investment: 500000, expectedROI: 300 }
      ]
    };

    // تحليل المخاطر والامتثال
    const riskAssessment = {
      overallRiskLevel: 'medium',
      complianceScore: 94.2,
      securityScore: 88.7,
      financialRisk: 'low',
      operationalRisk: 'medium',
      marketRisk: 'high',
      riskMatrix: [
        { risk: 'انقطاع سلسلة التوريد', probability: 25, impact: 'high', mitigation: 'تعدد الموردين' },
        { risk: 'تغيرات قانونية', probability: 40, impact: 'medium', mitigation: 'مراقبة مستمرة' },
        { risk: 'منافسة شديدة', probability: 60, impact: 'medium', mitigation: 'تميز المنتجات' },
        { risk: 'أزمة اقتصادية', probability: 30, impact: 'high', mitigation: 'تنويع الإيرادات' }
      ]
    };

    // رؤى الذكاء الاصطناعي
    const aiInsights = [
      {
        category: 'مبيعات',
        insight: 'زيادة 15% في المبيعات متوقعة عند تطبيق استراتيجية التسويق المخصصة',
        confidence: 87,
        action: 'تطوير حملات تسويقية مخصصة بناءً على تحليل سلوك العملاء',
        impact: 'high'
      },
      {
        category: 'عمليات',
        insight: 'تحسين الكفاءة بنسبة 12% ممكن عبر أتمتة العمليات الروتينية',
        confidence: 92,
        action: 'تطبيق حلول RPA في قسم خدمة العملاء والمحاسبة',
        impact: 'medium'
      },
      {
        category: 'منتجات',
        insight: 'إطلاق منتج رقمي جديد سيزيد حصة السوق بنسبة 8-12%',
        confidence: 78,
        action: 'تسريع تطوير المنتج الرقمي والتسويق المسبق',
        impact: 'high'
      },
      {
        category: 'عملاء',
        insight: 'تقليل معدل التسرب بنسبة 25% ممكن عبر برنامج ولاء محسن',
        confidence: 85,
        action: 'إطلاق برنامج نقاط المكافآت المتقدم',
        impact: 'medium'
      }
    ];

    return {
      operational: operationalMetrics,
      customers: customerIntelligence,
      market: marketIntelligence,
      innovation: innovationMetrics,
      risk: riskAssessment,
      insights: aiInsights
    };
  };

  const biData = generateBusinessIntelligence();

  // أنواع لوحات المعلومات
  const dashboardTypes = [
    {
      id: 'executive',
      name: 'لوحة الإدارة التنفيذية',
      icon: <FaUserTie />,
      description: 'نظرة شاملة على الأداء والنتائج'
    },
    {
      id: 'operations',
      name: 'لوحة العمليات التشغيلية',
      icon: <FaCogs />,
      description: 'تحليل مفصل للعمليات والكفاءة'
    },
    {
      id: 'customers',
      name: 'لوحة ذكاء العملاء',
      icon: <FaUsers />,
      description: 'تحليل سلوك ورضا العملاء'
    },
    {
      id: 'market',
      name: 'لوحة ذكاء السوق',
      icon: <FaGlobe />,
      description: 'تحليل السوق والمنافسة'
    },
    {
      id: 'innovation',
      name: 'لوحة الابتكار',
      icon: <FaLightbulb />,
      description: 'متابعة الابتكار والتكنولوجيا'
    },
    {
      id: 'risk',
      name: 'لوحة إدارة المخاطر',
      icon: <FaExclamationTriangle />,
      description: 'تقييم وإدارة المخاطر'
    }
  ];

  // تحديد اللون حسب التأثير
  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // تحديد الأيقونة حسب الفئة
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'مبيعات': return <FaDollarSign className="text-green-600" />;
      case 'عمليات': return <FaCogs className="text-blue-600" />;
      case 'منتجات': return <FaBox className="text-purple-600" />;
      case 'عملاء': return <FaUsers className="text-indigo-600" />;
      default: return <FaInfoCircle className="text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              ذكاء الأعمال
            </h1>
            <p className="text-gray-600 mt-2 text-lg">منصة شاملة لتحليل البيانات واتخاذ القرارات الذكية</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* AI Insights Toggle */}
            <button
              onClick={() => setAiInsights(!aiInsights)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                aiInsights 
                  ? 'bg-violet-500 text-white hover:bg-violet-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaBrain className={aiInsights ? 'animate-pulse' : ''} />
              رؤى AI
            </button>

            {/* Real-time Data */}
            <button
              onClick={() => setRealTimeData(!realTimeData)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                realTimeData 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaEye className={realTimeData ? 'animate-pulse' : ''} />
              بيانات مباشرة
            </button>

            {/* Auto Refresh */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                autoRefresh 
                  ? 'bg-violet-500 text-white hover:bg-violet-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaRefreshCw className={autoRefresh ? 'animate-spin' : ''} />
              تحديث تلقائي
            </button>

            {/* Export */}
            <button className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 flex items-center gap-2">
              <FaDownload />
              تصدير التقرير
            </button>
          </div>
        </div>

        {/* Dashboard Type Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {dashboardTypes.map(dashboard => (
            <button
              key={dashboard.id}
              onClick={() => setSelectedDashboard(dashboard.id)}
              className={`p-4 rounded-xl border-2 transition-all text-right ${
                selectedDashboard === dashboard.id
                  ? 'border-violet-500 bg-violet-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${
                  selectedDashboard === dashboard.id ? 'bg-violet-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {dashboard.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{dashboard.name}</h3>
                </div>
              </div>
              <p className="text-sm text-gray-600">{dashboard.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* AI Insights Banner */}
      {aiInsights && (
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white mb-8">
          <div className="flex items-center gap-4 mb-6">
            <FaBrain className="text-3xl" />
            <h3 className="text-2xl font-bold">رؤى الذكاء الاصطناعي المتقدمة</h3>
            <div className="flex-1"></div>
            <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
              <span className="text-sm">AI بالوقت الفعلي</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {biData.insights.slice(0, 4).map((insight, index) => (
              <div key={index} className="bg-white bg-opacity-20 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  {getCategoryIcon(insight.category)}
                  <h4 className="font-semibold">{insight.category}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    insight.impact === 'high' ? 'bg-red-500' :
                    insight.impact === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}>
                    تأثير {insight.impact === 'high' ? 'عالي' : insight.impact === 'medium' ? 'متوسط' : 'منخفض'}
                  </span>
                </div>
                <p className="text-sm opacity-90 mb-2">{insight.insight}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs opacity-75">مستوى الثقة: {insight.confidence}%</span>
                  <button className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded hover:bg-opacity-30">
                    تطبيق التوصية
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dashboard Content Based on Selection */}
      {selectedDashboard === 'executive' && (
        <div className="space-y-8">
          {/* Executive KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-500 p-3 rounded-xl text-white">
                  <FaTrendingUp className="text-2xl" />
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">الكفاءة التشغيلية</div>
                  <div className="text-2xl font-bold text-gray-800">{biData.operational.overallEfficiency}%</div>
                  <div className="text-sm text-green-600">+3.2%</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-500 p-3 rounded-xl text-white">
                  <FaUsers className="text-2xl" />
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">رضا العملاء</div>
                  <div className="text-2xl font-bold text-gray-800">{biData.customers.satisfactionScore}/5</div>
                  <div className="text-sm text-green-600">+0.2</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-500 p-3 rounded-xl text-white">
                  <FaGlobe className="text-2xl" />
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">حصة السوق</div>
                  <div className="text-2xl font-bold text-gray-800">{biData.market.marketShare}%</div>
                  <div className="text-sm text-green-600">+1.8%</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-yellow-500 p-3 rounded-xl text-white">
                  <FaLightbulb className="text-2xl" />
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">مؤشر الابتكار</div>
                  <div className="text-2xl font-bold text-gray-800">{biData.innovation.rdInvestment}%</div>
                  <div className="text-sm text-blue-600">استثمار في R&D</div>
                </div>
              </div>
            </div>
          </div>

          {/* Strategic Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">تحليل الاتجاهات الاستراتيجية</h3>
              <div className="space-y-4">
                {biData.market.marketTrends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{trend.trend}</p>
                      <p className="text-sm text-gray-600">تأثير: {trend.impact}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-green-600">
                        <FaArrowUp className="text-sm" />
                        <span className="font-semibold">{trend.growth}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">فرص النمو الاستراتيجية</h3>
              <div className="space-y-4">
                {biData.market.opportunities.map((opp, index) => (
                  <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800">{opp.opportunity}</h4>
                      <span className="text-blue-600 font-bold">{opp.potential.toLocaleString()} ج.م</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>الإمكانية: {opp.feasibility === 'high' ? 'عالية' : opp.feasibility === 'medium' ? 'متوسطة' : 'منخفضة'}</span>
                      <span>الجدول: {opp.timeline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedDashboard === 'operations' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">الأداء التشغيلي</h3>
            
            {/* Resource Utilization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="font-semibold text-gray-800 mb-4">استخدام الموارد</h4>
                <div className="space-y-4">
                  {Object.entries(biData.operational.resourceUtilization).map(([resource, utilization]) => (
                    <div key={resource} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-700 capitalize">
                          {resource === 'human' ? 'البشرية' :
                           resource === 'technology' ? 'التقنية' :
                           resource === 'physical' ? 'المادية' :
                           'المالية'}
                        </span>
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
                <h4 className="font-semibold text-gray-800 mb-4">مقاييس الأداء الرئيسية</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">الأتمتة</p>
                    <p className="text-2xl font-bold text-gray-800">{biData.operational.processAutomation}%</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">مؤشر الإنتاجية</p>
                    <p className="text-2xl font-bold text-gray-800">{biData.operational.productivityIndex}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">درجة الجودة</p>
                    <p className="text-2xl font-bold text-gray-800">{biData.operational.qualityScore}/5</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">تحسين التكلفة</p>
                    <p className="text-2xl font-bold text-gray-800">{biData.operational.costOptimization}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Operational Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <FaChartBar className="text-4xl mx-auto mb-2 opacity-50" />
                  <p>تحليل الكفاءة التشغيلية</p>
                </div>
              </div>
              
              <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <FaChartLine className="text-4xl mx-auto mb-2 opacity-50" />
                  <p>اتجاهات الإنتاجية</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedDashboard === 'customers' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">ذكاء العملاء</h3>
            
            {/* Customer Segments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="font-semibold text-gray-800 mb-4">شرائح العملاء</h4>
                <div className="space-y-3">
                  {Object.entries(biData.customers.customerSegments).map(([segment, data]) => (
                    <div key={segment} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800 capitalize">{segment}</p>
                        <p className="text-sm text-gray-600">{data.count} عميل</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">{data.value.toLocaleString()} ج.م</p>
                        <p className="text-sm text-gray-600">رضا: {data.satisfaction}/5</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-4">مقاييس الأداء</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600">نقاط صافي المروج</p>
                    <p className="text-2xl font-bold text-blue-600">{biData.customers.nps}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600">معدل الاحتفاظ</p>
                    <p className="text-2xl font-bold text-green-600">{biData.customers.retentionRate}%</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600">قيمة العمر</p>
                    <p className="text-2xl font-bold text-purple-600">{biData.customerIntelligence.customerLifetimeValue.toLocaleString()}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600">تكلفة الاستحواذ</p>
                    <p className="text-2xl font-bold text-yellow-600">{biData.customers.acquisitionCost} ج.م</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Behavioral Patterns */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-800 mb-4">أنماط السلوك</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h5 className="text-sm font-medium text-gray-600 mb-2">ساعات الذروة</h5>
                  <div className="space-y-1">
                    {biData.customers.behavioralPatterns.peakHours.map((hour, index) => (
                      <span key={index} className="inline-block bg-white px-2 py-1 rounded text-sm text-gray-700 mr-1">
                        {hour}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-600 mb-2">قنوات التواصل المفضلة</h5>
                  <div className="space-y-1">
                    {biData.customers.behavioralPatterns.popularChannels.map((channel, index) => (
                      <span key={index} className="inline-block bg-white px-2 py-1 rounded text-sm text-gray-700 mr-1 capitalize">
                        {channel}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-600 mb-2">مقاييس الخدمة</h5>
                  <div className="space-y-1">
                    <div className="bg-white px-2 py-1 rounded text-sm">
                      <span className="text-gray-600">وقت الاستجابة: </span>
                      <span className="font-semibold">{biData.customers.behavioralPatterns.responseTime}</span>
                    </div>
                    <div className="bg-white px-2 py-1 rounded text-sm">
                      <span className="text-gray-600">معدل الحل: </span>
                      <span className="font-semibold">{biData.customers.behavioralPatterns.resolutionRate}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedDashboard === 'market' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">تحليل السوق والمنافسة</h3>
            
            {/* Market Share */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="font-semibold text-gray-800 mb-4">حصة السوق</h4>
                <div className="space-y-4">
                  {biData.market.competitorAnalysis.map((competitor, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium text-gray-800">{competitor.name}</h5>
                        <span className="font-bold text-gray-800">{competitor.marketShare}%</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-green-600 font-medium">نقاط القوة:</p>
                          <ul className="text-gray-600 list-disc list-inside">
                            {competitor.strengths.map((strength, i) => (
                              <li key={i}>{strength}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-red-600 font-medium">نقاط الضعف:</p>
                          <ul className="text-gray-600 list-disc list-inside">
                            {competitor.weaknesses.map((weakness, i) => (
                              <li key={i}>{weakness}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-4">مقاييس السوق</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600">حصة شركتنا</p>
                    <p className="text-2xl font-bold text-blue-600">{biData.market.marketShare}%</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600">اعتراف العلامة</p>
                    <p className="text-2xl font-bold text-green-600">{biData.market.brandRecognition}%</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600">المركز التنافسي</p>
                    <p className="text-lg font-bold text-purple-600">متحدي</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600">اتجاه النمو</p>
                    <div className="flex items-center justify-center gap-1 text-green-600">
                      <FaArrowUp />
                      <span className="font-bold">صاعد</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Trends Visualization */}
            <div className="h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
              <div className="text-center text-gray-500">
                <FaChartLine className="text-6xl mx-auto mb-4 opacity-50" />
                <p className="text-xl font-semibold">تحليل اتجاهات السوق</p>
                <p className="text-sm">اتجاهات النمو والاتجاهات المستقبلية</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedDashboard === 'innovation' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">مقاييس الابتكار</h3>
            
            {/* Innovation Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl text-center">
                <FaLightbulb className="text-3xl text-blue-600 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-1">استثمار R&D</p>
                <p className="text-2xl font-bold text-blue-600">{biData.innovation.rdInvestment}%</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl text-center">
                <FaRocket className="text-3xl text-green-600 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-1">منتجات جديدة</p>
                <p className="text-2xl font-bold text-green-600">{biData.innovation.newProductRatio}%</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl text-center">
                <FaCogs className="text-3xl text-purple-600 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-1">تبني التقنية</p>
                <p className="text-2xl font-bold text-purple-600">{biData.innovation.technologyAdoption}%</p>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl text-center">
                <FaDatabase className="text-3xl text-yellow-600 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-1">الأتمتة</p>
                <p className="text-2xl font-bold text-yellow-600">{biData.innovation.automationLevel}%</p>
              </div>
            </div>

            {/* Innovation Pipeline */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">خط إنتاج الابتكار</h4>
              <div className="space-y-4">
                {biData.innovation.innovationPipeline.map((project, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-medium text-gray-800">{project.project}</h5>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">ROI المتوقع: {project.expectedROI}%</span>
                        <span className="text-sm font-semibold text-gray-800">{project.investment.toLocaleString()} ج.م</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-600">التقدم: {project.progress}%</span>
                      <span className="text-sm text-gray-500">الاستثمار: {project.investment.toLocaleString()} ج.م</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedDashboard === 'risk' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">تقييم المخاطر</h3>
            
            {/* Risk Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <FaCheckCircle className="text-2xl text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">درجة الامتثال</p>
                <p className="text-2xl font-bold text-green-600">{biData.risk.complianceScore}%</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <FaShieldAlt className="text-2xl text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">درجة الأمان</p>
                <p className="text-2xl font-bold text-blue-600">{biData.risk.securityScore}%</p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <FaExclamationTriangle className="text-2xl text-yellow-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">مستوى المخاطر</p>
                <p className="text-lg font-bold text-yellow-600 capitalize">{biData.risk.overallRiskLevel}</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <FaEye className="text-2xl text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">المراقبة المباشرة</p>
                <p className="text-lg font-bold text-purple-600">نشطة</p>
              </div>
            </div>

            {/* Risk Matrix */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">مصفوفة المخاطر</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-right py-3 px-4 font-semibold text-gray-800">المخاطر</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-800">الاحتمالية</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-800">الأثر</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-800">إجراءات التخفيف</th>
                    </tr>
                  </thead>
                  <tbody>
                    {biData.risk.riskMatrix.map((risk, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-800">{risk.risk}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            risk.probability >= 50 ? 'bg-red-100 text-red-800' :
                            risk.probability >= 30 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {risk.probability}%
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            risk.impact === 'high' ? 'bg-red-100 text-red-800' :
                            risk.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {risk.impact === 'high' ? 'عالي' : risk.impact === 'medium' ? 'متوسط' : 'منخفض'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-700">{risk.mitigation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessIntelligence;