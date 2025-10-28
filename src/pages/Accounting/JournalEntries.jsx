// ======================================
// Journal Entries - الدفتر اليومية
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
  FaEdit, 
  FaPlus, 
  FaSearch, 
  FaCalendar, 
  FaMoneyBillWave, 
  FaUser, 
  FaClipboardList,
  FaTrash,
  FaDownload,
  FaCheck,
  FaTimes,
  FaFileAlt
} from 'react-icons/fa';

const JournalEntries = () => {
  const { journalEntries, setJournalEntries, accounts } = useData();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    reference: '',
    description: '',
    entries: [
      { accountCode: '', accountName: '', debit: 0, credit: 0, description: '' }
    ],
    totalDebit: 0,
    totalCredit: 0,
    status: 'draft',
    createdBy: 'المستخدم الحالي',
    notes: ''
  });

  // حساب إجمالي الدائن والمدين
  const calculateTotals = (entries) => {
    const totalDebit = entries.reduce((sum, entry) => sum + (parseFloat(entry.debit) || 0), 0);
    const totalCredit = entries.reduce((sum, entry) => sum + (parseFloat(entry.credit) || 0), 0);
    return { totalDebit, totalCredit };
  };

  // إضافة قيد جديد
  const addJournalEntry = () => {
    if (!newEntry.description || newEntry.entries.length === 0) {
      alert('يرجى ملء الوصف وإضافة القيود');
      return;
    }

    const { totalDebit, totalCredit } = calculateTotals(newEntry.entries);
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      alert('يجب أن يتساوي إجمالي المدين والدائن');
      return;
    }

    const entryData = {
      ...newEntry,
      totalDebit,
      totalCredit,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };

    setJournalEntries([...journalEntries, entryData]);
    resetForm();
    setShowAddModal(false);
  };

  // تعديل القيد
  const updateJournalEntry = () => {
    if (!selectedEntry.description || selectedEntry.entries.length === 0) {
      alert('يرجى ملء الوصف وإضافة القيود');
      return;
    }

    const { totalDebit, totalCredit } = calculateTotals(selectedEntry.entries);
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      alert('يجب أن يتساوي إجمالي المدين والدائن');
      return;
    }

    const updatedEntries = journalEntries.map(entry => 
      entry.id === selectedEntry.id 
        ? { ...selectedEntry, totalDebit, totalCredit }
        : entry
    );

    setJournalEntries(updatedEntries);
    setShowEditModal(false);
    setSelectedEntry(null);
  };

  // حذف القيد
  const deleteJournalEntry = (entryId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا القيد؟')) {
      setJournalEntries(journalEntries.filter(entry => entry.id !== entryId));
    }
  };

  // تغيير حالة القيد
  const changeEntryStatus = (entryId, newStatus) => {
    const updatedEntries = journalEntries.map(entry => 
      entry.id === entryId 
        ? { ...entry, status: newStatus, postedAt: new Date().toISOString() }
        : entry
    );
    setJournalEntries(updatedEntries);
  };

  // إضافة قيد فرعي جديد
  const addEntryLine = () => {
    setNewEntry({
      ...newEntry,
      entries: [...newEntry.entries, { accountCode: '', accountName: '', debit: 0, credit: 0, description: '' }]
    });
  };

  const addEditEntryLine = () => {
    setSelectedEntry({
      ...selectedEntry,
      entries: [...selectedEntry.entries, { accountCode: '', accountName: '', debit: 0, credit: 0, description: '' }]
    });
  };

  // حذف قيد فرعي
  const removeEntryLine = (index, isEditing = false) => {
    if (isEditing) {
      if (selectedEntry.entries.length > 1) {
        setSelectedEntry({
          ...selectedEntry,
          entries: selectedEntry.entries.filter((_, i) => i !== index)
        });
      }
    } else {
      if (newEntry.entries.length > 1) {
        setNewEntry({
          ...newEntry,
          entries: newEntry.entries.filter((_, i) => i !== index)
        });
      }
    }
  };

  // تحديث قيد فرعي
  const updateEntryLine = (index, field, value, isEditing = false) => {
    if (isEditing) {
      const newEntries = [...selectedEntry.entries];
      newEntries[index] = { ...newEntries[index], [field]: value };
      
      // تحديث اسم الحساب
      if (field === 'accountCode') {
        const account = accounts.find(acc => acc.code === value);
        newEntries[index].accountName = account ? account.name : '';
      }
      
      setSelectedEntry({ ...selectedEntry, entries: newEntries });
    } else {
      const newEntries = [...newEntry.entries];
      newEntries[index] = { ...newEntries[index], [field]: value };
      
      // تحديث اسم الحساب
      if (field === 'accountCode') {
        const account = accounts.find(acc => acc.code === value);
        newEntries[index].accountName = account ? account.name : '';
      }
      
      setNewEntry({ ...newEntry, entries: newEntries });
    }
  };

  // إعادة تعيين النموذج
  const resetForm = () => {
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      reference: '',
      description: '',
      entries: [{ accountCode: '', accountName: '', debit: 0, credit: 0, description: '' }],
      totalDebit: 0,
      totalCredit: 0,
      status: 'draft',
      createdBy: 'المستخدم الحالي',
      notes: ''
    });
  };

  // فلترة القيود
  const filteredEntries = journalEntries.filter(entry => {
    const matchesSearch = entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    const matchesDate = !dateFilter || new Date(entry.date).toISOString().split('T')[0] === dateFilter;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // حساب الإحصائيات
  const totalEntries = journalEntries.length;
  const draftEntries = journalEntries.filter(entry => entry.status === 'draft').length;
  const postedEntries = journalEntries.filter(entry => entry.status === 'posted').length;
  const totalDebitAmount = journalEntries.reduce((sum, entry) => sum + entry.totalDebit, 0);
  const totalCreditAmount = journalEntries.reduce((sum, entry) => sum + entry.totalCredit, 0);

  const statusOptions = [
    { value: 'all', label: 'كل الحالات' },
    { value: 'draft', label: 'مسودة' },
    { value: 'posted', label: 'مرحل' },
    { value: 'reversed', label: 'معكوس' }
  ];

  const handleExport = () => {
    const csvContent = [
      ['رقم القيد', 'التاريخ', 'المرجع', 'الوصف', 'إجمالي المدين', 'إجمالي الدائن', 'الحالة', 'المُنشئ'],
      ...filteredEntries.map(entry => [
        entry.id,
        new Date(entry.date).toLocaleDateString('ar-EG'),
        entry.reference || '-',
        entry.description,
        entry.totalDebit.toFixed(2),
        entry.totalCredit.toFixed(2),
        statusOptions.find(s => s.value === entry.status)?.label || entry.status,
        entry.createdBy
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `الدفتر_اليومية_${new Date().toLocaleDateString('ar-EG')}.csv`;
    link.click();
  };

  const columns = [
    {
      header: 'رقم القيد',
      accessor: 'id',
      render: (row) => (
        <span className="font-semibold text-blue-600">#{row.id}</span>
      )
    },
    {
      header: 'التاريخ',
      accessor: 'date',
      render: (row) => new Date(row.date).toLocaleDateString('ar-EG')
    },
    {
      header: 'المرجع',
      accessor: 'reference',
      render: (row) => row.reference || '-'
    },
    {
      header: 'الوصف',
      accessor: 'description',
      render: (row) => (
        <div className="max-w-xs">
          <p className="font-medium truncate">{row.description}</p>
          {row.entries.length > 0 && (
            <p className="text-sm text-gray-500">{row.entries.length} قيد فرعي</p>
          )}
        </div>
      )
    },
    {
      header: 'المدين',
      accessor: 'totalDebit',
      render: (row) => (
        <span className="text-green-600 font-semibold">
          {row.totalDebit.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
        </span>
      )
    },
    {
      header: 'الدائن',
      accessor: 'totalCredit',
      render: (row) => (
        <span className="text-blue-600 font-semibold">
          {row.totalCredit.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
        </span>
      )
    },
    {
      header: 'الحالة',
      accessor: 'status',
      render: (row) => {
        const statusConfig = {
          'draft': { label: 'مسودة', color: 'bg-gray-100 text-gray-700' },
          'posted': { label: 'مرحل', color: 'bg-green-100 text-green-700' },
          'reversed': { label: 'معكوس', color: 'bg-red-100 text-red-700' }
        };
        const config = statusConfig[row.status] || { label: row.status, color: 'bg-gray-100 text-gray-700' };
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
            {config.label}
          </span>
        );
      }
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
              setSelectedEntry(row);
              setShowDetailsModal(true);
            }}
          >
            <FaFileAlt />
          </Button>
          {row.status === 'draft' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedEntry(row);
                  setShowEditModal(true);
                }}
              >
                <FaEdit />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => changeEntryStatus(row.id, 'posted')}
                className="text-green-600 hover:bg-green-50"
              >
                <FaCheck />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => deleteJournalEntry(row.id)}
                className="text-red-600 hover:bg-red-50"
              >
                <FaTrash />
              </Button>
            </>
          )}
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
            <FaClipboardList className="text-blue-600" />
            الدفتر اليومية
          </h1>
          <p className="text-gray-600 mt-2">تسجيل ومراقبة القيود المحاسبية</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleExport} variant="outline">
            <FaDownload className="ml-2" />
            تصدير Excel
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <FaPlus className="ml-2" />
            قيد جديد
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">إجمالي القيود</p>
              <p className="text-3xl font-bold">{totalEntries}</p>
            </div>
            <FaClipboardList className="text-4xl text-blue-200" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">القيود المسودة</p>
              <p className="text-3xl font-bold">{draftEntries}</p>
            </div>
            <FaEdit className="text-4xl text-yellow-200" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">القيود المرحلة</p>
              <p className="text-3xl font-bold">{postedEntries}</p>
            </div>
            <FaCheck className="text-4xl text-green-200" />
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
            <FaMoneyBillWave className="text-4xl text-purple-200" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="البحث في القيود..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={FaSearch}
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={statusOptions}
          />
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            icon={FaCalendar}
          />
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              عرض {filteredEntries.length} من {totalEntries} قيد
            </span>
          </div>
        </div>
      </Card>

      {/* Balance Check */}
      <Card className="bg-blue-50 border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <FaCheck className="text-blue-600 text-xl" />
            <div>
              <h3 className="font-semibold text-blue-900">فحص التوازن</h3>
              <p className="text-sm text-blue-700">
                إجمالي المدين: {totalDebitAmount.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} | 
                إجمالي الدائن: {totalCreditAmount.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-lg font-semibold ${
            Math.abs(totalDebitAmount - totalCreditAmount) < 0.01 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {Math.abs(totalDebitAmount - totalCreditAmount) < 0.01 ? 'متوازن ✓' : 'غير متوازن ✗'}
          </div>
        </div>
      </Card>

      {/* Journal Entries Table */}
      <Card>
        <Table
          columns={columns}
          data={filteredEntries}
          noDataMessage="لا توجد قيود محاسبية"
        />
      </Card>

      {/* Add Entry Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="إضافة قيد جديد"
        size="xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="التاريخ"
              type="date"
              value={newEntry.date}
              onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
              icon={FaCalendar}
            />
            <Input
              label="رقم المرجع"
              value={newEntry.reference}
              onChange={(e) => setNewEntry({ ...newEntry, reference: e.target.value })}
              placeholder="رقم الفاتورة أو المرجع..."
            />
          </div>
          
          <Input
            label="الوصف"
            value={newEntry.description}
            onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
            placeholder="وصف القيد المحاسبي..."
          />

          {/* Journal Entry Lines */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">قيود القيد</h3>
              <Button onClick={addEntryLine} size="sm">
                <FaPlus className="ml-2" />
                إضافة قيد فرعي
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-right text-sm font-semibold">الحساب</th>
                    <th className="px-4 py-2 text-right text-sm font-semibold">الوصف</th>
                    <th className="px-4 py-2 text-right text-sm font-semibold">مدين</th>
                    <th className="px-4 py-2 text-right text-sm font-semibold">دائن</th>
                    <th className="px-4 py-2 text-right text-sm font-semibold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {newEntry.entries.map((entry, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">
                        <Select
                          value={entry.accountCode}
                          onChange={(e) => updateEntryLine(index, 'accountCode', e.target.value)}
                          options={[
                            { value: '', label: 'اختر الحساب...' },
                            ...accounts.map(acc => ({
                              value: acc.code,
                              label: `${acc.code} - ${acc.name}`
                            }))
                          ]}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          value={entry.description}
                          onChange={(e) => updateEntryLine(index, 'description', e.target.value)}
                          placeholder="وصف القيد..."
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          type="number"
                          step="0.01"
                          value={entry.debit}
                          onChange={(e) => updateEntryLine(index, 'debit', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          type="number"
                          step="0.01"
                          value={entry.credit}
                          onChange={(e) => updateEntryLine(index, 'credit', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeEntryLine(index)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-100">
                  <tr>
                    <td colSpan="2" className="px-4 py-2 font-semibold text-right">الإجمالي:</td>
                    <td className="px-4 py-2 font-semibold text-green-600">
                      {calculateTotals(newEntry.entries).totalDebit.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 font-semibold text-blue-600">
                      {calculateTotals(newEntry.entries).totalCredit.toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <Input
            label="ملاحظات"
            value={newEntry.notes}
            onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
            placeholder="ملاحظات إضافية..."
          />

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              إلغاء
            </Button>
            <Button onClick={addJournalEntry}>
              حفظ القيد
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Entry Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="تعديل القيد"
        size="xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="التاريخ"
              type="date"
              value={selectedEntry?.date || ''}
              onChange={(e) => setSelectedEntry({ ...selectedEntry, date: e.target.value })}
            />
            <Input
              label="رقم المرجع"
              value={selectedEntry?.reference || ''}
              onChange={(e) => setSelectedEntry({ ...selectedEntry, reference: e.target.value })}
            />
          </div>
          
          <Input
            label="الوصف"
            value={selectedEntry?.description || ''}
            onChange={(e) => setSelectedEntry({ ...selectedEntry, description: e.target.value })}
          />

          {/* Similar journal entry lines as Add Modal */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">قيود القيد</h3>
              <Button onClick={addEditEntryLine} size="sm">
                <FaPlus className="ml-2" />
                إضافة قيد فرعي
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-right text-sm font-semibold">الحساب</th>
                    <th className="px-4 py-2 text-right text-sm font-semibold">الوصف</th>
                    <th className="px-4 py-2 text-right text-sm font-semibold">مدين</th>
                    <th className="px-4 py-2 text-right text-sm font-semibold">دائن</th>
                    <th className="px-4 py-2 text-right text-sm font-semibold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedEntry?.entries.map((entry, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">
                        <Select
                          value={entry.accountCode}
                          onChange={(e) => updateEntryLine(index, 'accountCode', e.target.value, true)}
                          options={[
                            { value: '', label: 'اختر الحساب...' },
                            ...accounts.map(acc => ({
                              value: acc.code,
                              label: `${acc.code} - ${acc.name}`
                            }))
                          ]}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          value={entry.description}
                          onChange={(e) => updateEntryLine(index, 'description', e.target.value, true)}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          type="number"
                          step="0.01"
                          value={entry.debit}
                          onChange={(e) => updateEntryLine(index, 'debit', parseFloat(e.target.value) || 0, true)}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          type="number"
                          step="0.01"
                          value={entry.credit}
                          onChange={(e) => updateEntryLine(index, 'credit', parseFloat(e.target.value) || 0, true)}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeEntryLine(index, true)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-100">
                  <tr>
                    <td colSpan="2" className="px-4 py-2 font-semibold text-right">الإجمالي:</td>
                    <td className="px-4 py-2 font-semibold text-green-600">
                      {selectedEntry ? calculateTotals(selectedEntry.entries).totalDebit.toFixed(2) : '0.00'}
                    </td>
                    <td className="px-4 py-2 font-semibold text-blue-600">
                      {selectedEntry ? calculateTotals(selectedEntry.entries).totalCredit.toFixed(2) : '0.00'}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              إلغاء
            </Button>
            <Button onClick={updateJournalEntry}>
              حفظ التعديل
            </Button>
          </div>
        </div>
      </Modal>

      {/* Entry Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="تفاصيل القيد"
        size="lg"
      >
        {selectedEntry && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">رقم القيد</p>
                <p className="font-semibold">#{selectedEntry.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">التاريخ</p>
                <p className="font-semibold">{new Date(selectedEntry.date).toLocaleDateString('ar-EG')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">المرجع</p>
                <p className="font-semibold">{selectedEntry.reference || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">الحالة</p>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  selectedEntry.status === 'posted' ? 'bg-green-100 text-green-700' :
                  selectedEntry.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {selectedEntry.status === 'posted' ? 'مرحل' : 
                   selectedEntry.status === 'draft' ? 'مسودة' : 'معكوس'}
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600">الوصف</p>
              <p className="font-semibold">{selectedEntry.description}</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-right text-sm font-semibold">الحساب</th>
                    <th className="px-4 py-2 text-right text-sm font-semibold">الوصف</th>
                    <th className="px-4 py-2 text-right text-sm font-semibold">مدين</th>
                    <th className="px-4 py-2 text-right text-sm font-semibold">دائن</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedEntry.entries.map((entry, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">
                        <div>
                          <p className="font-semibold">{entry.accountCode}</p>
                          <p className="text-sm text-gray-600">{entry.accountName}</p>
                        </div>
                      </td>
                      <td className="px-4 py-2">{entry.description}</td>
                      <td className="px-4 py-2 text-green-600 font-semibold">
                        {entry.debit ? parseFloat(entry.debit).toFixed(2) : '-'}
                      </td>
                      <td className="px-4 py-2 text-blue-600 font-semibold">
                        {entry.credit ? parseFloat(entry.credit).toFixed(2) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-100">
                  <tr>
                    <td colSpan="2" className="px-4 py-2 font-semibold text-right">الإجمالي:</td>
                    <td className="px-4 py-2 font-semibold text-green-600">
                      {selectedEntry.totalDebit.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 font-semibold text-blue-600">
                      {selectedEntry.totalCredit.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {selectedEntry.notes && (
              <div>
                <p className="text-sm text-gray-600">ملاحظات</p>
                <p className="font-semibold">{selectedEntry.notes}</p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                إغلاق
              </Button>
              {selectedEntry.status === 'draft' && (
                <Button onClick={() => changeEntryStatus(selectedEntry.id, 'posted')}>
                  <FaCheck className="ml-2" />
                  ترحيل القيد
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default JournalEntries;