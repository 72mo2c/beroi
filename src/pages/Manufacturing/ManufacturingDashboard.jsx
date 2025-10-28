import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, Factory, Users, 
  Clock, AlertTriangle, CheckCircle, Zap, Target,
  Activity, PieChart, Calendar, ArrowUp, ArrowDown,
  Settings, RefreshCw, Download, Filter, Search,
  Plus, Eye, Edit, Play, Pause, Square, Award,
  Battery, Thermometer, Droplets, Gauge, Package,
  Timer, ClipboardList, Shield, Wrench
} from 'lucide-react';

const ManufacturingDashboard = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [timeRange, setTimeRange] = useState('اليوم');
  const [refreshing, setRefreshing] = useState(false);

  // محاكاة البيانات
  const mockDashboardData = {
    overview: {
      totalOrders: 45,
      activeOrders: 28,
      completedOrders: 15,
      delayedOrders: 2,
      productionEfficiency: 87.5,
      qualityScore: 94.2,
      onTimeDelivery: 91.8,
      overallEquipmentEffectiveness: 85.3
    },
    productionTrends: [
      { month: 'يناير', planned: 1200, actual: 1150, efficiency: 95.8 },
      { month: 'فبراير', planned: 1100, actual: 1080, efficiency: 98.2 },
      { month: 'مارس', planned: 1300, actual: 1180, efficiency: 90.8 },
      { month: 'أبريل', planned: 1400, actual: 1350, efficiency: 96.4 },
      { month: 'مايو', planned: 1250, actual: 1300, efficiency: 104.0 },
      { month: 'يونيو', planned: 1350, actual: 1280, efficiency: 94.8 },
      { month: 'يوليو', planned: 1450, actual: 1420, efficiency: 97.9 },
      { month: 'أغسطس', planned: 1500, actual: 1480, efficiency: 98.7 },
      { month: 'سبتمبر', planned: 1400, actual: 1425, efficiency: 101.8 },
      { month: 'أكتوبر', planned: 1550, actual: 1580, efficiency: 101.9 }
    ],
    orderStatus: [
      { status: 'مجدول', count: 12, percentage: 26.7, color: 'bg-blue-500' },
      { status: 'قيد التنفيذ', count: 16, percentage: 35.6, color: 'bg-yellow-500' },
      { status: 'مكتمل', count: 15, percentage: 33.3, color: 'bg-green-500' },
      { status: 'متوقف', count: 2, percentage: 4.4, color: 'bg-red-500' }
    ],
    qualityMetrics: [
      { metric: 'معدل النجاح', value: 94.2, target: 95.0, unit: '%', trend: 'up' },
      { metric: 'عيوب لكل 1000', value: 2.8, target: 3.0, unit: '', trend: 'down' },
      { metric: 'مرتجعات', value: 1.2, target: 1.5, unit: '%', trend: 'down' },
      { metric: 'فحوصات ناجحة', value: 456, target: 450, unit: '', trend: 'up' }
    ],
    equipmentStatus: [
      { name: 'خط الإنتاج 1', status: 'نشط', utilization: 95, efficiency: 92, alerts: 0 },
      { name: 'خط الإنتاج 2', status: 'نشط', utilization: 88, efficiency: 89, alerts: 1 },
      { name: 'خط الإنتاج 3', status: 'تحذير', utilization: 72, efficiency: 65, alerts: 2 },
      { name: 'محطة الاختبار', status: 'نشط', utilization: 85, efficiency: 94, alerts: 0 },
      { name: 'محطة التحكم', status: 'نشط', utilization: 98, efficiency: 96, alerts: 0 },
      { name: 'محطة التغليف', status: 'متوقف', utilization: 0, efficiency: 0, alerts: 1 }
    ],
    alerts: [
      { id: 1, type: 'تحذير', message: 'درجة حرارة عالية في خط الإنتاج 3', timestamp: '2025-10-28 14:30', priority: 'متوسط' },
      { id: 2, type: 'خطأ', message: 'تعطل في آلة التجميع الرئيسية', timestamp: '2025-10-28 15:00', priority: 'عالي' },
      { id: 3, type: 'تحذير', message: 'انخفاض في ضغط الهواء', timestamp: '2025-10-28 13:45', priority: 'منخفض' },
      { id: 4, type: 'معلومات', message: 'بدء الصيانة المجدولة لمحطة 2', timestamp: '2025-10-28 16:00', priority: 'منخفض' }
    ],
    kpis: [
      { title: 'الإنتاج الشهري', value: '1580', unit: 'وحدة', change: '+2.3%', trend: 'up' },
      { title: 'وقت الدورة', value: '4.2', unit: 'ساعات', change: '-8.1%', trend: 'down' },
      { title: 'تكلفة الوحدة', value: '125', unit: 'ريال', change: '-2.7%', trend: 'down' },
      { title: 'الإنتاجية', value: '87.5', unit: '%', change: '+1.8%', trend: 'up' }
    ],
    recentActivities: [
      { id: 1, action: 'تم إكمال أمر الإنتاج PO-2025-045', user: 'أحمد محمد', time: '2025-10-28 16:15' },
      { id: 2, action: 'تم بدء خط الإنتاج 1', user: 'سارة أحمد', time: '2025-10-28 16:00' },
      { id: 3, action: 'تم اكتشاف عيب في المنتج أ', user: 'محمد علي', time: '2025-10-28 15:45' },
      { id: 4, action: 'تم تحديث قائمة المواد BOM-003', user: 'علي حسن', time: '2025-10-28 15:30' },
      { id: 5, action: 'تم جدولة أمر إنتاج جديد PO-2025-046', user: 'خالد محمود', time: '2025-10-28 15:15' }
    ]
  };

  const timeRanges = ['اليوم', 'أسبوع', 'شهر', 'ربع سنوي', 'سنة'];
  const priorityLevels = {
    'عالي': 'text-red-600 bg-red-100',
    'متوسط': 'text-yellow-600 bg-yellow-100',
    'منخفض': 'text-green-600 bg-green-100',
    'تحذير': 'text-orange-600 bg-orange-100',
    'خطأ': 'text-red-600 bg-red-100',
    'معلومات': 'text-blue-600 bg-blue-100'
  };

  useEffect(() => {
    setDashboardData(mockDashboardData);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // محاكاة تحديث البيانات
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const getStatusColor = (status) => {
    const colors = {
      'نشط': 'text-green-600 bg-green-100',
      'متوقف': 'text-red-600 bg-red-100',
      'تحذير': 'text-yellow-600 bg-yellow-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  const getPriorityColor = (priority) => {
    return priorityLevels[priority] || 'text-gray-600 bg-gray-100';
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <ArrowUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <ArrowDown className="w-4 h-4 text-red-600" />;
    return null;
  };

  const getTrendColor = (trend) => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('ar-SA').format(num);
  };

  const StatCard = ({ title, value, unit, change, trend, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <div className={`flex items-center space-x-1 space-x-reverse text-sm ${getTrendColor(trend)}`}>
            {getTrendIcon(trend)}
            <span>{change}</span>
          </div>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-800">
          {value}{unit && <span className="text-sm font-normal text-gray-500 mr-1">{unit}</span>}
        </div>
        <div className="text-sm text-gray-600">{title}</div>
      </div>
    </div>
  );

  const AlertCard = ({ alert }) => (
    <div className={`p-4 rounded-lg border-l-4 ${
      alert.type === 'خطأ' ? 'border-red-500 bg-red-50' :
      alert.type === 'تحذير' ? 'border-yellow-500 bg-yellow-50' :
      'border-blue-500 bg-blue-50'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2 space-x-reverse">
          {alert.type === 'خطأ' ? <AlertTriangle className="w-5 h-5 text-red-600" /> :
           alert.type === 'تحذير' ? <AlertTriangle className="w-5 h-5 text-yellow-600" /> :
           <CheckCircle className="w-5 h-5 text-blue-600" />}
          <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(alert.priority)}`}>
            {alert.priority}
          </span>
        </div>
        <span className="text-xs text-gray-500">{alert.timestamp}</span>
      </div>
      <p className="text-gray-800">{alert.message}</p>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3 space-x-reverse">
          <BarChart3 className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">لوحة تحكم التصنيع</h1>
        </div>
        <div className="flex items-center space-x-4 space-x-reverse">
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            {timeRanges.map(range => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 space-x-reverse transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>تحديث</span>
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 space-x-reverse transition-colors">
            <Download className="w-5 h-5" />
            <span>تصدير</span>
          </button>
        </div>
      </div>

      {/* مؤشرات الأداء الرئيسية */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="إجمالي الأوامر"
          value={formatNumber(dashboardData.overview?.totalOrders || 0)}
          icon={ClipboardList}
          color="bg-blue-500"
        />
        <StatCard
          title="الأوامر النشطة"
          value={formatNumber(dashboardData.overview?.activeOrders || 0)}
          icon={Activity}
          color="bg-green-500"
        />
        <StatCard
          title="كفاءة الإنتاج"
          value={dashboardData.overview?.productionEfficiency || 0}
          unit="%"
          change="+1.8%"
          trend="up"
          icon={TrendingUp}
          color="bg-purple-500"
        />
        <StatCard
          title="نقاط الجودة"
          value={dashboardData.overview?.qualityScore || 0}
          unit="%"
          change="-0.3%"
          trend="down"
          icon={Award}
          color="bg-orange-500"
        />
      </div>

      {/* مؤشرات إضافية */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="التسليم في الوقت"
          value={dashboardData.overview?.onTimeDelivery || 0}
          unit="%"
          change="+2.1%"
          trend="up"
          icon={Target}
          color="bg-indigo-500"
        />
        <StatCard
          title="فعالية المعدات"
          value={dashboardData.overview?.overallEquipmentEffectiveness || 0}
          unit="%"
          change="-1.2%"
          trend="down"
          icon={Settings}
          color="bg-red-500"
        />
        <StatCard
          title="الأوامر المكتملة"
          value={formatNumber(dashboardData.overview?.completedOrders || 0)}
          change="+5.2%"
          trend="up"
          icon={CheckCircle}
          color="bg-teal-500"
        />
        <StatCard
          title="الأوامر المتأخرة"
          value={formatNumber(dashboardData.overview?.delayedOrders || 0)}
          change="-15.8%"
          trend="down"
          icon={Clock}
          color="bg-pink-500"
        />
      </div>

      {/* الرسوم البيانية والأقسام */}
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* اتجاهات الإنتاج */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">اتجاهات الإنتاج</h2>
            <div className="flex space-x-2 space-x-reverse text-sm">
              <div className="flex items-center space-x-1 space-x-reverse">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>المخطط</span>
              </div>
              <div className="flex items-center space-x-1 space-x-reverse">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>الفعلي</span>
              </div>
            </div>
          </div>
          
          <div className="h-64 relative">
            {/* رسم بياني مبسط */}
            <div className="absolute inset-0 flex items-end justify-between">
              {dashboardData.productionTrends?.slice(-6).map((item, index) => (
                <div key={item.month} className="flex flex-col items-center flex-1">
                  <div className="w-full max-w-8 mb-2">
                    <div className="bg-gray-200 rounded h-32 relative overflow-hidden">
                      <div 
                        className="absolute bottom-0 w-full bg-green-500 rounded-t"
                        style={{ height: `${(item.actual / 1600) * 100}%` }}
                      ></div>
                      <div 
                        className="absolute bottom-0 w-full bg-blue-200 rounded-t opacity-50"
                        style={{ height: `${(item.planned / 1600) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-600">{item.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ملخص الكفاءة */}
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            {dashboardData.productionTrends?.slice(-3).map((item, index) => (
              <div key={item.month} className="p-3 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">{item.month}</div>
                <div className="text-lg font-semibold text-green-600">{item.efficiency}%</div>
                <div className="text-xs text-gray-500">كفاءة</div>
              </div>
            ))}
          </div>
        </div>

        {/* حالة الأوامر */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">حالة الأوامر</h2>
          
          <div className="space-y-4">
            {dashboardData.orderStatus?.map((status, index) => (
              <div key={status.status} className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className={`w-4 h-4 rounded ${status.color}`}></div>
                  <span className="text-sm font-medium">{status.status}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{status.count}</div>
                  <div className="text-xs text-gray-500">{status.percentage.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>

          {/* رسم بياني دائري مبسط */}
          <div className="mt-6 relative">
            <div className="w-24 h-24 mx-auto rounded-full border-8 border-gray-200 relative overflow-hidden">
              {dashboardData.orderStatus?.map((status, index) => {
                const rotation = dashboardData.orderStatus
                  .slice(0, index)
                  .reduce((sum, s) => sum + (s.percentage * 3.6), 0);
                return (
                  <div
                    key={status.status}
                    className={`absolute inset-0 ${status.color} rounded-full`}
                    style={{
                      clipPath: `conic-gradient(from ${rotation}deg, transparent ${status.percentage * 3.6}deg, ${status.color} 0deg)`
                    }}
                  ></div>
                );
              })}
            </div>
            <div className="text-center mt-2">
              <div className="text-lg font-bold">{dashboardData.overview?.totalOrders}</div>
              <div className="text-xs text-gray-500">إجمالي</div>
            </div>
          </div>
        </div>
      </div>

      {/* مؤشرات الجودة والحالة البيئية */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* مؤشرات الجودة */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">مؤشرات الجودة</h2>
          
          <div className="space-y-4">
            {dashboardData.qualityMetrics?.map((metric, index) => (
              <div key={metric.metric} className="flex items-center justify-between p-4 bg-gray-50 rounded">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">{metric.metric}</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">
                    {metric.value}{metric.unit && <span className="text-sm text-gray-500 mr-1">{metric.unit}</span>}
                  </div>
                  <div className="text-xs text-gray-500">الهدف: {metric.target}{metric.unit}</div>
                </div>
                <div className={`flex items-center space-x-1 space-x-reverse ${getTrendColor(metric.trend)}`}>
                  {getTrendIcon(metric.trend)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* حالة المعدات */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">حالة المعدات</h2>
          
          <div className="space-y-3">
            {dashboardData.equipmentStatus?.map((equipment, index) => (
              <div key={equipment.name} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Factory className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">{equipment.name}</span>
                  {equipment.alerts > 0 && (
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <span className="text-xs text-yellow-600">{equipment.alerts}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-4 space-x-reverse">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(equipment.status)}`}>
                    {equipment.status}
                  </span>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{equipment.utilization}%</div>
                    <div className="text-xs text-gray-500">استخدام</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{equipment.efficiency}%</div>
                    <div className="text-xs text-gray-500">كفاءة</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* مؤشرات الأداء الرئيسية والتنبيهات */}
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* مؤشرات KPI */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">مؤشرات الأداء الرئيسية</h2>
          
          <div className="space-y-4">
            {dashboardData.kpis?.map((kpi, index) => (
              <div key={kpi.title} className="p-4 bg-gray-50 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{kpi.title}</span>
                  <div className={`flex items-center space-x-1 space-x-reverse text-sm ${getTrendColor(kpi.trend)}`}>
                    {getTrendIcon(kpi.trend)}
                    <span>{kpi.change}</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {kpi.value}<span className="text-sm font-normal text-gray-500 mr-1">{kpi.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* التنبيهات والتحذيرات */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">التنبيهات والتحذيرات</h2>
            <span className="text-sm text-gray-500">
              {dashboardData.alerts?.length || 0} تنبيه
            </span>
          </div>
          
          <div className="space-y-3">
            {dashboardData.alerts?.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </div>
      </div>

      {/* الأنشطة الأخيرة */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">الأنشطة الأخيرة</h2>
        
        <div className="space-y-3">
          {dashboardData.recentActivities?.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 space-x-reverse p-3 border rounded">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <div className="text-gray-800">{activity.action}</div>
                <div className="text-sm text-gray-500">
                  بواسطة {activity.user} في {activity.time}
                </div>
              </div>
              <div className="flex space-x-2 space-x-reverse">
                <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* شريط الحالة السفلي */}
      <div className="mt-8 bg-gray-100 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6 space-x-reverse">
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>النظام يعمل بشكل طبيعي</span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>آخر تحديث: {new Date().toLocaleString('ar-SA')}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Battery className="w-4 h-4 text-green-500" />
              <span>النظام مستقر</span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Thermometer className="w-4 h-4 text-blue-500" />
              <span>22°م</span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Droplets className="w-4 h-4 text-blue-500" />
              <span>45%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManufacturingDashboard;