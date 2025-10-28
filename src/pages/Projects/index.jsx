// ======================================
// Projects Management - إدارة المشاريع
// ======================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaProjectDiagram, 
  FaTasks, 
  FaLayerGroup, 
  FaClock, 
  FaTools, 
  FaChartLine,
  FaPlus,
  FaArrowLeft
} from 'react-icons/fa';
import Button from '../../components/Common/Button';

const Projects = () => {
  const navigate = useNavigate();

  const projectModules = [
    {
      title: 'إدارة المشاريع',
      description: 'إنشاء ومتابعة جميع مشاريع المؤسسة',
      icon: <FaProjectDiagram />,
      gradient: 'from-blue-400 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      path: '/projects/manage',
      stats: {
        label: 'إدارة المشاريع',
        value: 'قائمة',
        subLabel: 'مشاريع المؤسسة'
      },
      features: [
        'إنشاء مشاريع جديدة',
        'تتبع حالة المشاريع',
        'إدارة الميزانيات',
        'تقارير المشاريع'
      ]
    },
    {
      title: 'مراحل المشروع',
      description: 'تقسيم المشاريع إلى مراحل قابلة للإدارة',
      icon: <FaLayerGroup />,
      gradient: 'from-green-400 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
      path: '/projects/phases',
      stats: {
        label: 'إدارة المراحل',
        value: 'مراحل',
        subLabel: 'مراحل المشروع'
      },
      features: [
        'إنشاء مراحل جديدة',
        'ترتيب المراحل',
        'تتبع إنجاز المراحل',
        'ربط المراحل بالمشاريع'
      ]
    },
    {
      title: 'المهام',
      description: 'توزيع ومتابعة المهام على أعضاء الفريق',
      icon: <FaTasks />,
      gradient: 'from-purple-400 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      path: '/projects/tasks',
      stats: {
        label: 'إدارة المهام',
        value: 'مهام',
        subLabel: 'مهام المشروع'
      },
      features: [
        'إنشاء المهام',
        'توزيع المهام',
        'تتبع التقدم',
        'إدارة الأولويات'
      ]
    },
    {
      title: 'تتبع الوقت',
      description: 'تسجيل وتتبع أوقات العمل على المشاريع',
      icon: <FaClock />,
      gradient: 'from-yellow-400 to-yellow-600',
      bgGradient: 'from-yellow-50 to-yellow-100',
      path: '/projects/time-tracking',
      stats: {
        label: 'تتبع الوقت',
        value: 'ساعات',
        subLabel: 'ساعات العمل'
      },
      features: [
        'تسجيل ساعات العمل',
        'مؤقت العمل',
        'تقارير الوقت',
        'فوترة المشاريع'
      ]
    },
    {
      title: 'موارد المشروع',
      description: 'إدارة الموارد البشرية والمعدات والمواد',
      icon: <FaTools />,
      gradient: 'from-orange-400 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100',
      path: '/projects/resources',
      stats: {
        label: 'إدارة الموارد',
        value: 'موارد',
        subLabel: 'موارد المشروع'
      },
      features: [
        'إدارة الموارد البشرية',
        'تتبع المعدات',
        'إدارة المواد',
        'تكاليف الموارد'
      ]
    },
    {
      title: 'لوحة التحكم',
      description: 'نظرة شاملة على أداء ومتابعة جميع المشاريع',
      icon: <FaChartLine />,
      gradient: 'from-indigo-400 to-indigo-600',
      bgGradient: 'from-indigo-50 to-indigo-100',
      path: '/projects/dashboard',
      stats: {
        label: 'لوحة التحكم',
        value: 'تحكم',
        subLabel: 'تحكم شامل'
      },
      features: [
        'إحصائيات المشاريع',
        'رسوم بيانية',
        'تقارير الأداء',
        'متابعة التقدم'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
          وحدة إدارة المشاريع
        </h1>
        <p className="text-gray-600 mt-3 text-xl">
          نظام متكامل لإدارة ومتابعة جميع مراحل وأنشطة المشاريع
        </p>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-xl">
              <FaPlus className="text-2xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold">ابدأ مشروعاً جديداً</h3>
              <p className="text-blue-100">أنشئ مشروعاً جديداً وابدأ في تنظيم المهام والموارد</p>
            </div>
          </div>
          <Button 
            variant="secondary"
            onClick={() => navigate('/projects/manage')}
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            <FaPlus className="ml-2" />
            مشروع جديد
            <FaArrowLeft className="mr-2" />
          </Button>
        </div>
      </div>

      {/* Project Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectModules.map((module, index) => (
          <div
            key={index}
            onClick={() => navigate(module.path)}
            className="group cursor-pointer"
          >
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-gray-200 h-full flex flex-col">
              {/* Header with Gradient */}
              <div className={`bg-gradient-to-r ${module.gradient} p-6 text-white relative overflow-hidden`}>
                <div className="absolute top-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mt-16"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mb-12"></div>
                
                <div className="relative flex items-center justify-between mb-4">
                  <div className="text-5xl opacity-90">
                    {module.icon}
                  </div>
                  <FaArrowLeft className="text-xl opacity-0 group-hover:opacity-100 group-hover:-translate-x-2 transition-all" />
                </div>
                
                <h3 className="text-2xl font-bold mb-2">{module.title}</h3>
                <p className="text-sm opacity-90">{module.description}</p>
              </div>

              {/* Stats Section */}
              <div className={`bg-gradient-to-br ${module.bgGradient} p-4 border-b-2 border-gray-100`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">{module.stats.label}</p>
                    <p className="text-3xl font-bold bg-gradient-to-r ${module.gradient} bg-clip-text text-transparent">
                      {module.stats.value}
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500">{module.stats.subLabel}</p>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="p-5 flex-1 bg-gray-50">
                <p className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">المميزات الرئيسية:</p>
                <ul className="space-y-2">
                  {module.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className={`bg-gradient-to-br ${module.gradient} w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0`}></span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer */}
              <div className={`bg-gradient-to-r ${module.gradient} h-1.5`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">نظرة سريعة</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <FaProjectDiagram className="text-blue-600 text-3xl mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">إدارة شاملة</h4>
            <p className="text-sm text-gray-600">متابعة كاملة لجميع مراحل المشروع من البداية إلى النهاية</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <FaTasks className="text-green-600 text-3xl mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">تنظيم المهام</h4>
            <p className="text-sm text-gray-600">توزيع المهام على الفريق مع تتبع التقدم والإنجاز</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <FaChartLine className="text-purple-600 text-3xl mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900">تقارير وإحصائيات</h4>
            <p className="text-sm text-gray-600">رسوم بيانية وتقارير مفصلة لمتابعة الأداء</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;