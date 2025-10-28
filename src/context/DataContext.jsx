// ======================================
// Data Context - إدارة بيانات النظام
// ======================================

import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

// Hook لاستخدام Data Context
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

export const DataProvider = ({ children, orgId }) => {
  // بيانات المخازن
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // بيانات المشتريات
  const [purchases, setPurchases] = useState([]);
  const [purchaseInvoices, setPurchaseInvoices] = useState([]);
  const [purchaseReturns, setPurchaseReturns] = useState([]);
  
  // بيانات المبيعات
  const [sales, setSales] = useState([]);
  const [salesInvoices, setSalesInvoices] = useState([]);
  const [salesReturns, setSalesReturns] = useState([]);
  
  // بيانات الشركات والموردين
  const [suppliers, setSuppliers] = useState([]);
  
  // بيانات العملاء
  const [customers, setCustomers] = useState([]);
  
  // بيانات الخزينة الشاملة
  const [treasuryBalance, setTreasuryBalance] = useState(0);
  const [cashReceipts, setCashReceipts] = useState([]); // إيصالات الاستلام النقدي
  const [cashDisbursements, setCashDisbursements] = useState([]); // إيصالات الصرف النقدي
  
  // بيانات التحويلات بين المخازن
  const [transfers, setTransfers] = useState([]);
  
  // بيانات الأصول الثابتة
  const [assetGroups, setAssetGroups] = useState([]); // مجموعات الأصول
  const [fixedAssets, setFixedAssets] = useState([]); // الأصول الثابتة
  const [maintenanceRecords, setMaintenanceRecords] = useState([]); // سجلات الصيانة
  const [disposalRecords, setDisposalRecords] = useState([]); // سجلات الاستبعاد
  const [depreciationMethods, setDepreciationMethods] = useState([
    { id: 'straight-line', name: 'الخط المستقيم', description: 'طريقة الإهلاك الخطي الثابت' },
    { id: 'declining-balance', name: 'الرصيد المتناقص', description: 'طريقة الرصيد المتناقص المزدوج' },
    { id: 'sum-of-years', name: 'مجموع أرقام السنوات', description: 'طريقة مجموع أرقام السنوات' },
    { id: 'units-of-production', name: 'وحدات الإنتاج', description: 'طريقة وحدات الإنتاج' }
  ]);

  // بيانات الموارد البشرية
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [performanceReviews, setPerformanceReviews] = useState([]);
  
  // بيانات إدارة الموازنة
  const [departmentBudgets, setDepartmentBudgets] = useState([]);
  const [projectBudgets, setProjectBudgets] = useState([]);
  const [spendingRecords, setSpendingRecords] = useState([]);
  const [budgetReports, setBudgetReports] = useState([]);
  
  // بيانات إدارة العملاء المتقدمة (CRM)
  const [crmCustomers, setCrmCustomers] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [serviceTickets, setServiceTickets] = useState([]);
  
  // بيانات إدارة التصنيع
  const [workshops, setWorkshops] = useState([]);
  const [productionOrders, setProductionOrders] = useState([]);
  const [productionPlans, setProductionPlans] = useState([]);
  const [productionMonitoring, setProductionMonitoring] = useState([]);
  const [rawMaterialsInventory, setRawMaterialsInventory] = useState([]);
  
  // بيانات إدارة المشاريع
  const [projects, setProjects] = useState([]);
  const [projectTasks, setProjectTasks] = useState([]);
  const [projectResources, setProjectResources] = useState([]);
  const [projectReports, setProjectReports] = useState([]);
  
  // بيانات المحاسبة
  const [chartOfAccounts, setChartOfAccounts] = useState([
    { id: 1, code: '1000', name: 'الأصول', type: 'asset', level: 0, balance: 0, isActive: true, description: 'الأصول المتداولة والثابتة' },
    { id: 2, code: '1100', name: 'الأصول المتداولة', type: 'asset', level: 1, parentAccount: '1000', balance: 500000, isActive: true },
    { id: 3, code: '1110', name: 'النقدية في الصندوق', type: 'asset', level: 2, parentAccount: '1100', balance: 50000, isActive: true },
    { id: 4, code: '1120', name: 'النقدية في البنوك', type: 'asset', level: 2, parentAccount: '1100', balance: 350000, isActive: true },
    { id: 5, code: '1130', name: 'العملاء', type: 'asset', level: 2, parentAccount: '1100', balance: 100000, isActive: true },
    { id: 6, code: '1200', name: 'الأصول الثابتة', type: 'asset', level: 1, parentAccount: '1000', balance: 800000, isActive: true },
    
    { id: 7, code: '2000', name: 'الخصوم', type: 'liability', level: 0, balance: 0, isActive: true, description: 'الخصوم المتداولة وطويلة الأجل' },
    { id: 8, code: '2100', name: 'الخصوم المتداولة', type: 'liability', level: 1, parentAccount: '2000', balance: 200000, isActive: true },
    { id: 9, code: '2110', name: 'الموردين', type: 'liability', level: 2, parentAccount: '2100', balance: 150000, isActive: true },
    { id: 10, code: '2120', name: 'قروض قصيرة الأجل', type: 'liability', level: 2, parentAccount: '2100', balance: 50000, isActive: true },
    
    { id: 11, code: '3000', name: 'حقوق الملكية', type: 'equity', level: 0, balance: 0, isActive: true, description: 'رأس المال والأرباح المحتجزة' },
    { id: 12, code: '3100', name: 'رأس المال', type: 'equity', level: 1, parentAccount: '3000', balance: 1000000, isActive: true },
    { id: 13, code: '3200', name: 'الأرباح المحتجزة', type: 'equity', level: 1, parentAccount: '3000', balance: 100000, isActive: true },
    
    { id: 14, code: '4000', name: 'الإيرادات', type: 'revenue', level: 0, balance: 0, isActive: true, description: 'إيرادات النشاط والإيرادات الأخرى' },
    { id: 15, code: '4100', name: 'إيرادات المبيعات', type: 'revenue', level: 1, parentAccount: '4000', balance: 800000, isActive: true },
    { id: 16, code: '4200', name: 'الإيرادات الأخرى', type: 'revenue', level: 1, parentAccount: '4000', balance: 50000, isActive: true },
    
    { id: 17, code: '5000', name: 'تكلفة البضاعة المباعة', type: 'cost', level: 0, balance: 0, isActive: true, description: 'تكلفة المبيعات' },
    { id: 18, code: '5100', name: 'تكلفة المبيعات', type: 'cost', level: 1, parentAccount: '5000', balance: 500000, isActive: true },
    
    { id: 19, code: '6000', name: 'المصروفات', type: 'expense', level: 0, balance: 0, isActive: true, description: 'مصروفات التشغيل والإدارية' },
    { id: 20, code: '6100', name: 'مصروفات البيع والتسويق', type: 'expense', level: 1, parentAccount: '6000', balance: 100000, isActive: true },
    { id: 21, code: '6200', name: 'المصروفات الإدارية والعمومية', type: 'expense', level: 1, parentAccount: '6000', balance: 150000, isActive: true }
  ]);
  
  const [journalEntries, setJournalEntries] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([
    {
      id: 1,
      bankName: 'البنك الأهلي السعودي',
      accountNumber: '1234567890',
      accountName: 'حساب الشركة الرئيسي',
      accountType: 'checking',
      currency: 'SAR',
      iban: 'SA1234567890123456789012',
      swiftCode: 'ANBKSARIE',
      balance: 350000,
      isActive: true,
      description: 'الحساب الرئيسي للشركة',
      branch: 'الفرع الرئيسي',
      contactPhone: '0111234567',
      contactPerson: 'أحمد محمد',
      minimumBalance: 10000,
      transactions: []
    },
    {
      id: 2,
      bankName: 'بنك الرياض',
      accountNumber: '0987654321',
      accountName: 'حساب التوفير',
      accountType: 'savings',
      currency: 'SAR',
      iban: 'SA0987654321098765432109',
      swiftCode: 'RJHI',
      balance: 150000,
      isActive: true,
      description: 'حساب التوفير قصير المدى',
      branch: 'فرع العليا',
      contactPhone: '0119876543',
      contactPerson: 'فاطمة أحمد',
      minimumBalance: 5000,
      transactions: []
    }
  ]);
  
  const [payments, setPayments] = useState([]);

  // دالة مساعدة للحصول على مفاتيح LocalStorage مع orgId
  const getStorageKey = (key) => {
    if (!orgId) return key; // للتوافق مع النظام القديم
    return `bero_${orgId}_${key.replace('bero_', '')}`;
  };

  // تحميل البيانات من LocalStorage
  useEffect(() => {
    if (orgId) {
      loadAllData();
    }
  }, [orgId]);

  // تحميل جميع البيانات
  const loadAllData = () => {
    const loadData = (key, setter, defaultValue = []) => {
      const stored = localStorage.getItem(getStorageKey(key));
      if (stored) {
        try {
          setter(JSON.parse(stored));
        } catch (error) {
          console.error(`خطأ في تحميل ${key}:`, error);
          setter(defaultValue);
        }
      }
    };

    loadData('bero_warehouses', setWarehouses);
    loadData('bero_products', setProducts);
    loadData('bero_categories', setCategories);
    loadData('bero_purchases', setPurchases);
    loadData('bero_purchase_invoices', setPurchaseInvoices);
    loadData('bero_purchase_returns', setPurchaseReturns);
    loadData('bero_sales', setSales);
    loadData('bero_sales_invoices', setSalesInvoices);
    loadData('bero_sales_returns', setSalesReturns);
    loadData('bero_suppliers', setSuppliers);
    loadData('bero_customers', setCustomers);
    loadData('bero_treasury_balance', setTreasuryBalance, 0);
    loadData('bero_cash_receipts', setCashReceipts);
    loadData('bero_cash_disbursements', setCashDisbursements);
    loadData('bero_transfers', setTransfers);
    loadData('bero_asset_groups', setAssetGroups);
    loadData('bero_fixed_assets', setFixedAssets);
    loadData('bero_maintenance_records', setMaintenanceRecords);
    loadData('bero_disposal_records', setDisposalRecords);
    loadData('bero_departments', setDepartments);
    loadData('bero_positions', setPositions);
    loadData('bero_employees', setEmployees);
    loadData('bero_attendance', setAttendance);
    loadData('bero_leave_requests', setLeaveRequests);
    loadData('bero_performance_reviews', setPerformanceReviews);
    
    // تحميل بيانات إدارة الموازنة
    loadData('bero_department_budgets', setDepartmentBudgets);
    loadData('bero_project_budgets', setProjectBudgets);
    loadData('bero_spending_records', setSpendingRecords);
    loadData('bero_budget_reports', setBudgetReports);
    
    // تحميل بيانات CRM
    loadData('bero_crm_customers', setCrmCustomers);
    loadData('bero_opportunities', setOpportunities);
    loadData('bero_campaigns', setCampaigns);
    loadData('bero_service_tickets', setServiceTickets);
    
    // تحميل بيانات التصنيع
    loadData('bero_workshops', setWorkshops);
    loadData('bero_production_orders', setProductionOrders);
    loadData('bero_production_plans', setProductionPlans);
    loadData('bero_production_monitoring', setProductionMonitoring);
    loadData('bero_raw_materials_inventory', setRawMaterialsInventory);
    
    // تحميل بيانات المشاريع
    loadData('bero_projects', setProjects);
    loadData('bero_project_tasks', setProjectTasks);
    loadData('bero_project_resources', setProjectResources);
    loadData('bero_project_reports', setProjectReports);
    
    // تحميل البيانات المحاسبية
    loadData('bero_chart_of_accounts', setChartOfAccounts);
    loadData('bero_journal_entries', setJournalEntries);
    loadData('bero_bank_accounts', setBankAccounts);
    loadData('bero_payments', setPayments);
  };

  // حفض البيانات في LocalStorage
  const saveData = (key, data) => {
    localStorage.setItem(getStorageKey(key), JSON.stringify(data));
  };

  // ==================== دوال المخازن ====================
  
  const addWarehouse = (warehouse) => {
    const newWarehouse = { id: Date.now(), ...warehouse };
    const updated = [...warehouses, newWarehouse];
    setWarehouses(updated);
    saveData('bero_warehouses', updated);
    return newWarehouse;
  };

  const updateWarehouse = (id, updatedData) => {
    const updated = warehouses.map(w => w.id === id ? { ...w, ...updatedData } : w);
    setWarehouses(updated);
    saveData('bero_warehouses', updated);
  };

  const deleteWarehouse = (id) => {
    const updated = warehouses.filter(w => w.id !== id);
    setWarehouses(updated);
    saveData('bero_warehouses', updated);
  };

  // ==================== دوال الفئات ====================
  
  const addCategory = (category) => {
    const newCategory = { id: Date.now(), createdAt: new Date().toISOString(), ...category };
    const updated = [...categories, newCategory];
    setCategories(updated);
    saveData('bero_categories', updated);
    return newCategory;
  };

  const updateCategory = (id, updatedData) => {
    const updated = categories.map(c => c.id === id ? { ...c, ...updatedData } : c);
    setCategories(updated);
    saveData('bero_categories', updated);
  };

  const deleteCategory = (id) => {
    const updated = categories.filter(c => c.id !== id);
    setCategories(updated);
    saveData('bero_categories', updated);
  };

  // ==================== دوال المنتجات ====================
  
  const addProduct = (product) => {
    const newProduct = { id: Date.now(), ...product };
    const updated = [...products, newProduct];
    setProducts(updated);
    saveData('bero_products', updated);
    return newProduct;
  };

  const updateProduct = (id, updatedData) => {
    const updated = products.map(p => p.id === id ? { ...p, ...updatedData } : p);
    setProducts(updated);
    saveData('bero_products', updated);
  };

  const deleteProduct = (id) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    saveData('bero_products', updated);
  };

  // ==================== دوال الموردين ====================
  
  const addSupplier = (supplier) => {
    const newSupplier = { id: Date.now(), ...supplier };
    const updated = [...suppliers, newSupplier];
    setSuppliers(updated);
    saveData('bero_suppliers', updated);
    return newSupplier;
  };

  const updateSupplier = (id, updatedData) => {
    const updated = suppliers.map(s => s.id === id ? { ...s, ...updatedData } : s);
    setSuppliers(updated);
    saveData('bero_suppliers', updated);
  };

  const deleteSupplier = (id) => {
    const updated = suppliers.filter(s => s.id !== id);
    setSuppliers(updated);
    saveData('bero_suppliers', updated);
  };

  // ==================== دوال العملاء ====================
  
  const addCustomer = (customer) => {
    const newCustomer = { id: Date.now(), ...customer };
    const updated = [...customers, newCustomer];
    setCustomers(updated);
    saveData('bero_customers', updated);
    return newCustomer;
  };

  const updateCustomer = (id, updatedData) => {
    const updated = customers.map(c => c.id === id ? { ...c, ...updatedData } : c);
    setCustomers(updated);
    saveData('bero_customers', updated);
  };

  const deleteCustomer = (id) => {
    const updated = customers.filter(c => c.id !== id);
    setCustomers(updated);
    saveData('bero_customers', updated);
  };

  // ==================== دوال فواتير المشتريات ====================
  
  const addPurchaseInvoice = (invoice) => {
    // إثراء بيانات items بأسماء المنتجات
    const enrichedItems = invoice.items.map(item => {
      const product = products.find(p => p.id === parseInt(item.productId));
      return {
        ...item,
        productName: product?.name || item.productName || 'غير محدد'
      };
    });
    
    const newInvoice = { 
      id: Date.now(), 
      date: new Date().toISOString(), 
      ...invoice,
      items: enrichedItems,
      supplierId: parseInt(invoice.supplierId) // تحويل إلى رقم
    };
    const updated = [...purchaseInvoices, newInvoice];
    setPurchaseInvoices(updated);
    saveData('bero_purchase_invoices', updated);
    
    // تحديث كميات المنتجات (مع الكمية الرئيسية والفرعية)
    if (invoice.items && Array.isArray(invoice.items)) {
      const updatedProducts = [...products];
      
      invoice.items.forEach(item => {
        const productIndex = updatedProducts.findIndex(p => p.id === parseInt(item.productId));
        if (productIndex !== -1) {
          // حساب الكمية الإجمالية (الرئيسية + الفرعية)
          const mainQty = parseInt(item.quantity) || 0;
          const subQty = parseInt(item.subQuantity) || 0;
          const totalQty = mainQty + subQty;
          
          // التحقق من الكميات السالبة
          if (totalQty < 0) {
            throw new Error(`الكمية لا يمكن أن تكون سالبة للمنتج: ${updatedProducts[productIndex].name}`);
          }
          
          // زيادة الكمية الإجمالية في المخزون
          updatedProducts[productIndex] = {
            ...updatedProducts[productIndex],
            mainQuantity: (updatedProducts[productIndex].mainQuantity || 0) + totalQty
          };
        }
      });
      
      setProducts(updatedProducts);
      saveData('bero_products', updatedProducts);
    }
    
    return newInvoice;
  };

  const updatePurchaseInvoice = (invoiceId, updatedData) => {
    // إيجاد الفاتورة القديمة
    const oldInvoice = purchaseInvoices.find(inv => inv.id === invoiceId);
    if (!oldInvoice) {
      throw new Error('الفاتورة غير موجودة');
    }

    // إعادة الكميات القديمة (عكس عملية الشراء القديمة) - مع الكمية الفرعية
    if (oldInvoice.items && Array.isArray(oldInvoice.items)) {
      const updatedProducts = [...products];
      
      oldInvoice.items.forEach(item => {
        const productIndex = updatedProducts.findIndex(p => p.id === parseInt(item.productId));
        if (productIndex !== -1) {
          // حساب الكمية الإجمالية القديمة (الرئيسية + الفرعية)
          const oldMainQty = parseInt(item.quantity) || 0;
          const oldSubQty = parseInt(item.subQuantity) || 0;
          const oldTotalQty = oldMainQty + oldSubQty;
          
          // إعادة الكمية للمخزون
          const newQuantity = (updatedProducts[productIndex].mainQuantity || 0) - oldTotalQty;
          
          // التحقق من عدم حدوث كميات سالبة
          if (newQuantity < 0) {
            throw new Error(`لا يمكن تحديث الفاتورة: الكمية المتوفرة غير كافية للمنتج ${updatedProducts[productIndex].name}`);
          }
          
          updatedProducts[productIndex] = {
            ...updatedProducts[productIndex],
            mainQuantity: newQuantity
          };
        }
      });
      
      setProducts(updatedProducts);
      saveData('bero_products', updatedProducts);
    }

    // تحديث الفاتورة
    const updated = purchaseInvoices.map(inv => 
      inv.id === invoiceId ? { ...inv, ...updatedData } : inv
    );
    setPurchaseInvoices(updated);
    saveData('bero_purchase_invoices', updated);

    // إضافة الكميات الجديدة - مع الكمية الفرعية
    if (updatedData.items && Array.isArray(updatedData.items)) {
      const updatedProducts = [...products];
      
      updatedData.items.forEach(item => {
        const productIndex = updatedProducts.findIndex(p => p.id === parseInt(item.productId));
        if (productIndex !== -1) {
          // حساب الكمية الإجمالية الجديدة (الرئيسية + الفرعية)
          const newMainQty = parseInt(item.quantity) || 0;
          const newSubQty = parseInt(item.subQuantity) || 0;
          const newTotalQty = newMainQty + newSubQty;
          
          updatedProducts[productIndex] = {
            ...updatedProducts[productIndex],
            mainQuantity: (updatedProducts[productIndex].mainQuantity || 0) + newTotalQty
          };
        }
      });
      
      setProducts(updatedProducts);
      saveData('bero_products', updatedProducts);
    }
  };

  const deletePurchaseInvoice = (invoiceId) => {
    // إيجاد الفاتورة المراد حذفها
    const invoice = purchaseInvoices.find(inv => inv.id === invoiceId);
    if (!invoice) {
      throw new Error('الفاتورة غير موجودة');
    }
    
    // التحقق من عدم وجود مرتجعات مرتبطة
    const hasReturns = purchaseReturns.some(ret => ret.invoiceId === invoiceId);
    if (hasReturns) {
      throw new Error('لا يمكن حذف الفاتورة: توجد مرتجعات مرتبطة بها');
    }
    
    // إعادة الكميات من المخزون (عكس عملية الشراء) - مع الكمية الفرعية
    if (invoice.items && Array.isArray(invoice.items)) {
      const updatedProducts = [...products];
      
      invoice.items.forEach(item => {
        const productIndex = updatedProducts.findIndex(p => p.id === parseInt(item.productId));
        if (productIndex !== -1) {
          // حساب الكمية الإجمالية (الرئيسية + الفرعية)
          const mainQty = parseInt(item.quantity) || 0;
          const subQty = parseInt(item.subQuantity) || 0;
          const totalQty = mainQty + subQty;
          
          // خصم الكمية من المخزون (عكس عملية الشراء)
          const newQuantity = (updatedProducts[productIndex].mainQuantity || 0) - totalQty;
          
          // التحقق من عدم حدوث كميات سالبة
          if (newQuantity < 0) {
            throw new Error(`لا يمكن حذف الفاتورة: سيؤدي ذلك إلى كمية سالبة للمنتج ${updatedProducts[productIndex].name}`);
          }
          
          updatedProducts[productIndex] = {
            ...updatedProducts[productIndex],
            mainQuantity: newQuantity
          };
        }
      });
      
      setProducts(updatedProducts);
      saveData('bero_products', updatedProducts);
    }
    
    // حذف الفاتورة
    const updated = purchaseInvoices.filter(inv => inv.id !== invoiceId);
    setPurchaseInvoices(updated);
    saveData('bero_purchase_invoices', updated);
  };

  // ==================== دوال مرتجعات المشتريات ====================
  
  const addPurchaseReturn = (returnData) => {
    const { invoiceId, items, reason, notes } = returnData;
    
    // التحقق من وجود الفاتورة
    const invoice = purchaseInvoices.find(inv => inv.id === invoiceId);
    if (!invoice) {
      throw new Error('الفاتورة غير موجودة');
    }
    
    // حساب إجمالي المبلغ المرتجع
    let totalAmount = 0;
    
    // التحقق من الكميات المرتجعة وتحديث المخزون
    const updatedProducts = [...products];
    
    items.forEach(item => {
      // البحث عن المنتج في الفاتورة الأصلية
      const originalItem = invoice.items.find(i => i.productId === item.productId);
      if (!originalItem) {
        throw new Error('المنتج غير موجود في الفاتورة الأصلية');
      }
      
      // حساب الكميات المرتجعة مسبقاً
      const previousReturns = purchaseReturns.filter(ret => 
        ret.invoiceId === invoiceId && ret.status !== 'cancelled'
      );
      
      let totalReturnedQty = 0;
      previousReturns.forEach(ret => {
        const retItem = ret.items.find(i => i.productId === item.productId);
        if (retItem) {
          totalReturnedQty += (retItem.quantity || 0) + (retItem.subQuantity || 0);
        }
      });
      
      // الكمية المتاحة للإرجاع
      const originalQty = (originalItem.quantity || 0) + (originalItem.subQuantity || 0);
      const returnQty = (item.quantity || 0) + (item.subQuantity || 0);
      const availableQty = originalQty - totalReturnedQty;
      
      if (returnQty > availableQty) {
        throw new Error(`الكمية المرتجعة تتجاوز الكمية المتاحة للمنتج`);
      }
      
      // خصم الكميات المرتجعة من المخزون
      const productIndex = updatedProducts.findIndex(p => p.id === parseInt(item.productId));
      if (productIndex !== -1) {
        const newQuantity = (updatedProducts[productIndex].mainQuantity || 0) - returnQty;
        
        if (newQuantity < 0) {
          throw new Error(`الكمية المتوفرة في المخزون غير كافية`);
        }
        
        updatedProducts[productIndex] = {
          ...updatedProducts[productIndex],
          mainQuantity: newQuantity
        };
      }
      
      // حساب المبلغ المرتجع
      const itemAmount = (item.quantity || 0) * (originalItem.price || 0) +
                        (item.subQuantity || 0) * (originalItem.subPrice || 0);
      totalAmount += itemAmount;
    });
    
    // إنشاء سجل المرتجع
    const newReturn = {
      id: Date.now(),
      invoiceId,
      date: new Date().toISOString(),
      items,
      reason,
      notes,
      totalAmount,
      status: 'completed' // completed, pending, cancelled
    };
    
    // حفظ المرتجع
    const updatedReturns = [newReturn, ...purchaseReturns];
    setPurchaseReturns(updatedReturns);
    saveData('bero_purchase_returns', updatedReturns);
    
    // تحديث المخزون
    setProducts(updatedProducts);
    saveData('bero_products', updatedProducts);
    
    // تحديث حالة الفاتورة الأصلية
    const updatedInvoices = purchaseInvoices.map(inv => {
      if (inv.id === invoiceId) {
        return { ...inv, hasReturns: true };
      }
      return inv;
    });
    setPurchaseInvoices(updatedInvoices);
    saveData('bero_purchase_invoices', updatedInvoices);
    
    return newReturn;
  };
  
  const deletePurchaseReturn = (returnId) => {
    // البحث عن المرتجع
    const returnRecord = purchaseReturns.find(ret => ret.id === returnId);
    if (!returnRecord) {
      throw new Error('المرتجع غير موجود');
    }
    
    // إعادة الكميات المرتجعة للمخزون
    const updatedProducts = [...products];
    
    returnRecord.items.forEach(item => {
      const productIndex = updatedProducts.findIndex(p => p.id === parseInt(item.productId));
      if (productIndex !== -1) {
        const returnQty = (item.quantity || 0) + (item.subQuantity || 0);
        updatedProducts[productIndex] = {
          ...updatedProducts[productIndex],
          mainQuantity: (updatedProducts[productIndex].mainQuantity || 0) + returnQty
        };
      }
    });
    
    setProducts(updatedProducts);
    saveData('bero_products', updatedProducts);
    
    // حذف المرتجع
    const updated = purchaseReturns.filter(ret => ret.id !== returnId);
    setPurchaseReturns(updated);
    saveData('bero_purchase_returns', updated);
  };

  // ==================== دوال فواتير المبيعات ====================
  
  const addSalesInvoice = (invoice) => {
    // التحقق من توفر الكميات قبل البيع
    if (invoice.items && Array.isArray(invoice.items)) {
      for (const item of invoice.items) {
        const product = products.find(p => p.id === parseInt(item.productId));
        if (!product) {
          throw new Error(`المنتج غير موجود`);
        }
        
        const requestedQty = parseInt(item.quantity) || 0;
        const availableQty = product.mainQuantity || 0;
        
        if (requestedQty > availableQty) {
          throw new Error(
            `الكمية المتوفرة غير كافية للمنتج "${product.name}".\n` +
            `المتوفر: ${availableQty}، المطلوب: ${requestedQty}`
          );
        }
      }
    }
    
    // إثراء بيانات items بأسماء المنتجات
    const enrichedItems = invoice.items.map(item => {
      const product = products.find(p => p.id === parseInt(item.productId));
      return {
        ...item,
        productName: product?.name || item.productName || 'غير محدد'
      };
    });
    
    const newInvoice = { 
      id: Date.now(), 
      date: new Date().toISOString(), 
      ...invoice,
      items: enrichedItems,
      customerId: parseInt(invoice.customerId) // تحويل إلى رقم
    };
    const updated = [...salesInvoices, newInvoice];
    setSalesInvoices(updated);
    saveData('bero_sales_invoices', updated);
    
    // تحديث كميات المنتجات (خصم الكميات المباعة من المخزون)
    if (invoice.items && Array.isArray(invoice.items)) {
      const updatedProducts = [...products];
      
      invoice.items.forEach(item => {
        const productIndex = updatedProducts.findIndex(p => p.id === parseInt(item.productId));
        if (productIndex !== -1) {
          const newQuantity = (updatedProducts[productIndex].mainQuantity || 0) - parseInt(item.quantity);
          
          // تأكيد نهائي لمنع الكميات السالبة
          if (newQuantity < 0) {
            throw new Error(
              `خطأ: الكمية أصبحت سالبة للمنتج ${updatedProducts[productIndex].name}`
            );
          }
          
          updatedProducts[productIndex] = {
            ...updatedProducts[productIndex],
            mainQuantity: newQuantity
          };
        }
      });
      
      setProducts(updatedProducts);
      saveData('bero_products', updatedProducts);
    }
    
    return newInvoice;
  };
  
  const deleteSalesInvoice = (invoiceId) => {
    // إيجاد الفاتورة المراد حذفها
    const invoice = salesInvoices.find(inv => inv.id === invoiceId);
    if (!invoice) {
      throw new Error('الفاتورة غير موجودة');
    }
    
    // التحقق من عدم وجود مرتجعات مرتبطة
    const hasReturns = salesReturns.some(ret => ret.invoiceId === invoiceId);
    if (hasReturns) {
      throw new Error('لا يمكن حذف الفاتورة: توجد مرتجعات مرتبطة بها');
    }
    
    // إعادة الكميات إلى المخزون (عكس عملية البيع)
    if (invoice.items && Array.isArray(invoice.items)) {
      const updatedProducts = [...products];
      
      invoice.items.forEach(item => {
        const productIndex = updatedProducts.findIndex(p => p.id === parseInt(item.productId));
        if (productIndex !== -1) {
          updatedProducts[productIndex] = {
            ...updatedProducts[productIndex],
            mainQuantity: (updatedProducts[productIndex].mainQuantity || 0) + parseInt(item.quantity)
          };
        }
      });
      
      setProducts(updatedProducts);
      saveData('bero_products', updatedProducts);
    }
    
    // حذف الفاتورة
    const updated = salesInvoices.filter(inv => inv.id !== invoiceId);
    setSalesInvoices(updated);
    saveData('bero_sales_invoices', updated);
  };

  // ==================== دوال مرتجعات المبيعات ====================
  
  const addSalesReturn = (returnData) => {
    const { invoiceId, items, reason, notes } = returnData;
    
    // التحقق من وجود الفاتورة
    const invoice = salesInvoices.find(inv => inv.id === invoiceId);
    if (!invoice) {
      throw new Error('الفاتورة غير موجودة');
    }
    
    // حساب إجمالي المبلغ المرتجع
    let totalAmount = 0;
    
    // التحقق من الكميات المرتجعة وتحديث المخزون
    const updatedProducts = [...products];
    
    items.forEach(item => {
      // البحث عن المنتج في الفاتورة الأصلية
      const originalItem = invoice.items.find(i => i.productId === item.productId);
      if (!originalItem) {
        throw new Error('المنتج غير موجود في الفاتورة الأصلية');
      }
      
      // حساب الكميات المرتجعة مسبقاً
      const previousReturns = salesReturns.filter(ret => 
        ret.invoiceId === invoiceId && ret.status !== 'cancelled'
      );
      
      let totalReturnedQty = 0;
      previousReturns.forEach(ret => {
        const retItem = ret.items.find(i => i.productId === item.productId);
        if (retItem) {
          totalReturnedQty += (retItem.quantity || 0) + (retItem.subQuantity || 0);
        }
      });
      
      // الكمية المتاحة للإرجاع
      const originalQty = parseInt(originalItem.quantity) || 0;
      const returnQty = (item.quantity || 0) + (item.subQuantity || 0);
      const availableQty = originalQty - totalReturnedQty;
      
      if (returnQty > availableQty) {
        throw new Error(`الكمية المرتجعة تتجاوز الكمية المتاحة للمنتج`);
      }
      
      // إضافة الكميات المرتجعة للمخزون (عكس البيع)
      const productIndex = updatedProducts.findIndex(p => p.id === parseInt(item.productId));
      if (productIndex !== -1) {
        updatedProducts[productIndex] = {
          ...updatedProducts[productIndex],
          mainQuantity: (updatedProducts[productIndex].mainQuantity || 0) + returnQty
        };
      }
      
      // حساب المبلغ المرتجع
      const itemAmount = returnQty * (originalItem.price || 0);
      totalAmount += itemAmount;
    });
    
    // إنشاء سجل المرتجع
    const newReturn = {
      id: Date.now(),
      invoiceId,
      date: new Date().toISOString(),
      items,
      reason,
      notes,
      totalAmount,
      status: 'completed' // completed, pending, cancelled
    };
    
    // حفظ المرتجع
    const updatedReturns = [newReturn, ...salesReturns];
    setSalesReturns(updatedReturns);
    saveData('bero_sales_returns', updatedReturns);
    
    // تحديث المخزون
    setProducts(updatedProducts);
    saveData('bero_products', updatedProducts);
    
    // تحديث حالة الفاتورة الأصلية
    const updatedInvoices = salesInvoices.map(inv => {
      if (inv.id === invoiceId) {
        return { ...inv, hasReturns: true };
      }
      return inv;
    });
    setSalesInvoices(updatedInvoices);
    saveData('bero_sales_invoices', updatedInvoices);
    
    return newReturn;
  };
  
  const deleteSalesReturn = (returnId) => {
    // البحث عن المرتجع
    const returnRecord = salesReturns.find(ret => ret.id === returnId);
    if (!returnRecord) {
      throw new Error('المرتجع غير موجود');
    }
    
    // خصم الكميات المرتجعة من المخزون (لأن الإرجاع كان قد أضافها)
    const updatedProducts = [...products];
    
    returnRecord.items.forEach(item => {
      const productIndex = updatedProducts.findIndex(p => p.id === parseInt(item.productId));
      if (productIndex !== -1) {
        const returnQty = (item.quantity || 0) + (item.subQuantity || 0);
        updatedProducts[productIndex] = {
          ...updatedProducts[productIndex],
          mainQuantity: (updatedProducts[productIndex].mainQuantity || 0) - returnQty
        };
      }
    });
    
    setProducts(updatedProducts);
    saveData('bero_products', updatedProducts);
    
    // حذف المرتجع
    const updated = salesReturns.filter(ret => ret.id !== returnId);
    setSalesReturns(updated);
    saveData('bero_sales_returns', updated);
  };

  // ==================== دوال الخزينة الشاملة ====================
  
  // إضافة إيصال استلام نقدي
  const addCashReceipt = (receiptData) => {
    const newReceipt = {
      id: Date.now(),
      date: new Date().toISOString(),
      ...receiptData,
      type: 'receipt', // receipt
      status: 'completed' // completed, pending, cancelled
    };
    
    const updatedReceipts = [newReceipt, ...cashReceipts];
    setCashReceipts(updatedReceipts);
    saveData('bero_cash_receipts', updatedReceipts);
    
    // تحديث رصيد الخزينة (إضافة)
    const newBalance = treasuryBalance + parseFloat(receiptData.amount);
    setTreasuryBalance(newBalance);
    saveData('bero_treasury_balance', newBalance);
    
    return newReceipt;
  };
  
  // تحديث إيصال استلام نقدي
  const updateCashReceipt = (id, updatedData) => {
    const oldReceipt = cashReceipts.find(r => r.id === id);
    if (!oldReceipt) {
      throw new Error('الإيصال غير موجود');
    }
    
    // إعادة المبلغ القديم
    let newBalance = treasuryBalance - parseFloat(oldReceipt.amount);
    // إضافة المبلغ الجديد
    newBalance += parseFloat(updatedData.amount || oldReceipt.amount);
    
    setTreasuryBalance(newBalance);
    saveData('bero_treasury_balance', newBalance);
    
    const updated = cashReceipts.map(r => 
      r.id === id ? { ...r, ...updatedData } : r
    );
    setCashReceipts(updated);
    saveData('bero_cash_receipts', updated);
  };
  
  // حذف إيصال استلام نقدي
  const deleteCashReceipt = (id) => {
    const receipt = cashReceipts.find(r => r.id === id);
    if (!receipt) {
      throw new Error('الإيصال غير موجود');
    }
    
    // إعادة المبلغ من الخزينة
    const newBalance = treasuryBalance - parseFloat(receipt.amount);
    
    if (newBalance < 0) {
      throw new Error('لا يمكن حذف الإيصال: سيؤدي ذلك إلى رصيد سالب في الخزينة');
    }
    
    setTreasuryBalance(newBalance);
    saveData('bero_treasury_balance', newBalance);
    
    const updated = cashReceipts.filter(r => r.id !== id);
    setCashReceipts(updated);
    saveData('bero_cash_receipts', updated);
  };
  
  // إضافة إيصال صرف نقدي
  const addCashDisbursement = (disbursementData) => {
    // التحقق من الرصيد الكافي
    if (treasuryBalance < parseFloat(disbursementData.amount)) {
      throw new Error('الرصيد المتوفر في الخزينة غير كافٍ');
    }
    
    const newDisbursement = {
      id: Date.now(),
      date: new Date().toISOString(),
      ...disbursementData,
      type: 'disbursement', // disbursement
      status: 'completed' // completed, pending, cancelled
    };
    
    const updatedDisbursements = [newDisbursement, ...cashDisbursements];
    setCashDisbursements(updatedDisbursements);
    saveData('bero_cash_disbursements', updatedDisbursements);
    
    // تحديث رصيد الخزينة (خصم)
    const newBalance = treasuryBalance - parseFloat(disbursementData.amount);
    setTreasuryBalance(newBalance);
    saveData('bero_treasury_balance', newBalance);
    
    return newDisbursement;
  };
  
  // تحديث إيصال صرف نقدي
  const updateCashDisbursement = (id, updatedData) => {
    const oldDisbursement = cashDisbursements.find(d => d.id === id);
    if (!oldDisbursement) {
      throw new Error('الإيصال غير موجود');
    }
    
    // إعادة المبلغ القديم للخزينة
    let newBalance = treasuryBalance + parseFloat(oldDisbursement.amount);
    // خصم المبلغ الجديد
    const newAmount = parseFloat(updatedData.amount || oldDisbursement.amount);
    newBalance -= newAmount;
    
    if (newBalance < 0) {
      throw new Error('الرصيد المتوفر في الخزينة غير كافٍ للتحديث');
    }
    
    setTreasuryBalance(newBalance);
    saveData('bero_treasury_balance', newBalance);
    
    const updated = cashDisbursements.map(d => 
      d.id === id ? { ...d, ...updatedData } : d
    );
    setCashDisbursements(updated);
    saveData('bero_cash_disbursements', updated);
  };
  
  // حذف إيصال صرف نقدي
  const deleteCashDisbursement = (id) => {
    const disbursement = cashDisbursements.find(d => d.id === id);
    if (!disbursement) {
      throw new Error('الإيصال غير موجود');
    }
    
    // إعادة المبلغ للخزينة
    const newBalance = treasuryBalance + parseFloat(disbursement.amount);
    setTreasuryBalance(newBalance);
    saveData('bero_treasury_balance', newBalance);
    
    const updated = cashDisbursements.filter(d => d.id !== id);
    setCashDisbursements(updated);
    saveData('bero_cash_disbursements', updated);
  };
  
  // حساب رصيد عميل معين
  const getCustomerBalance = (customerId) => {
    let balance = 0;
    
    // المبيعات (دين على العميل)
    salesInvoices.forEach(invoice => {
      if (invoice.customerId === customerId) {
        balance += parseFloat(invoice.total || 0);
      }
    });
    
    // المرتجعات (تخفض من دين العميل)
    salesReturns.forEach(returnRecord => {
      const invoice = salesInvoices.find(inv => inv.id === returnRecord.invoiceId);
      if (invoice && invoice.customerId === customerId) {
        balance -= parseFloat(returnRecord.totalAmount || 0);
      }
    });
    
    // الاستلامات من العميل (تخفض من دين العميل)
    cashReceipts.forEach(receipt => {
      if (receipt.fromType === 'customer' && receipt.fromId === customerId) {
        balance -= parseFloat(receipt.amount || 0);
      }
    });
    
    return balance;
  };
  
  // حساب رصيد مورد معين
  const getSupplierBalance = (supplierId) => {
    let balance = 0;
    
    // المشتريات (دين علينا للمورد)
    purchaseInvoices.forEach(invoice => {
      if (invoice.supplierId === supplierId) {
        balance += parseFloat(invoice.total || 0);
      }
    });
    
    // المرتجعات (تخفض من ديوننا للمورد)
    purchaseReturns.forEach(returnRecord => {
      const invoice = purchaseInvoices.find(inv => inv.id === returnRecord.invoiceId);
      if (invoice && invoice.supplierId === supplierId) {
        balance -= parseFloat(returnRecord.totalAmount || 0);
      }
    });
    
    // الصرف للمورد (تخفض من ديوننا للمورد)
    cashDisbursements.forEach(disbursement => {
      if (disbursement.toType === 'supplier' && disbursement.toId === supplierId) {
        balance -= parseFloat(disbursement.amount || 0);
      }
    });
    
    return balance;
  };
  
  // الحصول على جميع أرصدة العملاء
  const getAllCustomerBalances = () => {
    return customers.map(customer => ({
      ...customer,
      balance: getCustomerBalance(customer.id)
    })).filter(c => c.balance !== 0); // عرض فقط من لديهم رصيد
  };
  
  // الحصول على جميع أرصدة الموردين
  const getAllSupplierBalances = () => {
    return suppliers.map(supplier => ({
      ...supplier,
      balance: getSupplierBalance(supplier.id)
    })).filter(s => s.balance !== 0); // عرض فقط من لديهم رصيد
  };

  // ==================== دوال التحويلات بين المخازن ====================
  
  const transferProduct = (transferData) => {
    const { productId, fromWarehouseId, toWarehouseId, quantity, notes } = transferData;
    
    // البحث عن المنتج في المخزن المصدر
    const sourceProduct = products.find(
      p => p.id === productId && p.warehouseId === fromWarehouseId
    );
    
    if (!sourceProduct) {
      throw new Error('المنتج غير موجود في المخزن المصدر');
    }
    
    if (sourceProduct.mainQuantity < quantity) {
      throw new Error('الكمية المتوفرة غير كافية');
    }
    
    // البحث عن نفس المنتج في المخزن المستهدف
    const targetProduct = products.find(
      p => p.name === sourceProduct.name && 
           p.category === sourceProduct.category && 
           p.warehouseId === toWarehouseId
    );
    
    let updatedProducts;
    
    if (targetProduct) {
      // المنتج موجود في المخزن المستهدف - نزيد الكمية
      updatedProducts = products.map(p => {
        if (p.id === sourceProduct.id) {
          return { ...p, mainQuantity: p.mainQuantity - quantity };
        }
        if (p.id === targetProduct.id) {
          return { ...p, mainQuantity: p.mainQuantity + quantity };
        }
        return p;
      });
    } else {
      // المنتج غير موجود في المخزن المستهدف - ننشئ منتج جديد
      const newProduct = {
        ...sourceProduct,
        id: Date.now(),
        warehouseId: toWarehouseId,
        mainQuantity: quantity,
        createdAt: new Date().toISOString()
      };
      
      updatedProducts = products.map(p => 
        p.id === sourceProduct.id 
          ? { ...p, mainQuantity: p.mainQuantity - quantity }
          : p
      );
      updatedProducts.push(newProduct);
    }
    
    // حذف المنتجات ذات الكمية صفر
    updatedProducts = updatedProducts.filter(p => p.mainQuantity > 0);
    
    setProducts(updatedProducts);
    saveData('bero_products', updatedProducts);
    
    // حفظ سجل التحويل
    const newTransfer = {
      id: Date.now(),
      date: new Date().toISOString(),
      productId,
      productName: sourceProduct.name,
      fromWarehouseId,
      toWarehouseId,
      quantity,
      notes
    };
    
    const updatedTransfers = [newTransfer, ...transfers];
    setTransfers(updatedTransfers);
    saveData('bero_transfers', updatedTransfers);
    
    return newTransfer;
  };

  // ==================== دوال الأقسام ====================
  
  const addDepartment = (department) => {
    const newDepartment = { id: Date.now(), ...department };
    const updated = [...departments, newDepartment];
    setDepartments(updated);
    saveData('bero_departments', updated);
    return newDepartment;
  };

  const updateDepartment = (id, updatedData) => {
    const updated = departments.map(d => d.id === id ? { ...d, ...updatedData } : d);
    setDepartments(updated);
    saveData('bero_departments', updated);
  };

  const deleteDepartment = (id) => {
    const updated = departments.filter(d => d.id !== id);
    setDepartments(updated);
    saveData('bero_departments', updated);
  };

  // ==================== دوال المناصب ====================
  
  const addPosition = (position) => {
    const newPosition = { id: Date.now(), ...position };
    const updated = [...positions, newPosition];
    setPositions(updated);
    saveData('bero_positions', updated);
    return newPosition;
  };

  const updatePosition = (id, updatedData) => {
    const updated = positions.map(p => p.id === id ? { ...p, ...updatedData } : p);
    setPositions(updated);
    saveData('bero_positions', updated);
  };

  const deletePosition = (id) => {
    const updated = positions.filter(p => p.id !== id);
    setPositions(updated);
    saveData('bero_positions', updated);
  };

  // ==================== دوال الموظفين ====================
  
  const addEmployee = (employee) => {
    const newEmployee = { id: Date.now(), ...employee };
    const updated = [...employees, newEmployee];
    setEmployees(updated);
    saveData('bero_employees', updated);
    return newEmployee;
  };

  const updateEmployee = (id, updatedData) => {
    const updated = employees.map(e => e.id === id ? { ...e, ...updatedData } : e);
    setEmployees(updated);
    saveData('bero_employees', updated);
  };

  const deleteEmployee = (id) => {
    const updated = employees.filter(e => e.id !== id);
    setEmployees(updated);
    saveData('bero_employees', updated);
  };

  // ==================== دوال الحضور ====================
  
  const addAttendance = (attendanceRecord) => {
    const newAttendance = { id: Date.now(), ...attendanceRecord };
    const updated = [...attendance, newAttendance];
    setAttendance(updated);
    saveData('bero_attendance', updated);
    return newAttendance;
  };

  const updateAttendance = (id, updatedData) => {
    const updated = attendance.map(a => a.id === id ? { ...a, ...updatedData } : a);
    setAttendance(updated);
    saveData('bero_attendance', updated);
  };

  const deleteAttendance = (id) => {
    const updated = attendance.filter(a => a.id !== id);
    setAttendance(updated);
    saveData('bero_attendance', updated);
  };

  // ==================== دوال طلبات الإجازات ====================
  
  const addLeaveRequest = (leaveRequest) => {
    const newLeaveRequest = { id: Date.now(), status: 'pending', ...leaveRequest };
    const updated = [...leaveRequests, newLeaveRequest];
    setLeaveRequests(updated);
    saveData('bero_leave_requests', updated);
    return newLeaveRequest;
  };

  const updateLeaveRequest = (id, updatedData) => {
    const updated = leaveRequests.map(l => l.id === id ? { ...l, ...updatedData } : l);
    setLeaveRequests(updated);
    saveData('bero_leave_requests', updated);
  };

  const deleteLeaveRequest = (id) => {
    const updated = leaveRequests.filter(l => l.id !== id);
    setLeaveRequests(updated);
    saveData('bero_leave_requests', updated);
  };

  // ==================== دوال تقييمات الأداء ====================
  
  const addPerformanceReview = (performanceReview) => {
    const newPerformanceReview = { id: Date.now(), ...performanceReview };
    const updated = [...performanceReviews, newPerformanceReview];
    setPerformanceReviews(updated);
    saveData('bero_performance_reviews', updated);
    return newPerformanceReview;
  };

  const updatePerformanceReview = (id, updatedData) => {
    const updated = performanceReviews.map(p => p.id === id ? { ...p, ...updatedData } : p);
    setPerformanceReviews(updated);
    saveData('bero_performance_reviews', updated);
  };

  const deletePerformanceReview = (id) => {
    const updated = performanceReviews.filter(p => p.id !== id);
    setPerformanceReviews(updated);
    saveData('bero_performance_reviews', updated);
  };

  const value = {
    warehouses,
    products,
    categories,
    purchases,
    purchaseInvoices,
    purchaseReturns,
    sales,
    salesInvoices,
    salesReturns,
    suppliers,
    customers,
    treasuryBalance,
    cashReceipts,
    cashDisbursements,
    transfers,
    assetGroups,
    setAssetGroups,
    fixedAssets,
    setFixedAssets,
    maintenanceRecords,
    setMaintenanceRecords,
    disposalRecords,
    setDisposalRecords,
    depreciationMethods,
    departments,
    positions,
    employees,
    attendance,
    leaveRequests,
    performanceReviews,
    addWarehouse,
    updateWarehouse,
    deleteWarehouse,
    addCategory,
    updateCategory,
    deleteCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addPurchaseInvoice,
    updatePurchaseInvoice,
    deletePurchaseInvoice,
    addPurchaseReturn,
    deletePurchaseReturn,
    addSalesInvoice,
    deleteSalesInvoice,
    addSalesReturn,
    deleteSalesReturn,
    addCashReceipt,
    updateCashReceipt,
    deleteCashReceipt,
    addCashDisbursement,
    updateCashDisbursement,
    deleteCashDisbursement,
    getCustomerBalance,
    getSupplierBalance,
    getAllCustomerBalances,
    getAllSupplierBalances,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    addPosition,
    updatePosition,
    deletePosition,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addAttendance,
    updateAttendance,
    deleteAttendance,
    addLeaveRequest,
    updateLeaveRequest,
    deleteLeaveRequest,
    addPerformanceReview,
    updatePerformanceReview,
    deletePerformanceReview,
    // وظائف الأصول الثابتة
    setAssetGroups,
    setFixedAssets,
    setMaintenanceRecords,
    setDisposalRecords,
    transferProduct,
    
    // البيانات المحاسبية
    chartOfAccounts,
    journalEntries,
    bankAccounts,
    payments,
    
    // دوال دليل الحسابات
    addAccount: (account) => {
      const newAccount = { id: Date.now(), ...account };
      const updated = [...chartOfAccounts, newAccount];
      setChartOfAccounts(updated);
      saveData('bero_chart_of_accounts', updated);
      return newAccount;
    },
    updateAccount: (id, updatedData) => {
      const updated = chartOfAccounts.map(acc => acc.id === id ? { ...acc, ...updatedData } : acc);
      setChartOfAccounts(updated);
      saveData('bero_chart_of_accounts', updated);
    },
    deleteAccount: (id) => {
      const updated = chartOfAccounts.filter(acc => acc.id !== id);
      setChartOfAccounts(updated);
      saveData('bero_chart_of_accounts', updated);
    },
    
    // دوال الدفتر اليومية
    setJournalEntries,
    
    // دوال الحسابات البنكية
    addBankAccount: (account) => {
      const newAccount = { id: Date.now(), ...account };
      const updated = [...bankAccounts, newAccount];
      setBankAccounts(updated);
      saveData('bero_bank_accounts', updated);
      return newAccount;
    },
    updateBankAccount: (id, updatedData) => {
      const updated = bankAccounts.map(acc => acc.id === id ? { ...acc, ...updatedData } : acc);
      setBankAccounts(updated);
      saveData('bero_bank_accounts', updated);
    },
    deleteBankAccount: (id) => {
      const updated = bankAccounts.filter(acc => acc.id !== id);
      setBankAccounts(updated);
      saveData('bero_bank_accounts', updated);
    },
    setBankAccounts,
    
    // دوال المدفوعات والمقبوضات
    addPayment: (payment) => {
      const newPayment = { id: Date.now(), ...payment };
      const updated = [...payments, newPayment];
      setPayments(updated);
      saveData('bero_payments', updated);
      return newPayment;
    },
    updatePayment: (id, updatedData) => {
      const updated = payments.map(pay => pay.id === id ? { ...pay, ...updatedData } : pay);
      setPayments(updated);
      saveData('bero_payments', updated);
    },
    deletePayment: (id) => {
      const updated = payments.filter(pay => pay.id !== id);
      setPayments(updated);
      saveData('bero_payments', updated);
    },
    
    // دوال إضافية للمحاسبة
    accounts: chartOfAccounts, // alias للدليل المحاسبي
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
