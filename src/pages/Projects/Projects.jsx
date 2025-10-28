// ======================================
// Projects Management Page - صفحة إدارة المشاريع
// ======================================

import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaSearch, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaProjectDiagram,
  FaCalendarAlt,
  FaUsers,
  FaDollarSign,
  FaChartLine,
  FaTasks,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock
} from 'react-icons/fa';
import Table from '../../components/Common/Table';
import Modal from '../../components/Common/Modal';
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';
import { useData } from '../../context/DataContext';

const Projects = () => {
  const { projects = [], updateData } = useData();
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    status: 'planning',
    priority: 'medium',
    manager: '',
    client: '',
    progress: 0
  });

  useEffect(() => {
    const filtered = projects.filter(project =>
      project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.manager?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProjects(filtered);
    setCurrentPage(1);
  }, [projects, searchTerm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingProject) {
      const updatedProjects = projects.map(project =>
        project.id === editingProject.id 
          ? { ...formData, id: editingProject.id, lastModified: new Date().toISOString() }
          : project
      );
      updateData('projects', updatedProjects);
    } else {
      const newProject = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };
      updateData('projects', [...projects, newProject]);
    }

    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setFormData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      budget: '',
      status: 'planning',
      priority: 'medium',
      manager: '',
      client: '',
      progress: 0
    });
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name || '',
      description: project.description || '',
      startDate: project.startDate || '',
      endDate: project.endDate || '',
      budget: project.budget || '',
      status: project.status || 'planning',
      priority: project.priority || 'medium',
      manager: project.manager || '',
      client: project.client || '',
      progress: project.progress || 0
    });
    setIsModalOpen(true);
  };

  const handleDelete = (project) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المشروع؟')) {
      const updatedProjects = projects.filter(p => p.id !== project.id);
      updateData('projects', updatedProjects);
    }
  };

  const handleView = (project) => {
    // يمكن تطوير صفحة عرض تفصيلية لاحقاً
    console.log('View project:', project);
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      planning: { label: 'قيد التخطيط', color: 'bg-blue-100 text-blue-800', icon: <FaClock /> },
      in_progress: { label: 'قيد التنفيذ', color: 'bg-yellow-100 text-yellow-800', icon: <FaTasks /> },
      completed: { label: 'مكتمل', color: 'bg-green-100 text-green-800', icon: <FaCheckCircle /> },
      on_hold: { label: 'متوقف', color: 'bg-red-100 text-red-800', icon: <FaExclamationTriangle /> },
      cancelled: { label: 'ملغي', color: 'bg-gray-100 text-gray-800', icon: <FaExclamationTriangle /> }
    };
    return statusMap[status] || statusMap.planning;
  };

  const getPriorityInfo = (priority) => {
    const priorityMap = {
      low: { label: 'منخفض', color: 'bg-gray-100 text-gray-800' },
      medium: { label: 'متوسط', color: 'bg-blue-100 text-blue-800' },
      high: { label: 'عالي', color: 'bg-orange-100 text-orange-800' },
      urgent: { label: 'عاجل', color: 'bg-red-100 text-red-800' }
    };
    return priorityMap[priority] || priorityMap.medium;
  };

  const calculateProjectStats = () => {
    const total = projects.length;
    const completed = projects.filter(p => p.status === 'completed').length;
    const inProgress = projects.filter(p => p.status === 'in_progress').length;
    const planning = projects.filter(p => p.status === 'planning').length;
    const totalBudget = projects.reduce((sum, p) => sum + (parseFloat(p.budget) || 0), 0);
    
    return { total, completed, inProgress, planning, totalBudget };
  };

  const stats = calculateProjectStats();

  const columns = [
    {
      header: 'اسم المشروع',
      accessor: 'name',
      render: (project) => (
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-lg">
            <FaProjectDiagram className="text-orange-600" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{project.name}</div>
            <div className="text-sm text-gray-500">{project.description}</div>
          </div>
        </div>
      )
    },
    {
      header: 'المدير/العميل',
      render: (project) => (
        <div>
          <div className="font-medium text-gray-900">{project.manager || 'غير محدد'}</div>
          <div className="text-sm text-gray-500">{project.client || 'غير محدد'}</div>
        </div>
      )
    },
    {
      header: 'التواريخ',
      render: (project) => (
        <div>
          <div className="text-sm">
            <div className="font-medium">البداية: {project.startDate || 'غير محدد'}</div>
            <div className="text-gray-500">النهاية: {project.endDate || 'غير محدد'}</div>
          </div>
        </div>
      )
    },
    {
      header: 'الميزانية',
      render: (project) => (
        <div className="text-right">
          <div className="font-semibold text-green-600">
            {parseFloat(project.budget || 0).toLocaleString()} جنيه
          </div>
        </div>
      )
    },
    {
      header: 'الحالة',
      render: (project) => {
        const statusInfo = getStatusInfo(project.status);
        return (
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
              {statusInfo.icon}
              {statusInfo.label}
            </span>
          </div>
        );
      }
    },
    {
      header: 'الأولوية',
      render: (project) => {
        const priorityInfo = getPriorityInfo(project.priority);
        return (
          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${priorityInfo.color}`}>
            {priorityInfo.label}
          </span>
        );
      }
    },
    {
      header: 'التقدم',
      render: (project) => (
        <div className="w-full">
          <div className="flex justify-between text-sm mb-1">
            <span>التقدم</span>
            <span>{project.progress || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${project.progress || 0}%` }}
            ></div>
          </div>
        </div>
      )
    }
  ];

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة المشاريع</h1>
          <p className="text-gray-600 mt-1">إدارة ومتابعة جميع مشاريع المؤسسة</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2"
        >
          <FaPlus />
          مشروع جديد
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">إجمالي المشاريع</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <FaProjectDiagram className="text-orange-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">المشاريع المكتملة</p>
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

        <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">إجمالي الميزانية</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.totalBudget.toLocaleString()}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <FaDollarSign className="text-yellow-600 text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="البحث في المشاريع..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <select 
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              onChange={(e) => {
                const status = e.target.value;
                setFilteredProjects(
                  status === 'all' ? projects : projects.filter(p => p.status === status)
                );
              }}
            >
              <option value="all">جميع الحالات</option>
              <option value="planning">قيد التخطيط</option>
              <option value="in_progress">قيد التنفيذ</option>
              <option value="completed">مكتمل</option>
              <option value="on_hold">متوقف</option>
              <option value="cancelled">ملغي</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">قائمة المشاريع</h3>
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
                عرض {indexOfFirstItem + 1} إلى {Math.min(indexOfLastItem, filteredProjects.length)} من {filteredProjects.length} مشروع
              </div>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg ${
                      currentPage === page
                        ? 'bg-orange-500 text-white'
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

      {/* Add/Edit Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProject ? 'تعديل المشروع' : 'مشروع جديد'}
        size="lg"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleCloseModal}>
              إلغاء
            </Button>
            <Button onClick={handleSubmit}>
              {editingProject ? 'تحديث' : 'إضافة'}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="اسم المشروع"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            
            <Input
              label="مدير المشروع"
              name="manager"
              value={formData.manager}
              onChange={handleInputChange}
            />

            <Input
              label="العميل"
              name="client"
              value={formData.client}
              onChange={handleInputChange}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الميزانية
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="0.00"
                step="0.01"
              />
            </div>

            <Input
              label="تاريخ البداية"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleInputChange}
            />

            <Input
              label="تاريخ النهاية"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleInputChange}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                حالة المشروع
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="planning">قيد التخطيط</option>
                <option value="in_progress">قيد التنفيذ</option>
                <option value="completed">مكتمل</option>
                <option value="on_hold">متوقف</option>
                <option value="cancelled">ملغي</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الأولوية
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="low">منخفضة</option>
                <option value="medium">متوسطة</option>
                <option value="high">عالية</option>
                <option value="urgent">عاجلة</option>
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
                <span className="font-medium text-orange-600">{formData.progress}%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وصف المشروع
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="وصف تفصيلي للمشروع..."
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;