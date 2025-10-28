// ======================================
// خطط المشتريات - Purchase Planning
// ======================================

import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';
import Card from '../../components/Common/Card';
import Table from '../../components/Common/Table';
import Modal from '../../components/Common/Modal';
import Input from '../../components/Common/Input';
import { Select } from '../../components/Common/Input';
import Button from '../../components/Common/Button';
import { 
  FaShoppingCart, 
  FaExclamationTriangle, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaEye,
  FaDownload,
  FaUpload,
  FaCalendarAlt,
  FaTruck,
  FaWarehouse,
  FaClock,
  FaCheckCircle,
  FaPause,
  FaPlay,
  FaStop,
  FaDollarSign,
  FaBoxes,
  FaClipboardList,
  FaUsers,
  FaChartBar,
  FaFileAlt,
  FaCalculator,
  FaHandshake
} from 'react-icons/fa';

const PurchasePlans = () => {
  const { purchasePlans, departments, addPurchasePlan, updatePurchasePlan, deletePurchasePlan } = useData();
  const { showSuccess, showError } = useNotification();

  const [editModal, setEditModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [analyzeModal, setAnalyzeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'materials',
    category: '',
    priority: 'medium',
    status: 'draft',
    departmentId: '',
    requestedBy: '',
    approvedBy: '',
    startDate: '',
    endDate: '',
    budgetAllocated: '',
    totalEstimatedCost: '',
    items: [],
    suppliers: [],
    approvals: [],
    terms: '',
    notes: ''
  });

  // بيانات وهمية لخطط المشتريات
  const mockPurchasePlans = [
    {
      id: '1',
      name: 'خطة شراء المواد الخام - الربع الأول',
      description: 'شراء المواد الخام الأساسية للإنتاج',
      type: 'materials',
      category: 'raw_materials',
      priority: 'high',
      status: 'approved',
      departmentId: 'procurement',
      departmentName: 'المشتريات',
      requestedBy: 'أحمد محمد',
      approvedBy: 'سارة أحمد',
      startDate: '2025-01-01',
      endDate: '2025-03-31',
      budgetAllocated: 850000,
      totalEstimatedCost: 780000,
      actualCost: 0,
      savingsAmount: 0,
      savingsPercentage: 0,
      itemsCount: 25,
      suppliersCount: 8,
      completionPercentage: 0,
      lastUpdated: '2024-12-15',
      createdDate: '2024-11-20',
      approvalDate: '2024-12-10',
      risks: [],
      complianceStatus: 'compliant'
    },
    {
      id: '2',
      name: 'خطة شراء معدات الإنتاج الجديدة',
      description: 'شراء معدات وآلات للإنتاج',
      type: 'equipment',
      category: 'machinery',
      priority: 'urgent',
      status: 'in_progress',
      departmentId: 'production',
      departmentName: 'الإنتاج',
      requestedBy: 'محمد علي',
      approvedBy: 'خالد حسن',
      startDate: '2024-12-01',
      endDate: '2025-02-28',
      budgetAllocated: 1200000,
      totalEstimatedCost: 1150000,
      actualCost: 450000,
      savingsAmount: 0,
      savingsPercentage: 0,
      itemsCount: 5,
      suppliersCount: 3,
      completionPercentage: 40,
      lastUpdated: '2024-12-18',
      createdDate: '2024-10-15',
      approvalDate: '2024-11-01',
      risks: ['تأخير التوريد', 'تقلبات أسعار الصرف'],
      complianceStatus: 'under_review'
    },
    {
      id: '3',
      name: 'خطة شراء خدمات الصيانة',
      description: 'خدمات الصيانة الدورية للمعدات',
      type: 'services',
      category: 'maintenance',
      priority: 'medium',
      status: 'pending_approval',
      departmentId: 'maintenance',
      departmentName: 'الصيانة',
      requestedBy: 'عبدالله سعد',
      approvedBy: null,
      startDate: '2025-01-15',
      endDate: '2025-12-31',
      budgetAllocated: 300000,
      totalEstimatedCost: 285000,
      actualCost: 0,
      savingsAmount: 0,
      savingsPercentage: 0,
      itemsCount: 12,
      suppliersCount: 4,
      completionPercentage: 0,
      lastUpdated: '2024-12-20',
      createdDate: '2024-12-01',
      approvalDate: null,
      risks: [],
      complianceStatus: 'pending'
    },
    {
      id: '4',
      name: 'خطة شراء مواد التغليف والتعبئة',
      description: 'مواد التغليف والتعبئة للمنتجات',
      type: 'materials',
      category: 'packaging',
      priority: 'low',
      status: 'completed',
      departmentId: 'procurement',
      departmentName: 'المشتريات',
      requestedBy: 'فاطمة عبدالله',
      approvedBy: 'سارة أحمد',
      startDate: '2024-10-01',
      endDate: '2024-12-31',
      budgetAllocated: 180000,
      totalEstimatedCost: 175000,
      actualCost: 172000,
      savingsAmount: 3000,
      savingsPercentage: 1.7,
      itemsCount: 15,
      suppliersCount: 6,
      completionPercentage: 100,
      lastUpdated: '2025-01-05',
      createdDate: '2024-09-01',
      approvalDate: '2024-09-15',
      completedDate: '2024-12-30',
      risks: [],
      complianceStatus: 'compliant'
    }
  ];

  const departmentsList = [
    { id: 'procurement', name: 'المشتريات' },
    { id: 'production', name: 'الإنتاج' },
    { id: 'maintenance', name: 'الصيانة' },
    { id: 'hr', name: 'الموارد البشرية' },
    { id: 'it', name: 'تقنية المعلومات' },
    { id: 'admin', name: 'الإدارة' }
  ];

  const statusOptions = [
    { value: 'draft', label: 'مسودة', icon: FaClock, color: 'text-gray-500' },
    { value: 'pending_approval', label: 'في انتظار الاعتماد', icon: FaPause, color: 'text-yellow-500' },
    { value: 'approved', label: 'معتمدة', icon: FaCheckCircle, color: 'text-blue-500' },
    { value: 'in_progress', label: 'قيد التنفيذ', icon: FaPlay, color: 'text-orange-500' },
    { value: 'completed', label: 'مكتملة', icon: FaCheckCircle, color: 'text-green-500' },
    { value: 'cancelled', label: 'ملغية', icon: FaStop, color: 'text-red-500' },
    { value: 'on_hold', label: 'معلقة', icon: FaPause, color: 'text-gray-400' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'منخفضة', color: 'text-green-600' },
    { value: 'medium', label: 'متوسطة', color: 'text-yellow-600' },
    { value: 'high', label: 'عالية', color: 'text-red-600' },
    { value: 'urgent', label: 'عاجلة', color: 'text-red-800' }
  ];

  const purchaseTypes = [
    { value: 'materials', label: 'مواد خام' },
    { value: 'equipment', label: 'معدات' },
    { value: 'services', label: 'خدمات' },
    { value: 'supplies', label: 'مستلزمات' },
    { value: 'software', label: 'برمجيات' },
    { value: 'maintenance', label: 'صيانة' }
  ];

  const purchaseCategories = {
    materials: [
      { value: 'raw_materials', label: 'مواد خام' },
      { value: 'components', label: 'مكونات' },
      { value: 'packaging', label: 'تغليف وتعبئة' },
      { value: 'consumables', label: 'مواد استهلاكية' }
    ],
    equipment: [
      { value: 'machinery', label: 'آلات' },
      { value: 'tools', label: 'أدوات' },
      { value: 'vehicles', label: 'مركبات' },
      { value: 'computers', label: 'أجهزة حاسوب' }
    ],
    services: [
      { value: 'maintenance', label: 'صيانة' },
      { value: 'consulting', label: 'استشارات' },
      { value: 'transportation', label: 'نقل' },
      { value: 'training', label: 'تدريب' }
    ],
    supplies: [
      { value: 'office', label: 'مكاتب' },
      { value: 'cleaning', label: 'تنظيف' },
      { value: 'safety', label: 'سلامة' },
      { value: 'medical', label: 'طبية' }
    ]
  };

  const complianceStatuses = [
    { value: 'compliant', label: 'متوافق', color: 'text-green-600' },
    { value: 'under_review', label: 'قيد المراجعة', color: 'text-yellow-600' },
    { value: 'pending', label: 'في الانتظار', color: 'text-gray-600' },
    { value: 'non_compliant', label: 'غير متوافق', color: 'text-red-600' }
  ];

  // تصفية خطط المشتريات
  const filteredPlans = mockPurchasePlans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.departmentName.includes(searchTerm) ||
                         plan.requestedBy.includes(searchTerm);
    const matchesStatus = !filterStatus || plan.status === filterStatus;
    const matchesType = !filterType || plan.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // حساب الإحصائيات
  const planStats = {
    total: mockPurchasePlans.length,
    active: mockPurchasePlans.filter(p => ['approved', 'in_progress'].includes(p.status)).length,
    completed: mockPurchasePlans.filter(p => p.status === 'completed').length,
    pending: mockPurchasePlans.filter(p => p.status === 'pending_approval').length,
    totalBudget: mockPurchasePlans.reduce((sum, p) => sum + p.budgetAllocated, 0),
    totalEstimated: mockPurchasePlans.reduce((sum, p) => sum + p.totalEstimatedCost, 0),
    totalActual: mockPurchasePlans.reduce((sum, p) => sum + p.actualCost, 0),
    totalSavings: mockPurchasePlans.reduce((sum, p) => sum + p.savingsAmount, 0),
    savingsPercentage: 0
  };
  
  planStats.savingsPercentage = planStats.totalEstimated > 0 
    ? ((planStats.totalSavings / planStats.totalEstimated) * 100) 
    : 0;

  const getStatusInfo = (status) => {
    return statusOptions.find(option => option.value === status) || statusOptions[0];
  };

  const getPriorityInfo = (priority) => {
    return priorityOptions.find(option => option.value === priority) || priorityOptions[1];
  };

  const getComplianceInfo = (status) => {
    return complianceStatuses.find(option => option.value === status) || complianceStatuses[0];
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'materials',
      category: '',
      priority: 'medium',
      status: 'draft',
      departmentId: '',
      requestedBy: '',
      approvedBy: '',
      startDate: '',
      endDate: '',
      budgetAllocated: '',
      totalEstimatedCost: '',
      items: [],
      suppliers: [],
      approvals: [],
      terms: '',
      notes: ''
    });
  };

  const handleSave = async () => {
    try {
      if (selectedPlan) {
        await updatePurchasePlan(selectedPlan.id, formData);
        showSuccess('تم تحديث خطة المشتريات بنجاح');
      } else {
        await addPurchasePlan(formData);
        showSuccess('تم إضافة خطة المشتريات بنجاح');
      }
      setEditModal(false);
      resetForm();
      setSelectedPlan(null);
    } catch (error) {
      showError('حدث خطأ أثناء حفظ خطة المشتريات');
    }
  };

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description,
      type: plan.type,
      category: plan.category,
      priority: plan.priority,
      status: plan.status,
      departmentId: plan.departmentId,
      requestedBy: plan.requestedBy,
      approvedBy: plan.approvedBy || '',
      startDate: plan.startDate,
      endDate: plan.endDate,
      budgetAllocated: plan.budgetAllocated.toString(),
      totalEstimatedCost: plan.totalEstimatedCost.toString(),
      terms: '',
      notes: ''
    });
    setEditModal(true);
  };

  const handleView = (plan) => {
    setSelectedPlan(plan);
    setViewModal(true);
  };

  const handleDelete = (plan) => {
    setPlanToDelete(plan);
    setDeleteModal(true);
  };

  const handleAnalyze = (plan) => {
    setSelectedPlan(plan);
    setAnalyzeModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deletePurchasePlan(planToDelete.id);
      showSuccess('تم حذف خطة المشتريات بنجاح');
      setDeleteModal(false);
      setPlanToDelete(null);
    } catch (error) {
      showError('حدث خطأ أثناء حذف خطة المشتريات');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const getCurrentCategoryOptions = () => {
    return purchaseCategories[formData.type] || [];
  };

  const columns = [
    {
      key: 'name',
      title: 'خطة المشتريات',
      render: (value, item) => (
        <div>
          <div className="font-semibold text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{item.departmentName}</div>
          <div className="text-xs text-gray-400">بواسطة: {item.requestedBy}</div>
        </div>
      )
    },
    {
      key: 'type',
      title: 'النوع/الفئة',
      render: (value, item) => (
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">
            {purchaseTypes.find(t => t.value === value)?.label}
          </div>
          <div className="text-xs font-medium text-gray-700">
            {item.category.replace('_', ' ')}
          </div>
        </div>
      )
    },
    {
      key: 'budget',
      title: 'الميزانية والتكلفة',
      render: (value, item) => (
        <div className="text-right">
          <div className="font-semibold text-gray-900">
            {formatCurrency(item.totalEstimatedCost)}
          </div>
          <div className="text-xs text-gray-500">
            مخصص: {formatCurrency(item.budgetAllocated)}
          </div>
          {item.savingsAmount > 0 && (
            <div className="text-xs text-green-600">
              توفير: {formatCurrency(item.savingsAmount)}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'completionPercentage',
      title: 'التقدم',
      render: (value, item) => {
        const progress = item.completionPercentage || 0;
        const actualCost = item.actualCost || 0;
        
        return (
          <div className="text-center">
            <div className={`font-semibold ${getProgressColor(progress)}`}>
              {formatPercentage(progress)}
            </div>
            <div className="text-xs text-gray-500">
              {formatCurrency(actualCost)} منفق
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  progress >= 90 ? 'bg-green-500' :
                  progress >= 70 ? 'bg-blue-500' :
                  progress >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        );
      }
    },
    {
      key: 'period',
      title: 'الفترة',
      render: (value, item) => (
        <div className="text-center">
          <div className="text-sm text-gray-600">{item.startDate}</div>
          <div className="text-xs text-gray-500">إلى</div>
          <div className="text-sm text-gray-600">{item.endDate}</div>
        </div>
      )
    },
    {
      key: 'priority',
      title: 'الأولوية',
      render: (value) => {
        const priorityInfo = getPriorityInfo(value);
        return (
          <div className="text-center">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityInfo.color} bg-opacity-10`}>
              {priorityInfo.label}
            </span>
          </div>
        );
      }
    },
    {
      key: 'complianceStatus',
      title: 'الامتثال',
      render: (value) => {
        const complianceInfo = getComplianceInfo(value);
        return (
          <div className="text-center">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${complianceInfo.color} bg-opacity-10`}>
              {complianceInfo.label}
            </span>
          </div>
        );
      }
    },
    {
      key: 'status',
      title: 'الحالة',
      render: (value) => {
        const statusInfo = getStatusInfo(value);
        const StatusIcon = statusInfo.icon;
        return (
          <div className="flex items-center gap-2">
            <StatusIcon className={`${statusInfo.color} text-sm`} />
            <span className={`${statusInfo.color} text-sm font-medium`}>
              {statusInfo.label}
            </span>
          </div>
        );
      }
    },
    {
      key: 'actions',
      title: 'الإجراءات',
      render: (_, item) => (
        <div className="flex gap-1">
          <button
            onClick={() => handleView(item)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title="عرض التفاصيل"
          >
            <FaEye size={12} />
          </button>
          <button
            onClick={() => handleAnalyze(item)}
            className="text-purple-600 hover:text-purple-800 transition-colors"
            title="تحليل"
          >
            <FaChartBar size={12} />
          </button>
          <button
            onClick={() => handleEdit(item)}
            className="text-green-600 hover:text-green-800 transition-colors"
            title="تعديل"
          >
            <FaEdit size={12} />
          </button>
          <button
            onClick={() => handleDelete(item)}
            className="text-red-600 hover:text-red-800 transition-colors"
            title="حذف"
          >
            <FaTrash size={12} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* العنوان والإحصائيات */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">خطط المشتريات</h1>
            <p className="text-gray-600">تخطيط وإدارة مشتريات المؤسسة</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              icon={FaDownload}
              className="text-sm"
            >
              تصدير
            </Button>
            <Button 
              variant="outline" 
              icon={FaUpload}
              className="text-sm"
            >
              استيراد
            </Button>
            <Button 
              onClick={() => setEditModal(true)}
              icon={FaPlus}
              variant="primary"
            >
              إضافة خطة
            </Button>
          </div>
        </div>

        {/* بطاقات الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">إجمالي الخطط</p>
                <p className="text-2xl font-bold">{planStats.total}</p>
              </div>
              <FaClipboardList className="text-blue-200 text-3xl" />
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">خطط نشطة</p>
                <p className="text-2xl font-bold">{planStats.active}</p>
              </div>
              <FaPlay className="text-green-200 text-3xl" />
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">الميزانية المخصصة</p>
                <p className="text-lg font-bold">{formatCurrency(planStats.totalBudget)}</p>
              </div>
              <FaDollarSign className="text-purple-200 text-3xl" />
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">إجمالي التوفير</p>
                <p className="text-2xl font-bold">{formatCurrency(planStats.totalSavings)}</p>
                <p className="text-xs text-orange-100">({formatPercentage(planStats.savingsPercentage)})</p>
              </div>
              <FaCalculator className="text-orange-200 text-3xl" />
            </div>
          </Card>
        </div>
      </div>

      {/* أدوات التصفية والبحث */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="البحث في خطط المشتريات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={FaSearch}
          />
          
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">جميع الحالات</option>
            {statusOptions.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </Select>

          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">جميع الأنواع</option>
            {purchaseTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </Select>

          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('');
              setFilterStatus('');
              setFilterType('');
            }}
          >
            إعادة تعيين
          </Button>
        </div>
      </Card>

      {/* جدول خطط المشتريات */}
      <Card>
        <Table
          data={filteredPlans}
          columns={columns}
          searchable={false}
          pagination={true}
          pageSize={10}
        />
      </Card>

      {/* مودال إضافة/تعديل خطة المشتريات */}
      <Modal
        isOpen={editModal}
        onClose={() => {
          setEditModal(false);
          resetForm();
          setSelectedPlan(null);
        }}
        title={selectedPlan ? 'تعديل خطة المشتريات' : 'إضافة خطة مشتريات جديدة'}
        size="xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="اسم الخطة"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          <Select
            label="نوع المشتريات"
            value={formData.type}
            onChange={(e) => {
              handleInputChange('type', e.target.value);
              handleInputChange('category', '');
            }}
            required
          >
            {purchaseTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </Select>

          <Select
            label="الفئة"
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            required
          >
            <option value="">اختر الفئة</option>
            {getCurrentCategoryOptions().map(category => (
              <option key={category.value} value={category.value}>{category.label}</option>
            ))}
          </Select>

          <Select
            label="القسم"
            value={formData.departmentId}
            onChange={(e) => handleInputChange('departmentId', e.target.value)}
            required
          >
            <option value="">اختر القسم</option>
            {departmentsList.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </Select>

          <Input
            label="طلب بواسطة"
            value={formData.requestedBy}
            onChange={(e) => handleInputChange('requestedBy', e.target.value)}
            required
          />

          <Select
            label="الأولوية"
            value={formData.priority}
            onChange={(e) => handleInputChange('priority', e.target.value)}
          >
            {priorityOptions.map(priority => (
              <option key={priority.value} value={priority.value}>{priority.label}</option>
            ))}
          </Select>

          <Select
            label="الحالة"
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
          >
            {statusOptions.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </Select>

          <Input
            label="تاريخ البداية"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            required
          />

          <Input
            label="تاريخ النهاية"
            type="date"
            value={formData.endDate}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
            required
          />

          <Input
            label="الميزانية المخصصة"
            type="number"
            value={formData.budgetAllocated}
            onChange={(e) => handleInputChange('budgetAllocated', e.target.value)}
            required
          />

          <Input
            label="التكلفة المقدرة"
            type="number"
            value={formData.totalEstimatedCost}
            onChange={(e) => handleInputChange('totalEstimatedCost', e.target.value)}
            required
          />

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الوصف
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="وصف الخطة..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الشروط والأحكام
            </label>
            <textarea
              value={formData.terms}
              onChange={(e) => handleInputChange('terms', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="الشروط والأحكام..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ملاحظات
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="ملاحظات إضافية..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => {
              setEditModal(false);
              resetForm();
              setSelectedPlan(null);
            }}
          >
            إلغاء
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {selectedPlan ? 'تحديث' : 'حفظ'}
          </Button>
        </div>
      </Modal>

      {/* مودال عرض التفاصيل */}
      <Modal
        isOpen={viewModal}
        onClose={() => {
          setViewModal(false);
          setSelectedPlan(null);
        }}
        title="تفاصيل خطة المشتريات"
        size="lg"
      >
        {selectedPlan && (
          <div className="space-y-6">
            {/* معلومات أساسية */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">المعلومات الأساسية</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">اسم الخطة:</span>
                    <span className="font-medium">{selectedPlan.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">النوع:</span>
                    <span className="font-medium">
                      {purchaseTypes.find(t => t.value === selectedPlan.type)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الفئة:</span>
                    <span className="font-medium">{selectedPlan.category.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">القسم:</span>
                    <span className="font-medium">{selectedPlan.departmentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">طلب بواسطة:</span>
                    <span className="font-medium">{selectedPlan.requestedBy}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">المعلومات المالية</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">الميزانية المخصصة:</span>
                    <span className="font-medium">{formatCurrency(selectedPlan.budgetAllocated)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">التكلفة المقدرة:</span>
                    <span className="font-medium text-blue-600">{formatCurrency(selectedPlan.totalEstimatedCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">التكلفة الفعلية:</span>
                    <span className="font-medium text-green-600">{formatCurrency(selectedPlan.actualCost)}</span>
                  </div>
                  {selectedPlan.savingsAmount > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">التوفير:</span>
                        <span className="font-medium text-purple-600">{formatCurrency(selectedPlan.savingsAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">نسبة التوفير:</span>
                        <span className="font-medium text-purple-600">{formatPercentage(selectedPlan.savingsPercentage)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* الحالة والتقدم */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">الحالة والجدولة</h4>
                <div className="flex items-center gap-3 mb-3">
                  {React.createElement(getStatusInfo(selectedPlan.status).icon, {
                    className: `text-2xl ${getStatusInfo(selectedPlan.status).color}`
                  })}
                  <div>
                    <div className={`font-medium ${getStatusInfo(selectedPlan.status).color}`}>
                      {getStatusInfo(selectedPlan.status).label}
                    </div>
                    <div className="text-xs text-gray-500">الحالة الحالية</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">تاريخ البداية:</span>
                    <span className="font-medium">{selectedPlan.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">تاريخ النهاية:</span>
                    <span className="font-medium">{selectedPlan.endDate}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">الأولوية والامتثال</h4>
                <div className="space-y-3">
                  <div className="text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityInfo(selectedPlan.priority).color} bg-opacity-10`}>
                      {getPriorityInfo(selectedPlan.priority).label}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">الأولوية</div>
                  </div>
                  
                  <div className="text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getComplianceInfo(selectedPlan.complianceStatus).color} bg-opacity-10`}>
                      {getComplianceInfo(selectedPlan.complianceStatus).label}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">حالة الامتثال</div>
                  </div>
                </div>
              </div>
            </div>

            {/* التقدم والإحصائيات */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">تقدم التنفيذ</h4>
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div 
                    className={`h-6 rounded-full flex items-center justify-center text-white text-sm font-medium transition-all duration-300 ${
                      selectedPlan.completionPercentage >= 90 ? 'bg-green-500' :
                      selectedPlan.completionPercentage >= 70 ? 'bg-blue-500' :
                      selectedPlan.completionPercentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(selectedPlan.completionPercentage, 100)}%` }}
                  >
                    {formatPercentage(selectedPlan.completionPercentage)}
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>{selectedPlan.itemsCount} عنصر</span>
                  <span>{selectedPlan.suppliersCount} مورد</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">إحصائيات إضافية</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">عدد العناصر:</span>
                    <span className="font-medium">{selectedPlan.itemsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">عدد الموردين:</span>
                    <span className="font-medium">{selectedPlan.suppliersCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">آخر تحديث:</span>
                    <span className="font-medium">{selectedPlan.lastUpdated}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* المخاطر */}
            {selectedPlan.risks && selectedPlan.risks.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">المخاطر المحتملة</h4>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {selectedPlan.risks.map((risk, index) => (
                      <li key={index}>{risk}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* الوصف */}
            {selectedPlan.description && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">الوصف</h4>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                  {selectedPlan.description}
                </p>
              </div>
            )}

            {/* معلومات الاعتماد */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">معلومات الاعتماد</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">تاريخ الإنشاء:</span>
                  <div className="font-medium">{selectedPlan.createdDate}</div>
                </div>
                {selectedPlan.approvedBy && (
                  <div>
                    <span className="text-gray-600">معتمدة بواسطة:</span>
                    <div className="font-medium">{selectedPlan.approvedBy}</div>
                  </div>
                )}
                {selectedPlan.approvalDate && (
                  <div>
                    <span className="text-gray-600">تاريخ الاعتماد:</span>
                    <div className="font-medium">{selectedPlan.approvalDate}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* مودال التحليل */}
      <Modal
        isOpen={analyzeModal}
        onClose={() => {
          setAnalyzeModal(false);
          setSelectedPlan(null);
        }}
        title="تحليل خطة المشتريات"
        size="lg"
      >
        {selectedPlan && (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <FaChartBar className="text-blue-500 text-3xl mx-auto mb-2" />
              <h3 className="text-lg font-semibold">{selectedPlan.name}</h3>
              <p className="text-gray-600">تحليل شامل لأداء خطة المشتريات</p>
            </div>

            {/* مؤشرات الأداء */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <FaCalculator className="text-green-500 text-2xl mx-auto mb-2" />
                <div className="text-lg font-semibold text-green-600">توفير التكلفة</div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatPercentage(planStats.savingsPercentage)}
                </div>
                <div className="text-sm text-gray-600">من الميزانية المقدرة</div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <FaClock className="text-blue-500 text-2xl mx-auto mb-2" />
                <div className="text-lg font-semibold text-blue-600">معدل التنفيذ</div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatPercentage(selectedPlan.completionPercentage)}
                </div>
                <div className="text-sm text-gray-600">من المخطط</div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <FaHandshake className="text-purple-500 text-2xl mx-auto mb-2" />
                <div className="text-lg font-semibold text-purple-600">كفاءة الموردين</div>
                <div className="text-2xl font-bold text-gray-900">92%</div>
                <div className="text-sm text-gray-600">متوسط الأداء</div>
              </div>
            </div>

            {/* تحليل التكلفة */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">تحليل التكلفة</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">الميزانية المخصصة:</span>
                  <span className="font-semibold">{formatCurrency(selectedPlan.budgetAllocated)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-600">التكلفة المقدرة:</span>
                  <span className="font-semibold text-blue-600">{formatCurrency(selectedPlan.totalEstimatedCost)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-600">التكلفة الفعلية:</span>
                  <span className="font-semibold text-green-600">{formatCurrency(selectedPlan.actualCost)}</span>
                </div>
                {selectedPlan.savingsAmount > 0 && (
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-gray-600">التوفير المحقق:</span>
                    <span className="font-semibold text-purple-600">
                      {formatCurrency(selectedPlan.savingsAmount)} ({formatPercentage(selectedPlan.savingsPercentage)})
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* توصيات */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">التوصيات</h4>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                  <li>مراجعة دورية لأداء الموردين لضمان الجودة</li>
                  <li>تحسين عملية طلب العروض لزيادة المنافسة</li>
                  <li>تطوير استراتيجية طويلة المدى للموردين</li>
                  <li>تطبيق نظام تقييم الأداء للموردين</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-center gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setAnalyzeModal(false)}
              >
                إغلاق
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  showSuccess('تم تصدير تقرير التحليل بنجاح');
                  setAnalyzeModal(false);
                }}
                icon={FaDownload}
              >
                تصدير التقرير
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* مودال تأكيد الحذف */}
      <Modal
        isOpen={deleteModal}
        onClose={() => {
          setDeleteModal(false);
          setPlanToDelete(null);
        }}
        title="تأكيد الحذف"
        size="sm"
      >
        <div className="text-center">
          <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
          <p className="text-gray-600 mb-6">
            هل أنت متأكد من حذف خطة المشتريات "{planToDelete?.name}"؟
            <br />
            <span className="text-sm text-red-600">لا يمكن التراجع عن هذا الإجراء</span>
          </p>
          
          <div className="flex justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteModal(false);
                setPlanToDelete(null);
              }}
            >
              إلغاء
            </Button>
            <Button
              variant="primary"
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              حذف
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PurchasePlans;