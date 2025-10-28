// ======================================
// التنبؤات المالية والتشغيلية - Financial & Operational Forecasts
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
  FaChartLine, 
  FaExclamationTriangle, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaEye,
  FaDownload,
  FaUpload,
  FaCalendarAlt,
  FaDollarSign,
  FaTrendingUp,
  FaTrendingDown,
  FaMinus,
  FaChartBar,
  FaPieChart,
  FaCogs,
  FaRobot,
  FaHistory
} from 'react-icons/fa';

const Forecasts = () => {
  const { forecasts, departments, addForecast, updateForecast, deleteForecast } = useData();
  const { showSuccess, showError } = useNotification();

  const [editModal, setEditModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [generateModal, setGenerateModal] = useState(false);
  const [selectedForecast, setSelectedForecast] = useState(null);
  const [forecastToDelete, setForecastToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    type: 'financial',
    category: 'revenue',
    period: 'monthly',
    startDate: '',
    endDate: '',
    departmentId: '',
    baseValue: '',
    growthRate: '',
    confidenceLevel: '',
    methodology: 'linear',
    assumptions: '',
    description: '',
    values: [],
    variables: []
  });

  // بيانات وهمية للتنبؤات
  const mockForecasts = [
    {
      id: '1',
      name: 'توقعات المبيعات Q1 2025',
      type: 'financial',
      category: 'revenue',
      period: 'quarterly',
      startDate: '2025-01-01',
      endDate: '2025-03-31',
      departmentId: 'sales',
      departmentName: 'المبيعات',
      baseValue: 800000,
      growthRate: 15.5,
      confidenceLevel: 85,
      methodology: 'trend',
      status: 'active',
      actualValue: 0,
      variance: 0,
      lastUpdated: '2024-12-20',
      createdBy: 'محلل مالي'
    },
    {
      id: '2',
      name: 'توقعات المصروفات التشغيلية 2025',
      type: 'financial',
      category: 'expense',
      period: 'monthly',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      departmentId: 'finance',
      departmentName: 'المالية',
      baseValue: 1200000,
      growthRate: 8.2,
      confidenceLevel: 78,
      methodology: 'seasonal',
      status: 'active',
      actualValue: 0,
      variance: 0,
      lastUpdated: '2024-12-18',
      createdBy: 'مدير المالية'
    },
    {
      id: '3',
      name: 'توقعات الإنتاج الشهري',
      type: 'operational',
      category: 'production',
      period: 'monthly',
      startDate: '2025-01-01',
      endDate: '2025-06-30',
      departmentId: 'production',
      departmentName: 'الإنتاج',
      baseValue: 5000,
      growthRate: 12.0,
      confidenceLevel: 82,
      methodology: 'capacity',
      status: 'active',
      actualValue: 0,
      variance: 0,
      lastUpdated: '2024-12-15',
      createdBy: 'مدير الإنتاج'
    },
    {
      id: '4',
      name: 'توقعات رأس المال العامل',
      type: 'financial',
      category: 'working_capital',
      period: 'quarterly',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      departmentId: 'finance',
      departmentName: 'المالية',
      baseValue: 2000000,
      growthRate: 10.0,
      confidenceLevel: 90,
      methodology: 'regression',
      status: 'draft',
      actualValue: 0,
      variance: 0,
      lastUpdated: '2024-12-10',
      createdBy: 'كبير المحاسبين'
    }
  ];

  const forecastTypes = [
    { value: 'financial', label: 'مالية' },
    { value: 'operational', label: 'تشغيلية' },
    { value: 'market', label: 'السوق' },
    { value: 'risk', label: 'المخاطر' }
  ];

  const forecastCategories = [
    { value: 'revenue', label: 'الإيرادات' },
    { value: 'expense', label: 'المصروفات' },
    { value: 'production', label: 'الإنتاج' },
    { value: 'sales', label: 'المبيعات' },
    { value: 'inventory', label: 'المخزون' },
    { value: 'working_capital', label: 'رأس المال العامل' },
    { value: 'cash_flow', label: 'التدفق النقدي' }
  ];

  const periods = [
    { value: 'weekly', label: 'أسبوعي' },
    { value: 'monthly', label: 'شهري' },
    { value: 'quarterly', label: 'ربع سنوي' },
    { value: 'semi_annual', label: 'نصف سنوي' },
    { value: 'annual', label: 'سنوي' }
  ];

  const methodologies = [
    { value: 'linear', label: 'خطي بسيط' },
    { value: 'trend', label: 'الاتجاه' },
    { value: 'seasonal', label: 'الموسمي' },
    { value: 'regression', label: 'الانحدار' },
    { value: 'moving_average', label: 'المتوسط المتحرك' },
    { value: 'exponential', label: 'الأسي' },
    { value: 'capacity', label: 'الطاقة الاستيعابية' }
  ];

  const departmentsList = [
    { id: 'sales', name: 'المبيعات' },
    { id: 'production', name: 'الإنتاج' },
    { id: 'finance', name: 'المالية' },
    { id: 'marketing', name: 'التسويق' },
    { id: 'hr', name: 'الموارد البشرية' },
    { id: 'it', name: 'تقنية المعلومات' }
  ];

  // تصفية التنبؤات
  const filteredForecasts = mockForecasts.filter(forecast => {
    const matchesSearch = forecast.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         forecast.departmentName.includes(searchTerm);
    const matchesType = !filterType || forecast.type === filterType;
    const matchesPeriod = !filterPeriod || forecast.period === filterPeriod;
    
    return matchesSearch && matchesType && matchesPeriod;
  });

  // حساب الإحصائيات
  const forecastStats = {
    total: mockForecasts.length,
    financial: mockForecasts.filter(f => f.type === 'financial').length,
    operational: mockForecasts.filter(f => f.type === 'operational').length,
    avgConfidence: mockForecasts.reduce((sum, f) => sum + f.confidenceLevel, 0) / mockForecasts.length,
    totalValue: mockForecasts.reduce((sum, f) => sum + f.baseValue, 0)
  };

  const getCategoryIcon = (category) => {
    const icons = {
      revenue: FaTrendingUp,
      expense: FaTrendingDown,
      production: FaCogs,
      sales: FaChartBar,
      inventory: FaChartBar,
      working_capital: FaDollarSign,
      cash_flow: FaChartLine
    };
    return icons[category] || FaChartLine;
  };

  const getCategoryColor = (category) => {
    const colors = {
      revenue: 'text-green-600',
      expense: 'text-red-600',
      production: 'text-blue-600',
      sales: 'text-purple-600',
      inventory: 'text-orange-600',
      working_capital: 'text-indigo-600',
      cash_flow: 'text-cyan-600'
    };
    return colors[category] || 'text-gray-600';
  };

  const getConfidenceColor = (level) => {
    if (level >= 85) return 'text-green-600';
    if (level >= 70) return 'text-yellow-600';
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
      type: 'financial',
      category: 'revenue',
      period: 'monthly',
      startDate: '',
      endDate: '',
      departmentId: '',
      baseValue: '',
      growthRate: '',
      confidenceLevel: '',
      methodology: 'linear',
      assumptions: '',
      description: '',
      values: [],
      variables: []
    });
  };

  const handleSave = async () => {
    try {
      if (selectedForecast) {
        await updateForecast(selectedForecast.id, formData);
        showSuccess('تم تحديث التنبؤ بنجاح');
      } else {
        await addForecast(formData);
        showSuccess('تم إضافة التنبؤ بنجاح');
      }
      setEditModal(false);
      resetForm();
      setSelectedForecast(null);
    } catch (error) {
      showError('حدث خطأ أثناء حفظ التنبؤ');
    }
  };

  const handleEdit = (forecast) => {
    setSelectedForecast(forecast);
    setFormData({
      name: forecast.name,
      type: forecast.type,
      category: forecast.category,
      period: forecast.period,
      startDate: forecast.startDate,
      endDate: forecast.endDate,
      departmentId: forecast.departmentId,
      baseValue: forecast.baseValue.toString(),
      growthRate: forecast.growthRate.toString(),
      confidenceLevel: forecast.confidenceLevel.toString(),
      methodology: forecast.methodology,
      assumptions: '',
      description: forecast.description || ''
    });
    setEditModal(true);
  };

  const handleView = (forecast) => {
    setSelectedForecast(forecast);
    setViewModal(true);
  };

  const handleDelete = (forecast) => {
    setForecastToDelete(forecast);
    setDeleteModal(true);
  };

  const handleGenerateForecast = () => {
    setGenerateModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteForecast(forecastToDelete.id);
      showSuccess('تم حذف التنبؤ بنجاح');
      setDeleteModal(false);
      setForecastToDelete(null);
    } catch (error) {
      showError('حدث خطأ أثناء حذف التنبؤ');
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

  const formatNumber = (value) => {
    return new Intl.NumberFormat('ar-SA').format(value);
  };

  const columns = [
    {
      key: 'name',
      title: 'اسم التنبؤ',
      render: (value, item) => (
        <div>
          <div className="font-semibold text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{item.departmentName}</div>
        </div>
      )
    },
    {
      key: 'type',
      title: 'النوع/الفئة',
      render: (value, item) => {
        const CategoryIcon = getCategoryIcon(item.category);
        return (
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">
              {forecastTypes.find(t => t.value === value)?.label}
            </div>
            <div className="flex items-center justify-center gap-1">
              <CategoryIcon className={`${getCategoryColor(item.category)} text-sm`} />
              <span className={`text-xs font-medium ${getCategoryColor(item.category)}`}>
                {forecastCategories.find(c => c.value === item.category)?.label}
              </span>
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
          <div className="font-semibold">{periods.find(p => p.value === value)?.label}</div>
          <div className="text-xs text-gray-500">
            {item.startDate} - {item.endDate}
          </div>
        </div>
      )
    },
    {
      key: 'baseValue',
      title: 'القيمة الأساسية',
      render: (value, item) => (
        <div className="text-right">
          <div className="font-semibold text-gray-900">
            {item.type === 'financial' ? formatCurrency(value) : formatNumber(value)}
          </div>
          <div className="text-xs text-gray-500">
            نمو: {formatPercentage(item.growthRate)}
          </div>
        </div>
      )
    },
    {
      key: 'confidenceLevel',
      title: 'مستوى الثقة',
      render: (value) => (
        <div className="text-center">
          <div className={`font-semibold ${getConfidenceColor(value)}`}>
            {formatPercentage(value)}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                value >= 85 ? 'bg-green-500' : 
                value >= 70 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${value}%` }}
            />
          </div>
        </div>
      )
    },
    {
      key: 'methodology',
      title: 'المنهجية',
      render: (value) => (
        <div className="text-xs text-center">
          <div className="font-medium text-gray-900">
            {methodologies.find(m => m.value === value)?.label}
          </div>
        </div>
      )
    },
    {
      key: 'lastUpdated',
      title: 'آخر تحديث',
      render: (value) => (
        <div className="text-center text-sm">
          <div className="text-gray-600">{value}</div>
        </div>
      )
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">التنبؤات المالية والتشغيلية</h1>
            <p className="text-gray-600">تحليل وتنبؤ بالاتجاهات المالية والتشغيلية المستقبلية</p>
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
              variant="outline" 
              icon={FaRobot}
              onClick={handleGenerateForecast}
              className="text-sm"
            >
              توليد تلقائي
            </Button>
            <Button 
              onClick={() => setEditModal(true)}
              icon={FaPlus}
              variant="primary"
            >
              إضافة تنبؤ
            </Button>
          </div>
        </div>

        {/* بطاقات الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">إجمالي التنبؤات</p>
                <p className="text-2xl font-bold">{forecastStats.total}</p>
              </div>
              <FaChartLine className="text-blue-200 text-3xl" />
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">تنبؤات مالية</p>
                <p className="text-2xl font-bold">{forecastStats.financial}</p>
              </div>
              <FaDollarSign className="text-green-200 text-3xl" />
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">تنبؤات تشغيلية</p>
                <p className="text-2xl font-bold">{forecastStats.operational}</p>
              </div>
              <FaCogs className="text-purple-200 text-3xl" />
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">متوسط الثقة</p>
                <p className="text-2xl font-bold">{forecastStats.avgConfidence.toFixed(0)}%</p>
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
            placeholder="البحث في التنبؤات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={FaSearch}
          />
          
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">جميع الأنواع</option>
            {forecastTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </Select>

          <Select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
          >
            <option value="">جميع الفترات</option>
            {periods.map(period => (
              <option key={period.value} value={period.value}>{period.label}</option>
            ))}
          </Select>

          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('');
              setFilterType('');
              setFilterPeriod('');
            }}
          >
            إعادة تعيين
          </Button>
        </div>
      </Card>

      {/* جدول التنبؤات */}
      <Card>
        <Table
          data={filteredForecasts}
          columns={columns}
          searchable={false}
          pagination={true}
          pageSize={10}
        />
      </Card>

      {/* مودال إضافة/تعديل التنبؤ */}
      <Modal
        isOpen={editModal}
        onClose={() => {
          setEditModal(false);
          resetForm();
          setSelectedForecast(null);
        }}
        title={selectedForecast ? 'تعديل التنبؤ' : 'إضافة تنبؤ جديد'}
        size="lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="اسم التنبؤ"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          <Select
            label="نوع التنبؤ"
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            required
          >
            {forecastTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </Select>

          <Select
            label="فئة التنبؤ"
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            required
          >
            {forecastCategories.map(category => (
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

          <Select
            label="فترة التنبؤ"
            value={formData.period}
            onChange={(e) => handleInputChange('period', e.target.value)}
            required
          >
            {periods.map(period => (
              <option key={period.value} value={period.value}>{period.label}</option>
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
            label="القيمة الأساسية"
            type="number"
            value={formData.baseValue}
            onChange={(e) => handleInputChange('baseValue', e.target.value)}
            required
          />

          <Input
            label="معدل النمو (%)"
            type="number"
            step="0.1"
            value={formData.growthRate}
            onChange={(e) => handleInputChange('growthRate', e.target.value)}
            required
          />

          <Input
            label="مستوى الثقة (%)"
            type="number"
            min="0"
            max="100"
            value={formData.confidenceLevel}
            onChange={(e) => handleInputChange('confidenceLevel', e.target.value)}
            required
          />

          <Select
            label="منهجية التنبؤ"
            value={formData.methodology}
            onChange={(e) => handleInputChange('methodology', e.target.value)}
          >
            {methodologies.map(method => (
              <option key={method.value} value={method.value}>{method.label}</option>
            ))}
          </Select>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الافتراضات والمتغيرات
            </label>
            <textarea
              value={formData.assumptions}
              onChange={(e) => handleInputChange('assumptions', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="الافتراضات والمتغيرات المؤثرة على التنبؤ..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الوصف
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="وصف التنبؤ..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => {
              setEditModal(false);
              resetForm();
              setSelectedForecast(null);
            }}
          >
            إلغاء
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {selectedForecast ? 'تحديث' : 'حفظ'}
          </Button>
        </div>
      </Modal>

      {/* مودال عرض التفاصيل */}
      <Modal
        isOpen={viewModal}
        onClose={() => {
          setViewModal(false);
          setSelectedForecast(null);
        }}
        title="تفاصيل التنبؤ"
        size="lg"
      >
        {selectedForecast && (
          <div className="space-y-6">
            {/* معلومات أساسية */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">المعلومات الأساسية</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">الاسم:</span>
                    <span className="font-medium">{selectedForecast.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">النوع:</span>
                    <span className="font-medium">
                      {forecastTypes.find(t => t.value === selectedForecast.type)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الفئة:</span>
                    <span className="font-medium">
                      {forecastCategories.find(c => c.value === selectedForecast.category)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">القسم:</span>
                    <span className="font-medium">{selectedForecast.departmentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الفترة:</span>
                    <span className="font-medium">
                      {periods.find(p => p.value === selectedForecast.period)?.label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">القيم والمؤشرات</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">القيمة الأساسية:</span>
                    <span className="font-medium">
                      {selectedForecast.type === 'financial' 
                        ? formatCurrency(selectedForecast.baseValue)
                        : formatNumber(selectedForecast.baseValue)
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">معدل النمو:</span>
                    <span className="font-medium text-green-600">
                      {formatPercentage(selectedForecast.growthRate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">مستوى الثقة:</span>
                    <span className={`font-medium ${getConfidenceColor(selectedForecast.confidenceLevel)}`}>
                      {formatPercentage(selectedForecast.confidenceLevel)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">المنهجية:</span>
                    <span className="font-medium">
                      {methodologies.find(m => m.value === selectedForecast.methodology)?.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* الفترة الزمنية */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">الفترة الزمنية</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">تاريخ البداية</div>
                  <div className="font-medium">{selectedForecast.startDate}</div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">تاريخ النهاية</div>
                  <div className="font-medium">{selectedForecast.endDate}</div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">آخر تحديث</div>
                  <div className="font-medium">{selectedForecast.lastUpdated}</div>
                </div>
              </div>
            </div>

            {/* شريط مستوى الثقة */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">مستوى الثقة</h4>
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div 
                  className={`h-6 rounded-full flex items-center justify-center text-white text-sm font-medium transition-all duration-300 ${
                    selectedForecast.confidenceLevel >= 85 ? 'bg-green-500' : 
                    selectedForecast.confidenceLevel >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${selectedForecast.confidenceLevel}%` }}
                >
                  {formatPercentage(selectedForecast.confidenceLevel)}
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>منخفض</span>
                <span>متوسط</span>
                <span>عالي</span>
              </div>
            </div>

            {/* الوصف والافتراضات */}
            {selectedForecast.description && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">الوصف</h4>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                  {selectedForecast.description}
                </p>
              </div>
            )}

            {selectedForecast.assumptions && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">الافتراضات والمتغيرات</h4>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                  {selectedForecast.assumptions}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* مودال توليد تلقائي */}
      <Modal
        isOpen={generateModal}
        onClose={() => setGenerateModal(false)}
        title="توليد تنبؤ تلقائي"
        size="md"
      >
        <div className="space-y-4">
          <div className="text-center mb-6">
            <FaRobot className="text-blue-500 text-4xl mx-auto mb-3" />
            <p className="text-gray-600">
              سيتم توليد تنبؤ تلقائي بناءً على البيانات التاريخية والاتجاهات
            </p>
          </div>

          <Select
            label="نوع التنبؤ"
            defaultValue="financial"
          >
            <option value="financial">مالية</option>
            <option value="operational">تشغيلية</option>
          </Select>

          <Select
            label="فترة التنبؤ"
            defaultValue="quarterly"
          >
            <option value="monthly">شهري</option>
            <option value="quarterly">ربع سنوي</option>
            <option value="annual">سنوي</option>
          </Select>

          <Select
            label="القسم"
            defaultValue="sales"
          >
            <option value="sales">المبيعات</option>
            <option value="production">الإنتاج</option>
            <option value="finance">المالية</option>
          </Select>

          <div className="flex justify-center gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setGenerateModal(false)}
            >
              إلغاء
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                showSuccess('تم بدء عملية التوليد التلقائي');
                setGenerateModal(false);
              }}
              icon={FaRobot}
            >
              توليد
            </Button>
          </div>
        </div>
      </Modal>

      {/* مودال تأكيد الحذف */}
      <Modal
        isOpen={deleteModal}
        onClose={() => {
          setDeleteModal(false);
          setForecastToDelete(null);
        }}
        title="تأكيد الحذف"
        size="sm"
      >
        <div className="text-center">
          <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
          <p className="text-gray-600 mb-6">
            هل أنت متأكد من حذف التنبؤ "{forecastToDelete?.name}"؟
            <br />
            <span className="text-sm text-red-600">لا يمكن التراجع عن هذا الإجراء</span>
          </p>
          
          <div className="flex justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteModal(false);
                setForecastToDelete(null);
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

export default Forecasts;