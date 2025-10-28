import React, { useState, useEffect } from 'react';
import { 
  Shield, Plus, Search, CheckCircle, XCircle, AlertTriangle, 
  Clock, Eye, Edit, Trash2, Save, X, Filter, BarChart3,
  FileText, User, Calendar, TrendingUp, Activity, ClipboardList,
  Zap, Target, Award, AlertCircle, CheckSquare, Settings,
  Download, Upload, Camera, Star, ThumbsUp, ThumbsDown
} from 'lucide-react';

const QualityControl = () => {
  const [qualityRecords, setQualityRecords] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [standards, setStandards] = useState([]);
  const [selectedTab, setSelectedTab] = useState('الفحوصات');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentForm, setCurrentForm] = useState({
    type: 'inspection',
    title: '',
    description: '',
    status: 'مجدول',
    priority: 'متوسط',
    inspector: '',
    date: '',
    productName: '',
    orderNumber: '',
    station: '',
    tests: [],
    measurements: [],
    defects: [],
    result: '',
    notes: '',
    approvedBy: '',
    correctiveActions: []
  });

  // محاكاة البيانات
  const mockQualityRecords = [
    {
      id: 1,
      type: 'inspection',
      title: 'فحص جودة المنتج أ',
      description: 'فحص شامل للمنتج أ قبل التغليف',
      status: 'مكتمل',
      priority: 'عالي',
      inspector: 'سارة أحمد',
      date: '2025-10-25',
      productName: 'منتج أ',
      orderNumber: 'PO-2025-001',
      station: 'محطة الفحص',
      result: 'passed',
      notes: 'جميع المعايير مستوفاة',
      approvedBy: 'محمد علي',
      createdDate: '2025-10-25',
      lastModified: '2025-10-25',
      tests: [
        { id: 1, name: 'فحص الدائرة الإلكترونية', result: 'passed', value: 100, minValue: 95, maxValue: 100, unit: '%' },
        { id: 2, name: 'اختبار الأداء', result: 'passed', value: 98, minValue: 90, maxValue: 100, unit: '%' },
        { id: 3, name: 'فحص المظهر الخارجي', result: 'passed', value: 95, minValue: 90, maxValue: 100, unit: '%' }
      ],
      measurements: [
        { id: 1, parameter: 'الطول', value: 12.5, unit: 'سم', tolerance: '±0.1' },
        { id: 2, parameter: 'العرض', value: 8.3, unit: 'سم', tolerance: '±0.1' },
        { id: 3, parameter: 'الارتفاع', value: 2.1, unit: 'سم', tolerance: '±0.05' }
      ],
      defects: [],
      correctiveActions: []
    },
    {
      id: 2,
      type: 'audit',
      title: 'تدقيق نظام الإنتاج',
      description: 'تدقيق شامل لإجراءات الإنتاج',
      status: 'قيد التنفيذ',
      priority: 'متوسط',
      inspector: 'أحمد محمد',
      date: '2025-10-26',
      productName: '',
      orderNumber: '',
      station: 'خط الإنتاج 1',
      result: 'pending',
      notes: '',
      approvedBy: '',
      createdDate: '2025-10-22',
      lastModified: '2025-10-25',
      tests: [
        { id: 1, name: 'فحص إجراءات السلامة', result: 'passed', value: 100, minValue: 100, maxValue: 100, unit: 'نقاط' },
        { id: 2, name: 'توثيق العمليات', result: 'failed', value: 75, minValue: 90, maxValue: 100, unit: 'نقاط' },
        { id: 3, name: 'تنظيف محطة العمل', result: 'passed', value: 95, minValue: 85, maxValue: 100, unit: 'نقاط' }
      ],
      measurements: [],
      defects: [
        { id: 1, type: 'توثيق', severity: 'متوسط', description: 'بعض العمليات غير موثقة بالكامل', location: 'خط الإنتاج 1', status: 'مفتوح' }
      ],
      correctiveActions: [
        { id: 1, action: 'تحديث إجراءات العمل', responsible: 'أحمد محمد', dueDate: '2025-11-01', status: 'في الانتظار' }
      ]
    },
    {
      id: 3,
      type: 'test',
      title: 'اختبار المنتج ب',
      description: 'اختبار أداء المنتج ب',
      status: 'فشل',
      priority: 'عالي',
      inspector: 'علي حسن',
      date: '2025-10-24',
      productName: 'منتج ب',
      orderNumber: 'PO-2025-002',
      station: 'محطة الاختبار',
      result: 'failed',
      notes: 'المعالج لا يعمل بالسرعة المطلوبة',
      approvedBy: '',
      createdDate: '2025-10-24',
      lastModified: '2025-10-24',
      tests: [
        { id: 1, name: 'اختبار السرعة', result: 'failed', value: 75, minValue: 85, maxValue: 100, unit: 'MHz' },
        { id: 2, name: 'اختبار استهلاك الطاقة', result: 'passed', value: 45, minValue: 0, maxValue: 50, unit: 'واط' },
        { id: 3, name: 'اختبار درجة الحرارة', result: 'passed', value: 35, minValue: 0, maxValue: 40, unit: '°م' }
      ],
      measurements: [
        { id: 1, parameter: 'السرعة', value: 750, unit: 'MHz', tolerance: '±50' },
        { id: 2, parameter: 'استهلاك الطاقة', value: 45, unit: 'واط', tolerance: '±5' },
        { id: 3, parameter: 'درجة الحرارة', value: 35, unit: '°م', tolerance: '±5' }
      ],
      defects: [
        { id: 1, type: 'أداء', severity: 'عالي', description: 'السرعة أقل من المطلوب', location: 'المعالج', status: 'مفتوح' }
      ],
      correctiveActions: [
        { id: 1, action: 'استبدال المعالج', responsible: 'علي حسن', dueDate: '2025-10-27', status: 'مكتمل' },
        { id: 2, action: 'إعادة الاختبار', responsible: 'سارة أحمد', dueDate: '2025-10-28', status: 'في الانتظار' }
      ]
    }
  ];

  const qualityStandards = [
    {
      id: 1,
      name: 'معايير الجودة ISO 9001',
      description: 'معايير إدارة الجودة',
      category: 'إدارة الجودة',
      requirements: [
        'توثيق العمليات',
        'قياس رضا العملاء',
        'التحسين المستمر',
        'إدارة المخاطر'
      ]
    },
    {
      id: 2,
      name: 'معايير السلامة والأمان',
      description: 'معايير السلامة في بيئة العمل',
      category: 'السلامة',
      requirements: [
        'استخدام معدات الحماية',
        'تدريب الموظفين',
        'إجراءات الطوارئ',
        'فحص المعدات'
      ]
    }
  ];

  const testTypes = [
    { value: 'inspection', label: 'فحص' },
    { value: 'audit', label: 'تدقيق' },
    { value: 'test', label: 'اختبار' },
    { value: 'calibration', label: 'معايرة' },
    { value: 'validation', label: 'تحقق' }
  ];

  const statusOptions = [
    { value: 'مجدول', label: 'مجدول', color: 'bg-blue-100 text-blue-800' },
    { value: 'قيد التنفيذ', label: 'قيد التنفيذ', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'مكتمل', label: 'مكتمل', color: 'bg-green-100 text-green-800' },
    { value: 'فشل', label: 'فشل', color: 'bg-red-100 text-red-800' }
  ];

  const priorityOptions = [
    { value: 'عالي', label: 'عالي', color: 'text-red-600' },
    { value: 'متوسط', label: 'متوسط', color: 'text-yellow-600' },
    { value: 'منخفض', label: 'منخفض', color: 'text-green-600' }
  ];

  const resultOptions = [
    { value: 'passed', label: 'نجح', color: 'text-green-600' },
    { value: 'failed', label: 'فشل', color: 'text-red-600' },
    { value: 'pending', label: 'معلق', color: 'text-yellow-600' },
    { value: 'conditional', label: 'مشروط', color: 'text-orange-600' }
  ];

  const defectTypes = [
    'بصري', 'أداء', 'مواد', 'تجميع', 'توثيق', 'سلامة', 'بيئي', 'آخر'
  ];

  const severityLevels = [
    'منخفض', 'متوسط', 'عالي', 'حرج'
  ];

  const tabs = ['الفحوصات', 'المعايير', 'التقارير', 'الإعدادات'];

  useEffect(() => {
    setQualityRecords(mockQualityRecords);
    setStandards(qualityStandards);
  }, []);

  const filteredRecords = qualityRecords.filter(record => {
    const matchesSearch = 
      record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.inspector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'الكل' || record.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(s => s.value === status);
    return statusOption ? statusOption.color : 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const priorityOption = priorityOptions.find(p => p.value === priority);
    return priorityOption ? priorityOption.color : 'text-gray-600';
  };

  const getResultColor = (result) => {
    const resultOption = resultOptions.find(r => r.value === result);
    return resultOption ? resultOption.color : 'text-gray-600';
  };

  const getTestResultIcon = (result) => {
    switch (result) {
      case 'passed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleSaveRecord = () => {
    if (currentForm.title && currentForm.inspector && currentForm.date) {
      const newRecord = {
        ...currentForm,
        id: Date.now(),
        createdDate: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0]
      };

      if (selectedRecord) {
        setQualityRecords(qualityRecords.map(record => record.id === selectedRecord.id ? newRecord : record));
      } else {
        setQualityRecords([...qualityRecords, newRecord]);
      }

      resetForm();
    }
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setCurrentForm(record);
    setShowForm(true);
  };

  const handleDelete = (recordId) => {
    if (window.confirm('هل أنت متأكد من حذف سجل الجودة هذا؟')) {
      setQualityRecords(qualityRecords.filter(record => record.id !== recordId));
    }
  };

  const resetForm = () => {
    setCurrentForm({
      type: 'inspection',
      title: '',
      description: '',
      status: 'مجدول',
      priority: 'متوسط',
      inspector: '',
      date: '',
      productName: '',
      orderNumber: '',
      station: '',
      tests: [],
      measurements: [],
      defects: [],
      result: '',
      notes: '',
      approvedBy: '',
      correctiveActions: []
    });
    setSelectedRecord(null);
    setShowForm(false);
  };

  const viewRecordDetails = (record) => {
    setSelectedRecord(record);
    setShowDetails(true);
  };

  const exportQualityRecords = () => {
    const qualityExport = {
      records: filteredRecords,
      standards,
      exportedDate: new Date().toISOString(),
      exportedBy: 'المستخدم الحالي'
    };
    
    const dataStr = JSON.stringify(qualityExport, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `QualityRecords_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const addTest = () => {
    setCurrentForm({
      ...currentForm,
      tests: [
        ...currentForm.tests,
        {
          id: Date.now(),
          name: '',
          result: 'pending',
          value: 0,
          minValue: 0,
          maxValue: 100,
          unit: ''
        }
      ]
    });
  };

  const updateTest = (index, field, value) => {
    const updatedTests = [...currentForm.tests];
    updatedTests[index][field] = value;
    setCurrentForm({ ...currentForm, tests: updatedTests });
  };

  const removeTest = (index) => {
    setCurrentForm({
      ...currentForm,
      tests: currentForm.tests.filter((_, i) => i !== index)
    });
  };

  const addMeasurement = () => {
    setCurrentForm({
      ...currentForm,
      measurements: [
        ...currentForm.measurements,
        {
          id: Date.now(),
          parameter: '',
          value: 0,
          unit: '',
          tolerance: ''
        }
      ]
    });
  };

  const updateMeasurement = (index, field, value) => {
    const updatedMeasurements = [...currentForm.measurements];
    updatedMeasurements[index][field] = value;
    setCurrentForm({ ...currentForm, measurements: updatedMeasurements });
  };

  const removeMeasurement = (index) => {
    setCurrentForm({
      ...currentForm,
      measurements: currentForm.measurements.filter((_, i) => i !== index)
    });
  };

  const addDefect = () => {
    setCurrentForm({
      ...currentForm,
      defects: [
        ...currentForm.defects,
        {
          id: Date.now(),
          type: '',
          severity: 'متوسط',
          description: '',
          location: '',
          status: 'مفتوح'
        }
      ]
    });
  };

  const updateDefect = (index, field, value) => {
    const updatedDefects = [...currentForm.defects];
    updatedDefects[index][field] = value;
    setCurrentForm({ ...currentForm, defects: updatedDefects });
  };

  const removeDefect = (index) => {
    setCurrentForm({
      ...currentForm,
      defects: currentForm.defects.filter((_, i) => i !== index)
    });
  };

  const getQualityStatistics = () => {
    const total = qualityRecords.length;
    const passed = qualityRecords.filter(r => r.result === 'passed').length;
    const failed = qualityRecords.filter(r => r.result === 'failed').length;
    const pending = qualityRecords.filter(r => r.result === 'pending').length;
    
    return {
      total,
      passed,
      failed,
      pending,
      passRate: total > 0 ? ((passed / total) * 100).toFixed(1) : 0
    };
  };

  const stats = getQualityStatistics();
  let selectedRecord = null;

  const InspectionView = () => (
    <div className="space-y-6">
      {/* إحصائيات سريعة */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ClipboardList className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
              <div className="text-sm text-gray-600">إجمالي الفحوصات</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{stats.passed}</div>
              <div className="text-sm text-gray-600">فحوصات ناجحة</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{stats.failed}</div>
              <div className="text-sm text-gray-600">فحوصات فاشلة</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{stats.passRate}%</div>
              <div className="text-sm text-gray-600">معدل النجاح</div>
            </div>
          </div>
        </div>
      </div>

      {/* شريط البحث والفلاتر */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="البحث في سجلات الجودة..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="الكل">جميع الحالات</option>
            {statusOptions.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
          <button
            onClick={exportQualityRecords}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 space-x-reverse transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>تصدير</span>
          </button>
        </div>
      </div>

      {/* قائمة سجلات الجودة */}
      <div className="grid gap-6">
        {filteredRecords.map((record) => (
          <div key={record.id} className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    {getTestResultIcon(record.result)}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{record.title}</h3>
                      <p className="text-gray-600">{record.description}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}>
                    {statusOptions.find(s => s.value === record.status)?.label}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(record.priority)}`}>
                    {priorityOptions.find(p => p.value === record.priority)?.label}
                  </span>
                  {record.result && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getResultColor(record.result)}`}>
                      {resultOptions.find(r => r.value === record.result)?.label}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-500">المفتش</div>
                  <div className="font-medium flex items-center space-x-2 space-x-reverse">
                    <User className="w-4 h-4" />
                    <span>{record.inspector}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">التاريخ</div>
                  <div className="font-medium flex items-center space-x-2 space-x-reverse">
                    <Calendar className="w-4 h-4" />
                    <span>{record.date}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">المنتج/الطلب</div>
                  <div className="font-medium">{record.productName || record.orderNumber}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">محطة العمل</div>
                  <div className="font-medium">{record.station}</div>
                </div>
              </div>

              {record.notes && (
                <div className="mb-4">
                  <div className="text-sm text-gray-500">الملاحظات</div>
                  <div className="text-gray-800">{record.notes}</div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500">
                  <span>تم الإنشاء: {record.createdDate}</span>
                  <span>آخر تعديل: {record.lastModified}</span>
                </div>
                <div className="flex space-x-2 space-x-reverse">
                  <button
                    onClick={() => viewRecordDetails(record)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="عرض التفاصيل"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleEdit(record)}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="تعديل"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(record.id)}
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
    </div>
  );

  const StandardsView = () => (
    <div className="grid gap-6">
      {standards.map((standard) => (
        <div key={standard.id} className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{standard.name}</h3>
              <p className="text-gray-600">{standard.description}</p>
            </div>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {standard.category}
            </span>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">المتطلبات:</h4>
            <ul className="list-disc list-inside space-y-1">
              {standard.requirements.map((requirement, index) => (
                <li key={index} className="text-gray-600">{requirement}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );

  const ReportsView = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">تقرير الأداء الشهري</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>إجمالي الفحوصات</span>
              <span className="font-semibold">{stats.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>معدل النجاح</span>
              <span className="font-semibold text-green-600">{stats.passRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>الفحوصات الفاشلة</span>
              <span className="font-semibold text-red-600">{stats.failed}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">أهم العيوب</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>عيوب الأداء</span>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">5</span>
            </div>
            <div className="flex justify-between items-center">
              <span>عيوب التجميع</span>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">3</span>
            </div>
            <div className="flex justify-between items-center">
              <span>عيوب المظهر</span>
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const SettingsView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">إعدادات الجودة</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">تفعيل الإشعارات التلقائية</label>
              <p className="text-xs text-gray-500">إرسال إشعارات عند فشل الفحوصات</p>
            </div>
            <input type="checkbox" className="rounded" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">طلب الموافقة للمراجعة</label>
              <p className="text-xs text-gray-500">طلب موافقة المشرف على الفحوصات المهمة</p>
            </div>
            <input type="checkbox" className="rounded" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">حفظ الصور التلقائي</label>
              <p className="text-xs text-gray-500">حفظ صور العيوب تلقائياً</p>
            </div>
            <input type="checkbox" className="rounded" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3 space-x-reverse">
          <Shield className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">إدارة الجودة</h1>
        </div>
        <div className="flex space-x-3 space-x-reverse">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 space-x-reverse transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>فحص جديد</span>
          </button>
        </div>
      </div>

      {/* التبويبات */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                selectedTab === tab
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* محتوى التبويبات */}
      <div>
        {selectedTab === 'الفحوصات' && <InspectionView />}
        {selectedTab === 'المعايير' && <StandardsView />}
        {selectedTab === 'التقارير' && <ReportsView />}
        {selectedTab === 'الإعدادات' && <SettingsView />}
      </div>

      {/* نموذج إنشاء/تعديل فحص */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  فحص جودة جديد
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
              {/* المعلومات الأساسية */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نوع الفحص</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    value={currentForm.type}
                    onChange={(e) => setCurrentForm({...currentForm, type: e.target.value})}
                  >
                    {testTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    value={currentForm.title}
                    onChange={(e) => setCurrentForm({...currentForm, title: e.target.value})}
                    placeholder="أدخل عنوان الفحص"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">المفتش</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    value={currentForm.inspector}
                    onChange={(e) => setCurrentForm({...currentForm, inspector: e.target.value})}
                    placeholder="اسم المفتش"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">التاريخ</label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    value={currentForm.date}
                    onChange={(e) => setCurrentForm({...currentForm, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">المنتج</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    value={currentForm.productName}
                    onChange={(e) => setCurrentForm({...currentForm, productName: e.target.value})}
                    placeholder="اسم المنتج"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">رقم الطلب</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    value={currentForm.orderNumber}
                    onChange={(e) => setCurrentForm({...currentForm, orderNumber: e.target.value})}
                    placeholder="PO-XXXX"
                  />
                </div>
              </div>

              {/* الوصف */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
                <textarea
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  value={currentForm.description}
                  onChange={(e) => setCurrentForm({...currentForm, description: e.target.value})}
                  placeholder="وصف الفحص..."
                ></textarea>
              </div>

              {/* الاختبارات */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">الاختبارات</h3>
                  <button
                    onClick={addTest}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg flex items-center space-x-2 space-x-reverse text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة اختبار</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {currentForm.tests.map((test, index) => (
                    <div key={test.id} className="grid grid-cols-12 gap-2 p-4 bg-gray-50 rounded-lg">
                      <div className="col-span-3">
                        <input
                          type="text"
                          placeholder="اسم الاختبار"
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500"
                          value={test.name}
                          onChange={(e) => updateTest(index, 'name', e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="القيمة"
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500"
                          value={test.value}
                          onChange={(e) => updateTest(index, 'value', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          placeholder="الوحدة"
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500"
                          value={test.unit}
                          onChange={(e) => updateTest(index, 'unit', e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="الحد الأدنى"
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500"
                          value={test.minValue}
                          onChange={(e) => updateTest(index, 'minValue', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-2">
                        <select
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500"
                          value={test.result}
                          onChange={(e) => updateTest(index, 'result', e.target.value)}
                        >
                          <option value="pending">معلق</option>
                          <option value="passed">نجح</option>
                          <option value="failed">فشل</option>
                        </select>
                      </div>
                      <div className="col-span-1 flex items-center justify-center">
                        <button
                          onClick={() => removeTest(index)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
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
                onClick={handleSaveRecord}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 space-x-reverse transition-colors"
              >
                <Save className="w-5 h-5" />
                <span>حفظ الفحص</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة تفاصيل الفحص */}
      {showDetails && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  تفاصيل الفحص - {selectedRecord.title}
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
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">معلومات الفحص</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">النوع:</span> {testTypes.find(t => t.value === selectedRecord.type)?.label}</div>
                    <div><span className="text-gray-600">المفتش:</span> {selectedRecord.inspector}</div>
                    <div><span className="text-gray-600">التاريخ:</span> {selectedRecord.date}</div>
                    <div><span className="text-gray-600">المنتج:</span> {selectedRecord.productName}</div>
                    <div><span className="text-gray-600">رقم الطلب:</span> {selectedRecord.orderNumber}</div>
                    <div><span className="text-gray-600">محطة العمل:</span> {selectedRecord.station}</div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">النتائج</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">الحالة:</span> 
                      <span className={`mr-2 px-2 py-1 rounded text-xs ${getStatusColor(selectedRecord.status)}`}>
                        {statusOptions.find(s => s.value === selectedRecord.status)?.label}
                      </span>
                    </div>
                    <div><span className="text-gray-600">النتيجة:</span> 
                      <span className={`mr-2 px-2 py-1 rounded text-xs ${getResultColor(selectedRecord.result)}`}>
                        {resultOptions.find(r => r.value === selectedRecord.result)?.label}
                      </span>
                    </div>
                    <div><span className="text-gray-600">الأولوية:</span> 
                      <span className={`mr-2 px-2 py-1 rounded text-xs ${getPriorityColor(selectedRecord.priority)}`}>
                        {priorityOptions.find(p => p.value === selectedRecord.priority)?.label}
                      </span>
                    </div>
                    {selectedRecord.approvedBy && (
                      <div><span className="text-gray-600">معتمد من:</span> {selectedRecord.approvedBy}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* الاختبارات */}
              {selectedRecord.tests.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">نتائج الاختبارات</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="border-b border-gray-200 px-4 py-2 text-right">اسم الاختبار</th>
                          <th className="border-b border-gray-200 px-4 py-2 text-right">القيمة</th>
                          <th className="border-b border-gray-200 px-4 py-2 text-right">الحد الأدنى</th>
                          <th className="border-b border-gray-200 px-4 py-2 text-right">الحد الأعلى</th>
                          <th className="border-b border-gray-200 px-4 py-2 text-right">الوحدة</th>
                          <th className="border-b border-gray-200 px-4 py-2 text-right">النتيجة</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRecord.tests.map((test, index) => (
                          <tr key={test.id}>
                            <td className="border-b border-gray-200 px-4 py-2">{test.name}</td>
                            <td className="border-b border-gray-200 px-4 py-2">{test.value}</td>
                            <td className="border-b border-gray-200 px-4 py-2">{test.minValue}</td>
                            <td className="border-b border-gray-200 px-4 py-2">{test.maxValue}</td>
                            <td className="border-b border-gray-200 px-4 py-2">{test.unit}</td>
                            <td className="border-b border-gray-200 px-4 py-2">
                              <div className="flex items-center space-x-2 space-x-reverse">
                                {getTestResultIcon(test.result)}
                                <span>{resultOptions.find(r => r.value === test.result)?.label}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* القياسات */}
              {selectedRecord.measurements.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">القياسات</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="border-b border-gray-200 px-4 py-2 text-right">المعلمة</th>
                          <th className="border-b border-gray-200 px-4 py-2 text-right">القيمة</th>
                          <th className="border-b border-gray-200 px-4 py-2 text-right">الوحدة</th>
                          <th className="border-b border-gray-200 px-4 py-2 text-right">التفاوت</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRecord.measurements.map((measurement, index) => (
                          <tr key={measurement.id}>
                            <td className="border-b border-gray-200 px-4 py-2">{measurement.parameter}</td>
                            <td className="border-b border-gray-200 px-4 py-2">{measurement.value}</td>
                            <td className="border-b border-gray-200 px-4 py-2">{measurement.unit}</td>
                            <td className="border-b border-gray-200 px-4 py-2">{measurement.tolerance}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* العيوب */}
              {selectedRecord.defects.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">العيوب المكتشفة</h3>
                  <div className="space-y-3">
                    {selectedRecord.defects.map((defect, index) => (
                      <div key={defect.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{defect.type}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            defect.severity === 'حرج' ? 'bg-red-100 text-red-800' :
                            defect.severity === 'عالي' ? 'bg-orange-100 text-orange-800' :
                            defect.severity === 'متوسط' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {defect.severity}
                          </span>
                        </div>
                        <p className="text-gray-600">{defect.description}</p>
                        <div className="mt-2 text-sm text-gray-500">
                          <span>الموقع: {defect.location} | الحالة: {defect.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* الإجراءات التصحيحية */}
              {selectedRecord.correctiveActions.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">الإجراءات التصحيحية</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="border-b border-gray-200 px-4 py-2 text-right">الإجراء</th>
                          <th className="border-b border-gray-200 px-4 py-2 text-right">المسؤول</th>
                          <th className="border-b border-gray-200 px-4 py-2 text-right">تاريخ الاستحقاق</th>
                          <th className="border-b border-gray-200 px-4 py-2 text-right">الحالة</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRecord.correctiveActions.map((action, index) => (
                          <tr key={action.id}>
                            <td className="border-b border-gray-200 px-4 py-2">{action.action}</td>
                            <td className="border-b border-gray-200 px-4 py-2">{action.responsible}</td>
                            <td className="border-b border-gray-200 px-4 py-2">{action.dueDate}</td>
                            <td className="border-b border-gray-200 px-4 py-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                action.status === 'مكتمل' ? 'bg-green-100 text-green-800' :
                                action.status === 'في الانتظار' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {action.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* الملاحظات */}
              {selectedRecord.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">الملاحظات</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-800">{selectedRecord.notes}</p>
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

export default QualityControl;