// ======================================
// لوحة تحكم التخطيط والميزانية - Planning & Budgeting Dashboard
// ======================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import { 
  FaWallet, 
  FaChartLine, 
  FaCogs, 
  FaShoppingCart,
  FaExclamationTriangle,
  FaPlus,
  FaEdit,
  FaEye,
  FaDownload,
  FaUpload,
  FaCalendarAlt,
  FaDollarSign,
  FaTrendingUp,
  FaTrendingDown,
  FaPercentage,
  FaClock,
  FaCheckCircle,
  FaPause,
  FaPlay,
  FaStop,
  FaChartBar,
  FaPieChart,
  FaUsers,
  FaBoxes,
  FaTasks,
  FaClipboardList,
  FaBell,
  FaBellSlash,
  FaFilter,
  FaSearch,
  FaRefresh,
  FaPrint,
  FaShareAlt,
  FaExpand,
  FaCompress
} from 'react-icons/fa';

const PlanningDashboard = () => {
  const navigate = useNavigate();
  const { showSuccess } = useNotification();

  const [timeFilter, setTimeFilter] = useState('current_month');
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // بيانات وهمية للوحة التحكم
  const dashboardData = {
    // إحصائيات عامة
    stats: {
      totalBudgets: 45,
      activePlans: 28,
      completedPlans: 15,
      pendingApprovals: 7,
      totalBudget: 12500000,
      spentAmount: 8950000,
      remainingBudget: 3550000,
      utilizationRate: 71.6
    },

    // أداء الميزانيات
    budgetPerformance: {
      thisMonth: {
        budgeted: 2500000,
        spent: 2180000,
        variance: -320000,
        variancePercentage: -12.8,
        trend: 'up'
      },
      lastMonth: {
        budgeted: 2400000,
        spent: 2250000,
        variance: -150000,
        variancePercentage: -6.3,
        trend: 'down'
      }
    },

    // حالة الخطط
    planStatus: [
      { status: 'approved', count: 15, color: 'bg-green-500' },
      { status: 'in_progress', count: 8, color: 'bg-blue-500' },
      { status: 'pending', count: 3, color: 'bg-yellow-500' },
      { status: 'on_hold', count: 2, color: 'bg-orange-500' }
    ],

    // مؤشرات الأداء
    kpis: [
      {
        name: 'معدل إنجاز الخطط',
        value: 89.5,
        target: 85,
        unit: '%',
        trend: 'up',
        color: 'green'
      },
      {
        name: 'دقة التنبؤات',
        value: 87.3,
        target: 80,
        unit: '%',
        trend: 'up',
        color: 'blue'
      },
      {
        name: 'توفير التكلفة',
        value: 4.2,
        target: 3.0,
        unit: '%',
        trend: 'up',
        color: 'purple'
      },
      {
        name: 'معدل الاعتماد',
        value: 92.1,
        target: 90,
        unit: '%',
        trend: 'stable',
        color: 'orange'
      }
    ],

    // التنبيهات والمهام العاجلة
    alerts: [
      {
        id: 1,
        type: 'budget',
        severity: 'high',
        title: 'تجاوز الميزانية',
        description: 'قسم المبيعات تجاوز 95% من الميزانية المخصصة',
        time: 'منذ ساعتين',
        actionRequired: true
      },
      {
        id: 2,
        type: 'approval',
        severity: 'medium',
        title: 'اعتماد مطلوب',
        description: 'خطة المشتريات الجديدة في انتظار الاعتماد',
        time: 'منذ 4 ساعات',
        actionRequired: true
      },
      {
        id: 3,
        type: 'forecast',
        severity: 'low',
        title: 'انحراف في التنبؤ',
        description: 'انحراف 8% في توقعات إيرادات الربع الحالي',
        time: 'منذ يوم',
        actionRequired: false
      }
    ],

    // الأنشطة الأخيرة
    recentActivities: [
      {
        id: 1,
        type: 'budget_update',
        description: 'تم تحديث ميزانية قسم الإنتاج',
        user: 'أحمد محمد',
        time: 'منذ 30 دقيقة'
      },
      {
        id: 2,
        type: 'plan_approved',
        description: 'تمت الموافقة على خطة شراء المعدات',
        user: 'سارة أحمد',
        time: 'منذ ساعة'
      },
      {
        id: 3,
        type: 'forecast_generated',
        description: 'تم توليد التنبؤات المالية الجديدة',
        user: 'نظام التلقائي',
        time: 'منذ ساعتين'
      },
      {
        id: 4,
        type: 'report_created',
        description: 'تم إنشاء تقرير تحليل الأداء',
        user: 'محمد علي',
        time: 'منذ 3 ساعات'
      }
    ],

    // البيانات للشارتات
    chartData: {
      budgetTrend: [
        { month: 'يناير', budgeted: 2200000, spent: 2100000 },
        { month: 'فبراير', budgeted: 2400000, spent: 2250000 },
        { month: 'مارس', budgeted: 2600000, spent: 2400000 },
        { month: 'أبريل', budgeted: 2500000, spent: 2350000 },
        { month: 'مايو', budgeted: 2700000, spent: 2550000 },
        { month: 'يونيو', budgeted: 2500000, spent: 2180000 }
      ],
      departmentSpending: [
        { department: 'المبيعات', amount: 2500000, percentage: 28 },
        { department: 'الإنتاج', amount: 3200000, percentage: 36 },
        { department: 'المشتريات', amount: 1800000, percentage: 20 },
        { department: 'الإدارة', amount: 1450000, percentage: 16 }
      ],
      planStatusDistribution: [
        { status: 'مكتملة', count: 15, color: '#10B981' },
        { status: 'قيد التنفيذ', count: 8, color: '#3B82F6' },
        { status: 'في الانتظار', count: 3, color: '#F59E0B' },
        { status: 'معلقة', count: 2, color: '#EF4444' }
      ]
    }
  };

  // دوال مساعدة
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <FaTrendingUp className="text-green-500" />;
      case 'down':
        return <FaTrendingDown className="text-red-500" />;
      default:
        return <FaMinus className="text-gray-500" />;
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      high: 'text-red-600 bg-red-50 border-red-200',
      medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      low: 'text-blue-600 bg-blue-50 border-blue-200'
    };
    return colors[severity] || colors.low;
  };

  const renderChartPlaceholder = (title, type = 'bar') => {
    const colors = {
      bar: 'bg-gradient-to-br from-blue-500 to-blue-600',
      line: 'bg-gradient-to-br from-green-500 to-green-600',
      pie: 'bg-gradient-to-br from-purple-500 to-purple-600',
      area: 'bg-gradient-to-br from-orange-500 to-orange-600'
    };

    return (
      <div className={`h-64 ${colors[type]} rounded-lg flex items-center justify-center text-white relative overflow-hidden`}>
        <div className="text-center z-10">
          <div className="text-lg font-medium mb-2">{title}</div>
          <div className="text-sm opacity-90">معاينة الرسم البياني</div>
        </div>
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.1'%3E%3Cpath d='m0 40l40-40h-40z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '20px 20px'
          }} />
        </div>
      </div>
    );
  };

  const handleRefresh = () => {
    setLastUpdate(new Date());
    showSuccess('تم تحديث البيانات');
  };

  const handleExportDashboard = () => {
    showSuccess('تم تصدير لوحة التحكم');
  };

  const handlePrintDashboard = () => {
    showSuccess('تم إرسال لوحة التحكم للطباعة');
  };

  // Auto refresh effect
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  // Navigation handlers
  const navigateToBudgets = () => navigate('/budgeting/budgets');
  const navigateToForecasts = () => navigate('/budgeting/forecasts');
  const navigateToProduction = () => navigate('/budgeting/production-plans');
  const navigateToPurchases = () => navigate('/budgeting/purchase-plans');
  const navigateToReports = () => navigate('/budgeting/reports');

  return (
    <div className={`p-6 max-w-7xl mx-auto ${isFullscreen ? 'fixed inset-0 z-50 bg-white overflow-y-auto' : ''}`}>
      {/* العنوان والتحكم */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة تحكم التخطيط والميزانية</h1>
          <p className="text-gray-600">نظرة شاملة على أداء التخطيط والميزانية</p>
          <div className="text-sm text-gray-500 mt-1">
            آخر تحديث: {lastUpdate.toLocaleTimeString('ar-SA')}
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            icon={FaRefresh}
            onClick={handleRefresh}
            className={autoRefresh ? 'animate-pulse' : ''}
          >
            تحديث
          </Button>
          <Button
            variant="outline"
            icon={FaPrint}
            onClick={handlePrintDashboard}
          >
            طباعة
          </Button>
          <Button
            variant="outline"
            icon={FaDownload}
            onClick={handleExportDashboard}
          >
            تصدير
          </Button>
          <Button
            variant="outline"
            icon={isFullscreen ? FaCompress : FaExpand}
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? 'تصغير' : 'ملء الشاشة'}
          </Button>
        </div>
      </div>

      {/* الإحصائيات الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">إجمالي الميزانيات</p>
              <p className="text-2xl font-bold">{dashboardData.stats.totalBudgets}</p>
              <div className="flex items-center gap-1 mt-1">
                <FaTrendingUp className="text-blue-200 text-sm" />
                <span className="text-xs text-blue-200">+12% من الشهر الماضي</span>
              </div>
            </div>
            <FaWallet className="text-blue-200 text-4xl" />
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">الخطط النشطة</p>
              <p className="text-2xl font-bold">{dashboardData.stats.activePlans}</p>
              <div className="flex items-center gap-1 mt-1">
                <FaCheckCircle className="text-green-200 text-sm" />
                <span className="text-xs text-green-200">{dashboardData.stats.completedPlans} مكتملة</span>
              </div>
            </div>
            <FaTasks className="text-green-200 text-4xl" />
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">معدل الاستغلال</p>
              <p className="text-2xl font-bold">{formatPercentage(dashboardData.stats.utilizationRate)}</p>
              <div className="flex items-center gap-1 mt-1">
                <FaPercentage className="text-purple-200 text-sm" />
                <span className="text-xs text-purple-200">{formatCurrency(dashboardData.stats.spentAmount)} منفق</span>
              </div>
            </div>
            <FaChartBar className="text-purple-200 text-4xl" />
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">في انتظار الاعتماد</p>
              <p className="text-2xl font-bold">{dashboardData.stats.pendingApprovals}</p>
              <div className="flex items-center gap-1 mt-1">
                <FaClock className="text-orange-200 text-sm" />
                <span className="text-xs text-orange-200">يتطلب إجراءات</span>
              </div>
            </div>
            <FaPause className="text-orange-200 text-4xl" />
          </div>
        </Card>
      </div>

      {/* المؤشرات الرئيسية وأداء الميزانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* مؤشرات الأداء */}
        <Card title="مؤشرات الأداء الرئيسية" className="h-full">
          <div className="space-y-4">
            {dashboardData.kpis.map((kpi, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{kpi.name}</span>
                    {getTrendIcon(kpi.trend)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {kpi.value}{kpi.unit}
                    </span>
                    <span className="text-sm text-gray-500">
                      الهدف: {kpi.target}{kpi.unit}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`w-16 h-2 rounded-full ${
                    kpi.color === 'green' ? 'bg-green-200' :
                    kpi.color === 'blue' ? 'bg-blue-200' :
                    kpi.color === 'purple' ? 'bg-purple-200' :
                    'bg-orange-200'
                  }`}>
                    <div 
                      className={`h-2 rounded-full ${
                        kpi.color === 'green' ? 'bg-green-500' :
                        kpi.color === 'blue' ? 'bg-blue-500' :
                        kpi.color === 'purple' ? 'bg-purple-500' :
                        'bg-orange-500'
                      }`}
                      style={{ width: `${Math.min((kpi.value / kpi.target) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatPercentage((kpi.value / kpi.target) * 100)} من الهدف
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* أداء الميزانية */}
        <Card title="أداء الميزانية" className="h-full">
          <div className="space-y-6">
            {/* إحصائيات الشهر الحالي */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-lg font-semibold text-blue-600">الميزانية</div>
                <div className="text-xl font-bold text-gray-900">
                  {formatCurrency(dashboardData.budgetPerformance.thisMonth.budgeted)}
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-lg font-semibold text-green-600">المنفق</div>
                <div className="text-xl font-bold text-gray-900">
                  {formatCurrency(dashboardData.budgetPerformance.thisMonth.spent)}
                </div>
              </div>
            </div>

            {/* الانحراف */}
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold text-gray-600">الانحراف</div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl font-bold text-gray-900">
                  {formatCurrency(dashboardData.budgetPerformance.thisMonth.variance)}
                </span>
                <span className={`text-lg font-medium ${
                  dashboardData.budgetPerformance.thisMonth.variance < 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ({formatPercentage(dashboardData.budgetPerformance.thisMonth.variancePercentage)})
                </span>
                {dashboardData.budgetPerformance.thisMonth.variance < 0 ? (
                  <FaTrendingDown className="text-green-500" />
                ) : (
                  <FaTrendingUp className="text-red-500" />
                )}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                توفير مقارنة بالميزانية المخططة
              </div>
            </div>

            {/* مخطط الانحراف */}
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min((dashboardData.budgetPerformance.thisMonth.spent / dashboardData.budgetPerformance.thisMonth.budgeted) * 100, 100)}%` 
                }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>0</span>
              <span>{formatCurrency(dashboardData.budgetPerformance.thisMonth.budgeted)}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* الرسوم البيانية الرئيسية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* اتجاه الميزانية */}
        <Card title="اتجاه الميزانية والإنفاق">
          {renderChartPlaceholder('اتجاه الميزانية والإنفاق', 'line')}
        </Card>

        {/* توزيع الإنفاق حسب القسم */}
        <Card title="توزيع الإنفاق حسب القسم">
          {renderChartPlaceholder('توزيع الإنفاق', 'pie')}
        </Card>
      </div>

      {/* التنبيهات والأنشطة الأخيرة */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* التنبيهات */}
        <Card title="التنبيهات والأخطاء" className="h-full">
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {dashboardData.alerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)} ${
                  alert.actionRequired ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {alert.severity === 'high' ? (
                      <FaExclamationTriangle className="text-red-500" />
                    ) : alert.severity === 'medium' ? (
                      <FaClock className="text-yellow-500" />
                    ) : (
                      <FaBell className="text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                      <span className="text-xs text-gray-500">{alert.time}</span>
                    </div>
                    <p className="text-sm text-gray-600">{alert.description}</p>
                    {alert.actionRequired && (
                      <div className="mt-2">
                        <Button size="sm" variant="primary">
                          اتخاذ إجراء
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* الأنشطة الأخيرة */}
        <Card title="الأنشطة الأخيرة" className="h-full">
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {dashboardData.recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {activity.type === 'budget_update' && <FaWallet className="text-blue-500" />}
                  {activity.type === 'plan_approved' && <FaCheckCircle className="text-green-500" />}
                  {activity.type === 'forecast_generated' && <FaChartLine className="text-purple-500" />}
                  {activity.type === 'report_created' && <FaFileAlt className="text-orange-500" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{activity.user}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* حالة الخطط السريع */}
      <Card title="حالة الخطط">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {dashboardData.planStatus.map((status, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`w-4 h-4 rounded-full ${status.color} mx-auto mb-2`}></div>
              <div className="text-2xl font-bold text-gray-900">{status.count}</div>
              <div className="text-sm text-gray-600">
                {status.status === 'approved' && 'معتمدة'}
                {status.status === 'in_progress' && 'قيد التنفيذ'}
                {status.status === 'pending' && 'في الانتظار'}
                {status.status === 'on_hold' && 'معلقة'}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* أزرار الوصول السريع */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">الوصول السريع</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Button
            variant="outline"
            onClick={navigateToBudgets}
            icon={FaWallet}
            className="h-20 flex-col"
          >
            الميزانيات
          </Button>
          <Button
            variant="outline"
            onClick={navigateToForecasts}
            icon={FaChartLine}
            className="h-20 flex-col"
          >
            التنبؤات
          </Button>
          <Button
            variant="outline"
            onClick={navigateToProduction}
            icon={FaCogs}
            className="h-20 flex-col"
          >
            خطط الإنتاج
          </Button>
          <Button
            variant="outline"
            onClick={navigateToPurchases}
            icon={FaShoppingCart}
            className="h-20 flex-col"
          >
            خطط المشتريات
          </Button>
          <Button
            variant="outline"
            onClick={navigateToReports}
            icon={FaPieChart}
            className="h-20 flex-col"
          >
            التقارير
          </Button>
        </div>
      </div>

      {/* إعدادات العرض */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">تحديث تلقائي</span>
            </label>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="current_month">الشهر الحالي</option>
              <option value="last_month">الشهر الماضي</option>
              <option value="current_quarter">الربع الحالي</option>
              <option value="current_year">السنة الحالية</option>
            </select>
          </div>
          <div className="text-sm text-gray-500">
            عرض الوقت: {new Date().toLocaleTimeString('ar-SA')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanningDashboard;