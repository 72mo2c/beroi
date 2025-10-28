// ======================================
// Asset Reports Page - صفحة تقارير الأصول
// ======================================

import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  FaChartBar,
  FaChartLine,
  FaPieChart,
  FaDownload,
  FaPrint,
  FaFileExcel,
  FaFilePdf,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaTools,
  FaFilter,
  FaEye,
  FaBuilding,
  FaFileAlt,
  FaCalculator,
  FaExclamationTriangle
} from 'react-icons/fa';

const AssetReports = () => {
  const { fixedAssets, assetGroups, maintenanceRecords, disposalRecords } = useData();
  const [reportType, setReportType] = useState('overview');
  const [dateRange, setDateRange] = useState('all');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [reportFormat, setReportFormat] = useState('screen'); // screen, pdf, excel

  // فلترة البيانات حسب المعايير المختارة
  const getFilteredAssets = () => {
    let filtered = [...fixedAssets];
    
    if (selectedGroup) {
      filtered = filtered.filter(asset => asset.groupId.toString() === selectedGroup);
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(asset => asset.category === selectedCategory);
    }
    
    if (dateRange !== 'all') {
      const now = new Date();
      const currentYear = now.getFullYear();
      
      filtered = filtered.filter(asset => {
        const purchaseYear = new Date(asset.purchaseDate).getFullYear();
        switch (dateRange) {
          case 'current-year':
            return purchaseYear === currentYear;
          case 'last-year':
            return purchaseYear === currentYear - 1;
          case 'last-3-years':
            return purchaseYear >= currentYear - 3;
          default:
            return true;
        }
      });
    }
    
    return filtered;
  };

  // حساب الإحصائيات
  const calculateStats = () => {
    const assets = getFilteredAssets();
    const totalAssets = assets.length;
    const totalPurchaseValue = assets.reduce((sum, asset) => sum + (asset.purchasePrice || 0), 0);
    const totalCurrentValue = assets.reduce((sum, asset) => sum + (asset.currentValue || 0), 0);
    const totalDepreciation = totalPurchaseValue - totalCurrentValue;
    
    // إحصائيات حسب الفئة
    const categoryStats = {};
    assets.forEach(asset => {
      const category = asset.category || 'غير محدد';
      if (!categoryStats[category]) {
        categoryStats[category] = { count: 0, value: 0 };
      }
      categoryStats[category].count++;
      categoryStats[category].value += asset.currentValue || asset.purchasePrice || 0;
    });
    
    // إحصائيات حسب الحالة
    const statusStats = {};
    assets.forEach(asset => {
      const status = asset.status || 'غير محدد';
      if (!statusStats[status]) {
        statusStats[status] = { count: 0, value: 0 };
      }
      statusStats[status].count++;
      statusStats[status].value += asset.currentValue || asset.purchasePrice || 0;
    });
    
    return {
      totalAssets,
      totalPurchaseValue,
      totalCurrentValue,
      totalDepreciation,
      categoryStats,
      statusStats,
      depreciationPercentage: totalPurchaseValue > 0 ? (totalDepreciation / totalPurchaseValue * 100) : 0
    };
  };

  // تقرير الأصول حسب الفئة
  const renderCategoryReport = () => {
    const { categoryStats, totalCurrentValue } = calculateStats();
    
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 bg-blue-50 border-b">
          <h3 className="text-lg font-bold text-gray-800">تقرير الأصول حسب الفئة</h3>
          <p className="text-gray-600">توزيع الأصول وقيمتها حسب الفئة</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الفئة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  عدد الأصول
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  القيمة الحالية
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  النسبة المئوية
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(categoryStats).map(([category, stats]) => (
                <tr key={category} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaBuilding className="text-blue-600 ml-2" />
                      <span className="text-sm font-medium text-gray-900">
                        {category === 'equipment' ? 'معدات' :
                         category === 'vehicles' ? 'مركبات' :
                         category === 'buildings' ? 'مباني' :
                         category === 'furniture' ? 'أثاث' :
                         category === 'machinery' ? 'آلات' :
                         category === 'computers' ? 'أجهزة حاسوب' :
                         category}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stats.count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stats.value.toLocaleString()} ر.س
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 ml-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${totalCurrentValue > 0 ? (stats.value / totalCurrentValue * 100) : 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">
                        {totalCurrentValue > 0 ? Math.round(stats.value / totalCurrentValue * 100) : 0}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // تقرير الإهلاك
  const renderDepreciationReport = () => {
    const assets = getFilteredAssets();
    const totalPurchaseValue = assets.reduce((sum, asset) => sum + (asset.purchasePrice || 0), 0);
    const totalCurrentValue = assets.reduce((sum, asset) => sum + (asset.currentValue || 0), 0);
    const totalDepreciation = totalPurchaseValue - totalCurrentValue;
    
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 bg-green-50 border-b">
          <h3 className="text-lg font-bold text-gray-800">تقرير الإهلاك</h3>
          <p className="text-gray-600">تفاصيل إهلاك وقيمة الأصول</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FaMoneyBillWave className="text-blue-600 text-2xl" />
                <div className="mr-3">
                  <p className="text-sm text-blue-600">إجمالي قيمة الشراء</p>
                  <p className="text-xl font-bold text-blue-800">
                    {totalPurchaseValue.toLocaleString()} ر.س
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FaCalculator className="text-green-600 text-2xl" />
                <div className="mr-3">
                  <p className="text-sm text-green-600">القيمة الحالية</p>
                  <p className="text-xl font-bold text-green-800">
                    {totalCurrentValue.toLocaleString()} ر.س
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FaChartLine className="text-purple-600 text-2xl" />
                <div className="mr-3">
                  <p className="text-sm text-purple-600">إجمالي الإهلاك</p>
                  <p className="text-xl font-bold text-purple-800">
                    {totalDepreciation.toLocaleString()} ر.س
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الأصل
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    سعر الشراء
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    القيمة الحالية
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإهلاك
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    نسبة الإهلاك
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assets.map(asset => {
                  const depreciation = (asset.purchasePrice || 0) - (asset.currentValue || 0);
                  const depreciationPercentage = asset.purchasePrice > 0 ? 
                    (depreciation / asset.purchasePrice * 100) : 0;
                  
                  return (
                    <tr key={asset.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                        <div className="text-sm text-gray-500">{asset.code}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(asset.purchasePrice || 0).toLocaleString()} ر.س
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(asset.currentValue || 0).toLocaleString()} ر.س
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {depreciation.toLocaleString()} ر.س
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${
                          depreciationPercentage < 25 ? 'text-green-600' :
                          depreciationPercentage < 50 ? 'text-yellow-600' :
                          depreciationPercentage < 75 ? 'text-orange-600' : 'text-red-600'
                        }`}>
                          {Math.round(depreciationPercentage)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // تقرير الصيانة
  const renderMaintenanceReport = () => {
    const maintenanceStats = {
      total: maintenanceRecords.length,
      scheduled: maintenanceRecords.filter(r => r.status === 'scheduled').length,
      inProgress: maintenanceRecords.filter(r => r.status === 'in-progress').length,
      completed: maintenanceRecords.filter(r => r.status === 'completed').length,
      totalCost: maintenanceRecords.reduce((sum, r) => sum + (r.cost || 0), 0),
      urgent: maintenanceRecords.filter(r => r.priority === 'urgent').length
    };
    
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 bg-orange-50 border-b">
          <h3 className="text-lg font-bold text-gray-800">تقرير الصيانة</h3>
          <p className="text-gray-600">إحصائيات وأداء عمليات الصيانة</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FaTools className="text-blue-600 text-2xl" />
                <div className="mr-3">
                  <p className="text-sm text-blue-600">إجمالي الصيانات</p>
                  <p className="text-xl font-bold text-blue-800">{maintenanceStats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FaCheckCircle className="text-green-600 text-2xl" />
                <div className="mr-3">
                  <p className="text-sm text-green-600">مكتملة</p>
                  <p className="text-xl font-bold text-green-800">{maintenanceStats.completed}</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FaMoneyBillWave className="text-purple-600 text-2xl" />
                <div className="mr-3">
                  <p className="text-sm text-purple-600">إجمالي التكلفة</p>
                  <p className="text-xl font-bold text-purple-800">
                    {maintenanceStats.totalCost.toLocaleString()} ر.س
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* حالة الصيانات */}
            <div>
              <h4 className="font-bold text-gray-700 mb-3">حالة الصيانات</h4>
              <div className="space-y-2">
                {[
                  { status: 'scheduled', label: 'مجدولة', color: 'blue' },
                  { status: 'in-progress', label: 'قيد التنفيذ', color: 'orange' },
                  { status: 'completed', label: 'مكتملة', color: 'green' }
                ].map(({ status, label, color }) => (
                  <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">{label}</span>
                    <span className={`px-2 py-1 text-sm font-bold bg-${color}-100 text-${color}-800 rounded`}>
                      {maintenanceStats[status]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* أولويات الصيانة */}
            <div>
              <h4 className="font-bold text-gray-700 mb-3">توزيع الأولويات</h4>
              <div className="space-y-2">
                {['urgent', 'high', 'medium', 'low'].map(priority => {
                  const count = maintenanceRecords.filter(r => r.priority === priority).length;
                  const label = priority === 'urgent' ? 'عاجل' :
                               priority === 'high' ? 'عالي' :
                               priority === 'medium' ? 'متوسط' : 'منخفض';
                  const color = priority === 'urgent' ? 'red' :
                               priority === 'high' ? 'orange' :
                               priority === 'medium' ? 'blue' : 'green';
                  
                  return (
                    <div key={priority} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-gray-700">{label}</span>
                      <span className={`px-2 py-1 text-sm font-bold bg-${color}-100 text-${color}-800 rounded`}>
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // تقرير الاستبعاد
  const renderDisposalReport = () => {
    const disposalStats = {
      total: disposalRecords.length,
      pending: disposalRecords.filter(r => r.approvalStatus === 'pending').length,
      approved: disposalRecords.filter(r => r.approvalStatus === 'approved').length,
      totalSaleValue: disposalRecords.reduce((sum, r) => sum + (r.salePrice || 0), 0),
      totalGainLoss: disposalRecords.reduce((sum, r) => sum + (r.gainLoss || 0), 0),
      byMethod: disposalRecords.reduce((acc, record) => {
        const method = record.disposalMethod || 'other';
        if (!acc[method]) acc[method] = 0;
        acc[method]++;
        return acc;
      }, {})
    };
    
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 bg-red-50 border-b">
          <h3 className="text-lg font-bold text-gray-800">تقرير الاستبعاد</h3>
          <p className="text-gray-600">إحصائيات ونتائج استبعاد الأصول</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FaFileAlt className="text-blue-600 text-2xl" />
                <div className="mr-3">
                  <p className="text-sm text-blue-600">إجمالي الاستبعادات</p>
                  <p className="text-xl font-bold text-blue-800">{disposalStats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FaMoneyBillWave className="text-green-600 text-2xl" />
                <div className="mr-3">
                  <p className="text-sm text-green-600">إجمالي قيمة البيع</p>
                  <p className="text-xl font-bold text-green-800">
                    {disposalStats.totalSaleValue.toLocaleString()} ر.س
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FaCalculator className="text-purple-600 text-2xl" />
                <div className="mr-3">
                  <p className="text-sm text-purple-600">صافي الربح/الخسارة</p>
                  <p className={`text-xl font-bold ${disposalStats.totalGainLoss >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                    {disposalStats.totalGainLoss >= 0 ? '+' : ''}{disposalStats.totalGainLoss.toLocaleString()} ر.س
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* حالة الموافقات */}
            <div>
              <h4 className="font-bold text-gray-700 mb-3">حالة الموافقات</h4>
              <div className="space-y-2">
                {[
                  { status: 'pending', label: 'في الانتظار', color: 'yellow' },
                  { status: 'approved', label: 'موافق عليه', color: 'green' }
                ].map(({ status, label, color }) => (
                  <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">{label}</span>
                    <span className={`px-2 py-1 text-sm font-bold bg-${color}-100 text-${color}-800 rounded`}>
                      {disposalStats[status]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* طرق الاستبعاد */}
            <div>
              <h4 className="font-bold text-gray-700 mb-3">طرق الاستبعاد</h4>
              <div className="space-y-2">
                {Object.entries(disposalStats.byMethod).map(([method, count]) => {
                  const label = method === 'sale' ? 'بيع' :
                               method === 'donation' ? 'تبرع' :
                               method === 'destruction' ? 'تدمير' :
                               method === 'scrap' ? 'خردة' : method;
                  const color = method === 'sale' ? 'green' :
                               method === 'donation' ? 'blue' :
                               method === 'destruction' ? 'red' : 'gray';
                  
                  return (
                    <div key={method} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-gray-700">{label}</span>
                      <span className={`px-2 py-1 text-sm font-bold bg-${color}-100 text-${color}-800 rounded`}>
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // عرض نظرة عامة
  const renderOverview = () => {
    const stats = calculateStats();
    
    return (
      <div className="space-y-6">
        {/* البطاقات الإحصائية */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <FaBuilding className="text-blue-600 text-3xl" />
              <div className="mr-4">
                <p className="text-sm text-gray-600">إجمالي الأصول</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalAssets}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <FaMoneyBillWave className="text-green-600 text-3xl" />
              <div className="mr-4">
                <p className="text-sm text-gray-600">إجمالي القيمة الحالية</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.totalCurrentValue.toLocaleString()} ر.س
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <FaCalculator className="text-purple-600 text-3xl" />
              <div className="mr-4">
                <p className="text-sm text-gray-600">إجمالي الإهلاك</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.totalDepreciation.toLocaleString()} ر.س
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <FaChartLine className="text-orange-600 text-3xl" />
              <div className="mr-4">
                <p className="text-sm text-gray-600">نسبة الإهلاك</p>
                <p className="text-2xl font-bold text-gray-800">
                  {Math.round(stats.depreciationPercentage)}%
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* رسم بياني للحالة - تمثيل نصي */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">توزيع الأصول حسب الحالة</h3>
          <div className="space-y-3">
            {Object.entries(stats.statusStats).map(([status, stat]) => {
              const percentage = stats.totalAssets > 0 ? (stat.count / stats.totalAssets * 100) : 0;
              return (
                <div key={status} className="flex items-center">
                  <div className="w-24 text-sm text-gray-600">{status}</div>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-blue-600 h-4 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-16 text-sm text-gray-800 text-right">
                    {stat.count} ({Math.round(percentage)}%)
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // تصدير التقرير
  const handleExport = (format) => {
    switch (format) {
      case 'pdf':
        alert('سيتم إضافة خاصية تصدير PDF قريباً');
        break;
      case 'excel':
        alert('سيتم إضافة خاصية تصدير Excel قريباً');
        break;
      case 'print':
        window.print();
        break;
      default:
        break;
    }
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* رأس الصفحة */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FaChartBar className="text-3xl text-blue-600 ml-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">تقارير الأصول الثابتة</h1>
                <p className="text-gray-600">تقارير شاملة وتحليلات متقدمة للأصول</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleExport('print')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <FaPrint className="ml-2" />
                طباعة
              </button>
              <button
                onClick={() => handleExport('excel')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <FaFileExcel className="ml-2" />
                Excel
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <FaFilePdf className="ml-2" />
                PDF
              </button>
            </div>
          </div>

          {/* أدوات التحكم في التقارير */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-6">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="overview">نظرة عامة</option>
              <option value="category">تقرير حسب الفئة</option>
              <option value="depreciation">تقرير الإهلاك</option>
              <option value="maintenance">تقرير الصيانة</option>
              <option value="disposal">تقرير الاستبعاد</option>
            </select>
            
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">جميع الفترات</option>
              <option value="current-year">السنة الحالية</option>
              <option value="last-year">العام الماضي</option>
              <option value="last-3-years">آخر 3 سنوات</option>
            </select>
            
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">جميع المجموعات</option>
              {assetGroups.map(group => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </select>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
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
              value={reportFormat}
              onChange={(e) => setReportFormat(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="screen">عرض على الشاشة</option>
              <option value="pdf">تصدير PDF</option>
              <option value="excel">تصدير Excel</option>
            </select>
            
            <button className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center">
              <FaFilter className="ml-2" />
              تطبيق الفلاتر
            </button>
          </div>
        </div>

        {/* ملخص سريع */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">ملخص سريع</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.totalAssets}</p>
              <p className="text-gray-600">إجمالي الأصول</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {stats.totalCurrentValue.toLocaleString()} ر.س
              </p>
              <p className="text-gray-600">القيمة الحالية</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {Math.round(stats.depreciationPercentage)}%
              </p>
              <p className="text-gray-600">نسبة الإهلاك</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{assetGroups.length}</p>
              <p className="text-gray-600">عدد المجموعات</p>
            </div>
          </div>
        </div>

        {/* محتوى التقرير */}
        {reportType === 'overview' && renderOverview()}
        {reportType === 'category' && renderCategoryReport()}
        {reportType === 'depreciation' && renderDepreciationReport()}
        {reportType === 'maintenance' && renderMaintenanceReport()}
        {reportType === 'disposal' && renderDisposalReport()}

        {/* تحذيرات وتوصيات */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <FaExclamationTriangle className="text-yellow-500 ml-2" />
            تحذيرات وتوصيات
          </h2>
          <div className="space-y-3">
            {stats.depreciationPercentage > 80 && (
              <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded">
                <FaExclamationTriangle className="text-yellow-500 ml-2" />
                <span className="text-yellow-800">
                  نسبة الإهلاك عالية ({Math.round(stats.depreciationPercentage)}%) - يُنصح بمراجعة الأصول القديمة
                </span>
              </div>
            )}
            {maintenanceRecords.filter(r => r.priority === 'urgent' && r.status !== 'completed').length > 0 && (
              <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded">
                <FaExclamationTriangle className="text-red-500 ml-2" />
                <span className="text-red-800">
                  يوجد {maintenanceRecords.filter(r => r.priority === 'urgent' && r.status !== 'completed').length} صيانة عاجلة
                </span>
              </div>
            )}
            {disposalRecords.filter(r => r.approvalStatus === 'pending').length > 0 && (
              <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded">
                <FaExclamationTriangle className="text-blue-500 ml-2" />
                <span className="text-blue-800">
                  يوجد {disposalRecords.filter(r => r.approvalStatus === 'pending').length} طلب استبعاد في الانتظار
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetReports;
