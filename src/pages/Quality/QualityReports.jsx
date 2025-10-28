import React, { useState, useEffect } from 'react';
import { 
  FaFileAlt, 
  FaChartLine, 
  FaDownload, 
  FaCalendarAlt,
  FaFilter,
  FaPrint,
  FaFilePdf,
  FaFileExcel,
  FaBarChart,
  FaPieChart,
  FaTrendingUp
} from 'react-icons/fa';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';
import Select from '../../components/Common/Select';
import Table from '../../components/Common/Table';
import { useNotification } from '../../context/NotificationContext';

const QualityReports = () => {
  const { addNotification } = useNotification();
  const [selectedReport, setSelectedReport] = useState('inspection');
  const [dateRange, setDateRange] = useState({
    startDate: '2025-01-01',
    endDate: '2025-12-31'
  });
  const [reportData, setReportData] = useState({
    inspection: [],
    nonConformances: [],
    complaints: [],
    performance: {}
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReportData();
  }, [selectedReport, dateRange]);

  const loadReportData = async () => {
    setLoading(true);
    try {
      // محاكاة تحميل البيانات
      const data = {
        inspection: [
          {
            id: 1,
            period: 'يناير 2025',
            totalInspections: 45,
            passedInspections: 42,
            failedInspections: 3,
            passRate: 93.3
          },
          {
            id: 2,
            period: 'فبراير 2025',
            totalInspections: 38,
            passedInspections: 35,
            failedInspections: 3,
            passRate: 92.1
          },
          {
            id: 3,
            period: 'مارس 2025',
            totalInspections: 52,
            passedInspections: 48,
            failedInspections: 4,
            passRate: 92.3
          }
        ],
        nonConformances: [
          {
            id: 1,
            period: 'يناير 2025',
            totalNC: 8,
            majorNC: 2,
            minorNC: 6,
            closedNC: 7,
            cost: 15000
          },
          {
            id: 2,
            period: 'فبراير 2025',
            totalNC: 12,
            majorNC: 3,
            minorNC: 9,
            closedNC: 10,
            cost: 22000
          },
          {
            id: 3,
            period: 'مارس 2025',
            totalNC: 6,
            majorNC: 1,
            minorNC: 5,
            closedNC: 8,
            cost: 12000
          }
        ],
        complaints: [
          {
            id: 1,
            period: 'يناير 2025',
            totalComplaints: 5,
            resolvedComplaints: 4,
            avgResolutionTime: 7.2,
            customerSatisfaction: 4.1
          },
          {
            id: 2,
            period: 'فبراير 2025',
            totalComplaints: 7,
            resolvedComplaints: 6,
            avgResolutionTime: 6.5,
            customerSatisfaction: 4.3
          },
          {
            id: 3,
            period: 'مارس 2025',
            totalComplaints: 4,
            resolvedComplaints: 4,
            avgResolutionTime: 5.8,
            customerSatisfaction: 4.5
          }
        ],
        performance: {
          overallScore: 94.5,
          trend: '+2.3%',
          inspectionsThisMonth: 52,
          ncClosed: 25,
          complaintsResolved: 14
        }
      };
      
      setReportData(data);
    } catch (error) {
      addNotification('خطأ في تحميل بيانات التقرير', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = (format) => {
    addNotification(`جاري تصدير التقرير بصيغة ${format}`, 'info');
    // هنا سيتم تطبيق منطق التصدير الفعلي
  };

  const renderInspectionReport = () => (
    <div className="space-y-6">
      <Card title="تقرير الفحوصات">
        <Table
          data={reportData.inspection}
          columns={[
            { key: 'period', label: 'الفترة' },
            { key: 'totalInspections', label: 'إجمالي الفحوصات' },
            { key: 'passedInspections', label: 'فحوصات ناجحة' },
            { key: 'failedInspections', label: 'فحوصات فاشلة' },
            { 
              key: 'passRate', 
              label: 'معدل النجاح (%)',
              render: (value) => `${value}%`
            }
          ]}
        />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="توزيع نتائج الفحوصات">
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <FaBarChart className="text-4xl text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">رسم بياني دائري لتوزيع النتائج</p>
            </div>
          </div>
        </Card>

        <Card title="معدل النجاح الشهري">
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <FaTrendingUp className="text-4xl text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">رسم بياني خطي للمعدل</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderNCReport = () => (
    <div className="space-y-6">
      <Card title="تقرير عدم المطابقة">
        <Table
          data={reportData.nonConformances}
          columns={[
            { key: 'period', label: 'الفترة' },
            { key: 'totalNC', label: 'إجمالي NC' },
            { key: 'majorNC', label: 'NC كبيرة' },
            { key: 'minorNC', label: 'NC صغيرة' },
            { key: 'closedNC', label: 'NC مغلقة' },
            { 
              key: 'cost', 
              label: 'التكلفة (ريال)',
              render: (value) => value.toLocaleString()
            }
          ]}
        />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="توزيع عدم المطابقة">
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <FaPieChart className="text-4xl text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">رسم بياني دائري للتوزيع</p>
            </div>
          </div>
        </Card>

        <Card title="تكلفة عدم المطابقة">
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <FaBarChart className="text-4xl text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">رسم بياني للتكاليف</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderComplaintsReport = () => (
    <div className="space-y-6">
      <Card title="تقرير الشكاوى">
        <Table
          data={reportData.complaints}
          columns={[
            { key: 'period', label: 'الفترة' },
            { key: 'totalComplaints', label: 'إجمالي الشكاوى' },
            { key: 'resolvedComplaints', label: 'شكاوى محلولة' },
            { 
              key: 'avgResolutionTime', 
              label: 'متوسط وقت الحل (أيام)',
              render: (value) => `${value} يوم`
            },
            { 
              key: 'customerSatisfaction', 
              label: 'رضا العملاء',
              render: (value) => `${value}/5`
            }
          ]}
        />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="معدل حل الشكاوى">
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <FaChartLine className="text-4xl text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">رسم بياني للمعدل</p>
            </div>
          </div>
        </Card>

        <Card title="رضا العملاء">
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <FaTrendingUp className="text-4xl text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">رسم بياني للتقييمات</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderPerformanceReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="text-center">
            <FaChartLine className="text-3xl mx-auto mb-2 text-white/70" />
            <h3 className="text-white/80 text-sm font-medium">النقاط الإجمالية</h3>
            <p className="text-2xl font-bold">{reportData.performance.overallScore}</p>
            <p className="text-white/70 text-sm">{reportData.performance.trend}</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="text-center">
            <FaFileAlt className="text-3xl mx-auto mb-2 text-white/70" />
            <h3 className="text-white/80 text-sm font-medium">فحوصات الشهر</h3>
            <p className="text-2xl font-bold">{reportData.performance.inspectionsThisMonth}</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="text-center">
            <FaCheckCircle className="text-3xl mx-auto mb-2 text-white/70" />
            <h3 className="text-white/80 text-sm font-medium">NC مغلقة</h3>
            <p className="text-2xl font-bold">{reportData.performance.ncClosed}</p>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="text-center">
            <FaUsers className="text-3xl mx-auto mb-2 text-white/70" />
            <h3 className="text-white/80 text-sm font-medium">شكاوى محلولة</h3>
            <p className="text-2xl font-bold">{reportData.performance.complaintsResolved}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="مؤشرات الأداء الرئيسية">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>معدل نجاح الفحوصات</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '94%'}}></div>
                </div>
                <span className="text-sm font-medium">94%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span>وقت إغلاق عدم المطابقة</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '78%'}}></div>
                </div>
                <span className="text-sm font-medium">78%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span>رضا العملاء</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{width: '86%'}}></div>
                </div>
                <span className="text-sm font-medium">86%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card title="اتجاهات الأداء">
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <FaChartLine className="text-4xl text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">رسم بياني لاتجاهات الأداء</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const reportTypes = [
    { value: 'inspection', label: 'تقرير الفحوصات', icon: <FaClipboardCheck /> },
    { value: 'nonConformances', label: 'تقرير عدم المطابقة', icon: <FaExclamationTriangle /> },
    { value: 'complaints', label: 'تقرير الشكاوى', icon: <FaUsers /> },
    { value: 'performance', label: 'تقرير الأداء العام', icon: <FaChartLine /> }
  ];

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'inspection':
        return renderInspectionReport();
      case 'nonConformances':
        return renderNCReport();
      case 'complaints':
        return renderComplaintsReport();
      case 'performance':
        return renderPerformanceReport();
      default:
        return renderInspectionReport();
    }
  };

  return (
    <div className="space-y-6">
      {/* رأس التقرير */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">تقارير الجودة</h2>
          <p className="text-gray-600">عرض وتحليل بيانات الجودة</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => handleExportReport('PDF')}
          >
            <FaFilePdf className="mr-2" />
            تصدير PDF
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleExportReport('Excel')}
          >
            <FaFileExcel className="mr-2" />
            تصدير Excel
          </Button>
          <Button variant="outline">
            <FaPrint className="mr-2" />
            طباعة
          </Button>
        </div>
      </div>

      {/* إعدادات التقرير */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نوع التقرير
            </label>
            <Select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              options={reportTypes.map(type => ({
                value: type.value,
                label: type.label
              }))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              من تاريخ
            </label>
            <Input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
              icon={<FaCalendarAlt />}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              إلى تاريخ
            </label>
            <Input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
              icon={<FaCalendarAlt />}
            />
          </div>
        </div>
      </Card>

      {/* تبويبات أنواع التقارير */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {reportTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedReport(type.value)}
              className={`
                flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors
                ${selectedReport === type.value
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {type.icon}
              {type.label}
            </button>
          ))}
        </nav>
      </div>

      {/* محتوى التقرير */}
      <div>
        {renderReportContent()}
      </div>
    </div>
  );
};

export default QualityReports;