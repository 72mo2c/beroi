// ======================================
// Warehouses Module Index - وحدة المخازن
// ======================================

// إعادة تصدير جميع مكونات الوحدة
export { default as AddProduct } from './AddProduct';
export { default as ManageProducts } from './ManageProducts';
export { default as AddWarehouse } from './AddWarehouse';
export { default as ManageWarehouses } from './ManageWarehouses';
export { default as ManageCategories } from './ManageCategories';
export { default as Transfer } from './Transfer';
export { default as Inventory } from './Inventory';

// مكون رئيسي للوحدة (إذا كان مطلوباً)
const WarehousesIndex = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">وحدة المخازن</h1>
      <p className="text-gray-600">مرحباً بك في وحدة إدارة المخازن</p>
    </div>
  );
};

export default WarehousesIndex;