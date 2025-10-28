// ======================================
// TabContent - محتوى التبويبات المستقل
// يحافظ على state كل تبويب في الذاكرة
// ======================================

import React from 'react';
import { useTab } from '../../contexts/TabContext';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../ProtectedRoute';

// Import all page components using unified index files
import Dashboard from '../../pages/Dashboard';
import Notifications from '../../pages/Notifications';

// Warehouses (using index)
import * as Warehouses from '../../pages/Warehouses/index';
const { AddProduct, ManageProducts, AddWarehouse, ManageCategories, Transfer, Inventory, ManageWarehouses } = Warehouses;

// Purchases (using index)
import * as Purchases from '../../pages/Purchases/index';
const { NewPurchaseInvoice, PurchaseInvoices, ManagePurchaseInvoices, NewPurchaseReturn, PurchaseReturns } = Purchases;

// Sales (using index)
import * as Sales from '../../pages/Sales/index';
const { NewSalesInvoice, SalesInvoices, ManageSalesInvoices, NewSalesReturn, SalesReturns, ExternalSalesInvoices } = Sales;

// Suppliers & Customers (using index)
import * as Suppliers from '../../pages/Suppliers/index';
const { AddSupplier, ManageSuppliers } = Suppliers;
import * as Customers from '../../pages/Customers/index';
const { AddCustomer, ManageCustomers } = Customers;

// Treasury (using index)
import * as Treasury from '../../pages/Treasury/index';
const { NewCashReceipt, ManageCashReceipts, NewCashDisbursement, ManageCashDisbursements, TreasuryMovement, CustomerBalances, SupplierBalances } = Treasury;

// Settings (using index)
import * as Settings from '../../pages/Settings/index';
const { AddUser, Permissions, Support, SystemSettings, Integrations: SettingsIntegrations } = Settings;

// Integrations (using index)
import * as Integrations from '../../pages/Integrations/index';
const { ExternalPlatforms, WhatsAppBusiness } = Integrations;

// Reports (using index)
import * as Reports from '../../pages/Reports/index';
const { 
  ReportsHome, InventoryReport, ProductMovementReport, LowStockReport, SalesReport, 
  SalesByCustomer, TopSellingProducts, PurchasesReport, PurchasesBySupplier, 
  TreasuryReport, CashFlowReport, ProfitLossReport 
} = Reports;

// Adjustments (using index)
import * as Adjustments from '../../pages/Adjustments/index';
const { 
  QuantityAdjustment, ValueAdjustment, DamagedWriteOff, CustomerBalanceAdjustment, 
  SupplierBalanceAdjustment, TreasuryAdjustment, AdjustmentEntries, AdjustmentHistory 
} = Adjustments;

// Tools (using index)
import * as Tools from '../../pages/Tools/index';
const { FixNegativeQuantities } = Tools;

// HR Module
import HRIndex from '../../pages/HR/index';
import Departments from '../../pages/HR/Departments';
import Positions from '../../pages/HR/Positions';
import Employees from '../../pages/HR/Employees';
import Attendance from '../../pages/HR/Attendance';
import LeaveRequests from '../../pages/HR/LeaveRequests';
import Performance from '../../pages/HR/Performance';

// Accounting Module
import AccountingIndex from '../../pages/Accounting/index';
import ChartOfAccounts from '../../pages/Accounting/ChartOfAccounts';
import JournalEntries from '../../pages/Accounting/JournalEntries';
import Ledger from '../../pages/Accounting/Ledger';
import BalanceSheet from '../../pages/Accounting/BalanceSheet';
import IncomeStatement from '../../pages/Accounting/IncomeStatement';
import BankAccounts from '../../pages/Accounting/BankAccounts';
import Payments from '../../pages/Accounting/Payments';

// Quality Module
import QualityIndex from '../../pages/Quality/index';
import QualityReports from '../../pages/Quality/QualityReports';
import QualityDashboard from '../../pages/Quality/QualityDashboard';
import QualityStandards from '../../pages/Quality/QualityStandards';
import QualityInspections from '../../pages/Quality/QualityInspections';
import QualityNonConformances from '../../pages/Quality/QualityNonConformances';
import QualityComplaints from '../../pages/Quality/QualityComplaints';
import QualitySettings from '../../pages/Quality/QualitySettings';

// Budgeting Module
import BudgetingIndex from '../../pages/Budgeting/index';

// CRM Module
import CRMIndex from '../../pages/CRM/index';

// Fixed Assets Module
import FixedAssetsIndex from '../../pages/FixedAssets/index';

// Manufacturing Module
import ManufacturingIndex from '../../pages/Manufacturing/index';

// Projects Module
import ProjectsIndex from '../../pages/Projects/index';

