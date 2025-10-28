// ======================================
// Depreciation Schedule Page - صفحة جدول الإهلاك
// ======================================

import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  FaCalculator,
  FaDownload,
  FaPrint,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaFileExcel,
  FaFilePdf,
  FaChartLine,
  FaFilter,
  FaSearch,
  FaEdit,
  FaSave,
  FaTimes
} from 'react-icons/fa';

const DepreciationSchedule = () => {
  const { fixedAssets, setFixedAssets, assetGroups } = useData();
  const [selectedAsset, setSelectedAsset] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [viewMode, setViewMode] = useState('detailed'); // detailed, summary, compare
  const [editMode, setEditMode] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  // حساب جدول الإهلاك للأصل
  const calculateDepreciationSchedule = (asset, group) => {
    if (!group) return [];
    
    const schedule = [];
    const startDate = new Date(asset.depreciationStartDate || asset.purchaseDate);
    const usefulLife = group.usefulLife || 5;
    const salvageValue = (group.salvageValue / 100) * asset.purchasePrice;
    const depreciableAmount = asset.purchasePrice - salvageValue;
    const annualDepreciation = depreciableAmount / usefulLife;
    
    let accumulatedDep = asset.accumulatedDepreciation || 0;
    let bookValue = asset.purchasePrice;
    
    for (let year = 0; year < usefulLife; year++) {
      const yearStartDate = new Date(startDate);
      yearStartDate.setFullYear(yearStartDate.getFullYear() + year);
      
      let depreciation = annualDepreciation;
      
      // حساب الإهلاك حسب الطريقة المختارة
      switch (group.depreciationMethod) {
        case 'declining-balance':
          depreciation = bookValue * (group.depreciationRate / 100);
          if (depreciation > depreciableAmount - accumulatedDep) {
            depreciation = depreciableAmount - accumulatedDep;
          }
          break;
          
        case 'sum-of-years':
          const sumOfYears = (usefulLife * (usefulLife + 1)) / 2;
          const remainingYears = usefulLife - year;
          depreciation = (depreciableAmount * remainingYears) / sumOfYears;
          break;
          
        case 'straight-line':
        default:
          // الإهلاك الثابت مع حفظ الحد الأدنى للقيمة المتبقية
          depreciation = Math.min(annualDepreciation, depreciableAmount - accumulatedDep);
          break;
      }
      
      accumulatedDep += depreciation;
      bookValue -= depreciation;
      
      schedule.push({
        year: year + 1,
        date: yearStartDate.toISOString().split('T')[0],
        depreciation: Math.round(depreciation * 100) / 100,
        accumulatedDepreciation: Math.round(accumulatedDep * 100) / 100,
        bookValue: Math.round(bookValue * 100) / 100,
        depreciationRate: group.depreciationRate
      });
    }
    
    return schedule;
  };

  // تحديث جدول الإهلاك
  const updateScheduleItem = (assetId, yearIndex, field, value) => {
    const asset = fixedAssets.find(a => a.id === assetId);
    if (!asset) return;
    
    const group = assetGroups.find(g => g.id === parseInt(asset.groupId));
    if (!group) return;
    
    const schedule = calculateDepreciationSchedule(asset, group);
    schedule[yearIndex][field] = value;
    
    // إعادة حساب القيم التالية
    for (let i = yearIndex + 1; i < schedule.length; i++) {
      if (field === 'depreciation') {
        schedule[i].accumulatedDepreciation = schedule[i-1].accumulatedDepreciation + schedule[i].depreciation;
        schedule[i].bookValue = asset.purchasePrice - schedule[i].accumulatedDepreciation;
      } else if (field === 'bookValue') {
        schedule[i].depreciation = schedule[i-1].bookValue - schedule[i].bookValue;
        schedule[i].accumulatedDepreciation = asset.purchasePrice - schedule[i].bookValue;
      }
    }
    
    const updatedAsset = {
      ...asset,
      depreciationSchedule: schedule,
      lastUpdated: new Date().toISOString()
    };
    
    const updatedAssets = fixedAssets.map(a => a.id === assetId ? updatedAsset : a);
    setFixedAssets(updatedAssets);
  };

  // تصفية الأصول
  const filteredAssets = fixedAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = !filterGroup || asset.groupId.toString() === filterGroup;
    const matchesYear = selectedYear >= new Date(asset.purchaseDate).getFullYear() &&
                       selectedYear <= new Date(asset.purchaseDate).getFullYear() + 20; // عمر افتراضي 20 سنة
    
    return matchesSearch && matchesGroup && matchesYear;
  });

  // حساب الإحصائيات الإجمالية
  const getTotalDepreciation = (assets) => {
    return assets.reduce((total, asset) => {
      const schedule = calculateDepreciationSchedule(asset, assetGroups.find(g => g.id === parseInt(asset.groupId)));
      return total + schedule.reduce((sum, item) => sum + item.depreciation, 0);
    }, 0);
  };

  const getTotalBookValue = (assets) => {
    return assets.reduce((total, asset) => {
      const schedule = calculateDepreciationSchedule(asset, assetGroups.find(g => g.id === parseInt(asset.groupId)));
      return total + (schedule[schedule.length - 1]?.bookValue || 0);
    }, 0);
  };

  const getTotalAccumulatedDepreciation = (assets) => {
    return assets.reduce((total, asset) => {
      const schedule = calculateDepreciationSchedule(asset, assetGroups.find(g => g.id === parseInt(asset.groupId)));
      return total + (schedule[schedule.length - 1]?.accumulatedDepreciation || 0);
    }, 0);
  };

  // طباعة التقرير
  const handlePrint = () => {
    window.print();
  };

  // تصدير Excel
  const handleExportExcel = () => {
    // هنا يمكن إضافة منطق تصدير Excel
    alert('سيتم إضافة خاصية التصدير قريباً');
  };

  // تصدير PDF
  const handleExportPDF = () => {
    // هنا يمكن إضافة منطق تصدير PDF
    alert('سيتم إضافة خاصية التصدير قريباً');
  };

  // عرض جدول الإهلاك المفصل
  const renderDetailedView = () => {
    const asset = selectedAsset ? fixedAssets.find(a => a.id === parseInt(selectedAsset)) : null;
    const group = asset ? assetGroups.find(g => g.id === parseInt(asset.groupId)) : null;
    
    if (!asset || !group) {
      return (
        <div className="text-center py-12">
          <FaCalculator className="text-gray-300 text-6xl mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">اختر أصلاً لعرض جدول الإهلاك</h3>
          <p className="text-gray-400">ستظهر تفاصيل الإهلاك هنا</p>
        </div>
      );
    }

    const schedule = calculateDepreciationSchedule(asset, group);

    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 bg-blue-50 border-b">
          <h3 className="text-lg font-bold text-gray-800">جدول إهلاك: {asset.name}</h3>
          <p className="text-gray-600">رمز الأصل: {asset.code} | مجموعة: {group.name}</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  السنة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التاريخ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإهلاك السنوي
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإهلاك التراكمي
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  القيمة الدفترية
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  معدل الإهلاك
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schedule.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(item.date).toLocaleDateString('ar-SA')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editMode && editingSchedule?.assetId === asset.id && editingSchedule?.yearIndex === index ? (
                      <input
                        type="number"
                        value={item.depreciation}
                        onChange={(e) => updateScheduleItem(asset.id, index, 'depreciation', parseFloat(e.target.value) || 0)}
                        className="w-24 px-2 py-1 border rounded text-sm"
                        step="0.01"
                      />
                    ) : (
                      <div className="flex items-center">
                        {item.depreciation.toLocaleString()} ر.س
                        {editMode && (
                          <button
                            onClick={() => setEditingSchedule({ assetId: asset.id, yearIndex: index })}
                            className="mr-2 text-blue-600 hover:text-blue-800"
                          >
                            <FaEdit className="text-xs" />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.accumulatedDepreciation.toLocaleString()} ر.س
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.bookValue.toLocaleString()} ر.س
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.depreciationRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ملخص جدول الإهلاك */}
        <div className="p-6 bg-gray-50 border-t">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600">إجمالي الإهلاك</p>
              <p className="text-xl font-bold text-blue-800">
                {schedule.reduce((sum, item) => sum + item.depreciation, 0).toLocaleString()} ر.س
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600">الإهلاك التراكمي</p>
              <p className="text-xl font-bold text-green-800">
                {schedule[schedule.length - 1]?.accumulatedDepreciation.toLocaleString()} ر.س
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600">القيمة الدفترية النهائية</p>
              <p className="text-xl font-bold text-purple-800">
                {schedule[schedule.length - 1]?.bookValue.toLocaleString()} ر.س
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-orange-600">سعر الشراء</p>
              <p className="text-xl font-bold text-orange-800">
                {asset.purchasePrice.toLocaleString()} ر.س
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // عرض ملخص إهلاك لجميع الأصول
  const renderSummaryView = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 bg-blue-50 border-b">
          <h3 className="text-lg font-bold text-gray-800">ملخص إهلاك الأصول</h3>
          <p className="text-gray-600">نظرة عامة على إهلاك جميع الأصول</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الأصل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المجموعة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  سعر الشراء
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإهلاك التراكمي
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  القيمة الحالية
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  العمر المتبقي
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  نسبة الإهلاك
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssets.map(asset => {
                const group = assetGroups.find(g => g.id === parseInt(asset.groupId));
                if (!group) return null;
                
                const schedule = calculateDepreciationSchedule(asset, group);
                const currentYearIndex = Math.min(selectedYear - new Date(asset.purchaseDate).getFullYear(), schedule.length - 1);
                const currentSchedule = schedule[currentYearIndex];
                
                const totalDepreciation = schedule.reduce((sum, item) => sum + item.depreciation, 0);
                const depreciationPercentage = (totalDepreciation / asset.purchasePrice) * 100;
                
                return (
                  <tr key={asset.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                      <div className="text-sm text-gray-500">{asset.code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {group.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {asset.purchasePrice.toLocaleString()} ر.س
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {currentSchedule?.accumulatedDepreciation.toLocaleString()} ر.س
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {currentSchedule?.bookValue.toLocaleString()} ر.س
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {group.usefulLife - currentYearIndex} سنة
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 ml-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${Math.min(depreciationPercentage, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">
                          {Math.round(depreciationPercentage)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* رأس الصفحة */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FaCalculator className="text-3xl text-blue-600 ml-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">جدول الإهلاك</h1>
                <p className="text-gray-600">حساب ومتابعة إهلاك الأصول الثابتة</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <FaPrint className="ml-2" />
                طباعة
              </button>
              <button
                onClick={handleExportExcel}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <FaFileExcel className="ml-2" />
                Excel
              </button>
              <button
                onClick={handleExportPDF}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <FaFilePdf className="ml-2" />
                PDF
              </button>
            </div>
          </div>

          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FaMoneyBillWave className="text-blue-600 text-2xl" />
                <div className="mr-3">
                  <p className="text-sm text-blue-600">إجمالي الإهلاك</p>
                  <p className="text-xl font-bold text-blue-800">
                    {getTotalDepreciation(filteredAssets).toLocaleString()} ر.س
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FaCalculator className="text-green-600 text-2xl" />
                <div className="mr-3">
                  <p className="text-sm text-green-600">الإهلاك التراكمي</p>
                  <p className="text-xl font-bold text-green-800">
                    {getTotalAccumulatedDepreciation(filteredAssets).toLocaleString()} ر.س
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FaChartLine className="text-purple-600 text-2xl" />
                <div className="mr-3">
                  <p className="text-sm text-purple-600">القيمة الحالية</p>
                  <p className="text-xl font-bold text-purple-800">
                    {getTotalBookValue(filteredAssets).toLocaleString()} ر.س
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FaCalendarAlt className="text-orange-600 text-2xl" />
                <div className="mr-3">
                  <p className="text-sm text-orange-600">عدد الأصول</p>
                  <p className="text-xl font-bold text-orange-800">{filteredAssets.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* أدوات التحكم */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-6">
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
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Array.from({length: 20}, (_, i) => 2020 + i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            
            <select
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">جميع الأصول</option>
              {fixedAssets.map(asset => (
                <option key={asset.id} value={asset.id}>{asset.name} - {asset.code}</option>
              ))}
            </select>
            
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="detailed">عرض مفصل</option>
              <option value="summary">ملخص شامل</option>
              <option value="compare">مقارنة</option>
            </select>
            
            <div className="flex gap-2">
              {editMode ? (
                <>
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center"
                  >
                    <FaTimes className="ml-2" />
                    إلغاء التعديل
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
                >
                  <FaEdit className="ml-2" />
                  تحرير
                </button>
              )}
            </div>
          </div>
        </div>

        {/* المحتوى الرئيسي */}
        {viewMode === 'detailed' ? renderDetailedView() : 
         viewMode === 'summary' ? renderSummaryView() :
         <div className="text-center py-12">
          <FaChartLine className="text-gray-300 text-6xl mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">وضع المقارنة قيد التطوير</h3>
          <p className="text-gray-400">سيتم إضافة خاصية المقارنة قريباً</p>
         </div>}
      </div>
    </div>
  );
};

export default DepreciationSchedule;
