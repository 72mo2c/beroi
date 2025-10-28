// ======================================
// Chart of Accounts - دليل الحسابات
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
  FaSitemap, 
  FaPlus, 
  FaSearch, 
  FaEdit, 
  FaTrash, 
  FaTree,
  FaBalanceScale,
  FaFolder,
  FaDownload,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';

const ChartOfAccounts = () => {
  const { chartOfAccounts, setChartOfAccounts, addAccount, updateAccount, deleteAccount } = useData();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [accountTypeFilter, setAccountTypeFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [expandedAccounts, setExpandedAccounts] = useState(new Set());
  
  const [newAccount, setNewAccount] = useState({
    code: '',
    name: '',
    type: 'asset',
    parentAccount: '',
    description: '',
    isActive: true,
    level: 0,
    balance: 0
  });

  const accountTypes = {
    'asset': { label: 'الأصول', color: 'bg-blue-100 text-blue-700', icon: FaBalanceScale },
    'liability': { label: 'الخصوم', color: 'bg-red-100 text-red-700', icon: FaArrowDown },
    'equity': { label: 'حقوق الملكية', color: 'bg-purple-100 text-purple-700', icon: FaArrowUp },
    'revenue': { label: 'الإيرادات', color: 'bg-green-100 text-green-700', icon: FaArrowUp },
    'expense': { label: 'المصروفات', color: 'bg-orange-100 text-orange-700', icon: FaArrowDown },
    'cost': { label: 'تكلفة البضاعة المباعة', color: 'bg-yellow-100 text-yellow-700', icon: FaArrowDown }
  };

  // فلترة الحسابات
  const filteredAccounts = chartOfAccounts.filter(account => {
    const matchesSearch = account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         account.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = accountTypeFilter === 'all' || account.type === accountTypeFilter;
    return matchesSearch && matchesType;
  });

  // ترتيب الحسابات هرمياً
  const organizeAccounts = (accounts) => {
    const accountMap = new Map(accounts.map(acc => [acc.code, { ...acc, children: [] }]));
    const rootAccounts = [];

    accountMap.forEach(account => {
      if (account.parentAccount) {
        const parent = accountMap.get(account.parentAccount);
        if (parent) {
          parent.children.push(account);
        } else {
          rootAccounts.push(account);
        }
      } else {
        rootAccounts.push(account);
      }
    });

    return rootAccounts;
  };

  const organizedAccounts = organizeAccounts(filteredAccounts);

  // تبديل حالة التوسيع
  const toggleExpanded = (accountCode) => {
    const newExpanded = new Set(expandedAccounts);
    if (newExpanded.has(accountCode)) {
      newExpanded.delete(accountCode);
    } else {
      newExpanded.add(accountCode);
    }
    setExpandedAccounts(newExpanded);
  };

  const handleAddAccount = () => {
    if (!newAccount.code || !newAccount.name) {
      alert('يرجى إدخال رمز الحساب واسم الحساب');
      return;
    }

    // التحقق من عدم تكرار الرمز
    if (chartOfAccounts.some(acc => acc.code === newAccount.code)) {
      alert('رمز الحساب موجود مسبقاً');
      return;
    }

    // تحديد المستوى والوالد
    let level = 0;
    let parentAccount = '';
    
    if (newAccount.parentAccount) {
      const parent = chartOfAccounts.find(acc => acc.code === newAccount.parentAccount);
      if (parent) {
        level = parent.level + 1;
        parentAccount = parent.code;
      }
    }

    const accountData = {
      ...newAccount,
      level,
      parentAccount,
      id: Date.now()
    };

    addAccount(accountData);
    setNewAccount({
      code: '',
      name: '',
      type: 'asset',
      parentAccount: '',
      description: '',
      isActive: true,
      level: 0,
      balance: 0
    });
    setShowAddModal(false);
  };

  const handleEditAccount = () => {
    if (!selectedAccount.code || !selectedAccount.name) {
      alert('يرجى إدخال رمز الحساب واسم الحساب');
      return;
    }

    updateAccount(selectedAccount.id, selectedAccount);
    setShowEditModal(false);
    setSelectedAccount(null);
  };

  const handleDeleteAccount = (account) => {
    if (window.confirm(`هل أنت متأكد من حذف الحساب "${account.name}"؟`)) {
      deleteAccount(account.id);
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['رمز الحساب', 'اسم الحساب', 'النوع', 'الوالد', 'الرصيد', 'الحالة', 'الوصف'],
      ...filteredAccounts.map(acc => [
        acc.code,
        acc.name,
        accountTypes[acc.type]?.label || acc.type,
        acc.parentAccount || '',
        acc.balance || 0,
        acc.isActive ? 'نشط' : 'غير نشط',
        acc.description || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `دليل_الحسابات_${new Date().toLocaleDateString('ar-EG')}.csv`;
    link.click();
  };

  const renderAccountRow = (account, level = 0) => {
    const hasChildren = account.children && account.children.length > 0;
    const isExpanded = expandedAccounts.has(account.code);
    const TypeIcon = accountTypes[account.type]?.icon || FaFolder;
    
    return (
      <React.Fragment key={account.code}>
        <tr className="hover:bg-gray-50">
          <td className="px-4 py-3">
            <div className="flex items-center gap-2" style={{ paddingRight: `${level * 20}px` }}>
              {hasChildren ? (
                <button
                  onClick={() => toggleExpanded(account.code)}
                  className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded"
                >
                  <FaSitemap className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </button>
              ) : (
                <div className="w-6" />
              )}
              <TypeIcon className="text-gray-600" />
              <span className="font-mono text-sm">{account.code}</span>
            </div>
          </td>
          <td className="px-4 py-3 font-semibold">{account.name}</td>
          <td className="px-4 py-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${accountTypes[account.type]?.color}`}>
              {accountTypes[account.type]?.label || account.type}
            </span>
          </td>
          <td className="px-4 py-3">{account.parentAccount || '-'}</td>
          <td className="px-4 py-3 text-right font-semibold">
            {Number(account.balance || 0).toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
          </td>
          <td className="px-4 py-3">
            <span className={`px-2 py-1 rounded text-xs ${account.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {account.isActive ? 'نشط' : 'غير نشط'}
            </span>
          </td>
          <td className="px-4 py-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedAccount(account);
                  setShowEditModal(true);
                }}
              >
                <FaEdit />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteAccount(account)}
                className="text-red-600 hover:bg-red-50"
              >
                <FaTrash />
              </Button>
            </div>
          </td>
        </tr>
        {hasChildren && isExpanded && account.children.map(child => renderAccountRow(child, level + 1))}
      </React.Fragment>
    );
  };

  // حساب الإحصائيات
  const totalAccounts = chartOfAccounts.length;
  const activeAccounts = chartOfAccounts.filter(acc => acc.isActive).length;
  const totalBalance = chartOfAccounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
  const accountsByType = Object.keys(accountTypes).map(type => ({
    type,
    count: chartOfAccounts.filter(acc => acc.type === type).length,
    ...accountTypes[type]
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FaSitemap className="text-blue-600" />
            دليل الحسابات
          </h1>
          <p className="text-gray-600 mt-2">إدارة وتنظيم حسابات الشركة</p>
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
              <p className="text-3xl font-bold">{totalAccounts}</p>
            </div>
            <FaSitemap className="text-4xl text-blue-200" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">الحسابات النشطة</p>
              <p className="text-3xl font-bold">{activeAccounts}</p>
            </div>
            <FaTree className="text-4xl text-green-200" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">إجمالي الأرصدة</p>
              <p className="text-2xl font-bold">
                {totalBalance.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <FaBalanceScale className="text-4xl text-purple-200" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">أنواع الحسابات</p>
              <p className="text-3xl font-bold">{accountsByType.length}</p>
            </div>
            <FaFolder className="text-4xl text-orange-200" />
          </div>
        </Card>
      </div>

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
            value={accountTypeFilter}
            onChange={(e) => setAccountTypeFilter(e.target.value)}
            options={[
              { value: 'all', label: 'كل الأنواع' },
              ...Object.entries(accountTypes).map(([key, value]) => ({
                value: key,
                label: value.label
              }))
            ]}
          />
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              عرض {filteredAccounts.length} من {totalAccounts} حساب
            </span>
          </div>
        </div>
      </Card>

      {/* Accounts by Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accountsByType.map(({ type, count, label, color }) => (
          <Card key={type} className="hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">{label}</p>
                <p className="text-2xl font-bold">{count}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
                <FaTree className="text-xl" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Accounts Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">رمز الحساب</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">اسم الحساب</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">النوع</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">الحساب الوالد</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">الرصيد</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">الحالة</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {organizedAccounts.map(account => renderAccountRow(account))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Account Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="إضافة حساب جديد"
      >
        <div className="space-y-4">
          <Input
            label="رمز الحساب"
            value={newAccount.code}
            onChange={(e) => setNewAccount({ ...newAccount, code: e.target.value })}
            placeholder="مثال: 1001"
          />
          <Input
            label="اسم الحساب"
            value={newAccount.name}
            onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
            placeholder="مثال: النقدية في الصندوق"
          />
          <Select
            label="نوع الحساب"
            value={newAccount.type}
            onChange={(e) => setNewAccount({ ...newAccount, type: e.target.value })}
            options={Object.entries(accountTypes).map(([key, value]) => ({
              value: key,
              label: value.label
            }))}
          />
          <Select
            label="الحساب الوالد"
            value={newAccount.parentAccount}
            onChange={(e) => setNewAccount({ ...newAccount, parentAccount: e.target.value })}
            options={[
              { value: '', label: 'حساب رئيسي' },
              ...chartOfAccounts.map(acc => ({
                value: acc.code,
                label: `${acc.code} - ${acc.name}`
              }))
            ]}
          />
          <Input
            label="الرصيد الافتتاحي"
            type="number"
            value={newAccount.balance}
            onChange={(e) => setNewAccount({ ...newAccount, balance: parseFloat(e.target.value) || 0 })}
          />
          <Input
            label="الوصف"
            value={newAccount.description}
            onChange={(e) => setNewAccount({ ...newAccount, description: e.target.value })}
            placeholder="وصف الحساب..."
          />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              إلغاء
            </Button>
            <Button onClick={handleAddAccount}>
              إضافة الحساب
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Account Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="تعديل الحساب"
      >
        <div className="space-y-4">
          <Input
            label="رمز الحساب"
            value={selectedAccount?.code || ''}
            onChange={(e) => setSelectedAccount({ ...selectedAccount, code: e.target.value })}
            disabled
          />
          <Input
            label="اسم الحساب"
            value={selectedAccount?.name || ''}
            onChange={(e) => setSelectedAccount({ ...selectedAccount, name: e.target.value })}
          />
          <Select
            label="نوع الحساب"
            value={selectedAccount?.type || 'asset'}
            onChange={(e) => setSelectedAccount({ ...selectedAccount, type: e.target.value })}
            options={Object.entries(accountTypes).map(([key, value]) => ({
              value: key,
              label: value.label
            }))}
          />
          <Input
            label="الرصيد"
            type="number"
            value={selectedAccount?.balance || 0}
            onChange={(e) => setSelectedAccount({ ...selectedAccount, balance: parseFloat(e.target.value) || 0 })}
          />
          <Input
            label="الوصف"
            value={selectedAccount?.description || ''}
            onChange={(e) => setSelectedAccount({ ...selectedAccount, description: e.target.value })}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={selectedAccount?.isActive || false}
              onChange={(e) => setSelectedAccount({ ...selectedAccount, isActive: e.target.checked })}
              className="rounded border-gray-300"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">الحساب نشط</label>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              إلغاء
            </Button>
            <Button onClick={handleEditAccount}>
              حفظ التعديل
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ChartOfAccounts;