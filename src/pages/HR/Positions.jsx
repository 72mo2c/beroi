// ======================================
// إدارة المناصب - Positions Management
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
import { FaBriefcase, FaExclamationTriangle, FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

const Positions = () => {
  const { positions, departments, addPosition, updatePosition, deletePosition } = useData();
  const { showSuccess, showError } = useNotification();
  const { settings } = useSystemSettings();
  const { hasPermission } = useAuth();

  // فحص الصلاحيات
  const canEditPosition = hasPermission('edit_position');
  const canDeletePosition = hasPermission('delete_position');
  const canManagePositions = hasPermission('manage_positions');

  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [positionToDelete, setPositionToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    departmentId: '',
    salaryMin: '',
    salaryMax: '',
    requirements: '',
    level: 'junior'
  });

  const handleEdit = (position) => {
    if (!canEditPosition) {
      showError('ليس لديك صلاحية لتعديل المناصب');
      return;
    }
    setSelectedPosition(position);
    setFormData({
      title: position.title || '',
      description: position.description || '',
      departmentId: position.departmentId || '',
      salaryMin: position.salaryMin || '',
      salaryMax: position.salaryMax || '',
      requirements: position.requirements || '',
      level: position.level || 'junior'
    });
    setEditModal(true);
  };

  const handleAdd = () => {
    if (!canEditPosition) {
      showError('ليس لديك صلاحية لإضافة مناصب جديدة');
      return;
    }
    setSelectedPosition(null);
    setFormData({
      title: '',
      description: '',
      departmentId: '',
      salaryMin: '',
      salaryMax: '',
      requirements: '',
      level: 'junior'
    });
    setEditModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!canEditPosition) {
      showError('ليس لديك صلاحية لحفظ المناصب');
      return;
    }

    if (!formData.title.trim()) {
      showError('يرجى إدخال عنوان المنصب');
      return;
    }

    try {
      if (selectedPosition) {
        updatePosition(selectedPosition.id, formData);
        showSuccess('تم تحديث المنصب بنجاح');
      } else {
        addPosition(formData);
        showSuccess('تم إضافة المنصب بنجاح');
      }
      setEditModal(false);
      setSelectedPosition(null);
    } catch (error) {
      showError('حدث خطأ في حفظ المنصب');
    }
  };

  const handleDeleteClick = (position) => {
    if (!canDeletePosition) {
      showError('ليس لديك صلاحية لحذف المناصب');
      return;
    }
    setPositionToDelete(position);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!canDeletePosition) {
      showError('ليس لديك صلاحية لحذف المناصب');
      setDeleteModal(false);
      return;
    }

    try {
      deletePosition(positionToDelete.id);
      showSuccess(`تم حذف المنصب "${positionToDelete.title}" بنجاح`);
      setDeleteModal(false);
      setPositionToDelete(null);
    } catch (error) {
      showError('حدث خطأ في حذف المنصب');
      setDeleteModal(false);
    }
  };

  // فلترة المناصب حسب البحث
  const filteredPositions = positions.filter(position => {
    const departmentName = departments.find(d => d.id === position.departmentId)?.name || '';
    return position.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (position.description && position.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
           departmentName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // فحص صلاحية الوصول
  if (!canManagePositions) {
    return (
      <div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-4">
          <FaExclamationTriangle className="text-red-600 text-2xl" />
          <div>
            <h3 className="text-red-800 font-bold text-lg">وصول غير مصرح</h3>
            <p className="text-red-700">ليس لديك صلاحية لإدارة المناصب</p>
            <p className="text-red-600 text-sm mt-1">يرجى التواصل مع المدير للحصول على الصلاحية المطلوبة</p>
          </div>
        </div>
      </div>
    );
  }

  const columns = [
    { header: 'عنوان المنصب', accessor: 'title' },
    { 
      header: 'القسم', 
      accessor: 'departmentId',
      render: (row) => {
        const department = departments.find(d => d.id === row.departmentId);
        return department ? department.name : '-';
      }
    },
    { 
      header: 'الوصف', 
      accessor: 'description',
      render: (row) => row.description ? (row.description.length > 30 ? row.description.substring(0, 30) + '...' : row.description) : '-'
    },
    { 
      header: 'المستوى', 
      accessor: 'level',
      render: (row) => {
        const levelNames = {
          'junior': 'مبتدئ',
          'mid': 'متوسط',
          'senior': 'كبير',
          'manager': 'مدير'
        };
        return levelNames[row.level] || row.level;
      }
    },
    { 
      header: 'الراتب (من - إلى)', 
      accessor: 'salary',
      render: (row) => {
        if (row.salaryMin && row.salaryMax) {
          return `${row.salaryMin} - ${row.salaryMax} ${settings?.currency || 'ريال'}`;
        }
        return row.salaryMin || row.salaryMax ? 
          `${row.salaryMin || row.salaryMax} ${settings?.currency || 'ريال'}` : '-';
      }
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <FaBriefcase className="text-green-600" />
          إدارة المناصب
        </h1>
        {canEditPosition && (
          <Button 
            onClick={handleAdd}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <FaPlus className="ml-2" />
            إضافة منصب جديد
          </Button>
        )}
      </div>

      {/* شريط البحث */}
      <Card className="mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="البحث في المناصب..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </Card>

      <Card icon={<FaBriefcase />}>
        <Table
          columns={columns}
          data={filteredPositions}
          onEdit={canEditPosition ? handleEdit : null}
          onDelete={canDeletePosition ? handleDeleteClick : null}
        />
      </Card>

      {/* نافذة الإضافة/التعديل */}
      <Modal
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        title={selectedPosition ? "تعديل المنصب" : "إضافة منصب جديد"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditModal(false)}>إلغاء</Button>
            <Button 
              variant="success" 
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700"
            >
              {selectedPosition ? 'حفظ التغييرات' : 'إضافة المنصب'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="عنوان المنصب *" 
            name="title" 
            value={formData.title} 
            onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
            required 
          />
          
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="وصف المنصب..."
            />
          </div>

          <Select 
            label="مستوى المنصب"
            name="level"
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            options={[
              { value: 'junior', label: 'مبتدئ' },
              { value: 'mid', label: 'متوسط' },
              { value: 'senior', label: 'كبير' },
              { value: 'manager', label: 'مدير' }
            ]}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="الحد الأدنى للراتب" 
              name="salaryMin" 
              type="number"
              value={formData.salaryMin} 
              onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })} 
            />
            <Input 
              label="الحد الأقصى للراتب" 
              name="salaryMax" 
              type="number"
              value={formData.salaryMax} 
              onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">المتطلبات</label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="متطلبات المنصب..."
            />
          </div>
        </form>
      </Modal>

      {/* نافذة تأكيد الحذف */}
      {deleteModal && positionToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-100 rounded-full p-4">
                <FaExclamationTriangle className="text-4xl text-red-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              تأكيد حذف المنصب
            </h2>

            <div className="bg-yellow-50 p-4 rounded-lg mb-4 border border-yellow-200">
              <p className="text-gray-700 text-center mb-2">
                هل أنت متأكد من حذف المنصب <span className="font-bold">"{positionToDelete.title}"</span>؟
              </p>
              <p className="text-sm text-red-600 text-center font-semibold">
                ⚠️ لا يمكن التراجع عن هذا الإجراء
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">تفاصيل المنصب:</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">العنوان: </span>
                  <span className="font-semibold">{positionToDelete.title}</span>
                </div>
                {positionToDelete.description && (
                  <div>
                    <span className="text-gray-600">الوصف: </span>
                    <span className="font-semibold">{positionToDelete.description}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-600">المستوى: </span>
                  <span className="font-semibold">
                    {{
                      'junior': 'مبتدئ',
                      'mid': 'متوسط',
                      'senior': 'كبير',
                      'manager': 'مدير'
                    }[positionToDelete.level] || positionToDelete.level}
                  </span>
                </div>
                {(positionToDelete.salaryMin || positionToDelete.salaryMax) && (
                  <div>
                    <span className="text-gray-600">الراتب: </span>
                    <span className="font-semibold">
                      {positionToDelete.salaryMin && positionToDelete.salaryMax 
                        ? `${positionToDelete.salaryMin} - ${positionToDelete.salaryMax}`
                        : positionToDelete.salaryMin || positionToDelete.salaryMax
                      } {settings?.currency || 'ريال'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                نعم، احذف المنصب
              </button>
              <button
                onClick={() => {
                  setDeleteModal(false);
                  setPositionToDelete(null);
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

export default Positions;