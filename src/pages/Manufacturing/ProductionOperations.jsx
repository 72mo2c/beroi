import React, { useState, useEffect } from 'react';
import { 
  Settings, Play, Pause, Square, RotateCcw, Clock, Users, 
  Factory, Activity, TrendingUp, AlertCircle, CheckCircle,
  Timer, BarChart3, Zap, Target, Eye, Edit, Plus,
  Settings as SettingsIcon, Download, Upload, RefreshCw,
  ArrowRight, ArrowLeft, Calendar, User, FileText,
  AlertTriangle, PauseCircle, PlayCircle, StopCircle
} from 'lucide-react';

const ProductionOperations = () => {
  const [operations, setOperations] = useState([]);
  const [workstations, setWorkstations] = useState([]);
  const [operators, setOperators] = useState([]);
  const [selectedWorkstation, setSelectedWorkstation] = useState('الكل');
  const [selectedOperator, setSelectedOperator] = useState('الكل');
  const [viewMode, setViewMode] = useState('الكل');
  const [showOperationDetails, setShowOperationDetails] = useState(false);
  const [currentOperation, setCurrentOperation] = useState(null);
  const [performanceData, setPerformanceData] = useState({});

  // محاكاة البيانات
  const mockOperations = [
    {
      id: 1,
      orderNumber: 'PO-2025-001',
      productName: 'منتج أ',
      operationName: 'تركيب لوحة الدائرة',
      workstation: 'محطة 1',
      operator: 'أحمد محمد',
      status: 'قيد التنفيذ',
      priority: 'عالي',
      startTime: '2025-10-25 08:00',
      estimatedDuration: 1000,
      actualDuration: 650,
      progress: 65,
      temperature: 22,
      humidity: 45,
      energyConsumption: 2.3,
      qualityScore: 95,
      nextStep: 'تركيب المعالج',
      notes: 'العملية تسير بشكل طبيعي',
      alerts: [],
      materials: [
        { name: 'لوحة الدائرة', required: 1, consumed: 1, status: 'مستخدم' },
        { name: 'لحام', required: 10, consumed: 6.5, status: 'جاري الاستخدام' }
      ]
    },
    {
      id: 2,
      orderNumber: 'PO-2025-001',
      productName: 'منتج أ',
      operationName: 'تركيب المعالج',
      workstation: 'محطة 2',
      operator: 'سارة أحمد',
      status: 'في الانتظار',
      priority: 'عالي',
      startTime: '',
      estimatedDuration: 1500,
      actualDuration: 0,
      progress: 0,
      temperature: 20,
      humidity: 42,
      energyConsumption: 0,
      qualityScore: 0,
      nextStep: 'اختبار أولي',
      notes: 'في انتظار اكتمال العملية السابقة',
      alerts: [],
      materials: [
        { name: 'المعالج', required: 1, consumed: 0, status: 'جاهز' },
        { name: 'معجون حراري', required: 1, consumed: 0, status: 'متوفر' }
      ]
    },
    {
      id: 3,
      orderNumber: 'PO-2025-002',
      productName: 'منتج ب',
      operationName: 'تجميع الهيكل',
      workstation: 'خط الإنتاج 2',
      operator: 'محمد علي',
      status: 'مكتمل',
      priority: 'متوسط',
      startTime: '2025-10-20 08:00',
      estimatedDuration: 1800,
      actualDuration: 1800,
      progress: 100,
      temperature: 21,
      humidity: 40,
      energyConsumption: 3.1,
      qualityScore: 98,
      nextStep: 'تركيب المحرك',
      notes: 'عملية مكتملة بنجاح',
      alerts: [],
      materials: [
        { name: 'الإطار المعدني', required: 1, consumed: 1, status: 'مستخدم' },
        { name: 'مسامير', required: 8, consumed: 8, status: 'مستخدم' }
      ]
    },
    {
      id: 4,
      orderNumber: 'PO-2025-003',
      productName: 'منتج ج',
      operationName: 'التجميع',
      workstation: 'خط الإنتاج 3',
      operator: 'خالد محمود',
      status: 'متوقف',
      priority: 'عالي',
      startTime: '2025-10-28 10:00',
      estimatedDuration: 9600,
      actualDuration: 2400,
      progress: 25,
      temperature: 35,
      humidity: 60,
      energyConsumption: 0,
      qualityScore: 0,
      nextStep: 'استكمال التجميع',
      notes: 'توقف بسبب مشكلة في المعدات',
      alerts: [
        { type: 'تحذير', message: 'درجة حرارة عالية', timestamp: '2025-10-28 14:30' },
        { type: 'خطأ', message: 'تعطل في آلة التجميع', timestamp: '2025-10-28 15:00' }
      ],
      materials: [
        { name: 'مكونات إلكترونية', required: 50, consumed: 12, status: 'نقص في المخزون' },
        { name: 'هيكل بلاستيكي', required: 50, consumed: 13, status: 'كافي' }
      ]
    },
    {
      id: 5,
      orderNumber: 'PO-2025-002',
      productName: 'منتج ب',
      operationName: 'اختبار نهائي',
      workstation: 'محطة الاختبار',
      operator: 'علي حسن',
      status: 'مكتمل',
      priority: 'عالي',
      startTime: '2025-10-24 14:00',
      estimatedDuration: 900,
      actualDuration: 840,
      progress: 100,
      temperature: 19,
      humidity: 38,
      energyConsumption: 1.8,
      qualityScore: 100,
      nextStep: 'التغليف',
      notes: 'جميع الاختبارات نجحت',
      alerts: [],
      materials: []
    }
  ];

  const mockWorkstations = [
    { id: 1, name: 'محطة 1', type: 'تركيب', capacity: 1, status: 'نشط', efficiency: 95 },
    { id: 2, name: 'محطة 2', type: 'تركيب', capacity: 1, status: 'نشط', efficiency: 88 },
    { id: 3, name: 'محطة 3', type: 'اختبار', capacity: 1, status: 'متوقف', efficiency: 0 },
    { id: 4, name: 'خط الإنتاج 1', type: 'تجميع', capacity: 3, status: 'نشط', efficiency: 92 },
    { id: 5, name: 'خط الإنتاج 2', type: 'تجميع', capacity: 2, status: 'نشط', efficiency: 90 },
    { id: 6, name: 'خط الإنتاج 3', type: 'تجميع', capacity: 4, status: 'تحذير', efficiency: 65 },
    { id: 7, name: 'محطة الاختبار', type: 'اختبار', capacity: 2, status: 'نشط', efficiency: 85 },
    { id: 8, name: 'محطة التحكم', type: 'تحكم', capacity: 1, status: 'نشط', efficiency: 98 },
    { id: 9, name: 'محطة التغليف', type: 'تغليف', capacity: 1, status: 'نشط', efficiency: 94 }
  ];

  const mockOperators = [
    { id: 1, name: 'أحمد محمد', shift: 'صباحي', workstation: 'محطة 1', efficiency: 95 },
    { id: 2, name: 'سارة أحمد', shift: 'صباحي', workstation: 'محطة 2', efficiency: 92 },
    { id: 3, name: 'محمد علي', shift: 'صباحي', workstation: 'خط الإنتاج 2', efficiency: 88 },
    { id: 4, name: 'علي حسن', shift: 'مسائي', workstation: 'محطة الاختبار', efficiency: 96 },
    { id: 5, name: 'خالد محمود', shift: 'صباحي', workstation: 'خط الإنتاج 3', efficiency: 85 },
    { id: 6, name: 'نور الدين', shift: 'مسائي', workstation: 'محطة التحكم', efficiency: 94 },
    { id: 7, name: 'سعد أحمد', shift: 'صباحي', workstation: 'خط الإنتاج 3', efficiency: 87 },
    { id: 8, name: 'فاطمة علي', shift: 'مسائي', workstation: 'محطة التغليف', efficiency: 93 }
  ];

  const mockPerformanceData = {
    totalOperations: 5,
    completed: 2,
    inProgress: 1,
    stopped: 1,
    waiting: 1,
    averageEfficiency: 87.5,
    totalEnergyConsumption: 7.2,
    qualityScore: 96.8,
    activeAlerts: 2
  };

  const statusOptions = [
    { value: 'في الانتظار', label: 'في الانتظار', color: 'bg-gray-100 text-gray-800', icon: Clock },
    { value: 'قيد التنفيذ', label: 'قيد التنفيذ', color: 'bg-blue-100 text-blue-800', icon: PlayCircle },
    { value: 'متوقف', label: 'متوقف', color: 'bg-red-100 text-red-800', icon: PauseCircle },
    { value: 'مكتمل', label: 'مكتمل', color: 'bg-green-100 text-green-800', icon: CheckCircle }
  ];

  const priorityOptions = [
    { value: 'عالي', label: 'عالي', color: 'text-red-600' },
    { value: 'متوسط', label: 'متوسط', color: 'text-yellow-600' },
    { value: 'منخفض', label: 'منخفض', color: 'text-green-600' }
  ];

  const viewModes = [
    { value: 'الكل', label: 'جميع العمليات' },
    { value: 'نشط', label: 'العمليات النشطة' },
    { value: 'متوقف', label: 'العمليات المتوقفة' },
    { value: 'مكتمل', label: 'العمليات المكتملة' }
  ];

  useEffect(() => {
    setOperations(mockOperations);
    setWorkstations(mockWorkstations);
    setOperators(mockOperators);
    setPerformanceData(mockPerformanceData);
  }, []);

  const filteredOperations = operations.filter(operation => {
    const matchesWorkstation = selectedWorkstation === 'الكل' || operation.workstation === selectedWorkstation;
    const matchesOperator = selectedOperator === 'الكل' || operation.operator === selectedOperator;
    
    let matchesViewMode = true;
    if (viewMode === 'نشط') {
      matchesViewMode = operation.status === 'قيد التنفيذ';
    } else if (viewMode === 'متوقف') {
      matchesViewMode = operation.status === 'متوقف';
    } else if (viewMode === 'مكتمل') {
      matchesViewMode = operation.status === 'مكتمل';
    }
    
    return matchesWorkstation && matchesOperator && matchesViewMode;
  });

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(s => s.value === status);
    return statusOption ? statusOption.color : 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const statusOption = statusOptions.find(s => s.value === status);
    const IconComponent = statusOption ? statusOption.icon : Clock;
    return <IconComponent className="w-5 h-5" />;
  };

  const getPriorityColor = (priority) => {
    const priorityOption = priorityOptions.find(p => p.value === priority);
    return priorityOption ? priorityOption.color : 'text-gray-600';
  };

  const getWorkstationStatusColor = (status) => {
    const colors = {
      'نشط': 'text-green-600',
      'متوقف': 'text-red-600',
      'تحذير': 'text-yellow-600'
    };
    return colors[status] || 'text-gray-600';
  };

  const handleStartOperation = (operationId) => {
    setOperations(operations.map(operation => 
      operation.id === operationId 
        ? { 
            ...operation, 
            status: 'قيد التنفيذ',
            startTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
            notes: 'بدء العملية'
          }
        : operation
    ));
  };

  const handlePauseOperation = (operationId) => {
    setOperations(operations.map(operation => 
      operation.id === operationId 
        ? { 
            ...operation, 
            status: 'متوقف',
            notes: 'توقف مؤقت'
          }
        : operation
    ));
  };

  const handleResumeOperation = (operationId) => {
    setOperations(operations.map(operation => 
      operation.id === operationId 
        ? { 
            ...operation, 
            status: 'قيد التنفيذ',
            notes: 'استئناف العملية'
          }
        : operation
    ));
  };

  const handleCompleteOperation = (operationId) => {
    setOperations(operations.map(operation => 
      operation.id === operationId 
        ? { 
            ...operation, 
            status: 'مكتمل',
            progress: 100,
            actualDuration: operation.estimatedDuration,
            notes: 'اكتمال العملية بنجاح'
          }
        : operation
    ));
  };

  const handleStopOperation = (operationId) => {
    setOperations(operations.map(operation => 
      operation.id === operationId 
        ? { 
            ...operation, 
            status: 'متوقف',
            notes: 'إيقاف العملية'
          }
        : operation
    ));
  };

  const viewOperationDetails = (operation) => {
    setCurrentOperation(operation);
    setShowOperationDetails(true);
  };

  const getOverallEfficiency = () => {
    const activeOperations = operations.filter(op => op.status === 'قيد التنفيذ');
    if (activeOperations.length === 0) return 0;
    
    const totalEfficiency = activeOperations.reduce((sum, op) => sum + op.qualityScore, 0);
    return (totalEfficiency / activeOperations.length).toFixed(1);
  };

  const getActiveOperationsCount = () => {
    return operations.filter(op => op.status === 'قيد التنفيذ').length;
  };

  const getStoppedOperationsCount = () => {
    return operations.filter(op => op.status === 'متوقف').length;
  };

  const getCompletedTodayCount = () => {
    const today = new Date().toISOString().split('T')[0];
    return operations.filter(op => 
      op.status === 'مكتمل' && op.startTime.startsWith(today)
    ).length;
  };

  const exportOperations = () => {
    const operationsExport = {
      operations: filteredOperations,
      workstations,
      operators,
      performanceData,
      exportedDate: new Date().toISOString(),
      exportedBy: 'المستخدم الحالي'
    };
    
    const dataStr = JSON.stringify(operationsExport, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `ProductionOperations_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const OperationsOverview = () => (
    <div className="grid md:grid-cols-4 gap-6 mb-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Activity className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{getActiveOperationsCount()}</div>
            <div className="text-sm text-gray-600">عمليات نشطة</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="p-3 bg-red-100 rounded-lg">
            <PauseCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{getStoppedOperationsCount()}</div>
            <div className="text-sm text-gray-600">عمليات متوقفة</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="p-3 bg-green-100 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{getCompletedTodayCount()}</div>
            <div className="text-sm text-gray-600">مكتملة اليوم</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="p-3 bg-purple-100 rounded-lg">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{getOverallEfficiency()}%</div>
            <div className="text-sm text-gray-600">الكفاءة الإجمالية</div>
          </div>
        </div>
      </div>
    </div>
  );

  const WorkstationsView = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workstations.map((workstation) => (
        <div key={workstation.id} className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">{workstation.name}</h3>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getWorkstationStatusColor(workstation.status)}`}>
              {workstation.status}
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">النوع:</span>
              <span className="font-medium">{workstation.type}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">السعة:</span>
              <span className="font-medium">{workstation.capacity}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">الكفاءة:</span>
              <span className="font-medium text-blue-600">{workstation.efficiency}%</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>مستوى الأداء</span>
              <span>{workstation.efficiency}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  workstation.efficiency > 90 ? 'bg-green-500' :
                  workstation.efficiency > 70 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${workstation.efficiency}%` }}
              ></div>
            </div>
          </div>

          <div className="mt-4 flex space-x-2 space-x-reverse">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors">
              إدارة
            </button>
            <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors">
              تفاصيل
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const OperationsView = () => (
    <div className="grid gap-6">
      {filteredOperations.map((operation) => (
        <div key={operation.id} className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4 space-x-reverse">
                {getStatusIcon(operation.status)}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{operation.operationName}</h3>
                  <p className="text-gray-600">{operation.orderNumber} - {operation.productName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(operation.status)}`}>
                  {statusOptions.find(s => s.value === operation.status)?.label}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(operation.priority)}`}>
                  {priorityOptions.find(p => p.value === operation.priority)?.label}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-5 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{operation.progress}%</div>
                <div className="text-sm text-gray-500">التقدم</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{operation.qualityScore || 0}</div>
                <div className="text-sm text-gray-500">نقاط الجودة</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{operation.temperature}°م</div>
                <div className="text-sm text-gray-500">درجة الحرارة</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{operation.humidity}%</div>
                <div className="text-sm text-gray-500">الرطوبة</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{operation.energyConsumption || 0}</div>
                <div className="text-sm text-gray-500">استهلاك الطاقة (kW)</div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-500">محطة العمل</div>
                <div className="font-medium flex items-center space-x-2 space-x-reverse">
                  <Factory className="w-4 h-4" />
                  <span>{operation.workstation}</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">المشغل</div>
                <div className="font-medium flex items-center space-x-2 space-x-reverse">
                  <User className="w-4 h-4" />
                  <span>{operation.operator}</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">الخطوة التالية</div>
                <div className="font-medium">{operation.nextStep}</div>
              </div>
            </div>

            {/* شريط التقدم */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>التقدم</span>
                <span>{operation.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${operation.progress}%` }}
                ></div>
              </div>
            </div>

            {/* التنبيهات */}
            {operation.alerts.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center space-x-2 space-x-reverse text-red-600 mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">تنبيهات حالية</span>
                </div>
                <div className="space-y-1">
                  {operation.alerts.map((alert, index) => (
                    <div key={index} className="text-sm text-red-700 bg-red-50 p-2 rounded">
                      {alert.message} - {alert.timestamp}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {operation.notes && (
              <div className="mb-4">
                <div className="text-sm text-gray-500">الملاحظات</div>
                <div className="text-gray-800">{operation.notes}</div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500">
                <div className="flex items-center space-x-1 space-x-reverse">
                  <Clock className="w-4 h-4" />
                  <span>وقت البدء: {operation.startTime || 'غير محدد'}</span>
                </div>
                <div className="flex items-center space-x-1 space-x-reverse">
                  <Timer className="w-4 h-4" />
                  <span>المدة: {operation.actualDuration}/{operation.estimatedDuration} دقيقة</span>
                </div>
              </div>
              <div className="flex space-x-2 space-x-reverse">
                {operation.status === 'في الانتظار' && (
                  <button
                    onClick={() => handleStartOperation(operation.id)}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="بدء العملية"
                  >
                    <Play className="w-5 h-5" />
                  </button>
                )}
                {operation.status === 'قيد التنفيذ' && (
                  <>
                    <button
                      onClick={() => handlePauseOperation(operation.id)}
                      className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                      title="إيقاف مؤقت"
                    >
                      <Pause className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleCompleteOperation(operation.id)}
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="إكمال العملية"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  </>
                )}
                {operation.status === 'متوقف' && (
                  <button
                    onClick={() => handleResumeOperation(operation.id)}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="استئناف العملية"
                  >
                    <Play className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => viewOperationDetails(operation)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="عرض التفاصيل"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3 space-x-reverse">
          <Settings className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">العمليات الإنتاجية</h1>
        </div>
        <div className="flex space-x-3 space-x-reverse">
          <button
            onClick={exportOperations}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 space-x-reverse transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>تصدير</span>
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 space-x-reverse transition-colors">
            <RefreshCw className="w-5 h-5" />
            <span>تحديث</span>
          </button>
        </div>
      </div>

      {/* نظرة عامة على الأداء */}
      <OperationsOverview />

      {/* شريط البحث والفلاتر */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex items-center space-x-4 space-x-reverse">
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            value={selectedWorkstation}
            onChange={(e) => setSelectedWorkstation(e.target.value)}
          >
            <option value="الكل">جميع محطات العمل</option>
            {workstations.map(workstation => (
              <option key={workstation.id} value={workstation.name}>{workstation.name}</option>
            ))}
          </select>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            value={selectedOperator}
            onChange={(e) => setSelectedOperator(e.target.value)}
          >
            <option value="الكل">جميع المشغلين</option>
            {operators.map(operator => (
              <option key={operator.id} value={operator.name}>{operator.name}</option>
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

      {/* عرض البيانات */}
      {selectedWorkstation === 'الكل' && selectedOperator === 'الكل' && viewMode === 'الكل' ? (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">محطات العمل</h2>
            <WorkstationsView />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">العمليات الحالية</h2>
            <OperationsView />
          </div>
        </div>
      ) : (
        <OperationsView />
      )}

      {/* نافذة تفاصيل العملية */}
      {showOperationDetails && currentOperation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  تفاصيل العملية - {currentOperation.operationName}
                </h2>
                <button
                  onClick={() => setShowOperationDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">معلومات العملية</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">رقم الطلب:</span> {currentOperation.orderNumber}</div>
                    <div><span className="text-gray-600">المنتج:</span> {currentOperation.productName}</div>
                    <div><span className="text-gray-600">محطة العمل:</span> {currentOperation.workstation}</div>
                    <div><span className="text-gray-600">المشغل:</span> {currentOperation.operator}</div>
                    <div><span className="text-gray-600">الأولوية:</span> {currentOperation.priority}</div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">حالة العملية</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">الحالة:</span> 
                      <span className={`mr-2 px-2 py-1 rounded text-xs ${getStatusColor(currentOperation.status)}`}>
                        {statusOptions.find(s => s.value === currentOperation.status)?.label}
                      </span>
                    </div>
                    <div><span className="text-gray-600">التقدم:</span> {currentOperation.progress}%</div>
                    <div><span className="text-gray-600">نقاط الجودة:</span> {currentOperation.qualityScore}</div>
                    <div><span className="text-gray-600">وقت البدء:</span> {currentOperation.startTime || 'غير محدد'}</div>
                    <div><span className="text-gray-600">الخطوة التالية:</span> {currentOperation.nextStep}</div>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">القياسات البيئية</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">درجة الحرارة:</span> {currentOperation.temperature}°م</div>
                    <div><span className="text-gray-600">الرطوبة:</span> {currentOperation.humidity}%</div>
                    <div><span className="text-gray-600">استهلاك الطاقة:</span> {currentOperation.energyConsumption} kW</div>
                    <div><span className="text-gray-600">المدة المقدرة:</span> {currentOperation.estimatedDuration} دقيقة</div>
                    <div><span className="text-gray-600">المدة الفعلية:</span> {currentOperation.actualDuration} دقيقة</div>
                  </div>
                </div>
              </div>

              {/* المواد */}
              {currentOperation.materials.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">استهلاك المواد</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="border-b border-gray-200 px-4 py-2 text-right">اسم المادة</th>
                          <th className="border-b border-gray-200 px-4 py-2 text-right">المطلوب</th>
                          <th className="border-b border-gray-200 px-4 py-2 text-right">المستهلك</th>
                          <th className="border-b border-gray-200 px-4 py-2 text-right">الحالة</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentOperation.materials.map((material, index) => (
                          <tr key={index}>
                            <td className="border-b border-gray-200 px-4 py-2">{material.name}</td>
                            <td className="border-b border-gray-200 px-4 py-2">{material.required}</td>
                            <td className="border-b border-gray-200 px-4 py-2">{material.consumed}</td>
                            <td className="border-b border-gray-200 px-4 py-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                material.status === 'مستخدم' ? 'bg-blue-100 text-blue-800' :
                                material.status === 'جاري الاستخدام' ? 'bg-yellow-100 text-yellow-800' :
                                material.status === 'كافي' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {material.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* التنبيهات */}
              {currentOperation.alerts.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">التنبيهات</h3>
                  <div className="space-y-2">
                    {currentOperation.alerts.map((alert, index) => (
                      <div key={index} className={`p-4 rounded-lg ${
                        alert.type === 'خطأ' ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
                      }`}>
                        <div className="flex items-center space-x-2 space-x-reverse mb-2">
                          {alert.type === 'خطأ' ? 
                            <AlertCircle className="w-5 h-5 text-red-600" /> : 
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                          }
                          <span className="font-medium">{alert.type}</span>
                          <span className="text-sm text-gray-500">{alert.timestamp}</span>
                        </div>
                        <p className="text-gray-800">{alert.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* الملاحظات */}
              {currentOperation.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">الملاحظات</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-800">{currentOperation.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionOperations;