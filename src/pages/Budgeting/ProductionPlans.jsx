// ======================================
// خطط الإنتاج - Production Planning
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
  FaCogs, 
  FaExclamationTriangle, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaEye,
  FaDownload,
  FaUpload,
  FaCalendarAlt,
  FaBoxes,
  FaIndustry,
  FaClock,
  FaCheckCircle,
  FaPause,
  FaPlay,
  FaStop,
  FaChartBar,
  FaCalendarCheck,
  FaTasks,
  FaClipboardList,
  FaTruck,
  FaWarehouse
} from 'react-icons/fa';

const ProductionPlans = () => {
  const { productionPlans, departments, addProductionPlan, updateProductionPlan, deleteProductionPlan } = useData();
  const { showSuccess, showError } = useNotification();

  const [editModal, setEditModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [scheduleModal, setScheduleModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    productId: '',
    productName: '',
    plannedQuantity: '',
    unit: 'piece',
    startDate: '',
    endDate: '',
    dueDate: '',
    priority: 'medium',
    status: 'draft',
    departmentId: '',
    productionLine: '',
    estimatedHours: '',
    actualHours: '',
    materialRequirements: [],
    laborRequirements: [],
    machineRequirements: [],
    qualityStandards: '',
    notes: ''
  });

  // بيانات وهمية لخطط الإنتاج
  const mockProductionPlans = [
    {
      id: '1',
      name: 'خطة إنتاج المنتج A - الربع الأول',
      description: 'إنتاج 10,000 وحدة من المنتج A',
      productId: 'A001',
      productName: 'منتج أ',
      plannedQuantity: 10000,
      unit: 'piece',
      startDate: '2025-01-01',
      endDate: '2025-03-31',
      dueDate: '2025-03-31',
      priority: 'high',
      status: 'approved',
      departmentId: 'production',
      departmentName: 'الإنتاج',
      productionLine: 'الخط الأول',
      estimatedHours: 480,
      actualHours: 0,
      completionPercentage: 0,
      actualQuantity: 0,
      materialCost: 150000,
      laborCost: 48000,
      overheadCost: 24000,
      totalCost: 222000,
      efficiency: 0,
      createdDate: '2024-12-01',
      createdBy: 'مدير الإنتاج',
      approvedBy: 'المدير العام',
      approvedDate: '2024-12-15'
    },
    {
      id: '2',
      name: 'خطة إنتاج المنتج B - الربع الأول',
      description: 'إنتاج 5,000 وحدة من المنتج B',
      productId: 'B002',
      productName: 'منتج ب',
      plannedQuantity: 5000,
      unit: 'piece',
      startDate: '2025-02-01',
      endDate: '2025-04-30',
      dueDate: '2025-04-30',
      priority: 'medium',
      status: 'in_progress',
      departmentId: 'production',
      departmentName: 'الإنتاج',
      productionLine: 'الخط الثاني',
      estimatedHours: 320,
      actualHours: 120,
      completionPercentage: 35,
      actualQuantity: 1750,
      materialCost: 85000,
      laborCost: 32000,
      overheadCost: 16000,
      totalCost: 133000,
      efficiency: 85,
      createdDate: '2024-12-10',
      createdBy: 'مخطط الإنتاج',
      approvedBy: 'مدير المصنع',
      approvedDate: '2024-12-20'
    },
    {
      id: '3',
      name: 'خطة إنتاج المنتج C - الربع الثاني',
      description: 'إنتاج 3,000 وحدة من المنتج C',
      productId: 'C003',
      productName: 'منتج ج',
      plannedQuantity: 3000,
      unit: 'piece',
      startDate: '2025-04-01',
      endDate: '2025-06-30',
      dueDate: '2025-06-30',
      priority: 'low',
      status: 'draft',
      departmentId: 'production',
      departmentName: 'الإنتاج',
      productionLine: 'الخط الثالث',
      estimatedHours: 240,
      actualHours: 0,
      completionPercentage: 0,
      actualQuantity: 0,
      materialCost: 45000,
      laborCost: 24000,
      overheadCost: 12000,
      totalCost: 81000,
      efficiency: 0,
      createdDate: '2024-12-15',
      createdBy: 'مخطط الإنتاج',
      approvedBy: null,
      approvedDate: null
    },
    {
      id: '4',
      name: 'خطة إنتاج المنتج D - الربع الأول',
      description: 'إنتاج 2,000 وحدة من المنتج D',
      productId: 'D004',
      productName: 'منتج د',
      plannedQuantity: 2000,
      unit: 'piece',
      startDate: '2025-01-15',
      endDate: '2025-03-15',
      dueDate: '2025-03-15',
      priority: 'high',
      status: 'completed',
      departmentId: 'production',
      departmentName: 'الإنتاج',
      productionLine: 'الخط الأول',
      estimatedHours: 200,
      actualHours: 195,
      completionPercentage: 100,
      actualQuantity: 2000,
      materialCost: 60000,
      laborCost: 20000,
      overheadCost: 10000,
      totalCost: 90000,
      efficiency: 102,
      createdDate: '2024-11-15',
      createdBy: 'مدير الإنتاج',
      approvedBy: 'المدير العام',
      approvedDate: '2024-11-20',
      completedDate: '2025-01-10'
    }
  ];

  const departmentsList = [
    { id: 'production', name: 'الإنتاج' },
    { id: 'quality', name: 'مراقبة الجودة' },
    { id: 'maintenance', name: 'الصيانة' },
    { id: 'planning', name: 'التخطيط' }
  ];

  const productionLines = [
    'الخط الأول',
    'الخط الثاني',
    'الخط الثالث',
    'الخط الرابع',
    'الخط التجميعي'
  ];

  const statusOptions = [
    { value: 'draft', label: 'مسودة', icon: FaClock, color: 'text-gray-500' },
    { value: 'pending_approval', label: 'في انتظار الاعتماد', icon: FaPause, color: 'text-yellow-500' },
    { value: 'approved', label: 'معتمدة', icon: FaCheckCircle, color: 'text-blue-500' },
    { value: 'scheduled', label: 'مجدولة', icon: FaCalendarCheck, color: 'text-purple-500' },
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

  const units = [
    { value: 'piece', label: 'قطعة' },
    { value: 'kg', label: 'كيلو' },
    { value: 'ton', label: 'طن' },
    { value: 'liter', label: 'لتر' },
    { value: 'meter', label: 'متر' },
    { value: 'box', label: 'علبة' }
  ];

  // تصفية خطط الإنتاج
  const filteredPlans = mockProductionPlans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.productName.includes(searchTerm) ||
                         plan.productionLine.includes(searchTerm);
    const matchesStatus = !filterStatus || plan.status === filterStatus;
    const matchesPriority = !filterPriority || plan.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // حساب الإحصائيات
  const planStats = {
    total: mockProductionPlans.length,
    active: mockProductionPlans.filter(p => ['approved', 'scheduled', 'in_progress'].includes(p.status)).length,
    completed: mockProductionPlans.filter(p => p.status === 'completed').length,
    draft: mockProductionPlans.filter(p => p.status === 'draft').length,
    totalPlannedQuantity: mockProductionPlans.reduce((sum, p) => sum + p.plannedQuantity, 0),
    totalActualQuantity: mockProductionPlans.reduce((sum, p) => sum + p.actualQuantity, 0),
    totalCost: mockProductionPlans.reduce((sum, p) => sum + p.totalCost, 0),
    averageEfficiency: mockProductionPlans.filter(p => p.efficiency > 0).reduce((sum, p, _, arr) => sum + p.efficiency / arr.length, 0)
  };

  const getStatusInfo = (status) => {
    return statusOptions.find(option => option.value === status) || statusOptions[0];
  };

  const getPriorityInfo = (priority) => {
    return priorityOptions.find(option => option.value === priority) || priorityOptions[1];
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
      productId: '',
      productName: '',
      plannedQuantity: '',
      unit: 'piece',
      startDate: '',
      endDate: '',
      dueDate: '',
      priority: 'medium',
      status: 'draft',
      departmentId: '',
      productionLine: '',
      estimatedHours: '',
      actualHours: '',
      materialRequirements: [],
      laborRequirements: [],
      machineRequirements: [],
      qualityStandards: '',
      notes: ''
    });
  };

  const handleSave = async () => {
    try {
      if (selectedPlan) {
        await updateProductionPlan(selectedPlan.id, formData);
        showSuccess('تم تحديث خطة الإنتاج بنجاح');
      } else {
        await addProductionPlan(formData);
        showSuccess('تم إضافة خطة الإنتاج بنجاح');
      }
      setEditModal(false);
      resetForm();
      setSelectedPlan(null);
    } catch (error) {
      showError('حدث خطأ أثناء حفظ خطة الإنتاج');
    }
  };

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description,
      productId: plan.productId,
      productName: plan.productName,
      plannedQuantity: plan.plannedQuantity.toString(),
      unit: plan.unit,
      startDate: plan.startDate,
      endDate: plan.endDate,
      dueDate: plan.dueDate,
      priority: plan.priority,
      status: plan.status,
      departmentId: plan.departmentId,
      productionLine: plan.productionLine,
      estimatedHours: plan.estimatedHours.toString(),
      actualHours: plan.actualHours.toString(),
      qualityStandards: '',
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

  const handleSchedule = (plan) => {
    setSelectedPlan(plan);
    setScheduleModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteProductionPlan(planToDelete.id);
      showSuccess('تم حذف خطة الإنتاج بنجاح');
      setDeleteModal(false);
      setPlanToDelete(null);
    } catch (error) {
      showError('حدث خطأ أثناء حذف خطة الإنتاج');
    }
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('ar-SA').format(value);
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

  const columns = [
    {
      key: 'name',
      title: 'خطة الإنتاج',
      render: (value, item) => (
        <div>
          <div className="font-semibold text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{item.productName} - {item.productionLine}</div>
        </div>
      )
    },
    {
      key: 'plannedQuantity',
      title: 'الكمية المخططة',
      render: (value, item) => (
        <div className="text-center">
          <div className="font-semibold text-gray-900">{formatNumber(value)}</div>
          <div className="text-xs text-gray-500">{units.find(u => u.value === item.unit)?.label}</div>
        </div>
      )
    },
    {
      key: 'completionPercentage',
      title: 'التقدم',
      render: (value, item) => {
        const actualQuantity = item.actualQuantity || 0;
        const completionPercentage = item.completionPercentage || ((actualQuantity / item.plannedQuantity) * 100);
        
        return (
          <div className="text-center">
            <div className={`font-semibold ${getProgressColor(completionPercentage)}`}>
              {formatPercentage(completionPercentage)}
            </div>
            <div className="text-xs text-gray-500">
              {formatNumber(actualQuantity)} من {formatNumber(item.plannedQuantity)}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  completionPercentage >= 90 ? 'bg-green-500' :
                  completionPercentage >= 70 ? 'bg-blue-500' :
                  completionPercentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(completionPercentage, 100)}%` }}
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
      key: 'efficiency',
      title: 'الكفاءة',
      render: (value, item) => {
        const efficiency = item.efficiency || 0;
        if (efficiency === 0) return <span className="text-gray-400">-</span>;
        
        return (
          <div className="text-center">
            <div className={`font-semibold ${getProgressColor(efficiency)}`}>
              {formatPercentage(efficiency)}
            </div>
            <div className="text-xs text-gray-500">
              {item.actualHours}h / {item.estimatedHours}h
            </div>
          </div>
        );
      }
    },
    {
      key: 'totalCost',
      title: 'التكلفة',
      render: (value) => (
        <div className="text-right font-semibold text-gray-900">
          {formatCurrency(value)}
        </div>
      )
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
            onClick={() => handleSchedule(item)}
            className="text-purple-600 hover:text-purple-800 transition-colors"
            title="جدولة"
          >
            <FaCalendarAlt size={12} />
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">خطط الإنتاج</h1>
            <p className="text-gray-600">تخطيط وإدارة خطط الإنتاج والتصنيع</p>
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
                <p className="text-purple-100 text-sm">خطط مكتملة</p>
                <p className="text-2xl font-bold">{planStats.completed}</p>
              </div>
              <FaCheckCircle className="text-purple-200 text-3xl" />
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">متوسط الكفاءة</p>
                <p className="text-2xl font-bold">{planStats.averageEfficiency.toFixed(1)}%</p>
              </div>
              <FaChartBar className="text-orange-200 text-3xl" />
            </div>
          </Card>
        </div>
      </div>

      {/* أدوات التصفية والبحث */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="البحث في خطط الإنتاج..."
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
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="">جميع الأولويات</option>
            {priorityOptions.map(priority => (
              <option key={priority.value} value={priority.value}>{priority.label}</option>
            ))}
          </Select>

          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('');
              setFilterStatus('');
              setFilterPriority('');
            }}
          >
            إعادة تعيين
          </Button>
        </div>
      </Card>

      {/* جدول خطط الإنتاج */}
      <Card>
        <Table
          data={filteredPlans}
          columns={columns}
          searchable={false}
          pagination={true}
          pageSize={10}
        />
      </Card>

      {/* مودال إضافة/تعديل خطة الإنتاج */}
      <Modal
        isOpen={editModal}
        onClose={() => {
          setEditModal(false);
          resetForm();
          setSelectedPlan(null);
        }}
        title={selectedPlan ? 'تعديل خطة الإنتاج' : 'إضافة خطة إنتاج جديدة'}
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

          <Input
            label="معرف المنتج"
            value={formData.productId}
            onChange={(e) => handleInputChange('productId', e.target.value)}
            required
          />

          <Input
            label="اسم المنتج"
            value={formData.productName}
            onChange={(e) => handleInputChange('productName', e.target.value)}
            required
          />

          <Input
            label="الكمية المخططة"
            type="number"
            value={formData.plannedQuantity}
            onChange={(e) => handleInputChange('plannedQuantity', e.target.value)}
            required
          />

          <Select
            label="وحدة القياس"
            value={formData.unit}
            onChange={(e) => handleInputChange('unit', e.target.value)}
          >
            {units.map(unit => (
              <option key={unit.value} value={unit.value}>{unit.label}</option>
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

          <Select
            label="خط الإنتاج"
            value={formData.productionLine}
            onChange={(e) => handleInputChange('productionLine', e.target.value)}
            required
          >
            <option value="">اختر خط الإنتاج</option>
            {productionLines.map(line => (
              <option key={line} value={line}>{line}</option>
            ))}
          </Select>

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
            label="تاريخ التسليم"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleInputChange('dueDate', e.target.value)}
          />

          <Input
            label="الساعات المقدرة"
            type="number"
            value={formData.estimatedHours}
            onChange={(e) => handleInputChange('estimatedHours', e.target.value)}
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
              المعايير الجودة
            </label>
            <textarea
              value={formData.qualityStandards}
              onChange={(e) => handleInputChange('qualityStandards', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="معايير الجودة المطلوبة..."
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
        title="تفاصيل خطة الإنتاج"
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
                    <span className="text-gray-600">المنتج:</span>
                    <span className="font-medium">{selectedPlan.productName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">خط الإنتاج:</span>
                    <span className="font-medium">{selectedPlan.productionLine}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الأولوية:</span>
                    <span className={`font-medium ${getPriorityInfo(selectedPlan.priority).color}`}>
                      {getPriorityInfo(selectedPlan.priority).label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">الكميات والأوقات</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">الكمية المخططة:</span>
                    <span className="font-medium">{formatNumber(selectedPlan.plannedQuantity)} {units.find(u => u.value === selectedPlan.unit)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الكمية الفعلية:</span>
                    <span className="font-medium text-green-600">{formatNumber(selectedPlan.actualQuantity)} {units.find(u => u.value === selectedPlan.unit)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">نسبة الإنجاز:</span>
                    <span className={`font-medium ${getProgressColor(selectedPlan.completionPercentage)}`}>
                      {formatPercentage(selectedPlan.completionPercentage)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الكفاءة:</span>
                    <span className="font-medium text-blue-600">{formatPercentage(selectedPlan.efficiency)}</span>
                  </div>
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
                  <div className="flex justify-between">
                    <span className="text-gray-600">تاريخ التسليم:</span>
                    <span className="font-medium">{selectedPlan.dueDate}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">الأوقات والتكلفة</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">الساعات المقدرة:</span>
                    <span className="font-medium">{selectedPlan.estimatedHours} ساعة</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الساعات الفعلية:</span>
                    <span className="font-medium">{selectedPlan.actualHours} ساعة</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">تكلفة المواد:</span>
                    <span className="font-medium text-blue-600">{formatCurrency(selectedPlan.materialCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">إجمالي التكلفة:</span>
                    <span className="font-bold text-green-600">{formatCurrency(selectedPlan.totalCost)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* شريط التقدم */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">تقدم الإنتاج</h4>
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
                <span>{formatNumber(selectedPlan.actualQuantity)} مكتمل</span>
                <span>{formatNumber(selectedPlan.plannedQuantity)} مخطط</span>
              </div>
            </div>

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
                  <span className="text-gray-600">تم الإنشاء بواسطة:</span>
                  <div className="font-medium">{selectedPlan.createdBy}</div>
                </div>
                <div>
                  <span className="text-gray-600">تاريخ الإنشاء:</span>
                  <div className="font-medium">{selectedPlan.createdDate}</div>
                </div>
                {selectedPlan.approvedBy && (
                  <div>
                    <span className="text-gray-600">تم الاعتماد بواسطة:</span>
                    <div className="font-medium">{selectedPlan.approvedBy}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* مودال جدولة الإنتاج */}
      <Modal
        isOpen={scheduleModal}
        onClose={() => {
          setScheduleModal(false);
          setSelectedPlan(null);
        }}
        title="جدولة خطة الإنتاج"
        size="md"
      >
        {selectedPlan && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <FaCalendarAlt className="text-blue-500 text-3xl mx-auto mb-2" />
              <h3 className="text-lg font-semibold">{selectedPlan.name}</h3>
              <p className="text-gray-600">إعداد جدولة مفصلة للإنتاج</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="تاريخ البداية"
                type="datetime-local"
                defaultValue={selectedPlan.startDate + 'T08:00'}
              />
              <Input
                label="تاريخ النهاية"
                type="datetime-local"
                defaultValue={selectedPlan.endDate + 'T17:00'}
              />
              <Select
                label="ورديات العمل"
                defaultValue="1"
              >
                <option value="1">وردية واحدة (8 ساعات)</option>
                <option value="2">ورديتان (16 ساعة)</option>
                <option value="3">ثلاث ورديات (24 ساعة)</option>
              </Select>
              <Select
                label="أولوية الجدولة"
                defaultValue="normal"
              >
                <option value="low">منخفضة</option>
                <option value="normal">عادية</option>
                <option value="high">عالية</option>
                <option value="urgent">عاجلة</option>
              </Select>
            </div>

            <div className="flex justify-center gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setScheduleModal(false)}
              >
                إلغاء
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  showSuccess('تم جدولة خطة الإنتاج بنجاح');
                  setScheduleModal(false);
                }}
                icon={FaCalendarCheck}
              >
                جدولة
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
            هل أنت متأكد من حذف خطة الإنتاج "{planToDelete?.name}"؟
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

export default ProductionPlans;