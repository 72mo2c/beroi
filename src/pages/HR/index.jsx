// ======================================
// HR Module - وحدة الموارد البشرية
// ======================================

import React from 'react';
import { useTab } from '../../contexts/TabContext';
import { useData } from '../../context/DataContext';
import Card from '../../components/Common/Card';
import { FaUsers, FaBriefcase, FaUserTie, FaClock, FaCalendarAlt, FaChartLine } from 'react-icons/fa';

const HRIndex = () => {
  const { addTab } = useTab();
  const { employees, departments, attendance, leaveRequests } = useData();

  const handleModuleClick = (path, title, icon) => {
    addTab({
      id: `hr-${Date.now()}`,
      title: title,
      path: path,
      icon: icon,
      closeable: true
    });
  };

  const hrModules = [
    {
      title: 'إدارة الأقسام',
      description: 'إدارة أقسام الشركة وتنظيم الهيكل التنظيمي',
      icon: <FaUsers className="text-3xl text-blue-600" />,
      link: '/hr/departments',
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
    },
    {
      title: 'إدارة المناصب',
      description: 'إدارة المناصب والوظائف في الشركة',
      icon: <FaBriefcase className="text-3xl text-green-600" />,
      link: '/hr/positions',
      color: 'bg-green-50 border-green-200 hover:bg-green-100'
    },
    {
      title: 'إدارة الموظفين',
      description: 'إدارة بيانات الموظفين الشخصية والمهنية',
      icon: <FaUserTie className="text-3xl text-purple-600" />,
      link: '/hr/employees',
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
    },
    {
      title: 'الحضور والانصراف',
      description: 'تسجيل ومتابعة حضور وانصراف الموظفين',
      icon: <FaClock className="text-3xl text-orange-600" />,
      link: '/hr/attendance',
      color: 'bg-orange-50 border-orange-200 hover:bg-orange-100'
    },
    {
      title: 'طلبات الإجازات',
      description: 'إدارة طلبات الإجازات والموافقات',
      icon: <FaCalendarAlt className="text-3xl text-red-600" />,
      link: '/hr/leave-requests',
      color: 'bg-red-50 border-red-200 hover:bg-red-100'
    },
    {
      title: 'تقييمات الأداء',
      description: 'تقييم ومتابعة أداء الموظفين',
      icon: <FaChartLine className="text-3xl text-indigo-600" />,
      link: '/hr/performance',
      color: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">وحدة الموارد البشرية</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          إدارة شاملة للموارد البشرية تشمل إدارة الموظفين والأقسام والحضور والإجازات وتقييمات الأداء
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hrModules.map((module, index) => (
          <div 
            key={index} 
            onClick={() => handleModuleClick(module.link, module.title, module.icon)}
            className="cursor-pointer"
          >
            <Card className={`${module.color} transition-all duration-300 hover:shadow-lg hover:scale-105 border-2`}>
              <div className="text-center p-6">
                <div className="flex justify-center mb-4">
                  {module.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{module.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{module.description}</p>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <Card className="bg-blue-50 border-blue-200">
          <div className="text-center p-4">
            <FaUsers className="text-3xl text-blue-600 mx-auto mb-2" />
            <h4 className="font-bold text-blue-800">إجمالي الموظفين</h4>
            <p className="text-2xl font-bold text-blue-600">{employees.filter(e => e.status === 'active').length}</p>
          </div>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <div className="text-center p-4">
            <FaBriefcase className="text-3xl text-green-600 mx-auto mb-2" />
            <h4 className="font-bold text-green-800">الأقسام النشطة</h4>
            <p className="text-2xl font-bold text-green-600">{departments.filter(d => d.status === 'active').length}</p>
          </div>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <div className="text-center p-4">
            <FaClock className="text-3xl text-orange-600 mx-auto mb-2" />
            <h4 className="font-bold text-orange-800">الحضور اليوم</h4>
            <p className="text-2xl font-bold text-orange-600">
              {(() => {
                const today = new Date().toISOString().split('T')[0];
                return attendance.filter(a => a.date === today && a.status === 'present').length;
              })()}
            </p>
          </div>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <div className="text-center p-4">
            <FaCalendarAlt className="text-3xl text-red-600 mx-auto mb-2" />
            <h4 className="font-bold text-red-800">طلبات الإجازة</h4>
            <p className="text-2xl font-bold text-red-600">{leaveRequests.filter(r => r.status === 'pending').length}</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HRIndex;