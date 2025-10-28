import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaEye, 
  FaEdit, 
  FaSearch, 
  FaFilter,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaClipboardCheck,
  FaCertificate,
  FaExclamationTriangle
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

const QualityInspections = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [inspections, setInspections] = useState([]);
  const [filteredInspections, setFilteredInspections] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // نموذج إضافة فحص جديد
  const [formData, setFormData] = useState({
    inspection_number: '',
    inspection_type: 'incoming',
    product_id: '',
    production_order_id: '',
    inspection_date: new Date().toISOString().split('T')[0],
    inspector_id: user?.id || '',
    batch_number: '',
    sample_size: '',
    defective_count: 0,
    status: 'pending',
    remarks: ''
  });

  useEffect(() => {
    loadInspections();
  }, []);

  useEffect(() => {
    filterInspections();
  }, [inspections, searchTerm, filterStatus, filterType]);

  const loadInspections = async () => {
    if (!user?.organization_id) return;

    setLoading(true);
    try {
      const data = await qualityService.getInspections(user.organization_id);
      setInspections(data);
    } catch (error) {
      console.error('Error loading inspections:', error);
      addNotification('خطأ في تحميل الفحوصات', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterInspections = () => {
    let filtered = [...inspections];

    // البحث
    if (searchTerm) {
      filtered = filtered.filter(inspection =>
        inspection.inspection_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inspection.products?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // التصفية حسب الحالة
    if (filterStatus !== 'all') {
      filtered = filtered.filter(inspection => inspection.status === filterStatus);
    }

    // التصفية حسب النوع
    if (filterType !== 'all') {
      filtered = filtered.filter(inspection => inspection.inspection_type === filterType);
    }

    setFilteredInspections(filtered);
  };

  const generateInspectionNumber = () => {
    const prefix = 'QI';
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${year}${month}-${random}`;
  };

  const handleAdd = () => {
    setFormData({
      inspection_number: generateInspectionNumber(),
      inspection_type: 'incoming',
      product_id: '',
      production_order_id: '',
      inspection_date: new Date().toISOString().split('T')[0],
      inspector_id: user?.id || '',
      batch_number: '',
      sample_size: '',
      defective_count: 0,
      status: 'pending',
      remarks: ''
    });
    setSelectedInspection(null);
    setShowAddModal(true);
  };

  const handleView = async (inspection) => {
    try {
      const detailedInspection = await qualityService.getInspection(inspection.id);
      setSelectedInspection(detailedInspection);
      setShowViewModal(true);
    } catch (error) {
      console.error('Error loading inspection details:', error);
      addNotification('خطأ في تحميل تفاصيل الفحص', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.inspection_number.trim()) {
      addNotification('يرجى إدخال رقم الفحص', 'warning');
      return;
    }

    try {
      const inspectionData = {
        ...formData,
        organization_id: user.organization_id,
        defective_count: parseInt(formData.defective_count) || 0,
        sample_size: formData.sample_size ? parseInt(formData.sample_size) : null
      };

      await qualityService.createInspection(inspectionData);
      addNotification('تم إضافة الفحص بنجاح', 'success');
      setShowAddModal(false);
      loadInspections();
    } catch (error) {
      console.error('Error creating inspection:', error);
      addNotification('خطأ في حفظ الفحص', 'error');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed':
        return <FaCheckCircle className="text-green-500" />;
      case 'failed':
        return <FaTimesCircle className="text-red-500" />;
      case 'conditional':
        return <FaExclamationTriangle className="text-yellow-500" />;
      default:
        return <FaClock className="text-gray-400" />;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'معلق',
      'passed': 'نجح',
      'failed': 'فشل',
      'conditional': 'مشروط'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'passed':
        return 'text-green-600 bg-green-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      case 'conditional':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeLabel = (type) => {
    const types = {
      'incoming': 'استلام',
      'in_process': 'أثناء الإنتاج',
      'final': 'نهائي',
      'customer_return': 'إرجاع العميل'
    };
    return types[type] || type;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">فحوصات الجودة</h2>
          <p className="text-gray-600 mt-1">إدارة ومراقبة فحوصات الجودة للمنتجات</p>
        </div>
        <Button onClick={handleAdd}>
          <FaPlus className="mr-2" />
          فحص جديد
        </Button>
      </div>

      <Card>
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="البحث في الفحوصات..."
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
              { value: 'pending', label: 'معلق' },
              { value: 'passed', label: 'نجح' },
              { value: 'failed', label: 'فشل' },
              { value: 'conditional', label: 'مشروط' }
            ]}
          />
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            options={[
              { value: 'all', label: 'جميع الأنواع' },
              { value: 'incoming', label: 'استلام' },
              { value: 'in_process', label: 'أثناء الإنتاج' },
              { value: 'final', label: 'نهائي' },
              { value: 'customer_return', label: 'إرجاع العميل' }
            ]}
          />
        </div>

        <Table
          data={filteredInspections}
          columns={[
            { 
              key: 'inspection_number', 
              label: 'رقم الفحص',
              render: (value) => (
                <div className="font-mono text-sm font-medium text-blue-600">{value}</div>
              )
            },
            { 
              key: 'inspection_type', 
              label: 'نوع الفحص',
              render: (value) => (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                  {getTypeLabel(value)}
                </span>
              )
            },
            { 
              key: 'product_name', 
              label: 'المنتج',
              render: (value, item) => (
                <div className="text-sm text-gray-900">
                  {item.products?.name || 'غير محدد'}
                </div>
              )
            },
            { 
              key: 'inspection_date', 
              label: 'تاريخ الفحص',
              render: (value) => (
                <span className="text-sm text-gray-600">
                  {value ? new Date(value).toLocaleDateString('ar-SA') : '-'}
                </span>
              )
            },
            { 
              key: 'inspector_name', 
              label: 'المفحص',
              render: (value, item) => {
                const inspector = item.employees;
                return (
                  <span className="text-sm text-gray-600">
                    {inspector ? `${inspector.first_name} ${inspector.last_name}` : '-'}
                  </span>
                );
              }
            },
            { 
              key: 'status', 
              label: 'النتيجة',
              render: (value) => (
                <div className="flex items-center">
                  {getStatusIcon(value)}
                  <span className={`mr-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
                    {getStatusLabel(value)}
                  </span>
                </div>
              )
            },
            {
              key: 'actions',
              label: 'الإجراءات',
              render: (value, item) => (
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    title="عرض التفاصيل"
                    onClick={() => handleView(item)}
                  >
                    <FaEye />
                  </Button>
                  <Button size="sm" variant="outline" title="تعديل">
                    <FaEdit />
                  </Button>
                </div>
              )
            }
          ]}
          emptyMessage="لا توجد فحوصات مطابقة للبحث"
        />
      </Card>

      {/* نافذة إضافة فحص جديد */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="إضافة فحص جودة جديد"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم الفحص *
              </label>
              <Input
                value={formData.inspection_number}
                onChange={(e) => setFormData({...formData, inspection_number: e.target.value})}
                placeholder="رقم الفحص"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع الفحص
              </label>
              <Select
                value={formData.inspection_type}
                onChange={(e) => setFormData({...formData, inspection_type: e.target.value})}
                options={[
                  { value: 'incoming', label: 'استلام' },
                  { value: 'in_process', label: 'أثناء الإنتاج' },
                  { value: 'final', label: 'نهائي' },
                  { value: 'customer_return', label: 'إرجاع العميل' }
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تاريخ الفحص
              </label>
              <Input
                type="date"
                value={formData.inspection_date}
                onChange={(e) => setFormData({...formData, inspection_date: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم الدفعة
              </label>
              <Input
                value={formData.batch_number}
                onChange={(e) => setFormData({...formData, batch_number: e.target.value})}
                placeholder="رقم الدفعة"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                حجم العينة
              </label>
              <Input
                type="number"
                value={formData.sample_size}
                onChange={(e) => setFormData({...formData, sample_size: e.target.value})}
                placeholder="عدد القطع المفحوصة"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عدد المعيب
              </label>
              <Input
                type="number"
                value={formData.defective_count}
                onChange={(e) => setFormData({...formData, defective_count: e.target.value})}
                placeholder="عدد القطع المعيبة"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الملاحظات
            </label>
            <textarea
              value={formData.remarks}
              onChange={(e) => setFormData({...formData, remarks: e.target.value})}
              placeholder="ملاحظات إضافية عن الفحص"
              rows={3}
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
              حفظ الفحص
            </Button>
          </div>
        </form>
      </Modal>

      {/* نافذة عرض تفاصيل الفحص */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="تفاصيل فحص الجودة"
        size="lg"
      >
        {selectedInspection && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">رقم الفحص</label>
                  <p className="text-sm text-gray-900 font-mono">{selectedInspection.inspection_number}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">نوع الفحص</label>
                  <p className="text-sm text-gray-900">{getTypeLabel(selectedInspection.inspection_type)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">المنتج</label>
                  <p className="text-sm text-gray-900">{selectedInspection.products?.name || 'غير محدد'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">تاريخ الفحص</label>
                  <p className="text-sm text-gray-900">
                    {selectedInspection.inspection_date ? 
                      new Date(selectedInspection.inspection_date).toLocaleDateString('ar-SA') : 
                      'غير محدد'
                    }
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">المفحص</label>
                  <p className="text-sm text-gray-900">
                    {selectedInspection.employees ? 
                      `${selectedInspection.employees.first_name} ${selectedInspection.employees.last_name}` : 
                      'غير محدد'
                    }
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">رقم الدفعة</label>
                  <p className="text-sm text-gray-900">{selectedInspection.batch_number || 'غير محدد'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">حجم العينة</label>
                  <p className="text-sm text-gray-900">{selectedInspection.sample_size || 'غير محدد'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">النتيجة</label>
                  <div className="flex items-center">
                    {getStatusIcon(selectedInspection.status)}
                    <span className={`mr-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedInspection.status)}`}>
                      {getStatusLabel(selectedInspection.status)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {selectedInspection.remarks && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الملاحظات</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">{selectedInspection.remarks}</p>
              </div>
            )}

            {selectedInspection.quality_inspection_results && selectedInspection.quality_inspection_results.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نتائج الفحص التفصيلية</label>
                <div className="bg-gray-50 p-3 rounded">
                  {selectedInspection.quality_inspection_results.map((result, index) => (
                    <div key={index} className="border-b border-gray-200 last:border-b-0 py-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">{result.parameter_name}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          result.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {result.passed ? 'نجح' : 'فشل'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        القيمة المقاسة: {result.measured_value || 'غير محدد'}
                      </div>
                      {result.deviation_reason && (
                        <div className="text-xs text-red-600 mt-1">
                          سبب الانحراف: {result.deviation_reason}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={() => setShowViewModal(false)}>
                إغلاق
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default QualityInspections;