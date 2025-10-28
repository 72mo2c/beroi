import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, Search, TrendingUp, Users, Target, Eye, MousePointer, DollarSign, Calendar, BarChart3, PieChart, Activity } from 'lucide-react';

const MarketingCampaigns = () => {
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: 'حملة المنتجات الجديدة 2024',
      type: 'email',
      status: 'نشطة',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      budget: 50000,
      spent: 32000,
      target: 'عملاء جدد',
      reach: 15000,
      impressions: 45000,
      clicks: 2850,
      conversions: 142,
      leads: 89,
      opportunities: 23,
      revenue: 175000,
      roi: 446.88,
      ctr: 6.33,
      conversionRate: 4.98,
      assignedTo: 'سارة أحمد',
      description: 'حملة شاملة للإعلان عن إطلاق المنتجات الجديدة',
      channels: ['email', 'social', 'google'],
      metrics: {
        openRate: 23.5,
        bounceRate: 2.1,
        unsubscribeRate: 0.8
      }
    },
    {
      id: 2,
      name: 'حملة رأس السنة الميلادية',
      type: 'social',
      status: 'منتهية',
      startDate: '2023-12-15',
      endDate: '2024-01-05',
      budget: 75000,
      spent: 73500,
      target: 'عملاء حاليين',
      reach: 25000,
      impressions: 120000,
      clicks: 8900,
      conversions: 534,
      leads: 312,
      opportunities: 67,
      revenue: 425000,
      roi: 478.23,
      ctr: 7.42,
      conversionRate: 6.0,
      assignedTo: 'محمد عبدالله',
      description: 'حملة ترويجية لعرض رأس السنة',
      channels: ['facebook', 'instagram', 'twitter'],
      metrics: {
        engagementRate: 8.7,
        shareRate: 3.2,
        commentRate: 1.9
      }
    },
    {
      id: 3,
      name: 'حملة Google Ads للخدمات',
      type: 'ppc',
      status: 'نشطة',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      budget: 100000,
      spent: 45000,
      target: 'عملاء محتملين',
      reach: 8500,
      impressions: 35000,
      clicks: 1950,
      conversions: 97,
      leads: 56,
      opportunities: 15,
      revenue: 125000,
      roi: 177.78,
      ctr: 5.57,
      conversionRate: 4.97,
      assignedTo: 'عبدالرحمن سالم',
      description: 'حملة إعلانات مدفوعة لمحركات البحث',
      channels: ['google', 'bing'],
      metrics: {
        qualityScore: 8.2,
        avgCPC: 23.5,
        impressionShare: 67.8
      }
    },
    {
      id: 4,
      name: 'حملة المعارض التجارية',
      type: 'event',
      status: 'مجدولة',
      startDate: '2024-02-10',
      endDate: '2024-02-12',
      budget: 60000,
      spent: 0,
      target: 'عملاء B2B',
      reach: 5000,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      leads: 0,
      opportunities: 0,
      revenue: 0,
      roi: 0,
      ctr: 0,
      conversionRate: 0,
      assignedTo: 'فاطمة علي',
      description: 'مشاركة في معرض الرياض للتكنولوجيا',
      channels: ['event', 'booth'],
      metrics: {
        boothVisitors: 0,
        demos: 0,
        businessCards: 0
      }
    }
  ]);

  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid, list, analytics

  const campaignTypes = {
    email: 'بريد إلكتروني',
    social: 'وسائل التواصل',
    ppc: 'إعلانات مدفوعة',
    event: 'فعاليات',
    content: 'محتوى',
    sms: 'رسائل نصية'
  };

  const statusColors = {
    'نشطة': 'bg-green-100 text-green-800',
    'منتهية': 'bg-gray-100 text-gray-800',
    'مجدولة': 'bg-blue-100 text-blue-800',
    'متوقفة': 'bg-red-100 text-red-800'
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    const matchesType = typeFilter === 'all' || campaign.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalBudget = campaigns.reduce((sum, camp) => sum + camp.budget, 0);
  const totalSpent = campaigns.reduce((sum, camp) => sum + camp.spent, 0);
  const totalRevenue = campaigns.reduce((sum, camp) => sum + camp.revenue, 0);
  const totalLeads = campaigns.reduce((sum, camp) => sum + camp.leads, 0);
  const avgROI = campaigns.length > 0 ? campaigns.reduce((sum, camp) => sum + camp.roi, 0) / campaigns.length : 0;

  const GridView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredCampaigns.map((campaign) => (
        <div key={campaign.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{campaign.name}</h3>
                <p className="text-sm text-gray-600">{campaignTypes[campaign.type]}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[campaign.status]}`}>
                {campaign.status}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">الميزانية:</span>
                <span className="text-sm font-medium">{campaign.budget.toLocaleString()} ريال</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">المنفق:</span>
                <span className="text-sm font-medium">{campaign.spent.toLocaleString()} ريال</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-900">{campaign.reach.toLocaleString()}</div>
                <div className="text-xs text-gray-600">الموصولون</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">{campaign.conversions}</div>
                <div className="text-xs text-gray-600">التحويلات</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">{campaign.leads}</div>
                <div className="text-xs text-gray-600">العملاء المحتملين</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-purple-600">{campaign.roi.toFixed(1)}%</div>
                <div className="text-xs text-gray-600">العائد</div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {campaign.assignedTo}
              </div>
              <button 
                onClick={() => setSelectedCampaign(campaign)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                عرض التفاصيل
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الحملة
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              النوع
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الحالة
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الميزانية
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الوصول
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              التحويلات
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              العائد
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الإجراءات
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredCampaigns.map((campaign) => (
            <tr key={campaign.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                  <div className="text-sm text-gray-500">{campaign.assignedTo}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {campaignTypes[campaign.type]}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[campaign.status]}`}>
                  {campaign.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {campaign.spent.toLocaleString()} / {campaign.budget.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {campaign.reach.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {campaign.conversions}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {campaign.roi.toFixed(1)}%
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setSelectedCampaign(campaign)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-900">
                    <BarChart3 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const AnalyticsView = () => (
    <div className="space-y-6">
      {/* Overall Performance */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي الميزانية</p>
              <p className="text-2xl font-bold text-gray-900">{(totalBudget / 1000).toFixed(0)}K</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي المنفق</p>
              <p className="text-2xl font-bold text-gray-900">{(totalSpent / 1000).toFixed(0)}K</p>
            </div>
            <Target className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي الإيرادات</p>
              <p className="text-2xl font-bold text-gray-900">{(totalRevenue / 1000).toFixed(0)}K</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي العملاء</p>
              <p className="text-2xl font-bold text-gray-900">{totalLeads}</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">متوسط العائد</p>
              <p className="text-2xl font-bold text-gray-900">{avgROI.toFixed(1)}%</p>
            </div>
            <BarChart3 className="h-8 w-8 text-pink-600" />
          </div>
        </div>
      </div>

      {/* Performance by Campaign Type */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">الأداء حسب نوع الحملة</h3>
        <div className="space-y-4">
          {Object.entries(campaignTypes).map(([key, name]) => {
            const typeCampaigns = campaigns.filter(c => c.type === key);
            const typeRevenue = typeCampaigns.reduce((sum, c) => sum + c.revenue, 0);
            const typeLeads = typeCampaigns.reduce((sum, c) => sum + c.leads, 0);
            
            return (
              <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Megaphone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{name}</h4>
                    <p className="text-sm text-gray-600">{typeCampaigns.length} حملة</p>
                  </div>
                </div>
                <div className="flex items-center space-x-8">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{(typeRevenue / 1000).toFixed(0)}K</p>
                    <p className="text-sm text-gray-600">الإيرادات</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">{typeLeads}</p>
                    <p className="text-sm text-gray-600">العملاء</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">حملات التسويق</h1>
          <p className="text-gray-600">إنشاء وإدارة الحملات التسويقية القابلة للقياس</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>حملة جديدة</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي الحملات</p>
              <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
            </div>
            <Megaphone className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">الحملات النشطة</p>
              <p className="text-2xl font-bold text-gray-900">
                {campaigns.filter(c => c.status === 'نشطة').length}
              </p>
            </div>
            <Activity className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي الوصول</p>
              <p className="text-2xl font-bold text-gray-900">
                {(campaigns.reduce((sum, c) => sum + c.reach, 0) / 1000).toFixed(0)}K
              </p>
            </div>
            <Eye className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي النقرات</p>
              <p className="text-2xl font-bold text-gray-900">
                {campaigns.reduce((sum, c) => sum + c.clicks, 0).toLocaleString()}
              </p>
            </div>
            <MousePointer className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي التحويلات</p>
              <p className="text-2xl font-bold text-gray-900">
                {campaigns.reduce((sum, c) => sum + c.conversions, 0)}
              </p>
            </div>
            <Target className="h-8 w-8 text-pink-600" />
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
                placeholder="البحث في الحملات..."
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
              <option value="نشطة">نشطة</option>
              <option value="منتهية">منتهية</option>
              <option value="مجدولة">مجدولة</option>
              <option value="متوقفة">متوقفة</option>
            </select>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">جميع الأنواع</option>
              {Object.entries(campaignTypes).map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              شبكة
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              قائمة
            </button>
            <button
              onClick={() => setViewMode('analytics')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'analytics' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              تحليلات
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {viewMode === 'grid' && <GridView />}
        {viewMode === 'list' && <ListView />}
        {viewMode === 'analytics' && <AnalyticsView />}
      </div>

      {/* Campaign Detail Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{selectedCampaign.name}</h2>
              <button 
                onClick={() => setSelectedCampaign(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Campaign Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">تفاصيل الحملة</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">النوع:</span>
                      <span className="font-medium">{campaignTypes[selectedCampaign.type]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الحالة:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[selectedCampaign.status]}`}>
                        {selectedCampaign.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">تاريخ البداية:</span>
                      <span className="font-medium">{new Date(selectedCampaign.startDate).toLocaleDateString('ar-SA')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">تاريخ النهاية:</span>
                      <span className="font-medium">{new Date(selectedCampaign.endDate).toLocaleDateString('ar-SA')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الهدف:</span>
                      <span className="font-medium">{selectedCampaign.target}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">المسؤول:</span>
                      <span className="font-medium">{selectedCampaign.assignedTo}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">الوصف</h3>
                  <p className="text-gray-600">{selectedCampaign.description}</p>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">مؤشرات الأداء</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{selectedCampaign.reach.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">الموصولون</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{selectedCampaign.impressions.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">الظهور</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{selectedCampaign.clicks.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">النقرات</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{selectedCampaign.ctr.toFixed(2)}%</div>
                      <div className="text-sm text-gray-600">معدل النقر</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{selectedCampaign.conversions}</div>
                      <div className="text-sm text-gray-600">التحويلات</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-pink-600">{selectedCampaign.conversionRate.toFixed(2)}%</div>
                      <div className="text-sm text-gray-600">معدل التحويل</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">العائد المالي</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">الميزانية:</span>
                      <span className="font-medium">{selectedCampaign.budget.toLocaleString()} ريال</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">المنفق:</span>
                      <span className="font-medium">{selectedCampaign.spent.toLocaleString()} ريال</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الإيرادات:</span>
                      <span className="font-medium text-green-600">{selectedCampaign.revenue.toLocaleString()} ريال</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">العائد على الاستثمار:</span>
                      <span className="font-medium text-green-600">{selectedCampaign.roi.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                إغلاق
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                تعديل
              </button>
              <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                تقرير مفصل
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketingCampaigns;