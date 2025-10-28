import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, Plus, Search, Edit, Trash2, Save, X, Play, 
  Pause, CheckCircle, Clock, AlertTriangle, Calendar, User,
  Package, Settings, BarChart3, Filter, Download, Eye,
  Factory, Timer, TrendingUp, AlertCircle, PauseCircle
} from 'lucide-react';

const ProductionOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('الكل');
  const [currentForm, setCurrentForm] = useState({
    orderNumber: '',
    productName: '',
    quantity: 0,
    priority: 'متوسط',
    status: 'مجدول',
    scheduledStartDate: '',
    scheduledEndDate: '',
    actualStartDate: '',
    actualEndDate: '',
    assignedTo: '',
    workstation: '',
    estimatedHours: 0,
    actualHours: 0,
    bomId: '',
    notes: '',
    materials: [],
    operations: [],
    qualityChecks: [],
    progress: 0
  });

  // محاكاة البيانات
  const mockOrders = [
    {
      id: 1,
      orderNumber: 'PO-2025-001',
      productName: 'منتج أ',
      quantity: 100,
      priority: 'عالي',
      status: 'قيد التنفيذ',
      scheduledStartDate: '2025-10-25',
      scheduledEndDate: '2025-10-30',
      actualStartDate: '2025-10-25',
      actualEndDate: '',
      assignedTo: 'أحمد محمد',
      workstation: 'خط الإنتاج 1',
      estimatedHours: 40,
      actualHours: 25,
      bomId: 'BOM-001',
      notes: 'طلب عاجل من العميل',
      progress: 65,
      materials: [
        { id: 1, name: 'لوحة الدائرة الرئيسية', required: 100, consumed: 65, status: 'كافي' },
        { id: 2, name: 'المعالج', required: 100, consumed: 65, status: 'كافي' },
        { id: 3, name: 'الذاكرة', required: 200, consumed: 130, status: 'كافي' },
        { id: 4, name: 'الغلاف الخارجي', required: 100, consumed: 65, status: 'كافي' }
      ],
      operations: [
        { id: 1, name: 'تركيب لوحة الدائرة', scheduledTime: 1000, actualTime: 650, status: 'مكتملة' },
        { id: 2, name: 'تركيب المعالج', scheduledTime: 1500, actualTime: 975, status: 'قيد التنفيذ' },
        { id: 3, name: 'اختبار أولي', scheduledTime: 800, actualTime: 0, status: 'في الانتظار' },
        { id: 4, name: 'التغليف', scheduledTime: 600, actualTime: 0, status: 'في الانتظار' }
      ],
      qualityChecks: [
        { id: 1, operationId: 1, status: 'مpassed', inspector: 'سارة أحمد', date: '2025-10-25', notes: 'جميع الوحدات تعمل بشكل صحيح' },
        { id: 2, operationId: 2, status: 'قيد المراجعة', inspector: 'محمد علي', date: '', notes: '' }
      ],
      createdDate: '2025-10-20',
      lastModified: '2025-10-25'
    },
    {
      id: 2,
      orderNumber: 'PO-2025-002',
      productName: 'منتج ب',
      quantity: 50,
      priority: 'متوسط',
      status: 'مكتمل',
      scheduledStartDate: '2025-10-20',
      scheduledEndDate: '2025-10-25',
      actualStartDate: '2025-10-20',
      actualEndDate: '2025-10-24',
      assignedTo: 'سارة أحمد',
      workstation: 'خط الإنتاج 2',
      estimatedHours: 30,
      actualHours: 28,
      bomId: 'BOM-002',
      notes: 'إنتاج عادي',
      progress: 100,
      materials: [
        { id: 1, name: 'الإطار المعدني', required: 50, consumed: 50, status: 'مستهلك' },
        { id: 2, name: 'المحرك', required: 50, consumed: 50, status: 'مستهلك' },
        { id: 3, name: 'نظام التحكم', required: 50, consumed: 50, status: 'مستهلك' },
        { id: 4, name: 'الأجزاء البلاستيكية', required: 400, consumed: 400, status: 'مستهلك' }
      ],
      operations: [
        { id: 1, name: 'تجميع الهيكل', scheduledTime: 1800, actualTime: 1800, status: 'مكتملة' },
        { id: 2, name: 'تركيب المحرك', scheduledTime: 2700, actualTime: 2520, status: 'مكتملة' },
        { id: 3, name: 'توصيل نظام التحكم', scheduledTime: 1350, actualTime: 1260, status: 'مكتملة' },
        { id: 4, name: 'اختبار نهائي', scheduledTime: 900, actualTime: 840, status: 'مكتملة' }
      ],
      qualityChecks: [
        { id: 1, operationId: 1, status: 'مpassed', inspector: 'خالد محمود', date: '2025-10-20', notes: 'تجميع ممتاز' },
        { id: 2, operationId: 2, status: 'مpassed', inspector: 'علي حسن', date: '2025-10-21', notes: 'تركيب المحرك صحيح' },
        { id: 3, operationId: 3, status: 'مpassed', inspector: 'نور الدين', date: '2025-10-22', notes: 'نظام التحكم يعمل' },
        { id: 4, operationId: 4, status: 'مpassed', inspector: 'أحمد محمد', date: '2025-10-24', notes: 'جميع الاختبارات ناجحة' }
      ],
      createdDate: '2025-10-15',
      lastModified: '2025-10-24'
    },
    {
      id: 3,
      orderNumber: 'PO-2025-003',
      productName: 'منتج ج',
      quantity: 200,
      priority: 'منخفض',
      status: 'مجدول',
      scheduledStartDate: '2025-11-01',
      scheduledEndDate: '2025-11-15',
      actualStartDate: '',
      actualEndDate: '',
      assignedTo: 'محمد علي',
      workstation: 'خط الإنتاج 3',
      estimatedHours: 80,
      actualHours: 0,
      bomId: 'BOM-003',
      notes: 'طلب كبير، يحتاج تخطيط مفصل',
      progress: 0,
      materials: [
        { id: 1, name: 'المكونات الإلكترونية', required: 200, consumed: 0, status: 'في الانتظار' },
        { id: 2, name: 'الإطار', required: 200, consumed: 0, status: 'في الانتظار' },
        { id: 3, name: 'الكابلات', required: 1000, consumed: 0, status: 'في الانتظار' }
      ],
      operations: [
        { id: 1, name: 'تجهيز المواد', scheduledTime: 2400, actualTime: 0, status: 'في الانتظار' },
        { id: 2, name: 'التجميع', scheduledTime: 9600, actualTime: 0, status: 'في الانتظار' },
        { id: 3, name: 'الاختبار', scheduledTime: 4800, actualTime: 0, status: 'في الانتظار' },
        { id: 4, name: 'التغليف', scheduledTime: 2400, actualTime: 0, status: 'في الانتظار' }
      ],
      qualityChecks: [],
      createdDate: '2025-10-22',
      lastModified: '2025-10-22'
    }
  ];

  const priorities = [
    { value: 'عالي', label: 'عالي', color: 'text-red-600 bg-red-100' },
    { value: 'متوسط', label: 'متوسط', color: 'text-yellow-600 bg-yellow-100' },
    { value: 'منخفض', label: 'منخفض', color: 'text-green-600 bg-green-100' }
  ];

  const statusOptions = [
    { value: 'مسودة', label: 'مسودة', color: 'text-gray-600 bg-gray-100' },
    { value: 'مجدول', label: 'مجدول', color: 'text-blue-600 bg-blue-100' },
    { value: 'قيد التنفيذ', label: 'قيد التنفيذ', color: 'text-yellow-600 bg-yellow-100' },
    { value: 'مكتمل', label: 'مكتمل', color: 'text-green-600 bg-green-100' },
    { value: 'متوقف', label: 'متوقف', color: 'text-red-600 bg-red-100' },
    { value: 'ملغي', label: 'ملغي', color: 'text-gray-600 bg-gray-100' }
  ];

  const operationStatuses = [
    { value: 'في الانتظار', label: 'في الانتظار', color: 'text-gray-600 bg-gray-100' },
    { value: 'قيد التنفيذ', label: 'قيد التنفيذ', color: 'text-yellow-600 bg-yellow-100' },
    { value: 'مكتمل', label: 'مكتمل', color: 'text-green-600 bg-green-100' },
    { value: 'متوقف', label: 'متوقف', color: 'text-red-600 bg-red-100' }
  ];

  const qualityStatuses = [
    { value: 'مpassed', label: 'نجح', color: 'text-green-600 bg-green-100' },
    { value: 'فشل', label: 'فشل', color: 'text-red-600 bg-red-100' },
    { value: 'قيد المراجعة', label: 'قيد المراجعة', color: 'text-yellow-600 bg-yellow-100' }
  ];

  const tabs = ['الكل', 'مجدول', 'قيد التنفيذ', 'مكتمل', 'متوقف'];

  useEffect(() => {
    setOrders(mockOrders);
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'الكل' || order.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const getPriorityColor = (priority) => {
    const priorityOption = priorities.find(p => p.value === priority);
    return priorityOption ? priorityOption.color : 'text-gray-600 bg-gray-100';
  };

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(s => s.value === status);
    return statusOption ? statusOption.color : 'text-gray-600 bg-gray-100';
  };

  const getOperationStatusColor = (status) => {
    const statusOption = operationStatuses.find(s => s.value === status);
    return statusOption ? statusOption.color : 'text-gray-600 bg-gray-100';
  };

  const getQualityStatusColor = (status) => {
    const statusOption = qualityStatuses.find(s => s.value === status);
    return statusOption ? statusOption.color : 'text-gray-600 bg-gray-100';
  };

  const handleSaveOrder = () => {
    if (currentForm.orderNumber && currentForm.productName && currentForm.quantity > 0) {
      const newOrder = {
        ...currentForm,
        id: Date.now(),
        createdDate: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0],
        progress: currentForm.status === 'مكتمل' ? 100 : 0
      };

      if (selectedOrder) {
        setOrders(orders.map(order => order.id === selectedOrder.id ? newOrder : order));
      } else {
        setOrders([...orders, newOrder]);
      }

      resetForm();
    }
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setCurrentForm(order);
    setShowForm(true);
    setIsEditing(true);
  };

  const handleDelete = (orderId) => {
    if (window.confirm('هل أنت متأكد من حذف أمر الإنتاج هذا؟')) {
      setOrders(orders.filter(order => order.id !== orderId));
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            status: newStatus,
            lastModified: new Date().toISOString().split('T')[0],
            progress: newStatus === 'مكتمل' ? 100 : order.progress
          }
        : order
    ));
  };

  const handleStartOrder = (orderId) => {
    handleStatusChange(orderId, 'قيد التنفيذ');
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            actualStartDate: new Date().toISOString().split('T')[0]
          }
        : order
    ));
  };

  const handleCompleteOrder = (orderId) => {
    handleStatusChange(orderId, 'مكتمل');
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            actualEndDate: new Date().toISOString().split('T')[0],
            progress: 100
          }
        : order
    ));
  };

  const resetForm = () => {
    setCurrentForm({
      orderNumber: '',
      productName: '',
      quantity: 0,
      priority: 'متوسط',
      status: 'مجدول',
      scheduledStartDate: '',
      scheduledEndDate: '',
      actualStartDate: '',
      actualEndDate: '',
      assignedTo: '',
      workstation: '',
      estimatedHours: 0,
      actualHours: 0,
      bomId: '',
      notes: '',
      materials: [],
      operations: [],
      qualityChecks: [],
      progress: 0
    });
    setSelectedOrder(null);
    setShowForm(false);
    setIsEditing(false);
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const exportOrders = () => {
    const ordersData = {
      orders: filteredOrders,
      exportedDate: new Date().toISOString(),
      exportedBy: 'المستخدم الحالي'
    };
    
    const dataStr = JSON.stringify(ordersData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `ProductionOrders_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3 space-x-reverse">
          <ClipboardList className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">أوامر الإنتاج</h1>
        </div>
        <div className="flex space-x-3 space-x-reverse">
          <button
            onClick={exportOrders}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 space-x-reverse transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>تصدير</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 space-x-reverse transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>أمر إنتاج جديد</span>
          </button>
        </div>
      </div>

      {/* شريط البحث والفلاتر */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="البحث في أوامر الإنتاج..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* التبويبات */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab}
              <span className="mr-2 bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
                {tab === 'الكل' 
                  ? orders.length 
                  : orders.filter(order => order.status === tab).length
                }
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* قائمة أوامر الإنتاج */}
      <div className="grid gap-6">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{order.orderNumber}</h3>
                    <p className="text-gray-600">{order.productName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {statusOptions.find(s => s.value === order.status)?.label}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(order.priority)}`}>
                    {priorities.find(p => p.value === order.priority)?.label}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{order.quantity}</div>
                  <div className="text-sm text-gray-500">الكمية المطلوبة</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{order.progress}%</div>
                  <div className="text-sm text-gray-500">نسبة الإنجاز</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{order.actualHours}/{order.estimatedHours}</div>
                  <div className="text-sm text-gray-500">ساعات (فعلي/مقدر)</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">المشغل</div>
                  <div className="font-medium">{order.assignedTo}</div>
                </div>
              </div>

              {/* شريط التقدم */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>التقدم</span>
                  <span>{order.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${order.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500">
                  <div className="flex items-center space-x-1 space-x-reverse">
                    <Calendar className="w-4 h-4" />
                    <span>البداية: {order.scheduledStartDate}</span>
                  </div>
                  <div className="flex items-center space-x-1 space-x-reverse">
                    <Calendar className="w-4 h-4" />
                    <span>النهاية: {order.scheduledEndDate}</span>
                  </div>
                </div>
                <div className="flex space-x-2 space-x-reverse">
                  <button
                    onClick={() => viewOrderDetails(order)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="عرض التفاصيل"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  {order.status === 'مجدول' && (
                    <button
                      onClick={() => handleStartOrder(order.id)}
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="بدء الإنتاج"
                    >
                      <Play className="w-5 h-5" />
                    </button>
                  )}
                  {order.status === 'قيد التنفيذ' && (
                    <button
                      onClick={() => handleCompleteOrder(order.id)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="إكمال الإنتاج"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(order)}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="تعديل"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* نموذج إنشاء/تعديل أمر الإنتاج */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  {isEditing ? 'تعديل أمر الإنتاج' : 'أمر إنتاج جديد'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* معلومات أساسية */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">رقم الأمر</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    value={currentForm.orderNumber}
                    onChange={(e) => setCurrentForm({...currentForm, orderNumber: e.target.value})}
                    placeholder="PO-2025-XXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">اسم المنتج</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    value={currentForm.productName}
                    onChange={(e) => setCurrentForm({...currentForm, productName: e.target.value})}
                    placeholder="أدخل اسم المنتج"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الكمية</label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    value={currentForm.quantity}
                    onChange={(e) => setCurrentForm({...currentForm, quantity: parseInt(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الأولوية</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    value={currentForm.priority}
                    onChange={(e) => setCurrentForm({...currentForm, priority: e.target.value})}
                  >
                    {priorities.map(priority => (
                      <option key={priority.value} value={priority.value}>{priority.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    value={currentForm.status}
                    onChange={(e) => setCurrentForm({...currentForm, status: e.target.value})}
                  >
                    {statusOptions.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">المشغل</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    value={currentForm.assignedTo}
                    onChange={(e) => setCurrentForm({...currentForm, assignedTo: e.target.value})}
                    placeholder="اسم المشغل"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">محطة العمل</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    value={currentForm.workstation}
                    onChange={(e) => setCurrentForm({...currentForm, workstation: e.target.value})}
                    placeholder="محطة العمل"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">قائمة المواد (BOM)</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    value={currentForm.bomId}
                    onChange={(e) => setCurrentForm({...currentForm, bomId: e.target.value})}
                    placeholder="BOM-XXX"
                  />
                </div>
              </div>

              {/* التواريخ */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ البداية المجدول</label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    value={currentForm.scheduledStartDate}
                    onChange={(e) => setCurrentForm({...currentForm, scheduledStartDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ النهاية المجدول</label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    value={currentForm.scheduledEndDate}
                    onChange={(e) => setCurrentForm({...currentForm, scheduledEndDate: e.target.value})}
                  />
                </div>
              </div>

              {/* الساعات */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الساعات المقدرة</label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    value={currentForm.estimatedHours}
                    onChange={(e) => setCurrentForm({...currentForm, estimatedHours: parseFloat(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الساعات الفعلية</label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    value={currentForm.actualHours}
                    onChange={(e) => setCurrentForm({...currentForm, actualHours: parseFloat(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>
              </div>

              {/* الملاحظات */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الملاحظات</label>
                <textarea
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  value={currentForm.notes}
                  onChange={(e) => setCurrentForm({...currentForm, notes: e.target.value})}
                  placeholder="ملاحظات إضافية..."
                ></textarea>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3 space-x-reverse">
              <button
                onClick={resetForm}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveOrder}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 space-x-reverse transition-colors"
              >
                <Save className="w-5 h-5" />
                <span>حفظ أمر الإنتاج</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة تفاصيل أمر الإنتاج */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  تفاصيل أمر الإنتاج - {selectedOrder.orderNumber}
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                {/* معلومات أساسية */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">المعلومات الأساسية</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">المنتج:</span> {selectedOrder.productName}</div>
                    <div><span className="text-gray-600">الكمية:</span> {selectedOrder.quantity}</div>
                    <div><span className="text-gray-600">الأولوية:</span> {selectedOrder.priority}</div>
                    <div><span className="text-gray-600">المشغل:</span> {selectedOrder.assignedTo}</div>
                    <div><span className="text-gray-600">محطة العمل:</span> {selectedOrder.workstation}</div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">التواريخ</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">البداية المجدولة:</span> {selectedOrder.scheduledStartDate}</div>
                    <div><span className="text-gray-600">النهاية المجدولة:</span> {selectedOrder.scheduledEndDate}</div>
                    <div><span className="text-gray-600">البداية الفعلية:</span> {selectedOrder.actualStartDate || 'غير محدد'}</div>
                    <div><span className="text-gray-600">النهاية الفعلية:</span> {selectedOrder.actualEndDate || 'غير محدد'}</div>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">الإحصائيات</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">التقدم:</span> {selectedOrder.progress}%</div>
                    <div><span className="text-gray-600">الساعات المقدرة:</span> {selectedOrder.estimatedHours}</div>
                    <div><span className="text-gray-600">الساعات الفعلية:</span> {selectedOrder.actualHours}</div>
                    <div><span className="text-gray-600">قائمة المواد:</span> {selectedOrder.bomId}</div>
                  </div>
                </div>
              </div>

              {/* المواد */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">استهلاك المواد</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="border-b border-gray-200 px-4 py-2 text-right">اسم المادة</th>
                        <th className="border-b border-gray-200 px-4 py-2 text-right">الكمية المطلوبة</th>
                        <th className="border-b border-gray-200 px-4 py-2 text-right">المستهلك</th>
                        <th className="border-b border-gray-200 px-4 py-2 text-right">الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.materials.map((material, index) => (
                        <tr key={material.id}>
                          <td className="border-b border-gray-200 px-4 py-2">{material.name}</td>
                          <td className="border-b border-gray-200 px-4 py-2">{material.required}</td>
                          <td className="border-b border-gray-200 px-4 py-2">{material.consumed}</td>
                          <td className="border-b border-gray-200 px-4 py-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              material.status === 'كافي' ? 'bg-green-100 text-green-800' :
                              material.status === 'مستهلك' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
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

              {/* العمليات */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">العمليات الإنتاجية</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="border-b border-gray-200 px-4 py-2 text-right">اسم العملية</th>
                        <th className="border-b border-gray-200 px-4 py-2 text-right">الوقت المجدول (دقيقة)</th>
                        <th className="border-b border-gray-200 px-4 py-2 text-right">الوقت الفعلي (دقيقة)</th>
                        <th className="border-b border-gray-200 px-4 py-2 text-right">الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.operations.map((operation, index) => (
                        <tr key={operation.id}>
                          <td className="border-b border-gray-200 px-4 py-2">{operation.name}</td>
                          <td className="border-b border-gray-200 px-4 py-2">{operation.scheduledTime}</td>
                          <td className="border-b border-gray-200 px-4 py-2">{operation.actualTime}</td>
                          <td className="border-b border-gray-200 px-4 py-2">
                            <span className={`px-2 py-1 rounded text-xs ${getOperationStatusColor(operation.status)}`}>
                              {operationStatuses.find(s => s.value === operation.status)?.label}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* فحوصات الجودة */}
              {selectedOrder.qualityChecks.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">فحوصات الجودة</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="border-b border-gray-200 px-4 py-2 text-right">العملية</th>
                          <th className="border-b border-gray-200 px-4 py-2 text-right">الحالة</th>
                          <th className="border-b border-gray-200 px-4 py-2 text-right">المفتش</th>
                          <th className="border-b border-gray-200 px-4 py-2 text-right">التاريخ</th>
                          <th className="border-b border-gray-200 px-4 py-2 text-right">الملاحظات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.qualityChecks.map((check, index) => (
                          <tr key={check.id}>
                            <td className="border-b border-gray-200 px-4 py-2">
                              {selectedOrder.operations.find(op => op.id === check.operationId)?.name}
                            </td>
                            <td className="border-b border-gray-200 px-4 py-2">
                              <span className={`px-2 py-1 rounded text-xs ${getQualityStatusColor(check.status)}`}>
                                {qualityStatuses.find(s => s.value === check.status)?.label}
                              </span>
                            </td>
                            <td className="border-b border-gray-200 px-4 py-2">{check.inspector}</td>
                            <td className="border-b border-gray-200 px-4 py-2">{check.date}</td>
                            <td className="border-b border-gray-200 px-4 py-2">{check.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

export default ProductionOrders;