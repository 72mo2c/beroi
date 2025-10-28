// ======================================
// Bank Accounts - الحسابات البنكية
// ======================================

import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import Card from '../../components/Common/Card';
import Table from '../../components/Common/Table';
import Input from '../../components/Common/Input';
import Select from '../../components/Common/Select';
import Button from '../../components/Common/Button';
import Modal from '../../components/Common/Modal';
import { 
  FaUniversity, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaMoneyBillWave,
  FaArrowUp,
  FaArrowDown,
  FaDownload,
  FaPrint,
  FaEye,
  FaCreditCard,
  FaShieldAlt,
  FaCalendarAlt
} from 'react-icons/fa';

const BankAccounts = () => {
  const { bankAccounts, setBankAccounts, addBankAccount, updateBankAccount, deleteBankAccount, journalEntries } = useData();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTransactionsModal, setShowTransactionsModal] = useState(false);
  const [selectedBankAccount, setSelectedBankAccount] = useState(null);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  
  const [newBankAccount, setNewBankAccount] = useState({
    bankName: '',
    accountNumber: '',
    accountName: '',
    accountType: 'checking',
    currency: 'SAR',
    iban: '',
    swiftCode: '',
    balance: 0,
    isActive: true,
    description: '',
    branch: '',
    contactPhone: '',
    contactPerson: '',
    minimumBalance: 0
  });

  const [newTransaction, setNewTransaction] = useState({
    type: 'deposit', // deposit, withdrawal, transfer
    amount: 0,
    description: '',
    reference: '',
    date: new Date().toISOString().split('T')[0],
    counterparty: '',
    notes: ''
  });

  const accountTypes = {
    'checking': { label: 'حساب جاري', icon: FaCreditCard },
    'savings': { label: 'حساب توفير', icon: FaMoneyBillWave },
    'fixed': { label: 'وديعة ثابتة', icon: FaShieldAlt },
    'credit': { label: 'حساب ائتماني', icon: FaCreditCard }
  };

  // فلترة الحسابات
  const filteredAccounts = bankAccounts.filter(account => {
    const matchesSearch = account.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         account.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         account.accountNumber.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && account.isActive) ||
                         (statusFilter === 'inactive' && !account.isActive);
    
    return matchesSearch && matchesStatus;
  });

  // حساب إجماليات البنوك
  const calculateTotals = () => {
    const totalBalance = filteredAccounts.reduce((sum, account) => sum + (account.balance || 0), 0);
    const activeAccounts = filteredAccounts.filter(account => account.isActive).length;
    const inactiveAccounts = filteredAccounts.filter(account => !account.isActive).length;
    
    const accountsByBank = {};
    filteredAccounts.forEach(account => {
      if (!accountsByBank[account.bankName]) {
        accountsByBank[account.bankName] = {
          name: account.bankName,
          count: 0,
          totalBalance: 0
        };
      }
      accountsByBank[account.bankName].count++;
      accountsByBank[account.bankName].totalBalance += account.balance || 0;
    });
    
    return { totalBalance, activeAccounts, inactiveAccounts, accountsByBank: Object.values(accountsByBank) };
  };

  const totals = calculateTotals();

  // إضافة حساب بنكي جديد
  const handleAddBankAccount = () => {
    if (!newBankAccount.bankName || !newBankAccount.accountNumber || !newBankAccount.accountName) {
      alert('يرجى إدخال اسم البنك ورقم الحساب واسم الحساب');
      return;
    }

    // التحقق من عدم تكرار رقم الحساب
    if (bankAccounts.some(acc => acc.accountNumber === newBankAccount.accountNumber)) {
      alert('رقم الحساب موجود مسبقاً');
      return;
    }

    const accountData = {
      ...newBankAccount,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      transactions: []
    };

    addBankAccount(accountData);
    resetForm();
    setShowAddModal(false);
  };

  // تعديل الحساب البنكي
  const handleEditBankAccount = () => {
    if (!selectedBankAccount.bankName || !selectedBankAccount.accountNumber || !selectedBankAccount.accountName) {
      alert('يرجى إدخال اسم البنك ورقم الحساب واسم الحساب');
      return;
    }

    updateBankAccount(selectedBankAccount.id, selectedBankAccount);
    setShowEditModal(false);
    setSelectedBankAccount(null);
  };

  // حذف الحساب البنكي
  const handleDeleteBankAccount = (account) => {
    if (window.confirm(`هل أنت متأكد من حذف الحساب "${account.accountName}"؟`)) {
      deleteBankAccount(account.id);
    }
  };

  // إضافة معاملة جديدة
  const handleAddTransaction = () => {
    if (!newTransaction.amount || newTransaction.amount <= 0) {
      alert('يرجى إدخال مبلغ صحيح');
      return;
    }

    if (!newTransaction.description) {
      alert('يرجى إدخال وصف المعاملة');
      return;
    }

    // تحديث رصيد الحساب
    const accountIndex = bankAccounts.findIndex(acc => acc.id === selectedBankAccount.id);
    if (accountIndex !== -1) {
      const updatedAccount = { ...bankAccounts[accountIndex] };
      
      // تحديث الرصيد حسب نوع المعاملة
      if (newTransaction.type === 'deposit' || newTransaction.type === 'transfer_in') {
        updatedAccount.balance += newTransaction.amount;
      } else if (newTransaction.type === 'withdrawal' || newTransaction.type === 'transfer_out') {
        updatedAccount.balance -= newTransaction.amount;
      }

      // إضافة المعاملة للتاريخ
      const transaction = {
        id: Date.now(),
        ...newTransaction,
        date: newTransaction.date,
        balanceAfter: updatedAccount.balance,
        createdAt: new Date().toISOString()
      };

      if (!updatedAccount.transactions) {
        updatedAccount.transactions = [];
      }
      updatedAccount.transactions.push(transaction);

      // تحديث الحساب في القائمة
      const updatedAccounts = [...bankAccounts];
      updatedAccounts[accountIndex] = updatedAccount;
      setBankAccounts(updatedAccounts);

      // تحديث الرصيد في النظام المحاسبي (إذا كان هناك حساب مرتبط)
      // يمكن إضافة منطق ربط الحسابات البنكية بالحسابات المحاسبية هنا

      setNewTransaction({
        type: 'deposit',
        amount: 0,
        description: '',
        reference: '',
        date: new Date().toISOString().split('T')[0],
        counterparty: '',
        notes: ''
      });
      setShowTransactionForm(false);
    }
  };

  // إعادة تعيين النموذج
  const resetForm = () => {
    setNewBankAccount({
      bankName: '',
      accountNumber: '',
      accountName: '',
      accountType: 'checking',
      currency: 'SAR',
      iban: '',
      swiftCode: '',
      balance: 0,
      isActive: true,
      description: '',
      branch: '',
      contactPhone: '',
      contactPerson: '',
      minimumBalance: 0
    });
  };

  // تصدير البيانات
  const handleExport = () => {
    const csvContent = [
      ['اسم البنك', 'رقم الحساب', 'اسم الحساب', 'النوع', 'العملة', 'الرصيد', 'الحالة', 'الفرع'],
      ...filteredAccounts.map(account => [
        account.bankName,
        account.accountNumber,
        account.accountName,
        accountTypes[account.accountType]?.label || account.accountType,
        account.currency,
        (account.balance || 0).toFixed(2),
        account.isActive ? 'نشط' : 'غير نشط',
        account.branch || '-'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `الحسابات_البنكية_${new Date().toLocaleDateString('ar-EG')}.csv`;
    link.click();
  };

  // أعمدة الجدول
  const columns = [
    {
      header: 'اسم البنك',
      accessor: 'bankName',
      render: (row) => (
        <div className="flex items-center gap-2">
          <FaUniversity className="text-gray-500" />
          <span className="font-semibold">{row.bankName}</span>
        </div>
      )
    },
    {
      header: 'رقم الحساب',
      accessor: 'accountNumber',
      render: (row) => (
        <span className="font-mono font-semibold text-blue-600">{row.accountNumber}</span>
      )
    },
    {
      header: 'اسم الحساب',
      accessor: 'accountName',
      render: (row) => row.accountName
    },
    {
      header: 'النوع',
      accessor: 'accountType',
      render: (row) => {
        const TypeIcon = accountTypes[row.accountType]?.icon || FaCreditCard;
        return (
          <div className="flex items-center gap-2">
            <TypeIcon className="text-gray-500" />
            <span>{accountTypes[row.accountType]?.label || row.accountType}</span>
          </div>
        );
      }
    },
    {
      header: 'الرصيد',
      accessor: 'balance',
      render: (row) => (
        <span className={`font-bold text-lg ${row.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {row.balance.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} {row.currency}
        </span>
      )
    },
    {
      header: 'الحد الأدنى',
      accessor: 'minimumBalance',
      render: (row) => (
        <span className="text-gray-600">
          {row.minimumBalance.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} {row.currency}
        </span>
      )
    },
    {
      header: 'الحالة',
      accessor: 'isActive',
      render: (row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          row.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {row.isActive ? 'نشط' : 'غير نشط'}
        </span>
      )
    },
    {
      header: 'الإجراءات',
      accessor: 'actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedBankAccount(row);
              setShowTransactionsModal(true);
            }}
          >
            <FaEye />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedBankAccount(row);
              setShowEditModal(true);
            }}
          >
            <FaEdit />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeleteBankAccount(row)}
            className="text-red-600 hover:bg-red-50"
          >
            <FaTrash />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FaUniversity className="text-blue-600" />
            الحسابات البنكية
          </h1>
          <p className="text-gray-600 mt-2">إدارة ومراقبة الحسابات البنكية للشركة</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleExport} variant="outline">
            <FaDownload className="ml-2" />
            تصدير Excel
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <FaPlus className="ml-2" />
            إضافة حساب
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">إجمالي الحسابات</p>
              <p className="text-3xl font-bold">{filteredAccounts.length}</p>
            </div>
            <FaUniversity className="text-4xl text-blue-200" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">الحسابات النشطة</p>
              <p className="text-3xl font-bold">{totals.activeAccounts}</p>
            </div>
            <FaShieldAlt className="text-4xl text-green-200" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">إجمالي الأرصدة</p>
              <p className="text-2xl font-bold">
                {totals.totalBalance.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <FaMoneyBillWave className="text-4xl text-purple-200" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">عدد البنوك</p>
              <p className="text-3xl font-bold">{totals.accountsByBank.length}</p>
            </div>
            <FaUniversity className="text-4xl text-orange-200" />
          </div>
        </Card>
      </div>

      {/* Banks Summary */}
      {totals.accountsByBank.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">ملخص البنوك</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {totals.accountsByBank.map((bank, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{bank.name}</p>
                    <p className="text-sm text-gray-600">{bank.count} حساب</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">
                      {bank.totalBalance.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-gray-500">إجمالي الرصيد</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="البحث في الحسابات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={FaSearch}
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'كل الحالات' },
              { value: 'active', label: 'نشط' },
              { value: 'inactive', label: 'غير نشط' }
            ]}
          />
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              عرض {filteredAccounts.length} من {bankAccounts.length} حساب
            </span>
          </div>
        </div>
      </Card>

      {/* Bank Accounts Table */}
      <Card>
        <Table
          columns={columns}
          data={filteredAccounts}
          noDataMessage="لا توجد حسابات بنكية"
        />
      </Card>

      {/* Add Bank Account Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="إضافة حساب بنكي جديد"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="اسم البنك"
              value={newBankAccount.bankName}
              onChange={(e) => setNewBankAccount({ ...newBankAccount, bankName: e.target.value })}
              placeholder="مثال: البنك الأهلي"
            />
            <Input
              label="رقم الحساب"
              value={newAccount.accountNumber}
              onChange={(e) => setNewBankAccount({ ...newBankAccount, accountNumber: e.target.value })}
              placeholder="مثال: 123456789"
            />
          </div>
          
          <Input
            label="اسم الحساب"
            value={newBankAccount.accountName}
            onChange={(e) => setNewBankAccount({ ...newBankAccount, accountName: e.target.value })}
            placeholder="اسم الحساب كما يظهر في البنك"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="نوع الحساب"
              value={newBankAccount.accountType}
              onChange={(e) => setNewBankAccount({ ...newBankAccount, accountType: e.target.value })}
              options={Object.entries(accountTypes).map(([key, value]) => ({
                value: key,
                label: value.label
              }))}
            />
            <Select
              label="العملة"
              value={newBankAccount.currency}
              onChange={(e) => setNewBankAccount({ ...newBankAccount, currency: e.target.value })}
              options={[
                { value: 'SAR', label: 'ريال سعودي' },
                { value: 'USD', label: 'دولار أمريكي' },
                { value: 'EUR', label: 'يورو' },
                { value: 'AED', label: 'درهم إماراتي' }
              ]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="الرصيد الافتتاحي"
              type="number"
              step="0.01"
              value={newBankAccount.balance}
              onChange={(e) => setNewBankAccount({ ...newBankAccount, balance: parseFloat(e.target.value) || 0 })}
            />
            <Input
              label="الحد الأدنى للرصيد"
              type="number"
              step="0.01"
              value={newBankAccount.minimumBalance}
              onChange={(e) => setNewBankAccount({ ...newBankAccount, minimumBalance: parseFloat(e.target.value) || 0 })}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="رقم IBAN"
              value={newBankAccount.iban}
              onChange={(e) => setNewBankAccount({ ...newBankAccount, iban: e.target.value })}
              placeholder="مثال: SA1234567890123456789012"
            />
            <Input
              label="رمز Swift"
              value={newBankAccount.swiftCode}
              onChange={(e) => setNewBankAccount({ ...newBankAccount, swiftCode: e.target.value })}
              placeholder="مثال: ANBKSARIE"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="فرع البنك"
              value={newBankAccount.branch}
              onChange={(e) => setNewBankAccount({ ...newBankAccount, branch: e.target.value })}
              placeholder="اسم الفرع"
            />
            <Input
              label="الشخص المسؤول"
              value={newBankAccount.contactPerson}
              onChange={(e) => setNewBankAccount({ ...newBankAccount, contactPerson: e.target.value })}
              placeholder="اسم الشخص المسؤول"
            />
          </div>
          
          <Input
            label="هاتف الاتصال"
            value={newBankAccount.contactPhone}
            onChange={(e) => setNewBankAccount({ ...newBankAccount, contactPhone: e.target.value })}
            placeholder="رقم هاتف البنك"
          />
          
          <Input
            label="الوصف"
            value={newBankAccount.description}
            onChange={(e) => setNewBankAccount({ ...newBankAccount, description: e.target.value })}
            placeholder="وصف إضافي للحساب..."
          />
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={newBankAccount.isActive}
              onChange={(e) => setNewBankAccount({ ...newBankAccount, isActive: e.target.checked })}
              className="rounded border-gray-300"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">الحساب نشط</label>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              إلغاء
            </Button>
            <Button onClick={handleAddBankAccount}>
              إضافة الحساب
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Bank Account Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="تعديل الحساب البنكي"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="اسم البنك"
              value={selectedBankAccount?.bankName || ''}
              onChange={(e) => setSelectedBankAccount({ ...selectedBankAccount, bankName: e.target.value })}
            />
            <Input
              label="رقم الحساب"
              value={selectedBankAccount?.accountNumber || ''}
              onChange={(e) => setSelectedBankAccount({ ...selectedBankAccount, accountNumber: e.target.value })}
              disabled
            />
          </div>
          
          <Input
            label="اسم الحساب"
            value={selectedBankAccount?.accountName || ''}
            onChange={(e) => setSelectedBankAccount({ ...selectedBankAccount, accountName: e.target.value })}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="الرصيد الحالي"
              type="number"
              step="0.01"
              value={selectedBankAccount?.balance || 0}
              onChange={(e) => setSelectedBankAccount({ ...selectedBankAccount, balance: parseFloat(e.target.value) || 0 })}
            />
            <Input
              label="الحد الأدنى للرصيد"
              type="number"
              step="0.01"
              value={selectedBankAccount?.minimumBalance || 0}
              onChange={(e) => setSelectedBankAccount({ ...selectedBankAccount, minimumBalance: parseFloat(e.target.value) || 0 })}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="editIsActive"
              checked={selectedBankAccount?.isActive || false}
              onChange={(e) => setSelectedBankAccount({ ...selectedBankAccount, isActive: e.target.checked })}
              className="rounded border-gray-300"
            />
            <label htmlFor="editIsActive" className="text-sm text-gray-700">الحساب نشط</label>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              إلغاء
            </Button>
            <Button onClick={handleEditBankAccount}>
              حفظ التعديل
            </Button>
          </div>
        </div>
      </Modal>

      {/* Transactions Modal */}
      <Modal
        isOpen={showTransactionsModal}
        onClose={() => setShowTransactionsModal(false)}
        title={`معاملات ${selectedBankAccount?.accountName}`}
        size="xl"
      >
        {selectedBankAccount && (
          <div className="space-y-6">
            {/* Account Info */}
            <Card className="bg-blue-50">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">الرصيد الحالي</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {(selectedBankAccount.balance || 0).toLocaleString('ar-EG', { minimumFractionDigits: 2 })} {selectedBankAccount.currency}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">الحد الأدنى</p>
                  <p className="text-lg font-semibold">
                    {(selectedBankAccount.minimumBalance || 0).toLocaleString('ar-EG', { minimumFractionDigits: 2 })} {selectedBankAccount.currency}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">البنك</p>
                  <p className="text-lg font-semibold">{selectedBankAccount.bankName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">النوع</p>
                  <p className="text-lg font-semibold">{accountTypes[selectedBankAccount.accountType]?.label || selectedBankAccount.accountType}</p>
                </div>
              </div>
            </Card>

            {/* Add Transaction Button */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">معاملات الحساب</h3>
              <Button onClick={() => setShowTransactionForm(true)}>
                <FaPlus className="ml-2" />
                إضافة معاملة
              </Button>
            </div>

            {/* Transaction Form */}
            {showTransactionForm && (
              <Card className="bg-gray-50">
                <h4 className="font-semibold mb-4">إضافة معاملة جديدة</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="نوع المعاملة"
                    value={newTransaction.type}
                    onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
                    options={[
                      { value: 'deposit', label: 'إيداع' },
                      { value: 'withdrawal', label: 'سحب' },
                      { value: 'transfer_in', label: 'تحويل داخلي (وارد)' },
                      { value: 'transfer_out', label: 'تحويل داخلي (صادر)' }
                    ]}
                  />
                  <Input
                    label="المبلغ"
                    type="number"
                    step="0.01"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: parseFloat(e.target.value) || 0 })}
                  />
                  <Input
                    label="الوصف"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                    placeholder="وصف المعاملة"
                  />
                  <Input
                    label="المرجع"
                    value={newTransaction.reference}
                    onChange={(e) => setNewTransaction({ ...newTransaction, reference: e.target.value })}
                    placeholder="رقم المرجع"
                  />
                  <Input
                    label="التاريخ"
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                  />
                  <Input
                    label="الطرف المقابل"
                    value={newTransaction.counterparty}
                    onChange={(e) => setNewTransaction({ ...newTransaction, counterparty: e.target.value })}
                    placeholder="اسم البنك أو الجهة"
                  />
                </div>
                <Input
                  label="ملاحظات"
                  value={newTransaction.notes}
                  onChange={(e) => setNewTransaction({ ...newTransaction, notes: e.target.value })}
                  placeholder="ملاحظات إضافية"
                />
                <div className="flex justify-end gap-3 mt-4">
                  <Button variant="outline" onClick={() => setShowTransactionForm(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={handleAddTransaction}>
                    إضافة المعاملة
                  </Button>
                </div>
              </Card>
            )}

            {/* Transactions List */}
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">التاريخ</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">النوع</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">الوصف</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">المرجع</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">المبلغ</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">الرصيد بعد المعاملة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(selectedBankAccount.transactions || []).slice().reverse().map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {new Date(transaction.date).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          transaction.type === 'deposit' || transaction.type === 'transfer_in' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {transaction.type === 'deposit' ? 'إيداع' :
                           transaction.type === 'withdrawal' ? 'سحب' :
                           transaction.type === 'transfer_in' ? 'تحويل وارد' :
                           transaction.type === 'transfer_out' ? 'تحويل صادر' : transaction.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          {transaction.counterparty && (
                            <p className="text-sm text-gray-500">{transaction.counterparty}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-sm">{transaction.reference || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`font-bold ${
                          transaction.type === 'deposit' || transaction.type === 'transfer_in' 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {(transaction.type === 'deposit' || transaction.type === 'transfer_in' ? '+' : '-')}
                          {transaction.amount.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold ${
                          transaction.balanceAfter >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.balanceAfter.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!selectedBankAccount.transactions || selectedBankAccount.transactions.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  لا توجد معاملات في هذا الحساب
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setShowTransactionsModal(false)}>
                إغلاق
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BankAccounts;