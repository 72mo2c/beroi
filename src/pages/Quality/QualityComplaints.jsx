import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaEye, 
  FaEdit, 
  FaSearch, 
  FaFilter,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaUser,
  FaStar,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaEnvelopeOpen,
  FaTrophy
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

const QualityComplaints = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  // نموذج إضافة شكوى جديدة
  const [formData, setFormData] = useState({
    complaint_number: '',
    customer_id: '',
    complaint_type: 'product_quality',
    subject: '',
    description: '',
    priority: 'medium',
    assigned_to_id: user?.id || '',
    reported_date: new Date().toISOString().split('T')[0],
    status: 'new'
  });

  useEffect(() => {
    loadComplaints();
  }, []);

  useEffect(() => {
    filterComplaints();
  }, [complaints, searchTerm, filterStatus, filterPriority]);

  const loadComplaints = async () => {
    if (!user?.organization_id) return;

    setLoading(true);
    try {
      const data = await qualityService.getComplaints(user.organization_id);
      setComplaints(data);
    } catch (error) {
      console.error('Error loading complaints:', error);
      addNotification('خطأ في تحميل الشكاوى', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterComplaints = () => {
    let filtered = [...complaints];

    // البحث
    if (searchTerm) {
      filtered = filtered.filter(complaint =>
        complaint.complaint_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.customers?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // التصفية حسب الحالة
    if (filterStatus !== 'all') {
      filtered = filtered.filter(complaint => complaint.status === filterStatus);
    }

    // التصفية حسب الأولوية
    if (filterPriority !== 'all') {
      filtered = filtered.filter(complaint => complaint.priority === filterPriority);
    }

    setFilteredComplaints(filtered);
  };

  const generateComplaintNumber = () => {
    const prefix = 'CC';
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${year}${month}-${random}`;
  };

  const handleAdd = () => {
    setFormData({
      complaint_number: generateComplaintNumber(),
      customer_id: '',
      complaint_type: 'product_quality',
      subject: '',
      description: '',
      priority: 'medium',
      assigned_to_id: user?.id || '',
      reported_date: new Date().toISOString().split('T')[0],
      status: 'new'
    });
    setSelectedComplaint(null);
    setShowAddModal(true);
  };

  const handleView = (complaint) => {
    setSelectedComplaint(complaint);
    setShowViewModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.complaint_number.trim() || !formData.subject.trim() || !formData.customer_id) {
      addNotification('يرجى إدخال رقم الشكوى والموضوع والعميل', 'warning');
      return;
    }

    try {
      const complaintData = {
        ...formData,
        organization_id: user.organization_id
      };

      await qualityService.createComplaint(complaintData);
      addNotification('تم إضافة الشكوى بنجاح', 'success');
      setShowAddModal(false);
      loadComplaints();
    } catch (error) {
      console.error('Error creating complaint:', error);
      addNotification('خطأ في حفظ الشكوى', 'error');
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent':
        return <FaExclamationTriangle className="text-red-500" />;
      case 'high':
        return <FaExclamationTriangle className="text-orange-500" />;
      case 'medium':
        return <FaExclamationTriangle className="text-yellow-500" />;
      default:
        return <FaExclamationTriangle className="text-blue-500" />;
    }
  };

  const getPriorityLabel = (priority) => {
    const labels = {
      'low': 'منخفضة',
      'medium': 'متوسطة',
      'high': 'عالية',
      'urgent': 'عاجلة'
    };
    return labels[priority] || priority;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
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
      case 'resolved':
        return <FaCheckCircle className="text-green-600" />;
      case 'investigating':
        return <FaClock className="text-purple-500" />;
      case 'assigned':
        return <FaClock className="text-blue-500" />;
      default:
        return <FaEnvelopeOpen className="text-gray-400" />;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'new': 'جديدة',
      'assigned': 'مُعيَّنة',
      'investigating': 'قيد التحقيق',
      'resolved': 'محلولة',
      'closed': 'مغلقة'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'closed':
        return 'text-green-600 bg-green-50';
      case 'resolved':
        return 'text-green-600 bg-green-50';
      case 'investigating':
        return 'text-purple-600 bg-purple-50';
      case 'assigned':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeLabel = (type) => {
    const types = {
      'product_quality': 'جودة المنتج',
      'service': 'الخدمة',
      'delivery': 'التسليم',
      'billing': 'الفواتير',
      'other': 'أخرى'
    };
    return types[type] || type;
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`w-3 h-3 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">شكاوى العملاء</h2>
          <p className="text-gray-600 mt-1">إدارة وتتبع شكاوى العملاء</p>
        </div>
        <Button onClick={handleAdd}>
          <FaPlus className="mr-2" />
          شكوى جديدة
        </Button>
      </div>

      <Card>
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="البحث في الشكاوى..."
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
              { value: 'new', label: 'جديدة' },
              { value: 'assigned', label: 'مُعيَّنة' },
              { value: 'investigating', label: 'قيد التحقيق' },
              { value: 'resolved', label: 'محلولة' },
              { value: 'closed', label: 'مغلقة' }
            ]}
          />
          <Select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            options={[
              { value: 'all', label: 'جميع الأولويات' },
              { value: 'low', label: 'منخفضة' },
              { value: 'medium', label: 'متوسطة' },
              { value: 'high', label: 'عالية' },
              { value: 'urgent', label: 'عاجلة' }
            ]}
          />
        </div>

        <Table
          data={filteredComplaints}
          columns={[
            { 
              key: 'complaint_number', 
              label: 'رقم الشكوى',
              render: (value) => (
                <div className="font-mono text-sm font-medium text-blue-600">{value}</div>
              )
            },
            { 
              key: 'customer_name', 
              label: 'العميل',
              render: (value, item) => (
                <div className="flex items-center">
                  <FaUser className="text-gray-400 mr-2" />
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
                      {item.customers?.name || 'غير محدد'}
                    </div>
                    {item.customers?.phone && (
                      <div className="text-xs text-gray-500 flex items-center">
                        <FaPhone className="ml-1 w-3 h-3" />
                        {item.customers.phone}
                      </div>
                    )}
                  </div>
                </div>
              )
            },
            { 
              key: 'complaint_type', 
              label: 'نوع الشكوى',
              render: (value) => (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                  {getTypeLabel(value)}
                </span>
              )
            },
            { 
              key: 'subject', 
              label: 'الموضوع',
              render: (value) => (
                <div className="text-sm text-gray-900 max-w-xs truncate" title={value}>
                  {value}
                </div>
              )
            },
            { 
              key: 'priority', 
              label: 'الأولوية',
              render: (value) => (
                <div className="flex items-center">
                  {getPriorityIcon(value)}
                  <span className={`mr-2 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(value)}`}>
                    {getPriorityLabel(value)}
                  </span>
                </div>
              )
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
              key: 'customer_satisfaction_rating', 
              label: 'التقييم',
              render: (value) => (
                <div className="flex items-center">
                  {value ? renderStars(value) : (
                    <span className="text-xs text-gray-400">غير مُقيَّم</span>
                  )}
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
          emptyMessage="لا توجد شكاوى مطابقة للبحث"
        />
      </Card>

      {/* نافذة إضافة شكوى جديدة */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="إضافة شكوى عميل جديدة"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم الشكوى *
              </label>
              <Input
                value={formData.complaint_number}
                onChange={(e) => setFormData({...formData, complaint_number: e.target.value})}
                placeholder="رقم الشكوى"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                العميل *
              </label>
              <Select
                value={formData.customer_id}
                onChange={(e) => setFormData({...formData, customer_id: e.target.value})}
                options={[
                  { value: '', label: 'اختر العميل' },
                  // سيتم تحميل قائمة العملاء من قاعدة البيانات
                  { value: 'customer1', label: 'العميل الأول' },
                  { value: 'customer2', label: 'العميل الثاني' }
                ]}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع الشكوى
              </label>
              <Select
                value={formData.complaint_type}
                onChange={(e) => setFormData({...formData, complaint_type: e.target.value})}
                options={[
                  { value: 'product_quality', label: 'جودة المنتج' },
                  { value: 'service', label: 'الخدمة' },
                  { value: 'delivery', label: 'التسليم' },
                  { value: 'billing', label: 'الفواتير' },
                  { value: 'other', label: 'أخرى' }
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الأولوية
              </label>
              <Select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                options={[
                  { value: 'low', label: 'منخفضة' },
                  { value: 'medium', label: 'متوسطة' },
                  { value: 'high', label: 'عالية' },
                  { value: 'urgent', label: 'عاجلة' }
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
                المُعيَّن لـ
              </label>
              <Select
                value={formData.assigned_to_id}
                onChange={(e) => setFormData({...formData, assigned_to_id: e.target.value})}
                options={[
                  { value: '', label: 'غير مُعيَّن' },
                  { value: user?.id, label: 'أنت' },
                  // سيتم تحميل قائمة الموظفين من قاعدة البيانات
                ]}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              موضوع الشكوى *
            </label>
            <Input
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              placeholder="موضوع الشكوى"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              وصف الشكوى *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="وصف تفصيلي للشكوى"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
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
              حفظ الشكوى
            </Button>
          </div>
        </form>
      </Modal>

      {/* نافذة عرض تفاصيل الشكوى */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="تفاصيل شكوى العميل"
        size="lg"
      >
        {selectedComplaint && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">معلومات أساسية</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-500">رقم الشكوى</label>
                      <p className="text-sm font-mono text-blue-600">{selectedComplaint.complaint_number}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">نوع الشكوى</label>
                      <p className="text-sm text-gray-900">{getTypeLabel(selectedComplaint.complaint_type)}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">الأولوية</label>
                      <div className="flex items-center">
                        {getPriorityIcon(selectedComplaint.priority)}
                        <span className={`mr-2 text-sm ${getPriorityColor(selectedComplaint.priority)}`}>
                          {getPriorityLabel(selectedComplaint.priority)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">الحالة</label>
                      <div className="flex items-center">
                        {getStatusIcon(selectedComplaint.status)}
                        <span className={`mr-2 text-sm ${getStatusColor(selectedComplaint.status)}`}>
                          {getStatusLabel(selectedComplaint.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">معلومات العميل</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-500">اسم العميل</label>
                      <p className="text-sm text-gray-900">{selectedComplaint.customers?.name || 'غير محدد'}</p>
                    </div>
                    {selectedComplaint.customers?.phone && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500">رقم الهاتف</label>
                        <p className="text-sm text-gray-900 flex items-center">
                          <FaPhone className="ml-1 w-3 h-3" />
                          {selectedComplaint.customers.phone}
                        </p>
                      </div>
                    )}
                    {selectedComplaint.customers?.email && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500">البريد الإلكتروني</label>
                        <p className="text-sm text-gray-900 flex items-center">
                          <FaEnvelope className="ml-1 w-3 h-3" />
                          {selectedComplaint.customers.email}
                        </p>
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-medium text-gray-500">تاريخ البلاغ</label>
                      <p className="text-sm text-gray-900 flex items-center">
                        <FaCalendarAlt className="ml-1 w-3 h-3" />
                        {selectedComplaint.reported_date ? 
                          new Date(selectedComplaint.reported_date).toLocaleDateString('ar-SA') : 
                          'غير محدد'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {selectedComplaint.customer_satisfaction_rating && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">تقييم العميل</h3>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 ml-2">الرضا:</span>
                      {renderStars(selectedComplaint.customer_satisfaction_rating)}
                      <span className="text-sm text-gray-600 mr-2">
                        ({selectedComplaint.customer_satisfaction_rating}/5)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">تفاصيل الشكوى</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">الموضوع</label>
                      <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                        {selectedComplaint.subject || 'غير محدد'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">الوصف</label>
                      <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                        {selectedComplaint.description || 'غير محدد'}
                      </p>
                    </div>
                    
                    {selectedComplaint.resolution && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">الحل</label>
                        <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                          {selectedComplaint.resolution}
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

export default QualityComplaints;