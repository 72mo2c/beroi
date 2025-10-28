// ======================================
// Interactive Reports Page - التقارير التفاعلية
// ======================================

import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { 
  FaFileAlt,
  FaTable,
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaDownload,
  FaFilter,
  FaSearch,
  FaCalendarAlt,
  FaCog,
  FaPrint,
  FaShare,
  FaEye,
  FaExpand,
  FaCompress,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaColumns,
  FaList,
  FaTh,
  FaRefreshCw,
  FaEnvelope,
  FaFilePdf,
  FaFileExcel,
  FaFileCsv,
  FaClock,
  FaUser,
  FaBuilding,
  FaDollarSign,
  FaTrendingUp,
  FaTrendingDown
} from 'react-icons/fa';

const InteractiveReports = () => {
  const { products, customers, suppliers, salesInvoices, purchaseInvoices, warehouses } = useData();
  const [selectedReport, setSelectedReport] = useState('sales-summary');
  const [viewMode, setViewMode] = useState('table'); // table, chart, dashboard
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    customer: '',
    supplier: '',
    product: '',
    status: '',
    category: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // أنواع التقارير المتاحة
  const reportTypes = [
    {
      id: 'sales-summary',
      name: 'ملخص المبيعات',
      icon: <FaDollarSign />,
      category: 'مالية',
      description: 'تقرير شامل عن المبيعات والأرباح'
    },
    {
      id: 'customer-analysis',
      name: 'تحليل العملاء',
      icon: <FaUser />,
      category: 'عملاء',
      description: 'تحليل سلوك وأنماط العملاء'
    },
    {
      id: 'inventory-status',
      name: 'حالة المخزون',
      icon: <FaChartBar />,
      category: 'مخزون',
      description: 'تقرير مفصل عن حالة المخزون'
    },
    {
      id: 'financial-overview',
      name: 'النظرة المالية',
      icon: <FaTrendingUp />,
      category: 'مالية',
      description: 'نظرة شاملة على الوضع المالي'
    },
    {
      id: 'supplier-performance',
      name: 'أداء الموردين',
      icon: <FaBuilding />,
      category: 'موردين',
      description: 'تقييم أداء الموردين'
    },
    {
      id: 'warehouse-operations',
      name: 'عمليات المخازن',
      icon: <FaTable />,
      category: 'عمليات',
      description: 'تقارير عمليات المخازن'
    }
  ];

  // إنشاء بيانات التقرير
  const generateReportData = (reportType) => {
    switch (reportType) {
      case 'sales-summary':
        return {
          title: 'ملخص المبيعات',
          data: salesInvoices.map(invoice => ({
            id: invoice.id,
            date: invoice.date,
            customer: customers.find(c => c.id === invoice.customerId)?.name || 'عميل غير محدد',
            amount: invoice.total || 0,
            status: invoice.status || 'مكتمل',
            items: invoice.items?.length || 0,
            profit: (invoice.total || 0) * 0.3 // هامش ربح افتراضي
          })),
          columns: [
            { key: 'id', label: 'رقم الفاتورة', sortable: true },
            { key: 'date', label: 'التاريخ', sortable: true },
            { key: 'customer', label: 'العميل', sortable: true },
            { key: 'amount', label: 'المبلغ', sortable: true, format: 'currency' },
            { key: 'profit', label: 'الربح', sortable: true, format: 'currency' },
            { key: 'status', label: 'الحالة', sortable: true },
            { key: 'items', label: 'عدد المنتجات', sortable: true }
          ],
          summary: {
            totalSales: salesInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0),
            totalProfit: salesInvoices.reduce((sum, inv) => sum + ((inv.total || 0) * 0.3), 0),
            totalOrders: salesInvoices.length,
            averageOrderValue: salesInvoices.length > 0 
              ? salesInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0) / salesInvoices.length 
              : 0
          }
        };

      case 'customer-analysis':
        return {
          title: 'تحليل العملاء',
          data: customers.map(customer => {
            const customerSales = salesInvoices.filter(inv => inv.customerId === customer.id);
            const totalSpent = customerSales.reduce((sum, inv) => sum + (inv.total || 0), 0);
            const orderCount = customerSales.length;
            
            return {
              id: customer.id,
              name: customer.name,
              email: customer.email || '',
              phone: customer.phone || '',
              totalSpent,
              orderCount,
              averageOrderValue: orderCount > 0 ? totalSpent / orderCount : 0,
              lastOrderDate: customerSales.length > 0 
                ? customerSales.sort((a, b) => new Date(b.date) - new Date(a.date))[0].date 
                : '',
              segment: totalSpent > 10000 ? 'VIP' : totalSpent > 5000 ? 'منتظم' : 'مبتدئ'
            };
          }),
          columns: [
            { key: 'name', label: 'اسم العميل', sortable: true },
            { key: 'email', label: 'البريد الإلكتروني', sortable: true },
            { key: 'phone', label: 'رقم الهاتف', sortable: true },
            { key: 'totalSpent', label: 'إجمالي المصروف', sortable: true, format: 'currency' },
            { key: 'orderCount', label: 'عدد الطلبات', sortable: true },
            { key: 'averageOrderValue', label: 'متوسط قيمة الطلب', sortable: true, format: 'currency' },
            { key: 'lastOrderDate', label: 'آخر طلب', sortable: true },
            { key: 'segment', label: 'الفئة', sortable: true }
          ],
          summary: {
            totalCustomers: customers.length,
            totalRevenue: customers.reduce((sum, customer) => {
              const customerSales = salesInvoices.filter(inv => inv.customerId === customer.id);
              return sum + customerSales.reduce((s, inv) => s + (inv.total || 0), 0);
            }, 0),
            averageCustomerValue: 0,
            topCustomers: customers.slice(0, 5).map(c => c.name)
          }
        };

      case 'inventory-status':
        return {
          title: 'حالة المخزون',
          data: products.map(product => ({
            id: product.id,
            name: product.name,
            category: product.category || 'عام',
            quantity: product.mainQuantity || 0,
            minStock: 10,
            maxStock: 100,
            price: product.mainPrice || 0,
            value: (product.mainQuantity || 0) * (product.mainPrice || 0),
            status: (product.mainQuantity || 0) === 0 ? 'نفد' : 
                   (product.mainQuantity || 0) < 10 ? 'منخفض' : 'متوفر',
            lastUpdated: product.updatedAt || product.createdAt || ''
          })),
          columns: [
            { key: 'name', label: 'اسم المنتج', sortable: true },
            { key: 'category', label: 'الفئة', sortable: true },
            { key: 'quantity', label: 'الكمية', sortable: true },
            { key: 'price', label: 'السعر', sortable: true, format: 'currency' },
            { key: 'value', label: 'القيمة الإجمالية', sortable: true, format: 'currency' },
            { key: 'status', label: 'الحالة', sortable: true },
            { key: 'lastUpdated', label: 'آخر تحديث', sortable: true }
          ],
          summary: {
            totalProducts: products.length,
            totalValue: products.reduce((sum, p) => sum + ((p.mainPrice || 0) * (p.mainQuantity || 0)), 0),
            lowStockItems: products.filter(p => (p.mainQuantity || 0) < 10).length,
            outOfStockItems: products.filter(p => (p.mainQuantity || 0) === 0).length
          }
        };

      case 'financial-overview':
        return {
          title: 'النظرة المالية',
          data: [
            {
              category: 'المبيعات',
              revenue: salesInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0),
              growth: 15.3,
              target: 500000,
              achievement: 85.2
            },
            {
              category: 'المشتريات',
              revenue: purchaseInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0),
              growth: -5.2,
              target: 300000,
              achievement: 78.9
            },
            {
              category: 'الربح الصافي',
              revenue: (salesInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0) - 
                       purchaseInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0)),
              growth: 22.1,
              target: 200000,
              achievement: 92.3
            }
          ],
          columns: [
            { key: 'category', label: 'الفئة', sortable: true },
            { key: 'revenue', label: 'الإيرادات', sortable: true, format: 'currency' },
            { key: 'growth', label: 'نمو', sortable: true, format: 'percentage' },
            { key: 'target', label: 'الهدف', sortable: true, format: 'currency' },
            { key: 'achievement', label: 'نسبة الإنجاز', sortable: true, format: 'percentage' }
          ],
          summary: {
            totalRevenue: salesInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0),
            totalExpenses: purchaseInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0),
            netProfit: 0,
            profitMargin: 0
          }
        };

      case 'supplier-performance':
        return {
          title: 'أداء الموردين',
          data: suppliers.map(supplier => {
            const supplierPurchases = purchaseInvoices.filter(inv => inv.supplierId === supplier.id);
            const totalSpent = supplierPurchases.reduce((sum, inv) => sum + (inv.total || 0), 0);
            const orderCount = supplierPurchases.length;
            
            return {
              id: supplier.id,
              name: supplier.name,
              contact: supplier.contact || '',
              phone: supplier.phone || '',
              email: supplier.email || '',
              totalSpent,
              orderCount,
              averageOrderValue: orderCount > 0 ? totalSpent / orderCount : 0,
              lastOrderDate: supplierPurchases.length > 0 
                ? supplierPurchases.sort((a, b) => new Date(b.date) - new Date(a.date))[0].date 
                : '',
              performance: totalSpent > 50000 ? 'ممتاز' : totalSpent > 20000 ? 'جيد' : 'متوسط'
            };
          }),
          columns: [
            { key: 'name', label: 'اسم المورد', sortable: true },
            { key: 'contact', label: 'الشخص المسؤول', sortable: true },
            { key: 'phone', label: 'رقم الهاتف', sortable: true },
            { key: 'email', label: 'البريد الإلكتروني', sortable: true },
            { key: 'totalSpent', label: 'إجمالي المصروف', sortable: true, format: 'currency' },
            { key: 'orderCount', label: 'عدد الطلبات', sortable: true },
            { key: 'averageOrderValue', label: 'متوسط قيمة الطلب', sortable: true, format: 'currency' },
            { key: 'lastOrderDate', label: 'آخر طلب', sortable: true },
            { key: 'performance', label: 'الأداء', sortable: true }
          ],
          summary: {
            totalSuppliers: suppliers.length,
            totalSpend: suppliers.reduce((sum, supplier) => {
              const supplierPurchases = purchaseInvoices.filter(inv => inv.supplierId === supplier.id);
              return sum + supplierPurchases.reduce((s, inv) => s + (inv.total || 0), 0);
            }, 0),
            averageSpend: 0,
            topSuppliers: suppliers.slice(0, 5).map(s => s.name)
          }
        };

      case 'warehouse-operations':
        return {
          title: 'عمليات المخازن',
          data: warehouses.map(warehouse => ({
            id: warehouse.id,
            name: warehouse.name,
            location: warehouse.location || '',
            capacity: 1000, // افتراضي
            utilized: Math.floor(Math.random() * 800) + 200,
            products: products.filter(p => p.warehouseId === warehouse.id).length,
            efficiency: Math.floor(Math.random() * 30) + 70,
            lastActivity: new Date().toISOString().split('T')[0]
          })),
          columns: [
            { key: 'name', label: 'اسم المخزن', sortable: true },
            { key: 'location', label: 'الموقع', sortable: true },
            { key: 'capacity', label: 'السعة', sortable: true },
            { key: 'utilized', label: 'المستخدم', sortable: true },
            { key: 'products', label: 'عدد المنتجات', sortable: true },
            { key: 'efficiency', label: 'الكفاءة', sortable: true, format: 'percentage' },
            { key: 'lastActivity', label: 'آخر نشاط', sortable: true }
          ],
          summary: {
            totalWarehouses: warehouses.length,
            totalCapacity: warehouses.length * 1000,
            averageUtilization: 0,
            totalProducts: products.length
          }
        };

      default:
        return { title: '', data: [], columns: [], summary: {} };
    }
  };

  const currentReport = generateReportData(selectedReport);

  // تطبيق الفلاتر
  const filteredData = currentReport.data.filter(item => {
    if (filters.dateFrom && item.date && item.date < filters.dateFrom) return false;
    if (filters.dateTo && item.date && item.date > filters.dateTo) return false;
    if (filters.customer && item.customer && !item.customer.toLowerCase().includes(filters.customer.toLowerCase())) return false;
    if (filters.status && item.status && item.status !== filters.status) return false;
    return true;
  });

  // تطبيق الترتيب
  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue === bValue) return 0;
    
    if (sortConfig.direction === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // معالجة ترتيب الأعمدة
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  // تنسيق القيم
  const formatValue = (value, format) => {
    if (value === null || value === undefined) return '';
    
    switch (format) {
      case 'currency':
        return `${value.toLocaleString()} ج.م`;
      case 'percentage':
        return `${value}%`;
      case 'date':
        return new Date(value).toLocaleDateString('ar-EG');
      default:
        return value;
    }
  };

  // الحصول على أيقونة الترتيب
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="text-gray-400" />;
    return sortConfig.direction === 'asc' ? 
      <FaSortUp className="text-blue-600" /> : 
      <FaSortDown className="text-blue-600" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              التقارير التفاعلية
            </h1>
            <p className="text-gray-600 mt-2 text-lg">إنشاء وتخصيص التقارير الديناميكية والتفاعلية</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Auto Refresh */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                autoRefresh 
                  ? 'bg-teal-500 text-white hover:bg-teal-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaRefreshCw className={autoRefresh ? 'animate-spin' : ''} />
              تحديث تلقائي
            </button>

            {/* Export */}
            <div className="relative group">
              <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 flex items-center gap-2">
                <FaDownload />
                تصدير
              </button>
              <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <button className="block w-full text-right px-4 py-2 hover:bg-gray-50 text-sm">
                  <FaFilePdf className="inline ml-2" />
                  تصدير PDF
                </button>
                <button className="block w-full text-right px-4 py-2 hover:bg-gray-50 text-sm">
                  <FaFileExcel className="inline ml-2" />
                  تصدير Excel
                </button>
                <button className="block w-full text-right px-4 py-2 hover:bg-gray-50 text-sm">
                  <FaFileCsv className="inline ml-2" />
                  تصدير CSV
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Report Type Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {reportTypes.map(report => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`p-4 rounded-xl border-2 transition-all text-right ${
                selectedReport === report.id
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${
                  selectedReport === report.id ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {report.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{report.name}</h3>
                  <p className="text-xs text-gray-500">{report.category}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">{report.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">الفلاتر والإعدادات</h3>
          <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'table' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                <FaTable />
              </button>
              <button
                onClick={() => setViewMode('chart')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'chart' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                <FaChartBar />
              </button>
              <button
                onClick={() => setViewMode('dashboard')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'dashboard' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                <FaTh />
              </button>
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {isFullscreen ? <FaCompress /> : <FaExpand />}
            </button>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">من تاريخ</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">إلى تاريخ</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">العميل</label>
            <input
              type="text"
              value={filters.customer}
              onChange={(e) => setFilters(prev => ({ ...prev, customer: e.target.value }))}
              placeholder="اسم العميل"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            >
              <option value="">جميع الحالات</option>
              <option value="مكتمل">مكتمل</option>
              <option value="معلق">معلق</option>
              <option value="ملغي">ملغي</option>
            </select>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 ${
        isFullscreen ? 'fixed inset-4 z-50 overflow-auto' : ''
      }`}>
        {/* Report Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{currentReport.title}</h2>
              <p className="text-gray-600">
                {filteredData.length} من أصل {currentReport.data.length} سجل
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Report Actions */}
              <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
                <FaPrint />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
                <FaShare />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
                <FaCog />
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        {currentReport.summary && Object.keys(currentReport.summary).length > 0 && (
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(currentReport.summary).map(([key, value]) => (
                <div key={key} className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-sm text-gray-600 mb-1">
                    {key === 'totalSales' ? 'إجمالي المبيعات' :
                     key === 'totalProfit' ? 'إجمالي الربح' :
                     key === 'totalOrders' ? 'عدد الطلبات' :
                     key === 'averageOrderValue' ? 'متوسط قيمة الطلب' :
                     key === 'totalCustomers' ? 'إجمالي العملاء' :
                     key === 'totalRevenue' ? 'إجمالي الإيرادات' :
                     key === 'averageCustomerValue' ? 'متوسط قيمة العميل' :
                     key === 'topCustomers' ? 'أفضل العملاء' :
                     key === 'totalProducts' ? 'إجمالي المنتجات' :
                     key === 'totalValue' ? 'القيمة الإجمالية' :
                     key === 'lowStockItems' ? 'منتجات مخزون منخفض' :
                     key === 'outOfStockItems' ? 'منتجات نفد مخزونها' :
                     key === 'totalExpenses' ? 'إجمالي المصروفات' :
                     key === 'netProfit' ? 'صافي الربح' :
                     key === 'profitMargin' ? 'هامش الربح' :
                     key === 'totalSuppliers' ? 'إجمالي الموردين' :
                     key === 'totalSpend' ? 'إجمالي المصروف' :
                     key === 'averageSpend' ? 'متوسط المصروف' :
                     key === 'topSuppliers' ? 'أفضل الموردين' :
                     key === 'totalWarehouses' ? 'إجمالي المخازن' :
                     key === 'totalCapacity' ? 'إجمالي السعة' :
                     key === 'averageUtilization' ? 'متوسط الاستخدام' :
                     key.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <p className="text-2xl font-bold text-gray-800">
                    {Array.isArray(value) ? value.join(', ') : 
                     typeof value === 'number' && value > 1000 ? 
                     (typeof value === 'number' ? value.toLocaleString() : value) :
                     value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Report Content Based on View Mode */}
        {viewMode === 'table' && (
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    {currentReport.columns.map(column => (
                      <th 
                        key={column.key}
                        onClick={() => column.sortable !== false && handleSort(column.key)}
                        className={`text-right py-3 px-4 font-semibold text-gray-800 ${
                          column.sortable !== false ? 'cursor-pointer hover:bg-gray-50' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {column.label}
                          {column.sortable !== false && getSortIcon(column.key)}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((row, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      {currentReport.columns.map(column => (
                        <td key={column.key} className="py-3 px-4 text-gray-700">
                          {formatValue(row[column.key], column.format)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {viewMode === 'chart' && (
          <div className="p-6">
            <div className="h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
              <div className="text-center text-gray-500">
                <FaChartBar className="text-6xl mx-auto mb-4 opacity-50" />
                <p className="text-xl font-semibold">رسم بياني تفاعلي</p>
                <p className="text-sm">عرض البيانات بصرياً</p>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'dashboard' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* KPI Cards */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                <FaDollarSign className="text-3xl text-blue-600 mb-3" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">إجمالي المبيعات</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {currentReport.summary?.totalSales?.toLocaleString() || '0'} ج.م
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                <FaUser className="text-3xl text-green-600 mb-3" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">عدد العملاء</h3>
                <p className="text-2xl font-bold text-green-600">
                  {currentReport.summary?.totalCustomers || '0'}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                <FaTrendingUp className="text-3xl text-purple-600 mb-3" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">النمو</h3>
                <p className="text-2xl font-bold text-purple-600">+12.5%</p>
              </div>

              {/* Mini Charts */}
              <div className="col-span-1 md:col-span-2 lg:col-span-3">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <FaChartLine className="text-4xl mx-auto mb-2 opacity-50" />
                      <p>اتجاه المبيعات</p>
                    </div>
                  </div>
                  
                  <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <FaChartPie className="text-4xl mx-auto mb-2 opacity-50" />
                      <p>توزيع العملاء</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveReports;