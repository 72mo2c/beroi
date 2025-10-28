// ======================================
// Balance Sheet - الميزانية العمومية
// ======================================

import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import Card from '../../components/Common/Card';
import Table from '../../components/Common/Table';
import Input from '../../components/Common/Input';
import Select from '../../components/Common/Select';
import Button from '../../components/Common/Button';
import { 
  FaBalanceScale, 
  FaDownload, 
  FaCalendar, 
  FaPrint,
  FaArrowUp,
  FaArrowDown,
  FaMoneyBillWave,
  FaBuilding,
  FaChartPie
} from 'react-icons/fa';

const BalanceSheet = () => {
  const { accounts, journalEntries } = useData();
  
  const [asOfDate, setAsOfDate] = useState(new Date().toISOString().split('T')[0]);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonDate, setComparisonDate] = useState('');
  const [viewMode, setViewMode] = useState('detailed'); // detailed, summary
  
  // حساب أرصدة الحسابات في تاريخ معين
  const calculateAccountBalancesAsOfDate = (targetDate) => {
    const accountBalances = {};
    
    // تهيئة أرصدة الحسابات
    accounts.forEach(account => {
      accountBalances[account.code] = {
        account: account,
        openingBalance: account.balance || 0,
        transactions: [],
        debitTotal: 0,
        creditTotal: 0,
        closingBalance: account.balance || 0
      };
    });
    
    // تجميع قيود الدفتر اليومية حتى التاريخ المحدد
    journalEntries.forEach(entry => {
      if (entry.status === 'posted') {
        const entryDate = new Date(entry.date);
        const targetDateTime = new Date(targetDate);
        
        if (entryDate <= targetDateTime) {
          entry.entries.forEach(line => {
            if (accountBalances[line.accountCode]) {
              accountBalances[line.accountCode].transactions.push({
                ...line,
                entryDate: entry.date,
                entryDescription: entry.description,
                entryReference: entry.reference
              });
              
              accountBalances[line.accountCode].debitTotal += parseFloat(line.debit) || 0;
              accountBalances[line.accountCode].creditTotal += parseFloat(line.credit) || 0;
            }
          });
        }
      }
    });
    
    // حساب الأرصدة
    Object.values(accountBalances).forEach(accountBalance => {
      accountBalance.closingBalance = accountBalance.openingBalance + 
        accountBalance.debitTotal - accountBalance.creditTotal;
    });
    
    return accountBalances;
  };

  const accountBalances = calculateAccountBalancesAsOfDate(asOfDate);
  const comparisonBalances = showComparison && comparisonDate ? calculateAccountBalancesAsOfDate(comparisonDate) : null;

  // تجميع الحسابات حسب النوع
  const organizeBalanceSheet = () => {
    const balanceSheet = {
      assets: {
        title: 'الأصول',
        subgroups: {},
        total: 0
      },
      liabilities: {
        title: 'الخصوم',
        subgroups: {},
        total: 0
      },
      equity: {
        title: 'حقوق الملكية',
        subgroups: {},
        total: 0
      }
    };

    // تجميع الحسابات حسب النوع والمجموعة الفرعية
    Object.values(accountBalances).forEach(({ account, closingBalance }) => {
      const accountType = account.type;
      let mainCategory, subgroupKey, subgroupTitle;
      
      if (accountType === 'asset') {
        mainCategory = 'assets';
        if (account.code.startsWith('1')) {
          subgroupKey = 'current_assets';
          subgroupTitle = 'الأصول المتداولة';
        } else {
          subgroupKey = 'fixed_assets';
          subgroupTitle = 'الأصول الثابتة';
        }
      } else if (accountType === 'liability') {
        mainCategory = 'liabilities';
        if (account.code.startsWith('2')) {
          subgroupKey = 'current_liabilities';
          subgroupTitle = 'الخصوم المتداولة';
        } else {
          subgroupKey = 'long_term_liabilities';
          subgroupTitle = 'الخصوم طويلة الأجل';
        }
      } else if (accountType === 'equity') {
        mainCategory = 'equity';
        if (account.code.startsWith('3')) {
          subgroupKey = 'capital';
          subgroupTitle = 'رأس المال';
        } else {
          subgroupKey = 'retained_earnings';
          subgroupTitle = 'الأرباح المحتجزة';
        }
      }

      if (!balanceSheet[mainCategory].subgroups[subgroupKey]) {
        balanceSheet[mainCategory].subgroups[subgroupKey] = {
          title: subgroupTitle,
          accounts: [],
          total: 0
        };
      }

      balanceSheet[mainCategory].subgroups[subgroupKey].accounts.push({
        ...account,
        balance: closingBalance
      });
      
      balanceSheet[mainCategory].subgroups[subgroupKey].total += closingBalance;
      balanceSheet[mainCategory].total += closingBalance;
    });

    return balanceSheet;
  };

  const balanceSheet = organizeBalanceSheet();

  // حساب المقارنة إذا كانت مفعلة
  const calculateComparison = () => {
    if (!comparisonBalances) return null;
    
    const comparison = {
      assets: 0,
      liabilities: 0,
      equity: 0
    };

    Object.values(comparisonBalances).forEach(({ account, closingBalance }) => {
      if (account.type === 'asset') {
        comparison.assets += closingBalance;
      } else if (account.type === 'liability') {
        comparison.liabilities += closingBalance;
      } else if (account.type === 'equity') {
        comparison.equity += closingBalance;
      }
    });

    return comparison;
  };

  const comparison = calculateComparison();

  // حساب النسب المالية
  const calculateFinancialRatios = () => {
    const currentAssets = balanceSheet.assets.subgroups.current_assets?.total || 0;
    const currentLiabilities = balanceSheet.liabilities.subgroups.current_liabilities?.total || 0;
    const totalAssets = balanceSheet.assets.total;
    const totalLiabilities = balanceSheet.liabilities.total;
    const totalEquity = balanceSheet.equity.total;

    return {
      currentRatio: currentLiabilities > 0 ? (currentAssets / currentLiabilities).toFixed(2) : '0.00',
      debtToEquity: totalEquity > 0 ? (totalLiabilities / totalEquity).toFixed(2) : '0.00',
      equityRatio: totalAssets > 0 ? ((totalEquity / totalAssets) * 100).toFixed(1) + '%' : '0%',
      debtRatio: totalAssets > 0 ? ((totalLiabilities / totalAssets) * 100).toFixed(1) + '%' : '0%'
    };
  };

  const ratios = calculateFinancialRatios();

  const handleExport = () => {
    const csvContent = [
      ['نوع الحساب', 'رمز الحساب', 'اسم الحساب', 'الرصيد', 'النسبة من الإجمالي'],
      // الأصول
      ...Object.entries(balanceSheet.assets.subgroups).flatMap(([key, subgroup]) => [
        [`الأصول - ${subgroup.title}`, '', '', '', ''],
        ...subgroup.accounts.map(acc => [
          '',
          acc.code,
          acc.name,
          acc.balance.toFixed(2),
          ((acc.balance / balanceSheet.assets.total) * 100).toFixed(2) + '%'
        ]),
        [`إجمالي ${subgroup.title}`, '', '', subgroup.total.toFixed(2), '']
      ]),
      [`إجمالي الأصول`, '', '', balanceSheet.assets.total.toFixed(2), '100%'],
      '',
      // الخصوم
      ...Object.entries(balanceSheet.liabilities.subgroups).flatMap(([key, subgroup]) => [
        [`الخصوم - ${subgroup.title}`, '', '', '', ''],
        ...subgroup.accounts.map(acc => [
          '',
          acc.code,
          acc.name,
          acc.balance.toFixed(2),
          ((acc.balance / balanceSheet.liabilities.total) * 100).toFixed(2) + '%'
        ]),
        [`إجمالي ${subgroup.title}`, '', '', subgroup.total.toFixed(2), '']
      ]),
      [`إجمالي الخصوم`, '', '', balanceSheet.liabilities.total.toFixed(2), '100%'],
      '',
      // حقوق الملكية
      ...Object.entries(balanceSheet.equity.subgroups).flatMap(([key, subgroup]) => [
        [`حقوق الملكية - ${subgroup.title}`, '', '', '', ''],
        ...subgroup.accounts.map(acc => [
          '',
          acc.code,
          acc.name,
          acc.balance.toFixed(2),
          ((acc.balance / balanceSheet.equity.total) * 100).toFixed(2) + '%'
        ]),
        [`إجمالي ${subgroup.title}`, '', '', subgroup.total.toFixed(2), '']
      ]),
      [`إجمالي حقوق الملكية`, '', '', balanceSheet.equity.total.toFixed(2), '100%']
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `الميزانية_العمومية_${new Date(asOfDate).toLocaleDateString('ar-EG')}.csv`;
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  // حساب الفرق في المقارنة
  const calculateDifference = (current, previous) => {
    if (!previous) return { amount: current, percentage: 0 };
    const difference = current - previous;
    const percentage = previous !== 0 ? (difference / previous) * 100 : 0;
    return { amount: difference, percentage };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FaBalanceScale className="text-blue-600" />
            الميزانية العمومية
          </h1>
          <p className="text-gray-600 mt-2">
            الوضع المالي للشركة كما في {new Date(asOfDate).toLocaleDateString('ar-EG')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleExport} variant="outline">
            <FaDownload className="ml-2" />
            تصدير Excel
          </Button>
          <Button onClick={handlePrint} variant="outline">
            <FaPrint className="ml-2" />
            طباعة
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            label="كما في تاريخ"
            type="date"
            value={asOfDate}
            onChange={(e) => setAsOfDate(e.target.value)}
            icon={FaCalendar}
          />
          <Select
            label="طريقة العرض"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            options={[
              { value: 'detailed', label: 'تفصيلي' },
              { value: 'summary', label: 'ملخص' }
            ]}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showComparison"
              checked={showComparison}
              onChange={(e) => setShowComparison(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="showComparison" className="text-sm text-gray-700">عرض المقارنة</label>
          </div>
          {showComparison && (
            <Input
              label="المقارنة مع تاريخ"
              type="date"
              value={comparisonDate}
              onChange={(e) => setComparisonDate(e.target.value)}
              icon={FaCalendar}
            />
          )}
        </div>
      </Card>

      {/* Financial Ratios */}
      <Card>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaChartPie className="text-blue-600" />
          النسب المالية
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-blue-50">
            <div className="text-center">
              <p className="text-sm text-blue-600">نسبة التداول</p>
              <p className="text-2xl font-bold text-blue-700">{ratios.currentRatio}</p>
              <p className="text-xs text-blue-500">الأصول المتداولة ÷ الخصوم المتداولة</p>
            </div>
          </Card>
          <Card className="bg-red-50">
            <div className="text-center">
              <p className="text-sm text-red-600">نسبة الدين لحقوق الملكية</p>
              <p className="text-2xl font-bold text-red-700">{ratios.debtToEquity}</p>
              <p className="text-xs text-red-500">إجمالي الخصوم ÷ حقوق الملكية</p>
            </div>
          </Card>
          <Card className="bg-green-50">
            <div className="text-center">
              <p className="text-sm text-green-600">نسبة حقوق الملكية</p>
              <p className="text-2xl font-bold text-green-700">{ratios.equityRatio}</p>
              <p className="text-xs text-green-500">حقوق الملكية ÷ إجمالي الأصول</p>
            </div>
          </Card>
          <Card className="bg-orange-50">
            <div className="text-center">
              <p className="text-sm text-orange-600">نسبة الدين</p>
              <p className="text-2xl font-bold text-orange-700">{ratios.debtRatio}</p>
              <p className="text-xs text-orange-500">إجمالي الخصوم ÷ إجمالي الأصول</p>
            </div>
          </Card>
        </div>
      </Card>

      {/* Balance Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets - الأصول */}
        <Card className="border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2">
              <FaArrowUp className="text-blue-600" />
              الأصول
            </h2>
            <span className="text-2xl font-bold text-blue-600">
              {balanceSheet.assets.total.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="space-y-4">
            {Object.entries(balanceSheet.assets.subgroups).map(([key, subgroup]) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between font-semibold text-gray-700 border-b pb-1">
                  <span>{subgroup.title}</span>
                  <span>{subgroup.total.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}</span>
                </div>
                
                {viewMode === 'detailed' && subgroup.accounts.map(account => {
                  const comparisonData = comparison ? calculateDifference(
                    account.balance,
                    Object.values(comparisonBalances).find(c => c.account.code === account.code)?.closingBalance || 0
                  ) : null;
                  
                  return (
                    <div key={account.code} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">{account.code}</span>
                        <span className="text-gray-700">{account.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">
                          {account.balance.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
                        </span>
                        {comparison && (
                          <span className={`text-xs ${comparisonData.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ({comparisonData.amount >= 0 ? '+' : ''}{comparisonData.amount.toLocaleString('ar-EG', { minimumFractionDigits: 2 })})
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </Card>

        {/* Liabilities & Equity - الخصوم وحقوق الملكية */}
        <div className="space-y-6">
          {/* Liabilities - الخصوم */}
          <Card className="border-l-4 border-l-red-500">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-red-600 flex items-center gap-2">
                <FaArrowDown className="text-red-600" />
                الخصوم
              </h2>
              <span className="text-2xl font-bold text-red-600">
                {balanceSheet.liabilities.total.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="space-y-4">
              {Object.entries(balanceSheet.liabilities.subgroups).map(([key, subgroup]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between font-semibold text-gray-700 border-b pb-1">
                    <span>{subgroup.title}</span>
                    <span>{subgroup.total.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}</span>
                  </div>
                  
                  {viewMode === 'detailed' && subgroup.accounts.map(account => {
                    const comparisonData = comparison ? calculateDifference(
                      account.balance,
                      Object.values(comparisonBalances).find(c => c.account.code === account.code)?.closingBalance || 0
                    ) : null;
                    
                    return (
                      <div key={account.code} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">{account.code}</span>
                          <span className="text-gray-700">{account.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold">
                            {account.balance.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
                          </span>
                          {comparison && (
                            <span className={`text-xs ${comparisonData.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              ({comparisonData.amount >= 0 ? '+' : ''}{comparisonData.amount.toLocaleString('ar-EG', { minimumFractionDigits: 2 })})
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </Card>

          {/* Equity - حقوق الملكية */}
          <Card className="border-l-4 border-l-purple-500">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-purple-600 flex items-center gap-2">
                <FaBuilding className="text-purple-600" />
                حقوق الملكية
              </h2>
              <span className="text-2xl font-bold text-purple-600">
                {balanceSheet.equity.total.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="space-y-4">
              {Object.entries(balanceSheet.equity.subgroups).map(([key, subgroup]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between font-semibold text-gray-700 border-b pb-1">
                    <span>{subgroup.title}</span>
                    <span>{subgroup.total.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}</span>
                  </div>
                  
                  {viewMode === 'detailed' && subgroup.accounts.map(account => {
                    const comparisonData = comparison ? calculateDifference(
                      account.balance,
                      Object.values(comparisonBalances).find(c => c.account.code === account.code)?.closingBalance || 0
                    ) : null;
                    
                    return (
                      <div key={account.code} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">{account.code}</span>
                          <span className="text-gray-700">{account.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold">
                            {account.balance.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
                          </span>
                          {comparison && (
                            <span className={`text-xs ${comparisonData.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              ({comparisonData.amount >= 0 ? '+' : ''}{comparisonData.amount.toLocaleString('ar-EG', { minimumFractionDigits: 2 })})
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Balance Check */}
      <Card className={`border-2 ${
        Math.abs(balanceSheet.assets.total - (balanceSheet.liabilities.total + balanceSheet.equity.total)) < 0.01
          ? 'border-green-200 bg-green-50'
          : 'border-red-200 bg-red-50'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <FaMoneyBillWave className={`text-2xl ${
              Math.abs(balanceSheet.assets.total - (balanceSheet.liabilities.total + balanceSheet.equity.total)) < 0.01
                ? 'text-green-600'
                : 'text-red-600'
            }`} />
            <div>
              <h3 className="font-semibold text-gray-900">فحص التوازن المحاسبي</h3>
              <p className="text-sm text-gray-600">
                إجمالي الأصول = إجمالي الخصوم + حقوق الملكية
              </p>
            </div>
          </div>
          <div className="text-left">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">إجمالي الأصول</p>
                <p className="font-bold text-blue-600">
                  {balanceSheet.assets.total.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-gray-600">إجمالي الخصوم + حقوق الملكية</p>
                <p className="font-bold text-purple-600">
                  {(balanceSheet.liabilities.total + balanceSheet.equity.total).toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-gray-600">الفرق</p>
                <p className={`font-bold ${
                  Math.abs(balanceSheet.assets.total - (balanceSheet.liabilities.total + balanceSheet.equity.total)) < 0.01
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {(balanceSheet.assets.total - (balanceSheet.liabilities.total + balanceSheet.equity.total)).toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Comparison Summary */}
      {showComparison && comparison && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">ملخص المقارنة</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">تغيير الأصول</p>
              <p className={`text-xl font-bold ${
                calculateDifference(balanceSheet.assets.total, comparison.assets).amount >= 0 
                  ? 'text-green-600' : 'text-red-600'
              }`}>
                {calculateDifference(balanceSheet.assets.total, comparison.assets).amount >= 0 ? '+' : ''}
                {calculateDifference(balanceSheet.assets.total, comparison.assets).amount.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-gray-500">
                ({calculateDifference(balanceSheet.assets.total, comparison.assets).percentage.toFixed(1)}%)
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">تغيير الخصوم</p>
              <p className={`text-xl font-bold ${
                calculateDifference(balanceSheet.liabilities.total, comparison.liabilities).amount >= 0 
                  ? 'text-red-600' : 'text-green-600'
              }`}>
                {calculateDifference(balanceSheet.liabilities.total, comparison.liabilities).amount >= 0 ? '+' : ''}
                {calculateDifference(balanceSheet.liabilities.total, comparison.liabilities).amount.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-gray-500">
                ({calculateDifference(balanceSheet.liabilities.total, comparison.liabilities).percentage.toFixed(1)}%)
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">تغيير حقوق الملكية</p>
              <p className={`text-xl font-bold ${
                calculateDifference(balanceSheet.equity.total, comparison.equity).amount >= 0 
                  ? 'text-green-600' : 'text-red-600'
              }`}>
                {calculateDifference(balanceSheet.equity.total, comparison.equity).amount >= 0 ? '+' : ''}
                {calculateDifference(balanceSheet.equity.total, comparison.equity).amount.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-gray-500">
                ({calculateDifference(balanceSheet.equity.total, comparison.equity).percentage.toFixed(1)}%)
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BalanceSheet;