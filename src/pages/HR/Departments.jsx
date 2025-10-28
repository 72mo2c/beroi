// ======================================
// إدارة الأقسام - Departments Management
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
import { FaBuilding, FaExclamationTriangle, FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

const Departments = () => {
  const { departments, addDepartment, updateDepartment, deleteDepartment } = useData();
  const { showSuccess, showError } = useNotification();
  const { settings } = useSystemSettings();
  const { hasPermission } = useAuth();

  // فحص الصلاحيات
  const canEditDepartment = hasPermission('edit_department');
  const canDeleteDepartment = hasPermission('delete_department');
  const canManageDepartments = hasPermission('manage_departments');

  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    manager: '',
    budget: '',
    status: 'active'
  });

  const handleEdit = (department) => {
    if (!canEditDepartment) {
      showError('ليس لديك صلاحية لتعديل الأقسام');
      return;
    }
    setSelectedDepartment(department);
    setFormData({
      name: department.name || '',
      description: department.description || '',
      manager: department.manager || '',
      budget: department.budget || '',
      status: department.status || 'active'
    });
    setEditModal(true);
  };

  const handleAdd = () => {
    if (!canEditDepartment) {
      showError('ليس لديك صلاحية لإضافة أقسام جديدة');
      return;
    }
    setSelectedDepartment(null);
    setFormData({
      name: '',
      description: '',
      manager: '',
      budget: '',
      status: 'active'
    });
    setEditModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!canEditDepartment) {
      showError('ليس لديك صلاحية لحفظ الأقسام');
      return;
    }

    if (!formData.name.trim()) {
      showError('يرجى إدخال اسم القسم');
      return;
    }

    try {
      if (selectedDepartment) {
        updateDepartment(selectedDepartment.id, formData);
        showSuccess('تم تحديث القسم بنجاح');
      } else {
        addDepartment(formData);
        showSuccess('تم إضافة القسم بنجاح');
      }
      setEditModal(false);
      setSelectedDepartment(null);
    } catch (error) {
      showError('حدث خطأ في حفظ القسم');
    }
  };

  const handleDeleteClick = (department) => {
    if (!canDeleteDepartment) {
      showError('ليس لديك صلاحية لحذف الأقسام');
      return;
    }
    setDepartmentToDelete(department);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!canDeleteDepartment) {
      showError('ليس لديك صلاحية لحذف الأقسام');
      setDeleteModal(false);
      return;
    }

    try {
      deleteDepartment(departmentToDelete.id);
      showSuccess(`تم حذف القسم "${departmentToDelete.name}" بنجاح`);
      setDeleteModal(false);
      setDepartmentToDelete(null);
    } catch (error) {
      showError('حدث خطأ في حذف القسم');
      setDeleteModal(false);
    }
  };

  // فلترة الأقسام حسب البحث
  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dept.description && dept.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (dept.manager && dept.manager.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // فحص صلاحية الوصول
  if (!canManageDepartments) {
    return (
      <div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-4">
          <FaExclamationTriangle className="text-red-600 text-2xl" />
          <div>
            <h3 className="text-red-800 font-bold text-lg">وصول غير مصرح</h3>
            <p className="text-red-700">ليس لديك صلاحية لإدارة الأقسام</p>
            <p className="text-red-600 text-sm mt-1">يرجى التواصل مع المدير للحصول على الصلاحية المطلوبة</p>
          </div>
        </div>
      </div>
    );
  }

  const columns = [
    { header: 'اسم القسم', accessor: 'name' },
    { 
      header: 'الوصف', 
      accessor: 'description',
      render: (row) => row.description || '-'
    },
    { 
      header: 'المدير', 
      accessor: 'manager',
      render: (row) => row.manager || '-'
    },
    { 
      header: 'الميزانية', 
      accessor: 'budget',
      render: (row) => row.budget ? `${row.budget} ${settings?.currency || 'ريال'}` : '-'
    },
    { 
      header: 'الحالة', 
      accessor: 'status',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {row.status === 'active' ? 'نشط' : 'غير نشط'}
        </span>
      )
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <FaBuilding className="text-blue-600" />
          إدارة الأقسام
        </h1>
        {canEditDepartment && (
          <Button 
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <FaPlus className="ml-2" />
            إضافة قسم جديد
          </Button>
        )}
      </div>

      {/* شريط البحث */}
      <Card className="mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="البحث في الأقسام..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </Card>

      <Card icon={<FaBuilding />}>
        <Table
          columns={columns}
          data={filteredDepartments}
          onEdit={canEditDepartment ? handleEdit : null}
          onDelete={canDeleteDepartment ? handleDeleteClick : null}
        />
      </Card>

      {/* نافذة الإضافة/التعديل */}
      <Modal
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        title={selectedDepartment ? "تعديل القسم" : "إضافة قسم جديد"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditModal(false)}>إلغاء</Button>
            <Button 
              variant="success" 
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {selectedDepartment ? 'حفظ التغييرات' : 'إضافة القسم'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="اسم القسم *" 
            name="name" 
            value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            required 
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="وصف القسم..."
            />
          </div>
          <Input 
            label="المدير" 
            name="manager" 
            value={formData.manager} 
            onChange={(e) => setFormData({ ...formData, manager: e.target.value })} 
          />
          <Input 
            label="الميزانية" 
            name="budget" 
            type="number"
            value={formData.budget} 
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })} 
          />
          <Select 
            label="حالة القسم"
            name="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: 'active', label: 'نشط' },
              { value: 'inactive', label: 'غير نشط' }
            ]}
          />
        </form>
      </Modal>

      {/* نافذة تأكيد الحذف */}
      {deleteModal && departmentToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-100 rounded-full p-4">
                <FaExclamationTriangle className="text-4xl text-red-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              تأكيد حذف القسم
            </h2>

            <div className="bg-yellow-50 p-4 rounded-lg mb-4 border border-yellow-200">
              <p className="text-gray-700 text-center mb-2">
                هل أنت متأكد من حذف القسم <span className="font-bold">"{departmentToDelete.name}"</span>؟
              </p>
              <p className="text-sm text-red-600 text-center font-semibold">
                ⚠️ لا يمكن التراجع عن هذا الإجراء
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">تفاصيل القسم:</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">الاسم: </span>
                  <span className="font-semibold">{departmentToDelete.name}</span>
                </div>
                {departmentToDelete.description && (
                  <div>
                    <span className="text-gray-600">الوصف: </span>
                    <span className="font-semibold">{departmentToDelete.description}</span>
                  </div>
                )}
                {departmentToDelete.manager && (
                  <div>
                    <span className="text-gray-600">المدير: </span>
                    <span className="font-semibold">{departmentToDelete.manager}</span>
                  </div>
                )}
                {departmentToDelete.budget && (
                  <div>
                    <span className="text-gray-600">الميزانية: </span>
                    <span className="font-semibold">{departmentToDelete.budget} {settings?.currency || 'ريال'}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                نعم، احذف القسم
              </button>
              <button
                onClick={() => {
                  setDeleteModal(false);
                  setDepartmentToDelete(null);
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

export default Departments;