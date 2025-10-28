import React, { useState, useEffect } from 'react';
import { 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaClipboardCheck, 
  FaChartLine,
  FaEye,
  FaPlus
} from 'react-icons/fa';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Table from '../../components/Common/Table';
import Loading from '../../components/Common/Loading';
import { useNotification } from '../../context/NotificationContext';
import qualityService from '../../services/qualityService';
import { useAuth } from '../../context/AuthContext';

const QualityDashboard = ({ onNavigate }) => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);
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
  const [recentInspections, setRecentInspections] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    if (!user?.organization_id) return;

    setLoading(true);
    try {
      // تحميل الإحصائيات
      const stats = await qualityService.getDashboardStats(user.organization_id);
      setDashboardStats(stats);

      // تحميل آخر الفحوصات
      const inspections = await qualityService.getInspections(user.organization_id);
      setRecentInspections(inspections.slice(0, 5));

      // تحميل آخر الشكاوى
      const complaints = await qualityService.getComplaints(user.organization_id);
      setRecentComplaints(complaints.slice(0, 5));

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      addNotification('خطأ في تحميل بيانات لوحة التحكم', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white/80 text-sm font-medium">إجمالي الفحوصات</h3>
              <p className="text-3xl font-bold">{dashboardStats.totalInspections}</p>
              <p className="text-white/70 text-xs mt-1">
                {dashboardStats.pendingInspections} معلقة
              </p>
            </div>
            <FaClipboardCheck className="text-4xl text-white/30" />
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white/80 text-sm font-medium">فحوصات ناجحة</h3>
              <p className="text-3xl font-bold">{dashboardStats.passedInspections}</p>
              <p className="text-white/70 text-xs mt-1">
                {dashboardStats.totalInspections > 0 
                  ? Math.round((dashboardStats.passedInspections / dashboardStats.totalInspections) * 100)
                  : 0}% نسبة النجاح
              </p>
            </div>
            <FaCheckCircle className="text-4xl text-white/30" />
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white/80 text-sm font-medium">عدم المطابقة</h3>
              <p className="text-3xl font-bold">{dashboardStats.openNonConformances}</p>
              <p className="text-white/70 text-xs mt-1">
                من أصل {dashboardStats.totalNonConformances}
              </p>
            </div>
            <FaExclamationTriangle className="text-4xl text-white/30" />
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white/80 text-sm font-medium">نقاط الجودة</h3>
              <p className="text-3xl font-bold">{dashboardStats.qualityScore}%</p>
              <p className="text-white/70 text-xs mt-1">
                {dashboardStats.openComplaints} شكوى مفتوحة
              </p>
            </div>
            <FaChartLine className="text-4xl text-white/30" />
          </div>
        </Card>
      </div>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="توزيع نتائج الفحوصات">
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <FaChartLine className="text-4xl text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">رسم بياني دائري لتوزيع النتائج</p>
              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="w-4 h-4 bg-green-500 rounded mx-auto mb-1"></div>
                  <span>ناجحة: {dashboardStats.passedInspections}</span>
                </div>
                <div className="text-center">
                  <div className="w-4 h-4 bg-red-500 rounded mx-auto mb-1"></div>
                  <span>فاشلة: {dashboardStats.failedInspections}</span>
                </div>
                <div className="text-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded mx-auto mb-1"></div>
                  <span>معلقة: {dashboardStats.pendingInspections}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card title="اتجاهات الجودة الشهرية">
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <FaChartLine className="text-4xl text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">رسم بياني خطي للتوجهات</p>
              <p className="text-sm text-gray-400 mt-2">
                متوسط نقاط الجودة خلال آخر 6 أشهر
              </p>
            </div>
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
              onClick={() => onNavigate('inspections')}
            >
              عرض الكل
            </Button>
          }
        >
          {recentInspections.length > 0 ? (
            <Table
              data={recentInspections}
              columns={[
                { 
                  key: 'inspection_number', 
                  label: 'رقم الفحص',
                  render: (value) => (
                    <span className="font-mono text-sm">{value}</span>
                  )
                },
                { 
                  key: 'result', 
                  label: 'النتيجة',
                  render: (value) => {
                    const colors = {
                      'نجح': 'text-green-600 bg-green-50',
                      'فشل': 'text-red-600 bg-red-50',
                      'معلق': 'text-yellow-600 bg-yellow-50'
                    };
                    return (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        colors[value] || 'text-gray-600 bg-gray-50'
                      }`}>
                        {value || 'غير محدد'}
                      </span>
                    );
                  }
                },
                { 
                  key: 'inspection_date', 
                  label: 'التاريخ',
                  render: (value) => (
                    <span className="text-sm text-gray-600">
                      {value ? new Date(value).toLocaleDateString('ar-SA') : '-'}
                    </span>
                  )
                }
              ]}
              size="sm"
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FaClipboardCheck className="text-3xl mx-auto mb-2 opacity-50" />
              <p>لا توجد فحوصات حديثة</p>
            </div>
          )}
        </Card>

        <Card 
          title="آخر الشكاوى" 
          action={
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onNavigate('complaints')}
            >
              عرض الكل
            </Button>
          }
        >
          {recentComplaints.length > 0 ? (
            <Table
              data={recentComplaints}
              columns={[
                { 
                  key: 'complaint_number', 
                  label: 'رقم الشكوى',
                  render: (value) => (
                    <span className="font-mono text-sm">{value}</span>
                  )
                },
                { 
                  key: 'customer_name', 
                  label: 'العميل',
                  render: (value, item) => (
                    <span className="text-sm">{item.customers?.name || 'غير محدد'}</span>
                  )
                },
                { 
                  key: 'status', 
                  label: 'الحالة',
                  render: (value) => {
                    const colors = {
                      'new': 'text-blue-600 bg-blue-50',
                      'assigned': 'text-yellow-600 bg-yellow-50',
                      'investigating': 'text-purple-600 bg-purple-50',
                      'resolved': 'text-green-600 bg-green-50',
                      'closed': 'text-gray-600 bg-gray-50'
                    };
                    const statusLabels = {
                      'new': 'جديد',
                      'assigned': 'محدد',
                      'investigating': 'قيد التحقيق',
                      'resolved': 'محلول',
                      'closed': 'مغلق'
                    };
                    return (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        colors[value] || 'text-gray-600 bg-gray-50'
                      }`}>
                        {statusLabels[value] || value || 'غير محدد'}
                      </span>
                    );
                  }
                }
              ]}
              size="sm"
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FaExclamationTriangle className="text-3xl mx-auto mb-2 opacity-50" />
              <p>لا توجد شكاوى حديثة</p>
            </div>
          )}
        </Card>
      </div>

      {/* معلومات إضافية */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="إجراءات سريعة">
          <div className="space-y-3">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => onNavigate('inspections')}
            >
              <FaPlus className="mr-2" />
              فحص جودة جديد
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => onNavigate('nonConformances')}
            >
              <FaExclamationTriangle className="mr-2" />
              تقرير عدم مطابقة
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => onNavigate('complaints')}
            >
              <FaEye className="mr-2" />
              عرض الشكاوى
            </Button>
          </div>
        </Card>

        <Card title="تنبيهات الجودة">
          <div className="space-y-3">
            {dashboardStats.pendingInspections > 0 && (
              <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                <FaExclamationTriangle className="text-yellow-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    {dashboardStats.pendingInspections} فحص معلق
                  </p>
                  <p className="text-xs text-yellow-600">يتطلب المراجعة</p>
                </div>
              </div>
            )}
            
            {dashboardStats.openNonConformances > 0 && (
              <div className="flex items-center p-3 bg-red-50 rounded-lg">
                <FaExclamationTriangle className="text-red-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    {dashboardStats.openNonConformances} عدم مطابقة مفتوح
                  </p>
                  <p className="text-xs text-red-600">يتطلب الإغلاق</p>
                </div>
              </div>
            )}

            {dashboardStats.openComplaints > 0 && (
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <FaExclamationTriangle className="text-blue-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    {dashboardStats.openComplaints} شكوى مفتوحة
                  </p>
                  <p className="text-xs text-blue-600">تحتاج للمتابعة</p>
                </div>
              </div>
            )}

            {dashboardStats.openNonConformances === 0 && 
             dashboardStats.openComplaints === 0 && 
             dashboardStats.pendingInspections === 0 && (
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <FaCheckCircle className="text-green-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    جميع المهام محدثة
                  </p>
                  <p className="text-xs text-green-600">لا توجد تنبيهات</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card title="مؤشرات الأداء">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">معدل نجاح الفحوصات</span>
                <span className="text-sm font-medium">
                  {dashboardStats.totalInspections > 0 
                    ? Math.round((dashboardStats.passedInspections / dashboardStats.totalInspections) * 100)
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${dashboardStats.totalInspections > 0 
                      ? (dashboardStats.passedInspections / dashboardStats.totalInspections) * 100 
                      : 0}%` 
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">معدل إغلاق الشكاوى</span>
                <span className="text-sm font-medium">
                  {dashboardStats.totalComplaints > 0 
                    ? Math.round(((dashboardStats.totalComplaints - dashboardStats.openComplaints) / dashboardStats.totalComplaints) * 100)
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${dashboardStats.totalComplaints > 0 
                      ? ((dashboardStats.totalComplaints - dashboardStats.openComplaints) / dashboardStats.totalComplaints) * 100 
                      : 0}%` 
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">معدل إغلاق عدم المطابقة</span>
                <span className="text-sm font-medium">
                  {dashboardStats.totalNonConformances > 0 
                    ? Math.round(((dashboardStats.totalNonConformances - dashboardStats.openNonConformances) / dashboardStats.totalNonConformances) * 100)
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${dashboardStats.totalNonConformances > 0 
                      ? ((dashboardStats.totalNonConformances - dashboardStats.openNonConformances) / dashboardStats.totalNonConformances) * 100 
                      : 0}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QualityDashboard;