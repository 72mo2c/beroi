// ======================================
// Project Resources Management Page - صفحة إدارة موارد المشروع
// ======================================

import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaSearch, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaTools,
  FaUserTie,
  FaCalendarAlt,
  FaProjectDiagram,
  FaUsers,
  FaLaptop,
  FaDollarSign,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaDownload,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaHardHat,
  FaWrench
} from 'react-icons/fa';
import Table from '../../components/Common/Table';
import Modal from '../../components/Common/Modal';
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';
import { useData } from '../../context/DataContext';

const Resources = () => {
  const { projectResources = [], projects = [], updateData } = useData();
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [formData, setFormData] = useState({
    name: '',
    type: 'human',
    category: '',
    projectId: '',
    description: '',
    quantity: 1,
    unit: 'piece',
    cost: '',
    availableFrom: '',
    availableTo: '',
    assignedTo: '',
    status: 'available',
    location: '',
    specifications: '',
    notes: ''
  });

  useEffect(() => {
    let filtered = projectResources.filter(resource => 
      resource.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedProject !== 'all') {
      filtered = filtered.filter(resource => resource.projectId === selectedProject);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource.type === selectedType);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(resource => resource.status === selectedStatus);
    }

    // Sort resources
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

    setFilteredResources(filtered);
    setCurrentPage(1);
  }, [projectResources, projects, searchTerm, selectedProject, selectedType, selectedStatus, sortField, sortDirection]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingResource) {
      const updatedResources = projectResources.map(resource =>
        resource.id === editingResource.id 
          ? { ...formData, id: editingResource.id, lastModified: new Date().toISOString() }
          : resource
      );
      updateData('projectResources', updatedResources);
    } else {
      const newResource = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };
      updateData('projectResources', [...projectResources, newResource]);
    }

    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingResource(null);
    setFormData({
      name: '',
      type: 'human',
      category: '',
      projectId: '',
      description: '',
      quantity: 1,
      unit: 'piece',
      cost: '',
      availableFrom: '',
      availableTo: '',
      assignedTo: '',
      status: 'available',
      location: '',
      specifications: '',
      notes: ''
    });
  };

  const handleEdit = (resource) => {
    setEditingResource(resource);
    setFormData({
      name: resource.name || '',
      type: resource.type || 'human',
      category: resource.category || '',
      projectId: resource.projectId || '',
      description: resource.description || '',
      quantity: resource.quantity || 1,
      unit: resource.unit || 'piece',
      cost: resource.cost || '',
      availableFrom: resource.availableFrom || '',
      availableTo: resource.availableTo || '',
      assignedTo: resource.assignedTo || '',
      status: resource.status || 'available',
      location: resource.location || '',
      specifications: resource.specifications || '',
      notes: resource.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (resource) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المورد؟')) {
      const updatedResources = projectResources.filter(r => r.id !== resource.id);
      updateData('projectResources', updatedResources);
    }
  };

  const handleView = (resource) => {
    console.log('View resource:', resource);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getTypeInfo = (type) => {
    const typeMap = {
      human: { label: 'موارد بشرية', icon: <FaUserTie />, color: 'bg-blue-100 text-blue-800' },
      equipment: { label: 'معدات', icon: <FaWrench />, color: 'bg-orange-100 text-orange-800' },
      material: { label: 'مواد', icon: <FaHardHat />, color: 'bg-green-100 text-green-800' },
      financial: { label: 'مالية', icon: <FaDollarSign />, color: 'bg-yellow-100 text-yellow-800' },
      technology: { label: 'تقنية', icon: <FaLaptop />, color: 'bg-purple-100 text-purple-800' }
    };
    return typeMap[type] || typeMap.human;
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      available: { label: 'متاح', color: 'bg-green-100 text-green-800', icon: <FaCheckCircle /> },
      assigned: { label: 'مخصص', color: 'bg-blue-100 text-blue-800', icon: <FaUsers /> },
      unavailable: { label: 'غير متاح', color: 'bg-red-100 text-red-800', icon: <FaExclamationTriangle /> },
      maintenance: { label: 'صيانة', color: 'bg-yellow-100 text-yellow-800', icon: <FaWrench /> }
    };
    return statusMap[status] || statusMap.available;
  };

  const calculateResourceStats = () => {
    const total = projectResources.length;
    const human = projectResources.filter(r => r.type === 'human').length;
    const equipment = projectResources.filter(r => r.type === 'equipment').length;
    const material = projectResources.filter(r => r.type === 'material').length;
    const financial = projectResources.filter(r => r.type === 'financial').length;
    const totalCost = projectResources.reduce((sum, r) => sum + (parseFloat(r.cost) || 0), 0);
    
    return { total, human, equipment, material, financial, totalCost };
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'مشروع غير محدد';
  };

  const getUniqueCategories = () => {
    const categories = [...new Set(projectResources.map(resource => resource.category).filter(Boolean))];
    return categories.sort();
  };

  const getTypeCategories = (type) => {
    const categoryMap = {
      human: ['مطور', 'مصمم', 'مدير', 'محاسب', 'مهندس', 'منسق'],
      equipment: ['أدوات بناء', 'معدات تصوير', 'أجهزة قياس', 'معدات نقل'],
      material: ['خشب', 'حديد', 'أسمنت', 'طلاء', 'كابلات'],
      financial: ['ميزانية', 'ائتمان', 'استثمار', 'تمويل'],
      technology: ['برامج', 'أجهزة كمبيوتر', 'خوادم', 'شبكات']
    };
    return categoryMap[type] || [];
  };

  const stats = calculateResourceStats();

  const columns = [
    {
      header: (
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleSort('name')}>
          اسم المورد
          {sortField === 'name' && (
            sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />
          )}
        </div>
      ),
      accessor: 'name',
      render: (resource) => {
        const typeInfo = getTypeInfo(resource.type);
        return (
          <div className="flex items-center gap-3">
            <div className="bg-teal-100 p-2 rounded-lg">
              <FaTools className="text-teal-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">{resource.name}</div>
              <div className="text-sm text-gray-500">{resource.description}</div>
            </div>
          </div>
        );
      }
    },
    {
      header: 'النوع',
      render: (resource) => {
        const typeInfo = getTypeInfo(resource.type);
        return (
          <div className="flex items-center gap-2">
            {typeInfo.icon}
            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${typeInfo.color}`}>
              {typeInfo.label}
            </span>
          </div>
        );
      }
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
      render: (resource) => (
        <div className="flex items-center gap-2">
          <FaProjectDiagram className="text-gray-400" />
          <span className="font-medium">{getProjectName(resource.projectId)}</span>
        </div>
      )
    },
    {
      header: 'الكمية',
      render: (resource) => (
        <div className="text-center">
          <div className="font-semibold text-gray-900">
            {resource.quantity || 1} {resource.unit || ''}
          </div>
          {resource.category && (
            <div className="text-sm text-gray-500">{resource.category}</div>
          )}
        </div>
      )
    },
    {
      header: 'التكلفة',
      render: (resource) => (
        <div className="text-center">
          <div className="font-semibold text-green-600">
            {parseFloat(resource.cost || 0).toLocaleString()} جنيه
          </div>
        </div>
      )
    },
    {
      header: 'المسؤول',
      render: (resource) => (
        <div className="flex items-center gap-2">
          <FaUserTie className="text-gray-400" />
          <span className="font-medium">{resource.assignedTo || 'غير محدد'}</span>
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
      render: (resource) => {
        const statusInfo = getStatusInfo(resource.status);
        return (
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
            {statusInfo.icon}
            {statusInfo.label}
          </span>
        );
      }
    }
  ];

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredResources.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const exportToCSV = () => {
    const headers = ['اسم المورد', 'النوع', 'المشروع', 'الكمية', 'الوحدة', 'الفئة', 'التكلفة', 'المسؤول', 'الحالة', 'الموقع'];
    const csvData = filteredResources.map(resource => [
      resource.name || '',
      getTypeInfo(resource.type).label,
      getProjectName(resource.projectId),
      resource.quantity || '1',
      resource.unit || '',
      resource.category || '',
      resource.cost || '0',
      resource.assignedTo || '',
      getStatusInfo(resource.status).label,
      resource.location || ''
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `project_resources_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">موارد المشاريع</h1>
          <p className="text-gray-600 mt-1">إدارة موارد ومعدات المشاريع</p>
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
            مورد جديد
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">إجمالي الموارد</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-teal-100 p-3 rounded-lg">
              <FaTools className="text-teal-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">موارد بشرية</p>
              <p className="text-3xl font-bold text-blue-600">{stats.human}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FaUserTie className="text-blue-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">معدات</p>
              <p className="text-3xl font-bold text-orange-600">{stats.equipment}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <FaWrench className="text-orange-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">مواد</p>
              <p className="text-3xl font-bold text-green-600">{stats.material}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FaHardHat className="text-green-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">موارد مالية</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.financial}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <FaDollarSign className="text-yellow-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">إجمالي التكلفة</p>
              <p className="text-3xl font-bold text-purple-600">{stats.totalCost.toLocaleString()}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <FaDollarSign className="text-purple-600 text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <Input
              type="text"
              placeholder="البحث في الموارد..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">جميع الأنواع</option>
            <option value="human">موارد بشرية</option>
            <option value="equipment">معدات</option>
            <option value="material">مواد</option>
            <option value="financial">مالية</option>
            <option value="technology">تقنية</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">جميع الحالات</option>
            <option value="available">متاح</option>
            <option value="assigned">مخصص</option>
            <option value="unavailable">غير متاح</option>
            <option value="maintenance">صيانة</option>
          </select>
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            value={formData.category}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setFormData(prev => ({ ...prev, category: '' }));
            }}
          >
            <option value="all">جميع الفئات</option>
            {getUniqueCategories().map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Resources Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">قائمة موارد المشاريع</h3>
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
                عرض {indexOfFirstItem + 1} إلى {Math.min(indexOfLastItem, filteredResources.length)} من {filteredResources.length} مورد
              </div>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg ${
                      currentPage === page
                        ? 'bg-teal-500 text-white'
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

      {/* Add/Edit Resource Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingResource ? 'تعديل المورد' : 'مورد جديد'}
        size="xl"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleCloseModal}>
              إلغاء
            </Button>
            <Button onClick={handleSubmit}>
              {editingResource ? 'تحديث' : 'إضافة'}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="اسم المورد"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع المورد
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={(e) => {
                  handleInputChange(e);
                  setFormData(prev => ({ ...prev, category: '' }));
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="human">موارد بشرية</option>
                <option value="equipment">معدات</option>
                <option value="material">مواد</option>
                <option value="financial">مالية</option>
                <option value="technology">تقنية</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الفئة
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">اختر الفئة</option>
                {getTypeCategories(formData.type).map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المشروع
              </label>
              <select
                name="projectId"
                value={formData.projectId}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
              label="الكمية"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleInputChange}
              min="1"
              required
            />

            <Input
              label="الوحدة"
              name="unit"
              value={formData.unit}
              onChange={handleInputChange}
              placeholder="قطعة، ساعة، يوم، متر..."
            />

            <Input
              label="التكلفة"
              name="cost"
              type="number"
              value={formData.cost}
              onChange={handleInputChange}
              step="0.01"
              placeholder="0.00"
            />

            <Input
              label="المسؤول عن المورد"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleInputChange}
              placeholder="اسم الشخص المسؤول"
            />

            <Input
              label="متاح من"
              name="availableFrom"
              type="date"
              value={formData.availableFrom}
              onChange={handleInputChange}
            />

            <Input
              label="متاح إلى"
              name="availableTo"
              type="date"
              value={formData.availableTo}
              onChange={handleInputChange}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                حالة المورد
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="available">متاح</option>
                <option value="assigned">مخصص</option>
                <option value="unavailable">غير متاح</option>
                <option value="maintenance">صيانة</option>
              </select>
            </div>

            <Input
              label="الموقع"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="الموقع الحالي للمورد"
            />

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وصف المورد
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="وصف تفصيلي للمورد..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المواصفات التقنية
              </label>
              <textarea
                name="specifications"
                value={formData.specifications}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="المواصفات التقنية أو التفاصيل الإضافية..."
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
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="ملاحظات أو تعليمات إضافية..."
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Resources;