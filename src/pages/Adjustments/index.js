// ======================================
// Adjustments Module Index - وحدة التسويات
// ======================================

// إعادة تصدير جميع مكونات الوحدة
export { default as QuantityAdjustment } from './QuantityAdjustment';
export { default as ValueAdjustment } from './ValueAdjustment';
export { default as DamagedWriteOff } from './DamagedWriteOff';
export { default as CustomerBalanceAdjustment } from './CustomerBalanceAdjustment';
export { default as SupplierBalanceAdjustment } from './SupplierBalanceAdjustment';
export { default as TreasuryAdjustment } from './TreasuryAdjustment';
export { default as AdjustmentEntries } from './AdjustmentEntries';
export { default as AdjustmentHistory } from './AdjustmentHistory';

// مكون رئيسي للوحدة
const AdjustmentsIndex = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">وحدة التسويات</h1>
      <p className="text-gray-600">مرحباً بك في وحدة إدارة التسويات</p>
    </div>
  );
};

export default AdjustmentsIndex;