import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaFilter,
  FaClipboardCheck,
  FaCheck,
  FaTimes
} from 'react-icons/fa';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Table from '../../components/Common/Table';
import Modal from '../../components/Common/Modal';
import Input from '../../components/Common/Input';
import Select from '../../components/Common/Select';
import Loading from '../../components/Common/Loading';
import { useNotification } from '../../context/NotificationContext';
import qualityService from '../../services/qualityService';
import { useAuth } from '../../context/AuthContext';

const QualityStandards = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [standards, setStandards] = useState([]);
  const [filteredStandards, setFilteredStandards] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStandard, setSelectedStandard] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // نموذج إضافة/تعديل معيار الجودة
  const [formData, setFormData] = useState({
    standard_name: '',
    description: '',
    standard_type: 'inspection',
    applicable_to: 'product',
    applicable_id: '',
    acceptance_criteria: '',
    measurement_method: '',
    frequency: 'daily',
    responsible_department_id: '',
    status: 'active'
  });

  useEffect(() => {
    loadStandards();
  }, []);

  useEffect(() => {
    filterStandards();
  }, [standards, searchTerm, filterStatus, filterType]);

  const loadStandards = async () => {
    if (!user?.organization_id) return;

    setLoading(true);
    try {
      const data = await qualityService.getQualityStandards(user.organization_id);
      setStandards(data);
    } catch (error) {
      console.error('Error loading standards:', error);
      addNotification('خطأ في تحميل معايير الجودة', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterStandards = () => {
    let filtered = [...standards];

    // البحث
    if (searchTerm) {
      filtered = filtered.filter(standard =>
        standard.standard_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        standard.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // التصفية حسب الحالة
    if (filterStatus !== 'all') {
      filtered = filtered.filter(standard => standard.status === filterStatus);
    }

    // التصفية حسب النوع
    if (filterType !== 'all') {
      filtered = filtered.filter(standard => standard.standard_type === filterType);
    }

    setFilteredStandards(filtered);
  };

  const handleAdd = () => {
    setFormData({
      standard_name: '',
      description: '',
      standard_type: 'inspection',
      applicable_to: 'product',
      applicable_id: '',
      acceptance_criteria: '',
      measurement_method: '',
      frequency: 'daily',
      responsible_department_id: '',
      status: 'active'
    });
    setSelectedStandard(null);
    setShowAddModal(true);
  };

  const handleEdit = (standard) => {
    setFormData({
      standard_name: standard.standard_name,
      description: standard.description || '',
      standard_type: standard.standard_type || 'inspection',
      applicable_to: standard.applicable_to || 'product',
      applicable_id: standard.applicable_id || '',
      acceptance_criteria: standard.acceptance_criteria || '',
      measurement_method: standard.measurement_method || '',
      frequency: standard.frequency || 'daily',
      responsible_department_id: standard.responsible_department_id || '',
      status: standard.status || 'active'
    });
    setSelectedStandard(standard);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المعيار؟')) {
      return;
    }

    try {
      await qualityService.deleteQualityStandard(id);
      addNotification('تم حذف المعيار بنجاح', 'success');
      loadStandards();
    } catch (error) {
      console.error('Error deleting standard:', error);
      addNotification('خطأ في حذف المعيار', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.standard_name.trim()) {
      addNotification('يرجى إدخال اسم المعيار', 'warning');
      return;
    }

    try {
      const standardData = {
        ...formData,
        organization_id: user.organization_id
      };

      if (selectedStandard) {
        await qualityService.updateQualityStandard(selectedStandard.id, standardData);
        addNotification('تم تحديث المعيار بنجاح', 'success');
        setShowEditModal(false);
      } else {
        await qualityService.createQualityStandard(standardData);
        addNotification('تم إضافة المعيار بنجاح', 'success');
        setShowAddModal(false);
      }

      loadStandards();
    } catch (error) {
      console.error('Error saving standard:', error);
      addNotification('خطأ في حفظ المعيار', 'error');
    }
  };

  const getTypeLabel = (type) => {
    const types = {
      'inspection': 'فحص',
      'test': 'اختبار',
      'process': 'عملية',
      'product': 'منتج'
    };
    return types[type] || type;
  };

  const getFrequencyLabel = (frequency) => {
    const frequencies = {
      'continuous': 'مستمر',
      'daily': 'يومي',
      'weekly': 'أسبوعي',
      'monthly': 'شهري',
      'quarterly': 'ربع سنوي',
      'annually': 'سنوي'
    };
    return frequencies[frequency] || frequency;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">معايير الجودة</h2>
          <p className="text-gray-600 mt-1">إدارة معايير وإجراءات ضمان الجودة</p>
        </div>
        <Button onClick={handleAdd}>
          <FaPlus className="mr-2" />
          إضافة معيار جديد
        </Button>
      </div>

      <Card>
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="البحث في المعايير..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<FaSearch />}
            />
          </div>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: 'all', label: 'جميع الحالات' },
              { value: 'active', label: 'نشط' },
              { value: 'inactive', label: 'غير نشط' }
            ]}
          />
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            options={[
              { value: 'all', label: 'جميع الأنواع' },
              { value: 'inspection', label: 'فحص' },
              { value: 'test', label: 'اختبار' },
              { value: 'process', label: 'عملية' },
              { value: 'product', label: 'منتج' }
            ]}
          />
        </div>

        <Table
          data={filteredStandards}
          columns={[
            { 
              key: 'standard_name', 
              label: 'اسم المعيار',
              render: (value) => (
                <div className="font-medium text-gray-900">{value}</div>
              )
            },
            { 
              key: 'standard_type', 
              label: 'النوع',
              render: (value) => (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {getTypeLabel(value)}
                </span>
              )
            },
            { 
              key: 'applicable_to', 
              label: 'ينطبق على',
              render: (value) => {
                const labels = {
                  'product': 'المنتج',
                  'process': 'العملية',
                  'service': 'الخدمة'
                };
                return (
                  <span className="text-sm text-gray-600">
                    {labels[value] || value}
                  </span>
                );
              }
            },
            { 
              key: 'frequency', 
              label: 'التكرار',
              render: (value) => (
                <span className="text-sm text-gray-600">
                  {getFrequencyLabel(value)}
                </span>
              )
            },
            { 
              key: 'status', 
              label: 'الحالة',
              render: (value) => (
                <div className="flex items-center">
                  {value === 'active' ? (
                    <FaCheck className="text-green-500 mr-1" />
                  ) : (
                    <FaTimes className="text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    value === 'active' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {value === 'active' ? 'نشط' : 'غير نشط'}
                  </span>
                </div>
              )
            },
            {
              key: 'actions',
              label: 'الإجراءات',
              render: (value, item) => (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" title="عرض">
                    <FaEye />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    title="تعديل"
                    onClick={() => handleEdit(item)}
                  >
                    <FaEdit />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    title="حذف"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(item.id)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              )
            }
          ]}
          emptyMessage="لا توجد معايير جودة مطابقة للبحث"
        />
      </Card>

      {/* نافذة إضافة معيار جديد */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="إضافة معيار جودة جديد"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم المعيار *
              </label>
              <Input
                value={formData.standard_name}
                onChange={(e) => setFormData({...formData, standard_name: e.target.value})}
                placeholder="أدخل اسم المعيار"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع المعيار
              </label>
              <Select
                value={formData.standard_type}
                onChange={(e) => setFormData({...formData, standard_type: e.target.value})}
                options={[
                  { value: 'inspection', label: 'فحص' },
                  { value: 'test', label: 'اختبار' },
                  { value: 'process', label: 'عملية' },
                  { value: 'product', label: 'منتج' }
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ينطبق على
              </label>
              <Select
                value={formData.applicable_to}
                onChange={(e) => setFormData({...formData, applicable_to: e.target.value})}
                options={[
                  { value: 'product', label: 'المنتج' },
                  { value: 'process', label: 'العملية' },
                  { value: 'service', label: 'الخدمة' }
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تكرار التطبيق
              </label>
              <Select
                value={formData.frequency}
                onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                options={[
                  { value: 'continuous', label: 'مستمر' },
                  { value: 'daily', label: 'يومي' },
                  { value: 'weekly', label: 'أسبوعي' },
                  { value: 'monthly', label: 'شهري' },
                  { value: 'quarterly', label: 'ربع سنوي' },
                  { value: 'annually', label: 'سنوي' }
                ]}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الوصف
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="وصف تفصيلي للمعيار"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              معايير القبول
            </label>
            <textarea
              value={formData.acceptance_criteria}
              onChange={(e) => setFormData({...formData, acceptance_criteria: e.target.value})}
              placeholder="معايير قبول أو رفض المنتج/الخدمة"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              طريقة القياس
            </label>
            <textarea
              value={formData.measurement_method}
              onChange={(e) => setFormData({...formData, measurement_method: e.target.value})}
              placeholder="كيفية قياس أو اختبار المعيار"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowAddModal(false)}
            >
              إلغاء
            </Button>
            <Button type="submit">
              حفظ المعيار
            </Button>
          </div>
        </form>
      </Modal>

      {/* نافذة تعديل معيار موجود */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="تعديل معيار الجودة"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم المعيار *
              </label>
              <Input
                value={formData.standard_name}
                onChange={(e) => setFormData({...formData, standard_name: e.target.value})}
                placeholder="أدخل اسم المعيار"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع المعيار
              </label>
              <Select
                value={formData.standard_type}
                onChange={(e) => setFormData({...formData, standard_type: e.target.value})}
                options={[
                  { value: 'inspection', label: 'فحص' },
                  { value: 'test', label: 'اختبار' },
                  { value: 'process', label: 'عملية' },
                  { value: 'product', label: 'منتج' }
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ينطبق على
              </label>
              <Select
                value={formData.applicable_to}
                onChange={(e) => setFormData({...formData, applicable_to: e.target.value})}
                options={[
                  { value: 'product', label: 'المنتج' },
                  { value: 'process', label: 'العملية' },
                  { value: 'service', label: 'الخدمة' }
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تكرار التطبيق
              </label>
              <Select
                value={formData.frequency}
                onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                options={[
                  { value: 'continuous', label: 'مستمر' },
                  { value: 'daily', label: 'يومي' },
                  { value: 'weekly', label: 'أسبوعي' },
                  { value: 'monthly', label: 'شهري' },
                  { value: 'quarterly', label: 'ربع سنوي' },
                  { value: 'annually', label: 'سنوي' }
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الحالة
              </label>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                options={[
                  { value: 'active', label: 'نشط' },
                  { value: 'inactive', label: 'غير نشط' }
                ]}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الوصف
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="وصف تفصيلي للمعيار"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              معايير القبول
            </label>
            <textarea
              value={formData.acceptance_criteria}
              onChange={(e) => setFormData({...formData, acceptance_criteria: e.target.value})}
              placeholder="معايير قبول أو رفض المنتج/الخدمة"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              طريقة القياس
            </label>
            <textarea
              value={formData.measurement_method}
              onChange={(e) => setFormData({...formData, measurement_method: e.target.value})}
              placeholder="كيفية قياس أو اختبار المعيار"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowEditModal(false)}
            >
              إلغاء
            </Button>
            <Button type="submit">
              حفظ التعديلات
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default QualityStandards;