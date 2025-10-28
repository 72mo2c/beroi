import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Filter, Mail, Phone, Calendar, Star, TrendingUp, Eye, Edit, Trash2 } from 'lucide-react';

const Leads = () => {
  const [leads, setLeads] = useState([
    {
      id: 1,
      name: 'أحمد محمد السعد',
      email: 'ahmed@email.com',
      phone: '+966501234567',
      company: 'شركة النجاح للتجارة',
      source: 'موقع الويب',
      status: 'جديد',
      stage: 'اتصال أولي',
      value: 50000,
      probability: 20,
      createdAt: '2024-01-15',
      assignedTo: 'سارة أحمد',
      notes: 'مهتم بمنتجاتنا الجديدة'
    },
    {
      id: 2,
      name: 'فاطمة علي الزهراني',
      email: 'fatima@company.com',
      phone: '+966509876543',
      company: 'مؤسسة الإبداع المحدودة',
      source: 'توصية',
      status: 'جاري المتابعة',
      stage: 'عرض الأسعار',
      value: 75000,
      probability: 60,
      createdAt: '2024-01-12',
      assignedTo: 'محمد عبدالله',
      notes: 'في انتظار الموافقة النهائية'
    },
    {
      id: 3,
      name: 'خالد عبدالرحمن الغامدي',
      email: 'khalid@enterprise.sa',
      phone: '+966551112233',
      company: 'مجموعة entreprises السعودية',
      source: 'حملة إعلانية',
      status: 'مؤهل',
      stage: 'المفاوضات',
      value: 120000,
      probability: 80,
      createdAt: '2024-01-10',
      assignedTo: 'عبدالرحمن سالم',
      notes: 'مفاوضات متقدمة - توقع الإغلاق قريباً'
    }
  ]);

  const [stages] = useState([
    { id: 'new', name: 'جديد', color: 'bg-blue-100 text-blue-800', count: 25 },
    { id: 'contact', name: 'اتصال أولي', color: 'bg-yellow-100 text-yellow-800', count: 18 },
    { id: 'qualified', name: 'مؤهل', color: 'bg-purple-100 text-purple-800', count: 12 },
    { id: 'proposal', name: 'عرض الأسعار', color: 'bg-orange-100 text-orange-800', count: 8 },
    { id: 'negotiation', name: 'المفاوضات', color: 'bg-green-100 text-green-800', count: 5 },
    { id: 'closed-won', name: 'مغلق - رابح', color: 'bg-emerald-100 text-emerald-800', count: 15 },
    { id: 'closed-lost', name: 'مغلق - خاسر', color: 'bg-red-100 text-red-800', count: 3 }
  ]);

  const [selectedStage, setSelectedStage] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('kanban'); // kanban or table
  const [selectedLead, setSelectedLead] = useState(null);

  const filteredLeads = leads.filter(lead => {
    const matchesStage = selectedStage === 'all' || lead.stage === selectedStage;
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const getStageData = (stageName) => {
    return filteredLeads.filter(lead => lead.stage === stageName);
  };

  const getStageFromId = (stageId) => {
    const stageMap = {
      'new': 'جديد',
      'contact': 'اتصال أولي',
      'qualified': 'مؤهل',
      'proposal': 'عرض الأسعار',
      'negotiation': 'المفاوضات',
      'closed-won': 'مغلق - رابح',
      'closed-lost': 'مغلق - خاسر'
    };
    return stageMap[stageId] || stageName;
  };

  const updateLeadStage = (leadId, newStage) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, stage: newStage } : lead
    ));
  };

  const KanbanView = () => (
    <div className="flex overflow-x-auto space-x-6 pb-4">
      {stages.map((stage) => (
        <div key={stage.id} className="flex-shrink-0 w-80">
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">{stage.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${stage.color}`}>
                {stage.count}
              </span>
            </div>
            <div className="space-y-3">
              {getStageData(stage.name).map((lead) => (
                <div key={lead.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{lead.name}</h4>
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => setSelectedLead(lead)}
                        className="p-1 text-gray-400 hover:text-blue-600"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-600">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{lead.company}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                    <Mail className="h-4 w-4" />
                    <span>{lead.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-600">
                      {lead.value.toLocaleString()} ريال
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-gray-600">{lead.probability}%</span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    مassigned to: {lead.assignedTo}
                  </div>
                </div>
              ))}
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
              العميل المحتمل
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الشركة
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
              المسؤول
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الإجراءات
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredLeads.map((lead) => (
            <tr key={lead.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                  <div className="text-sm text-gray-500">{lead.email}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {lead.company}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  stages.find(s => s.name === lead.stage)?.color || 'bg-gray-100 text-gray-800'
                }`}>
                  {lead.stage}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {lead.value.toLocaleString()} ريال
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 ml-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${lead.probability}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{lead.probability}%</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {lead.assignedTo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-900">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-900">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <Trash2 className="h-4 w-4" />
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">إدارة العملاء المحتملين</h1>
          <p className="text-gray-600">تتبع وإدارة العملاء المحتملين في رحلة المبيعات</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>عميل محتمل جديد</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="البحث في العملاء المحتملين..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              onClick={() => setViewMode('kanban')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'kanban' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              عرض الكانبان
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'table' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              عرض الجدول
            </button>
          </div>
        </div>
      </div>

      {/* Conversion Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي العملاء المحتملين</p>
              <p className="text-2xl font-bold text-gray-900">{filteredLeads.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">معدل التحويل</p>
              <p className="text-2xl font-bold text-gray-900">23.5%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">القيمة المتوقعة</p>
              <p className="text-2xl font-bold text-gray-900">{(filteredLeads.reduce((sum, lead) => sum + lead.value, 0) / 1000).toFixed(0)}K</p>
            </div>
            <Star className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">متوسط وقت التحويل</p>
              <p className="text-2xl font-bold text-gray-900">14 يوم</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {viewMode === 'kanban' ? <KanbanView /> : <TableView />}
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">تفاصيل العميل المحتمل</h2>
              <button 
                onClick={() => setSelectedLead(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الاسم</label>
                <p className="text-gray-900">{selectedLead.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الشركة</label>
                <p className="text-gray-900">{selectedLead.company}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                <p className="text-gray-900">{selectedLead.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الهاتف</label>
                <p className="text-gray-900">{selectedLead.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المرحلة</label>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  stages.find(s => s.name === selectedLead.stage)?.color || 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedLead.stage}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">القيمة المتوقعة</label>
                <p className="text-gray-900">{selectedLead.value.toLocaleString()} ريال</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">الملاحظات</label>
                <p className="text-gray-900">{selectedLead.notes}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                إغلاق
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                تعديل
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;