import React, { useState, useEffect } from 'react';
import { Target, Plus, Search, Calendar, DollarSign, TrendingUp, Clock, Users, BarChart3, Star, Eye, Edit, Phone, Mail } from 'lucide-react';

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState([
    {
      id: 1,
      title: 'تطوير نظام إدارة المخازن',
      company: 'شركة النجاح للتجارة',
      contact: 'أحمد محمد السعد',
      email: 'ahmed@company.com',
      phone: '+966501234567',
      value: 150000,
      probability: 75,
      stage: 'المفاوضات',
      expectedCloseDate: '2024-02-15',
      createdAt: '2024-01-15',
      assignedTo: 'سارة أحمد',
      source: 'موقع الويب',
      description: 'مشروع شامل لتطوير نظام إدارة المخازن والشحن',
      activities: [
        { id: 1, type: 'call', date: '2024-01-20', description: 'اتصال هاتفي لمناقشة المتطلبات' },
        { id: 2, type: 'meeting', date: '2024-01-22', description: 'اجتماع عرض تقديمي' },
        { id: 3, type: 'proposal', date: '2024-01-25', description: 'إرسال عرض أسعار أولي' }
      ],
      documents: ['عرض_الأسعار_المبدئي.pdf', 'المواصفات_الفنية.pdf'],
      lastActivity: '2024-01-25',
      status: 'active'
    },
    {
      id: 2,
      title: 'تكامل أنظمة المحاسبة',
      company: 'مؤسسة الإبداع المحدودة',
      contact: 'فاطمة علي الزهراني',
      email: 'fatima@company.com',
      phone: '+966509876543',
      value: 85000,
      probability: 60,
      stage: 'عرض الأسعار',
      expectedCloseDate: '2024-02-28',
      createdAt: '2024-01-12',
      assignedTo: 'محمد عبدالله',
      source: 'توصية',
      description: 'تكامل أنظمة المحاسبة مع النظام الحالي',
      activities: [
        { id: 1, type: 'call', date: '2024-01-18', description: 'مكالمة تعريفية' },
        { id: 2, type: 'email', date: '2024-01-20', description: 'إرسال معلومات إضافية' }
      ],
      documents: ['دراسة_جدوى_مبدئية.pdf'],
      lastActivity: '2024-01-20',
      status: 'active'
    },
    {
      id: 3,
      title: 'نظام إدارة الموارد البشرية',
      company: 'مجموعة entreprises السعودية',
      contact: 'خالد عبدالرحمن الغامدي',
      email: 'khalid@enterprise.sa',
      phone: '+966551112233',
      value: 200000,
      probability: 90,
      stage: 'المفاوضات المتقدمة',
      expectedCloseDate: '2024-02-10',
      createdAt: '2024-01-10',
      assignedTo: 'عبدالرحمن سالم',
      source: 'حملة إعلانية',
      description: 'نظام شامل لإدارة الموارد البشرية والرواتب',
      activities: [
        { id: 1, type: 'meeting', date: '2024-01-15', description: 'اجتماع مع الإدارة العليا' },
        { id: 2, type: 'proposal', date: '2024-01-18', description: 'عرض أسعار نهائي' },
        { id: 3, type: 'negotiation', date: '2024-01-22', description: 'مفاوضات العقد' }
      ],
      documents: ['العقد_النهائي.pdf', 'المواصفات_المفصلة.pdf'],
      lastActivity: '2024-01-22',
      status: 'active'
    }
  ]);

  const [stages] = useState([
    { id: 'qualification', name: 'التأهيل', color: 'bg-blue-100 text-blue-800', probability: 20, count: 5 },
    { id: 'needs_analysis', name: 'تحليل الاحتياجات', color: 'bg-yellow-100 text-yellow-800', probability: 30, count: 4 },
    { id: 'proposal', name: 'عرض الأسعار', color: 'bg-orange-100 text-orange-800', probability: 50, count: 6 },
    { id: 'negotiation', name: 'المفاوضات', color: 'bg-purple-100 text-purple-800', probability: 70, count: 3 },
    { id: 'advanced_negotiation', name: 'المفاوضات المتقدمة', color: 'bg-indigo-100 text-indigo-800', probability: 85, count: 2 },
    { id: 'closed_won', name: 'مغلق - رابح', color: 'bg-green-100 text-green-800', probability: 100, count: 8 },
    { id: 'closed_lost', name: 'مغلق - خاسر', color: 'bg-red-100 text-red-800', probability: 0, count: 2 }
  ]);

  const [selectedStage, setSelectedStage] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [viewMode, setViewMode] = useState('pipeline'); // pipeline, table, calendar

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesStage = selectedStage === 'all' || opp.stage === selectedStage;
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.contact.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const totalValue = filteredOpportunities.reduce((sum, opp) => sum + opp.value, 0);
  const weightedValue = filteredOpportunities.reduce((sum, opp) => sum + (opp.value * opp.probability / 100), 0);
  const avgProbability = filteredOpportunities.length > 0 
    ? filteredOpportunities.reduce((sum, opp) => sum + opp.probability, 0) / filteredOpportunities.length 
    : 0;

  const getStageData = (stageName) => {
    return filteredOpportunities.filter(opp => opp.stage === stageName);
  };

  const PipelineView = () => (
    <div className="flex overflow-x-auto space-x-4 pb-4">
      {stages.map((stage) => (
        <div key={stage.id} className="flex-shrink-0 w-80">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">{stage.name}</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{stage.probability}%</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${stage.color}`}>
                  {stage.count}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              {getStageData(stage.name).map((opp) => (
                <div key={opp.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                     onClick={() => setSelectedOpportunity(opp)}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">{opp.title}</h4>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{opp.company}</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-600">
                      {opp.value.toLocaleString()} ريال
                    </span>
                    <span className="text-sm text-gray-600">{opp.probability}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${opp.probability}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{opp.assignedTo}</span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(opp.expectedCloseDate).toLocaleDateString('ar-SA')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">إجمالي المرحلة</span>
                <span className="font-medium text-gray-900">
                  {getStageData(stage.name).reduce((sum, opp) => sum + opp.value, 0).toLocaleString()} ريال
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const TableView = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الفرصة
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              العميل
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              المرحلة
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              القيمة
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الاحتمالية
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              تاريخ الإغلاق المتوقع
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              المسؤول
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الإجراءات
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredOpportunities.map((opp) => (
            <tr key={opp.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">{opp.title}</div>
                  <div className="text-sm text-gray-500">{opp.source}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">{opp.company}</div>
                  <div className="text-sm text-gray-500">{opp.contact}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  stages.find(s => s.name === opp.stage)?.color || 'bg-gray-100 text-gray-800'
                }`}>
                  {opp.stage}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {opp.value.toLocaleString()} ريال
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 ml-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${opp.probability}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{opp.probability}%</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(opp.expectedCloseDate).toLocaleDateString('ar-SA')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {opp.assignedTo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setSelectedOpportunity(opp)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-900">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-purple-600 hover:text-purple-900">
                    <Phone className="h-4 w-4" />
                  </button>
                  <button className="text-orange-600 hover:text-orange-900">
                    <Mail className="h-4 w-4" />
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">إدارة الفرص</h1>
          <p className="text-gray-600">تتبع وإدارة فرص المبيعات في مسار المبيعات</p>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>فرصة جديدة</span>
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي الفرص</p>
              <p className="text-2xl font-bold text-gray-900">{filteredOpportunities.length}</p>
            </div>
            <Target className="h-8 w-8 text-blue-600" />
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
              <p className="text-sm font-medium text-gray-600">القيمة المرجحة</p>
              <p className="text-2xl font-bold text-gray-900">{(weightedValue / 1000).toFixed(0)}K</p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">متوسط الاحتمالية</p>
              <p className="text-2xl font-bold text-gray-900">{avgProbability.toFixed(1)}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
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
                placeholder="البحث في الفرص..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
            >
              <option value="all">جميع المراحل</option>
              {stages.map(stage => (
                <option key={stage.id} value={stage.name}>{stage.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('pipeline')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'pipeline' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              عرض المسار
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'table' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              عرض الجدول
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {viewMode === 'pipeline' ? <PipelineView /> : <TableView />}
      </div>

      {/* Opportunity Detail Modal */}
      {selectedOpportunity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{selectedOpportunity.title}</h2>
              <button 
                onClick={() => setSelectedOpportunity(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">معلومات أساسية</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">الشركة:</span>
                      <span className="font-medium">{selectedOpportunity.company}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">جهة الاتصال:</span>
                      <span className="font-medium">{selectedOpportunity.contact}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">البريد الإلكتروني:</span>
                      <span className="font-medium">{selectedOpportunity.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الهاتف:</span>
                      <span className="font-medium">{selectedOpportunity.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">القيمة:</span>
                      <span className="font-medium text-green-600">{selectedOpportunity.value.toLocaleString()} ريال</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الاحتمالية:</span>
                      <span className="font-medium">{selectedOpportunity.probability}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">المرحلة:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        stages.find(s => s.name === selectedOpportunity.stage)?.color || 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedOpportunity.stage}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">الوصف</h3>
                  <p className="text-gray-600">{selectedOpportunity.description}</p>
                </div>
              </div>

              {/* Activities and Timeline */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">الأنشطة الأخيرة</h3>
                  <div className="space-y-3">
                    {selectedOpportunity.activities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                          <p className="text-sm text-gray-500">{new Date(activity.date).toLocaleDateString('ar-SA')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">المستندات</h3>
                  <div className="space-y-2">
                    {selectedOpportunity.documents.map((doc, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                        <DollarSign className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-700">{doc}</span>
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
              <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                تعديل
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                إضافة نشاط
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Opportunities;