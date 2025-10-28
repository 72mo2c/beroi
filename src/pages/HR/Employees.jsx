// ======================================
// إدارة الموظفين - Employees Management
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
import { FaUserTie, FaExclamationTriangle, FaPlus, FaEdit, FaTrash, FaSearch, FaEye } from 'react-icons/fa';

const Employees = () => {
  const { employees, departments, positions, addEmployee, updateEmployee, deleteEmployee } = useData();
  const { showSuccess, showError } = useNotification();
  const { settings } = useSystemSettings();
  const { hasPermission } = useAuth();

  // فحص الصلاحيات
  const canEditEmployee = hasPermission('edit_employee');
  const canDeleteEmployee = hasPermission('delete_employee');
  const canManageEmployees = hasPermission('manage_employees');

  const [editModal, setEditModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [formData, setFormData] = useState({
    employeeId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    hireDate: '',
    departmentId: '',
    positionId: '',
    salary: '',
    status: 'active',
    emergencyContact: '',
    emergencyPhone: '',
    notes: ''
  });

  const handleEdit = (employee) => {
    if (!canEditEmployee) {
      showError('ليس لديك صلاحية لتعديل بيانات الموظفين');
      return;
    }
    setSelectedEmployee(employee);
    setFormData({
      employeeId: employee.employeeId || '',
      firstName: employee.firstName || '',
      lastName: employee.lastName || '',
      email: employee.email || '',
      phone: employee.phone || '',
      address: employee.address || '',
      hireDate: employee.hireDate || '',
      departmentId: employee.departmentId || '',
      positionId: employee.positionId || '',
      salary: employee.salary || '',
      status: employee.status || 'active',
      emergencyContact: employee.emergencyContact || '',
      emergencyPhone: employee.emergencyPhone || '',
      notes: employee.notes || ''
    });
    setEditModal(true);
  };

  const handleView = (employee) => {
    setSelectedEmployee(employee);
    setViewModal(true);
  };

  const handleAdd = () => {
    if (!canEditEmployee) {
      showError('ليس لديك صلاحية لإضافة موظفين جدد');
      return;
    }
    setSelectedEmployee(null);
    setFormData({
      employeeId: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      hireDate: '',
      departmentId: '',
      positionId: '',
      salary: '',
      status: 'active',
      emergencyContact: '',
      emergencyPhone: '',
      notes: ''
    });
    setEditModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!canEditEmployee) {
      showError('ليس لديك صلاحية لحفظ بيانات الموظفين');
      return;
    }

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      showError('يرجى إدخال الاسم الأول والأخير');
      return;
    }

    try {
      const employeeData = {
        ...formData,
        fullName: `${formData.firstName} ${formData.lastName}`.trim()
      };

      if (selectedEmployee) {
        updateEmployee(selectedEmployee.id, employeeData);
        showSuccess('تم تحديث بيانات الموظف بنجاح');
      } else {
        addEmployee(employeeData);
        showSuccess('تم إضافة الموظف بنجاح');
      }
      setEditModal(false);
      setSelectedEmployee(null);
    } catch (error) {
      showError('حدث خطأ في حفظ بيانات الموظف');
    }
  };

  const handleDeleteClick = (employee) => {
    if (!canDeleteEmployee) {
      showError('ليس لديك صلاحية لحذف الموظفين');
      return;
    }
    setEmployeeToDelete(employee);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!canDeleteEmployee) {
      showError('ليس لديك صلاحية لحذف الموظفين');
      setDeleteModal(false);
      return;
    }

    try {
      deleteEmployee(employeeToDelete.id);
      showSuccess(`تم حذف الموظف "${employeeToDelete.fullName}" بنجاح`);
      setDeleteModal(false);
      setEmployeeToDelete(null);
    } catch (error) {
      showError('حدث خطأ في حذف الموظف');
      setDeleteModal(false);
    }
  };

  // فلترة الموظفين
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.phone?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = !filterDepartment || employee.departmentId === parseInt(filterDepartment);
    const matchesStatus = !filterStatus || employee.status === filterStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // فحص صلاحية الوصول
  if (!canManageEmployees) {
    return (
      <div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-4">
          <FaExclamationTriangle className="text-red-600 text-2xl" />
          <div>
            <h3 className="text-red-800 font-bold text-lg">وصول غير مصرح</h3>
            <p className="text-red-700">ليس لديك صلاحية لإدارة الموظفين</p>
            <p className="text-red-600 text-sm mt-1">يرجى التواصل مع المدير للحصول على الصلاحية المطلوبة</p>
          </div>
        </div>
      </div>
    );
  }

  const columns = [
    { header: 'رقم الموظف', accessor: 'employeeId' },
    { header: 'الاسم الكامل', accessor: 'fullName' },
    { 
      header: 'القسم', 
      accessor: 'departmentId',
      render: (row) => {
        const department = departments.find(d => d.id === row.departmentId);
        return department ? department.name : '-';
      }
    },
    { 
      header: 'المنصب', 
      accessor: 'positionId',
      render: (row) => {
        const position = positions.find(p => p.id === row.positionId);
        return position ? position.title : '-';
      }
    },
    { 
      header: 'الهاتف', 
      accessor: 'phone',
      render: (row) => row.phone || '-'
    },
    { 
      header: 'تاريخ التوظيف', 
      accessor: 'hireDate',
      render: (row) => row.hireDate || '-'
    },
    { 
      header: 'الحالة', 
      accessor: 'status',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : row.status === 'inactive'
            ? 'bg-red-100 text-red-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {row.status === 'active' ? 'نشط' : row.status === 'inactive' ? 'غير نشط' : 'في إجازة'}
        </span>
      )
    }
  ];

  const getDepartmentName = (departmentId) => {
    const department = departments.find(d => d.id === departmentId);
    return department ? department.name : '-';
  };

  const getPositionTitle = (positionId) => {
    const position = positions.find(p => p.id === positionId);
    return position ? position.title : '-';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <FaUserTie className="text-purple-600" />
          إدارة الموظفين
        </h1>
        {canEditEmployee && (
          <Button 
            onClick={handleAdd}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <FaPlus className="ml-2" />
            إضافة موظف جديد
          </Button>
        )}
      </div>

      {/* شريط البحث والفلاتر */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في الموظفين..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <Select 
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            options={[
              { value: '', label: 'جميع الأقسام' },
              ...departments.filter(d => d.status === 'active').map(dept => ({
                value: dept.id,
                label: dept.name
              }))
            ]}
          />

          <Select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: '', label: 'جميع الحالات' },
              { value: 'active', label: 'نشط' },
              { value: 'inactive', label: 'غير نشط' },
              { value: 'on_leave', label: 'في إجازة' }
            ]}
          />

          <Button 
            onClick={() => {
              setSearchTerm('');
              setFilterDepartment('');
              setFilterStatus('');
            }}
            variant="secondary"
            className="w-full"
          >
            مسح الفلاتر
          </Button>
        </div>
      </Card>

      <Card icon={<FaUserTie />}>
        <Table
          columns={columns}
          data={filteredEmployees}
          onView={handleView}
          onEdit={canEditEmployee ? handleEdit : null}
          onDelete={canDeleteEmployee ? handleDeleteClick : null}
        />
      </Card>

      {/* نافذة العرض */}
      {viewModal && selectedEmployee && (
        <Modal
          isOpen={viewModal}
          onClose={() => setViewModal(false)}
          title="تفاصيل الموظف"
          footer={
            <Button variant="secondary" onClick={() => setViewModal(false)}>
              إغلاق
            </Button>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">رقم الموظف</label>
                <p className="mt-1 text-sm text-gray-900">{selectedEmployee.employeeId || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">الاسم الكامل</label>
                <p className="mt-1 text-sm text-gray-900 font-semibold">{selectedEmployee.fullName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                <p className="mt-1 text-sm text-gray-900">{selectedEmployee.email || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">الهاتف</label>
                <p className="mt-1 text-sm text-gray-900">{selectedEmployee.phone || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">القسم</label>
                <p className="mt-1 text-sm text-gray-900">{getDepartmentName(selectedEmployee.departmentId)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">المنصب</label>
                <p className="mt-1 text-sm text-gray-900">{getPositionTitle(selectedEmployee.positionId)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">تاريخ التوظيف</label>
                <p className="mt-1 text-sm text-gray-900">{selectedEmployee.hireDate || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">الراتب</label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedEmployee.salary ? `${selectedEmployee.salary} ${settings?.currency || 'ريال'}` : '-'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">الحالة</label>
                <p className="mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedEmployee.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : selectedEmployee.status === 'inactive'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedEmployee.status === 'active' ? 'نشط' : 
                     selectedEmployee.status === 'inactive' ? 'غير نشط' : 'في إجازة'}
                  </span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">جهة الاتصال للطوارئ</label>
                <p className="mt-1 text-sm text-gray-900">{selectedEmployee.emergencyContact || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">هاتف الطوارئ</label>
                <p className="mt-1 text-sm text-gray-900">{selectedEmployee.emergencyPhone || '-'}</p>
              </div>
            </div>
            
            {selectedEmployee.address && (
              <div>
                <label className="block text-sm font-medium text-gray-700">العنوان</label>
                <p className="mt-1 text-sm text-gray-900">{selectedEmployee.address}</p>
              </div>
            )}
            
            {selectedEmployee.notes && (
              <div>
                <label className="block text-sm font-medium text-gray-700">ملاحظات</label>
                <p className="mt-1 text-sm text-gray-900">{selectedEmployee.notes}</p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* نافذة الإضافة/التعديل */}
      <Modal
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        title={selectedEmployee ? "تعديل الموظف" : "إضافة موظف جديد"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditModal(false)}>إلغاء</Button>
            <Button 
              variant="success" 
              onClick={handleSubmit}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {selectedEmployee ? 'حفظ التغييرات' : 'إضافة الموظف'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="رقم الموظف" 
              name="employeeId" 
              value={formData.employeeId} 
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })} 
            />
            <Input 
              label="الاسم الأول *" 
              name="firstName" 
              value={formData.firstName} 
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} 
              required 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="الاسم الأخير *" 
              name="lastName" 
              value={formData.lastName} 
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} 
              required 
            />
            <Input 
              label="البريد الإلكتروني" 
              name="email" 
              type="email"
              value={formData.email} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="الهاتف" 
              name="phone" 
              value={formData.phone} 
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
            />
            <Input 
              label="تاريخ التوظيف" 
              name="hireDate" 
              type="date"
              value={formData.hireDate} 
              onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="عنوان السكن..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select 
              label="القسم"
              name="departmentId"
              value={formData.departmentId}
              onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
              options={[
                { value: '', label: 'اختر القسم' },
                ...departments.filter(d => d.status === 'active').map(dept => ({
                  value: dept.id,
                  label: dept.name
                }))
              ]}
            />
            <Select 
              label="المنصب"
              name="positionId"
              value={formData.positionId}
              onChange={(e) => setFormData({ ...formData, positionId: e.target.value })}
              options={[
                { value: '', label: 'اختر المنصب' },
                ...positions.map(pos => ({
                  value: pos.id,
                  label: pos.title
                }))
              ]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="الراتب" 
              name="salary" 
              type="number"
              value={formData.salary} 
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })} 
            />
            <Select 
              label="حالة الموظف"
              name="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'active', label: 'نشط' },
                { value: 'inactive', label: 'غير نشط' },
                { value: 'on_leave', label: 'في إجازة' }
              ]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="جهة الاتصال للطوارئ" 
              name="emergencyContact" 
              value={formData.emergencyContact} 
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })} 
            />
            <Input 
              label="هاتف الطوارئ" 
              name="emergencyPhone" 
              value={formData.emergencyPhone} 
              onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="ملاحظات إضافية..."
            />
          </div>
        </form>
      </Modal>

      {/* نافذة تأكيد الحذف */}
      {deleteModal && employeeToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-100 rounded-full p-4">
                <FaExclamationTriangle className="text-4xl text-red-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              تأكيد حذف الموظف
            </h2>

            <div className="bg-yellow-50 p-4 rounded-lg mb-4 border border-yellow-200">
              <p className="text-gray-700 text-center mb-2">
                هل أنت متأكد من حذف الموظف <span className="font-bold">"{employeeToDelete.fullName}"</span>؟
              </p>
              <p className="text-sm text-red-600 text-center font-semibold">
                ⚠️ لا يمكن التراجع عن هذا الإجراء
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                نعم، احذف الموظف
              </button>
              <button
                onClick={() => {
                  setDeleteModal(false);
                  setEmployeeToDelete(null);
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

export default Employees;