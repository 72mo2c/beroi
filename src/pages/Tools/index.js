// ======================================
// Tools Module Index - وحدة الأدوات
// ======================================

// إعادة تصدير جميع مكونات الوحدة
export { default as FixNegativeQuantities } from './FixNegativeQuantities';

// مكون رئيسي للوحدة
const ToolsIndex = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">وحدة الأدوات</h1>
      <p className="text-gray-600">مرحباً بك في وحدة أدوات النظام</p>
    </div>
  );
};

export default ToolsIndex;