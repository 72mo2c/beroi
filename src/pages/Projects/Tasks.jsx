// ======================================
// Project Tasks Management Page - صفحة إدارة المهام
// ======================================

import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaSearch, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaTasks,
  FaUser,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaProjectDiagram,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaFlag,
  FaUserCircle
} from 'react-icons/fa';
import Table from '../../components/Common/Table';
import Modal from '../../components/Common/Modal';
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';
import { useData } from '../../context/DataContext';

const Tasks = () => {
  const { projectTasks = [], projects = [], projectPhases = [], updateData } = useData();
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedPhase, setSelectedPhase] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedAssignee, setSelectedAssignee] = useState('all');
  const [sortField, setSortField] = useState('priority');
  const [sortDirection, setSortDirection] = useState('desc');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    phaseId: '',
    assignee: '',
    priority: 'medium',
    status: 'todo',
    startDate: '',
    dueDate: '',
    estimatedHours: '',
    actualHours: '',
    progress: 0,
    tags: '',
    notes: ''
  });

  useEffect(() => {
    let filtered = projectTasks.filter(task => 
      task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignee?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedProject !== 'all') {
      filtered = filtered.filter(task => task.projectId === selectedProject);
    }

    if (selectedPhase !== 'all') {
      filtered = filtered.filter(task => task.phaseId === selectedPhase);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(task => task.status === selectedStatus);
    }

    if (selectedAssignee !== 'all') {
      filtered = filtered.filter(task => task.assignee === selectedAssignee);
    }

    // Sort tasks
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'projectId') {
        const aProject = projects.find(p => p.id === a.projectId);
        const bProject = projects.find(p => p.id === b.projectId);
        aValue = aProject?.name || '';
        bValue = bProject?.name || '';
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

    setFilteredTasks(filtered);
    setCurrentPage(1);
  }, [projectTasks, projects, projectPhases, searchTerm, selectedProject, selectedPhase, selectedStatus, selectedAssignee, sortField, sortDirection]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingTask) {
      const updatedTasks = projectTasks.map(task =>
        task.id === editingTask.id 
          ? { ...formData, id: editingTask.id, lastModified: new Date().toISOString() }
          : task
      );
      updateData('projectTasks', updatedTasks);
    } else {
      const newTask = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };
      updateData('projectTasks', [...projectTasks, newTask]);
    }

    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      projectId: '',
      phaseId: '',
      assignee: '',
      priority: 'medium',
      status: 'todo',
      startDate: '',
      dueDate: '',
      estimatedHours: '',
      actualHours: '',
      progress: 0,
      tags: '',
      notes: ''
    });
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title || '',
      description: task.description || '',
      projectId: task.projectId || '',
      phaseId: task.phaseId || '',
      assignee: task.assignee || '',
      priority: task.priority || 'medium',
      status: task.status || 'todo',
      startDate: task.startDate || '',
      dueDate: task.dueDate || '',
      estimatedHours: task.estimatedHours || '',
      actualHours: task.actualHours || '',
      progress: task.progress || 0,
      tags: task.tags || '',
      notes: task.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (task) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المهمة؟')) {
      const updatedTasks = projectTasks.filter(t => t.id !== task.id);
      updateData('projectTasks', updatedTasks);
    }
  };

  const handleView = (task) => {
    console.log('View task:', task);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      todo: { label: 'للمتابعة', color: 'bg-gray-100 text-gray-800', icon: <FaClock /> },
      in_progress: { label: 'قيد التنفيذ', color: 'bg-blue-100 text-blue-800', icon: <FaTasks /> },
      review: { label: 'قيد المراجعة', color: 'bg-yellow-100 text-yellow-800', icon: <FaEye /> },
      completed: { label: 'مكتملة', color: 'bg-green-100 text-green-800', icon: <FaCheckCircle /> },
      cancelled: { label: 'ملغية', color: 'bg-red-100 text-red-800', icon: <FaExclamationTriangle /> }
    };
    return statusMap[status] || statusMap.todo;
  };

  const getPriorityInfo = (priority) => {
    const priorityMap = {
      low: { label: 'منخفضة', color: 'bg-gray-100 text-gray-800', icon: <FaFlag className="text-gray-500" /> },
      medium: { label: 'متوسطة', color: 'bg-blue-100 text-blue-800', icon: <FaFlag className="text-blue-500" /> },
      high: { label: 'عالية', color: 'bg-orange-100 text-orange-800', icon: <FaFlag className="text-orange-500" /> },
      urgent: { label: 'عاجلة', color: 'bg-red-100 text-red-800', icon: <FaFlag className="text-red-500" /> }
    };
    return priorityMap[priority] || priorityMap.medium;
  };

  const calculateTaskStats = () => {
    const total = projectTasks.length;
    const completed = projectTasks.filter(t => t.status === 'completed').length;
    const inProgress = projectTasks.filter(t => t.status === 'in_progress').length;
    const todo = projectTasks.filter(t => t.status === 'todo').length;
    const review = projectTasks.filter(t => t.status === 'review').length;
    
    return { total, completed, inProgress, todo, review };
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'مشروع غير محدد';
  };

  const getPhaseName = (phaseId) => {
    const phase = projectPhases.find(p => p.id === phaseId);
    return phase?.name || 'مرحلة غير محددة';
  };

  const getUniqueAssignees = () => {
    const assignees = [...new Set(projectTasks.map(task => task.assignee).filter(Boolean))];
    return assignees.sort();
  };

  const stats = calculateTaskStats();

  const columns = [
    {
      header: (
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleSort('title')}>
          عنوان المهمة
          {sortField === 'title' && (
            sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
          )}
        </div>
      ),
      accessor: 'title',
      render: (task) => (
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <FaTasks className="text-purple-600" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{task.title}</div>
            <div className="text-sm text-gray-500">{task.description}</div>
          </div>
        </div>
      )
    },
    {
      header: (
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleSort('projectId')}>
          المشروع/المرحلة
          {sortField === 'projectId' && (
            sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
          )}
        </div>
      ),
      render: (task) => (
        <div>
          <div className="flex items-center gap-2 text-sm">
            <FaProjectDiagram className="text-gray-400" />
            <span className="font-medium">{getProjectName(task.projectId)}</span>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {task.phaseId && (
              <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                {getPhaseName(task.phaseId)}
              </span>
            )}
          </div>
        </div>
      )
    },
    {
      header: (
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleSort('assignee')}>
          المسند إليه
          {sortField === 'assignee' && (
            sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
          )}
        </div>
      ),
      render: (task) => (
        <div className="flex items-center gap-2">
          <FaUserCircle className="text-gray-400" />
          <span className="font-medium">{task.assignee || 'غير محدد'}</span>
        </div>
      )
    },
    {
      header: 'التواريخ',
      render: (task) => (
        <div>
          <div className="text-sm">
            <div className="font-medium">البداية: {task.startDate || 'غير محدد'}</div>
            <div className="text-gray-500">الإنجاز: {task.dueDate || 'غير محدد'}</div>
          </div>
        </div>
      )
    },
    {
      header: (
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleSort('priority')}>
          الأولوية
          {sortField === 'priority' && (
            sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
          )}
        </div>
      ),
      render: (task) => {
        const priorityInfo = getPriorityInfo(task.priority);
        return (
          <div className="flex items-center gap-2">
            {priorityInfo.icon}
            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${priorityInfo.color}`}>
              {priorityInfo.label}
            </span>
          </div>
        );
      }
    },
    {
      header: (
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleSort('status')}>
          الحالة
          {sortField === 'status' && (
            sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
          )}
        </div>
      ),
      render: (task) => {
        const statusInfo = getStatusInfo(task.status);
        return (
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
            {statusInfo.icon}
            {statusInfo.label}
          </span>
        );
      }
    },
    {
      header: 'التقدم',
      render: (task) => (
        <div className="w-full max-w-24">
          <div className="flex justify-between text-xs mb-1">
            <span>{task.progress || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                task.status === 'completed' ? 'bg-green-500' : 'bg-purple-500'
              }`}
              style={{ width: `${task.progress || 0}%` }}
            ></div>
          </div>
        </div>
      )
    }
  ];

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTasks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getPhasesByProject = (projectId) => {
    return projectPhases.filter(phase => phase.projectId === projectId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة المهام</h1>
          <p className="text-gray-600 mt-1">تتبع ومتابعة مهام المشاريع</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2"
        >
          <FaPlus />
          مهمة جديدة
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">إجمالي المهام</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <FaTasks className="text-purple-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">مكتملة</p>
              <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FaCheckCircle className="text-green-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">قيد التنفيذ</p>
              <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FaTasks className="text-blue-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-gray-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">للمتابعة</p>
              <p className="text-3xl font-bold text-gray-600">{stats.todo}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <FaClock className="text-gray-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">قيد المراجعة</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.review}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <FaEye className="text-yellow-600 text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <Input
              type="text"
              placeholder="البحث في المهام..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={selectedProject}
            onChange={(e) => {
              setSelectedProject(e.target.value);
              setSelectedPhase('all');
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
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={selectedPhase}
            onChange={(e) => setSelectedPhase(e.target.value)}
            disabled={selectedProject === 'all'}
          >
            <option value="all">جميع المراحل</option>
            {selectedProject !== 'all' && 
              getPhasesByProject(selectedProject).map(phase => (
                <option key={phase.id} value={phase.id}>
                  {phase.name}
                </option>
              ))
            }
          </select>
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">جميع الحالات</option>
            <option value="todo">للمتابعة</option>
            <option value="in_progress">قيد التنفيذ</option>
            <option value="review">قيد المراجعة</option>
            <option value="completed">مكتملة</option>
            <option value="cancelled">ملغية</option>
          </select>
        </div>
        <div className="mt-4">
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={selectedAssignee}
            onChange={(e) => setSelectedAssignee(e.target.value)}
          >
            <option value="all">جميع المكلفين</option>
            {getUniqueAssignees().map(assignee => (
              <option key={assignee} value={assignee}>
                {assignee}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">قائمة المهام</h3>
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
                عرض {indexOfFirstItem + 1} إلى {Math.min(indexOfLastItem, filteredTasks.length)} من {filteredTasks.length} مهمة
              </div>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg ${
                      currentPage === page
                        ? 'bg-purple-500 text-white'
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

      {/* Add/Edit Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTask ? 'تعديل المهمة' : 'مهمة جديدة'}
        size="xl"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleCloseModal}>
              إلغاء
            </Button>
            <Button onClick={handleSubmit}>
              {editingTask ? 'تحديث' : 'إضافة'}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="عنوان المهمة"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />

            <Input
              label="المسند إليه"
              name="assignee"
              value={formData.assignee}
              onChange={handleInputChange}
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                المرحلة
              </label>
              <select
                name="phaseId"
                value={formData.phaseId}
                onChange={handleInputChange}
                disabled={!formData.projectId}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">اختر المرحلة</option>
                {formData.projectId && 
                  getPhasesByProject(formData.projectId).map(phase => (
                    <option key={phase.id} value={phase.id}>
                      {phase.name}
                    </option>
                  ))
                }
              </select>
            </div>

            <Input
              label="تاريخ البداية"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleInputChange}
            />

            <Input
              label="تاريخ الإنجاز"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleInputChange}
            />

            <Input
              label="الوقت المقدر (ساعة)"
              name="estimatedHours"
              type="number"
              value={formData.estimatedHours}
              onChange={handleInputChange}
              min="0"
              step="0.5"
            />

            <Input
              label="الوقت الفعلي (ساعة)"
              name="actualHours"
              type="number"
              value={formData.actualHours}
              onChange={handleInputChange}
              min="0"
              step="0.5"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الأولوية
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="low">منخفضة</option>
                <option value="medium">متوسطة</option>
                <option value="high">عالية</option>
                <option value="urgent">عاجلة</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                حالة المهمة
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="todo">للمتابعة</option>
                <option value="in_progress">قيد التنفيذ</option>
                <option value="review">قيد المراجعة</option>
                <option value="completed">مكتملة</option>
                <option value="cancelled">ملغية</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نسبة الإنجاز (%)
              </label>
              <input
                type="range"
                name="progress"
                min="0"
                max="100"
                value={formData.progress}
                onChange={handleInputChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>0%</span>
                <span className="font-medium text-purple-600">{formData.progress}%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وصف المهمة
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="وصف تفصيلي للمهمة..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                العلامات (Tags)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="مثال: frontend, urgent, bug (مفصولة بفواصل)"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ملاحظات إضافية
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="ملاحظات أو تعليمات إضافية..."
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Tasks;