// ======================================
// Fixed Assets Page - صفحة الأصول الثابتة
// ======================================

import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaSearch,
  FaFilter,
  FaEye,
  FaDownload,
  FaUpload,
  FaImage,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaCalculator,
  FaBarcode,
  FaMapMarkerAlt
} from 'react-icons/fa';

const FixedAssets = () => {
  const { fixedAssets, setFixedAssets, assetGroups } = useData();
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewingAsset, setViewingAsset] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    groupId: '',
    category: '',
    purchaseDate: '',
    purchasePrice: 0,
    currentValue: 0,
    location: '',
    department: '',
    supplier: '',
    serialNumber: '',
    barcode: '',
    warrantyExpiry: '',
    status: 'active',
    images: [],
    documents: [],
    depreciationStartDate: '',
    accumulatedDepreciation: 0,
    notes: ''
  });

  // إنشاء رمز تلقائي للأصل
  const generateAssetCode = () => {
    const year = new Date().getFullYear();
    const count = fixedAssets.length + 1;
    return `AST-${year}-${count.toString().padStart(4, '0')}`;
  };

  // إضافة أصل ثابت جديد
  const handleSubmit = (e) => {
    e.preventDefault();
    const assetGroup = assetGroups.find(g => g.id === parseInt(formData.groupId));
    
    if (editingId) {
      // تحديث أصل موجود
      const updatedAssets = fixedAssets.map(asset =>
        asset.id === editingId ? { 
          ...formData, 
          id: editingId,
          groupName: assetGroup ? assetGroup.name : '',
          lastUpdated: new Date().toISOString()
        } : asset
      );
      setFixedAssets(updatedAssets);
      setEditingId(null);
    } else {
      // إضافة أصل جديد
      const newAsset = {
        ...formData,
        id: Date.now(),
        code: formData.code || generateAssetCode(),
        groupName: assetGroup ? assetGroup.name : '',
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        depreciationSchedule: calculateDepreciationSchedule(formData, assetGroup)
      };
      setFixedAssets([...fixedAssets, newAsset]);
    }
    
    resetForm();
  };

  // إعادة تعيين النموذج
  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      groupId: '',
      category: '',
      purchaseDate: '',
      purchasePrice: 0,
      currentValue: 0,
      location: '',
      department: '',
      supplier: '',
      serialNumber: '',
      barcode: '',
      warrantyExpiry: '',
      status: 'active',
      images: [],
      documents: [],
      depreciationStartDate: '',
      accumulatedDepreciation: 0,
      notes: ''
    });
    setShowForm(false);
  };

  // حذف أصل
  const handleDelete = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الأصل؟')) {
      setFixedAssets(fixedAssets.filter(asset => asset.id !== id));
    }
  };

  // تعديل أصل
  const handleEdit = (asset) => {
    setFormData(asset);
    setEditingId(asset.id);
    setShowForm(true);
  };

  // إلغاء التعديل
  const handleCancel = () => {
    setEditingId(null);
    resetForm();
  };

  // عرض تفاصيل الأصل
  const handleView = (asset) => {
    setViewingAsset(asset);
  };

  // حساب جدول الإهلاك
  const calculateDepreciationSchedule = (assetData, group) => {
    if (!group) return [];
    
    const schedule = [];
    const startDate = new Date(assetData.depreciationStartDate || assetData.purchaseDate);
    const usefulLife = group.usefulLife || 5;
    const salvageValue = (group.salvageValue / 100) * assetData.purchasePrice;
    const depreciableAmount = assetData.purchasePrice - salvageValue;
    const annualDepreciation = depreciableAmount / usefulLife;
    
    let accumulatedDep = 0;
    let bookValue = assetData.purchasePrice;
    
    for (let year = 0; year < usefulLife; year++) {
      const yearStartDate = new Date(startDate);
      yearStartDate.setFullYear(yearStartDate.getFullYear() + year);
      
      let depreciation = annualDepreciation;
      if (group.depreciationMethod === 'declining-balance') {
        depreciation = bookValue * (group.depreciationRate / 100);
        if (depreciation > depreciableAmount - accumulatedDep) {
          depreciation = depreciableAmount - accumulatedDep;
        }
      }
      
      accumulatedDep += depreciation;
      bookValue -= depreciation;
      
      schedule.push({
        year: year + 1,
        date: yearStartDate.toISOString().split('T')[0],
        depreciation: Math.round(depreciation * 100) / 100,
        accumulatedDepreciation: Math.round(accumulatedDep * 100) / 100,
        bookValue: Math.round(bookValue * 100) / 100
      });
    }
    
    return schedule;
  };

  // تحديث القيمة الحالية بناءً على الإهلاك
  const updateCurrentValue = (assetData) => {
    const assetGroup = assetGroups.find(g => g.id === parseInt(assetData.groupId));
    if (!assetGroup) return assetData.currentValue;
    
    const schedule = calculateDepreciationSchedule(assetData, assetGroup);
    const currentYear = new Date().getFullYear();
    const purchaseYear = new Date(assetData.purchaseDate).getFullYear();
    const yearsElapsed = currentYear - purchaseYear;
    
    const applicableSchedule = schedule.find(s => s.year === yearsElapsed);
    return applicableSchedule ? applicableSchedule.bookValue : assetData.purchasePrice;
  };

  // رفع صور
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onload = () => resolve({
          id: Date.now() + Math.random(),
          name: file.name,
          data: reader.result,
          type: file.type
        });
        reader.readAsDataURL(file);
      });
    });
    
    Promise.all(newImages).then(images => {
      setFormData({...formData, images: [...formData.images, ...images]});
    });
  };

  // حذف صورة
  const removeImage = (imageId) => {
    setFormData({
      ...formData, 
      images: formData.images.filter(img => img.id !== imageId)
    });
  };

  // تصفية وبحث الأصول
  const filteredAssets = fixedAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || asset.category === filterCategory;
    const matchesGroup = !filterGroup || asset.groupId.toString() === filterGroup;
    
    return matchesSearch && matchesCategory && matchesGroup;
  });

  // ترتيب الأصول
  const sortedAssets = [...filteredAssets].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'code':
        return a.code.localeCompare(b.code);
      case 'purchasePrice':
        return b.purchasePrice - a.purchasePrice;
      case 'purchaseDate':
        return new Date(b.purchaseDate) - new Date(a.purchaseDate);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  // حساب الإحصائيات
  const stats = {
    total: fixedAssets.length,
    active: fixedAssets.filter(a => a.status === 'active').length,
    totalValue: fixedAssets.reduce((sum, a) => sum + (a.currentValue || 0), 0),
    totalPurchaseValue: fixedAssets.reduce((sum, a) => sum + (a.purchasePrice || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* رأس الصفحة */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FaMoneyBillWave className="text-3xl text-blue-600 ml-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">الأصول الثابتة</h1>
                <p className="text-gray-600">إدارة شاملة للأصول الثابتة والممتلكات</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
            >
              <FaPlus className="ml-2" />
              إضافة أصل ثابت
            </button>
          </div>

          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FaMoneyBillWave className="text-blue-600 text-2xl" />
                <div className="mr-3">
                  <p className="text-sm text-blue-600">إجمالي الأصول</p>
                  <p className="text-xl font-bold text-blue-800">{stats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FaCalendarAlt className="text-green-600 text-2xl" />
                <div className="mr-3">
                  <p className="text-sm text-green-600">الأصول النشطة</p>
                  <p className="text-xl font-bold text-green-800">{stats.active}</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FaCalculator className="text-purple-600 text-2xl" />
                <div className="mr-3">
                  <p className="text-sm text-purple-600">إجمالي القيمة الحالية</p>
                  <p className="text-xl font-bold text-purple-800">
                    {stats.totalValue.toLocaleString()} ر.س
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FaMoneyBillWave className="text-orange-600 text-2xl" />
                <div className="mr-3">
                  <p className="text-sm text-orange-600">قيمة الشراء الإجمالية</p>
                  <p className="text-xl font-bold text-orange-800">
                    {stats.totalPurchaseValue.toLocaleString()} ر.س
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* أدوات البحث والتصفية */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="بحث في الأصول..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">جميع الفئات</option>
              <option value="equipment">معدات</option>
              <option value="vehicles">مركبات</option>
              <option value="buildings">مباني</option>
              <option value="furniture">أثاث</option>
              <option value="machinery">آلات</option>
              <option value="computers">أجهزة حاسوب</option>
              <option value="other">أخرى</option>
            </select>
            
            <select
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">جميع المجموعات</option>
              {assetGroups.map(group => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="name">ترتيب بالاسم</option>
              <option value="code">ترتيب بالرمز</option>
              <option value="purchasePrice">ترتيب بالقيمة</option>
              <option value="purchaseDate">ترتيب بالتاريخ</option>
              <option value="status">ترتيب بالحالة</option>
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
              {editingId ? 'تعديل الأصل الثابت' : 'إضافة أصل ثابت جديد'}
            </h2>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* العمود الأول */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رمز الأصل *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="أدخل رمز الأصل"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, code: generateAssetCode()})}
                      className="px-4 py-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors"
                      title="إنشاء رمز تلقائي"
                    >
                      <FaBarcode />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم الأصل *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أدخل اسم الأصل"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الوصف
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="وصف تفصيلي للأصل"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    مجموعة الأصل
                  </label>
                  <select
                    value={formData.groupId}
                    onChange={(e) => setFormData({...formData, groupId: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">اختر المجموعة</option>
                    {assetGroups.map(group => (
                      <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الفئة
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">اختر الفئة</option>
                    <option value="equipment">معدات</option>
                    <option value="vehicles">مركبات</option>
                    <option value="buildings">مباني</option>
                    <option value="furniture">أثاث</option>
                    <option value="machinery">آلات</option>
                    <option value="computers">أجهزة حاسوب</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاريخ الشراء
                  </label>
                  <input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* العمود الثاني */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    سعر الشراء
                  </label>
                  <input
                    type="number"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({...formData, purchasePrice: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    القيمة الحالية
                  </label>
                  <input
                    type="number"
                    value={formData.currentValue}
                    onChange={(e) => setFormData({...formData, currentValue: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الموقع
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="موقع الأصل"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    القسم
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="القسم المسؤول"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المورد
                  </label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="اسم المورد"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الرقم التسلسلي
                  </label>
                  <input
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="الرقم التسلسلي"
                  />
                </div>
              </div>

              {/* العمود الثالث */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    باركود
                  </label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="الباركود"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاريخ انتهاء الضمان
                  </label>
                  <input
                    type="date"
                    value={formData.warrantyExpiry}
                    onChange={(e) => setFormData({...formData, warrantyExpiry: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    حالة الأصل
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">نشط</option>
                    <option value="maintenance">صيانة</option>
                    <option value="disposed">مستبعد</option>
                    <option value="transferred">منقول</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاريخ بدء الإهلاك
                  </label>
                  <input
                    type="date"
                    value={formData.depreciationStartDate}
                    onChange={(e) => setFormData({...formData, depreciationStartDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الإهلاك التراكمي
                  </label>
                  <input
                    type="number"
                    value={formData.accumulatedDepreciation}
                    onChange={(e) => setFormData({...formData, accumulatedDepreciation: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    صور الأصل
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {formData.images.length > 0 && (
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {formData.images.map(image => (
                        <div key={image.id} className="relative">
                          <img src={image.data} alt={image.name} className="w-full h-20 object-cover rounded border" />
                          <button
                            type="button"
                            onClick={() => removeImage(image.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* ملاحظات */}
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ملاحظات إضافية
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="أي ملاحظات أو تفاصيل إضافية"
                />
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

        {/* قائمة الأصول */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الأصل
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الرمز
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المجموعة
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    سعر الشراء
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    القيمة الحالية
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الموقع
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    العمليات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedAssets.map(asset => (
                  <tr key={asset.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {asset.images && asset.images.length > 0 ? (
                            <img className="h-10 w-10 rounded-full object-cover" src={asset.images[0].data} alt={asset.name} />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <FaImage className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="mr-4">
                          <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                          <div className="text-sm text-gray-500">{asset.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {asset.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {asset.groupName || 'غير محدد'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {asset.purchasePrice?.toLocaleString()} ر.س
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(asset.currentValue || 0).toLocaleString()} ر.س
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="ml-1 text-gray-400" />
                        {asset.location || 'غير محدد'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        asset.status === 'active' ? 'bg-green-100 text-green-800' :
                        asset.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                        asset.status === 'disposed' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {asset.status === 'active' ? 'نشط' :
                         asset.status === 'maintenance' ? 'صيانة' :
                         asset.status === 'disposed' ? 'مستبعد' :
                         asset.status === 'transferred' ? 'منقول' : asset.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(asset)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="عرض التفاصيل"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEdit(asset)}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                          title="تعديل"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(asset.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="حذف"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* رسالة في حالة عدم وجود أصول */}
          {sortedAssets.length === 0 && (
            <div className="text-center py-12">
              <FaMoneyBillWave className="text-gray-300 text-6xl mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">لا توجد أصول ثابتة</h3>
              <p className="text-gray-400 mb-6">ابدأ بإضافة أصل ثابت جديد</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                إضافة أصل ثابت جديد
              </button>
            </div>
          )}
        </div>

        {/* نافذة عرض التفاصيل */}
        {viewingAsset && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">تفاصيل الأصل</h3>
                <button
                  onClick={() => setViewingAsset(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* معلومات أساسية */}
                <div>
                  <h4 className="font-bold text-gray-700 mb-3">المعلومات الأساسية</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">الاسم:</span> {viewingAsset.name}</p>
                    <p><span className="font-medium">الرمز:</span> {viewingAsset.code}</p>
                    <p><span className="font-medium">الوصف:</span> {viewingAsset.description}</p>
                    <p><span className="font-medium">المجموعة:</span> {viewingAsset.groupName}</p>
                    <p><span className="font-medium">الفئة:</span> {viewingAsset.category}</p>
                    <p><span className="font-medium">المورد:</span> {viewingAsset.supplier}</p>
                  </div>
                </div>

                {/* معلومات مالية */}
                <div>
                  <h4 className="font-bold text-gray-700 mb-3">المعلومات المالية</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">سعر الشراء:</span> {viewingAsset.purchasePrice?.toLocaleString()} ر.س</p>
                    <p><span className="font-medium">القيمة الحالية:</span> {viewingAsset.currentValue?.toLocaleString()} ر.س</p>
                    <p><span className="font-medium">تاريخ الشراء:</span> {viewingAsset.purchaseDate}</p>
                    <p><span className="font-medium">الإهلاك التراكمي:</span> {viewingAsset.accumulatedDepreciation?.toLocaleString()} ر.س</p>
                  </div>
                </div>

                {/* معلومات الموقع والصيانة */}
                <div>
                  <h4 className="font-bold text-gray-700 mb-3">الموقع والصيانة</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">الموقع:</span> {viewingAsset.location}</p>
                    <p><span className="font-medium">القسم:</span> {viewingAsset.department}</p>
                    <p><span className="font-medium">الرقم التسلسلي:</span> {viewingAsset.serialNumber}</p>
                    <p><span className="font-medium">الباركود:</span> {viewingAsset.barcode}</p>
                    <p><span className="font-medium">انتهاء الضمان:</span> {viewingAsset.warrantyExpiry}</p>
                  </div>
                </div>

                {/* الحالة والملاحظات */}
                <div>
                  <h4 className="font-bold text-gray-700 mb-3">الحالة والملاحظات</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">الحالة:</span> 
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mr-2 ${
                        viewingAsset.status === 'active' ? 'bg-green-100 text-green-800' :
                        viewingAsset.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                        viewingAsset.status === 'disposed' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {viewingAsset.status === 'active' ? 'نشط' :
                         viewingAsset.status === 'maintenance' ? 'صيانة' :
                         viewingAsset.status === 'disposed' ? 'مستبعد' :
                         viewingAsset.status === 'transferred' ? 'منقول' : viewingAsset.status}
                      </span>
                    </p>
                    <p><span className="font-medium">تاريخ الإنشاء:</span> {new Date(viewingAsset.createdAt).toLocaleDateString('ar-SA')}</p>
                    <p><span className="font-medium">آخر تحديث:</span> {new Date(viewingAsset.lastUpdated).toLocaleDateString('ar-SA')}</p>
                  </div>
                </div>
              </div>

              {/* صور الأصل */}
              {viewingAsset.images && viewingAsset.images.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-bold text-gray-700 mb-3">صور الأصل</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {viewingAsset.images.map(image => (
                      <img key={image.id} src={image.data} alt={image.name} className="w-full h-32 object-cover rounded border" />
                    ))}
                  </div>
                </div>
              )}

              {/* جدول الإهلاك */}
              {viewingAsset.depreciationSchedule && viewingAsset.depreciationSchedule.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-bold text-gray-700 mb-3">جدول الإهلاك</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-right">السنة</th>
                          <th className="px-3 py-2 text-right">التاريخ</th>
                          <th className="px-3 py-2 text-right">الإهلاك</th>
                          <th className="px-3 py-2 text-right">الإهلاك التراكمي</th>
                          <th className="px-3 py-2 text-right">القيمة الدفترية</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewingAsset.depreciationSchedule.map((schedule, index) => (
                          <tr key={index} className="border-t">
                            <td className="px-3 py-2">{schedule.year}</td>
                            <td className="px-3 py-2">{new Date(schedule.date).toLocaleDateString('ar-SA')}</td>
                            <td className="px-3 py-2">{schedule.depreciation.toLocaleString()} ر.س</td>
                            <td className="px-3 py-2">{schedule.accumulatedDepreciation.toLocaleString()} ر.س</td>
                            <td className="px-3 py-2">{schedule.bookValue.toLocaleString()} ر.س</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FixedAssets;
