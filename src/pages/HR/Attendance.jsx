// ======================================
// إدارة الحضور والانصراف - Attendance Management
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
import { FaClock, FaExclamationTriangle, FaPlus, FaEdit, FaTrash, FaSearch, FaCalendarAlt, FaPlay, FaStop } from 'react-icons/fa';

const Attendance = () => {
  const { attendance, employees, addAttendance, updateAttendance, deleteAttendance } = useData();
  const { showSuccess, showError } = useNotification();
  const { settings } = useSystemSettings();
  const { hasPermission } = useAuth();

  // فحص الصلاحيات
  const canEditAttendance = hasPermission('edit_attendance');
  const canDeleteAttendance = hasPermission('delete_attendance');
  const canManageAttendance = hasPermission('manage_attendance');

  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [attendanceToDelete, setAttendanceToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEmployee, setFilterEmployee] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [formData, setFormData] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    clockIn: '',
    clockOut: '',
    breakStart: '',
    breakEnd: '',
    totalHours: '',
    status: 'present',
    notes: ''
  });

  const handleEdit = (attendanceRecord) => {
    if (!canEditAttendance) {
      showError('ليس لديك صلاحية لتعديل سجلات الحضور');
      return;
    }
    setSelectedAttendance(attendanceRecord);
    setFormData({
      employeeId: attendanceRecord.employeeId || '',
      date: attendanceRecord.date || new Date().toISOString().split('T')[0],
      clockIn: attendanceRecord.clockIn || '',
      clockOut: attendanceRecord.clockOut || '',
      breakStart: attendanceRecord.breakStart || '',
      breakEnd: attendanceRecord.breakEnd || '',
      totalHours: attendanceRecord.totalHours || '',
      status: attendanceRecord.status || 'present',
      notes: attendanceRecord.notes || ''
    });
    setEditModal(true);
  };

  const handleAdd = () => {
    if (!canEditAttendance) {
      showError('ليس لديك صلاحية لإضافة سجلات حضور جديدة');
      return;
    }
    setSelectedAttendance(null);
    setFormData({
      employeeId: '',
      date: new Date().toISOString().split('T')[0],
      clockIn: '',
      clockOut: '',
      breakStart: '',
      breakEnd: '',
      totalHours: '',
      status: 'present',
      notes: ''
    });
    setEditModal(true);
  };

  const handleQuickClockIn = (employeeId) => {
    if (!canEditAttendance) {
      showError('ليس لديك صلاحية لتسجيل الحضور');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toTimeString().slice(0, 5); // HH:MM format
    
    // التحقق من وجود سجل حضور اليوم للموظف
    const existingAttendance = attendance.find(a => 
      a.employeeId === employeeId && a.date === today
    );

    if (existingAttendance) {
      showError('تم تسجيل حضور هذا الموظف بالفعل اليوم');
      return;
    }

    try {
      addAttendance({
        employeeId,
        date: today,
        clockIn: now,
        status: 'present',
        notes: 'تسجيل حضور سريع'
      });
      showSuccess('تم تسجيل الحضور بنجاح');
    } catch (error) {
      showError('حدث خطأ في تسجيل الحضور');
    }
  };

  const handleQuickClockOut = (employeeId) => {
    if (!canEditAttendance) {
      showError('ليس لديك صلاحية لتسجيل الانصراف');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toTimeString().slice(0, 5); // HH:MM format
    
    // البحث عن سجل حضور اليوم للموظف
    const existingAttendance = attendance.find(a => 
      a.employeeId === employeeId && a.date === today && a.clockIn
    );

    if (!existingAttendance) {
      showError('لم يتم تسجيل حضور هذا الموظف اليوم');
      return;
    }

    if (existingAttendance.clockOut) {
      showError('تم تسجيل انصراف هذا الموظف بالفعل اليوم');
      return;
    }

    try {
      updateAttendance(existingAttendance.id, {
        clockOut: now,
        status: 'present'
      });
      showSuccess('تم تسجيل الانصراف بنجاح');
    } catch (error) {
      showError('حدث خطأ في تسجيل الانصراف');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!canEditAttendance) {
      showError('ليس لديك صلاحية لحفظ سجلات الحضور');
      return;
    }

    if (!formData.employeeId) {
      showError('يرجى اختيار الموظف');
      return;
    }

    if (!formData.date) {
      showError('يرجى إدخال التاريخ');
      return;
    }

    // حساب ساعات العمل إذا تم إدخال وقت الدخول والخروج
    let totalHours = '';
    if (formData.clockIn && formData.clockOut) {
      const clockIn = new Date(`${formData.date}T${formData.clockIn}`);
      const clockOut = new Date(`${formData.date}T${formData.clockOut}`);
      
      if (clockOut > clockIn) {
        const hours = (clockOut - clockIn) / (1000 * 60 * 60);
        totalHours = hours.toFixed(2);
      }
    }

    const attendanceData = {
      ...formData,
      totalHours: totalHours || formData.totalHours
    };

    try {
      if (selectedAttendance) {
        updateAttendance(selectedAttendance.id, attendanceData);
        showSuccess('تم تحديث سجل الحضور بنجاح');
      } else {
        addAttendance(attendanceData);
        showSuccess('تم إضافة سجل الحضور بنجاح');
      }
      setEditModal(false);
      setSelectedAttendance(null);
    } catch (error) {
      showError('حدث خطأ في حفظ سجل الحضور');
    }
  };

  const handleDeleteClick = (attendanceRecord) => {
    if (!canDeleteAttendance) {
      showError('ليس لديك صلاحية لحذف سجلات الحضور');
      return;
    }
    setAttendanceToDelete(attendanceRecord);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!canDeleteAttendance) {
      showError('ليس لديك صلاحية لحذف سجلات الحضور');
      setDeleteModal(false);
      return;
    }

    try {
      const employee = employees.find(e => e.id === attendanceToDelete.employeeId);
      const employeeName = employee ? employee.fullName : 'غير محدد';
      deleteAttendance(attendanceToDelete.id);
      showSuccess(`تم حذف سجل الحضور للموظف "${employeeName}" بنجاح`);
      setDeleteModal(false);
      setAttendanceToDelete(null);
    } catch (error) {
      showError('حدث خطأ في حذف سجل الحضور');
      setDeleteModal(false);
    }
  };

  // فلترة سجلات الحضور
  const filteredAttendance = attendance.filter(record => {
    const employee = employees.find(e => e.id === record.employeeId);
    const employeeName = employee ? employee.fullName : '';
    
    const matchesSearch = 
      employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.notes && record.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesEmployee = !filterEmployee || record.employeeId === parseInt(filterEmployee);
    const matchesDate = !filterDate || record.date === filterDate;

    return matchesSearch && matchesEmployee && matchesDate;
  }).sort((a, b) => new Date(b.date) - new Date(a.date)); // ترتيب حسب التاريخ (الأحدث أولاً)

  // الحصول على حضور اليوم
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter(a => a.date === today);
  const presentToday = todayAttendance.filter(a => a.status === 'present').length;

  // فحص صلاحية الوصول
  if (!canManageAttendance) {
    return (
      <div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-4">
          <FaExclamationTriangle className="text-red-600 text-2xl" />
          <div>
            <h3 className="text-red-800 font-bold text-lg">وصول غير مصرح</h3>
            <p className="text-red-700">ليس لديك صلاحية لإدارة الحضور والانصراف</p>
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
    { header: 'التاريخ', accessor: 'date' },
    { header: 'وقت الدخول', accessor: 'clockIn' },
    { header: 'وقت الخروج', accessor: 'clockOut' },
    { 
      header: 'ساعات العمل', 
      accessor: 'totalHours',
      render: (row) => row.totalHours ? `${row.totalHours} ساعة` : '-'
    },
    { 
      header: 'الحالة', 
      accessor: 'status',
      render: (row) => {
        const statusMap = {
          'present': { label: 'حاضر', color: 'bg-green-100 text-green-800' },
          'absent': { label: 'غائب', color: 'bg-red-100 text-red-800' },
          'late': { label: 'متأخر', color: 'bg-yellow-100 text-yellow-800' },
          'half_day': { label: 'نصف يوم', color: 'bg-blue-100 text-blue-800' }
        };
        const status = statusMap[row.status] || { label: row.status, color: 'bg-gray-100 text-gray-800' };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
            {status.label}
          </span>
        );
      }
    },
    { 
      header: 'ملاحظات', 
      accessor: 'notes',
      render: (row) => row.notes ? (row.notes.length > 20 ? row.notes.substring(0, 20) + '...' : row.notes) : '-'
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <FaClock className="text-orange-600" />
          إدارة الحضور والانصراف
        </h1>
        {canEditAttendance && (
          <Button 
            onClick={handleAdd}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <FaPlus className="ml-2" />
            إضافة سجل حضور
          </Button>
        )}
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-blue-50 border-blue-200">
          <div className="text-center p-4">
            <FaCalendarAlt className="text-3xl text-blue-600 mx-auto mb-2" />
            <h4 className="font-bold text-blue-800">إجمالي السجلات</h4>
            <p className="text-2xl font-bold text-blue-600">{attendance.length}</p>
          </div>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <div className="text-center p-4">
            <FaPlay className="text-3xl text-green-600 mx-auto mb-2" />
            <h4 className="font-bold text-green-800">الحاضرون اليوم</h4>
            <p className="text-2xl font-bold text-green-600">{presentToday}</p>
          </div>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <div className="text-center p-4">
            <FaClock className="text-3xl text-yellow-600 mx-auto mb-2" />
            <h4 className="font-bold text-yellow-800">إجمالي الموظفين</h4>
            <p className="text-2xl font-bold text-yellow-600">{employees.filter(e => e.status === 'active').length}</p>
          </div>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <div className="text-center p-4">
            <FaStop className="text-3xl text-purple-600 mx-auto mb-2" />
            <h4 className="font-bold text-purple-800">معدل الحضور</h4>
            <p className="text-2xl font-bold text-purple-600">
              {employees.filter(e => e.status === 'active').length > 0 
                ? Math.round((presentToday / employees.filter(e => e.status === 'active').length) * 100)
                : 0}%
            </p>
          </div>
        </Card>
      </div>

      {/* شريط البحث والفلاتر */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في سجلات الحضور..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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

          <Input 
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            placeholder="فلترة بالتاريخ"
          />

          <Button 
            onClick={() => {
              setSearchTerm('');
              setFilterEmployee('');
              setFilterDate('');
            }}
            variant="secondary"
            className="w-full"
          >
            مسح الفلاتر
          </Button>
        </div>
      </Card>

      {/* أزرار الحضور السريع */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">تسجيل الحضور السريع</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {employees.filter(e => e.status === 'active').map(employee => {
            const todayRecord = attendance.find(a => 
              a.employeeId === employee.id && a.date === today
            );
            
            return (
              <div key={employee.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="font-semibold text-gray-800">{employee.fullName}</p>
                    <p className="text-sm text-gray-600">{employee.employeeId}</p>
                  </div>
                  {todayRecord && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      todayRecord.clockIn && !todayRecord.clockOut 
                        ? 'bg-green-100 text-green-800'
                        : todayRecord.clockIn && todayRecord.clockOut
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {todayRecord.clockIn && !todayRecord.clockOut ? 'حاضر' : 
                       todayRecord.clockIn && todayRecord.clockOut ? 'انتهى' : 'غائب'}
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {!todayRecord?.clockIn && (
                    <Button
                      size="sm"
                      onClick={() => handleQuickClockIn(employee.id)}
                      className="bg-green-600 hover:bg-green-700 text-white flex-1"
                    >
                      <FaPlay className="mr-1" />
                      حضور
                    </Button>
                  )}
                  
                  {todayRecord?.clockIn && !todayRecord?.clockOut && (
                    <Button
                      size="sm"
                      onClick={() => handleQuickClockOut(employee.id)}
                      className="bg-red-600 hover:bg-red-700 text-white flex-1"
                    >
                      <FaStop className="mr-1" />
                      انصراف
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card icon={<FaClock />}>
        <Table
          columns={columns}
          data={filteredAttendance}
          onEdit={canEditAttendance ? handleEdit : null}
          onDelete={canDeleteAttendance ? handleDeleteClick : null}
        />
      </Card>

      {/* نافذة الإضافة/التعديل */}
      <Modal
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        title={selectedAttendance ? "تعديل سجل الحضور" : "إضافة سجل حضور"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditModal(false)}>إلغاء</Button>
            <Button 
              variant="success" 
              onClick={handleSubmit}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {selectedAttendance ? 'حفظ التغييرات' : 'إضافة السجل'}
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

          <Input 
            label="التاريخ *" 
            name="date" 
            type="date"
            value={formData.date} 
            onChange={(e) => setFormData({ ...formData, date: e.target.value })} 
            required 
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="وقت الدخول" 
              name="clockIn" 
              type="time"
              value={formData.clockIn} 
              onChange={(e) => setFormData({ ...formData, clockIn: e.target.value })} 
            />
            <Input 
              label="وقت الخروج" 
              name="clockOut" 
              type="time"
              value={formData.clockOut} 
              onChange={(e) => setFormData({ ...formData, clockOut: e.target.value })} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="بداية الاستراحة" 
              name="breakStart" 
              type="time"
              value={formData.breakStart} 
              onChange={(e) => setFormData({ ...formData, breakStart: e.target.value })} 
            />
            <Input 
              label="نهاية الاستراحة" 
              name="breakEnd" 
              type="time"
              value={formData.breakEnd} 
              onChange={(e) => setFormData({ ...formData, breakEnd: e.target.value })} 
            />
          </div>

          <Input 
            label="إجمالي ساعات العمل" 
            name="totalHours" 
            type="number"
            step="0.01"
            value={formData.totalHours} 
            onChange={(e) => setFormData({ ...formData, totalHours: e.target.value })} 
            placeholder="سيتم حسابها تلقائياً عند إدخال أوقات الدخول والخروج"
          />

          <Select 
            label="حالة الحضور"
            name="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: 'present', label: 'حاضر' },
              { value: 'absent', label: 'غائب' },
              { value: 'late', label: 'متأخر' },
              { value: 'half_day', label: 'نصف يوم' }
            ]}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="ملاحظات إضافية..."
            />
          </div>
        </form>
      </Modal>

      {/* نافذة تأكيد الحذف */}
      {deleteModal && attendanceToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-100 rounded-full p-4">
                <FaExclamationTriangle className="text-4xl text-red-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              تأكيد حذف سجل الحضور
            </h2>

            <div className="bg-yellow-50 p-4 rounded-lg mb-4 border border-yellow-200">
              <p className="text-gray-700 text-center mb-2">
                هل أنت متأكد من حذف هذا السجل؟
              </p>
              <p className="text-sm text-red-600 text-center font-semibold">
                ⚠️ لا يمكن التراجع عن هذا الإجراء
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">تفاصيل السجل:</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">الموظف: </span>
                  <span className="font-semibold">
                    {(() => {
                      const employee = employees.find(e => e.id === attendanceToDelete.employeeId);
                      return employee ? employee.fullName : '-';
                    })()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">التاريخ: </span>
                  <span className="font-semibold">{attendanceToDelete.date}</span>
                </div>
                <div>
                  <span className="text-gray-600">وقت الدخول: </span>
                  <span className="font-semibold">{attendanceToDelete.clockIn || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-600">وقت الخروج: </span>
                  <span className="font-semibold">{attendanceToDelete.clockOut || '-'}</span>
                </div>
                {attendanceToDelete.notes && (
                  <div>
                    <span className="text-gray-600">ملاحظات: </span>
                    <span className="font-semibold">{attendanceToDelete.notes}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                نعم، احذف السجل
              </button>
              <button
                onClick={() => {
                  setDeleteModal(false);
                  setAttendanceToDelete(null);
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

export default Attendance;