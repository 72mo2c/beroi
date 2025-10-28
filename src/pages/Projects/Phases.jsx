// ======================================
// Project Phases Management Page - صفحة مراحل المشروع
// ======================================

import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaSearch, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaLayerGroup,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaProjectDiagram,
  FaSort,
  FaSortUp,
  FaSortDown
} from 'react-icons/fa';
import Table from '../../components/Common/Table';
import Modal from '../../components/Common/Modal';
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';
import { useData } from '../../context/DataContext';

const Phases = () => {
  const { projectPhases = [], projects = [], updateData } = useData();
  const [filteredPhases, setFilteredPhases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPhase, setEditingPhase] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedProject, setSelectedProject] = useState('all');
  const [sortField, setSortField] = useState('order');
  const [sortDirection, setSortDirection] = useState('asc');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    projectId: '',
    startDate: '',
    endDate: '',
    status: 'not_started',
    order: 1,
    duration: '',
    deliverables: '',
    dependencies: ''
  });

  useEffect(() => {
    let filtered = projectPhases.filter(phase => 
      phase.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phase.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedProject !== 'all') {
      filtered = filtered.filter(phase => phase.projectId === selectedProject);
    }

    // Sort phases
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

    setFilteredPhases(filtered);
    setCurrentPage(1);
  }, [projectPhases, projects, searchTerm, selectedProject, sortField, sortDirection]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingPhase) {
      const updatedPhases = projectPhases.map(phase =>
        phase.id === editingPhase.id 
          ? { ...formData, id: editingPhase.id, lastModified: new Date().toISOString() }
          : phase
      );
      updateData('projectPhases', updatedPhases);
    } else {
      const newPhase = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };
      updateData('projectPhases', [...projectPhases, newPhase]);
    }

    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPhase(null);
    setFormData({
      name: '',
      description: '',
      projectId: '',
      startDate: '',
      endDate: '',
      status: 'not_started',
      order: 1,
      duration: '',
      deliverables: '',
      dependencies: ''
    });
  };

  const handleEdit = (phase) => {
    setEditingPhase(phase);
    setFormData({
      name: phase.name || '',
      description: phase.description || '',
      projectId: phase.projectId || '',
      startDate: phase.startDate || '',
      endDate: phase.endDate || '',
      status: phase.status || 'not_started',
      order: phase.order || 1,
      duration: phase.duration || '',
      deliverables: phase.deliverables || '',
      dependencies: phase.dependencies || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (phase) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المرحلة؟')) {
      const updatedPhases = projectPhases.filter(p => p.id !== phase.id);
      updateData('projectPhases', updatedPhases);
    }
  };

  const handleView = (phase) => {
    console.log('View phase:', phase);
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
      not_started: { label: 'لم تبدأ', color: 'bg-gray-100 text-gray-800', icon: <FaClock /> },
      in_progress: { label: 'قيد التنفيذ', color: 'bg-blue-100 text-blue-800', icon: <FaLayerGroup /> },
      completed: { label: 'مكتملة', color: 'bg-green-100 text-green-800', icon: <FaCheckCircle /> },
      on_hold: { label: 'متوقفة', color: 'bg-yellow-100 text-yellow-800', icon: <FaExclamationTriangle /> }
    };
    return statusMap[status] || statusMap.not_started;
  };

  const calculatePhaseStats = () => {
    const total = projectPhases.length;
    const completed = projectPhases.filter(p => p.status === 'completed').length;
    const inProgress = projectPhases.filter(p => p.status === 'in_progress').length;
    const notStarted = projectPhases.filter(p => p.status === 'not_started').length;
    const onHold = projectPhases.filter(p => p.status === 'on_hold').length;
    
    return { total, completed, inProgress, notStarted, onHold };
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'مشروع غير محدد';
  };

  const stats = calculatePhaseStats();

  const columns = [
    {
      header: (
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleSort('order')}>
          اسم المرحلة
          {sortField === 'order' && (
            sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
          )}
        </div>
      ),
      accessor: 'name',
      render: (phase) => (
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <FaLayerGroup className="text-blue-600" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{phase.name}</div>
            <div className="text-sm text-gray-500">{phase.description}</div>
          </div>
        </div>
      )
    },
    {
      header: (
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleSort('projectId')}>
          المشروع
          {sortField === 'projectId' && (
            sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
          )}
        </div>
      ),
      render: (phase) => (
        <div className="flex items-center gap-2">
          <FaProjectDiagram className="text-gray-400" />
          <span className="font-medium">{getProjectName(phase.projectId)}</span>
        </div>
      )
    },
    {
      header: 'التواريخ',
      render: (phase) => (
        <div>
          <div className="text-sm">
            <div className="font-medium">البداية: {phase.startDate || 'غير محدد'}</div>
            <div className="text-gray-500">النهاية: {phase.endDate || 'غير محدد'}</div>
          </div>
        </div>
      )
    },
    {
      header: 'المدة',
      render: (phase) => (
        <div className="text-center">
          <div className="font-semibold text-gray-900">{phase.duration || 'غير محدد'}</div>
          <div className="text-sm text-gray-500">يوم</div>
        </div>
      )
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
      render: (phase) => {
        const statusInfo = getStatusInfo(phase.status);
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
      header: 'الترتيب',
      render: (phase) => (
        <div className="text-center">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-orange-100 text-orange-600 rounded-full font-bold">
            {phase.order || 1}
          </span>
        </div>
      )
    }
  ];

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPhases.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPhases.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">مراحل المشاريع</h1>
          <p className="text-gray-600 mt-1">إدارة وتتبع مراحل تنفيذ المشاريع</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2"
        >
          <FaPlus />
          مرحلة جديدة
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">إجمالي المراحل</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FaLayerGroup className="text-blue-600 text-2xl" />
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

        <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">قيد التنفيذ</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.inProgress}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <FaLayerGroup className="text-yellow-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-gray-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">لم تبدأ</p>
              <p className="text-3xl font-bold text-gray-600">{stats.notStarted}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <FaClock className="text-gray-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">متوقفة</p>
              <p className="text-3xl font-bold text-red-600">{stats.onHold}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <FaExclamationTriangle className="text-red-600 text-2xl" />
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
              placeholder="البحث في المراحل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <select 
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <option value="all">جميع المشاريع</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Phases Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">قائمة مراحل المشاريع</h3>
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
                عرض {indexOfFirstItem + 1} إلى {Math.min(indexOfLastItem, filteredPhases.length)} من {filteredPhases.length} مرحلة
              </div>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg ${
                      currentPage === page
                        ? 'bg-blue-500 text-white'
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

      {/* Add/Edit Phase Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingPhase ? 'تعديل المرحلة' : 'مرحلة جديدة'}
        size="lg"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleCloseModal}>
              إلغاء
            </Button>
            <Button onClick={handleSubmit}>
              {editingPhase ? 'تحديث' : 'إضافة'}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="اسم المرحلة"
              name="name"
              value={formData.name}
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">اختر المشروع</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="رقم الترتيب"
              name="order"
              type="number"
              value={formData.order}
              onChange={handleInputChange}
              min="1"
            />

            <Input
              label="المدة (بالأيام)"
              name="duration"
              type="number"
              value={formData.duration}
              onChange={handleInputChange}
              min="1"
            />

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

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                حالة المرحلة
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="not_started">لم تبدأ</option>
                <option value="in_progress">قيد التنفيذ</option>
                <option value="completed">مكتملة</option>
                <option value="on_hold">متوقفة</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وصف المرحلة
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="وصف تفصيلي للمرحلة..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المخرجات المطلوبة
              </label>
              <textarea
                name="deliverables"
                value={formData.deliverables}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="المخرجات والمخرجات المطلوبة من هذه المرحلة..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المراحل التابعة
              </label>
              <textarea
                name="dependencies"
                value={formData.dependencies}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="المراحل التي تعتمد على هذه المرحلة..."
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Phases;