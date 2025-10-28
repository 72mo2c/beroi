// ======================================
// Project Dashboard Page - صفحة لوحة تحكم المشاريع
// ======================================

import React, { useState, useEffect } from 'react';
import { 
  FaProjectDiagram,
  FaTasks,
  FaClock,
  FaUsers,
  FaDollarSign,
  FaCalendarAlt,
  FaChartLine,
  FaChartBar,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTrendingUp,
  FaTrendingDown,
  FaDownload,
  FaFilter,
  FaEye,
  FaPlay,
  FaPause,
  FaStop
} from 'react-icons/fa';
import { useData } from '../../context/DataContext';

const ProjectDashboard = () => {
  const { 
    projects = [], 
    projectPhases = [], 
    projectTasks = [], 
    timeTrackingRecords = [],
    projectResources = []
  } = useData();

  const [selectedProject, setSelectedProject] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [viewMode, setViewMode] = useState('overview');

  // حساب إحصائيات المشاريع
  const calculateProjectStats = () => {
    const total = projects.length;
    const completed = projects.filter(p => p.status === 'completed').length;
    const inProgress = projects.filter(p => p.status === 'in_progress').length;
    const planning = projects.filter(p => p.status === 'planning').length;
    const onHold = projects.filter(p => p.status === 'on_hold').length;
    
    const totalBudget = projects.reduce((sum, p) => sum + (parseFloat(p.budget) || 0), 0);
    const completedBudget = projects
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + (parseFloat(p.budget) || 0), 0);
    
    const avgProgress = total > 0 
      ? projects.reduce((sum, p) => sum + (parseFloat(p.progress) || 0), 0) / total 
      : 0;

    return {
      total,
      completed,
      inProgress,
      planning,
      onHold,
      totalBudget,
      completedBudget,
      avgProgress,
      completionRate: total > 0 ? (completed / total) * 100 : 0
    };
  };

  // حساب إحصائيات المهام
  const calculateTaskStats = () => {
    const total = projectTasks.length;
    const completed = projectTasks.filter(t => t.status === 'completed').length;
    const inProgress = projectTasks.filter(t => t.status === 'in_progress').length;
    const todo = projectTasks.filter(t => t.status === 'todo').length;
    const review = projectTasks.filter(t => t.status === 'review').length;
    
    const totalEstimatedHours = projectTasks.reduce((sum, t) => sum + (parseFloat(t.estimatedHours) || 0), 0);
    const totalActualHours = projectTasks.reduce((sum, t) => sum + (parseFloat(t.actualHours) || 0), 0);
    
    return {
      total,
      completed,
      inProgress,
      todo,
      review,
      totalEstimatedHours,
      totalActualHours,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      timeEfficiency: totalEstimatedHours > 0 ? (totalActualHours / totalEstimatedHours) * 100 : 0
    };
  };

  // حساب إحصائيات الوقت
  const calculateTimeStats = () => {
    const total = timeTrackingRecords.length;
    const totalHours = timeTrackingRecords.reduce((sum, r) => sum + (parseFloat(r.duration) || 0), 0);
    const billableHours = timeTrackingRecords.filter(r => r.billable).reduce((sum, r) => sum + (parseFloat(r.duration) || 0), 0);
    const totalAmount = timeTrackingRecords.reduce((sum, r) => sum + (parseFloat(r.totalAmount) || 0), 0);
    
    return {
      total,
      totalHours,
      billableHours,
      totalAmount,
      billableRate: totalHours > 0 ? (billableHours / totalHours) * 100 : 0,
      avgHourlyRate: totalHours > 0 ? totalAmount / totalHours : 0
    };
  };

  // حساب إحصائيات الموارد
  const calculateResourceStats = () => {
    const total = projectResources.length;
    const human = projectResources.filter(r => r.type === 'human').length;
    const equipment = projectResources.filter(r => r.type === 'equipment').length;
    const material = projectResources.filter(r => r.type === 'material').length;
    const financial = projectResources.filter(r => r.type === 'financial').length;
    const totalCost = projectResources.reduce((sum, r) => sum + (parseFloat(r.cost) || 0), 0);
    
    const available = projectResources.filter(r => r.status === 'available').length;
    const assigned = projectResources.filter(r => r.status === 'assigned').length;
    
    return {
      total,
      human,
      equipment,
      material,
      financial,
      totalCost,
      available,
      assigned,
      utilizationRate: total > 0 ? (assigned / total) * 100 : 0
    };
  };

  const projectStats = calculateProjectStats();
  const taskStats = calculateTaskStats();
  const timeStats = calculateTimeStats();
  const resourceStats = calculateResourceStats();

  // الحصول على المشاريع الحديثة
  const getRecentProjects = () => {
    return projects
      .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
      .slice(0, 5);
  };

  // الحصول على المهام العاجلة
  const getUrgentTasks = () => {
    return projectTasks
      .filter(t => t.priority === 'urgent' && t.status !== 'completed')
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);
  };

  // الحصول على أفضل المشاريع أداءً
  const getTopPerformingProjects = () => {
    return projects
      .filter(p => p.status === 'completed')
      .sort((a, b) => (b.progress || 0) - (a.progress || 0))
      .slice(0, 3);
  };

  // عرض الإحصائيات في شكل بطاقات
  const StatCard = ({ title, value, icon, color, subtitle, trend }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border-r-4" style={{ borderColor: color }}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-3xl font-bold text-gray-900" style={{ color }}>{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend.direction === 'up' ? (
                <FaTrendingUp className="text-green-500" />
              ) : (
                <FaTrendingDown className="text-red-500" />
              )}
              <span className={`text-sm ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trend.value}
              </span>
            </div>
          )}
        </div>
        <div className="bg-opacity-20 p-3 rounded-lg" style={{ backgroundColor: color + '20' }}>
          <div className="text-2xl" style={{ color }}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );

  // مكون Progress Ring
  const ProgressRing = ({ progress, size = 120, strokeWidth = 8, color = '#3B82F6' }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-in-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{Math.round(progress)}%</span>
        </div>
      </div>
    );
  };

  // مكون Timeline للمشاريع
  const ProjectTimeline = ({ projects }) => (
    <div className="space-y-4">
      {projects.slice(0, 5).map((project, index) => {
        const statusColors = {
          planning: 'bg-blue-500',
          in_progress: 'bg-yellow-500',
          completed: 'bg-green-500',
          on_hold: 'bg-red-500',
          cancelled: 'bg-gray-500'
        };
        
        return (
          <div key={project.id} className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-4 h-4 rounded-full ${statusColors[project.status] || 'bg-gray-500'}`}></div>
              {index < 4 && <div className="w-0.5 h-8 bg-gray-200 mt-2"></div>}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">{project.name}</h4>
                <span className="text-sm text-gray-500">{project.progress || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className={`h-2 rounded-full ${statusColors[project.status] || 'bg-gray-500'}`}
                  style={{ width: `${project.progress || 0}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">{project.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">لوحة تحكم المشاريع</h1>
          <p className="text-gray-600 mt-1">نظرة شاملة على أداء ومتابعة المشاريع</p>
        </div>
        <div className="flex gap-3">
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
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="all">جميع الفترات</option>
            <option value="week">هذا الأسبوع</option>
            <option value="month">هذا الشهر</option>
            <option value="quarter">هذا الربع</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="إجمالي المشاريع"
          value={projectStats.total}
          icon={<FaProjectDiagram />}
          color="#3B82F6"
          subtitle={`${projectStats.completed} مكتملة`}
          trend={{ direction: 'up', value: '+12%' }}
        />
        <StatCard
          title="معدل الإنجاز"
          value={`${Math.round(projectStats.completionRate)}%`}
          icon={<FaCheckCircle />}
          color="#10B981"
          subtitle={`متوسط التقدم: ${Math.round(projectStats.avgProgress)}%`}
          trend={{ direction: 'up', value: '+5.2%' }}
        />
        <StatCard
          title="ساعات العمل"
          value={Math.round(timeStats.totalHours)}
          icon={<FaClock />}
          color="#F59E0B"
          subtitle={`${Math.round(timeStats.billableHours)} ساعة فوترة`}
          trend={{ direction: 'down', value: '-2.1%' }}
        />
        <StatCard
          title="إجمالي التكلفة"
          value={`${projectStats.totalBudget.toLocaleString()}`}
          icon={<FaDollarSign />}
          color="#8B5CF6"
          subtitle="جنيه مصري"
          trend={{ direction: 'up', value: '+8.7%' }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* حالة المشاريع */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">حالة المشاريع</h3>
            <FaChartBar className="text-gray-400" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <ProgressRing progress={projectStats.completionRate} color="#10B981" />
              <p className="text-sm text-gray-600 mt-2">معدل الإنجاز</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">مكتملة</span>
                <span className="font-semibold text-green-600">{projectStats.completed}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">قيد التنفيذ</span>
                <span className="font-semibold text-blue-600">{projectStats.inProgress}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">قيد التخطيط</span>
                <span className="font-semibold text-yellow-600">{projectStats.planning}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">متوقفة</span>
                <span className="font-semibold text-red-600">{projectStats.onHold}</span>
              </div>
            </div>
          </div>
        </div>

        {/* حالة المهام */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">حالة المهام</h3>
            <FaTasks className="text-gray-400" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <ProgressRing progress={taskStats.completionRate} color="#3B82F6" />
              <p className="text-sm text-gray-600 mt-2">إنجاز المهام</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">مكتملة</span>
                <span className="font-semibold text-green-600">{taskStats.completed}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">قيد التنفيذ</span>
                <span className="font-semibold text-blue-600">{taskStats.inProgress}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">للمتابعة</span>
                <span className="font-semibold text-gray-600">{taskStats.todo}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">قيد المراجعة</span>
                <span className="font-semibold text-yellow-600">{taskStats.review}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities & Urgent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* المشاريع الحديثة */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">المشاريع الحديثة</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              عرض الكل
            </button>
          </div>
          <ProjectTimeline projects={getRecentProjects()} />
        </div>

        {/* المهام العاجلة */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">المهام العاجلة</h3>
            <FaExclamationTriangle className="text-red-500" />
          </div>
          <div className="space-y-4">
            {getUrgentTasks().map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FaExclamationTriangle className="text-red-500" />
                  <div>
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    <p className="text-sm text-gray-600">الإنجاز: {task.dueDate}</p>
                  </div>
                </div>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                  عاجل
                </span>
              </div>
            ))}
            {getUrgentTasks().length === 0 && (
              <p className="text-center text-gray-500 py-8">لا توجد مهام عاجلة</p>
            )}
          </div>
        </div>
      </div>

      {/* Resource Utilization & Time Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* استخدام الموارد */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">استخدام الموارد</h3>
            <FaUsers className="text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">موارد بشرية</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(resourceStats.human / resourceStats.total) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{resourceStats.human}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">معدات</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full" 
                    style={{ width: `${(resourceStats.equipment / resourceStats.total) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{resourceStats.equipment}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">مواد</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(resourceStats.material / resourceStats.total) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{resourceStats.material}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">مالية</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${(resourceStats.financial / resourceStats.total) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{resourceStats.financial}</span>
              </div>
            </div>
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">معدل الاستخدام</span>
                <span className="text-lg font-bold text-blue-600">
                  {Math.round(resourceStats.utilizationRate)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* تحليل الوقت */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">تحليل الوقت</h3>
            <FaClock className="text-gray-400" />
          </div>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {Math.round(timeStats.totalHours)} ساعة
              </div>
              <p className="text-sm text-gray-600">إجمالي ساعات العمل</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">
                  {Math.round(timeStats.billableHours)}
                </div>
                <p className="text-xs text-gray-600">ساعات فوترة</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">
                  {Math.round(timeStats.avgHourlyRate)}
                </div>
                <p className="text-xs text-gray-600">متوسط سعر الساعة</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">معدل الفوترة</span>
                <span className="text-sm font-medium">{Math.round(timeStats.billableRate)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${timeStats.billableRate}%` }}
                ></div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">إجمالي المبلغ</span>
                <span className="text-lg font-bold text-green-600">
                  {Math.round(timeStats.totalAmount).toLocaleString()} جنيه
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Projects */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">أفضل المشاريع أداءً</h3>
          <FaTrophy className="text-yellow-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {getTopPerformingProjects().map((project, index) => (
            <div key={project.id} className="relative">
              {index === 0 && (
                <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  1
                </div>
              )}
              {index === 1 && (
                <div className="absolute -top-2 -right-2 bg-gray-400 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  2
                </div>
              )}
              {index === 2 && (
                <div className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  3
                </div>
              )}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">{project.name}</h4>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">نسبة الإنجاز</span>
                  <span className="font-bold text-blue-600">{project.progress || 0}%</span>
                </div>
                <div className="w-full bg-white rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${project.progress || 0}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">{project.description}</p>
              </div>
            </div>
          ))}
          {getTopPerformingProjects().length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-8">
              لا توجد مشاريع مكتملة بعد
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;