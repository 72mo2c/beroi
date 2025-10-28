import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaEye, 
  FaEdit, 
  FaSearch, 
  FaFilter,
  FaExclamationTriangle,
  FaTimesCircle,
  FaCheckCircle,
  FaClock,
  FaCalendarAlt,
  FaUser,
  FaBox,
  FaClipboardList
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

const QualityNonConformances = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [nonConformances, setNonConformances] = useState([]);
  const [filteredNonConformances, setFilteredNonConformances] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedNC, setSelectedNC] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');

  // نموذج إضافة عدم مطابقة جديد
  const [formData, setFormData] = useState({
    nc_number: '',
    nc_type: 'defect',
    severity: 'medium',
    product_id: '',
    production_order_id: '',
    customer_id: '',
    reported_date: new Date().toISOString().split('T')[0],
    reported_by_id: user?.id || '',
    description: '',
    root_cause: '',
    corrective_action: '',
    preventive_action: '',
    status: 'open',
    cost_impact: 0
  });

  useEffect(() => {
    loadNonConformances();
  }, []);

  useEffect(() => {
    filterNonConformances();
  }, [nonConformances, searchTerm, filterStatus, filterSeverity]);

  const loadNonConformances = async () => {
    if (!user?.organization_id) return;

    setLoading(true);
    try {
      const data = await qualityService.getNonConformances(user.organization_id);
      setNonConformances(data);
    } catch (error) {
      console.error('Error loading non conformances:', error);
      addNotification('خطأ في تحميل عدم المطابقة', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterNonConformances = () => {
    let filtered = [...nonConformances];

    // البحث
    if (searchTerm) {
      filtered = filtered.filter(nc =>
        nc.nc_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nc.products?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // التصفية حسب الحالة
    if (filterStatus !== 'all') {
      filtered = filtered.filter(nc => nc.status === filterStatus);
    }

    // التصفية حسب الخطورة
    if (filterSeverity !== 'all') {
      filtered = filtered.filter(nc => nc.severity === filterSeverity);
    }

    setFilteredNonConformances(filtered);
  };

  const generateNCNumber = () => {
    const prefix = 'NC';
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${year}${month}-${random}`;
  };

  const handleAdd = () => {
    setFormData({
      nc_number: generateNCNumber(),
      nc_type: 'defect',
      severity: 'medium',
      product_id: '',
      production_order_id: '',
      customer_id: '',
      reported_date: new Date().toISOString().split('T')[0],
      reported_by_id: user?.id || '',
      description: '',
      root_cause: '',
      corrective_action: '',
      preventive_action: '',
      status: 'open',
      cost_impact: 0
    });
    setSelectedNC(null);
    setShowAddModal(true);
  };

  const handleView = (nc) => {
    setSelectedNC(nc);
    setShowViewModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nc_number.trim() || !formData.description.trim()) {
      addNotification('يرجى إدخال رقم عدم المطابقة والوصف', 'warning');
      return;
    }

    try {
      const ncData = {
        ...formData,
        organization_id: user.organization_id,
        cost_impact: parseFloat(formData.cost_impact) || 0
      };

      await qualityService.createNonConformance(ncData);
      addNotification('تم إضافة عدم المطابقة بنجاح', 'success');
      setShowAddModal(false);
      loadNonConformances();
    } catch (error) {
      console.error('Error creating non conformance:', error);
      addNotification('خطأ في حفظ عدم المطابقة', 'error');
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <FaExclamationTriangle className="text-red-600" />;
      case 'high':
        return <FaExclamationTriangle className="text-orange-500" />;
      case 'medium':
        return <FaExclamationTriangle className="text-yellow-500" />;
      default:
        return <FaExclamationTriangle className="text-blue-500" />;
    }
  };

  const getSeverityLabel = (severity) => {
    const labels = {
      'low': 'منخفض',
      'medium': 'متوسط',
      'high': 'عالي',
      'critical': 'حرج'
    };
    return labels[severity] || severity;
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50';
      case 'high':
        return 'text-orange-600 bg-orange-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'closed':
        return <FaCheckCircle className="text-green-500" />;
      case 'investigating':
        return <FaClock className="text-yellow-500" />;
      default:
        return <FaClock className="text-blue-500" />;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'open': 'مفتوح',
      'investigating': 'قيد التحقيق',
      'closed': 'مغلق'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'closed':
        return 'text-green-600 bg-green-50';
      case 'investigating':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  const getTypeLabel = (type) => {
    const types = {
      'defect': 'عيبة',
      'process': 'عملية',
      'system': 'نظام',
      'customer_complaint': 'شكوى عميل'
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
          <h2 className="text-2xl font-bold text-gray-800">عدم المطابقة</h2>
          <p className="text-gray-600 mt-1">إدارة وتتبع حالات عدم المطابقة</p>
        </div>
        <Button onClick={handleAdd}>
          <FaPlus className="mr-2" />
          عدم مطابقة جديد
        </Button>
      </div>

      <Card>
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="البحث في عدم المطابقة..."
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
              { value: 'open', label: 'مفتوح' },
              { value: 'investigating', label: 'قيد التحقيق' },
              { value: 'closed', label: 'مغلق' }
            ]}
          />
          <Select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            options={[
              { value: 'all', label: 'جميع الخطورة' },
              { value: 'low', label: 'منخفض' },
              { value: 'medium', label: 'متوسط' },
              { value: 'high', label: 'عالي' },
              { value: 'critical', label: 'حرج' }
            ]}
          />
        </div>

        <Table
          data={filteredNonConformances}
          columns={[
            { 
              key: 'nc_number', 
              label: 'رقم عدم المطابقة',
              render: (value) => (
                <div className="font-mono text-sm font-medium text-red-600">{value}</div>
              )
            },
            { 
              key: 'nc_type', 
              label: 'النوع',
              render: (value) => (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                  {getTypeLabel(value)}
                </span>
              )
            },
            { 
              key: 'severity', 
              label: 'الخطورة',
              render: (value) => (
                <div className="flex items-center">
                  {getSeverityIcon(value)}
                  <span className={`mr-2 px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(value)}`}>
                    {getSeverityLabel(value)}
                  </span>
                </div>
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
              key: 'reported_date', 
              label: 'تاريخ البلاغ',
              render: (value) => (
                <span className="text-sm text-gray-600">
                  {value ? new Date(value).toLocaleDateString('ar-SA') : '-'}
                </span>
              )
            },
            { 
              key: 'reported_by_name', 
              label: 'المبلغ',
              render: (value, item) => {
                const reporter = item.employees;
                return (
                  <div className="flex items-center text-sm text-gray-600">
                    <FaUser className="ml-1" />
                    {reporter ? `${reporter.first_name} ${reporter.last_name}` : '-'}
                  </div>
                );
              }
            },
            { 
              key: 'status', 
              label: 'الحالة',
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
          emptyMessage="لا توجد حالات عدم مطابقة مطابقة للبحث"
        />
      </Card>

      {/* نافذة إضافة عدم مطابقة جديد */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="إضافة عدم مطابقة جديد"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم عدم المطابقة *
              </label>
              <Input
                value={formData.nc_number}
                onChange={(e) => setFormData({...formData, nc_number: e.target.value})}
                placeholder="رقم عدم المطابقة"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع عدم المطابقة
              </label>
              <Select
                value={formData.nc_type}
                onChange={(e) => setFormData({...formData, nc_type: e.target.value})}
                options={[
                  { value: 'defect', label: 'عيبة' },
                  { value: 'process', label: 'عملية' },
                  { value: 'system', label: 'نظام' },
                  { value: 'customer_complaint', label: 'شكوى عميل' }
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                مستوى الخطورة
              </label>
              <Select
                value={formData.severity}
                onChange={(e) => setFormData({...formData, severity: e.target.value})}
                options={[
                  { value: 'low', label: 'منخفض' },
                  { value: 'medium', label: 'متوسط' },
                  { value: 'high', label: 'عالي' },
                  { value: 'critical', label: 'حرج' }
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تاريخ البلاغ
              </label>
              <Input
                type="date"
                value={formData.reported_date}
                onChange={(e) => setFormData({...formData, reported_date: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الأثر المالي
              </label>
              <Input
                type="number"
                step="0.01"
                value={formData.cost_impact}
                onChange={(e) => setFormData({...formData, cost_impact: e.target.value})}
                placeholder="التكلفة المالية للحادثة"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              وصف عدم المطابقة *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="وصف تفصيلي لعدم المطابقة"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              السبب الجذري
            </label>
            <textarea
              value={formData.root_cause}
              onChange={(e) => setFormData({...formData, root_cause: e.target.value})}
              placeholder="تحليل السبب الجذري للمشكلة"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الإجراء التصحيحي
            </label>
            <textarea
              value={formData.corrective_action}
              onChange={(e) => setFormData({...formData, corrective_action: e.target.value})}
              placeholder="الإجراءات التصحيحية المتخذة"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الإجراء الوقائي
            </label>
            <textarea
              value={formData.preventive_action}
              onChange={(e) => setFormData({...formData, preventive_action: e.target.value})}
              placeholder="الإجراءات الوقائية لمنع تكرار المشكلة"
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
              حفظ عدم المطابقة
            </Button>
          </div>
        </form>
      </Modal>

      {/* نافذة عرض تفاصيل عدم المطابقة */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="تفاصيل عدم المطابقة"
        size="lg"
      >
        {selectedNC && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">معلومات أساسية</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-500">رقم عدم المطابقة</label>
                      <p className="text-sm font-mono text-red-600">{selectedNC.nc_number}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">النوع</label>
                      <p className="text-sm text-gray-900">{getTypeLabel(selectedNC.nc_type)}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">مستوى الخطورة</label>
                      <div className="flex items-center">
                        {getSeverityIcon(selectedNC.severity)}
                        <span className={`mr-2 text-sm ${getSeverityColor(selectedNC.severity)}`}>
                          {getSeverityLabel(selectedNC.severity)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">الحالة</label>
                      <div className="flex items-center">
                        {getStatusIcon(selectedNC.status)}
                        <span className={`mr-2 text-sm ${getStatusColor(selectedNC.status)}`}>
                          {getStatusLabel(selectedNC.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">المنتج والمعلومات</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-500">المنتج</label>
                      <p className="text-sm text-gray-900">{selectedNC.products?.name || 'غير محدد'}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">العميل</label>
                      <p className="text-sm text-gray-900">{selectedNC.customers?.name || 'غير محدد'}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">تاريخ البلاغ</label>
                      <p className="text-sm text-gray-900">
                        {selectedNC.reported_date ? 
                          new Date(selectedNC.reported_date).toLocaleDateString('ar-SA') : 
                          'غير محدد'
                        }
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">الأثر المالي</label>
                      <p className="text-sm text-gray-900">
                        {selectedNC.cost_impact ? `${selectedNC.cost_impact} ريال` : 'غير محدد'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">التفاصيل</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">الوصف</label>
                      <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                        {selectedNC.description || 'غير محدد'}
                      </p>
                    </div>
                    
                    {selectedNC.root_cause && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">السبب الجذري</label>
                        <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                          {selectedNC.root_cause}
                        </p>
                      </div>
                    )}
                    
                    {selectedNC.corrective_action && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">الإجراء التصحيحي</label>
                        <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                          {selectedNC.corrective_action}
                        </p>
                      </div>
                    )}
                    
                    {selectedNC.preventive_action && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">الإجراء الوقائي</label>
                        <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                          {selectedNC.preventive_action}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

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

export default QualityNonConformances;