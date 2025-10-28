// ======================================
// Reports Module Index - وحدة التقارير
// ======================================

// إعادة تصدير جميع مكونات الوحدة
export { default as ReportsHome } from './ReportsHome';
export { default as InventoryReport } from './InventoryReport';
export { default as ProductMovementReport } from './ProductMovementReport';
export { default as LowStockReport } from './LowStockReport';
export { default as SalesReport } from './SalesReport';
export { default as SalesByCustomer } from './SalesByCustomer';
export { default as TopSellingProducts } from './TopSellingProducts';
export { default as PurchasesReport } from './PurchasesReport';
export { default as PurchasesBySupplier } from './PurchasesBySupplier';
export { default as TreasuryReport } from './TreasuryReport';
export { default as CashFlowReport } from './CashFlowReport';
export { default as ProfitLossReport } from './ProfitLossReport';

// مكون رئيسي للوحدة
const ReportsIndex = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">وحدة التقارير</h1>
      <p className="text-gray-600">مرحباً بك في وحدة إدارة التقارير</p>
    </div>
  );
};

export default ReportsIndex;