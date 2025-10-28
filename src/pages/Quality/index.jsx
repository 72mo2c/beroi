import React, { useState, useEffect } from 'react';
import { 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaClipboardCheck, 
  FaChartLine,
  FaCog,
  FaFileAlt,
  FaUsers,
  FaBoxes,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaFilter,
  FaSearch,
  FaDownload,
  FaPrint
} from 'react-icons/fa';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Table from '../../components/Common/Table';
import Modal from '../../components/Common/Modal';
import Input from '../../components/Common/Input';
import Select from '../../components/Common/Select';
import Loading from '../../components/Common/Loading';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const Quality = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [qualityStandards, setQualityStandards] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [nonConformances, setNonConformances] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // إحصائيات لوحة التحكم
  const [dashboardStats, setDashboardStats] = useState({
    totalInspections: 0,
    passedInspections: 0,
    failedInspections: 0,
    pendingInspections: 0,
    totalNonConformances: 0,
    openNonConformances: 0,
    totalComplaints: 0,
    openComplaints: 0,
    qualityScore: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // تحميل بيانات لوحة التحكم
      const stats = {
        totalInspections: 145,
        passedInspections: 132,
        failedInspections: 8,
        pendingInspections: 5,
        totalNonConformances: 23,
        openNonConformances: 7,
        totalComplaints: 15,
        openComplaints: 3,
        qualityScore: 94.5
      };
      setDashboardStats(stats);

      // تحميل بيانات الجداول
      setInspections([
        {
          id: 1,
          inspectionNumber: 'QI-2025-001',
          inspectionType: 'استلام',
          product: 'منتج تجريبي 1',
          inspectionDate: '2025-10-28',
          inspector: 'أحمد محمد',
          status: 'مؤهل',
          result: 'نجح'
        },
        {
          id: 2,
          inspectionNumber: 'QI-2025-002',
          inspectionType: 'إنتاج',
          product: 'منتج تجريبي 2',
          inspectionDate: '2025-10-27',
          inspector: 'فاطمة أحمد',
          status: 'مؤجل',
          result: 'معلق'
        }
      ]);

      setNonConformances([
        {
          id: 1,
          ncNumber: 'NC-2025-001',
          ncType: 'منتج',
          severity: 'متوسط',
          product: 'منتج تجريبي 1',
          reportedDate: '2025-10-26',
          reportedBy: 'محمد علي',
          status: 'مفتوح'
        }
      ]);

      setComplaints([
        {
          id: 1,
          complaintNumber: 'CC-2025-001',
          customer: 'شركة الأمل التجارية',
          complaintType: 'جودة المنتج',
          subject: 'مشكلة في الجودة',
          priority: 'متوسط',
          status: 'جديد',
          reportedDate: '2025-10-25'
        }
      ]);

    } catch (error) {
      addNotification('خطأ في تحميل البيانات', 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white/80 text-sm font-medium">إجمالي الفحوصات</h3>
              <p className="text-3xl font-bold">{dashboardStats.totalInspections}</p>
            </div>
            <FaClipboardCheck className="text-4xl text-white/30" />
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white/80 text-sm font-medium">فحوصات ناجحة</h3>
              <p className="text-3xl font-bold">{dashboardStats.passedInspections}</p>
            </div>
            <FaCheckCircle className="text-4xl text-white/30" />
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white/80 text-sm font-medium">عدم المطابقة</h3>
              <p className="text-3xl font-bold">{dashboardStats.openNonConformances}</p>
            </div>
            <FaExclamationTriangle className="text-4xl text-white/30" />
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white/80 text-sm font-medium">نقاط الجودة</h3>
              <p className="text-3xl font-bold">{dashboardStats.qualityScore}%</p>
            </div>
            <FaChartLine className="text-4xl text-white/30" />
          </div>
        </Card>
      </div>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="إحصائيات الفحوصات">
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">رسم بياني للإحصائيات</p>
          </div>
        </Card>

        <Card title="توجهات الجودة">
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">رسم بياني للتوجهات</p>
          </div>
        </Card>
      </div>

      {/* جداول سريعة */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card 
          title="آخر الفحوصات" 
          action={
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setActiveTab('inspections')}
            >
              عرض الكل
            </Button>
          }
        >
          <Table
            data={inspections.slice(0, 5)}
            columns={[
              { key: 'inspectionNumber', label: 'رقم الفحص' },
              { key: 'result', label: 'النتيجة' },
              { key: 'inspectionDate', label: 'التاريخ' }
            ]}
            size="sm"
          />
        </Card>

        <Card 
          title="آخر الشكاوى" 
          action={
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setActiveTab('complaints')}
            >
              عرض الكل
            </Button>
          }
        >
          <Table
            data={complaints.slice(0, 5)}
            columns={[
              { key: 'complaintNumber', label: 'رقم الشكوى' },
              { key: 'customer', label: 'العميل' },
              { key: 'status', label: 'الحالة' }
            ]}
            size="sm"
          />
        </Card>
      </div>
    </div>
  );

  const renderQualityStandards = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">معايير الجودة</h2>
        <Button onClick={() => setShowAddModal(true)}>
          <FaPlus className="mr-2" />
          إضافة معيار
        </Button>
      </div>

      <Card>
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="البحث..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<FaSearch />}
            />
          </div>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: 'all', label: 'الكل' },
              { value: 'active', label: 'نشط' },
              { value: 'inactive', label: 'غير نشط' }
            ]}
          />
        </div>

        <Table
          data={qualityStandards}
          columns={[
            { key: 'standard_name', label: 'اسم المعيار' },
            { key: 'standard_type', label: 'النوع' },
            { key: 'applicable_to', label: 'ينطبق على' },
            { key: 'status', label: 'الحالة' },
            {
              key: 'actions',
              label: 'الإجراءات',
              render: (value, item) => (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <FaEye />
                  </Button>
                  <Button size="sm" variant="outline">
                    <FaEdit />
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600">
                    <FaTrash />
                  </Button>
                </div>
              )
            }
          ]}
        />
      </Card>
    </div>
  );

  const renderInspections = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">فحوصات الجودة</h2>
        <Button onClick={() => setShowAddModal(true)}>
          <FaPlus className="mr-2" />
          فحص جديد
        </Button>
      </div>

      <Card>
        <Table
          data={inspections}
          columns={[
            { key: 'inspectionNumber', label: 'رقم الفحص' },
            { key: 'inspectionType', label: 'نوع الفحص' },
            { key: 'product', label: 'المنتج' },
            { key: 'inspectionDate', label: 'تاريخ الفحص' },
            { key: 'inspector', label: 'المفحص' },
            { key: 'result', label: 'النتيجة' },
            {
              key: 'actions',
              label: 'الإجراءات',
              render: (value, item) => (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <FaEye />
                  </Button>
                  <Button size="sm" variant="outline">
                    <FaEdit />
                  </Button>
                </div>
              )
            }
          ]}
        />
      </Card>
    </div>
  );

  const renderNonConformances = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">عدم المطابقة</h2>
        <Button onClick={() => setShowAddModal(true)}>
          <FaPlus className="mr-2" />
          عدم مطابقة جديد
        </Button>
      </div>

      <Card>
        <Table
          data={nonConformances}
          columns={[
            { key: 'ncNumber', label: 'رقم عدم المطابقة' },
            { key: 'ncType', label: 'النوع' },
            { key: 'severity', label: 'الخطورة' },
            { key: 'product', label: 'المنتج' },
            { key: 'reportedDate', label: 'تاريخ البلاغ' },
            { key: 'status', label: 'الحالة' },
            {
              key: 'actions',
              label: 'الإجراءات',
              render: (value, item) => (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <FaEye />
                  </Button>
                  <Button size="sm" variant="outline">
                    <FaEdit />
                  </Button>
                </div>
              )
            }
          ]}
        />
      </Card>
    </div>
  );

  const renderComplaints = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">شكاوى العملاء</h2>
        <Button onClick={() => setShowAddModal(true)}>
          <FaPlus className="mr-2" />
          شكوى جديدة
        </Button>
      </div>

      <Card>
        <Table
          data={complaints}
          columns={[
            { key: 'complaintNumber', label: 'رقم الشكوى' },
            { key: 'customer', label: 'العميل' },
            { key: 'complaintType', label: 'نوع الشكوى' },
            { key: 'priority', label: 'الأولوية' },
            { key: 'status', label: 'الحالة' },
            { key: 'reportedDate', label: 'تاريخ البلاغ' },
            {
              key: 'actions',
              label: 'الإجراءات',
              render: (value, item) => (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <FaEye />
                  </Button>
                  <Button size="sm" variant="outline">
                    <FaEdit />
                  </Button>
                </div>
              )
            }
          ]}
        />
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">إعدادات الجودة</h2>
      
      <Card title="إعدادات عامة">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              معيار الجودة الافتراضي
            </label>
            <Select
              options={[
                { value: 'iso9001', label: 'ISO 9001' },
                { value: 'iso14001', label: 'ISO 14001' },
                { value: 'custom', label: 'مخصص' }
              ]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              طريقة أخذ العينات
            </label>
            <Select
              options={[
                { value: 'random', label: 'عشوائي' },
                { value: 'systematic', label: 'منهجي' },
                { value: 'stratified', label: 'طبقي' }
              ]}
            />
          </div>
        </div>
      </Card>

      <Card title="تنبيهات الجودة">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>تنبيه عند فشل الفحص</span>
            <input type="checkbox" className="toggle" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span>تنبيه عند ارتفاع معدل العيوب</span>
            <input type="checkbox" className="toggle" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span>تنبيه عند عدم إغلاق الشكاوى</span>
            <input type="checkbox" className="toggle" />
          </div>
        </div>
      </Card>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">تقارير الجودة</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <FaFileAlt className="mr-2" />
            تصدير PDF
          </Button>
          <Button variant="outline">
            <FaDownload className="mr-2" />
            تصدير Excel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="text-center">
            <FaChartLine className="text-3xl mx-auto mb-2 text-white/70" />
            <h3 className="text-white/80 text-sm font-medium">فحوصات هذا الشهر</h3>
            <p className="text-2xl font-bold">52</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="text-center">
            <FaCheckCircle className="text-3xl mx-auto mb-2 text-white/70" />
            <h3 className="text-white/80 text-sm font-medium">معدل النجاح</h3>
            <p className="text-2xl font-bold">94.5%</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <div className="text-center">
            <FaExclamationTriangle className="text-3xl mx-auto mb-2 text-white/70" />
            <h3 className="text-white/80 text-sm font-medium">NC مفتوحة</h3>
            <p className="text-2xl font-bold">7</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="text-center">
            <FaUsers className="text-3xl mx-auto mb-2 text-white/70" />
            <h3 className="text-white/80 text-sm font-medium">رضا العملاء</h3>
            <p className="text-2xl font-bold">4.3/5</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card 
          title="تقرير الفحوصات" 
          action={
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setActiveTab('inspections')}
            >
              عرض التفاصيل
            </Button>
          }
        >
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <FaChartLine className="text-4xl text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">رسم بياني لنتائج الفحوصات</p>
            </div>
          </div>
        </Card>

        <Card 
          title="تقرير عدم المطابقة" 
          action={
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setActiveTab('nonConformances')}
            >
              عرض التفاصيل
            </Button>
          }
        >
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <FaExclamationTriangle className="text-4xl text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">رسم بياني لعدم المطابقة</p>
            </div>
          </div>
        </Card>
      </div>

      <Card title="التقارير المتاحة">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <FaFileAlt className="text-blue-500" />
              <h4 className="font-medium">تقرير الفحوصات</h4>
            </div>
            <p className="text-sm text-gray-600">تحليل مفصل لنتائج الفحوصات</p>
          </div>
          
          <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <FaExclamationTriangle className="text-red-500" />
              <h4 className="font-medium">تقرير عدم المطابقة</h4>
            </div>
            <p className="text-sm text-gray-600">متابعة حالات عدم المطابقة</p>
          </div>
          
          <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <FaUsers className="text-purple-500" />
              <h4 className="font-medium">تقرير الشكاوى</h4>
            </div>
            <p className="text-sm text-gray-600">تحليل شكاوى العملاء</p>
          </div>
          
          <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <FaChartLine className="text-green-500" />
              <h4 className="font-medium">تقرير الأداء</h4>
            </div>
            <p className="text-sm text-gray-600">مؤشرات الأداء العامة</p>
          </div>
        </div>
      </Card>
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: <FaChartLine /> },
    { id: 'standards', label: 'معايير الجودة', icon: <FaClipboardCheck /> },
    { id: 'inspections', label: 'الفحوصات', icon: <FaCheckCircle /> },
    { id: 'nonConformances', label: 'عدم المطابقة', icon: <FaExclamationTriangle /> },
    { id: 'complaints', label: 'الشكاوى', icon: <FaUsers /> },
    { id: 'reports', label: 'التقارير', icon: <FaFileAlt /> },
    { id: 'settings', label: 'الإعدادات', icon: <FaCog /> }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* رأس الصفحة */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">إدارة الجودة</h1>
          <p className="text-gray-600 mt-1">إدارة ومراقبة جودة المنتجات والخدمات</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FaDownload className="mr-2" />
            تصدير
          </Button>
          <Button variant="outline">
            <FaPrint className="mr-2" />
            طباعة
          </Button>
        </div>
      </div>

      {/* شريط التبويبات */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* محتوى التبويبات */}
      <div className="min-h-[600px]">
        {loading ? (
          <Loading />
        ) : (
          <>
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'standards' && renderQualityStandards()}
            {activeTab === 'inspections' && renderInspections()}
            {activeTab === 'nonConformances' && renderNonConformances()}
            {activeTab === 'complaints' && renderComplaints()}
            {activeTab === 'reports' && renderReports()}
            {activeTab === 'settings' && renderSettings()}
          </>
        )}
      </div>

      {/* نافذة إضافة/تعديل */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={selectedItem ? 'تعديل' : 'إضافة جديد'}
        size="lg"
      >
        <div className="space-y-4">
          <p>نموذج إضافة/تعديل البيانات</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              إلغاء
            </Button>
            <Button onClick={() => setShowAddModal(false)}>
              حفظ
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Quality;