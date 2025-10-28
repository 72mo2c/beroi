import React, { useState, useEffect } from 'react';
import { 
  Calendar, Plus, Search, Filter, BarChart3, Clock, Users, 
  Factory, TrendingUp, AlertCircle, CheckCircle, RefreshCw,
  Play, Pause, Edit, X, Settings, Download, Upload, Eye,
  Zap, Target, Activity, Timer, Layers, ArrowRight
} from 'lucide-react';

const ProductionPlanning = () => {
  const [planningData, setPlanningData] = useState([]);
  const [viewMode, setViewMode] = useState('قائمة'); // قائمة، تقويم، جانت
  const [selectedPeriod, setSelectedPeriod] = useState('أسبوع');
  const [selectedWorkstation, setSelectedWorkstation] = useState('الكل');
  const [showCapacityPlan, setShowCapacityPlan] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // محاكاة البيانات
  const mockPlanningData = [
    {
      id: 1,
      orderNumber: 'PO-2025-001',
      productName: 'منتج أ',
      quantity: 100,
      priority: 'عالي',
      status: 'مجدول',
      workstation: 'خط الإنتاج 1',
      scheduledStart: '2025-10-25 08:00',
      scheduledEnd: '2025-10-30 16:00',
      estimatedHours: 40,
      operators: ['أحمد محمد', 'سارة أحمد'],
      operations: [
        { name: 'تركيب لوحة الدائرة', duration: 16.7, workstation: 'محطة 1' },
        { name: 'تركيب المعالج', duration: 25, workstation: 'محطة 2' },
        { name: 'اختبار أولي', duration: 13.3, workstation: 'محطة الاختبار' },
        { name: 'التغليف', duration: 10, workstation: 'محطة التغليف' }
      ],
      materialsRequired: [
        { name: 'لوحة الدائرة', quantity: 100, available: 120 },
        { name: 'المعالج', quantity: 100, available: 100 },
        { name: 'الذاكرة', quantity: 200, available: 250 },
        { name: 'الغلاف الخارجي', quantity: 100, available: 150 }
      ],
      bottleneck: false,
      conflict: false,
      resourceUtilization: 85
    },
    {
      id: 2,
      orderNumber: 'PO-2025-002',
      productName: 'منتج ب',
      quantity: 50,
      priority: 'متوسط',
      status: 'قيد التخطيط',
      workstation: 'خط الإنتاج 2',
      scheduledStart: '2025-11-01 08:00',
      scheduledEnd: '2025-11-05 16:00',
      estimatedHours: 30,
      operators: ['محمد علي', 'خالد محمود'],
      operations: [
        { name: 'تجميع الهيكل', duration: 20, workstation: 'خط الإنتاج 2' },
        { name: 'تركيب المحرك', duration: 30, workstation: 'خط الإنتاج 2' },
        { name: 'توصيل نظام التحكم', duration: 15, workstation: 'محطة التحكم' },
        { name: 'اختبار نهائي', duration: 10, workstation: 'محطة الاختبار' }
      ],
      materialsRequired: [
        { name: 'الإطار المعدني', quantity: 50, available: 60 },
        { name: 'المحرك', quantity: 50, available: 50 },
        { name: 'نظام التحكم', quantity: 50, available: 55 },
        { name: 'الأجزاء البلاستيكية', quantity: 400, available: 450 }
      ],
      bottleneck: false,
      conflict: false,
      resourceUtilization: 70
    },
    {
      id: 3,
      orderNumber: 'PO-2025-003',
      productName: 'منتج ج',
      quantity: 200,
      priority: 'عالي',
      status: 'مجدول',
      workstation: 'خط الإنتاج 3',
      scheduledStart: '2025-10-28 08:00',
      scheduledEnd: '2025-11-10 16:00',
      estimatedHours: 80,
      operators: ['علي حسن', 'نور الدين', 'سعد أحمد'],
      operations: [
        { name: 'تجهيز المواد', duration: 32, workstation: 'خط الإنتاج 3' },
        { name: 'التجميع', duration: 128, workstation: 'خط الإنتاج 3' },
        { name: 'الاختبار', duration: 64, workstation: 'محطة الاختبار' },
        { name: 'التغليف', duration: 32, workstation: 'محطة التغليف' }
      ],
      materialsRequired: [
        { name: 'المكونات الإلكترونية', quantity: 200, available: 150 },
        { name: 'الإطار', quantity: 200, available: 200 },
        { name: 'الكابلات', quantity: 1000, available: 800 }
      ],
      bottleneck: true,
      conflict: true,
      resourceUtilization: 95
    },
    {
      id: 4,
      orderNumber: 'PO-2025-004',
      productName: 'منتج د',
      quantity: 75,
      priority: 'متوسط',
      status: 'مكتمل',
      workstation: 'خط الإنتاج 1',
      scheduledStart: '2025-10-20 08:00',
      scheduledEnd: '2025-10-24 16:00',
      estimatedHours: 32,
      operators: ['أحمد محمد', 'سارة أحمد'],
      operations: [
        { name: 'تجهيز المواد', duration: 8, workstation: 'خط الإنتاج 1' },
        { name: 'التجميع', duration: 24, workstation: 'خط الإنتاج 1' },
        { name: 'الاختبار', duration: 16, workstation: 'محطة الاختبار' }
      ],
      materialsRequired: [
        { name: 'القطع الإلكترونية', quantity: 75, available: 80 },
        { name: 'الهيكل', quantity: 75, available: 75 }
      ],
      bottleneck: false,
      conflict: false,
      resourceUtilization: 88
    }
  ];

  const workstations = [
    'الكل',
    'خط الإنتاج 1',
    'خط الإنتاج 2',
    'خط الإنتاج 3',
    'محطة 1',
    'محطة 2',
    'محطة الاختبار',
    'محطة التحكم',
    'محطة التغليف'
  ];

  const periods = ['يوم', 'أسبوع', 'شهر', 'ربع سنوي'];
  const viewModes = [
    { value: 'قائمة', label: 'عرض القائمة' },
    { value: 'تقويم', label: 'عرض التقويم' },
    { value: 'جانت', label: 'مخطط جانت' }
  ];

  useEffect(() => {
    setPlanningData(mockPlanningData);
  }, []);

  const filteredPlanningData = planningData.filter(item => {
    const matchesSearch = 
      item.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.workstation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesWorkstation = selectedWorkstation === 'الكل' || item.workstation === selectedWorkstation;
    
    return matchesSearch && matchesWorkstation;
  });

  const getStatusColor = (status) => {
    const colors = {
      'مجدول': 'bg-blue-100 text-blue-800',
      'قيد التخطيط': 'bg-yellow-100 text-yellow-800',
      'قيد التنفيذ': 'bg-orange-100 text-orange-800',
      'مكتمل': 'bg-green-100 text-green-800',
      'متوقف': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'عالي': 'text-red-600',
      'متوسط': 'text-yellow-600',
      'منخفض': 'text-green-600'
    };
    return colors[priority] || 'text-gray-600';
  };

  const getUtilizationColor = (utilization) => {
    if (utilization >= 90) return 'text-red-600';
    if (utilization >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getCapacityInfo = () => {
    const totalCapacity = 480; // 8 ساعات × 5 أيام × 12 محطة
    const usedCapacity = filteredPlanningData.reduce((sum, item) => sum + item.estimatedHours, 0);
    const utilization = (usedCapacity / totalCapacity) * 100;
    
    return {
      totalCapacity,
      usedCapacity,
      utilization,
      availableCapacity: totalCapacity - usedCapacity
    };
  };

  const getBottlenecks = () => {
    return filteredPlanningData.filter(item => item.bottleneck || item.resourceUtilization > 90);
  };

  const getConflicts = () => {
    return filteredPlanningData.filter(item => item.conflict);
  };

  const capacityInfo = getCapacityInfo();
  const bottlenecks = getBottlenecks();
  const conflicts = getConflicts();

  const generateSchedule = () => {
    // محاكاة إنشاء جدولة تلقائية
    const autoSchedule = planningData.map(item => ({
      ...item,
      status: 'مجدول',
      scheduledStart: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      scheduledEnd: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    }));
    setPlanningData(autoSchedule);
  };

  const optimizeSchedule = () => {
    // محاكاة تحسين الجدولة
    const optimized = [...planningData].sort((a, b) => {
      // ترتيب حسب الأولوية ثم تاريخ البداية
      if (a.priority !== b.priority) {
        const priorityOrder = { 'عالي': 3, 'متوسط': 2, 'منخفض': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return new Date(a.scheduledStart) - new Date(b.scheduledStart);
    });
    setPlanningData(optimized);
  };

  const exportPlanning = () => {
    const planningExport = {
      data: filteredPlanningData,
      capacityInfo,
      generatedDate: new Date().toISOString(),
      period: selectedPeriod,
      workstation: selectedWorkstation
    };
    
    const dataStr = JSON.stringify(planningExport, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `ProductionPlanning_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const ListView = () => (
    <div className="grid gap-4">
      {filteredPlanningData.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{item.orderNumber}</h3>
                <p className="text-gray-600">{item.productName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 space-x-reverse">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                {item.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(item.priority)}`}>
                {item.priority}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{item.quantity}</div>
              <div className="text-sm text-gray-500">الكمية</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{item.estimatedHours}</div>
              <div className="text-sm text-gray-500">ساعات مقدرة</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{item.operators.length}</div>
              <div className="text-sm text-gray-500">المشغلين</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getUtilizationColor(item.resourceUtilization)}`}>
                {item.resourceUtilization}%
              </div>
              <div className="text-sm text-gray-500">استغلال الموارد</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-600">
              <div className="flex items-center space-x-1 space-x-reverse">
                <Factory className="w-4 h-4" />
                <span>{item.workstation}</span>
              </div>
              <div className="flex items-center space-x-1 space-x-reverse">
                <Clock className="w-4 h-4" />
                <span>{item.scheduledStart}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              {item.bottleneck && (
                <div className="flex items-center space-x-1 space-x-reverse text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs">عنق زجاجة</span>
                </div>
              )}
              {item.conflict && (
                <div className="flex items-center space-x-1 space-x-reverse text-orange-600">
                  <Zap className="w-4 h-4" />
                  <span className="text-xs">تضارب</span>
                </div>
              )}
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Eye className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* شريط التقدم للموارد */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>استغلال الموارد</span>
              <span>{item.resourceUtilization}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  item.resourceUtilization > 90 ? 'bg-red-500' :
                  item.resourceUtilization > 75 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${item.resourceUtilization}%` }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const CalendarView = () => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="grid grid-cols-7 gap-2">
        {/* عناوين الأيام */}
        {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map(day => (
          <div key={day} className="p-2 text-center font-medium text-gray-600 bg-gray-50 rounded">
            {day}
          </div>
        ))}
        
        {/* خلايا التقويم */}
        {Array.from({ length: 35 }, (_, i) => (
          <div key={i} className="border border-gray-200 min-h-[120px] p-2">
            <div className="text-sm text-gray-500 mb-2">{i + 1}</div>
            {filteredPlanningData
              .filter(item => {
                const startDate = new Date(item.scheduledStart);
                return startDate.getDate() === i + 1;
              })
              .map(item => (
                <div 
                  key={item.id}
                  className="text-xs p-1 rounded mb-1 bg-blue-100 text-blue-800 truncate"
                  title={`${item.orderNumber} - ${item.productName}`}
                >
                  {item.orderNumber}
                </div>
              ))
            }
          </div>
        ))}
      </div>
    </div>
  );

  const GanttView = () => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-12 gap-1 mb-4 text-sm font-medium text-gray-600">
            <div className="col-span-3">العملية</div>
            <div className="col-span-2">محطة العمل</div>
            <div className="col-span-2">الوقت المقدرة</div>
            <div className="col-span-5">
              <div className="text-center">الجدولة</div>
            </div>
          </div>
          
          {filteredPlanningData.map((item) => (
            <div key={item.id} className="mb-4">
              <div className="grid grid-cols-12 gap-1 items-center py-2">
                <div className="col-span-3">
                  <div className="font-medium">{item.orderNumber}</div>
                  <div className="text-sm text-gray-600">{item.productName}</div>
                </div>
                <div className="col-span-2">{item.workstation}</div>
                <div className="col-span-2">{item.estimatedHours} ساعة</div>
                <div className="col-span-5 relative">
                  <div className="bg-gray-200 h-6 rounded relative">
                    <div 
                      className="bg-blue-500 h-6 rounded transition-all duration-300"
                      style={{ 
                        width: `${(item.estimatedHours / 40) * 100}%`,
                        marginLeft: '20%'
                      }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
                      {item.scheduledStart}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3 space-x-reverse">
          <Calendar className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">تخطيط الإنتاج</h1>
        </div>
        <div className="flex space-x-3 space-x-reverse">
          <button
            onClick={exportPlanning}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 space-x-reverse transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>تصدير</span>
          </button>
          <button
            onClick={optimizeSchedule}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 space-x-reverse transition-colors"
          >
            <Target className="w-5 h-5" />
            <span>تحسين الجدولة</span>
          </button>
          <button
            onClick={generateSchedule}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 space-x-reverse transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            <span>إنشاء تلقائي</span>
          </button>
        </div>
      </div>

      {/* لوحة المعلومات */}
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Factory className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{filteredPlanningData.length}</div>
              <div className="text-sm text-gray-600">إجمالي العمليات</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="p-3 bg-green-100 rounded-lg">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{capacityInfo.utilization.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">استغلال السعة</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{bottlenecks.length}</div>
              <div className="text-sm text-gray-600">عنق الزجاجة</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="p-3 bg-red-100 rounded-lg">
              <Zap className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{conflicts.length}</div>
              <div className="text-sm text-gray-600">التضاربات</div>
            </div>
          </div>
        </div>
      </div>

      {/* شريط البحث والفلاتر */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="البحث في التخطيط..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            value={selectedWorkstation}
            onChange={(e) => setSelectedWorkstation(e.target.value)}
          >
            {workstations.map(workstation => (
              <option key={workstation} value={workstation}>{workstation}</option>
            ))}
          </select>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            {periods.map(period => (
              <option key={period} value={period}>{period}</option>
            ))}
          </select>
          <div className="flex space-x-1 space-x-reverse">
            {viewModes.map(mode => (
              <button
                key={mode.value}
                onClick={() => setViewMode(mode.value)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  viewMode === mode.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* عرض البيانات حسب النمط المختار */}
      {viewMode === 'قائمة' && <ListView />}
      {viewMode === 'تقويم' && <CalendarView />}
      {viewMode === 'جانت' && <GanttView />}

      {/* نافذة تخطيط السعة */}
      {showCapacityPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">تخطيط السعة</h2>
                <button
                  onClick={() => setShowCapacityPlan(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">إجمالي السعة</h3>
                  <div className="text-2xl font-bold text-blue-600">{capacityInfo.totalCapacity} ساعة</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-2">السعة المستخدمة</h3>
                  <div className="text-2xl font-bold text-yellow-600">{capacityInfo.usedCapacity} ساعة</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">السعة المتاحة</h3>
                  <div className="text-2xl font-bold text-green-600">{capacityInfo.availableCapacity} ساعة</div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border-b border-gray-200 px-4 py-2 text-right">محطة العمل</th>
                      <th className="border-b border-gray-200 px-4 py-2 text-right">السعة الأسبوعية</th>
                      <th className="border-b border-gray-200 px-4 py-2 text-right">المجدولة</th>
                      <th className="border-b border-gray-200 px-4 py-2 text-right">نسبة الاستغلال</th>
                      <th className="border-b border-gray-200 px-4 py-2 text-right">الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workstations.slice(1).map((workstation, index) => (
                      <tr key={workstation}>
                        <td className="border-b border-gray-200 px-4 py-2">{workstation}</td>
                        <td className="border-b border-gray-200 px-4 py-2">40 ساعة</td>
                        <td className="border-b border-gray-200 px-4 py-2">
                          {Math.floor(Math.random() * 35) + 5} ساعة
                        </td>
                        <td className="border-b border-gray-200 px-4 py-2">
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }}
                              ></div>
                            </div>
                            <span>{Math.floor(Math.random() * 40) + 60}%</span>
                          </div>
                        </td>
                        <td className="border-b border-gray-200 px-4 py-2">
                          <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                            متاح
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* نافذة الجدولة التفصيلية */}
      {showSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">الجدولة التفصيلية</h2>
                <button
                  onClick={() => setShowSchedule(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border-b border-gray-200 px-4 py-2 text-right">رقم الأمر</th>
                      <th className="border-b border-gray-200 px-4 py-2 text-right">المنتج</th>
                      <th className="border-b border-gray-200 px-4 py-2 text-right">الكمية</th>
                      <th className="border-b border-gray-200 px-4 py-2 text-right">البداية</th>
                      <th className="border-b border-gray-200 px-4 py-2 text-right">النهاية</th>
                      <th className="border-b border-gray-200 px-4 py-2 text-right">محطة العمل</th>
                      <th className="border-b border-gray-200 px-4 py-2 text-right">المشغلين</th>
                      <th className="border-b border-gray-200 px-4 py-2 text-right">العمليات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlanningData.map((item) => (
                      <tr key={item.id}>
                        <td className="border-b border-gray-200 px-4 py-2 font-medium">{item.orderNumber}</td>
                        <td className="border-b border-gray-200 px-4 py-2">{item.productName}</td>
                        <td className="border-b border-gray-200 px-4 py-2">{item.quantity}</td>
                        <td className="border-b border-gray-200 px-4 py-2">{item.scheduledStart}</td>
                        <td className="border-b border-gray-200 px-4 py-2">{item.scheduledEnd}</td>
                        <td className="border-b border-gray-200 px-4 py-2">{item.workstation}</td>
                        <td className="border-b border-gray-200 px-4 py-2">
                          <div className="flex flex-wrap gap-1">
                            {item.operators.map((operator, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 rounded text-xs">
                                {operator}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="border-b border-gray-200 px-4 py-2">
                          <div className="flex flex-wrap gap-1">
                            {item.operations.map((operation, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 rounded text-xs">
                                {operation.name}
                              </span>
                            ))}
                          </div>
                        </td>
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

export default ProductionPlanning;