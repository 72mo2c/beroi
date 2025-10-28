import React, { useState, useEffect } from 'react';
import { Headphones, Plus, Search, Clock, MessageCircle, Phone, Mail, Star, TrendingUp, AlertCircle, CheckCircle, Users, BarChart3, Calendar } from 'lucide-react';

const CustomerService = () => {
  const [tickets, setTickets] = useState([
    {
      id: 1,
      subject: 'مشكلة في تسجيل الدخول للنظام',
      customer: 'أحمد محمد السعد',
      email: 'ahmed@company.com',
      phone: '+966501234567',
      priority: 'عالية',
      status: 'مفتوح',
      category: 'دعم تقني',
      assignedTo: 'سارة أحمد',
      createdAt: '2024-01-25T10:30:00',
      lastUpdate: '2024-01-25T14:20:00',
      resolutionTime: null,
      satisfaction: null,
      tags: ['دخول', 'خطأ'],
      description: 'لا أستطيع تسجيل الدخول إلى النظام، يظهر رسالة خطأ',
      history: [
        { id: 1, type: 'created', message: 'تم إنشاء التذكرة', timestamp: '2024-01-25T10:30:00', user: 'نظام' },
        { id: 2, type: 'assignment', message: 'تم تعيين التذكرة إلى سارة أحمد', timestamp: '2024-01-25T10:35:00', user: 'نظام' },
        { id: 3, type: 'response', message: 'تم إرسال رد أولي للعميل', timestamp: '2024-01-25T11:15:00', user: 'سارة أحمد' }
      ],
      responses: [
        { id: 1, message: 'شكراً لتواصلك معنا، نعتذر عن المشكلة. نعمل على حلها في أقرب وقت.', timestamp: '2024-01-25T11:15:00', user: 'سارة أحمد' }
      ]
    },
    {
      id: 2,
      subject: 'طلب استرداد المبلغ',
      customer: 'فاطمة علي الزهراني',
      email: 'fatima@company.com',
      phone: '+966509876543',
      priority: 'متوسطة',
      status: 'قيد المراجعة',
      category: 'طلب استرداد',
      assignedTo: 'محمد عبدالله',
      createdAt: '2024-01-24T16:45:00',
      lastUpdate: '2024-01-25T09:30:00',
      resolutionTime: null,
      satisfaction: null,
      tags: ['استرداد', 'دفع'],
      description: 'أرغب في استرداد مبلغ الخدمة لعدم رضاي عنها',
      history: [
        { id: 1, type: 'created', message: 'تم إنشاء التذكرة', timestamp: '2024-01-24T16:45:00', user: 'نظام' },
        { id: 2, type: 'assignment', message: 'تم تعيين التذكرة إلى محمد عبدالله', timestamp: '2024-01-24T16:50:00', user: 'نظام' },
        { id: 3, type: 'response', message: 'تم طلب معلومات إضافية من العميل', timestamp: '2024-01-25T09:30:00', user: 'محمد عبدالله' }
      ],
      responses: [
        { id: 1, message: 'أهلاً وسهلاً، نحتاج منك المزيد من التفاصيل حول طلب الاسترداد وأسباب عدم الرضا.', timestamp: '2024-01-25T09:30:00', user: 'محمد عبدالله' }
      ]
    },
    {
      id: 3,
      subject: 'استفسار عن خطة الاشتراك',
      customer: 'خالد عبدالرحمن الغامدي',
      email: 'khalid@enterprise.sa',
      phone: '+966551112233',
      priority: 'منخفضة',
      status: 'محلول',
      category: 'استفسار عام',
      assignedTo: 'عبدالرحمن سالم',
      createdAt: '2024-01-20T14:20:00',
      lastUpdate: '2024-01-22T11:15:00',
      resolutionTime: 47, // hours
      satisfaction: 5,
      tags: ['اشتراك', 'خطة'],
      description: 'أريد معرفة تفاصيل الخطط المتاحة للاشتراك',
      history: [
        { id: 1, type: 'created', message: 'تم إنشاء التذكرة', timestamp: '2024-01-20T14:20:00', user: 'نظام' },
        { id: 2, type: 'assignment', message: 'تم تعيين التذكرة إلى عبدالرحمن سالم', timestamp: '2024-01-20T14:25:00', user: 'نظام' },
        { id: 3, type: 'response', message: 'تم إرسال معلومات الخطط للعميل', timestamp: '2024-01-21T10:30:00', user: 'عبدالرحمن سالم' },
        { id: 4, type: 'resolved', message: 'تم حل المشكلة وإغلاق التذكرة', timestamp: '2024-01-22T11:15:00', user: 'عبدالرحمن سالم' }
      ],
      responses: [
        { id: 1, message: 'تم إرسال تفاصيل الخطط المختلفة عبر البريد الإلكتروني. يمكنكم مراجعة الخيارات واختيار الأنسب.', timestamp: '2024-01-21T10:30:00', user: 'عبدالرحمن سالم' },
        { id: 2, message: 'شكراً لكم، تم الرد على جميع استفساراتي بنجاح.', timestamp: '2024-01-22T11:00:00', user: 'خالد عبدالرحمن الغامدي' }
      ]
    },
    {
      id: 4,
      subject: 'خطأ في فاتورة المبيعات',
      customer: 'مؤسسة الإبداع المحدودة',
      email: 'info@creativity.com',
      phone: '+966552223334',
      priority: 'عالية',
      status: 'قيد المتابعة',
      category: 'مشكلة في الفواتير',
      assignedTo: 'فاطمة علي',
      createdAt: '2024-01-23T09:15:00',
      lastUpdate: '2024-01-24T16:30:00',
      resolutionTime: null,
      satisfaction: null,
      tags: ['فاتورة', 'خطأ'],
      description: 'يوجد خطأ في حساب المبالغ في فاتورة المبيعات الأخيرة',
      history: [
        { id: 1, type: 'created', message: 'تم إنشاء التذكرة', timestamp: '2024-01-23T09:15:00', user: 'نظام' },
        { id: 2, type: 'assignment', message: 'تم تعيين التذكرة إلى فاطمة علي', timestamp: '2024-01-23T09:20:00', user: 'نظام' },
        { id: 3, type: 'response', message: 'تم التواصل مع قسم المحاسبة للمراجعة', timestamp: '2024-01-24T16:30:00', user: 'فاطمة علي' }
      ],
      responses: [
        { id: 1, message: 'تم رفع التذكرة لقسم المحاسبة للمراجعة وإصلاح الخطأ. سنوافيكم بالتحديثات قريباً.', timestamp: '2024-01-24T16:30:00', user: 'فاطمة علي' }
      ]
    }
  ]);

  const [customers] = useState([
    {
      id: 1,
      name: 'أحمد محمد السعد',
      email: 'ahmed@company.com',
      phone: '+966501234567',
      company: 'شركة النجاح للتجارة',
      ticketsCount: 5,
      resolvedCount: 3,
      avgSatisfaction: 4.2,
      lastContact: '2024-01-25',
      lifetime: '2022-03-15',
      value: 150000,
      segment: 'عميل ذهبي',
      behavior: {
        supportTickets: 5,
        productUsage: 85,
        paymentHistory: 'ممتاز',
        engagement: 'عالي'
      }
    },
    {
      id: 2,
      name: 'فاطمة علي الزهراني',
      email: 'fatima@company.com',
      phone: '+966509876543',
      company: 'مؤسسة الإبداع المحدودة',
      ticketsCount: 2,
      resolvedCount: 2,
      avgSatisfaction: 4.8,
      lastContact: '2024-01-24',
      lifetime: '2021-08-20',
      value: 85000,
      segment: 'عميل فضي',
      behavior: {
        supportTickets: 2,
        productUsage: 70,
        paymentHistory: 'جيد',
        engagement: 'متوسط'
      }
    },
    {
      id: 3,
      name: 'خالد عبدالرحمن الغامدي',
      email: 'khalid@enterprise.sa',
      phone: '+966551112233',
      company: 'مجموعة entreprises السعودية',
      ticketsCount: 1,
      resolvedCount: 1,
      avgSatisfaction: 5.0,
      lastContact: '2024-01-22',
      lifetime: '2020-05-10',
      value: 240000,
      segment: 'عميل بلاتيني',
      behavior: {
        supportTickets: 1,
        productUsage: 95,
        paymentHistory: 'ممتاز',
        engagement: 'عالي جداً'
      }
    }
  ]);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [viewMode, setViewMode] = useState('tickets'); // tickets, customers, analytics

  const priorityColors = {
    'عالية': 'bg-red-100 text-red-800',
    'متوسطة': 'bg-yellow-100 text-yellow-800',
    'منخفضة': 'bg-green-100 text-green-800'
  };

  const statusColors = {
    'مفتوح': 'bg-blue-100 text-blue-800',
    'قيد المراجعة': 'bg-yellow-100 text-yellow-800',
    'قيد المتابعة': 'bg-purple-100 text-purple-800',
    'محلول': 'bg-green-100 text-green-800',
    'مغلق': 'bg-gray-100 text-gray-800'
  };

  const statusIcons = {
    'مفتوح': MessageCircle,
    'قيد المراجعة': Clock,
    'قيد المتابعة': AlertCircle,
    'محلول': CheckCircle,
    'مغلق': CheckCircle
  };

  const segmentColors = {
    'عميل بلاتيني': 'bg-purple-100 text-purple-800',
    'عميل ذهبي': 'bg-yellow-100 text-yellow-800',
    'عميل فضي': 'bg-gray-100 text-gray-800',
    'عميل جديد': 'bg-blue-100 text-blue-800'
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const avgResolutionTime = tickets
    .filter(t => t.resolutionTime)
    .reduce((sum, t) => sum + t.resolutionTime, 0) / tickets.filter(t => t.resolutionTime).length || 0;

  const satisfactionScore = tickets
    .filter(t => t.satisfaction)
    .reduce((sum, t) => sum + t.satisfaction, 0) / tickets.filter(t => t.satisfaction).length || 0;

  const TicketsView = () => (
    <div className="space-y-4">
      {filteredTickets.map((ticket) => {
        const StatusIcon = statusIcons[ticket.status];
        return (
          <div key={ticket.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <StatusIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{ticket.subject}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{ticket.customer}</span>
                    <span>{ticket.category}</span>
                    <span>{new Date(ticket.createdAt).toLocaleDateString('ar-SA')}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[ticket.priority]}`}>
                  {ticket.priority}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[ticket.status]}`}>
                  {ticket.status}
                </span>
              </div>
            </div>

            <p className="text-gray-600 mb-4">{ticket.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{ticket.assignedTo}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {ticket.resolutionTime ? `${ticket.resolutionTime} ساعة` : 'لم يُحل بعد'}
                  </span>
                </div>
                {ticket.satisfaction && (
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm text-gray-600">{ticket.satisfaction}/5</span>
                  </div>
                )}
              </div>
              <button 
                onClick={() => setSelectedTicket(ticket)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                عرض التفاصيل
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  const CustomersView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredCustomers.map((customer) => (
        <div key={customer.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{customer.name}</h3>
              <p className="text-sm text-gray-600">{customer.company}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${segmentColors[customer.segment]}`}>
              {customer.segment}
            </span>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">عدد التذاكر:</span>
              <span className="text-sm font-medium">{customer.ticketsCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">تم حلها:</span>
              <span className="text-sm font-medium text-green-600">{customer.resolvedCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">متوسط الرضا:</span>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-medium">{customer.avgSatisfaction}/5</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">قيمة العميل:</span>
              <span className="text-sm font-medium">{customer.value.toLocaleString()} ريال</span>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">تحليل السلوك</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">استخدام المنتج:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${customer.behavior.productUsage}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600">{customer.behavior.productUsage}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">التاريخ:</span>
                <span className="text-xs text-gray-900">{customer.behavior.paymentHistory}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">التفاعل:</span>
                <span className="text-xs text-gray-900">{customer.behavior.engagement}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              آخر تواصل: {new Date(customer.lastContact).toLocaleDateString('ar-SA')}
            </span>
            <button 
              onClick={() => setSelectedCustomer(customer)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              عرض التفاصيل
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const AnalyticsView = () => (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي التذاكر</p>
              <p className="text-2xl font-bold text-gray-900">{tickets.length}</p>
            </div>
            <MessageCircle className="h-8 w-8 text-blue-600" />
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 ml-1" />
            <span className="text-sm text-green-600">+8% من الشهر الماضي</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">متوسط وقت الحل</p>
              <p className="text-2xl font-bold text-gray-900">{avgResolutionTime.toFixed(1)}س</p>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-red-500 ml-1" />
            <span className="text-sm text-red-600">+2.3س من الشهر الماضي</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">نقاط الرضا</p>
              <p className="text-2xl font-bold text-gray-900">{satisfactionScore.toFixed(1)}/5</p>
            </div>
            <Star className="h-8 w-8 text-yellow-600" />
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 ml-1" />
            <span className="text-sm text-green-600">+0.2 من الشهر الماضي</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">معدل الحل</p>
              <p className="text-2xl font-bold text-gray-900">
                {((tickets.filter(t => t.status === 'محلول').length / tickets.length) * 100).toFixed(1)}%
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 ml-1" />
            <span className="text-sm text-green-600">+5.2% من الشهر الماضي</span>
          </div>
        </div>
      </div>

      {/* Customer Segmentation */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">توزيع شرائح العملاء</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(
            customers.reduce((acc, customer) => {
              acc[customer.segment] = (acc[customer.segment] || 0) + 1;
              return acc;
            }, {})
          ).map(([segment, count]) => (
            <div key={segment} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{segment}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${segmentColors[segment]}`}>
                  {count}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {((count / customers.length) * 100).toFixed(1)}% من إجمالي العملاء
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">خدمة العملاء</h1>
          <p className="text-gray-600">إدارة طلبات الدعم وتحليل سلوك العملاء</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>تذكرة جديدة</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">مفتوح</p>
              <p className="text-2xl font-bold text-blue-600">
                {tickets.filter(t => t.status === 'مفتوح').length}
              </p>
            </div>
            <MessageCircle className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">قيد المراجعة</p>
              <p className="text-2xl font-bold text-yellow-600">
                {tickets.filter(t => t.status === 'قيد المراجعة').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">محلول</p>
              <p className="text-2xl font-bold text-green-600">
                {tickets.filter(t => t.status === 'محلول').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">عالية الأولوية</p>
              <p className="text-2xl font-bold text-red-600">
                {tickets.filter(t => t.priority === 'عالية').length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي العملاء</p>
              <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
            </div>
            <Users className="h-8 w-8 text-gray-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">العميل الذهبي</p>
              <p className="text-2xl font-bold text-yellow-600">
                {customers.filter(c => c.segment === 'عميل ذهبي').length}
              </p>
            </div>
            <Star className="h-8 w-8 text-yellow-600" />
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
                placeholder={viewMode === 'tickets' ? 'البحث في التذاكر...' : 'البحث في العملاء...'}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {viewMode === 'tickets' && (
              <>
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">جميع الحالات</option>
                  <option value="مفتوح">مفتوح</option>
                  <option value="قيد المراجعة">قيد المراجعة</option>
                  <option value="قيد المتابعة">قيد المتابعة</option>
                  <option value="محلول">محلول</option>
                  <option value="مغلق">مغلق</option>
                </select>
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="all">جميع الأولويات</option>
                  <option value="عالية">عالية</option>
                  <option value="متوسطة">متوسطة</option>
                  <option value="منخفضة">منخفضة</option>
                </select>
              </>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('tickets')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'tickets' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              التذاكر
            </button>
            <button
              onClick={() => setViewMode('customers')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'customers' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              العملاء
            </button>
            <button
              onClick={() => setViewMode('analytics')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'analytics' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              التحليلات
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {viewMode === 'tickets' && <TicketsView />}
        {viewMode === 'customers' && <CustomersView />}
        {viewMode === 'analytics' && <AnalyticsView />}
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{selectedTicket.subject}</h2>
              <button 
                onClick={() => setSelectedTicket(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">الوصف</h3>
                  <p className="text-gray-600">{selectedTicket.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">سجل التفاعلات</h3>
                  <div className="space-y-4">
                    {selectedTicket.history.map((item) => (
                      <div key={item.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.message}</p>
                          <p className="text-sm text-gray-500">{item.user}</p>
                          <p className="text-xs text-gray-400">{new Date(item.timestamp).toLocaleString('ar-SA')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">الردود</h3>
                  <div className="space-y-3">
                    {selectedTicket.responses.map((response) => (
                      <div key={response.id} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-900 mb-2">{response.message}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{response.user}</span>
                          <span>{new Date(response.timestamp).toLocaleString('ar-SA')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">معلومات التذكرة</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">العميل:</span>
                      <span className="font-medium">{selectedTicket.customer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">البريد الإلكتروني:</span>
                      <span className="font-medium">{selectedTicket.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الهاتف:</span>
                      <span className="font-medium">{selectedTicket.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الفئة:</span>
                      <span className="font-medium">{selectedTicket.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الأولوية:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[selectedTicket.priority]}`}>
                        {selectedTicket.priority}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الحالة:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[selectedTicket.status]}`}>
                        {selectedTicket.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">المسؤول:</span>
                      <span className="font-medium">{selectedTicket.assignedTo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">تاريخ الإنشاء:</span>
                      <span className="font-medium">{new Date(selectedTicket.createdAt).toLocaleDateString('ar-SA')}</span>
                    </div>
                  </div>
                </div>

                {selectedTicket.satisfaction && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">تقييم العميل</h3>
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-yellow-400" />
                      <span className="text-lg font-medium">{selectedTicket.satisfaction}/5</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                إلغاء
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                رد
              </button>
              <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                حل المشكلة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{selectedCustomer.name}</h2>
              <button 
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">معلومات العميل</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">الشركة:</span>
                      <span className="font-medium">{selectedCustomer.company}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">البريد الإلكتروني:</span>
                      <span className="font-medium">{selectedCustomer.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الهاتف:</span>
                      <span className="font-medium">{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الشرفة:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${segmentColors[selectedCustomer.segment]}`}>
                        {selectedCustomer.segment}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">قيمة العميل:</span>
                      <span className="font-medium text-green-600">{selectedCustomer.value.toLocaleString()} ريال</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">مدة العلاقة:</span>
                      <span className="font-medium">
                        {Math.floor((new Date() - new Date(selectedCustomer.lifetime)) / (1000 * 60 * 60 * 24 * 30))} شهر
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">إحصائيات الدعم</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{selectedCustomer.ticketsCount}</div>
                      <div className="text-sm text-gray-600">إجمالي التذاكر</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{selectedCustomer.resolvedCount}</div>
                      <div className="text-sm text-gray-600">تم حلها</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{selectedCustomer.avgSatisfaction}/5</div>
                      <div className="text-sm text-gray-600">متوسط الرضا</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{selectedCustomer.behavior.productUsage}%</div>
                      <div className="text-sm text-gray-600">استخدام المنتج</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">تحليل السلوك</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">استخدام المنتج</span>
                        <span className="text-sm font-medium">{selectedCustomer.behavior.productUsage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${selectedCustomer.behavior.productUsage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">تاريخ الدفع:</span>
                      <span className="text-sm font-medium">{selectedCustomer.behavior.paymentHistory}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">مستوى التفاعل:</span>
                      <span className="text-sm font-medium">{selectedCustomer.behavior.engagement}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">آخر تواصل</h3>
                  <p className="text-gray-600">{new Date(selectedCustomer.lastContact).toLocaleDateString('ar-SA')}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                إغلاق
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                إرسال رسالة
              </button>
              <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                إنشاء تذكرة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerService;