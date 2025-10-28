// ======================================
// Income Statement - قائمة الدخل (الأرباح والخسائر)
// ======================================

import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import Card from '../../components/Common/Card';
import Table from '../../components/Common/Table';
import Input from '../../components/Common/Input';
import Select from '../../components/Common/Select';
import Button from '../../components/Common/Button';
import { 
  FaChartLine, 
  FaDownload, 
  FaCalendar, 
  FaPrint,
  FaMoneyBillWave,
  FaArrowUp,
  FaArrowDown,
  FaPercent,
  FaCalculator,
  FaTrendingUp
} from 'react-icons/fa';

const IncomeStatement = () => {
  const { accounts, journalEntries } = useData();
  
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonFrom, setComparisonFrom] = useState('');
  const [comparisonTo, setComparisonTo] = useState('');
  const [viewMode, setViewMode] = useState('detailed'); // detailed, summary
  const [periodType, setPeriodType] = useState('monthly'); // monthly, quarterly, yearly
  
  // حساب حركات الحسابات في فترة معينة
  const calculatePeriodMovements = (fromDate, toDate) => {
    const accountMovements = {};
    
    // تهيئة حركات الحسابات
    accounts.forEach(account => {
      accountMovements[account.code] = {
        account: account,
        openingBalance: account.balance || 0,
        transactions: [],
        debitTotal: 0,
        creditTotal: 0,
        periodMovement: 0
      };
    });
    
    // تجميع القيود في الفترة المحددة
    journalEntries.forEach(entry => {
      if (entry.status === 'posted') {
        const entryDate = new Date(entry.date);
        const fromDateTime = fromDate ? new Date(fromDate) : new Date('1900-01-01');
        const toDateTime = toDate ? new Date(toDate) : new Date();
        
        if (entryDate >= fromDateTime && entryDate <= toDateTime) {
          entry.entries.forEach(line => {
            if (accountMovements[line.accountCode]) {
              accountMovements[line.accountCode].transactions.push({
                ...line,
                entryDate: entry.date,
                entryDescription: entry.description,
                entryReference: entry.reference
              });
              
              accountMovements[line.accountCode].debitTotal += parseFloat(line.debit) || 0;
              accountMovements[line.accountCode].creditTotal += parseFloat(line.credit) || 0;
            }
          });
        }
      }
    });
    
    // حساب الحركة في الفترة
    Object.values(accountMovements).forEach(accountMovement => {
      // للحسابات المدينة: الحركة = المدين - الدائن
      if (accountMovement.account.type === 'asset' || accountMovement.account.type === 'expense' || accountMovement.account.type === 'cost') {
        accountMovement.periodMovement = accountMovement.debitTotal - accountMovement.creditTotal;
      } 
      // للحسابات الدائنة: الحركة = الدائن - المدين
      else if (accountMovement.account.type === 'liability' || accountMovement.account.type === 'equity' || accountMovement.account.type === 'revenue') {
        accountMovement.periodMovement = accountMovement.creditTotal - accountMovement.debitTotal;
      }
    });
    
    return accountMovements;
  };

  const currentPeriodMovements = calculatePeriodMovements(dateFrom, dateTo);
  const comparisonPeriodMovements = showComparison && comparisonFrom && comparisonTo ? 
    calculatePeriodMovements(comparisonFrom, comparisonTo) : null;

  // تنظيم قائمة الدخل
  const organizeIncomeStatement = (movements) => {
    const incomeStatement = {
      revenue: {
        title: 'الإيرادات',
        total: 0,
        accounts: []
      },
      costOfGoodsSold: {
        title: 'تكلفة البضاعة المباعة',
        total: 0,
        accounts: []
      },
      grossProfit: {
        title: 'إجمالي الربح',
        value: 0,
        percentage: 0
      },
      operatingExpenses: {
        title: 'المصروفات التشغيلية',
        subgroups: {},
        total: 0
      },
      operatingIncome: {
        title: 'صافي الربح التشغيلي',
        value: 0,
        percentage: 0
      },
      otherIncome: {
        title: 'الإيرادات الأخرى',
        total: 0,
        accounts: []
      },
      otherExpenses: {
        title: 'المصروفات الأخرى',
        total: 0,
        accounts: []
      },
      netIncome: {
        title: 'صافي الربح/الخسارة',
        value: 0,
        percentage: 0
      }
    };

    // تجميع الحسابات
    Object.values(movements).forEach(({ account, periodMovement }) => {
      if (account.type === 'revenue') {
        if (account.code.startsWith('4')) {
          incomeStatement.revenue.accounts.push({ account, movement: periodMovement });
          incomeStatement.revenue.total += periodMovement;
        } else {
          incomeStatement.otherIncome.accounts.push({ account, movement: periodMovement });
          incomeStatement.otherIncome.total += periodMovement;
        }
      } else if (account.type === 'cost') {
        incomeStatement.costOfGoodsSold.accounts.push({ account, movement: periodMovement });
        incomeStatement.costOfGoodsSold.total += periodMovement;
      } else if (account.type === 'expense') {
        if (account.code.startsWith('5')) {
          if (!incomeStatement.operatingExpenses.subgroups.selling) {
            incomeStatement.operatingExpenses.subgroups.selling = {
              title: 'مصروفات البيع والتسويق',
              accounts: [],
              total: 0
            };
          }
          if (account.code.startsWith('51')) {
            incomeStatement.operatingExpenses.subgroups.selling.accounts.push({ account, movement: periodMovement });
            incomeStatement.operatingExpenses.subgroups.selling.total += periodMovement;
          } else {
            if (!incomeStatement.operatingExpenses.subgroups.admin) {
              incomeStatement.operatingExpenses.subgroups.admin = {
                title: 'المصروفات الإدارية والعمومية',
                accounts: [],
                total: 0
              };
            }
            incomeStatement.operatingExpenses.subgroups.admin.accounts.push({ account, movement: periodMovement });
            incomeStatement.operatingExpenses.subgroups.admin.total += periodMovement;
          }
          incomeStatement.operatingExpenses.total += periodMovement;
        } else {
          incomeStatement.otherExpenses.accounts.push({ account, movement: periodMovement });
          incomeStatement.otherExpenses.total += periodMovement;
        }
      }
    });

    // حساب الإجماليات والنسب
    incomeStatement.grossProfit.value = incomeStatement.revenue.total - incomeStatement.costOfGoodsSold.total;
    incomeStatement.grossProfit.percentage = incomeStatement.revenue.total > 0 ? 
      (incomeStatement.grossProfit.value / incomeStatement.revenue.total) * 100 : 0;

    incomeStatement.operatingIncome.value = incomeStatement.grossProfit.value - incomeStatement.operatingExpenses.total;
    incomeStatement.operatingIncome.percentage = incomeStatement.revenue.total > 0 ? 
      (incomeStatement.operatingIncome.value / incomeStatement.revenue.total) * 100 : 0;

    incomeStatement.netIncome.value = incomeStatement.operatingIncome.value + 
      incomeStatement.otherIncome.total - incomeStatement.otherExpenses.total;
    incomeStatement.netIncome.percentage = incomeStatement.revenue.total > 0 ? 
      (incomeStatement.netIncome.value / incomeStatement.revenue.total) * 100 : 0;

    return incomeStatement;
  };

  const currentIncomeStatement = organizeIncomeStatement(currentPeriodMovements);
  const comparisonIncomeStatement = comparisonPeriodMovements ? 
    organizeIncomeStatement(comparisonPeriodMovements) : null;

  // حساب المقارنة
  const calculateComparison = (current, previous) => {
    if (!previous) return { amount: current, percentage: 0 };
    const difference = current - previous;
    const percentage = previous !== 0 ? (difference / previous) * 100 : 0;
    return { amount: difference, percentage };
  };

  // حساب النسب المالية
  const calculateFinancialRatios = () => {
    const revenue = currentIncomeStatement.revenue.total;
    const grossProfit = currentIncomeStatement.grossProfit.value;
    const operatingIncome = currentIncomeStatement.operatingIncome.value;
    const netIncome = currentIncomeStatement.netIncome.value;

    return {
      grossMargin: revenue > 0 ? ((grossProfit / revenue) * 100).toFixed(1) : '0.0',
      operatingMargin: revenue > 0 ? ((operatingIncome / revenue) * 100).toFixed(1) : '0.0',
      netMargin: revenue > 0 ? ((netIncome / revenue) * 100).toFixed(1) : '0.0',
      revenueGrowth: comparisonIncomeStatement ? 
        calculateComparison(revenue, comparisonIncomeStatement.revenue.total).percentage.toFixed(1) : '0.0'
    };
  };

  const ratios = calculateFinancialRatios();

  const handleExport = () => {
    const csvContent = [
      ['البنود', 'الفترة الحالية', 'النسبة %', 'الفترة السابقة', 'التغيير %'],
      ['الإيرادات', currentIncomeStatement.revenue.total.toFixed(2), ratios.netMargin, 
       comparisonIncomeStatement ? comparisonIncomeStatement.revenue.total.toFixed(2) : '0.00',
       comparisonIncomeStatement ? calculateComparison(currentIncomeStatement.revenue.total, comparisonIncomeStatement.revenue.total).percentage.toFixed(1) : '0.0'],
      ['تكلفة البضاعة المباعة', currentIncomeStatement.costOfGoodsSold.total.toFixed(2), '', '', ''],
      ['إجمالي الربح', currentIncomeStatement.grossProfit.value.toFixed(2), currentIncomeStatement.grossProfit.percentage.toFixed(1), '', ''],
      ['المصروفات التشغيلية', currentIncomeStatement.operatingExpenses.total.toFixed(2), '', '', ''],
      ['صافي الربح التشغيلي', currentIncomeStatement.operatingIncome.value.toFixed(2), currentIncomeStatement.operatingIncome.percentage.toFixed(1), '', ''],
      ['صافي الربح/الخسارة', currentIncomeStatement.netIncome.value.toFixed(2), currentIncomeStatement.netIncome.percentage.toFixed(1), '', '']
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `قائمة_الدخل_${new Date(dateTo).toLocaleDateString('ar-EG')}.csv`;
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  // تحديد الفترة الافتراضية
  const getDefaultPeriod = (type) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    if (type === 'monthly') {
      return {
        from: new Date(currentYear, currentMonth, 1).toISOString().split('T')[0],
        to: new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0]
      };
    } else if (type === 'quarterly') {
      const quarter = Math.floor(currentMonth / 3);
      return {
        from: new Date(currentYear, quarter * 3, 1).toISOString().split('T')[0],
        to: new Date(currentYear, (quarter + 1) * 3, 0).toISOString().split('T')[0]
      };
    } else {
      return {
        from: new Date(currentYear, 0, 1).toISOString().split('T')[0],
        to: new Date(currentYear, 11, 31).toISOString().split('T')[0]
      };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FaChartLine className="text-green-600" />
            قائمة الدخل
          </h1>
          <p className="text-gray-600 mt-2">
            قائمة الأرباح والخسائر للفترة من {dateFrom ? new Date(dateFrom).toLocaleDateString('ar-EG') : 'بداية النشاط'} إلى {new Date(dateTo).toLocaleDateString('ar-EG')}
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
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Select
            label="نوع الفترة"
            value={periodType}
            onChange={(e) => {
              setPeriodType(e.target.value);
              const period = getDefaultPeriod(e.target.value);
              setDateFrom(period.from);
              setDateTo(period.to);
            }}
            options={[
              { value: 'monthly', label: 'شهري' },
              { value: 'quarterly', label: 'ربع سنوي' },
              { value: 'yearly', label: 'سنوي' }
            ]}
          />
          <Input
            label="من تاريخ"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            icon={FaCalendar}
          />
          <Input
            label="إلى تاريخ"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
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
        </div>
        {showComparison && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input
              label="المقارنة - من تاريخ"
              type="date"
              value={comparisonFrom}
              onChange={(e) => setComparisonFrom(e.target.value)}
            />
            <Input
              label="المقارنة - إلى تاريخ"
              type="date"
              value={comparisonTo}
              onChange={(e) => setComparisonTo(e.target.value)}
            />
          </div>
        )}
      </Card>

      {/* Financial Ratios */}
      <Card>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FaCalculator className="text-blue-600" />
          النسب المالية
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-green-50">
            <div className="text-center">
              <p className="text-sm text-green-600">هامش الربح الإجمالي</p>
              <p className="text-2xl font-bold text-green-700">{ratios.grossMargin}%</p>
              <p className="text-xs text-green-500">إجمالي الربح ÷ الإيرادات</p>
            </div>
          </Card>
          <Card className="bg-blue-50">
            <div className="text-center">
              <p className="text-sm text-blue-600">هامش الربح التشغيلي</p>
              <p className="text-2xl font-bold text-blue-700">{ratios.operatingMargin}%</p>
              <p className="text-xs text-blue-500">الربح التشغيلي ÷ الإيرادات</p>
            </div>
          </Card>
          <Card className="bg-purple-50">
            <div className="text-center">
              <p className="text-sm text-purple-600">هامش الربح الصافي</p>
              <p className="text-2xl font-bold text-purple-700">{ratios.netMargin}%</p>
              <p className="text-xs text-purple-500">صافي الربح ÷ الإيرادات</p>
            </div>
          </Card>
          <Card className="bg-orange-50">
            <div className="text-center">
              <p className="text-sm text-orange-600">معدل نمو الإيرادات</p>
              <p className={`text-2xl font-bold ${parseFloat(ratios.revenueGrowth) >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {ratios.revenueGrowth}%
              </p>
              <p className="text-xs text-orange-500">مقارنة بالفترة السابقة</p>
            </div>
          </Card>
        </div>
      </Card>

      {/* Income Statement */}
      <div className="space-y-6">
        {/* Revenue Section */}
        <Card className="border-l-4 border-l-green-500">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-green-600 flex items-center gap-2">
              <FaArrowUp className="text-green-600" />
              {currentIncomeStatement.revenue.title}
            </h2>
            <span className="text-2xl font-bold text-green-600">
              {currentIncomeStatement.revenue.total.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="space-y-3">
            {viewMode === 'detailed' && currentIncomeStatement.revenue.accounts.map(({ account, movement }) => {
              const comparisonData = comparisonIncomeStatement ? calculateComparison(
                movement,
                comparisonIncomeStatement.revenue.accounts.find(c => c.account.code === account.code)?.movement || 0
              ) : null;
              
              return (
                <div key={account.code} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 font-mono">{account.code}</span>
                    <span className="text-gray-700">{account.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">
                      {movement.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
                    </span>
                    {comparison && (
                      <span className={`text-sm ${comparisonData.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ({comparisonData.amount >= 0 ? '+' : ''}{comparisonData.amount.toLocaleString('ar-EG', { minimumFractionDigits: 2 })})
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Cost of Goods Sold */}
        <Card className="border-l-4 border-l-red-500">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-red-600 flex items-center gap-2">
              <FaArrowDown className="text-red-600" />
              {currentIncomeStatement.costOfGoodsSold.title}
            </h2>
            <span className="text-2xl font-bold text-red-600">
              {currentIncomeStatement.costOfGoodsSold.total.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="space-y-3">
            {viewMode === 'detailed' && currentIncomeStatement.costOfGoodsSold.accounts.map(({ account, movement }) => {
              const comparisonData = comparisonIncomeStatement ? calculateComparison(
                movement,
                comparisonIncomeStatement.costOfGoodsSold.accounts.find(c => c.account.code === account.code)?.movement || 0
              ) : null;
              
              return (
                <div key={account.code} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 font-mono">{account.code}</span>
                    <span className="text-gray-700">{account.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">
                      {movement.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
                    </span>
                    {comparison && (
                      <span className={`text-sm ${comparisonData.amount >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ({comparisonData.amount >= 0 ? '+' : ''}{comparisonData.amount.toLocaleString('ar-EG', { minimumFractionDigits: 2 })})
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Gross Profit */}
        <Card className="bg-blue-50 border-2 border-blue-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2">
              <FaMoneyBillWave className="text-blue-600" />
              {currentIncomeStatement.grossProfit.title}
            </h2>
            <div className="text-right">
              <span className="text-3xl font-bold text-blue-600">
                {currentIncomeStatement.grossProfit.value.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
              </span>
              <p className="text-sm text-blue-500">
                هامش الربح: {currentIncomeStatement.grossProfit.percentage.toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>

        {/* Operating Expenses */}
        <Card className="border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-orange-600 flex items-center gap-2">
              <FaArrowDown className="text-orange-600" />
              {currentIncomeStatement.operatingExpenses.title}
            </h2>
            <span className="text-2xl font-bold text-orange-600">
              {currentIncomeStatement.operatingExpenses.total.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="space-y-4">
            {Object.entries(currentIncomeStatement.operatingExpenses.subgroups).map(([key, subgroup]) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between font-semibold text-gray-700 border-b pb-1">
                  <span>{subgroup.title}</span>
                  <span>{subgroup.total.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}</span>
                </div>
                
                {viewMode === 'detailed' && subgroup.accounts.map(({ account, movement }) => {
                  const comparisonData = comparisonIncomeStatement ? calculateComparison(
                    movement,
                    comparisonIncomeStatement.operatingExpenses.subgroups[key]?.accounts.find(c => c.account.code === account.code)?.movement || 0
                  ) : null;
                  
                  return (
                    <div key={account.code} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 font-mono">{account.code}</span>
                        <span className="text-gray-700">{account.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">
                          {movement.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
                        </span>
                        {comparison && (
                          <span className={`text-xs ${comparisonData.amount >= 0 ? 'text-red-600' : 'text-green-600'}`}>
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

        {/* Operating Income */}
        <Card className="bg-purple-50 border-2 border-purple-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-purple-600 flex items-center gap-2">
              <FaTrendingUp className="text-purple-600" />
              {currentIncomeStatement.operatingIncome.title}
            </h2>
            <div className="text-right">
              <span className="text-3xl font-bold text-purple-600">
                {currentIncomeStatement.operatingIncome.value.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
              </span>
              <p className="text-sm text-purple-500">
                هامش التشغيل: {currentIncomeStatement.operatingIncome.percentage.toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>

        {/* Other Income & Expenses */}
        {(currentIncomeStatement.otherIncome.total !== 0 || currentIncomeStatement.otherExpenses.total !== 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentIncomeStatement.otherIncome.total !== 0 && (
              <Card className="border-l-4 border-l-blue-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-blue-600">{currentIncomeStatement.otherIncome.title}</h3>
                  <span className="text-xl font-bold text-blue-600">
                    {currentIncomeStatement.otherIncome.total.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="space-y-2">
                  {currentIncomeStatement.otherIncome.accounts.map(({ account, movement }) => (
                    <div key={account.code} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{account.name}</span>
                      <span className="font-semibold">
                        {movement.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {currentIncomeStatement.otherExpenses.total !== 0 && (
              <Card className="border-l-4 border-l-red-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-red-600">{currentIncomeStatement.otherExpenses.title}</h3>
                  <span className="text-xl font-bold text-red-600">
                    {currentIncomeStatement.otherExpenses.total.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="space-y-2">
                  {currentIncomeStatement.otherExpenses.accounts.map(({ account, movement }) => (
                    <div key={account.code} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{account.name}</span>
                      <span className="font-semibold">
                        {movement.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Net Income */}
        <Card className={`border-2 ${
          currentIncomeStatement.netIncome.value >= 0 
            ? 'border-green-200 bg-green-50' 
            : 'border-red-200 bg-red-50'
        }`}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FaMoneyBillWave className={`${
                currentIncomeStatement.netIncome.value >= 0 ? 'text-green-600' : 'text-red-600'
              }`} />
              {currentIncomeStatement.netIncome.title}
            </h2>
            <div className="text-right">
              <span className={`text-4xl font-bold ${
                currentIncomeStatement.netIncome.value >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {currentIncomeStatement.netIncome.value >= 0 ? '+' : ''}
                {currentIncomeStatement.netIncome.value.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
              </span>
              <p className={`text-sm ${
                currentIncomeStatement.netIncome.percentage >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                هامش الربح الصافي: {currentIncomeStatement.netIncome.percentage.toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Comparison Summary */}
      {showComparison && comparisonIncomeStatement && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">مقارنة بالفترة السابقة</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">تغيير الإيرادات</p>
              <p className={`text-xl font-bold ${
                calculateComparison(currentIncomeStatement.revenue.total, comparisonIncomeStatement.revenue.total).amount >= 0 
                  ? 'text-green-600' : 'text-red-600'
              }`}>
                {calculateComparison(currentIncomeStatement.revenue.total, comparisonIncomeStatement.revenue.total).amount >= 0 ? '+' : ''}
                {calculateComparison(currentIncomeStatement.revenue.total, comparisonIncomeStatement.revenue.total).amount.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-gray-500">
                ({calculateComparison(currentIncomeStatement.revenue.total, comparisonIncomeStatement.revenue.total).percentage.toFixed(1)}%)
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">تغيير إجمالي الربح</p>
              <p className={`text-xl font-bold ${
                calculateComparison(currentIncomeStatement.grossProfit.value, comparisonIncomeStatement.grossProfit.value).amount >= 0 
                  ? 'text-green-600' : 'text-red-600'
              }`}>
                {calculateComparison(currentIncomeStatement.grossProfit.value, comparisonIncomeStatement.grossProfit.value).amount >= 0 ? '+' : ''}
                {calculateComparison(currentIncomeStatement.grossProfit.value, comparisonIncomeStatement.grossProfit.value).amount.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-gray-500">
                ({calculateComparison(currentIncomeStatement.grossProfit.value, comparisonIncomeStatement.grossProfit.value).percentage.toFixed(1)}%)
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">تغيير صافي الربح</p>
              <p className={`text-xl font-bold ${
                calculateComparison(currentIncomeStatement.netIncome.value, comparisonIncomeStatement.netIncome.value).amount >= 0 
                  ? 'text-green-600' : 'text-red-600'
              }`}>
                {calculateComparison(currentIncomeStatement.netIncome.value, comparisonIncomeStatement.netIncome.value).amount >= 0 ? '+' : ''}
                {calculateComparison(currentIncomeStatement.netIncome.value, comparisonIncomeStatement.netIncome.value).amount.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-gray-500">
                ({calculateComparison(currentIncomeStatement.netIncome.value, comparisonIncomeStatement.netIncome.value).percentage.toFixed(1)}%)
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">تغيير هامش الربح</p>
              <p className={`text-xl font-bold ${
                (currentIncomeStatement.netIncome.percentage - comparisonIncomeStatement.netIncome.percentage) >= 0 
                  ? 'text-green-600' : 'text-red-600'
              }`}>
                {(currentIncomeStatement.netIncome.percentage - comparisonIncomeStatement.netIncome.percentage) >= 0 ? '+' : ''}
                {(currentIncomeStatement.netIncome.percentage - comparisonIncomeStatement.netIncome.percentage).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500">نقطة مئوية</p>
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

export default IncomeStatement;