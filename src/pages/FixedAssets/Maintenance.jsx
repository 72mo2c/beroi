// ======================================
// Maintenance Page - صفحة الصيانة
// ======================================

import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  FaWrench,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaFileAlt,
  FaTools,
  FaMoneyBillWave,
  FaUser,
  FaPhone
} from 'react-icons/fa';

const Maintenance = () => {
  const { fixedAssets, setFixedAssets, maintenanceRecords, setMaintenanceRecords } = useData();
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterAsset, setFilterAsset] = useState('');
  const [viewMode, setViewMode] = useState('list'); // list, calendar, dashboard
  const [formData, setFormData] = useState({
    assetId: '',
    type: 'preventive', // preventive, corrective, emergency
    priority: 'medium', // low, medium, high, urgent
    title: '',
    description: '',
    scheduledDate: '',
    startDate: '',
    endDate: '',
    status: 'scheduled', // scheduled, in-progress, completed, cancelled
    cost: 0,
    technician: '',
    technicianPhone: '',
    parts: [],
    notes: '',
    attachments: []
  });

  // إضافة سجل صيانة جديد
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // تحديث سجل موجود
      const updatedRecords = maintenanceRecords.map(record =>
        record.id === editingId ? { ...formData, id: editingId, lastUpdated: new Date().toISOString() } : record
      );
      setMaintenanceRecords(updatedRecords);
      setEditingId(null);
    } else {
      // إضافة سجل جديد
      const newRecord = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      setMaintenanceRecords([...maintenanceRecords, newRecord]);
    }
    
    resetForm();
  };

  // إعادة تعيين النموذج
  const resetForm = () => {
    setFormData({
      assetId: '',
      type: 'preventive',
      priority: 'medium',
      title: '',
      description: '',
      scheduledDate: '',
      startDate: '',
      endDate: '',
      status: 'scheduled',
      cost: 0,
      technician: '',
      technicianPhone: '',
      parts: [],
      notes: '',
      attachments: []
    });
    setShowForm(false);
  };

  // حذف سجل صيانة
  const handleDelete = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا السجل؟')) {
      setMaintenanceRecords(maintenanceRecords.filter(record => record.id !== id));
    }
  };

  // تعديل سجل صيانة
  const handleEdit = (record) => {
    setFormData(record);
    setEditingId(record.id);
    setShowForm(true);
  };

  // إلغاء التعديل
  const handleCancel = () => {
    setEditingId(null);
    resetForm();
  };

  // تغيير حالة الصيانة
  const updateStatus = (id, newStatus) => {
    const updatedRecords = maintenanceRecords.map(record =>
      record.id === id ? { ...record, status: newStatus, lastUpdated: new Date().toISOString() } : record
    );
    setMaintenanceRecords(updatedRecords);
  };

  // إضافة جزء
  const addPart = () => {
    const newPart = {
      id: Date.now(),
      name: '',
      quantity: 1,
      unitCost: 0,
      totalCost: 0
    };
    setFormData({
      ...formData,
      parts: [...formData.parts, newPart]
    });
  };

  // تحديث جزء
  const updatePart = (partId, field, value) => {
    const updatedParts = formData.parts.map(part => {
      if (part.id === partId) {
        const updated = { ...part, [field]: value };
        // حساب التكلفة الإجمالية للجزء
        if (field === 'quantity' || field === 'unitCost') {
          updated.totalCost = (updated.quantity || 0) * (updated.unitCost || 0);
        }
        return updated;
      }
      return part;
    });
    
    const totalPartsCost = updatedParts.reduce((sum, part) => sum + part.totalCost, 0);
    setFormData({
      ...formData,
      parts: updatedParts,
      cost: totalPartsCost
    });
  };

  // حذف جزء
  const removePart = (partId) => {
    const updatedParts = formData.parts.filter(part => part.id !== partId);
    const totalPartsCost = updatedParts.reduce((sum, part) => sum + part.totalCost, 0);
    setFormData({
      ...formData,
      parts: updatedParts,
      cost: totalPartsCost
    });
  };

  // تصفية السجلات
  const filteredRecords = maintenanceRecords.filter(record => {
    const asset = fixedAssets.find(a => a.id === record.assetId);
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (asset && asset.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !filterStatus || record.status === filterStatus;
    const matchesPriority = !filterPriority || record.priority === filterPriority;
    const matchesAsset = !filterAsset || record.assetId.toString() === filterAsset;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesAsset;
  });

  // ترتيب السجلات
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    // ترتيب حسب الأولوية أولاً
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    
    // ثم حسب التاريخ المجدول
    return new Date(a.scheduledDate) - new Date(b.scheduledDate);
  });

  // حساب الإحصائيات
  const getStatusCount = (status) => maintenanceRecords.filter(r => r.status === status).length;
  const getTotalCost = () => maintenanceRecords.reduce((sum, r) => sum + (r.cost || 0), 0);
  const getUrgentCount = () => maintenanceRecords.filter(r => r.priority === 'urgent').length;
  const getOverdueCount = () => {
    const today = new Date();
    return maintenanceRecords.filter(r => 
      r.status !== 'completed' && 
      r.status !== 'cancelled' && 
      new Date(r.scheduledDate) < today
    ).length;
  };

  // الحصول على نص الأولوية والألوان
  const getPriorityInfo = (priority) => {
    switch (priority) {
      case 'urgent':
        return { text: 'عاجل', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-800' };
      case 'high':
        return { text: 'عالي', color: 'orange', bgColor: 'bg-orange-100', textColor: 'text-orange-800' };
      case 'medium':
        return { text: 'متوسط', color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-800' };
      case 'low':
        return { text: 'منخفض', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-800' };
      default:
        return { text: priority, color: 'gray', bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
    }
  };

  // الحصول على نص الحالة والألوان
  const getStatusInfo = (status) => {
    switch (status) {
      case 'scheduled':
        return { text: 'مجدول', icon: FaCalendarAlt, color: 'blue' };
      case 'in-progress':
        return { text: 'قيد التنفيذ', icon: FaWrench, color: 'orange' };
      case 'completed':
        return { text: 'مكتمل', icon: FaCheckCircle, color: 'green' };
      case 'cancelled':
        return { text: 'ملغي', icon: FaTimes, color: 'red' };
      default:
        return { text: status, icon: FaClock, color: 'gray' };
    }
  };

  // عرض قائمة السجلات
  const renderRecordsList = () => (
    <div className="space-y-4">
      {sortedRecords.map(record => {
        const asset = fixedAssets.find(a => a.id === record.assetId);
        const priorityInfo = getPriorityInfo(record.priority);
        const statusInfo = getStatusInfo(record.status);
        const StatusIcon = statusInfo.icon;
        
        return (
          <div key={record.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-800">{record.title}</h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${priorityInfo.bgColor} ${priorityInfo.textColor}`}>
                    {priorityInfo.text}
                  </span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-${statusInfo.color}-100 text-${statusInfo.color}-800 flex items-center`}>
                    <StatusIcon className="ml-1" />
                    {statusInfo.text}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{record.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <FaUser className="ml-2" />
                  الأصل: {asset ? asset.name : 'غير محدد'}
                  <span className="mx-3">•</span>
                  النوع: {record.type === 'preventive' ? 'وقائي' : record.type === 'corrective' ? 'تصحيحي' : 'طارئ'}
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(record)}
                  className="text-blue-600 hover:text-blue-800 p-2"
                  title="تعديل"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(record.id)}
                  className="text-red-600 hover:text-red-800 p-2"
                  title="حذف"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500">التاريخ المجدول</p>
                <p className="font-medium">{record.scheduledDate ? new Date(record.scheduledDate).toLocaleDateString('ar-SA') : 'غير محدد'}</p>
              </div>
              <div>
                <p className="text-gray-500">التكلفة</p>
                <p className="font-medium">{(record.cost || 0).toLocaleString()} ر.س</p>
              </div>
              <div>
                <p className="text-gray-500">الفني المسؤول</p>
                <p className="font-medium">{record.technician || 'غير محدد'}</p>
              </div>
              <div>
                <p className="text-gray-500">آخر تحديث</p>
                <p className="font-medium">{new Date(record.lastUpdated).toLocaleDateString('ar-SA')}</p>
              </div>
            </div>
            
            {/* تغيير الحالة السريع */}
            <div className="mt-4 pt-4 border-t flex items-center justify-between">
              <div className="flex gap-2">
                {record.status === 'scheduled' && (
                  <button
                    onClick={() => updateStatus(record.id, 'in-progress')}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-sm flex items-center"
                  >
                    <FaWrench className="ml-1" />
                    بدء التنفيذ
                  </button>
                )}
                {record.status === 'in-progress' && (
                  <button
                    onClick={() => updateStatus(record.id, 'completed')}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center"
                  >
                    <FaCheckCircle className="ml-1" />
                    إكمال
                  </button>
                )}
              </div>
              
              <div className="flex gap-2">
                <select
                  value={record.status}
                  onChange={(e) => updateStatus(record.id, e.target.value)}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value="scheduled">مجدول</option>
                  <option value="in-progress">قيد التنفيذ</option>
                  <option value="completed">مكتمل</option>
                  <option value="cancelled">ملغي</option>
                </select>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* رأس الصفحة */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FaWrench className="text-3xl text-blue-600 ml-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">إدارة الصيانة</h1>
                <p className="text-gray-600">متابعة وإدارة صيانة الأصول الثابتة</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
            >
              <FaPlus className="ml-2" />
              إضافة صيانة
            </button>
          </div>

          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FaTools className="text-blue-600 text-2xl" />
                <div className="mr-3">
                  <p className="text-sm text-blue-600">إجمالي السجلات</p>
                  <p className="text-xl font-bold text-blue-800">{maintenanceRecords.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FaClock className="text-orange-600 text-2xl" />
                <div className="mr-3">
                  <p className="text-sm text-orange-600">قيد التنفيذ</p>
                  <p className="text-xl font-bold text-orange-800">{getStatusCount('in-progress')}</p>
                </div>
              </div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FaExclamationTriangle className="text-red-600 text-2xl" />
                <div className="mr-3">
                  <p className="text-sm text-red-600">متأخرة</p>
                  <p className="text-xl font-bold text-red-800">{getOverdueCount()}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FaCheckCircle className="text-green-600 text-2xl" />
                <div className="mr-3">
                  <p className="text-sm text-green-600">مكتملة</p>
                  <p className="text-xl font-bold text-green-800">{getStatusCount('completed')}</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FaMoneyBillWave className="text-purple-600 text-2xl" />
                <div className="mr-3">
                  <p className="text-sm text-purple-600">إجمالي التكلفة</p>
                  <p className="text-xl font-bold text-purple-800">{getTotalCost().toLocaleString()} ر.س</p>
                </div>
              </div>
            </div>
          </div>

          {/* أدوات البحث والتصفية */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-6">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="بحث في الصيانة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">جميع الحالات</option>
              <option value="scheduled">مجدول</option>
              <option value="in-progress">قيد التنفيذ</option>
              <option value="completed">مكتمل</option>
              <option value="cancelled">ملغي</option>
            </select>
            
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">جميع الأولويات</option>
              <option value="urgent">عاجل</option>
              <option value="high">عالي</option>
              <option value="medium">متوسط</option>
              <option value="low">منخفض</option>
            </select>
            
            <select
              value={filterAsset}
              onChange={(e) => setFilterAsset(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">جميع الأصول</option>
              {fixedAssets.map(asset => (
                <option key={asset.id} value={asset.id}>{asset.name}</option>
              ))}
            </select>
            
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="list">قائمة</option>
              <option value="calendar">تقويم</option>
              <option value="dashboard">لوحة</option>
            </select>
            
            <button className="px-4 py-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors flex items-center justify-center">
              <FaFilter className="ml-2" />
              تصفية
            </button>
          </div>
        </div>

        {/* نموذج إضافة/تعديل */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingId ? 'تعديل سجل الصيانة' : 'إضافة سجل صيانة جديد'}
            </h2>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* العمود الأول */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الأصل *
                  </label>
                  <select
                    value={formData.assetId}
                    onChange={(e) => setFormData({...formData, assetId: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">اختر الأصل</option>
                    {fixedAssets.map(asset => (
                      <option key={asset.id} value={asset.id}>{asset.name} - {asset.code}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع الصيانة *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="preventive">وقائية</option>
                    <option value="corrective">تصحيحية</option>
                    <option value="emergency">طارئة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الأولوية *
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="low">منخفضة</option>
                    <option value="medium">متوسطة</option>
                    <option value="high">عالية</option>
                    <option value="urgent">عاجلة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عنوان الصيانة *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="عنوان موجز للصيانة"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الوصف *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    placeholder="وصف تفصيلي للعملية"
                    required
                  />
                </div>
              </div>

              {/* العمود الثاني */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    التاريخ المجدول *
                  </label>
                  <input
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاريخ البداية
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاريخ الانتهاء
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الحالة *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="scheduled">مجدول</option>
                    <option value="in-progress">قيد التنفيذ</option>
                    <option value="completed">مكتمل</option>
                    <option value="cancelled">ملغي</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    التكلفة المقدرة
                  </label>
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({...formData, cost: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* العمود الثالث */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الفني المسؤول
                  </label>
                  <input
                    type="text"
                    value={formData.technician}
                    onChange={(e) => setFormData({...formData, technician: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="اسم الفني"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    value={formData.technicianPhone}
                    onChange={(e) => setFormData({...formData, technicianPhone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="05xxxxxxxx"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    قطع الغيار المطلوبة
                  </label>
                  <button
                    type="button"
                    onClick={addPart}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    <FaPlus className="ml-2" />
                    إضافة جزء
                  </button>
                  
                  {/* قائمة الأجزاء */}
                  {formData.parts.length > 0 && (
                    <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                      {formData.parts.map(part => (
                        <div key={part.id} className="grid grid-cols-5 gap-2 items-center p-2 border border-gray-200 rounded">
                          <input
                            type="text"
                            value={part.name}
                            onChange={(e) => updatePart(part.id, 'name', e.target.value)}
                            className="col-span-2 px-2 py-1 text-sm border border-gray-300 rounded"
                            placeholder="اسم الجزء"
                          />
                          <input
                            type="number"
                            value={part.quantity}
                            onChange={(e) => updatePart(part.id, 'quantity', parseInt(e.target.value) || 0)}
                            className="px-2 py-1 text-sm border border-gray-300 rounded"
                            placeholder="الكمية"
                            min="1"
                          />
                          <input
                            type="number"
                            value={part.unitCost}
                            onChange={(e) => updatePart(part.id, 'unitCost', parseFloat(e.target.value) || 0)}
                            className="px-2 py-1 text-sm border border-gray-300 rounded"
                            placeholder="تكلفة الوحدة"
                            step="0.01"
                          />
                          <button
                            type="button"
                            onClick={() => removePart(part.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الملاحظات
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="ملاحظات إضافية"
                  />
                </div>
              </div>

              {/* أزرار العمليات */}
              <div className="md:col-span-3 flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                >
                  <FaTimes className="ml-2" />
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
                >
                  <FaSave className="ml-2" />
                  {editingId ? 'تحديث' : 'حفظ'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* المحتوى الرئيسي */}
        {viewMode === 'list' && renderRecordsList()}
        
        {viewMode === 'calendar' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center py-12">
              <FaCalendarAlt className="text-gray-300 text-6xl mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">عرض التقويم قيد التطوير</h3>
              <p className="text-gray-400">سيتم إضافة عرض التقويم قريباً</p>
            </div>
          </div>
        )}
        
        {viewMode === 'dashboard' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center py-12">
              <FaTools className="text-gray-300 text-6xl mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">لوحة الصيانة قيد التطوير</h3>
              <p className="text-gray-400">سيتم إضافة لوحة الصيانة قريباً</p>
            </div>
          </div>
        )}

        {/* رسالة في حالة عدم وجود سجلات */}
        {sortedRecords.length === 0 && viewMode === 'list' && (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <FaWrench className="text-gray-300 text-6xl mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">لا توجد سجلات صيانة</h3>
            <p className="text-gray-400 mb-6">ابدأ بإضافة سجل صيانة جديد</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              إضافة صيانة جديدة
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Maintenance;
