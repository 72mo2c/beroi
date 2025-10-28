// ======================================
// التقارير والرسوم البيانية - Reports & Analytics
// ======================================

import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';
import Card from '../../components/Common/Card';
import Modal from '../../components/Common/Modal';
import Input from '../../components/Common/Input';
import { Select } from '../../components/Common/Input';
import Button from '../../components/Common/Button';
import { 
  FaChartLine, 
  FaExclamationTriangle, 
  FaSearch, 
  FaDownload,
  FaUpload,
  FaCalendarAlt,
  FaDollarSign,
  FaTrendingUp,
  FaTrendingDown,
  FaChartBar,
  FaPieChart,
  FaPrint,
  FaFileAlt,
  FaFilter,
  FaEye,
  FaCog,
  FaBarChart,
  FaAreaChart,
  FaLineChart,
  FaPieChart as FaPieChartIcon
} from 'react-icons/fa';

const Reports = () => {
  const { reports, departments, addReport, updateReport, deleteReport } = useData();
  const { showSuccess, showError } = useNotification();

  const [reportModal, setReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // بيانات وهمية للتقارير
  const mockReports = [
    {
      id: '1',
      name: 'تقرير الميزانيات vs الإنفاق الفعلي',
      type: 'budget_analysis',
      category: 'financial',
      description: 'مقارنة شاملة بين الميزانيات المخططة والإنفاق الفعلي',
      period: 'monthly',
      dateRange: '2024-12-01 to 2024-12-31',
      departments: ['sales', 'production', 'finance'],
      data: {
        totalBudget: 2500000,
        totalSpent: 2180000,
        variance: -320000,
        variancePercentage: -12.8,
        departmentBreakdown: [
          { name: 'المبيعات', budget: 800000, spent: 720000, variance: -80000 },
          { name: 'الإنتاج', budget: 1200000, spent: 1100000, variance: -100000 },
          { name: 'المالية', budget: 500000, spent: 360000, variance: -140000 }
        ]
      },
      charts: ['bar', 'line', 'pie'],
      status: 'generated',
      lastGenerated: '2025-01-01',
      generatedBy: 'نظام التخطيط',
      format: 'pdf'
    },
    {
      id: '2',
      name: 'تقرير التنبؤات المالية',
      type: 'forecast_analysis',
      category: 'financial',
      description: 'تحليل دقة التنبؤات المالية ومقارنتها بالنتائج الفعلية',
      period: 'quarterly',
      dateRange: '2024-Q4',
      departments: ['sales', 'finance'],
      data: {
        accuracyRate: 87.5,
        totalForecasts: 12,
        accurateForecasts: 10,
        averageVariance: 8.2,
        forecastBreakdown: [
          { type: 'إيرادات', forecast: 2400000, actual: 2350000, variance: -50000 },
          { type: 'مصروفات', forecast: 1800000, actual: 1750000, variance: -50000 },
          { type: 'صافي الربح', forecast: 600000, actual: 600000, variance: 0 }
        ]
      },
      charts: ['line', 'area', 'bar'],
      status: 'generated',
      lastGenerated: '2024-12-31',
      generatedBy: 'محلل مالي',
      format: 'excel'
    },
    {
      id: '3',
      name: 'تقرير كفاءة خطط الإنتاج',
      type: 'production_efficiency',
      category: 'operational',
      description: 'تحليل أداء خطط الإنتاج ومؤشرات الكفاءة',
      period: 'monthly',
      dateRange: '2024-12-01 to 2024-12-31',
      departments: ['production'],
      data: {
        totalPlans: 8,
        completedPlans: 6,
        onTimeCompletion: 83.3,
        averageEfficiency: 94.2,
        planBreakdown: [
          { name: 'خطة 1', efficiency: 102, onTime: true },
          { name: 'خطة 2', efficiency: 98, onTime: true },
          { name: 'خطة 3', efficiency: 89, onTime: false },
          { name: 'خطة 4', efficiency: 95, onTime: true }
        ]
      },
      charts: ['bar', 'line', 'gauge'],
      status: 'generated',
      lastGenerated: '2025-01-02',
      generatedBy: 'مدير الإنتاج',
      format: 'pdf'
    },
    {
      id: '4',
      name: 'تقرير تحليلي للمشتريات',
      type: 'procurement_analysis',
      category: 'procurement',
      description: 'تحليل شامل لأداء خطط المشتريات والتوفير المحقق',
      period: 'monthly',
      dateRange: '2024-12-01 to 2024-12-31',
      departments: ['procurement'],
      data: {
        totalPlans: 15,
        completedPlans: 12,
        totalSavings: 45000,
        savingsPercentage: 2.3,
        supplierPerformance: [
          { name: 'مورد أ', performance: 95, rating: 'ممتاز' },
          { name: 'مورد ب', performance: 88, rating: 'جيد جداً' },
          { name: 'مورد ج', performance: 76, rating: 'جيد' },
          { name: 'مورد د', performance: 92, rating: 'ممتاز' }
        ]
      },
      charts: ['pie', 'bar', 'line'],
      status: 'generated',
      lastGenerated: '2025-01-03',
      generatedBy: 'مدير المشتريات',
      format: 'excel'
    }
  ];

  const reportTypes = [
    { value: 'budget_analysis', label: 'تحليل الميزانية' },
    { value: 'forecast_analysis', label: 'تحليل التنبؤات' },
    { value: 'production_efficiency', label: 'كفاءة الإنتاج' },
    { value: 'procurement_analysis', label: 'تحليل المشتريات' },
    { value: 'cost_analysis', label: 'تحليل التكاليف' },
    { value: 'performance_dashboard', label: 'لوحة الأداء' },
    { value: 'variance_report', label: 'تقرير الانحرافات' },
    { value: 'trend_analysis', label: 'تحليل الاتجاهات' }
  ];

  const reportCategories = [
    { value: 'financial', label: 'مالية' },
    { value: 'operational', label: 'تشغيلية' },
    { value: 'procurement', label: 'مشتريات' },
    { value: 'production', label: 'إنتاج' },
    { value: 'hr', label: 'موارد بشرية' }
  ];

  const periods = [
    { value: 'daily', label: 'يومي' },
    { value: 'weekly', label: 'أسبوعي' },
    { value: 'monthly', label: 'شهري' },
    { value: 'quarterly', label: 'ربع سنوي' },
    { value: 'semi_annual', label: 'نصف سنوي' },
    { value: 'annual', label: 'سنوي' },
    { value: 'custom', label: 'فترة مخصصة' }
  ];

  const departmentsList = [
    { id: 'sales', name: 'المبيعات' },
    { id: 'production', name: 'الإنتاج' },
    { id: 'finance', name: 'المالية' },
    { id: 'procurement', name: 'المشتريات' },
    { id: 'hr', name: 'الموارد البشرية' },
    { id: 'marketing', name: 'التسويق' }
  ];

  const chartTypes = [
    { value: 'bar', label: 'رسم بياني عمودي', icon: FaBarChart },
    { value: 'line', label: 'رسم بياني خطي', icon: FaLineChart },
    { value: 'area', label: 'رسم بياني مساحي', icon: FaAreaChart },
    { value: 'pie', label: 'رسم بياني دائري', icon: FaPieChartIcon },
    { value: 'doughnut', label: 'رسم بياني دائري مجوف', icon: FaPieChart },
    { value: 'gauge', label: 'مقياس', icon: FaCog }
  ];

  // تصفية التقارير
  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || report.type === filterType;
    const matchesPeriod = !filterPeriod || report.period === filterPeriod;
    
    return matchesSearch && matchesType && matchesPeriod;
  });

  // حساب الإحصائيات
  const reportStats = {
    total: mockReports.length,
    financial: mockReports.filter(r => r.category === 'financial').length,
    operational: mockReports.filter(r => r.category === 'operational').length,
    procurement: mockReports.filter(r => r.category === 'procurement').length,
    generated: mockReports.filter(r => r.status === 'generated').length
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('ar-SA').format(value);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      financial: FaDollarSign,
      operational: FaCog,
      procurement: FaDownload,
      production: FaBarChart,
      hr: FaUsers
    };
    return icons[category] || FaFileAlt;
  };

  const getCategoryColor = (category) => {
    const colors = {
      financial: 'text-green-600',
      operational: 'text-blue-600',
      procurement: 'text-purple-600',
      production: 'text-orange-600',
      hr: 'text-indigo-600'
    };
    return colors[category] || 'text-gray-600';
  };

  const handleGenerateReport = () => {
    setReportModal(true);
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setActiveTab('overview');
  };

  const handleExportReport = (report, format) => {
    showSuccess(`تم تصدير تقرير "${report.name}" بصيغة ${format.toUpperCase()}`);
  };

  const handlePrintReport = (report) => {
    showSuccess(`تم إرسال تقرير "${report.name}" للطباعة`);
  };

  const renderChartPlaceholder = (chartType, data = null) => {
    const chartHeights = {
      bar: 'h-48',
      line: 'h-48',
      area: 'h-48',
      pie: 'h-40',
      doughnut: 'h-40',
      gauge: 'h-40'
    };

    const colors = {
      bar: 'bg-gradient-to-r from-blue-500 to-blue-600',
      line: 'bg-gradient-to-r from-green-500 to-green-600',
      area: 'bg-gradient-to-r from-purple-500 to-purple-600',
      pie: 'bg-gradient-to-r from-orange-500 to-orange-600',
      doughnut: 'bg-gradient-to-r from-pink-500 to-pink-600',
      gauge: 'bg-gradient-to-r from-indigo-500 to-indigo-600'
    };

    const height = chartHeights[chartType] || 'h-48';
    const gradient = colors[chartType] || colors.bar;

    return (
      <div className={`${height} ${gradient} rounded-lg flex items-center justify-center text-white relative overflow-hidden`}>
        <div className="text-center z-10">
          {React.createElement(getCategoryIcon(chartType), {
            className: "text-4xl mx-auto mb-2 opacity-80"
          })}
          <div className="text-sm font-medium opacity-90">
            {chartTypes.find(ct => ct.value === chartType)?.label || chartType}
          </div>
          <div className="text-xs opacity-70 mt-1">
            معاينة الرسم البياني
          </div>
        </div>
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.1'%3E%3Cpath d='m0 40l40-40h-40z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '20px 20px'
          }} />
        </div>
      </div>
    );
  };

  const renderReportOverview = (report) => {
    return (
      <div className="space-y-6">
        {/* معلومات أساسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">معلومات التقرير</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">الاسم:</span>
                <span className="font-medium">{report.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">النوع:</span>
                <span className="font-medium">
                  {reportTypes.find(rt => rt.value === report.type)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الفئة:</span>
                <span className="font-medium">
                  {reportCategories.find(rc => rc.value === report.category)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الفترة:</span>
                <span className="font-medium">
                  {periods.find(p => p.value === report.period)?.label}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">معلومات التوليد</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">تاريخ التوليد:</span>
                <span className="font-medium">{report.lastGenerated}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">تم التوليد بواسطة:</span>
                <span className="font-medium">{report.generatedBy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الصيغة:</span>
                <span className="font-medium">{report.format.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الرسوم البيانية:</span>
                <span className="font-medium">{report.charts.length} رسم</span>
              </div>
            </div>
          </div>
        </div>

        {/* الرسوم البيانية */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">الرسوم البيانية المتوفرة</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {report.charts.map((chartType, index) => (
              <div key={index}>
                {renderChartPlaceholder(chartType)}
              </div>
            ))}
          </div>
        </div>

        {/* الوصف */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">الوصف</h4>
          <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
            {report.description}
          </p>
        </div>
      </div>
    );
  };

  const renderReportData = (report) => {
    if (!report.data) return null;

    return (
      <div className="space-y-6">
        {/* البيانات المالية */}
        {report.data.totalBudget && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">البيانات المالية</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <FaDollarSign className="text-blue-500 text-2xl mx-auto mb-2" />
                <div className="text-lg font-semibold text-blue-600">إجمالي الميزانية</div>
                <div className="text-xl font-bold text-gray-900">
                  {formatCurrency(report.data.totalBudget)}
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <FaDollarSign className="text-green-500 text-2xl mx-auto mb-2" />
                <div className="text-lg font-semibold text-green-600">إجمالي المنفق</div>
                <div className="text-xl font-bold text-gray-900">
                  {formatCurrency(report.data.totalSpent)}
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <FaDollarSign className="text-purple-500 text-2xl mx-auto mb-2" />
                <div className="text-lg font-semibold text-purple-600">الانحراف</div>
                <div className="text-xl font-bold text-gray-900">
                  {formatCurrency(report.data.variance)}
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <FaPercentage className="text-orange-500 text-2xl mx-auto mb-2" />
                <div className="text-lg font-semibold text-orange-600">نسبة الانحراف</div>
                <div className="text-xl font-bold text-gray-900">
                  {formatPercentage(report.data.variancePercentage)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* انحرافات الأقسام */}
        {report.data.departmentBreakdown && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">انحرافات الأقسام</h4>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-sm border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">القسم</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">الميزانية</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">المنفق</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">الانحراف</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">النسبة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {report.data.departmentBreakdown.map((dept, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{dept.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{formatCurrency(dept.budget)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{formatCurrency(dept.spent)}</td>
                      <td className={`px-4 py-3 text-sm font-medium ${dept.variance < 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(dept.variance)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          dept.variance < 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {formatPercentage((dept.variance / dept.budget) * 100)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* مؤشرات الأداء */}
        {report.data.accuracyRate && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">مؤشرات الأداء</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-lg font-semibold text-blue-600">معدل الدقة</div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatPercentage(report.data.accuracyRate)}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {report.data.accurateForecasts} من {report.data.totalForecasts} تنبؤ
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-lg font-semibold text-green-600">متوسط الانحراف</div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatPercentage(report.data.averageVariance)}
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-lg font-semibold text-purple-600">الخطط المكتملة</div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatPercentage(report.data.onTimeCompletion)}
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <div className="text-lg font-semibold text-orange-600">متوسط الكفاءة</div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatPercentage(report.data.averageEfficiency)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* العنوان والإحصائيات */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">التقارير والرسوم البيانية</h1>
            <p className="text-gray-600">تحليل شامل للبيانات والنتائج مع رسوم بيانية تفاعلية</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              icon={FaDownload}
              className="text-sm"
            >
              تصدير الكل
            </Button>
            <Button 
              variant="outline" 
              icon={FaPrint}
              className="text-sm"
            >
              طباعة الكل
            </Button>
            <Button 
              onClick={handleGenerateReport}
              icon={FaFileAlt}
              variant="primary"
            >
              إنشاء تقرير
            </Button>
          </div>
        </div>

        {/* بطاقات الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">إجمالي التقارير</p>
                <p className="text-2xl font-bold">{reportStats.total}</p>
              </div>
              <FaFileAlt className="text-blue-200 text-3xl" />
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">تقارير مالية</p>
                <p className="text-2xl font-bold">{reportStats.financial}</p>
              </div>
              <FaDollarSign className="text-green-200 text-3xl" />
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">تقارير تشغيلية</p>
                <p className="text-2xl font-bold">{reportStats.operational}</p>
              </div>
              <FaCog className="text-purple-200 text-3xl" />
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">تم توليدها</p>
                <p className="text-2xl font-bold">{reportStats.generated}</p>
              </div>
              <FaChartLine className="text-orange-200 text-3xl" />
            </div>
          </Card>
        </div>
      </div>

      {/* أدوات التصفية والبحث */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="البحث في التقارير..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={FaSearch}
          />
          
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">جميع الأنواع</option>
            {reportTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </Select>

          <Select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
          >
            <option value="">جميع الفترات</option>
            {periods.map(period => (
              <option key={period.value} value={period.value}>{period.label}</option>
            ))}
          </Select>

          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('');
              setFilterType('');
              setFilterPeriod('');
            }}
          >
            إعادة تعيين
          </Button>
        </div>
      </Card>

      {/* قائمة التقارير */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <Card key={report.id} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {React.createElement(getCategoryIcon(report.category), {
                  className: `text-2xl ${getCategoryColor(report.category)}`
                })}
                <div>
                  <h3 className="font-semibold text-gray-900">{report.name}</h3>
                  <p className="text-xs text-gray-500">
                    {reportTypes.find(rt => rt.value === report.type)?.label}
                  </p>
                </div>
              </div>
              <span className="text-xs text-gray-500">{report.period}</span>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {report.description}
            </p>

            {/* معاينة الرسوم البيانية */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {report.charts.slice(0, 3).map((chartType, index) => (
                <div key={index} className="h-12 rounded overflow-hidden">
                  {renderChartPlaceholder(chartType)}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <span>آخر تحديث: {report.lastGenerated}</span>
              <span>{report.generatedBy}</span>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewReport(report)}
                icon={FaEye}
                className="flex-1"
              >
                عرض
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportReport(report, report.format)}
                icon={FaDownload}
                className="flex-1"
              >
                تصدير
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* مودال عرض التقرير */}
      <Modal
        isOpen={!!selectedReport}
        onClose={() => {
          setSelectedReport(null);
          setActiveTab('overview');
        }}
        title={selectedReport?.name}
        size="xl"
      >
        {selectedReport && (
          <div className="space-y-6">
            {/* تبويبات */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                نظرة عامة
              </button>
              <button
                onClick={() => setActiveTab('data')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'data'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                البيانات
              </button>
              <button
                onClick={() => setActiveTab('charts')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'charts'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                الرسوم البيانية
              </button>
            </div>

            {/* محتوى التبويبات */}
            <div className="min-h-96">
              {activeTab === 'overview' && renderReportOverview(selectedReport)}
              {activeTab === 'data' && renderReportData(selectedReport)}
              {activeTab === 'charts' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedReport.charts.map((chartType, index) => (
                    <div key={index}>
                      {renderChartPlaceholder(chartType)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => handlePrintReport(selectedReport)}
                icon={FaPrint}
              >
                طباعة
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExportReport(selectedReport, 'pdf')}
                icon={FaDownload}
              >
                تصدير PDF
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExportReport(selectedReport, 'excel')}
                icon={FaDownload}
              >
                تصدير Excel
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* مودال إنشاء تقرير جديد */}
      <Modal
        isOpen={reportModal}
        onClose={() => setReportModal(false)}
        title="إنشاء تقرير جديد"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="نوع التقرير"
              placeholder="اختر نوع التقرير"
            >
              {reportTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </Select>

            <Select
              label="الفئة"
              placeholder="اختر الفئة"
            >
              {reportCategories.map(category => (
                <option key={category.value} value={category.value}>{category.label}</option>
              ))}
            </Select>

            <Select
              label="الفترة"
              placeholder="اختر الفترة"
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>{period.label}</option>
              ))}
            </Select>

            <Select
              label="القسم"
              placeholder="اختر القسم"
            >
              {departmentsList.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </Select>

            <Input
              label="تاريخ البداية"
              type="date"
            />

            <Input
              label="تاريخ النهاية"
              type="date"
            />

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الرسوم البيانية المطلوبة
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {chartTypes.map(chart => (
                  <label key={chart.value} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm">{chart.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setReportModal(false)}
            >
              إلغاء
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                showSuccess('تم إنشاء التقرير بنجاح');
                setReportModal(false);
              }}
              icon={FaFileAlt}
            >
              إنشاء
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Reports;