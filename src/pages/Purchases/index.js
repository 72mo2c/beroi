// ======================================
// Purchases Module Index - وحدة المشتريات
// ======================================

// إعادة تصدير جميع مكونات الوحدة
export { default as NewPurchaseInvoice } from './NewPurchaseInvoice';
export { default as PurchaseInvoices } from './PurchaseInvoices';
export { default as ManagePurchaseInvoices } from './ManagePurchaseInvoices';
export { default as NewPurchaseReturn } from './NewPurchaseReturn';
export { default as PurchaseReturns } from './PurchaseReturns';

// مكون رئيسي للوحدة
const PurchasesIndex = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">وحدة المشتريات</h1>
      <p className="text-gray-600">مرحباً بك في وحدة إدارة المشتريات</p>
    </div>
  );
};

export default PurchasesIndex;