// ======================================
// Sales Module Index - وحدة المبيعات
// ======================================

// إعادة تصدير جميع مكونات الوحدة
export { default as NewSalesInvoice } from './NewSalesInvoice';
export { default as SalesInvoices } from './SalesInvoices';
export { default as ManageSalesInvoices } from './ManageSalesInvoices';
export { default as NewSalesReturn } from './NewSalesReturn';
export { default as SalesReturns } from './SalesReturns';
export { default as ExternalSalesInvoices } from './ExternalSalesInvoices';

// مكون رئيسي للوحدة
const SalesIndex = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">وحدة المبيعات</h1>
      <p className="text-gray-600">مرحباً بك في وحدة إدارة المبيعات</p>
    </div>
  );
};

export default SalesIndex;