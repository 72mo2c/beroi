// ======================================
// Time Tracking Management Page - صفحة تتبع الوقت
// ======================================

import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaSearch, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaClock,
  FaPlay,
  FaStop,
  FaPause,
  FaUser,
  FaCalendarAlt,
  FaProjectDiagram,
  FaTasks,
  FaHourglassHalf,
  FaCheckCircle,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaDownload,
  FaFilter
} from 'react-icons/fa';
import Table from '../../components/Common/Table';
import Modal from '../../components/Common/Modal';
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';
import { useData } from '../../context/DataContext';

const TimeTracking = () => {
  const { timeTrackingRecords = [], projects = [], projectTasks = [], updateData } = useData();
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedTask, setSelectedTask] = useState('all');
  const [selectedUser, setSelectedUser] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [runningTimer, setRunningTimer] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    userName: '',
    projectId: '',
    taskId: '',
    date: '',
    startTime: '',
    endTime: '',
    duration: '',
    description: '',
    billable: true,
    hourlyRate: '',
    totalAmount: ''
  });

  useEffect(() => {
    let filtered = timeTrackingRecords.filter(record => 
      record.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedProject !== 'all') {
      filtered = filtered.filter(record => record.projectId === selectedProject);
    }

    if (selectedTask !== 'all') {
      filtered = filtered.filter(record => record.taskId === selectedTask);
    }

    if (selectedUser !== 'all') {
      filtered = filtered.filter(record => record.userName === selectedUser);
    }

    if (dateFrom) {
      filtered = filtered.filter(record => record.date >= dateFrom);
    }

    if (dateTo) {
      filtered = filtered.filter(record => record.date <= dateTo);
    }

    // Sort records
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'projectId') {
        const aProject = projects.find(p => p.id === a.projectId);
        const bProject = projects.find(p => p.id === b.projectId);
        aValue = aProject?.name || '';
        bValue = bProject?.name || '';
      } else if (sortField === 'taskId') {
        const aTask = projectTasks.find(t => t.id === a.taskId);
        const bTask = projectTasks.find(t => t.id === b.taskId);
        aValue = aTask?.title || '';
        bValue = bTask?.title || '';
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredRecords(filtered);
    setCurrentPage(1);
  }, [timeTrackingRecords, projects, projectTasks, searchTerm, selectedProject, selectedTask, selectedUser, dateFrom, dateTo, sortField, sortDirection]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;
    
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    
    const diffMs = end - start;
    return diffMs > 0 ? Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100 : 0;
  };

  const calculateTotalAmount = (duration, rate) => {
    return Math.round((duration * rate) * 100) / 100;
  };

  const handleTimeInputsChange = () => {
    const duration = calculateDuration(formData.startTime, formData.endTime);
    const totalAmount = calculateTotalAmount(duration, parseFloat(formData.hourlyRate) || 0);
    
    setFormData(prev => ({
      ...prev,
      duration: duration.toString(),
      totalAmount: totalAmount.toString()
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const duration = calculateDuration(formData.startTime, formData.endTime);
    const totalAmount = calculateTotalAmount(duration, parseFloat(formData.hourlyRate) || 0);
    
    const recordData = {
      ...formData,
      duration: duration.toString(),
      totalAmount: totalAmount.toString()
    };
    
    if (editingRecord) {
      const updatedRecords = timeTrackingRecords.map(record =>
        record.id === editingRecord.id 
          ? { ...recordData, id: editingRecord.id, lastModified: new Date().toISOString() }
          : record
      );
      updateData('timeTrackingRecords', updatedRecords);
    } else {
      const newRecord = {
        ...recordData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };
      updateData('timeTrackingRecords', [...timeTrackingRecords, newRecord]);
    }

    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    setFormData({
      userId: '',
      userName: '',
      projectId: '',
      taskId: '',
      date: '',
      startTime: '',
      endTime: '',
      duration: '',
      description: '',
      billable: true,
      hourlyRate: '',
      totalAmount: ''
    });
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormData({
      userId: record.userId || '',
      userName: record.userName || '',
      projectId: record.projectId || '',
      taskId: record.taskId || '',
      date: record.date || '',
      startTime: record.startTime || '',
      endTime: record.endTime || '',
      duration: record.duration || '',
      description: record.description || '',
      billable: record.billable !== false,
      hourlyRate: record.hourlyRate || '',
      totalAmount: record.totalAmount || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (record) => {
    if (window.confirm('هل أنت متأكد من حذف هذا السجل؟')) {
      const updatedRecords = timeTrackingRecords.filter(r => r.id !== record.id);
      updateData('timeTrackingRecords', updatedRecords);
    }
  };

  const handleView = (record) => {
    console.log('View time record:', record);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const startTimer = (projectId, taskId, userName) => {
    if (runningTimer) {
      stopTimer();
    }

    const timer = {
      id: Date.now(),
      projectId,
      taskId,
      userName,
      startTime: new Date(),
      isRunning: true
    };

    setRunningTimer(timer);
  };

  const pauseTimer = () => {
    if (runningTimer) {
      setRunningTimer({
        ...runningTimer,
        isRunning: false,
        pauseTime: new Date()
      });
    }
  };

  const resumeTimer = () => {
    if (runningTimer) {
      setRunningTimer({
        ...runningTimer,
        isRunning: true,
        resumeTime: new Date()
      });
    }
  };

  const stopTimer = () => {
    if (runningTimer) {
      const endTime = new Date();
      const duration = Math.round(((endTime - runningTimer.startTime) / (1000 * 60 * 60)) * 100) / 100;
      
      const newRecord = {
        id: Date.now(),
        userId: runningTimer.userName,
        userName: runningTimer.userName,
        projectId: runningTimer.projectId,
        taskId: runningTimer.taskId,
        date: new Date().toISOString().split('T')[0],
        startTime: runningTimer.startTime.toTimeString().slice(0, 5),
        endTime: endTime.toTimeString().slice(0, 5),
        duration: duration.toString(),
        description: 'تسجيل تلقائي من المؤقت',
        billable: true,
        hourlyRate: '0',
        totalAmount: '0',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };

      updateData('timeTrackingRecords', [...timeTrackingRecords, newRecord]);
      setRunningTimer(null);
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}`;
  };

  const calculateTimeStats = () => {
    const total = timeTrackingRecords.length;
    const totalHours = timeTrackingRecords.reduce((sum, record) => sum + (parseFloat(record.duration) || 0), 0);
    const billableHours = timeTrackingRecords.filter(r => r.billable).reduce((sum, record) => sum + (parseFloat(record.duration) || 0), 0);
    const totalAmount = timeTrackingRecords.reduce((sum, record) => sum + (parseFloat(record.totalAmount) || 0), 0);
    
    return { total, totalHours, billableHours, totalAmount };
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'مشروع غير محدد';
  };

  const getTaskName = (taskId) => {
    const task = projectTasks.find(t => t.id === taskId);
    return task?.title || 'مهمة غير محددة';
  };

  const getUniqueUsers = () => {
    const users = [...new Set(timeTrackingRecords.map(record => record.userName).filter(Boolean))];
    return users.sort();
  };

  const stats = calculateTimeStats();

  const columns = [
    {
      header: (
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleSort('userName')}>
          المستخدم
          {sortField === 'userName' && (
            sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
          )}
        </div>
      ),
      accessor: 'userName',
      render: (record) => (
        <div className="flex items-center gap-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <FaUser className="text-green-600" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{record.userName || 'غير محدد'}</div>
            <div className="text-sm text-gray-500">{record.description}</div>
          </div>
        </div>
      )
    },
    {
      header: (
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleSort('projectId')}>
          المشروع/المهمة
          {sortField === 'projectId' && (
            sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
          )}
        </div>
      ),
      render: (record) => (
        <div>
          <div className="flex items-center gap-2 text-sm">
            <FaProjectDiagram className="text-gray-400" />
            <span className="font-medium">{getProjectName(record.projectId)}</span>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {record.taskId && (
              <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                {getTaskName(record.taskId)}
              </span>
            )}
          </div>
        </div>
      )
    },
    {
      header: (
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleSort('date')}>
          التاريخ
          {sortField === 'date' && (
            sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
          )}
        </div>
      ),
      render: (record) => (
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-gray-400" />
          <span className="font-medium">{record.date || 'غير محدد'}</span>
        </div>
      )
    },
    {
      header: 'الوقت',
      render: (record) => (
        <div>
          <div className="text-sm">
            <div className="font-medium">
              {record.startTime || '--:--'} - {record.endTime || '--:--'}
            </div>
          </div>
        </div>
      )
    },
    {
      header: (
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleSort('duration')}>
          المدة
          {sortField === 'duration' && (
            sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
          )}
        </div>
      ),
      render: (record) => (
        <div className="text-center">
          <div className="font-semibold text-gray-900">
            {parseFloat(record.duration || 0).toFixed(2)} ساعة
          </div>
        </div>
      )
    },
    {
      header: 'الفوترة',
      render: (record) => (
        <div>
          <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
            record.billable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {record.billable ? 'فوترة' : 'غير قابل للفوترة'}
          </div>
          {record.hourlyRate && (
            <div className="text-sm text-gray-500 mt-1">
              {record.hourlyRate} جنيه/ساعة
            </div>
          )}
        </div>
      )
    },
    {
      header: 'المبلغ الإجمالي',
      render: (record) => (
        <div className="text-center">
          <div className="font-semibold text-green-600">
            {parseFloat(record.totalAmount || 0).toLocaleString()} جنيه
          </div>
        </div>
      )
    }
  ];

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRecords.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getTasksByProject = (projectId) => {
    return projectTasks.filter(task => task.projectId === projectId);
  };

  const exportToCSV = () => {
    const headers = ['المستخدم', 'المشروع', 'المهمة', 'التاريخ', 'وقت البداية', 'وقت النهاية', 'المدة', 'الفوترة', 'سعر الساعة', 'المبلغ الإجمالي'];
    const csvData = filteredRecords.map(record => [
      record.userName || '',
      getProjectName(record.projectId),
      getTaskName(record.taskId),
      record.date || '',
      record.startTime || '',
      record.endTime || '',
      record.duration || '0',
      record.billable ? 'فوترة' : 'غير قابل للفوترة',
      record.hourlyRate || '0',
      record.totalAmount || '0'
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `time_tracking_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">تتبع الوقت</h1>
          <p className="text-gray-600 mt-1">إدارة وتسجيل أوقات العمل على المشاريع</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={exportToCSV}
            className="flex items-center gap-2"
          >
            <FaDownload />
            تصدير CSV
          </Button>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2"
          >
            <FaPlus />
            تسجيل وقت
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">إجمالي السجلات</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FaClock className="text-green-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">إجمالي الساعات</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalHours.toFixed(1)}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FaHourglassHalf className="text-blue-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">ساعات فوترة</p>
              <p className="text-3xl font-bold text-purple-600">{stats.billableHours.toFixed(1)}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <FaCheckCircle className="text-purple-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">إجمالي المبلغ</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.totalAmount.toLocaleString()}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <FaClock className="text-yellow-600 text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Timer Widget */}
      {runningTimer && (
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <FaClock className="text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold">مؤقت نشط</h3>
                <p className="text-green-100">
                  {getProjectName(runningTimer.projectId)} - {runningTimer.userName}
                </p>
                <p className="text-sm text-green-200">
                  بدأ في: {runningTimer.startTime.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              {runningTimer.isRunning ? (
                <Button
                  variant="warning"
                  onClick={pauseTimer}
                  className="bg-yellow-500 hover:bg-yellow-600"
                >
                  <FaPause />
                  إيقاف مؤقت
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  onClick={resumeTimer}
                  className="bg-gray-500 hover:bg-gray-600"
                >
                  <FaPlay />
                  استكمال
                </Button>
              )}
              <Button
                variant="danger"
                onClick={stopTimer}
                className="bg-red-500 hover:bg-red-600"
              >
                <FaStop />
                إيقاف وتسجيل
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <Input
              type="text"
              placeholder="البحث في السجلات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={selectedProject}
            onChange={(e) => {
              setSelectedProject(e.target.value);
              setSelectedTask('all');
            }}
          >
            <option value="all">جميع المشاريع</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={selectedTask}
            onChange={(e) => setSelectedTask(e.target.value)}
            disabled={selectedProject === 'all'}
          >
            <option value="all">جميع المهام</option>
            {selectedProject !== 'all' && 
              getTasksByProject(selectedProject).map(task => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))
            }
          </select>
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="all">جميع المستخدمين</option>
            {getUniqueUsers().map(user => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Input
            type="date"
            label="من تاريخ"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <Input
            type="date"
            label="إلى تاريخ"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
      </div>

      {/* Time Tracking Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">سجلات تتبع الوقت</h3>
        </div>
        
        <Table
          columns={columns}
          data={currentItems}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          actions={true}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                عرض {indexOfFirstItem + 1} إلى {Math.min(indexOfLastItem, filteredRecords.length)} من {filteredRecords.length} سجل
              </div>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg ${
                      currentPage === page
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Time Record Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingRecord ? 'تعديل سجل الوقت' : 'تسجيل وقت جديد'}
        size="lg"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleCloseModal}>
              إلغاء
            </Button>
            <Button onClick={handleSubmit}>
              {editingRecord ? 'تحديث' : 'تسجيل'}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="اسم المستخدم"
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المشروع
              </label>
              <select
                name="projectId"
                value={formData.projectId}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">اختر المشروع</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المهمة
              </label>
              <select
                name="taskId"
                value={formData.taskId}
                onChange={handleInputChange}
                disabled={!formData.projectId}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">اختر المهمة</option>
                {formData.projectId && 
                  getTasksByProject(formData.projectId).map(task => (
                    <option key={task.id} value={task.id}>
                      {task.title}
                    </option>
                  ))
                }
              </select>
            </div>

            <Input
              label="التاريخ"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />

            <Input
              label="وقت البداية"
              name="startTime"
              type="time"
              value={formData.startTime}
              onChange={(e) => {
                handleInputChange(e);
                setTimeout(handleTimeInputsChange, 100);
              }}
              required
            />

            <Input
              label="وقت النهاية"
              name="endTime"
              type="time"
              value={formData.endTime}
              onChange={(e) => {
                handleInputChange(e);
                setTimeout(handleTimeInputsChange, 100);
              }}
              required
            />

            <Input
              label="المدة (ساعة)"
              name="duration"
              type="number"
              value={formData.duration}
              onChange={handleInputChange}
              step="0.25"
              readOnly
              className="bg-gray-50"
            />

            <Input
              label="سعر الساعة"
              name="hourlyRate"
              type="number"
              value={formData.hourlyRate}
              onChange={(e) => {
                handleInputChange(e);
                setTimeout(handleTimeInputsChange, 100);
              }}
              step="0.01"
              placeholder="0.00"
            />

            <Input
              label="المبلغ الإجمالي"
              name="totalAmount"
              type="number"
              value={formData.totalAmount}
              onChange={handleInputChange}
              step="0.01"
              readOnly
              className="bg-gray-50"
            />

            <div className="md:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="billable"
                  checked={formData.billable}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                />
                <span className="text-sm font-medium text-gray-700">
                  قابل للفوترة
                </span>
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وصف العمل
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="وصف تفصيلي للعمل المنجز..."
                required
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TimeTracking;