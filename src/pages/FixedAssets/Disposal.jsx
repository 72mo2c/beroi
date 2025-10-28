// ======================================
// Disposal Page - صفحة الاستبعاد
// ======================================

import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  FaTrash,
  FaPlus,
  FaEdit,
  FaSave,
  FaTimes,
  FaSearch,
  FaFilter,
  FaMoneyBillWave,
  FaFileAlt,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaRecycle,
  FaHandshake
} from 'react-icons/fa';

const Disposal = () => {
  const { fixedAssets, setFixedAssets, disposalRecords, setDisposalRecords } = useData();
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterMethod, setFilterMethod] = useState('');
  const [filterAsset, setFilterAsset] = useState('');
  const [formData, setFormData] = useState({
    assetId: '',
    disposalDate: '',
    disposalMethod: 'sale', // sale, donation, destruction, scrap
    salePrice: 0,
    buyer: '',
    buyerContact: '',
    reason: '',
    condition: 'poor', // excellent, good, fair, poor
    depreciationValue: 0,
    gainLoss: 0,
    approvalStatus: 'pending', // pending, approved, rejected
    approvedBy: '',
    approvedDate: '',
    notes: '',
    documents: []
  });

  // إضافة سجل استبعاد جديد
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // حساب الربح/الخسارة
    const asset = fixedAssets.find(a => a.id === parseInt(formData.assetId));
    if (asset) {
      const depreciationValue = asset.currentValue || asset.purchasePrice;
      const gainLoss = formData.salePrice - depreciationValue;
      
      formData.depreciationValue = depreciationValue;
      formData.gainLoss = gainLoss;
    }
    
    if (editingId) {
      // تحديث سجل موجود
      const updatedRecords = disposalRecords.map(record =>
        record.id === editingId ? { ...formData, id: editingId, lastUpdated: new Date().toISOString() } : record
      );
      setDisposalRecords(updatedRecords);
      setEditingId(null);
    } else {
      // إضافة سجل جديد
      const newRecord = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      setDisposalRecords([...disposalRecords, newRecord]);
      
      // تحديث حالة الأصل
      const assetId = parseInt(formData.assetId);
      const updatedAssets = fixedAssets.map(asset =>
        asset.id === assetId ? { ...asset, status: 'disposed', lastUpdated: new Date().toISOString() } : asset
      );
      setFixedAssets(updatedAssets);
    }
    
    resetForm();
  };

  // إعادة تعيين النموذج
  const resetForm = () => {
    setFormData({
      assetId: '',
      disposalDate: '',
      disposalMethod: 'sale',
      salePrice: 0,
      buyer: '',
      buyerContact: '',
      reason: '',
      condition: 'poor',
      depreciationValue: 0,
      gainLoss: 0,
      approvalStatus: 'pending',
      approvedBy: '',
      approvedDate: '',
      notes: '',
      documents: []
    });
    setShowForm(false);
  };

  // حذف سجل استبعاد
  const handleDelete = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا السجل؟')) {
      setDisposalRecords(disposalRecords.filter(record => record.id !== id));
    }
  };

  // تعديل سجل استبعاد
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

  // تغيير حالة الموافقة
  const updateApprovalStatus = (id, status) => {
    const updatedRecords = disposalRecords.map(record =>
      record.id === id ? { 
        ...record, 
        approvalStatus: status,
        approvedDate: status === 'approved' ? new Date().toISOString().split('T')[0] : '',
        lastUpdated: new Date().toISOString()
      } : record
    );
    setDisposalRecords(updatedRecords);
  };

  // تصفية السجلات
  const filteredRecords = disposalRecords.filter(record => {
    const asset = fixedAssets.find(a => a.id === record.assetId);
    const matchesSearch = record.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (asset && asset.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !filterStatus || record.approvalStatus === filterStatus;
    const matchesMethod = !filterMethod || record.disposalMethod === filterMethod;
    const matchesAsset = !filterAsset || record.assetId.toString() === filterAsset;
    
    return matchesSearch && matchesStatus && matchesMethod && matchesAsset;
  });

  // ترتيب السجلات
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    return new Date(b.disposalDate) - new Date(a.disposalDate);
  });

  // حساب الإحصائيات
  const getStatusCount = (status) => disposalRecords.filter(r => r.approvalStatus === status).length;
  const getMethodCount = (method) => disposalRecords.filter(r => r.disposalMethod === method).length;
  const getTotalSaleValue = () => disposalRecords.reduce((sum, r) => sum + (r.salePrice || 0), 0);
  const getTotalGainLoss = () => disposalRecords.reduce((sum, r) => sum + (r.gainLoss || 0), 0);

  // الحصول على نص طريقة الاستبعاد والألوان
  const getMethodInfo = (method) => {
    switch (method) {
      case 'sale':
        return { text: 'بيع', icon: FaMoneyBillWave, color: 'green' };
      case 'donation':
        return { text: 'تبرع', icon: FaHandshake, color: 'blue' };
      case 'destruction':
        return { text: 'تدمير', icon: FaTrash, color: 'red' };
      case 'scrap':
        return { text': 'خردة', icon: FaRecycle, color: 'gray' };
      default:
        return { text: method, icon: FaFileAlt, color: 'gray' };
    }
  };

  // الحصول على نص حالة الموافقة والألوان
  const getApprovalStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { text: 'في الانتظار', icon: FaClock, color: 'yellow' };
      case 'approved':
        return { text: 'موافق عليه', icon: FaCheckCircle, color: 'green' };
      case 'rejected':
        return { text: 'مرفوض', icon: FaTimes, color: 'red' };
      default:
        return { text: status, icon: FaClock, color: 'gray' };
    }
  };

  // عرض قائمة السجلات
  const renderRecordsList = () => (
    <div className="space-y-4">
      {sortedRecords.map(record => {
        const asset = fixedAssets.find(a => a.id === record.assetId);
        const methodInfo = getMethodInfo(record.disposalMethod);
        const approvalStatusInfo = getApprovalStatusInfo(record.approvalStatus);
        const MethodIcon = methodInfo.icon;
        const ApprovalIcon = approvalStatusInfo.icon;
        
        return (
          <div key={record.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-800">
                    استبعاد: {asset ? asset.name : 'الأصل غير محدد'}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-${methodInfo.color}-100 text-${methodInfo.color}-800 flex items-center`}>
                    <MethodIcon className="ml-1" />
                    {methodInfo.text}
                  </span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-${approvalStatusInfo.color}-100 text-${approvalStatusInfo.color}-800 flex items-center`}>
                    <ApprovalIcon className="ml-1" />
                    {approvalStatusInfo.text}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{record.reason}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <FaCalendarAlt className="ml-2" />
                  تاريخ الاستبعاد: {record.disposalDate ? new Date(record.disposalDate).toLocaleDateString('ar-SA') : 'غير محدد'}
                  {record.buyer && (
                    <>
                      <span className="mx-3">•</span>
                      المشتري: {record.buyer}
                    </>
                  )}
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
                <p className="text-gray-500">سعر البيع</p>
                <p className="font-medium">{(record.salePrice || 0).toLocaleString()} ر.س</p>
              </div>
              <div>
                <p className="text-gray-500">القيمة الدفترية</p>
                <p className="font-medium">{(record.depreciationValue || 0).toLocaleString()} ر.س</p>
              </div>
              <div>
                <p className="text-gray-500">الربح/الخسارة</p>
                <p className={`font-medium ${record.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {record.gainLoss >= 0 ? '+' : ''}{(record.gainLoss || 0).toLocaleString()} ر.س
                </p>
              </div>
              <div>
                <p className="text-gray-500">الحالة</p>
                <p className="font-medium">{record.condition === 'excellent' ? 'ممتاز' :
                                              record.condition === 'good' ? 'جيد' :
                                              record.condition === 'fair' ? 'متوسط' : 'ضعيف'}</p>
              </div>
            </div>
            
            {/* إجراءات الموافقة */}
            {record.approvalStatus === 'pending' && (
              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <p className="text-sm text-gray-500">يحتاج موافقة</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateApprovalStatus(record.id, 'approved')}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm flex items-center"
                  >
                    <FaCheckCircle className="ml-2" />
                    موافقة
                  </button>
                  <button
                    onClick={() => updateApprovalStatus(record.id, 'rejected')}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm flex items-center"
                  >
                    <FaTimes className="ml-2" />
                    رفض
                  </button>
                </div>
              </div>
            )}
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
              <FaTrash className="text-3xl text-blue-600 ml-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">إدارة الاستبعاد</h1>
                <p className="text-gray-600">متابعة وإدارة استبعاد الأصول الثابتة</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
            >
              <FaPlus className="ml-2" />
              إضافة استبعاد
            </button>
          </div>

          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FaFileAlt className="text-blue-600 text-2xl" />
                <div className="mr-3">
                  <p className="text-sm text-blue-600">إجمالي الاستبعادات</p>
                  <p className="text-xl font-bold text-blue-800">{disposalRecords.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FaClock className="text-yellow-600 text-2xl" />
                <div className="mr-3">
                  <p className="text-sm text-yellow-600">في الانتظار</p>
                  <p className="text-xl font-bold text-yellow-800">{getStatusCount('pending')}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FaCheckCircle className="text-green-600 text-2xl" />
                <div className="mr-3">
                  <p className="text-sm text-green-600">معتمدة</p>
                  <p className="text-xl font-bold text-green-800">{getStatusCount('approved')}</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FaMoneyBillWave className="text-purple-600 text-2xl" />
                <div className="mr-3">
                  <p className="text-sm text-purple-600">إجمالي المبيعات</p>
                  <p className="text-xl font-bold text-purple-800">{getTotalSaleValue().toLocaleString()} ر.س</p>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FaMoneyBillWave className="text-orange-600 text-2xl" />
                <div className="mr-3">
                  <p className="text-sm text-orange-600">صافي الربح/الخسارة</p>
                  <p className={`text-xl font-bold ${getTotalGainLoss() >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                    {getTotalGainLoss() >= 0 ? '+' : ''}{getTotalGainLoss().toLocaleString()} ر.س
                  </p>
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
                placeholder="بحث في الاستبعادات..."
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
              <option value="pending">في الانتظار</option>
              <option value="approved">موافق عليه</option>
              <option value="rejected">مرفوض</option>
            </select>
            
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">جميع الطرق</option>
              <option value="sale">بيع</option>
              <option value="donation">تبرع</option>
              <option value="destruction">تدمير</option>
              <option value="scrap">خردة</option>
            </select>
            
            <select
              value={filterAsset}
              onChange={(e) => setFilterAsset(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">جميع الأصول</option>
              {fixedAssets.filter(a => a.status !== 'disposed').map(asset => (
                <option key={asset.id} value={asset.id}>{asset.name}</option>
              ))}
            </select>
            
            <button className="px-4 py-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors flex items-center justify-center">
              <FaFilter className="ml-2" />
              تصفية
            </button>
            
            <button className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center">
              <FaFileAlt className="ml-2" />
              تصدير تقرير
            </button>
          </div>
        </div>

        {/* نموذج إضافة/تعديل */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingId ? 'تعديل سجل الاستبعاد' : 'إضافة سجل استبعاد جديد'}
            </h2>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* العمود الأول */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الأصل المراد استبعاده *
                  </label>
                  <select
                    value={formData.assetId}
                    onChange={(e) => {
                      setFormData({...formData, assetId: e.target.value});
                      // حساب القيمة الدفترية تلقائياً
                      const asset = fixedAssets.find(a => a.id === parseInt(e.target.value));
                      if (asset) {
                        const depreciationValue = asset.currentValue || asset.purchasePrice;
                        const salePrice = formData.salePrice || 0;
                        const gainLoss = salePrice - depreciationValue;
                        setFormData(prev => ({
                          ...prev,
                          depreciationValue,
                          gainLoss
                        }));
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">اختر الأصل</option>
                    {fixedAssets.filter(a => a.status !== 'disposed').map(asset => (
                      <option key={asset.id} value={asset.id}>
                        {asset.name} - {asset.code} (القيمة: {(asset.currentValue || asset.purchasePrice).toLocaleString()} ر.س)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    طريقة الاستبعاد *
                  </label>
                  <select
                    value={formData.disposalMethod}
                    onChange={(e) => setFormData({...formData, disposalMethod: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="sale">بيع</option>
                    <option value="donation">تبرع</option>
                    <option value="destruction">تدمير</option>
                    <option value="scrap">خردة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاريخ الاستبعاد *
                  </label>
                  <input
                    type="date"
                    value={formData.disposalDate}
                    onChange={(e) => setFormData({...formData, disposalDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    سعر البيع *
                  </label>
                  <input
                    type="number"
                    value={formData.salePrice}
                    onChange={(e) => {
                      const salePrice = parseFloat(e.target.value) || 0;
                      const gainLoss = salePrice - formData.depreciationValue;
                      setFormData({...formData, salePrice, gainLoss});
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                    required={formData.disposalMethod === 'sale'}
                    disabled={formData.disposalMethod !== 'sale'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المشتري/المتلقي
                  </label>
                  <input
                    type="text"
                    value={formData.buyer}
                    onChange={(e) => setFormData({...formData, buyer: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="اسم المشتري أو المتلقي"
                    required={formData.disposalMethod === 'sale' || formData.disposalMethod === 'donation'}
                  />
                </div>
              </div>

              {/* العمود الثاني */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    بيانات الاتصال
                  </label>
                  <input
                    type="text"
                    value={formData.buyerContact}
                    onChange={(e) => setFormData({...formData, buyerContact: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="رقم هاتف أو إيميل"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    حالة الأصل *
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({...formData, condition: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="excellent">ممتاز</option>
                    <option value="good">جيد</option>
                    <option value="fair">متوسط</option>
                    <option value="poor">ضعيف</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    سبب الاستبعاد *
                  </label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="سبب استبعاد الأصل"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    حالة الموافقة *
                  </label>
                  <select
                    value={formData.approvalStatus}
                    onChange={(e) => setFormData({...formData, approvalStatus: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="pending">في الانتظار</option>
                    <option value="approved">موافق عليه</option>
                    <option value="rejected">مرفوض</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    معتمد بواسطة
                  </label>
                  <input
                    type="text"
                    value={formData.approvedBy}
                    onChange={(e) => setFormData({...formData, approvedBy: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="اسم الشخص الذي اعتمد الاستبعاد"
                  />
                </div>
              </div>

              {/* العمود الثالث */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاريخ الاعتماد
                  </label>
                  <input
                    type="date"
                    value={formData.approvedDate}
                    onChange={(e) => setFormData({...formData, approvedDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    القيمة الدفترية
                  </label>
                  <input
                    type="number"
                    value={formData.depreciationValue}
                    onChange={(e) => {
                      const depreciationValue = parseFloat(e.target.value) || 0;
                      const gainLoss = formData.salePrice - depreciationValue;
                      setFormData({...formData, depreciationValue, gainLoss});
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الربح/الخسارة
                  </label>
                  <input
                    type="number"
                    value={formData.gainLoss}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formData.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المستندات المرفقة
                  </label>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ملاحظات
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

        {/* قائمة السجلات */}
        {renderRecordsList()}

        {/* رسالة في حالة عدم وجود سجلات */}
        {sortedRecords.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <FaTrash className="text-gray-300 text-6xl mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">لا توجد سجلات استبعاد</h3>
            <p className="text-gray-400 mb-6">ابدأ بإضافة سجل استبعاد جديد</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              إضافة استبعاد جديد
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Disposal;
