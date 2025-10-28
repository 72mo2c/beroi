import React, { useState, useEffect } from 'react';
import { FileText, Plus, Search, Calendar, DollarSign, CheckCircle, Clock, AlertTriangle, Users, Download, Eye, Edit, Trash2, Zap } from 'lucide-react';

const Contracts = () => {
  const [contracts, setContracts] = useState([
    {
      id: 1,
      title: 'عقد تطوير نظام إدارة المخازن',
      client: 'شركة النجاح للتجارة',
      clientEmail: 'ahmed@company.com',
      clientPhone: '+966501234567',
      type: 'تطوير برمجيات',
      status: 'نشط',
      startDate: '2024-01-15',
      endDate: '2024-06-15',
      value: 150000,
      paid: 75000,
      remaining: 75000,
      progress: 65,
      signedDate: '2024-01-10',
      assignedTo: 'سارة أحمد',
      milestones: [
        { id: 1, name: 'تحليل المتطلبات', status: 'completed', dueDate: '2024-01-30', completedDate: '2024-01-28' },
        { id: 2, name: 'التصميم', status: 'completed', dueDate: '2024-02-15', completedDate: '2024-02-12' },
        { id: 3, name: 'التطوير', status: 'in-progress', dueDate: '2024-04-30', completedDate: null },
        { id: 4, name: 'الاختبار', status: 'pending', dueDate: '2024-05-30', completedDate: null },
        { id: 5, name: 'النشر', status: 'pending', dueDate: '2024-06-15', completedDate: null }
      ],
      deliverables: [
        { id: 1, name: 'تطبيق الويب الرئيسي', status: 'completed', dueDate: '2024-05-15' },
        { id: 2, name: 'تطبيق الهاتف المحمول', status: 'in-progress', dueDate: '2024-06-01' },
        { id: 3, name: 'دليل المستخدم', status: 'pending', dueDate: '2024-06-10' }
      ],
      documents: ['عقد_المشروع_مبدئي.pdf', 'المواصفات_الفنية.pdf', 'خطة_المشروع.pdf'],
      notes: 'مشروع استراتيجي مهم للشركة - متابعة دقيقة مطلوبة',
      nextPayment: { amount: 50000, dueDate: '2024-03-15' }
    },
    {
      id: 2,
      title: 'عقد تكامل أنظمة المحاسبة',
      client: 'مؤسسة الإبداع المحدودة',
      clientEmail: 'fatima@company.com',
      clientPhone: '+966509876543',
      type: 'تكامل أنظمة',
      status: 'قيد المراجعة',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      value: 85000,
      paid: 25500,
      remaining: 59500,
      progress: 35,
      signedDate: '2023-12-28',
      assignedTo: 'محمد عبدالله',
      milestones: [
        { id: 1, name: 'دراسة الأنظمة الحالية', status: 'completed', dueDate: '2024-01-15', completedDate: '2024-01-12' },
        { id: 2, name: 'تطوير خطة التكامل', status: 'completed', dueDate: '2024-01-31', completedDate: '2024-01-29' },
        { id: 3, name: 'تنفيذ التكامل', status: 'in-progress', dueDate: '2024-02-28', completedDate: null },
        { id: 4, name: 'الاختبار والنشر', status: 'pending', dueDate: '2024-03-31', completedDate: null }
      ],
      deliverables: [
        { id: 1, name: 'وثائق التكامل', status: 'completed', dueDate: '2024-01-31' },
        { id: 2, name: 'التكامل الفعلي', status: 'in-progress', dueDate: '2024-02-28' }
      ],
      documents: ['عقد_التكامل.pdf', 'دراسة_الجدوى.pdf'],
      notes: 'العميل يطلب تسريع العملية',
      nextPayment: { amount: 42500, dueDate: '2024-02-15' }
    },
    {
      id: 3,
      title: 'عقد صيانة سنوية',
      client: 'مجموعة entreprises السعودية',
      clientEmail: 'khalid@enterprise.sa',
      clientPhone: '+966551112233',
      type: 'صيانة ودعم',
      status: 'منتهي',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      value: 240000,
      paid: 240000,
      remaining: 0,
      progress: 100,
      signedDate: '2022-12-15',
      assignedTo: 'عبدالرحمن سالم',
      milestones: [
        { id: 1, name: 'الصيانة الربع سنوية الأولى', status: 'completed', dueDate: '2023-03-31', completedDate: '2023-03-28' },
        { id: 2, name: 'الصيانة الربع سنوية الثانية', status: 'completed', dueDate: '2023-06-30', completedDate: '2023-06-25' },
        { id: 3, name: 'الصيانة الربع سنوية الثالثة', status: 'completed', dueDate: '2023-09-30', completedDate: '2023-09-28' },
        { id: 4, name: 'الصيانة الربع سنوية الرابعة', status: 'completed', dueDate: '2023-12-31', completedDate: '2023-12-29' }
      ],
      deliverables: [
        { id: 1, name: 'تقارير الصيانة', status: 'completed', dueDate: '2023-12-31' },
        { id: 2, name: 'دعم فني 24/7', status: 'completed', dueDate: '2023-12-31' }
      ],
      documents: ['عقد_الصيانة_السنوي.pdf', 'تقارير_الصيانة.pdf'],
      notes: 'عقد ممتاز - إمكانية التجديد لعام 2024',
      nextPayment: null
    },
    {
      id: 4,
      title: 'عقد تطوير تطبيق الجوال',
      client: 'شركة الإبداع التقني',
      clientEmail: 'info@tech-sa.com',
      clientPhone: '+966551234567',
      type: 'تطوير تطبيقات',
      status: 'متأخر',
      startDate: '2023-11-01',
      endDate: '2024-02-01',
      value: 120000,
      paid: 48000,
      remaining: 72000,
      progress: 45,
      signedDate: '2023-10-25',
      assignedTo: 'فاطمة علي',
      milestones: [
        { id: 1, name: 'تصميم الواجهات', status: 'completed', dueDate: '2023-11-15', completedDate: '2023-11-18' },
        { id: 2, name: 'تطوير النسخة التجريبية', status: 'completed', dueDate: '2023-12-15', completedDate: '2023-12-20' },
        { id: 3, name: 'الاختبار والمراجعة', status: 'in-progress', dueDate: '2024-01-15', completedDate: null },
        { id: 4, name: 'النشر النهائي', status: 'pending', dueDate: '2024-02-01', completedDate: null }
      ],
      deliverables: [
        { id: 1, name: 'تطبيق iOS', status: 'in-progress', dueDate: '2024-01-30' },
        { id: 2, name: 'تطبيق Android', status: 'in-progress', dueDate: '2024-01-30' },
        { id: 3, name: 'لوحة التحكم الإدارية', status: 'pending', dueDate: '2024-02-01' }
      ],
      documents: ['عقد_تطوير_التطبيق.pdf', 'مواصفات_التطبيق.pdf'],
      notes: 'متأخر عن الجدول - مراجعة الوضع مع العميل ضرورية',
      nextPayment: { amount: 48000, dueDate: '2024-01-30' }
    }
  ]);

  const [selectedContract, setSelectedContract] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState('cards'); // cards, table, timeline

  const contractTypes = {
    'تطوير برمجيات': 'تطوير برمجيات',
    'تكامل أنظمة': 'تكامل أنظمة',
    'صيانة ودعم': 'صيانة ودعم',
    'تطوير تطبيقات': 'تطوير تطبيقات',
    'استشارات تقنية': 'استشارات تقنية',
    'تدريب': 'تدريب'
  };

  const statusColors = {
    'نشط': 'bg-green-100 text-green-800',
    'قيد المراجعة': 'bg-yellow-100 text-yellow-800',
    'منتهي': 'bg-gray-100 text-gray-800',
    'متأخر': 'bg-red-100 text-red-800',
    'ملغي': 'bg-red-100 text-red-800'
  };

  const statusIcons = {
    'نشط': CheckCircle,
    'قيد المراجعة': Clock,
    'منتهي': CheckCircle,
    'متأخر': AlertTriangle,
    'ملغي': AlertTriangle
  };

  const milestoneColors = {
    'completed': 'bg-green-100 text-green-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'pending': 'bg-gray-100 text-gray-800'
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    const matchesType = typeFilter === 'all' || contract.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalValue = contracts.reduce((sum, contract) => sum + contract.value, 0);
  const totalPaid = contracts.reduce((sum, contract) => sum + contract.paid, 0);
  const totalRemaining = contracts.reduce((sum, contract) => sum + contract.remaining, 0);
  const activeContracts = contracts.filter(c => c.status === 'نشط').length;

  const CardsView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredContracts.map((contract) => {
        const StatusIcon = statusIcons[contract.status];
        return (
          <div key={contract.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{contract.title}</h3>
                    <p className="text-sm text-gray-600">{contract.client}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[contract.status]}`}>
                  {contract.status}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">القيمة الإجمالية:</span>
                  <span className="text-sm font-medium">{contract.value.toLocaleString()} ريال</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">المدفوع:</span>
                  <span className="text-sm font-medium text-green-600">{contract.paid.toLocaleString()} ريال</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">المتبقي:</span>
                  <span className="text-sm font-medium text-orange-600">{contract.remaining.toLocaleString()} ريال</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(contract.paid / contract.value) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">التقدم:</span>
                  <span className="text-sm font-medium">{contract.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${contract.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {new Date(contract.endDate).toLocaleDateString('ar-SA')}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{contract.assignedTo}</span>
                </div>
              </div>

              {contract.nextPayment && (
                <div className="p-3 bg-yellow-50 rounded-lg mb-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">
                      دفعة قريبة: {contract.nextPayment.amount.toLocaleString()} ريال
                    </span>
                  </div>
                  <p className="text-xs text-yellow-600 mt-1">
                    تاريخ الاستحقاق: {new Date(contract.nextPayment.dueDate).toLocaleDateString('ar-SA')}
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setSelectedContract(contract)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-800">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-purple-600 hover:text-purple-800">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-xs text-gray-500">{contract.type}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const TableView = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              العقد
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              العميل
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              النوع
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الحالة
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              القيمة
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              التقدم
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              تاريخ الانتهاء
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الإجراءات
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredContracts.map((contract) => (
            <tr key={contract.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">{contract.title}</div>
                  <div className="text-sm text-gray-500">ID: {contract.id}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">{contract.client}</div>
                  <div className="text-sm text-gray-500">{contract.clientEmail}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {contract.type}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[contract.status]}`}>
                  {contract.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div>
                  <div className="font-medium">{contract.value.toLocaleString()} ريال</div>
                  <div className="text-green-600">{contract.paid.toLocaleString()} مدفوع</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 ml-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${contract.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{contract.progress}%</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(contract.endDate).toLocaleDateString('ar-SA')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setSelectedContract(contract)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-900">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-purple-600 hover:text-purple-900">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">إدارة العقود</h1>
          <p className="text-gray-600">تتبع وإدارة العقود والإنجازات والمهام</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>عقد جديد</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي العقود</p>
              <p className="text-2xl font-bold text-gray-900">{contracts.length}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">العقود النشطة</p>
              <p className="text-2xl font-bold text-gray-900">{activeContracts}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">القيمة الإجمالية</p>
              <p className="text-2xl font-bold text-gray-900">{(totalValue / 1000).toFixed(0)}K</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي المدفوع</p>
              <p className="text-2xl font-bold text-gray-900">{(totalPaid / 1000).toFixed(0)}K</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">المتبقي للتحصيل</p>
              <p className="text-2xl font-bold text-gray-900">{(totalRemaining / 1000).toFixed(0)}K</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="البحث في العقود..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">جميع الحالات</option>
              <option value="نشط">نشط</option>
              <option value="قيد المراجعة">قيد المراجعة</option>
              <option value="منتهي">منتهي</option>
              <option value="متأخر">متأخر</option>
              <option value="ملغي">ملغي</option>
            </select>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">جميع الأنواع</option>
              {Object.entries(contractTypes).map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'cards' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              بطاقات
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'table' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              جدول
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {viewMode === 'cards' ? <CardsView /> : <TableView />}
      </div>

      {/* Contract Detail Modal */}
      {selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{selectedContract.title}</h2>
              <button 
                onClick={() => setSelectedContract(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contract Information */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">معلومات العقد</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">العميل:</span>
                        <span className="font-medium">{selectedContract.client}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">النوع:</span>
                        <span className="font-medium">{selectedContract.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">الحالة:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[selectedContract.status]}`}>
                          {selectedContract.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">تاريخ البداية:</span>
                        <span className="font-medium">{new Date(selectedContract.startDate).toLocaleDateString('ar-SA')}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">القيمة الإجمالية:</span>
                        <span className="font-medium text-green-600">{selectedContract.value.toLocaleString()} ريال</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">المدفوع:</span>
                        <span className="font-medium text-green-600">{selectedContract.paid.toLocaleString()} ريال</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">المتبقي:</span>
                        <span className="font-medium text-orange-600">{selectedContract.remaining.toLocaleString()} ريال</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">تاريخ الانتهاء:</span>
                        <span className="font-medium">{new Date(selectedContract.endDate).toLocaleDateString('ar-SA')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Milestones */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">المراحل الرئيسية</h3>
                  <div className="space-y-3">
                    {selectedContract.milestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${
                            milestone.status === 'completed' ? 'bg-green-100' :
                            milestone.status === 'in-progress' ? 'bg-blue-100' : 'bg-gray-100'
                          }`}>
                            <CheckCircle className={`h-4 w-4 ${
                              milestone.status === 'completed' ? 'text-green-600' :
                              milestone.status === 'in-progress' ? 'text-blue-600' : 'text-gray-600'
                            }`} />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{milestone.name}</h4>
                            <p className="text-sm text-gray-600">
                              {milestone.status === 'completed' 
                                ? `مكتمل في ${new Date(milestone.completedDate).toLocaleDateString('ar-SA')}`
                                : `موعد الإنجاز: ${new Date(milestone.dueDate).toLocaleDateString('ar-SA')}`
                              }
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${milestoneColors[milestone.status]}`}>
                          {milestone.status === 'completed' ? 'مكتمل' :
                           milestone.status === 'in-progress' ? 'قيد التنفيذ' : 'معلق'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deliverables */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">المخرجات</h3>
                  <div className="space-y-2">
                    {selectedContract.deliverables.map((deliverable) => (
                      <div key={deliverable.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-900">{deliverable.name}</span>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600">
                            {new Date(deliverable.dueDate).toLocaleDateString('ar-SA')}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${milestoneColors[deliverable.status]}`}>
                            {deliverable.status === 'completed' ? 'مكتمل' :
                             deliverable.status === 'in-progress' ? 'قيد التنفيذ' : 'معلق'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">الملاحظات</h3>
                  <p className="text-gray-600">{selectedContract.notes}</p>
                </div>

                {selectedContract.nextPayment && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">الدفعة القادمة</h3>
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <DollarSign className="h-5 w-5 text-yellow-600" />
                        <span className="font-medium text-yellow-800">
                          {selectedContract.nextPayment.amount.toLocaleString()} ريال
                        </span>
                      </div>
                      <p className="text-sm text-yellow-600">
                        تاريخ الاستحقاق: {new Date(selectedContract.nextPayment.dueDate).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">المستندات</h3>
                  <div className="space-y-2">
                    {selectedContract.documents.map((doc, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                        <FileText className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-700">{doc}</span>
                        <button className="text-blue-600 hover:text-blue-800">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                إلغاء
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                تعديل
              </button>
              <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                إنشاء فاتورة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contracts;