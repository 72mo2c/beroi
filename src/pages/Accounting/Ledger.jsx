// ======================================
// Ledger - دفتر الأستاذ
// ======================================

import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import Card from '../../components/Common/Card';
import Table from '../../components/Common/Table';
import Input from '../../components/Common/Input';
import Select from '../../components/Common/Select';
import Button from '../../components/Common/Button';
import Modal from '../../components/Common/Modal';
import { 
  FaBook, 
  FaSearch, 
  FaCalendar, 
  FaFilter, 
  FaDownload,
  FaBalanceScale,
  FaArrowRight,
  FaArrowLeft,
  FaPrint,
  FaFileAlt,
  FaUser
} from 'react-icons/fa';

const Ledger = () => {
  const { accounts, journalEntries } = useData();
  
  const [selectedAccount, setSelectedAccount] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  
  // حساب أرصدة الحسابات
  const calculateAccountBalances = () => {
    const accountBalances = {};
    
    // تهيئة أرصدة الحسابات
    accounts.forEach(account => {
      accountBalances[account.code] = {
        account: account,
        openingBalance: account.balance || 0,
        debitTotal: 0,
        creditTotal: 0,
        closingBalance: account.balance || 0,
        transactions: []
      };
    });
    
    // تجميع قيود الدفتر اليومية حسب الحسابات
    journalEntries.forEach(entry => {
      if (entry.status === 'posted') {
        entry.entries.forEach(line => {
          if (accountBalances[line.accountCode]) {
            accountBalances[line.accountCode].transactions.push({
              ...line,
              entryDate: entry.date,
              entryDescription: entry.description,
              entryId: entry.id,
              entryReference: entry.reference
            });
            
            accountBalances[line.accountCode].debitTotal += parseFloat(line.debit) || 0;
            accountBalances[line.accountCode].creditTotal += parseFloat(line.credit) || 0;
          }
        });
      }
    });
    
    // حساب الأرصدة الختامية
    Object.values(accountBalances).forEach(accountBalance => {
      accountBalance.closingBalance = accountBalance.openingBalance + 
        accountBalance.debitTotal - accountBalance.creditTotal;
    });
    
    return accountBalances;
  };

  const accountBalances = calculateAccountBalances();
  
  // فلترة الحركات حسب التاريخ
  const filterTransactionsByDate = (transactions) => {
    if (!dateFrom && !dateTo) return transactions;
    
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.entryDate);
      const fromDate = dateFrom ? new Date(dateFrom) : null;
      const toDate = dateTo ? new Date(dateTo) : null;
      
      if (fromDate && transactionDate < fromDate) return false;
      if (toDate && transactionDate > toDate) return false;
      
      return true;
    });
  };

  // الحصول على الحركات المفلترة للحساب المحدد
  const getFilteredTransactions = () => {
    if (!selectedAccount) return [];
    
    const accountBalance = accountBalances[selectedAccount];
    if (!accountBalance) return [];
    
    let transactions = filterTransactionsByDate(accountBalance.transactions);
    
    // ترتيب الحركات حسب التاريخ
    transactions.sort((a, b) => new Date(b.entryDate) - new Date(a.entryDate));
    
    return transactions;
  };

  const filteredTransactions = getFilteredTransactions();
  
  // حساب الرصيد التراكمي
  const calculateRunningBalance = () => {
    const transactions = [...filteredTransactions];
    const runningBalance = [];
    
    let balance = accountBalances[selectedAccount]?.openingBalance || 0;
    
    // حساب الرصيد الافتتاحي + الحركات في الفترة المختارة
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      const openingTransactions = accountBalances[selectedAccount]?.transactions.filter(
        t => new Date(t.entryDate) < fromDate
      ) || [];
      
      const openingDebit = openingTransactions.reduce((sum, t) => sum + (parseFloat(t.debit) || 0), 0);
      const openingCredit = openingTransactions.reduce((sum, t) => sum + (parseFloat(t.credit) || 0), 0);
      balance = (accountBalances[selectedAccount]?.openingBalance || 0) + openingDebit - openingCredit;
    }
    
    // حساب الرصيد بعد كل حركة
    for (let i = 0; i < transactions.length; i++) {
      const transaction = transactions[i];
      balance += (parseFloat(transaction.debit) || 0) - (parseFloat(transaction.credit) || 0);
      runningBalance.push({
        ...transaction,
        runningBalance: balance
      });
    }
    
    return runningBalance;
  };

  const runningBalanceTransactions = calculateRunningBalance();

  // حساب الإحصائيات
  const totalAccounts = accounts.length;
  const accountsWithTransactions = Object.keys(accountBalances).filter(
    code => accountBalances[code].transactions.length > 0
  ).length;
  const totalDebitAmount = Object.values(accountBalances).reduce(
    (sum, acc) => sum + acc.debitTotal, 0
  );
  const totalCreditAmount = Object.values(accountBalances).reduce(
    (sum, acc) => sum + acc.creditTotal, 0
  );

  // أعمدة الجدول
  const ledgerColumns = [
    {
      header: 'التاريخ',
      accessor: 'entryDate',
      render: (row) => new Date(row.entryDate).toLocaleDateString('ar-EG')
    },
    {
      header: 'رقم القيد',
      accessor: 'entryId',
      render: (row) => (
        <span className="font-semibold text-blue-600">#{row.entryId}</span>
      )
    },
    {
      header: 'المرجع',
      accessor: 'entryReference',
      render: (row) => row.entryReference || '-'
    },
    {
      header: 'الوصف',
      accessor: 'description',
      render: (row) => (
        <div className="max-w-xs">
          <p className="font-medium truncate">{row.entryDescription}</p>
          {row.description && (
            <p className="text-sm text-gray-500 truncate">{row.description}</p>
          )}
        </div>
      )
    },
    {
      header: 'مدين',
      accessor: 'debit',
      render: (row) => (
        <span className="text-green-600 font-semibold">
          {row.debit ? parseFloat(row.debit).toLocaleString('ar-EG', { minimumFractionDigits: 2 }) : '-'}
        </span>
      )
    },
    {
      header: 'دائن',
      accessor: 'credit',
      render: (row) => (
        <span className="text-blue-600 font-semibold">
          {row.credit ? parseFloat(row.credit).toLocaleString('ar-EG', { minimumFractionDigits: 2 }) : '-'}
        </span>
      )
    },
    {
      header: 'الرصيد',
      accessor: 'runningBalance',
      render: (row) => (
        <span className={`font-semibold ${row.runningBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {row.runningBalance.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
        </span>
      )
    }
  ];

  // أعمدة ملخص الحسابات
  const summaryColumns = [
    {
      header: 'رمز الحساب',
      accessor: 'code',
      render: (row) => (
        <span className="font-mono font-semibold">{row.account.code}</span>
      )
    },
    {
      header: 'اسم الحساب',
      accessor: 'name',
      render: (row) => (
        <div>
          <p className="font-semibold">{row.account.name}</p>
          <p className="text-sm text-gray-500">
            {row.account.type === 'asset' ? 'أصل' :
             row.account.type === 'liability' ? 'خصم' :
             row.account.type === 'equity' ? 'حقوق ملكية' :
             row.account.type === 'revenue' ? 'إيراد' :
             row.account.type === 'expense' ? 'مصروف' : 'تكلفة'}
          </p>
        </div>
      )
    },
    {
      header: 'الرصيد الافتتاحي',
      accessor: 'openingBalance',
      render: (row) => (
        <span className={`font-semibold ${row.openingBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {row.openingBalance.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
        </span>
      )
    },
    {
      header: 'إجمالي المدين',
      accessor: 'debitTotal',
      render: (row) => (
        <span className="text-green-600 font-semibold">
          {row.debitTotal.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
        </span>
      )
    },
    {
      header: 'إجمالي الدائن',
      accessor: 'creditTotal',
      render: (row) => (
        <span className="text-blue-600 font-semibold">
          {row.creditTotal.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
        </span>
      )
    },
    {
      header: 'الرصيد الختامي',
      accessor: 'closingBalance',
      render: (row) => (
        <span className={`font-bold ${row.closingBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {row.closingBalance.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
        </span>
      )
    },
    {
      header: 'عدد الحركات',
      accessor: 'transactions',
      render: (row) => (
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
          {row.transactions.length}
        </span>
      )
    },
    {
      header: 'الإجراءات',
      accessor: 'actions',
      render: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedAccount(row.account.code);
            setShowAccountModal(false);
          }}
        >
          <FaFileAlt className="ml-1" />
          عرض التفاصيل
        </Button>
      )
    }
  ];

  const handleExport = () => {
    const csvContent = [
      ['رمز الحساب', 'اسم الحساب', 'الرصة الافتتاحية', 'إجمالي المدين', 'إجمالي الدائن', 'الرصيد الختامي', 'عدد الحركات'],
      ...Object.values(accountBalances).map(acc => [
        acc.account.code,
        acc.account.name,
        acc.openingBalance.toFixed(2),
        acc.debitTotal.toFixed(2),
        acc.creditTotal.toFixed(2),
        acc.closingBalance.toFixed(2),
        acc.transactions.length
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `دفتر_الأستاذ_${new Date().toLocaleDateString('ar-EG')}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FaBook className="text-blue-600" />
            دفتر الأستاذ
          </h1>
          <p className="text-gray-600 mt-2">عرض تفصيلي لحركات وأرصدة الحسابات</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleExport} variant="outline">
            <FaDownload className="ml-2" />
            تصدير Excel
          </Button>
          <Button onClick={() => setShowAccountModal(true)}>
            <FaFilter className="ml-2" />
            اختيار حساب
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">إجمالي الحسابات</p>
              <p className="text-3xl font-bold">{totalAccounts}</p>
            </div>
            <FaBalanceScale className="text-4xl text-blue-200" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">حسابات لها حركات</p>
              <p className="text-3xl font-bold">{accountsWithTransactions}</p>
            </div>
            <FaArrowRight className="text-4xl text-green-200" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">إجمالي المدين</p>
              <p className="text-2xl font-bold">
                {totalDebitAmount.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <FaArrowRight className="text-4xl text-purple-200" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">إجمالي الدائن</p>
              <p className="text-2xl font-bold">
                {totalCreditAmount.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <FaArrowLeft className="text-4xl text-orange-200" />
          </div>
        </Card>
      </div>

      {/* Account Summary Modal */}
      <Modal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        title="ملخص حسابات الأستاذ"
        size="xl"
      >
        <div className="space-y-4">
          <Table
            columns={summaryColumns}
            data={Object.values(accountBalances)}
            noDataMessage="لا توجد حسابات"
          />
        </div>
      </Modal>

      {/* Selected Account Details */}
      {selectedAccount && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <FaUser className="text-blue-600" />
                حساب: {accountBalances[selectedAccount]?.account.name}
              </h2>
              <p className="text-gray-600 mt-1">
                رمز الحساب: {selectedAccount} | 
                نوع الحساب: {
                  accountBalances[selectedAccount]?.account.type === 'asset' ? 'أصل' :
                  accountBalances[selectedAccount]?.account.type === 'liability' ? 'خصم' :
                  accountBalances[selectedAccount]?.account.type === 'equity' ? 'حقوق ملكية' :
                  accountBalances[selectedAccount]?.account.type === 'revenue' ? 'إيراد' :
                  accountBalances[selectedAccount]?.account.type === 'expense' ? 'مصروف' : 'تكلفة'
                }
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setSelectedAccount('')}
            >
              إخفاء التفاصيل
            </Button>
          </div>

          {/* Account Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Input
              type="date"
              label="من تاريخ"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              icon={FaCalendar}
            />
            <Input
              type="date"
              label="إلى تاريخ"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              icon={FaCalendar}
            />
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setDateFrom('');
                  setDateTo('');
                }}
                className="w-full"
              >
                مسح الفلاتر
              </Button>
            </div>
          </div>

          {/* Account Balance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-blue-50">
              <div className="text-center">
                <p className="text-sm text-blue-600">الرصيد الافتتاحي</p>
                <p className="text-2xl font-bold text-blue-700">
                  {(accountBalances[selectedAccount]?.openingBalance || 0).toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </Card>
            <Card className="bg-green-50">
              <div className="text-center">
                <p className="text-sm text-green-600">إجمالي المدين</p>
                <p className="text-2xl font-bold text-green-700">
                  {(accountBalances[selectedAccount]?.debitTotal || 0).toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </Card>
            <Card className="bg-orange-50">
              <div className="text-center">
                <p className="text-sm text-orange-600">إجمالي الدائن</p>
                <p className="text-2xl font-bold text-orange-700">
                  {(accountBalances[selectedAccount]?.creditTotal || 0).toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </Card>
            <Card className="bg-purple-50">
              <div className="text-center">
                <p className="text-sm text-purple-600">الرصيد الختامي</p>
                <p className={`text-2xl font-bold ${
                  (accountBalances[selectedAccount]?.closingBalance || 0) >= 0 ? 'text-green-700' : 'text-red-700'
                }`}>
                  {(accountBalances[selectedAccount]?.closingBalance || 0).toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </Card>
          </div>

          {/* Transactions Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">حركات الحساب</h3>
              <span className="text-sm text-gray-600">
                عرض {filteredTransactions.length} حركة
                {dateFrom && dateTo && ` في الفترة من ${new Date(dateFrom).toLocaleDateString('ar-EG')} إلى ${new Date(dateTo).toLocaleDateString('ar-EG')}`}
              </span>
            </div>

            <Table
              columns={ledgerColumns}
              data={runningBalanceTransactions}
              noDataMessage="لا توجد حركات في الفترة المحددة"
            />
          </div>

          {/* Running Balance Summary */}
          {runningBalanceTransactions.length > 0 && (
            <Card className="bg-gray-50 border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">الرصيد قبل الفترة</p>
                  <p className="text-xl font-bold text-gray-700">
                    {dateFrom ? (
                      (accountBalances[selectedAccount]?.openingBalance || 0).toLocaleString('ar-EG', { minimumFractionDigits: 2 })
                    ) : (
                      (accountBalances[selectedAccount]?.openingBalance || 0).toLocaleString('ar-EG', { minimumFractionDigits: 2 })
                    )}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">الرصيد الحالي</p>
                  <p className="text-xl font-bold text-gray-700">
                    {runningBalanceTransactions.length > 0 
                      ? runningBalanceTransactions[runningBalanceTransactions.length - 1].runningBalance.toLocaleString('ar-EG', { minimumFractionDigits: 2 })
                      : (accountBalances[selectedAccount]?.openingBalance || 0).toLocaleString('ar-EG', { minimumFractionDigits: 2 })
                    }
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">التغيير في الفترة</p>
                  <p className={`text-xl font-bold ${
                    (runningBalanceTransactions.length > 0 
                      ? runningBalanceTransactions[runningBalanceTransactions.length - 1].runningBalance - (accountBalances[selectedAccount]?.openingBalance || 0)
                      : 0) >= 0 ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {(runningBalanceTransactions.length > 0 
                      ? runningBalanceTransactions[runningBalanceTransactions.length - 1].runningBalance - (accountBalances[selectedAccount]?.openingBalance || 0)
                      : 0).toLocaleString('ar-EG', { minimumFractionDigits: 2 })
                    }
                  </p>
                </div>
              </div>
            </Card>
          )}
        </Card>
      )}

      {/* Quick Account Selection */}
      {!selectedAccount && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(accountBalances)
            .filter(acc => acc.transactions.length > 0)
            .sort((a, b) => b.transactions.length - a.transactions.length)
            .slice(0, 6)
            .map(({ account, transactions, debitTotal, creditTotal, closingBalance }) => (
            <Card 
              key={account.code}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedAccount(account.code)}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{account.name}</p>
                    <p className="text-sm text-gray-500 font-mono">{account.code}</p>
                  </div>
                  <FaFileAlt className="text-gray-400" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">الحركات</p>
                    <p className="font-semibold">{transactions.length}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">الرصيد</p>
                    <p className={`font-semibold ${closingBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {closingBalance.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">المدين: {debitTotal.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}</span>
                  <span className="text-gray-600">الدائن: {creditTotal.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Ledger;