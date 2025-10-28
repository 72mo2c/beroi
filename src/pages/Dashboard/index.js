// ======================================
// Dashboard Module Index - وحدة لوحة التحكم
// ======================================

// إعادة تصدير جميع مكونات الوحدة
export { default as ExecutiveDashboard } from './ExecutiveDashboard';
export { default as KPIs } from './KPIs';
export { default as Analytics } from './Analytics';
export { default as InteractiveReports } from './InteractiveReports';
export { default as FinancialForecasting } from './FinancialForecasting';
export { default as BusinessIntelligence } from './BusinessIntelligence';

// مكون رئيسي للوحدة (Dashboard.jsx)
const DashboardIndex = () => {
  return <ExecutiveDashboard />;
};

export default DashboardIndex;