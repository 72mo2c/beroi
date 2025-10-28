// ======================================
// Integrations Module Index - وحدة الربط
// ======================================

// إعادة تصدير جميع مكونات الوحدة
export { default as ExternalPlatforms } from './ExternalPlatforms';
export { default as WhatsAppBusiness } from './WhatsAppBusiness';

// مكون رئيسي للوحدة
const IntegrationsIndex = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">وحدة الربط</h1>
      <p className="text-gray-600">مرحباً بك في وحدة إدارة الربط مع الأنظمة الخارجية</p>
    </div>
  );
};

export default IntegrationsIndex;