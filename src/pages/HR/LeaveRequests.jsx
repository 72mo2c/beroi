// ======================================
// إدارة طلبات الإجازات - Leave Requests Management
// ======================================

import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';
import { useSystemSettings } from '../../hooks/useSystemSettings';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Common/Card';
import Table from '../../components/Common/Table';
import Modal from '../../components/Common/Modal';
import Input from '../../components/Common/Input';
import { Select } from '../../components/Common/Input';
import Button from '../../components/Common/Button';
import { FaCalendarAlt, FaExclamationTriangle, FaPlus, FaEdit, FaTrash, FaSearch, FaCheck, FaTimes, FaEye } from 'react-icons/fa';

const LeaveRequests = () => {
  const { leaveRequests, employees, addLeaveRequest, updateLeaveRequest, deleteLeaveRequest } = useData();
  const { showSuccess, showError } = useNotification();
  const { settings } = useSystemSettings();
  const { hasPermission } = useAuth();

  // فحص الصلاحيات
  const canEditLeave = hasPermission('edit_leave_request');
  const canDeleteLeave = hasPermission('delete_leave_request');
  const canApproveLeave = hasPermission('approve_leave_request');
  const canManageLeaves = hasPermission('manage_leave_requests');

  const [editModal, setEditModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [leaveToDelete, setLeaveToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEmployee, setFilterEmployee] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [formData, setFormData] = useState({
    employeeId: '',
    leaveType: 'annual',
    startDate: '',
    endDate: '',
    days: '',
    reason: '',
    emergencyContact: '',
    status: 'pending',
    approvedBy: '',
    approvalDate: '',
    rejectionReason: ''
  });

  const handleEdit = (leaveRequest) => {
    if (!canEditLeave) {
      showError('ليس لديك صلاحية لتعديل طلبات الإجازة');
      return;
    }
    setSelectedLeave(leaveRequest);
    setFormData({
      employeeId: leaveRequest.employeeId || '',
      leaveType: leaveRequest.leaveType || 'annual',
      startDate: leaveRequest.startDate || '',
      endDate: leaveRequest.endDate || '',
      days: leaveRequest.days || '',
      reason: leaveRequest.reason || '',
      emergencyContact: leaveRequest.emergencyContact || '',
      status: leaveRequest.status || 'pending',
      approvedBy: leaveRequest.approvedBy || '',
      approvalDate: leaveRequest.approvalDate || '',
      rejectionReason: leaveRequest.rejectionReason || ''
    });
    setEditModal(true);
  };

  const handleView = (leaveRequest) => {
    setSelectedLeave(leaveRequest);
    setViewModal(true);
  };

  const handleAdd = () => {
    if (!canEditLeave) {
      showError('ليس لديك صلاحية لإضافة طلبات إجازة جديدة');
      return;
    }
    setSelectedLeave(null);
    setFormData({
      employeeId: '',
      leaveType: 'annual',
      startDate: '',
      endDate: '',
      days: '',
      reason: '',
      emergencyContact: '',
      status: 'pending',
      approvedBy: '',
      approvalDate: '',
      rejectionReason: ''
    });
    setEditModal(true);
  };

  const handleApprove = (leaveRequest) => {
    if (!canApproveLeave) {
      showError('ليس لديك صلاحية للموافقة على طلبات الإجازة');
      return;
    }

    try {
      updateLeaveRequest(leaveRequest.id, {
        status: 'approved',
        approvedBy: 'current_user', // يجب استبدالها بالمستخدم الحالي
        approvalDate: new Date().toISOString().split('T')[0]
      });
      showSuccess('تم الموافقة على طلب الإجازة بنجاح');
    } catch (error) {
      showError('حدث خطأ في الموافقة على الطلب');
    }
  };

  const handleReject = (leaveRequest) => {
    if (!canApproveLeave) {
      showError('ليس لديك صلاحية لرفض طلبات الإجازة');
      return;
    }

    const rejectionReason = prompt('يرجى إدخال سبب الرفض:');
    if (!rejectionReason) return;

    try {
      updateLeaveRequest(leaveRequest.id, {
        status: 'rejected',
        rejectionReason,
        approvedBy: 'current_user', // يجب استبدالها بالمستخدم الحالي
        approvalDate: new Date().toISOString().split('T')[0]
      });
      showSuccess('تم رفض طلب الإجازة');
    } catch (error) {
      showError('حدث خطأ في رفض الطلب');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!canEditLeave) {
      showError('ليس لديك صلاحية لحفظ طلبات الإجازة');
      return;
    }

    if (!formData.employeeId) {
      showError('يرجى اختيار الموظف');
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      showError('يرجى إدخال تاريخ بداية ونهاية الإجازة');
      return;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      showError('تاريخ نهاية الإجازة يجب أن يكون بعد تاريخ البداية');
      return;
    }

    // حساب عدد الأيام
    let days = formData.days;
    if (!days && formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const timeDiff = end.getTime() - start.getTime();
      days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 لإعتبار يوم البداية
    }

    const leaveData = {
      ...formData,
      days: days || formData.days
    };

    try {
      if (selectedLeave) {
        updateLeaveRequest(selectedLeave.id, leaveData);
        showSuccess('تم تحديث طلب الإجازة بنجاح');
      } else {
        addLeaveRequest(leaveData);
        showSuccess('تم إضافة طلب الإجازة بنجاح');
      }
      setEditModal(false);
      setSelectedLeave(null);
    } catch (error) {
      showError('حدث خطأ في حفظ طلب الإجازة');
    }
  };

  const handleDeleteClick = (leaveRequest) => {
    if (!canDeleteLeave) {
      showError('ليس لديك صلاحية لحذف طلبات الإجازة');
      return;
    }
    setLeaveToDelete(leaveRequest);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!canDeleteLeave) {
      showError('ليس لديك صلاحية لحذف طلبات الإجازة');
      setDeleteModal(false);
      return;
    }

    try {
      const employee = employees.find(e => e.id === leaveToDelete.employeeId);
      const employeeName = employee ? employee.fullName : 'غير محدد';
      deleteLeaveRequest(leaveToDelete.id);
      showSuccess(`تم حذف طلب الإجازة للموظف "${employeeName}" بنجاح`);
      setDeleteModal(false);
      setLeaveToDelete(null);
    } catch (error) {
      showError('حدث خطأ في حذف طلب الإجازة');
      setDeleteModal(false);
    }
  };

  // فلترة طلبات الإجازة
  const filteredLeaves = leaveRequests.filter(request => {
    const employee = employees.find(e => e.id === request.employeeId);
    const employeeName = employee ? employee.fullName : '';
    
    const matchesSearch = 
      employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.reason && request.reason.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesEmployee = !filterEmployee || request.employeeId === parseInt(filterEmployee);
    const matchesStatus = !filterStatus || request.status === filterStatus;
    const matchesType = !filterType || request.leaveType === filterType;

    return matchesSearch && matchesEmployee && matchesStatus && matchesType;
  }).sort((a, b) => new Date(b.startDate) - new Date(a.startDate)); // ترتيب حسب التاريخ

  // إحصائيات
  const pendingRequests = leaveRequests.filter(r => r.status === 'pending').length;
  const approvedRequests = leaveRequests.filter(r => r.status === 'approved').length;
  const rejectedRequests = leaveRequests.filter(r => r.status === 'rejected').length;

  // فحص صلاحية الوصول
  if (!canManageLeaves) {
    return (
      <div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-4">
          <FaExclamationTriangle className="text-red-600 text-2xl" />
          <div>
            <h3 className="text-red-800 font-bold text-lg">وصول غير مصرح</h3>
            <p className="text-red-700">ليس لديك صلاحية لإدارة طلبات الإجازات</p>
            <p className="text-red-600 text-sm mt-1">يرجى التواصل مع المدير للحصول على الصلاحية المطلوبة</p>
          </div>
        </div>
      </div>
    );
  }

  const columns = [
    { 
      header: 'الموظف', 
      accessor: 'employeeId',
      render: (row) => {
        const employee = employees.find(e => e.id === row.employeeId);
        return employee ? employee.fullName : '-';
      }
    },
    { 
      header: 'نوع الإجازة', 
      accessor: 'leaveType',
      render: (row) => {
        const typeMap = {
          'annual': 'إجازة سنوية',
          'sick': 'إجازة مرضية',
          'emergency': 'إجازة طارئة',
          'maternity': 'إجازة أمومة',
          'paternity': 'إجازة أبوة',
          'unpaid': 'إجازة بدون راتب',
          'other': 'أخرى'
        };
        return typeMap[row.leaveType] || row.leaveType;
      }
    },
    { header: 'تاريخ البداية', accessor: 'startDate' },
    { header: 'تاريخ النهاية', accessor: 'endDate' },
    { header: 'عدد الأيام', accessor: 'days' },
    { 
      header: 'الحالة', 
      accessor: 'status',
      render: (row) => {
        const statusMap = {
          'pending': { label: 'قيد المراجعة', color: 'bg-yellow-100 text-yellow-800' },
          'approved': { label: 'موافق عليها', color: 'bg-green-100 text-green-800' },
          'rejected': { label: 'مرفوضة', color: 'bg-red-100 text-red-800' }
        };
        const status = statusMap[row.status] || { label: row.status, color: 'bg-gray-100 text-gray-800' };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
            {status.label}
          </span>
        );
      }
    }
  ];

  const leaveTypeOptions = [
    { value: 'annual', label: 'إجازة سنوية' },
    { value: 'sick', label: 'إجازة مرضية' },
    { value: 'emergency', label: 'إجازة طارئة' },
    { value: 'maternity', label: 'إجازة أمومة' },
    { value: 'paternity', label: 'إجازة أبوة' },
    { value: 'unpaid', label: 'إجازة بدون راتب' },
    { value: 'other', label: 'أخرى' }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <FaCalendarAlt className="text-red-600" />
          إدارة طلبات الإجازات
        </h1>
        {canEditLeave && (
          <Button 
            onClick={handleAdd}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <FaPlus className="ml-2" />
            إضافة طلب إجازة
          </Button>
        )}
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-yellow-50 border-yellow-200">
          <div className="text-center p-4">
            <FaCalendarAlt className="text-3xl text-yellow-600 mx-auto mb-2" />
            <h4 className="font-bold text-yellow-800">قيد المراجعة</h4>
            <p className="text-2xl font-bold text-yellow-600">{pendingRequests}</p>
          </div>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <div className="text-center p-4">
            <FaCheck className="text-3xl text-green-600 mx-auto mb-2" />
            <h4 className="font-bold text-green-800">موافق عليها</h4>
            <p className="text-2xl font-bold text-green-600">{approvedRequests}</p>
          </div>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <div className="text-center p-4">
            <FaTimes className="text-3xl text-red-600 mx-auto mb-2" />
            <h4 className="font-bold text-red-800">مرفوضة</h4>
            <p className="text-2xl font-bold text-red-600">{rejectedRequests}</p>
          </div>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <div className="text-center p-4">
            <FaCalendarAlt className="text-3xl text-blue-600 mx-auto mb-2" />
            <h4 className="font-bold text-blue-800">إجمالي الطلبات</h4>
            <p className="text-2xl font-bold text-blue-600">{leaveRequests.length}</p>
          </div>
        </Card>
      </div>

      {/* شريط البحث والفلاتر */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في طلبات الإجازة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          
          <Select 
            value={filterEmployee}
            onChange={(e) => setFilterEmployee(e.target.value)}
            options={[
              { value: '', label: 'جميع الموظفين' },
              ...employees.filter(e => e.status === 'active').map(emp => ({
                value: emp.id,
                label: emp.fullName
              }))
            ]}
          />

          <Select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: '', label: 'جميع الحالات' },
              { value: 'pending', label: 'قيد المراجعة' },
              { value: 'approved', label: 'موافق عليها' },
              { value: 'rejected', label: 'مرفوضة' }
            ]}
          />

          <Select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            options={[
              { value: '', label: 'جميع الأنواع' },
              ...leaveTypeOptions.map(type => ({
                value: type.value,
                label: type.label
              }))
            ]}
          />

          <Button 
            onClick={() => {
              setSearchTerm('');
              setFilterEmployee('');
              setFilterStatus('');
              setFilterType('');
            }}
            variant="secondary"
            className="w-full"
          >
            مسح الفلاتر
          </Button>
        </div>
      </Card>

      <Card icon={<FaCalendarAlt />}>
        <Table
          columns={columns}
          data={filteredLeaves}
          onView={handleView}
          onEdit={canEditLeave ? handleEdit : null}
          onDelete={canDeleteLeave ? handleDeleteClick : null}
          customActions={(row) => (
            <div className="flex gap-2 justify-end">
              {row.status === 'pending' && canApproveLeave && (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleApprove(row)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <FaCheck className="mr-1" />
                    موافقة
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleReject(row)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <FaTimes className="mr-1" />
                    رفض
                  </Button>
                </>
              )}
            </div>
          )}
        />
      </Card>

      {/* نافذة العرض */}
      {viewModal && selectedLeave && (
        <Modal
          isOpen={viewModal}
          onClose={() => setViewModal(false)}
          title="تفاصيل طلب الإجازة"
          footer={
            <Button variant="secondary" onClick={() => setViewModal(false)}>
              إغلاق
            </Button>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">الموظف</label>
                <p className="mt-1 text-sm text-gray-900 font-semibold">
                  {(() => {
                    const employee = employees.find(e => e.id === selectedLeave.employeeId);
                    return employee ? employee.fullName : '-';
                  })()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">نوع الإجازة</label>
                <p className="mt-1 text-sm text-gray-900">
                  {leaveTypeOptions.find(t => t.value === selectedLeave.leaveType)?.label || selectedLeave.leaveType}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">تاريخ البداية</label>
                <p className="mt-1 text-sm text-gray-900">{selectedLeave.startDate || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">تاريخ النهاية</label>
                <p className="mt-1 text-sm text-gray-900">{selectedLeave.endDate || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">عدد الأيام</label>
                <p className="mt-1 text-sm text-gray-900">{selectedLeave.days || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">الحالة</label>
                <p className="mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedLeave.status === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : selectedLeave.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedLeave.status === 'approved' ? 'موافق عليها' : 
                     selectedLeave.status === 'rejected' ? 'مرفوضة' : 'قيد المراجعة'}
                  </span>
                </p>
              </div>
            </div>
            
            {selectedLeave.reason && (
              <div>
                <label className="block text-sm font-medium text-gray-700">السبب</label>
                <p className="mt-1 text-sm text-gray-900">{selectedLeave.reason}</p>
              </div>
            )}
            
            {selectedLeave.emergencyContact && (
              <div>
                <label className="block text-sm font-medium text-gray-700">جهة الاتصال للطوارئ</label>
                <p className="mt-1 text-sm text-gray-900">{selectedLeave.emergencyContact}</p>
              </div>
            )}

            {selectedLeave.status === 'approved' && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">تفاصيل الموافقة</h4>
                <div className="text-sm text-green-700">
                  <p>تم الموافقة بواسطة: {selectedLeave.approvedBy || 'غير محدد'}</p>
                  <p>تاريخ الموافقة: {selectedLeave.approvalDate || 'غير محدد'}</p>
                </div>
              </div>
            )}

            {selectedLeave.status === 'rejected' && (
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-800 mb-2">تفاصيل الرفض</h4>
                <div className="text-sm text-red-700">
                  <p>سبب الرفض: {selectedLeave.rejectionReason || 'غير محدد'}</p>
                  <p>تم الرفض بواسطة: {selectedLeave.approvedBy || 'غير محدد'}</p>
                  <p>تاريخ الرفض: {selectedLeave.approvalDate || 'غير محدد'}</p>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* نافذة الإضافة/التعديل */}
      <Modal
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        title={selectedLeave ? "تعديل طلب الإجازة" : "إضافة طلب إجازة جديد"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditModal(false)}>إلغاء</Button>
            <Button 
              variant="success" 
              onClick={handleSubmit}
              className="bg-red-600 hover:bg-red-700"
            >
              {selectedLeave ? 'حفظ التغييرات' : 'إضافة الطلب'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select 
            label="الموظف *"
            name="employeeId"
            value={formData.employeeId}
            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
            options={[
              { value: '', label: 'اختر الموظف' },
              ...employees.filter(e => e.status === 'active').map(emp => ({
                value: emp.id,
                label: emp.fullName
              }))
            ]}
            required
          />

          <Select 
            label="نوع الإجازة *"
            name="leaveType"
            value={formData.leaveType}
            onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
            options={leaveTypeOptions}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="تاريخ البداية *" 
              name="startDate" 
              type="date"
              value={formData.startDate} 
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} 
              required 
            />
            <Input 
              label="تاريخ النهاية *" 
              name="endDate" 
              type="date"
              value={formData.endDate} 
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} 
              required 
            />
          </div>

          <Input 
            label="عدد الأيام" 
            name="days" 
            type="number"
            value={formData.days} 
            onChange={(e) => setFormData({ ...formData, days: e.target.value })} 
            placeholder="سيتم حسابها تلقائياً من التواريخ"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">السبب *</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="سبب طلب الإجازة..."
              required
            />
          </div>

          <Input 
            label="جهة الاتصال للطوارئ" 
            name="emergencyContact" 
            value={formData.emergencyContact} 
            onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })} 
          />

          {canApproveLeave && (
            <>
              <Select 
                label="حالة الطلب"
                name="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                options={[
                  { value: 'pending', label: 'قيد المراجعة' },
                  { value: 'approved', label: 'موافق عليها' },
                  { value: 'rejected', label: 'مرفوضة' }
                ]}
              />

              {formData.status === 'rejected' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">سبب الرفض</label>
                  <textarea
                    name="rejectionReason"
                    value={formData.rejectionReason}
                    onChange={(e) => setFormData({ ...formData, rejectionReason: e.target.value })}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="سبب رفض الطلب..."
                  />
                </div>
              )}
            </>
          )}
        </form>
      </Modal>

      {/* نافذة تأكيد الحذف */}
      {deleteModal && leaveToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-100 rounded-full p-4">
                <FaExclamationTriangle className="text-4xl text-red-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              تأكيد حذف طلب الإجازة
            </h2>

            <div className="bg-yellow-50 p-4 rounded-lg mb-4 border border-yellow-200">
              <p className="text-gray-700 text-center mb-2">
                هل أنت متأكد من حذف هذا الطلب؟
              </p>
              <p className="text-sm text-red-600 text-center font-semibold">
                ⚠️ لا يمكن التراجع عن هذا الإجراء
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">تفاصيل الطلب:</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">الموظف: </span>
                  <span className="font-semibold">
                    {(() => {
                      const employee = employees.find(e => e.id === leaveToDelete.employeeId);
                      return employee ? employee.fullName : '-';
                    })()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">نوع الإجازة: </span>
                  <span className="font-semibold">
                    {leaveTypeOptions.find(t => t.value === leaveToDelete.leaveType)?.label || leaveToDelete.leaveType}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">الفترة: </span>
                  <span className="font-semibold">
                    {leaveToDelete.startDate} إلى {leaveToDelete.endDate}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">عدد الأيام: </span>
                  <span className="font-semibold">{leaveToDelete.days}</span>
                </div>
                <div>
                  <span className="text-gray-600">الحالة: </span>
                  <span className="font-semibold">
                    {leaveToDelete.status === 'approved' ? 'موافق عليها' : 
                     leaveToDelete.status === 'rejected' ? 'مرفوضة' : 'قيد المراجعة'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                نعم، احذف الطلب
              </button>
              <button
                onClick={() => {
                  setDeleteModal(false);
                  setLeaveToDelete(null);
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveRequests;