// ======================================
// Asset Groups Page - صفحة مجموعات الأصول
// ======================================

import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaFolder,
  FaImage,
  FaCalculator,
  FaCalendarAlt
} from 'react-icons/fa';

const AssetGroups = () => {
  const { assetGroups, setAssetGroups, depreciationMethods } = useData();
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    depreciationMethod: 'straight-line',
    usefulLife: 0,
    salvageValue: 0,
    depreciationRate: 0,
    category: '',
    notes: '',
    image: null
  });

  // إضافة مجموعة أصول جديدة
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // تحديث مجموعة موجودة
      const updatedGroups = assetGroups.map(group =>
        group.id === editingId ? { ...formData, id: editingId } : group
      );
      setAssetGroups(updatedGroups);
      setEditingId(null);
    } else {
      // إضافة مجموعة جديدة
      const newGroup = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        assetCount: 0,
        totalValue: 0
      };
      setAssetGroups([...assetGroups, newGroup]);
    }
    
    setFormData({
      name: '',
      description: '',
      depreciationMethod: 'straight-line',
      usefulLife: 0,
      salvageValue: 0,
      depreciationRate: 0,
      category: '',
      notes: '',
      image: null
    });
    setShowForm(false);
  };

  // حذف مجموعة
  const handleDelete = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المجموعة؟')) {
      setAssetGroups(assetGroups.filter(group => group.id !== id));
    }
  };

  // تعديل مجموعة
  const handleEdit = (group) => {
    setFormData(group);
    setEditingId(group.id);
    setShowForm(true);
  };

  // إلغاء التعديل
  const handleCancel = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({
      name: '',
      description: '',
      depreciationMethod: 'straight-line',
      usefulLife: 0,
      salvageValue: 0,
      depreciationRate: 0,
      category: '',
      notes: '',
      image: null
    });
  };

  // حساب معدل الإهلاك
  const calculateDepreciationRate = () => {
    if (formData.usefulLife > 0) {
      const rate = ((1 - (formData.salvageValue / 100)) / formData.usefulLife) * 100;
      setFormData({ ...formData, depreciationRate: Math.round(rate * 100) / 100 });
    }
  };

  // معاينة الصورة
  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* رأس الصفحة */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FaFolder className="text-3xl text-blue-600 ml-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">مجموعات الأصول الثابتة</h1>
                <p className="text-gray-600">إدارة وتصنيف الأصول الثابتة في المجموعات</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
            >
              <FaPlus className="ml-2" />
              إضافة مجموعة جديدة
            </button>
          </div>

          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FaFolder className="text-blue-600 text-2xl" />
                <div className="mr-3">
                  <p className="text-sm text-blue-600">إجمالي المجموعات</p>
                  <p className="text-xl font-bold text-blue-800">{assetGroups.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FaCalculator className="text-green-600 text-2xl" />
                <div className="mr-3">
                  <p className="text-sm text-green-600">متوسط معدل الإهلاك</p>
                  <p className="text-xl font-bold text-green-800">
                    {assetGroups.length > 0 
                      ? Math.round(assetGroups.reduce((sum, g) => sum + (g.depreciationRate || 0), 0) / assetGroups.length * 100) / 100
                      : 0}%
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FaCalendarAlt className="text-purple-600 text-2xl" />
                <div className="mr-3">
                  <p className="text-sm text-purple-600">متوسط العمر المفيد</p>
                  <p className="text-xl font-bold text-purple-800">
                    {assetGroups.length > 0 
                      ? Math.round(assetGroups.reduce((sum, g) => sum + (g.usefulLife || 0), 0) / assetGroups.length)
                      : 0} سنة
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FaImage className="text-orange-600 text-2xl" />
                <div className="mr-3">
                  <p className="text-sm text-orange-600">مجموعات بالصور</p>
                  <p className="text-xl font-bold text-orange-800">
                    {assetGroups.filter(g => g.image).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* نموذج إضافة/تعديل */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingId ? 'تعديل مجموعة الأصول' : 'إضافة مجموعة أصول جديدة'}
            </h2>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* العمود الأول */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم المجموعة *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أدخل اسم مجموعة الأصول"
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
                    placeholder="وصف مفصل للمجموعة"
                  />
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
                    طريقة الإهلاك
                  </label>
                  <select
                    value={formData.depreciationMethod}
                    onChange={(e) => setFormData({...formData, depreciationMethod: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="straight-line">خط مستقيم</option>
                    <option value="declining-balance">رصيد متناقص</option>
                    <option value="sum-of-years">مجموع أرقام السنوات</option>
                    <option value="units-of-production">وحدات الإنتاج</option>
                  </select>
                </div>
              </div>

              {/* العمود الثاني */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العمر المفيد (بالسنوات)
                  </label>
                  <input
                    type="number"
                    value={formData.usefulLife}
                    onChange={(e) => setFormData({...formData, usefulLife: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    القيمة المتبقية (%)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={formData.salvageValue}
                      onChange={(e) => setFormData({...formData, salvageValue: parseFloat(e.target.value) || 0})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      max="100"
                      step="0.01"
                    />
                    <button
                      type="button"
                      onClick={calculateDepreciationRate}
                      className="px-4 py-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors"
                      title="حساب معدل الإهلاك"
                    >
                      <FaCalculator />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    معدل الإهلاك (%)
                  </label>
                  <input
                    type="number"
                    value={formData.depreciationRate}
                    onChange={(e) => setFormData({...formData, depreciationRate: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    صورة المجموعة
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImagePreview}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {formData.image && (
                    <div className="mt-2">
                      <img src={formData.image} alt="معاينة" className="w-20 h-20 object-cover rounded-lg border" />
                    </div>
                  )}
                </div>
              </div>

              {/* ملاحظات */}
              <div className="md:col-span-2">
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
              <div className="md:col-span-2 flex gap-4 justify-end">
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

        {/* قائمة المجموعات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assetGroups.map(group => (
            <div key={group.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* صورة المجموعة */}
              {group.image ? (
                <img src={group.image} alt={group.name} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                  <FaImage className="text-gray-400 text-4xl" />
                </div>
              )}

              <div className="p-6">
                {/* معلومات المجموعة */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{group.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{group.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {group.category || 'غير محدد'}
                    </span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {group.depreciationMethod === 'straight-line' ? 'خط مستقيم' : 
                       group.depreciationMethod === 'declining-balance' ? 'رصيد متناقص' :
                       group.depreciationMethod === 'sum-of-years' ? 'مجموع أرقام السنوات' : 'وحدات الإنتاج'}
                    </span>
                  </div>
                </div>

                {/* إحصائيات المجموعة */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-500">العمر المفيد</p>
                    <p className="font-bold text-gray-800">{group.usefulLife || 0} سنة</p>
                  </div>
                  <div>
                    <p className="text-gray-500">معدل الإهلاك</p>
                    <p className="font-bold text-gray-800">{group.depreciationRate || 0}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500">القيمة المتبقية</p>
                    <p className="font-bold text-gray-800">{group.salvageValue || 0}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500">عدد الأصول</p>
                    <p className="font-bold text-gray-800">{group.assetCount || 0}</p>
                  </div>
                </div>

                {/* أزرار العمليات */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(group)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors flex items-center justify-center"
                  >
                    <FaEdit className="ml-1" />
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(group.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm transition-colors flex items-center justify-center"
                  >
                    <FaTrash className="ml-1" />
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* رسالة في حالة عدم وجود مجموعات */}
          {assetGroups.length === 0 && (
            <div className="col-span-full text-center py-12">
              <FaFolder className="text-gray-300 text-6xl mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">لا توجد مجموعات أصول</h3>
              <p className="text-gray-400 mb-6">ابدأ بإضافة مجموعة أصول جديدة</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                إضافة مجموعة جديدة
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetGroups;
