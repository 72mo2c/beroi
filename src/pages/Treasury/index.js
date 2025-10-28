// ======================================
// Treasury Module Index - وحدة الخزينة
// ======================================

// إعادة تصدير جميع مكونات الوحدة
export { default as NewCashReceipt } from './NewCashReceipt';
export { default as ManageCashReceipts } from './ManageCashReceipts';
export { default as NewCashDisbursement } from './NewCashDisbursement';
export { default as ManageCashDisbursements } from './ManageCashDisbursements';
export { default as TreasuryMovement } from './TreasuryMovement';
export { default as CustomerBalances } from './CustomerBalances';
export { default as SupplierBalances } from './SupplierBalances';

// مكون رئيسي للوحدة
const TreasuryIndex = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">وحدة الخزينة</h1>
      <p className="text-gray-600">مرحباً بك في وحدة إدارة الخزينة</p>
    </div>
  );
};

export default TreasuryIndex;