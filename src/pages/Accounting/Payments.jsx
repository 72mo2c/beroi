// ======================================
// Payments & Receipts - المدفوعات والمقبوضات
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
  FaMoneyBillWave, 
  FaPlus, 
  FaSearch, 
  FaFilter,
  FaDownload,
  FaPrint,
  FaCreditCard,
  FaUniversity,
  FaCalendarAlt,
  FaUser,
  FaBuilding,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowUp,
  FaArrowDown,
  FaEye
} from 'react-icons/fa';

const Payments = () => {
  const { 
    payments, 
    setPayments, 
    suppliers, 
    customers, 
    bankAccounts,
    accounts,
    addPayment,
    updatePayment,
    deletePayment 
  } = useData();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // all, payment, receipt
  const [statusFilter, setStatusFilter] = useState('all'); // all, pending, completed, cancelled
  const [dateFilter, setDateFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  
  const [newPayment, setNewPayment] = useState({
    type: 'payment', // payment, receipt
    amount: 0,
    description: '',
    reference: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    payeeType: 'supplier', // supplier, customer, other
    payeeId: '',
    payeeName: '',
    paymentMethod: 'cash', // cash, bank, check, transfer
    bankAccountId: '',
    checkNumber: '',
    notes: '',
    status: 'pending',
    attachments: [],
    currency: 'SAR',
    exchangeRate: 1
  });

  // فلترة المدفوعات والمقبوضات
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.payeeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || payment.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesDate = !dateFilter || new Date(payment.date).toISOString().split('T')[0] === dateFilter;
    
    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  // حساب الإحصائيات
  const totalPayments = payments.length;
  const pendingPayments = payments.filter(p => p.status === 'pending').length;
  const completedPayments = payments.filter(p => p.status === 'completed').length;
  const totalPaymentAmount = payments.filter(p => p.type === 'payment').reduce((sum, p) => sum + p.amount, 0);
  const totalReceiptAmount = payments.filter(p => p.type === 'receipt').reduce((sum, p) => sum + p.amount, 0);
  const netCashFlow = totalReceiptAmount - totalPaymentAmount;

  // إضافة مدفوعة/مقبوضة جديدة
  const handleAddPayment = () => {
    if (!newPayment.amount || newPayment.amount <= 0) {
      alert('يرجى إدخال مبلغ صحيح');
      return;
    }

    if (!newPayment.description) {
      alert('يرجى إدخال وصف المدفوعة/المقبوضة');
      return;
    }

    const paymentData = {
      ...newPayment,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      createdBy: 'المستخدم الحالي'
    };

    addPayment(paymentData);
    resetForm();
    setShowAddModal(false);
  };

  // تعديل المدفوعة/المقبوضة
  const handleEditPayment = () => {
    if (!selectedPayment.amount || selectedPayment.amount <= 0) {
      alert('يرجى إدخال مبلغ صحيح');
      return;
    }

    if (!selectedPayment.description) {
      alert('يرجى إدخال وصف المدفوعة/المقبوضة');
      return;
    }

    updatePayment(selectedPayment.id, selectedPayment);
    setShowEditModal(false);
    setSelectedPayment(null);
  };

  // حذف المدفوعة/المقبوضة
  const handleDeletePayment = (payment) => {
    if (window.confirm(`هل أنت متأكد من حذف ${payment.type === 'payment' ? 'المدفوعة' : 'المقبوضة'} "${payment.description}"؟`)) {
      deletePayment(payment.id);
    }
  };

  // تغيير حالة المدفوعة/المقبوضة
  const changePaymentStatus = (paymentId, newStatus) => {
    const updatedPayments = payments.map(payment => 
      payment.id === paymentId 
        ? { 
            ...payment, 
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date().toISOString() : null
          }
        : payment
    );
    setPayments(updatedPayments);
  };

  // إعادة تعيين النموذج
  const resetForm = () => {
    setNewPayment({
      type: 'payment',
      amount: 0,
      description: '',
      reference: '',
      date: new Date().toISOString().split('T')[0],
      dueDate: '',
      payeeType: 'supplier',
      payeeId: '',
      payeeName: '',
      paymentMethod: 'cash',
      bankAccountId: '',
      checkNumber: '',
      notes: '',
      status: 'pending',
      attachments: [],
      currency: 'SAR',
      exchangeRate: 1
    });
  };

  // تحديث الطرف المقابل
  const handlePayeeChange = (payeeId, payeeType) => {
    let payeeName = '';
    
    if (payeeType === 'supplier') {
      const supplier = suppliers.find(s => s.id === parseInt(payeeId));
      payeeName = supplier ? supplier.name : '';
    } else if (payeeType === 'customer') {
      const customer = customers.find(c => c.id === parseInt(payeeId));
      payeeName = customer ? customer.name : '';
    }

    if (newPayment.type === 'payment') {
      setNewPayment({
        ...newPayment,
        payeeId,
        payeeType,
        payeeName
      });
    } else {
      setSelectedPayment({
        ...selectedPayment,
        payeeId,
        payeeType,
        payeeName
      });
    }
  };

  // تصدير البيانات
  const handleExport = () => {
    const csvContent = [
      ['النوع', 'الرقم المرجعي', 'التاريخ', 'الطرف المقابل', 'المبلغ', 'طريقة الدفع', 'الحالة', 'الوصف'],
      ...filteredPayments.map(payment => [
        payment.type === 'payment' ? 'مدفوعة' : 'مقبوضة',
        payment.reference || '-',
        new Date(payment.date).toLocaleDateString('ar-EG'),
        payment.payeeName,
        payment.amount.toFixed(2),
        payment.paymentMethod === 'cash' ? 'نقدي' :
        payment.paymentMethod === 'bank' ? 'تحويل بنكي' :
        payment.paymentMethod === 'check' ? 'شيك' :
        payment.paymentMethod === 'transfer' ? 'حوالة' : payment.paymentMethod,
        payment.status === 'pending' ? 'معلق' :
        payment.status === 'completed' ? 'مكتمل' :
        payment.status === 'cancelled' ? 'ملغي' : payment.status,
        payment.description
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `المدفوعات_والمقبوضات_${new Date().toLocaleDateString('ar-EG')}.csv`;
    link.click();
  };

  // أعمدة الجدول
  const columns = [
    {
      header: 'النوع',
      accessor: 'type',
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.type === 'payment' ? (
            <FaArrowDown className="text-red-500" />
          ) : (
            <FaArrowUp className="text-green-500" />
          )}
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            row.type === 'payment' 
              ? 'bg-red-100 text-red-700' 
              : 'bg-green-100 text-green-700'
          }`}>
            {row.type === 'payment' ? 'مدفوعة' : 'مقبوضة'}
          </span>
        </div>
      )
    },
    {
      header: 'الرقم المرجعي',
      accessor: 'reference',
      render: (row) => (
        <span className="font-mono text-blue-600">{row.reference || '-'}</span>
      )
    },
    {
      header: 'التاريخ',
      accessor: 'date',
      render: (row) => new Date(row.date).toLocaleDateString('ar-EG')
    },
    {
      header: 'الطرف المقابل',
      accessor: 'payeeName',
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.payeeType === 'supplier' ? (
            <FaBuilding className="text-gray-500" />
          ) : row.payeeType === 'customer' ? (
            <FaUser className="text-gray-500" />
          ) : (
            <FaCreditCard className="text-gray-500" />
          )}
          <div>
            <p className="font-medium">{row.payeeName || row.payeeName}</p>
            <p className="text-sm text-gray-500">
              {row.payeeType === 'supplier' ? 'مورد' :
               row.payeeType === 'customer' ? 'عميل' : 'أخرى'}
            </p>
          </div>
        </div>
      )
    },
    {
      header: 'المبلغ',
      accessor: 'amount',
      render: (row) => (
        <span className={`font-bold text-lg ${row.type === 'payment' ? 'text-red-600' : 'text-green-600'}`}>
          {row.amount.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} {row.currency}
        </span>
      )
    },
    {
      header: 'طريقة الدفع',
      accessor: 'paymentMethod',
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.paymentMethod === 'cash' && <FaMoneyBillWave className="text-gray-500" />}
          {row.paymentMethod === 'bank' && <FaUniversity className="text-gray-500" />}
          {row.paymentMethod === 'check' && <FaCreditCard className="text-gray-500" />}
          {row.paymentMethod === 'transfer' && <FaArrowUp className="text-gray-500" />}
          <span>
            {row.paymentMethod === 'cash' ? 'نقدي' :
             row.paymentMethod === 'bank' ? 'تحويل بنكي' :
             row.paymentMethod === 'check' ? 'شيك' :
             row.paymentMethod === 'transfer' ? 'حوالة' : row.paymentMethod}
          </span>
        </div>
      )
    },
    {
      header: 'الحالة',
      accessor: 'status',
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.status === 'pending' && <FaClock className="text-yellow-500" />}
          {row.status === 'completed' && <FaCheckCircle className="text-green-500" />}
          {row.status === 'cancelled' && <FaTimesCircle className="text-red-500" />}
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            row.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
            row.status === 'completed' ? 'bg-green-100 text-green-700' :
            'bg-red-100 text-red-700'
          }`}>
            {row.status === 'pending' ? 'معلق' :
             row.status === 'completed' ? 'مكتمل' :
             row.status === 'cancelled' ? 'ملغي' : row.status}
          </span>
        </div>
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
              setSelectedPayment(row);
              setShowDetailsModal(true);
            }}
          >
            <FaEye />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedPayment(row);
              setShowEditModal(true);
            }}
          >
            <FaEdit />
          </Button>
          {row.status === 'pending' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => changePaymentStatus(row.id, 'completed')}
                className="text-green-600 hover:bg-green-50"
              >
                <FaCheckCircle />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => changePaymentStatus(row.id, 'cancelled')}
                className="text-red-600 hover:bg-red-50"
              >
                <FaTimesCircle />
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeletePayment(row)}
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
            <FaMoneyBillWave className="text-green-600" />
            المدفوعات والمقبوضات
          </h1>
          <p className="text-gray-600 mt-2">إدارة ومراقبة جميع المدفوعات والمقبوضات النقدية والبنكية</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleExport} variant="outline">
            <FaDownload className="ml-2" />
            تصدير Excel
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <FaPlus className="ml-2" />
            إضافة جديد
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">إجمالي العمليات</p>
              <p className="text-3xl font-bold">{totalPayments}</p>
            </div>
            <FaMoneyBillWave className="text-4xl text-blue-200" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">إجمالي المقبوضات</p>
              <p className="text-2xl font-bold">
                {totalReceiptAmount.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <FaArrowUp className="text-4xl text-green-200" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">إجمالي المدفوعات</p>
              <p className="text-2xl font-bold">
                {totalPaymentAmount.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <FaArrowDown className="text-4xl text-red-200" />
          </div>
        </Card>
        
        <Card className={`bg-gradient-to-r ${netCashFlow >= 0 ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'} text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">صافي التدفق النقدي</p>
              <p className="text-2xl font-bold">
                {netCashFlow.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <FaMoneyBillWave className="text-4xl text-white opacity-70" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="البحث في المدفوعات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={FaSearch}
          />
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            options={[
              { value: 'all', label: 'كل الأنواع' },
              { value: 'payment', label: 'مدفوعات فقط' },
              { value: 'receipt', label: 'مقبوضات فقط' }
            ]}
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'كل الحالات' },
              { value: 'pending', label: 'معلق' },
              { value: 'completed', label: 'مكتمل' },
              { value: 'cancelled', label: 'ملغي' }
            ]}
          />
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            icon={FaCalendarAlt}
          />
        </div>
      </Card>

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-yellow-50 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-700 font-semibold">معلق</p>
              <p className="text-2xl font-bold text-yellow-800">{pendingPayments}</p>
            </div>
            <FaClock className="text-4xl text-yellow-500" />
          </div>
        </Card>
        
        <Card className="bg-green-50 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-700 font-semibold">مكتمل</p>
              <p className="text-2xl font-bold text-green-800">{completedPayments}</p>
            </div>
            <FaCheckCircle className="text-4xl text-green-500" />
          </div>
        </Card>
        
        <Card className="bg-blue-50 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 font-semibold">معدل الإنجاز</p>
              <p className="text-2xl font-bold text-blue-800">
                {totalPayments > 0 ? ((completedPayments / totalPayments) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <FaCheckCircle className="text-4xl text-blue-500" />
          </div>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <Table
          columns={columns}
          data={filteredPayments}
          noDataMessage="لا توجد مدفوعات أو مقبوضات"
        />
      </Card>

      {/* Add Payment Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="إضافة مدفوعة/مقبوضة جديدة"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="النوع"
              value={newPayment.type}
              onChange={(e) => setNewPayment({ ...newPayment, type: e.target.value })}
              options={[
                { value: 'payment', label: 'مدفوعة' },
                { value: 'receipt', label: 'مقبوضة' }
              ]}
            />
            <Input
              label="المبلغ"
              type="number"
              step="0.01"
              value={newPayment.amount}
              onChange={(e) => setNewPayment({ ...newPayment, amount: parseFloat(e.target.value) || 0 })}
            />
          </div>

          <Input
            label="الوصف"
            value={newPayment.description}
            onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
            placeholder="وصف المدفوعة/المقبوضة"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="رقم المرجع"
              value={newPayment.reference}
              onChange={(e) => setNewPayment({ ...newPayment, reference: e.target.value })}
              placeholder="رقم الفاتورة أو المرجع"
            />
            <Input
              label="التاريخ"
              type="date"
              value={newPayment.date}
              onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="الطرف المقابل"
              value={newPayment.payeeType}
              onChange={(e) => setNewPayment({ 
                ...newPayment, 
                payeeType: e.target.value,
                payeeId: '',
                payeeName: ''
              })}
              options={[
                { value: 'supplier', label: 'مورد' },
                { value: 'customer', label: 'عميل' },
                { value: 'other', label: 'أخرى' }
              ]}
            />
            {newPayment.payeeType === 'supplier' && (
              <Select
                label="اختر المورد"
                value={newPayment.payeeId}
                onChange={(e) => handlePayeeChange(e.target.value, 'supplier')}
                options={[
                  { value: '', label: 'اختر المورد...' },
                  ...suppliers.map(supplier => ({
                    value: supplier.id,
                    label: supplier.name
                  }))
                ]}
              />
            )}
            {newPayment.payeeType === 'customer' && (
              <Select
                label="اختر العميل"
                value={newPayment.payeeId}
                onChange={(e) => handlePayeeChange(e.target.value, 'customer')}
                options={[
                  { value: '', label: 'اختر العميل...' },
                  ...customers.map(customer => ({
                    value: customer.id,
                    label: customer.name
                  }))
                ]}
              />
            )}
            {newPayment.payeeType === 'other' && (
              <Input
                label="اسم الطرف المقابل"
                value={newPayment.payeeName}
                onChange={(e) => setNewPayment({ ...newPayment, payeeName: e.target.value })}
                placeholder="اسم البنك أو الجهة"
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="طريقة الدفع"
              value={newPayment.paymentMethod}
              onChange={(e) => setNewPayment({ ...newPayment, paymentMethod: e.target.value })}
              options={[
                { value: 'cash', label: 'نقدي' },
                { value: 'bank', label: 'تحويل بنكي' },
                { value: 'check', label: 'شيك' },
                { value: 'transfer', label: 'حوالة' }
              ]}
            />
            <Select
              label="العملة"
              value={newPayment.currency}
              onChange={(e) => setNewPayment({ ...newPayment, currency: e.target.value })}
              options={[
                { value: 'SAR', label: 'ريال سعودي' },
                { value: 'USD', label: 'دولار أمريكي' },
                { value: 'EUR', label: 'يورو' },
                { value: 'AED', label: 'درهم إماراتي' }
              ]}
            />
          </div>

          {newPayment.paymentMethod === 'bank' && (
            <Select
              label="الحساب البنكي"
              value={newPayment.bankAccountId}
              onChange={(e) => setNewPayment({ ...newPayment, bankAccountId: e.target.value })}
              options={[
                { value: '', label: 'اختر الحساب البنكي...' },
                ...bankAccounts.filter(acc => acc.isActive).map(account => ({
                  value: account.id,
                  label: `${account.bankName} - ${account.accountNumber}`
                }))
              ]}
            />
          )}

          {newPayment.paymentMethod === 'check' && (
            <Input
              label="رقم الشيك"
              value={newPayment.checkNumber}
              onChange={(e) => setNewPayment({ ...newPayment, checkNumber: e.target.value })}
              placeholder="رقم الشيك"
            />
          )}

          <Input
            label="تاريخ الاستحقاق"
            type="date"
            value={newPayment.dueDate}
            onChange={(e) => setNewPayment({ ...newPayment, dueDate: e.target.value })}
          />

          <Input
            label="ملاحظات"
            value={newPayment.notes}
            onChange={(e) => setNewPayment({ ...newPayment, notes: e.target.value })}
            placeholder="ملاحظات إضافية..."
          />

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              إلغاء
            </Button>
            <Button onClick={handleAddPayment}>
              إضافة {newPayment.type === 'payment' ? 'المدفوعة' : 'المقبوضة'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Payment Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="تعديل المدفوعة/المقبوضة"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="المبلغ"
              type="number"
              step="0.01"
              value={selectedPayment?.amount || 0}
              onChange={(e) => setSelectedPayment({ 
                ...selectedPayment, 
                amount: parseFloat(e.target.value) || 0 
              })}
            />
            <Input
              label="الوصف"
              value={selectedPayment?.description || ''}
              onChange={(e) => setSelectedPayment({ 
                ...selectedPayment, 
                description: e.target.value 
              })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="رقم المرجع"
              value={selectedPayment?.reference || ''}
              onChange={(e) => setSelectedPayment({ 
                ...selectedPayment, 
                reference: e.target.value 
              })}
            />
            <Input
              label="التاريخ"
              type="date"
              value={selectedPayment?.date || ''}
              onChange={(e) => setSelectedPayment({ 
                ...selectedPayment, 
                date: e.target.value 
              })}
            />
          </div>

          <Select
            label="حالة المعاملة"
            value={selectedPayment?.status || 'pending'}
            onChange={(e) => setSelectedPayment({ 
              ...selectedPayment, 
              status: e.target.value 
            })}
            options={[
              { value: 'pending', label: 'معلق' },
              { value: 'completed', label: 'مكتمل' },
              { value: 'cancelled', label: 'ملغي' }
            ]}
          />

          <Input
            label="ملاحظات"
            value={selectedPayment?.notes || ''}
            onChange={(e) => setSelectedPayment({ 
              ...selectedPayment, 
              notes: e.target.value 
            })}
          />

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              إلغاء
            </Button>
            <Button onClick={handleEditPayment}>
              حفظ التعديل
            </Button>
          </div>
        </div>
      </Modal>

      {/* Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="تفاصيل المعاملة"
        size="lg"
      >
        {selectedPayment && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">النوع</p>
                <div className="flex items-center gap-2">
                  {selectedPayment.type === 'payment' ? (
                    <FaArrowDown className="text-red-500" />
                  ) : (
                    <FaArrowUp className="text-green-500" />
                  )}
                  <p className="font-semibold">
                    {selectedPayment.type === 'payment' ? 'مدفوعة' : 'مقبوضة'}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">الحالة</p>
                <p className="font-semibold">
                  {selectedPayment.status === 'pending' ? 'معلق' :
                   selectedPayment.status === 'completed' ? 'مكتمل' :
                   selectedPayment.status === 'cancelled' ? 'ملغي' : selectedPayment.status}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">المبلغ</p>
                <p className="font-semibold text-xl">
                  {selectedPayment.amount.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} {selectedPayment.currency}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">التاريخ</p>
                <p className="font-semibold">{new Date(selectedPayment.date).toLocaleDateString('ar-EG')}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600">الوصف</p>
              <p className="font-semibold">{selectedPayment.description}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">الطرف المقابل</p>
              <div className="flex items-center gap-2">
                {selectedPayment.payeeType === 'supplier' && <FaBuilding className="text-gray-500" />}
                {selectedPayment.payeeType === 'customer' && <FaUser className="text-gray-500" />}
                <p className="font-semibold">{selectedPayment.payeeName}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600">طريقة الدفع</p>
              <p className="font-semibold">
                {selectedPayment.paymentMethod === 'cash' ? 'نقدي' :
                 selectedPayment.paymentMethod === 'bank' ? 'تحويل بنكي' :
                 selectedPayment.paymentMethod === 'check' ? 'شيك' :
                 selectedPayment.paymentMethod === 'transfer' ? 'حوالة' : selectedPayment.paymentMethod}
              </p>
            </div>

            {selectedPayment.reference && (
              <div>
                <p className="text-sm text-gray-600">رقم المرجع</p>
                <p className="font-semibold font-mono">{selectedPayment.reference}</p>
              </div>
            )}

            {selectedPayment.notes && (
              <div>
                <p className="text-sm text-gray-600">ملاحظات</p>
                <p className="font-semibold">{selectedPayment.notes}</p>
              </div>
            )}

            {selectedPayment.completedAt && (
              <div>
                <p className="text-sm text-gray-600">تاريخ الإكمال</p>
                <p className="font-semibold text-green-600">
                  {new Date(selectedPayment.completedAt).toLocaleDateString('ar-EG')}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                إغلاق
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Payments;