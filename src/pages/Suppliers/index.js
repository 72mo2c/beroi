// ======================================
// Suppliers Module Index - وحدة الموردين
// ======================================

// إعادة تصدير جميع مكونات الوحدة
export { default as AddSupplier } from './AddSupplier';
export { default as ManageSuppliers } from './ManageSuppliers';

// مكون رئيسي للوحدة
const SuppliersIndex = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">وحدة الموردين</h1>
      <p className="text-gray-600">مرحباً بك في وحدة إدارة الموردين</p>
    </div>
  );
};

export default SuppliersIndex;