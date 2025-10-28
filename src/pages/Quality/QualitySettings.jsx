import React, { useState, useEffect } from 'react';
import { 
  FaCog, 
  FaSave, 
  FaBell, 
  FaShieldAlt, 
  FaClipboardCheck,
  FaExclamationTriangle,
  FaCheckCircle,
  FaDatabase,
  FaChartLine,
  FaUserCog,
  FaToggleOn,
  FaToggleOff,
  FaCertificate,
  FaTools,
  FaFileAlt
} from 'react-icons/fa';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';
import Select from '../../components/Common/Select';
import Loading from '../../components/Common/Loading';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';

const QualitySettings = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('general');

  // إعدادات عامة
  const [generalSettings, setGeneralSettings] = useState({
    defaultQualityStandard: 'iso9001',
    samplingMethod: 'random',
    autoCloseDays: 30,
    requireApprovalForResults: true,
    allowConditionalPass: true,
    defaultInspectionFrequency: 'daily'
  });

  // إعدادات التنبيهات
  const [alertSettings, setAlertSettings] = useState({
    alertOnFailedInspection: true,
    alertOnHighDefectRate: true,
    alertOnOpenNC: true,
    alertOnOverdueComplaints: true,
    alertOnSatisfactionDrop: true,
    alertEmailRecipients: [],
    alertSMSRecipients: []
  });

  // إعدادات التقارير
  const [reportSettings, setReportSettings] = useState({
    autoGenerateReports: true,
    reportFrequency: 'weekly',
    includeCharts: true,
    includeTables: true,
    defaultReportPeriod: 'monthly',
    exportFormats: ['pdf', 'excel'],
    reportRecipients: []
  });

  // إعدادات الأمان
  const [securitySettings, setSecuritySettings] = useState({
    requireSignatureForResults: true,
    allowResultModification: false,
    auditTrail: true,
    dataEncryption: true,
    backupFrequency: 'daily'
  });

  // قائمة المعايير المتاحة
  const qualityStandards = [
    { value: 'iso9001', label: 'ISO 9001' },
    { value: 'iso14001', label: 'ISO 14001' },
    { value: 'iso45001', label: 'ISO 45001' },
    { value: 'custom', label: 'مخصص' }
  ];

  // طرق أخذ العينات
  const samplingMethods = [
    { value: 'random', label: 'عشوائي' },
    { value: 'systematic', label: 'منهجي' },
    { value: 'stratified', label: 'طبقي' },
    { value: 'cluster', label: 'عنقودي' }
  ];

  // تكرارات التقارير
  const reportFrequencies = [
    { value: 'daily', label: 'يومي' },
    { value: 'weekly', label: 'أسبوعي' },
    { value: 'monthly', label: 'شهري' },
    { value: 'quarterly', label: 'ربع سنوي' }
  ];

  // فترات التقارير الافتراضية
  const reportPeriods = [
    { value: 'daily', label: 'يومي' },
    { value: 'weekly', label: 'أسبوعي' },
    { value: 'monthly', label: 'شهري' },
    { value: 'quarterly', label: 'ربع سنوي' },
    { value: 'yearly', label: 'سنوي' }
  ];

  // تنسيقات التصدير
  const exportFormats = [
    { value: 'pdf', label: 'PDF' },
    { value: 'excel', label: 'Excel' },
    { value: 'csv', label: 'CSV' },
    { value: 'word', label: 'Word' }
  ];

  const handleSave = async (settingsType) => {
    setLoading(true);
    try {
      // هنا سيتم حفظ الإعدادات في قاعدة البيانات
      await new Promise(resolve => setTimeout(resolve, 1000)); // محاكاة API call
      
      addNotification(`تم حفظ إعدادات ${getSettingsTypeName(settingsType)} بنجاح`, 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      addNotification('خطأ في حفظ الإعدادات', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getSettingsTypeName = (type) => {
    const names = {
      general: 'العامة',
      alerts: 'التنبيهات',
      reports: 'التقارير',
      security: 'الأمان'
    };
    return names[type] || type;
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">الإعدادات العامة</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                معيار الجودة الافتراضي
              </label>
              <Select
                value={generalSettings.defaultQualityStandard}
                onChange={(e) => setGeneralSettings({
                  ...generalSettings, 
                  defaultQualityStandard: e.target.value
                })}
                options={qualityStandards}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                طريقة أخذ العينات
              </label>
              <Select
                value={generalSettings.samplingMethod}
                onChange={(e) => setGeneralSettings({
                  ...generalSettings, 
                  samplingMethod: e.target.value
                })}
                options={samplingMethods}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تكرار الفحص الافتراضي
              </label>
              <Select
                value={generalSettings.defaultInspectionFrequency}
                onChange={(e) => setGeneralSettings({
                  ...generalSettings, 
                  defaultInspectionFrequency: e.target.value
                })}
                options={reportPeriods}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عدد الأيام للإغلاق التلقائي
              </label>
              <Input
                type="number"
                value={generalSettings.autoCloseDays}
                onChange={(e) => setGeneralSettings({
                  ...generalSettings, 
                  autoCloseDays: parseInt(e.target.value) || 0
                })}
                min="1"
                max="365"
              />
              <p className="text-xs text-gray-500 mt-1">
                عدد الأيام بعد которых يتم إغلاق الشكاوى تلقائياً
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">طلب موافقة على النتائج</span>
                <button
                  type="button"
                  onClick={() => setGeneralSettings({
                    ...generalSettings,
                    requireApprovalForResults: !generalSettings.requireApprovalForResults
                  })}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    generalSettings.requireApprovalForResults 
                      ? 'bg-orange-600' 
                      : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      generalSettings.requireApprovalForResults 
                        ? 'translate-x-5' 
                        : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">السماح بالنتيجة المشروطة</span>
                <button
                  type="button"
                  onClick={() => setGeneralSettings({
                    ...generalSettings,
                    allowConditionalPass: !generalSettings.allowConditionalPass
                  })}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    generalSettings.allowConditionalPass 
                      ? 'bg-orange-600' 
                      : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      generalSettings.allowConditionalPass 
                        ? 'translate-x-5' 
                        : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={() => handleSave('general')}
          disabled={loading}
        >
          {loading ? 'جاري الحفظ...' : 'حفظ الإعدادات العامة'}
        </Button>
      </div>
    </div>
  );

  const renderAlertSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">إعدادات التنبيهات</h3>
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <FaExclamationTriangle className="text-yellow-400 mt-0.5" />
              <div className="ml-3">
                <h4 className="text-sm font-medium text-yellow-800">تنبيهات الجودة</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  قم بتفعيل التنبيهات التي تريد الحصول عليها لضمان متابعة جودة المنتجات والخدمات
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">تنبيهات الفحوصات</h4>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">تنبيه عند فشل الفحص</span>
                <button
                  type="button"
                  onClick={() => setAlertSettings({
                    ...alertSettings,
                    alertOnFailedInspection: !alertSettings.alertOnFailedInspection
                  })}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    alertSettings.alertOnFailedInspection 
                      ? 'bg-orange-600' 
                      : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      alertSettings.alertOnFailedInspection 
                        ? 'translate-x-5' 
                        : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">تنبيه عند ارتفاع معدل العيوب</span>
                <button
                  type="button"
                  onClick={() => setAlertSettings({
                    ...alertSettings,
                    alertOnHighDefectRate: !alertSettings.alertOnHighDefectRate
                  })}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    alertSettings.alertOnHighDefectRate 
                      ? 'bg-orange-600' 
                      : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      alertSettings.alertOnHighDefectRate 
                        ? 'translate-x-5' 
                        : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">تنبيهات عدم المطابقة والشكاوى</h4>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">تنبيه عند عدم إغلاق عدم المطابقة</span>
                <button
                  type="button"
                  onClick={() => setAlertSettings({
                    ...alertSettings,
                    alertOnOpenNC: !alertSettings.alertOnOpenNC
                  })}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    alertSettings.alertOnOpenNC 
                      ? 'bg-orange-600' 
                      : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      alertSettings.alertOnOpenNC 
                        ? 'translate-x-5' 
                        : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">تنبيه عند تجاوز وقت معالجة الشكاوى</span>
                <button
                  type="button"
                  onClick={() => setAlertSettings({
                    ...alertSettings,
                    alertOnOverdueComplaints: !alertSettings.alertOnOverdueComplaints
                  })}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    alertSettings.alertOnOverdueComplaints 
                      ? 'bg-orange-600' 
                      : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      alertSettings.alertOnOverdueComplaints 
                        ? 'translate-x-5' 
                        : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">تنبيه عند انخفاض رضا العملاء</span>
                <button
                  type="button"
                  onClick={() => setAlertSettings({
                    ...alertSettings,
                    alertOnSatisfactionDrop: !alertSettings.alertOnSatisfactionDrop
                  })}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    alertSettings.alertOnSatisfactionDrop 
                      ? 'bg-orange-600' 
                      : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      alertSettings.alertOnSatisfactionDrop 
                        ? 'translate-x-5' 
                        : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={() => handleSave('alerts')}
          disabled={loading}
        >
          {loading ? 'جاري الحفظ...' : 'حفظ إعدادات التنبيهات'}
        </Button>
      </div>
    </div>
  );

  const renderReportSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">إعدادات التقارير</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تكرار إنشاء التقارير
              </label>
              <Select
                value={reportSettings.reportFrequency}
                onChange={(e) => setReportSettings({
                  ...reportSettings, 
                  reportFrequency: e.target.value
                })}
                options={reportFrequencies}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                فترة التقرير الافتراضية
              </label>
              <Select
                value={reportSettings.defaultReportPeriod}
                onChange={(e) => setReportSettings({
                  ...reportSettings, 
                  defaultReportPeriod: e.target.value
                })}
                options={reportPeriods}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تنسيقات التصدير
              </label>
              <div className="space-y-2">
                {exportFormats.map((format) => (
                  <div key={format.value} className="flex items-center">
                    <input
                      type="checkbox"
                      id={format.value}
                      checked={reportSettings.exportFormats.includes(format.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setReportSettings({
                            ...reportSettings,
                            exportFormats: [...reportSettings.exportFormats, format.value]
                          });
                        } else {
                          setReportSettings({
                            ...reportSettings,
                            exportFormats: reportSettings.exportFormats.filter(f => f !== format.value)
                          });
                        }
                      }}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <label htmlFor={format.value} className="mr-2 text-sm text-gray-700">
                      {format.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">خيارات التقرير</h4>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">إنشاء التقارير تلقائياً</span>
              <button
                type="button"
                onClick={() => setReportSettings({
                  ...reportSettings,
                  autoGenerateReports: !reportSettings.autoGenerateReports
                })}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  reportSettings.autoGenerateReports 
                    ? 'bg-orange-600' 
                    : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    reportSettings.autoGenerateReports 
                      ? 'translate-x-5' 
                      : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">تضمين الرسوم البيانية</span>
              <button
                type="button"
                onClick={() => setReportSettings({
                  ...reportSettings,
                  includeCharts: !reportSettings.includeCharts
                })}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  reportSettings.includeCharts 
                    ? 'bg-orange-600' 
                    : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    reportSettings.includeCharts 
                      ? 'translate-x-5' 
                      : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">تضمين الجداول</span>
              <button
                type="button"
                onClick={() => setReportSettings({
                  ...reportSettings,
                  includeTables: !reportSettings.includeTables
                })}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  reportSettings.includeTables 
                    ? 'bg-orange-600' 
                    : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    reportSettings.includeTables 
                      ? 'translate-x-5' 
                      : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={() => handleSave('reports')}
          disabled={loading}
        >
          {loading ? 'جاري الحفظ...' : 'حفظ إعدادات التقارير'}
        </Button>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">إعدادات الأمان</h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <FaShieldAlt className="text-red-400 mt-0.5" />
            <div className="ml-3">
              <h4 className="text-sm font-medium text-red-800">إعدادات الأمان الحرجة</h4>
              <p className="text-sm text-red-700 mt-1">
                يرجى توخي الحذر عند تغيير إعدادات الأمان والتأكد من تأثيرها على العمليات
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">ضوابط البيانات</h4>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">طلب التوقيع على النتائج</span>
              <button
                type="button"
                onClick={() => setSecuritySettings({
                  ...securitySettings,
                  requireSignatureForResults: !securitySettings.requireSignatureForResults
                })}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  securitySettings.requireSignatureForResults 
                    ? 'bg-orange-600' 
                    : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    securitySettings.requireSignatureForResults 
                      ? 'translate-x-5' 
                      : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">السماح بتعديل النتائج</span>
              <button
                type="button"
                onClick={() => setSecuritySettings({
                  ...securitySettings,
                  allowResultModification: !securitySettings.allowResultModification
                })}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  securitySettings.allowResultModification 
                    ? 'bg-red-600' 
                    : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    securitySettings.allowResultModification 
                      ? 'translate-x-5' 
                      : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">سجل المراجعة</span>
              <button
                type="button"
                onClick={() => setSecuritySettings({
                  ...securitySettings,
                  auditTrail: !securitySettings.auditTrail
                })}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  securitySettings.auditTrail 
                    ? 'bg-orange-600' 
                    : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    securitySettings.auditTrail 
                      ? 'translate-x-5' 
                      : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">تشفير البيانات</span>
              <button
                type="button"
                onClick={() => setSecuritySettings({
                  ...securitySettings,
                  dataEncryption: !securitySettings.dataEncryption
                })}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  securitySettings.dataEncryption 
                    ? 'bg-orange-600' 
                    : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    securitySettings.dataEncryption 
                      ? 'translate-x-5' 
                      : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">النسخ الاحتياطي</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تكرار النسخ الاحتياطي
              </label>
              <Select
                value={securitySettings.backupFrequency}
                onChange={(e) => setSecuritySettings({
                  ...securitySettings, 
                  backupFrequency: e.target.value
                })}
                options={[
                  { value: 'hourly', label: 'كل ساعة' },
                  { value: 'daily', label: 'يومي' },
                  { value: 'weekly', label: 'أسبوعي' },
                  { value: 'monthly', label: 'شهري' }
                ]}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center">
                <FaDatabase className="text-blue-400 ml-2" />
                <span className="text-sm text-blue-800">
                  آخر نسخة احتياطية: لم يتم النسخ بعد
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={() => handleSave('security')}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700"
        >
          {loading ? 'جاري الحفظ...' : 'حفظ إعدادات الأمان'}
        </Button>
      </div>
    </div>
  );

  const sections = [
    { id: 'general', label: 'عامة', icon: <FaCog /> },
    { id: 'alerts', label: 'تنبيهات', icon: <FaBell /> },
    { id: 'reports', label: 'تقارير', icon: <FaFileAlt /> },
    { id: 'security', label: 'أمان', icon: <FaShieldAlt /> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">إعدادات الجودة</h2>
          <p className="text-gray-600 mt-1">إعداد وتخصيص وحدة إدارة الجودة</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* قائمة الأقسام */}
        <div className="lg:col-span-1">
          <Card>
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`
                    w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                    ${activeSection === section.id
                      ? 'bg-orange-100 text-orange-700 border-r-2 border-orange-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <span className="ml-3">{section.icon}</span>
                  {section.label}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* محتوى الإعدادات */}
        <div className="lg:col-span-3">
          <Card>
            {activeSection === 'general' && renderGeneralSettings()}
            {activeSection === 'alerts' && renderAlertSettings()}
            {activeSection === 'reports' && renderReportSettings()}
            {activeSection === 'security' && renderSecuritySettings()}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QualitySettings;