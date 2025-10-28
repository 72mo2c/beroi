// ======================================
// Settings Module Index - وحدة الإعدادات
// ======================================

// إعادة تصدير جميع مكونات الوحدة
export { default as AddUser } from './AddUser';
export { default as Permissions } from './Permissions';
export { default as Support } from './Support';
export { default as SystemSettings } from './SystemSettings';
export { default as Integrations } from './Integrations';

// مكون رئيسي للوحدة
const SettingsIndex = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">وحدة الإعدادات</h1>
      <p className="text-gray-600">مرحباً بك في وحدة إدارة الإعدادات</p>
    </div>
  );
};

export default SettingsIndex;