// دالة للحصول على المكون بناءً على المسار
const getComponentForPath = (path) => {
  const routes = {
    '/dashboard': Dashboard,
    '/notifications': Notifications,
    
    // Warehouses
    '/warehouses/add-product': AddProduct,
    '/warehouses/manage-products': ManageProducts,
    '/warehouses/add-warehouse': AddWarehouse,
    '/warehouses/manage-categories': ManageCategories,
    '/warehouses/transfer': Transfer,
    '/warehouses/inventory': Inventory,
    '/warehouses/manage': ManageWarehouses,
    
    // Purchases
    '/purchases/new-invoice': NewPurchaseInvoice,
    '/purchases/invoices': PurchaseInvoices,
    '/purchases/manage': ManagePurchaseInvoices,
    '/purchases/returns': PurchaseReturns,
    
    // Sales
    '/sales/new-invoice': NewSalesInvoice,
    '/sales/invoices': SalesInvoices,
    '/sales/manage': ManageSalesInvoices,
    '/sales/returns': SalesReturns,
    '/sales/external': ExternalSalesInvoices,
    
    // Suppliers & Customers
    '/suppliers/add': AddSupplier,
    '/suppliers/manage': ManageSuppliers,
    '/customers/add': AddCustomer,
    '/customers/manage': ManageCustomers,
    
    // Treasury
    '/treasury/receipt/new': NewCashReceipt,
    '/treasury/receipts': ManageCashReceipts,
    '/treasury/disbursement/new': NewCashDisbursement,
    '/treasury/disbursements': ManageCashDisbursements,
    '/treasury/movement': TreasuryMovement,
    '/treasury/customer-balances': CustomerBalances,
    '/treasury/supplier-balances': SupplierBalances,
    
    // Integrations
    '/integrations/external-platforms': ExternalPlatforms,
    '/integrations/whatsapp-business': WhatsAppBusiness,
    
    // Settings
    '/settings/add-user': AddUser,
    '/settings/permissions': Permissions,
    '/settings/support': Support,
    '/settings/system': SystemSettings,
    '/settings/integrations': SettingsIntegrations,
    
    // Adjustments
    '/adjustments/quantity': QuantityAdjustment,
    '/adjustments/value': ValueAdjustment,
    '/adjustments/damaged': DamagedWriteOff,
    '/adjustments/customer-balance': CustomerBalanceAdjustment,
    '/adjustments/supplier-balance': SupplierBalanceAdjustment,
    '/adjustments/treasury': TreasuryAdjustment,
    '/adjustments/entries': AdjustmentEntries,
    '/adjustments/history': AdjustmentHistory,
    
    // Tools
    '/tools/fix-negative-quantities': FixNegativeQuantities,
    
    // HR Module
    '/hr': HRIndex,
    '/hr/departments': Departments,
    '/hr/positions': Positions,
    '/hr/employees': Employees,
    '/hr/attendance': Attendance,
    '/hr/leave-requests': LeaveRequests,
    '/hr/performance': Performance,
    
    // Accounting Module
    '/accounting': AccountingIndex,
    '/accounting/': AccountingIndex,
    '/accounting/chart-of-accounts': ChartOfAccounts,
    '/accounting/journal-entries': JournalEntries,
    '/accounting/ledger': Ledger,
    '/accounting/balance-sheet': BalanceSheet,
    '/accounting/income-statement': IncomeStatement,
    '/accounting/bank-accounts': BankAccounts,
    '/accounting/payments': Payments,
    
    // Quality Module
    '/quality': QualityIndex,
    '/quality/dashboard': QualityDashboard,
    '/quality/standards': QualityStandards,
    '/quality/inspections': QualityInspections,
    '/quality/non-conformances': QualityNonConformances,
    '/quality/complaints': QualityComplaints,
    '/quality/reports': QualityReports,
    '/quality/settings': QualitySettings,
    
    // Budgeting Module
    '/budgeting': BudgetingIndex,
    
    // CRM Module
    '/crm': CRMIndex,
    
    // Fixed Assets Module
    '/fixed-assets': FixedAssetsIndex,
    
    // Manufacturing Module
    '/manufacturing': ManufacturingIndex,
    
    // Projects Module
    '/projects': ProjectsIndex,
    
    // Reports
    '/reports': ReportsHome,
    '/reports/inventory': InventoryReport,
    '/reports/product-movement': ProductMovementReport,
    '/reports/low-stock': LowStockReport,
    '/reports/sales': SalesReport,
    '/reports/sales-by-customer': SalesByCustomer,
    '/reports/top-selling': TopSellingProducts,
    '/reports/purchases': PurchasesReport,
    '/reports/purchases-by-supplier': PurchasesBySupplier,
    '/reports/treasury': TreasuryReport,
    '/reports/cash-flow': CashFlowReport,
    '/reports/profit-loss': ProfitLossReport,
  };
  
  // للمسارات الديناميكية (مثل /purchases/return/:id)
  if (path.startsWith('/purchases/return/')) {
    return NewPurchaseReturn;
  }
  if (path.startsWith('/sales/return/')) {
    return NewSalesReturn;
  }
  
  return routes[path] || Dashboard;
};

const TabContent = () => {
  const { tabs, activeTabId } = useTab();
  const { isAdmin } = useAuth();

  // فحص ما إذا كان المسار يتطلب مدير فقط
  const isAdminOnlyPath = (path) => {
    const adminPaths = [
      '/settings/system',
      '/settings/users',
      '/settings/add-user',
      '/settings/permissions',
      '/settings/integrations',
      '/settings/support',
      '/settings/backup'
    ];
    
    return adminPaths.some(adminPath => path.startsWith(adminPath));
  };

  // إذا كان المسار يتطلب مدير فقط والمستخدم ليس مدير
  if (isAdminOnlyPath(tabs.find(tab => tab.id === activeTabId)?.path || '') && !isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">مدير فقط</h3>
          <p className="text-gray-600 mb-4">
            هذه الصفحة مخصصة للمدير العام فقط. لا يمكن للمستخدمين الآخرين الوصول إليها.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            دورك الحالي: غير مدير - مطلوب: admin
          </p>
          <button
            onClick={() => window.location.href = '#/dashboard'}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            العودة للوحة التحكم
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        const Component = getComponentForPath(tab.path);
        
        return (
          <div
            key={tab.id}
            style={{ display: isActive ? 'block' : 'none' }}
            className="tab-content-wrapper"
          >
            <Component />
          </div>
        );
      })}
    </>
  );
};

export default TabContent;
