// ======================================
// إدارة الميزانيات - Budgets Management
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
  FaWallet, 
  FaExclamationTriangle, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaEye,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaChartBar,
  FaPercentage,
  FaCalendarAlt,
  FaDollarSign,
  FaDownload,
  FaUpload
} from 'react-icons/fa';

const Budgets = () => {
  const { budgets, departments, addBudget, updateBudget, deleteBudget } = useData();
  const { showSuccess, showError } = useNotification();

  const [editModal, setEditModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [budgetToDelete, setBudgetToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());

  const [formData, setFormData] = useState({
    name: '',
    departmentId: '',
    year: new Date().getFullYear(),
    quarter: '1',
    type: 'operational',
    totalAmount: '',
    approvedAmount: '',
    spentAmount: '',
    status: 'draft',
    description: '',
    startDate: '',
    endDate: '',
    categories: [],
    approvals: []
  });

  // بيانات وهمية للميزانيات
  const mockBudgets = [
    {
      id: '1',
      name: 'ميزانية قسم المبيعات 2025',
      departmentId: 'sales',
      departmentName: 'المبيعات',
      year: 2025,
      quarter: 'Q1',
      type: 'operational',
      totalAmount: 500000,
      approvedAmount: 450000,
      spentAmount: 120000,
      status: 'approved',
      description: 'ميزانية تشغيلية للقسم',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      approvalDate: '2024-12-15',
      approvedBy: 'مدير المالية'
    },
    {
      id: '2',
      name: 'ميزانية قسم الإنتاج 2025',
      departmentId: 'production',
      departmentName: 'الإنتاج',
      year: 2025,
      quarter: 'Q1',
      type: 'capital',
      totalAmount: 1200000,
      approvedAmount: 1100000,
      spentAmount: 350000,
      status: 'approved',
      description: 'ميزانية رأسمالية للتطوير',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      approvalDate: '2024-12-20',
      approvedBy: 'المدير العام'
    },
    {
      id: '3',
      name: 'ميزانية قسم الموارد البشرية 2025',
      departmentId: 'hr',
      departmentName: 'الموارد البشرية',
      year: 2025,
      quarter: 'Q1',
      type: 'operational',
      totalAmount: 800000,
      approvedAmount: 0,
      spentAmount: 0,
      status: 'pending',
      description: 'ميزانية الرواتب والتدريب',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      approvalDate: null,
      approvedBy: null
    }
  ];

  const departmentsList = [
    { id: 'sales', name: 'المبيعات' },
    { id: 'production', name: 'الإنتاج' },
    { id: 'hr', name: 'الموارد البشرية' },
    { id: 'marketing', name: 'التسويق' },
    { id: 'finance', name: 'المالية' },
    { id: 'it', name: 'تقنية المعلومات' }
  ];

  const budgetTypes = [
    { value: 'operational', label: 'تشغيلية' },
    { value: 'capital', label: 'رأسمالية' },
    { value: 'marketing', label: 'تسويقية' },
    { value: 'rd', label: 'بحث وتطوير' }
  ];

  const statusOptions = [
    { value: 'draft', label: 'مسودة', icon: FaClock, color: 'text-gray-500' },
    { value: 'pending', label: 'في الانتظار', icon: FaClock, color: 'text-yellow-500' },
    { value: 'approved', label: 'معتمدة', icon: FaCheckCircle, color: 'text-green-500' },
    { value: 'rejected', label: 'مرفوضة', icon: FaTimesCircle, color: 'text-red-500' },
    { value: 'suspended', label: 'معلقة', icon: FaExclamationTriangle, color: 'text-orange-500' }
  ];

  // تصفية الميزانيات
  const filteredBudgets = mockBudgets.filter(budget => {
    const matchesSearch = budget.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         budget.departmentName.includes(searchTerm);
    const matchesDepartment = !filterDepartment || budget.departmentId === filterDepartment;
    const matchesStatus = !filterStatus || budget.status === filterStatus;
    const matchesYear = !filterYear || budget.year === filterYear;
    
    return matchesSearch && matchesDepartment && matchesStatus && matchesYear;
  });

  // حساب الإحصائيات
  const budgetStats = {
    total: mockBudgets.length,
    approved: mockBudgets.filter(b => b.status === 'approved').length,
    pending: mockBudgets.filter(b => b.status === 'pending').length,
    totalAmount: mockBudgets.reduce((sum, b) => sum + b.totalAmount, 0),
    approvedAmount: mockBudgets.filter(b => b.status === 'approved').reduce((sum, b) => sum + b.approvedAmount, 0),
    spentAmount: mockBudgets.reduce((sum, b) => sum + b.spentAmount, 0)
  };

  const getStatusInfo = (status) => {
    return statusOptions.find(option => option.value === status) || statusOptions[0];
  };

  const getBudgetProgress = (spent, total) => {
    return total > 0 ? (spent / total) * 100 : 0;
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
      departmentId: '',
      year: new Date().getFullYear(),
      quarter: '1',
      type: 'operational',
      totalAmount: '',
      approvedAmount: '',
      spentAmount: '',
      status: 'draft',
      description: '',
      startDate: '',
      endDate: '',
      categories: [],
      approvals: []
    });
  };

  const handleSave = async () => {
    try {
      if (selectedBudget) {
        await updateBudget(selectedBudget.id, formData);
        showSuccess('تم تحديث الميزانية بنجاح');
      } else {
        await addBudget(formData);
        showSuccess('تم إضافة الميزانية بنجاح');
      }
      setEditModal(false);
      resetForm();
      setSelectedBudget(null);
    } catch (error) {
      showError('حدث خطأ أثناء حفظ الميزانية');
    }
  };

  const handleEdit = (budget) => {
    setSelectedBudget(budget);
    setFormData({
      name: budget.name,
      departmentId: budget.departmentId,
      year: budget.year,
      quarter: budget.quarter,
      type: budget.type,
      totalAmount: budget.totalAmount.toString(),
      approvedAmount: budget.approvedAmount.toString(),
      spentAmount: budget.spentAmount.toString(),
      status: budget.status,
      description: budget.description,
      startDate: budget.startDate,
      endDate: budget.endDate
    });
    setEditModal(true);
  };

  const handleView = (budget) => {
    setSelectedBudget(budget);
    setViewModal(true);
  };

  const handleDelete = (budget) => {
    setBudgetToDelete(budget);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteBudget(budgetToDelete.id);
      showSuccess('تم حذف الميزانية بنجاح');
      setDeleteModal(false);
      setBudgetToDelete(null);
    } catch (error) {
      showError('حدث خطأ أثناء حذف الميزانية');
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

  const columns = [
    {
      key: 'name',
      title: 'اسم الميزانية',
      render: (value, item) => (
        <div>
          <div className="font-semibold text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{item.departmentName}</div>
        </div>
      )
    },
    {
      key: 'year',
      title: 'السنة/الربع',
      render: (value, item) => (
        <div className="text-center">
          <div className="font-semibold">{value}</div>
          <div className="text-sm text-gray-500">{item.quarter}</div>
        </div>
      )
    },
    {
      key: 'totalAmount',
      title: 'المبلغ المخصص',
      render: (value) => (
        <div className="text-right font-semibold text-gray-900">
          {formatCurrency(value)}
        </div>
      )
    },
    {
      key: 'approvedAmount',
      title: 'المبلغ المعتمد',
      render: (value) => (
        <div className="text-right font-semibold text-blue-600">
          {formatCurrency(value)}
        </div>
      )
    },
    {
      key: 'spentAmount',
      title: 'المبلغ المنفق',
      render: (value, item) => {
        const progress = getBudgetProgress(value, item.totalAmount);
        return (
          <div className="text-right">
            <div className="font-semibold text-green-600">
              {formatCurrency(value)}
            </div>
            <div className="text-xs text-gray-500">
              {formatPercentage(progress)} من الميزانية
            </div>
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
        <div className="flex gap-2">
          <button
            onClick={() => handleView(item)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title="عرض التفاصيل"
          >
            <FaEye size={14} />
          </button>
          <button
            onClick={() => handleEdit(item)}
            className="text-green-600 hover:text-green-800 transition-colors"
            title="تعديل"
          >
            <FaEdit size={14} />
          </button>
          <button
            onClick={() => handleDelete(item)}
            className="text-red-600 hover:text-red-800 transition-colors"
            title="حذف"
          >
            <FaTrash size={14} />
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة الميزانيات</h1>
            <p className="text-gray-600">إدارة ومتابعة ميزانيات الأقسام المختلفة</p>
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
              إضافة ميزانية
            </Button>
          </div>
        </div>

        {/* بطاقات الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">إجمالي الميزانيات</p>
                <p className="text-2xl font-bold">{budgetStats.total}</p>
              </div>
              <FaWallet className="text-blue-200 text-3xl" />
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">الميزانيات المعتمدة</p>
                <p className="text-2xl font-bold">{budgetStats.approved}</p>
              </div>
              <FaCheckCircle className="text-green-200 text-3xl" />
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">في الانتظار</p>
                <p className="text-2xl font-bold">{budgetStats.pending}</p>
              </div>
              <FaClock className="text-yellow-200 text-3xl" />
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">إجمالي المخصصات</p>
                <p className="text-lg font-bold">{formatCurrency(budgetStats.totalAmount)}</p>
              </div>
              <FaDollarSign className="text-purple-200 text-3xl" />
            </div>
          </Card>
        </div>
      </div>

      {/* أدوات التصفية والبحث */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Input
            placeholder="البحث في الميزانيات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={FaSearch}
          />
          
          <Select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            <option value="">جميع الأقسام</option>
            {departmentsList.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </Select>

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
            value={filterYear}
            onChange={(e) => setFilterYear(parseInt(e.target.value))}
          >
            {[2023, 2024, 2025, 2026].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </Select>

          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('');
              setFilterDepartment('');
              setFilterStatus('');
              setFilterYear(new Date().getFullYear());
            }}
          >
            إعادة تعيين
          </Button>
        </div>
      </Card>

      {/* جدول الميزانيات */}
      <Card>
        <Table
          data={filteredBudgets}
          columns={columns}
          searchable={false}
          pagination={true}
          pageSize={10}
        />
      </Card>

      {/* مودال إضافة/تعديل الميزانية */}
      <Modal
        isOpen={editModal}
        onClose={() => {
          setEditModal(false);
          resetForm();
          setSelectedBudget(null);
        }}
        title={selectedBudget ? 'تعديل الميزانية' : 'إضافة ميزانية جديدة'}
        size="lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="اسم الميزانية"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
          />

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
            label="السنة"
            type="number"
            value={formData.year}
            onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
            required
          />

          <Select
            label="الربع"
            value={formData.quarter}
            onChange={(e) => handleInputChange('quarter', e.target.value)}
          >
            <option value="1">الربع الأول</option>
            <option value="2">الربع الثاني</option>
            <option value="3">الربع الثالث</option>
            <option value="4">الربع الرابع</option>
          </Select>

          <Select
            label="نوع الميزانية"
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            required
          >
            {budgetTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
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
            label="المبلغ الإجمالي"
            type="number"
            value={formData.totalAmount}
            onChange={(e) => handleInputChange('totalAmount', e.target.value)}
            required
          />

          <Input
            label="المبلغ المعتمد"
            type="number"
            value={formData.approvedAmount}
            onChange={(e) => handleInputChange('approvedAmount', e.target.value)}
          />

          <Input
            label="تاريخ البداية"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
          />

          <Input
            label="تاريخ النهاية"
            type="date"
            value={formData.endDate}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
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
              placeholder="وصف الميزانية..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => {
              setEditModal(false);
              resetForm();
              setSelectedBudget(null);
            }}
          >
            إلغاء
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {selectedBudget ? 'تحديث' : 'حفظ'}
          </Button>
        </div>
      </Modal>

      {/* مودال عرض التفاصيل */}
      <Modal
        isOpen={viewModal}
        onClose={() => {
          setViewModal(false);
          setSelectedBudget(null);
        }}
        title="تفاصيل الميزانية"
        size="lg"
      >
        {selectedBudget && (
          <div className="space-y-6">
            {/* معلومات أساسية */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">المعلومات الأساسية</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">الاسم:</span>
                    <span className="font-medium">{selectedBudget.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">القسم:</span>
                    <span className="font-medium">{selectedBudget.departmentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">السنة:</span>
                    <span className="font-medium">{selectedBudget.year} - {selectedBudget.quarter}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">النوع:</span>
                    <span className="font-medium">
                      {budgetTypes.find(t => t.value === selectedBudget.type)?.label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">المعلومات المالية</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">المبلغ الإجمالي:</span>
                    <span className="font-medium">{formatCurrency(selectedBudget.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">المبلغ المعتمد:</span>
                    <span className="font-medium text-blue-600">{formatCurrency(selectedBudget.approvedAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">المبلغ المنفق:</span>
                    <span className="font-medium text-green-600">{formatCurrency(selectedBudget.spentAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">نسبة الإنفاق:</span>
                    <span className="font-medium text-purple-600">
                      {formatPercentage(getBudgetProgress(selectedBudget.spentAmount, selectedBudget.totalAmount))}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* حالة الاعتماد */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">معلومات الاعتماد</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {React.createElement(getStatusInfo(selectedBudget.status).icon, {
                      className: `text-2xl ${getStatusInfo(selectedBudget.status).color}`
                    })}
                  </div>
                  <div className={`text-sm font-medium ${getStatusInfo(selectedBudget.status).color}`}>
                    {getStatusInfo(selectedBudget.status).label}
                  </div>
                </div>
                
                {selectedBudget.approvedBy && (
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">تم الاعتماد بواسطة</div>
                    <div className="font-medium">{selectedBudget.approvedBy}</div>
                  </div>
                )}
                
                {selectedBudget.approvalDate && (
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">تاريخ الاعتماد</div>
                    <div className="font-medium">{selectedBudget.approvalDate}</div>
                  </div>
                )}
              </div>
            </div>

            {/* شريط التقدم */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">تقدم الإنفاق</h4>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min(getBudgetProgress(selectedBudget.spentAmount, selectedBudget.totalAmount), 100)}%` 
                  }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>{formatCurrency(selectedBudget.spentAmount)} منفق</span>
                <span>{formatCurrency(selectedBudget.totalAmount)} مخصص</span>
              </div>
            </div>

            {/* الوصف */}
            {selectedBudget.description && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">الوصف</h4>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                  {selectedBudget.description}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* مودال تأكيد الحذف */}
      <Modal
        isOpen={deleteModal}
        onClose={() => {
          setDeleteModal(false);
          setBudgetToDelete(null);
        }}
        title="تأكيد الحذف"
        size="sm"
      >
        <div className="text-center">
          <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
          <p className="text-gray-600 mb-6">
            هل أنت متأكد من حذف الميزانية "{budgetToDelete?.name}"؟
            <br />
            <span className="text-sm text-red-600">لا يمكن التراجع عن هذا الإجراء</span>
          </p>
          
          <div className="flex justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteModal(false);
                setBudgetToDelete(null);
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

export default Budgets;