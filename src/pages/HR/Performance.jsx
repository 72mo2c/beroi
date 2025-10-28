// ======================================
// إدارة تقييمات الأداء - Performance Reviews Management
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
import { FaChartLine, FaExclamationTriangle, FaPlus, FaEdit, FaTrash, FaSearch, FaEye, FaStar } from 'react-icons/fa';

const Performance = () => {
  const { performanceReviews, employees, addPerformanceReview, updatePerformanceReview, deletePerformanceReview } = useData();
  const { showSuccess, showError } = useNotification();
  const { settings } = useSystemSettings();
  const { hasPermission } = useAuth();

  // فحص الصلاحيات
  const canEditPerformance = hasPermission('edit_performance');
  const canDeletePerformance = hasPermission('delete_performance');
  const canManagePerformance = hasPermission('manage_performance');

  const [editModal, setEditModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEmployee, setFilterEmployee] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('');
  const [formData, setFormData] = useState({
    employeeId: '',
    reviewPeriod: '',
    reviewDate: new Date().toISOString().split('T')[0],
    reviewer: '',
    overallRating: '',
    jobKnowledge: '',
    workQuality: '',
    productivity: '',
    communication: '',
    teamwork: '',
    leadership: '',
    initiative: '',
    strengths: '',
    areasForImprovement: '',
    goals: '',
    comments: '',
    recommendations: ''
  });

  const handleEdit = (review) => {
    if (!canEditPerformance) {
      showError('ليس لديك صلاحية لتعديل تقييمات الأداء');
      return;
    }
    setSelectedReview(review);
    setFormData({
      employeeId: review.employeeId || '',
      reviewPeriod: review.reviewPeriod || '',
      reviewDate: review.reviewDate || new Date().toISOString().split('T')[0],
      reviewer: review.reviewer || '',
      overallRating: review.overallRating || '',
      jobKnowledge: review.jobKnowledge || '',
      workQuality: review.workQuality || '',
      productivity: review.productivity || '',
      communication: review.communication || '',
      teamwork: review.teamwork || '',
      leadership: review.leadership || '',
      initiative: review.initiative || '',
      strengths: review.strengths || '',
      areasForImprovement: review.areasForImprovement || '',
      goals: review.goals || '',
      comments: review.comments || '',
      recommendations: review.recommendations || ''
    });
    setEditModal(true);
  };

  const handleView = (review) => {
    setSelectedReview(review);
    setViewModal(true);
  };

  const handleAdd = () => {
    if (!canEditPerformance) {
      showError('ليس لديك صلاحية لإضافة تقييمات أداء جديدة');
      return;
    }
    setSelectedReview(null);
    setFormData({
      employeeId: '',
      reviewPeriod: '',
      reviewDate: new Date().toISOString().split('T')[0],
      reviewer: '',
      overallRating: '',
      jobKnowledge: '',
      workQuality: '',
      productivity: '',
      communication: '',
      teamwork: '',
      leadership: '',
      initiative: '',
      strengths: '',
      areasForImprovement: '',
      goals: '',
      comments: '',
      recommendations: ''
    });
    setEditModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!canEditPerformance) {
      showError('ليس لديك صلاحية لحفظ تقييمات الأداء');
      return;
    }

    if (!formData.employeeId) {
      showError('يرجى اختيار الموظف');
      return;
    }

    if (!formData.reviewPeriod) {
      showError('يرجى إدخال فترة التقييم');
      return;
    }

    if (!formData.overallRating) {
      showError('يرجى إدخال التقييم العام');
      return;
    }

    try {
      if (selectedReview) {
        updatePerformanceReview(selectedReview.id, formData);
        showSuccess('تم تحديث تقييم الأداء بنجاح');
      } else {
        addPerformanceReview(formData);
        showSuccess('تم إضافة تقييم الأداء بنجاح');
      }
      setEditModal(false);
      setSelectedReview(null);
    } catch (error) {
      showError('حدث خطأ في حفظ تقييم الأداء');
    }
  };

  const handleDeleteClick = (review) => {
    if (!canDeletePerformance) {
      showError('ليس لديك صلاحية لحذف تقييمات الأداء');
      return;
    }
    setReviewToDelete(review);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!canDeletePerformance) {
      showError('ليس لديك صلاحية لحذف تقييمات الأداء');
      setDeleteModal(false);
      return;
    }

    try {
      const employee = employees.find(e => e.id === reviewToDelete.employeeId);
      const employeeName = employee ? employee.fullName : 'غير محدد';
      deletePerformanceReview(reviewToDelete.id);
      showSuccess(`تم حذف تقييم الأداء للموظف "${employeeName}" بنجاح`);
      setDeleteModal(false);
      setReviewToDelete(null);
    } catch (error) {
      showError('حدث خطأ في حذف تقييم الأداء');
      setDeleteModal(false);
    }
  };

  // فلترة تقييمات الأداء
  const filteredReviews = performanceReviews.filter(review => {
    const employee = employees.find(e => e.id === review.employeeId);
    const employeeName = employee ? employee.fullName : '';
    
    const matchesSearch = 
      employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (review.reviewer && review.reviewer.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (review.comments && review.comments.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesEmployee = !filterEmployee || review.employeeId === parseInt(filterEmployee);
    const matchesPeriod = !filterPeriod || review.reviewPeriod === filterPeriod;

    return matchesSearch && matchesEmployee && matchesPeriod;
  }).sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate)); // ترتيب حسب التاريخ

  // إحصائيات
  const avgRating = performanceReviews.length > 0 
    ? (performanceReviews.reduce((sum, r) => sum + (parseFloat(r.overallRating) || 0), 0) / performanceReviews.length).toFixed(1)
    : 0;
  
  const excellentReviews = performanceReviews.filter(r => parseFloat(r.overallRating) >= 4.5).length;
  const goodReviews = performanceReviews.filter(r => parseFloat(r.overallRating) >= 3.5 && parseFloat(r.overallRating) < 4.5).length;
  const needsImprovement = performanceReviews.filter(r => parseFloat(r.overallRating) < 3.5).length;

  // فحص صلاحية الوصول
  if (!canManagePerformance) {
    return (
      <div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-4">
          <FaExclamationTriangle className="text-red-600 text-2xl" />
          <div>
            <h3 className="text-red-800 font-bold text-lg">وصول غير مصرح</h3>
            <p className="text-red-700">ليس لديك صلاحية لإدارة تقييمات الأداء</p>
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
    { header: 'فترة التقييم', accessor: 'reviewPeriod' },
    { header: 'تاريخ التقييم', accessor: 'reviewDate' },
    { header: 'المقيم', accessor: 'reviewer' },
    { 
      header: 'التقييم العام', 
      accessor: 'overallRating',
      render: (row) => {
        const rating = parseFloat(row.overallRating) || 0;
        const stars = Array.from({ length: 5 }, (_, i) => (
          <FaStar 
            key={i} 
            className={`inline ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
          />
        ));
        return (
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium ml-1">{rating.toFixed(1)}</span>
            {stars}
          </div>
        );
      }
    },
    { 
      header: 'الحالة', 
      accessor: 'status',
      render: (row) => {
        const rating = parseFloat(row.overallRating) || 0;
        let status, color;
        
        if (rating >= 4.5) {
          status = 'ممتاز';
          color = 'bg-green-100 text-green-800';
        } else if (rating >= 3.5) {
          status = 'جيد';
          color = 'bg-blue-100 text-blue-800';
        } else if (rating >= 2.5) {
          status = 'مقبول';
          color = 'bg-yellow-100 text-yellow-800';
        } else {
          status = 'يحتاج تحسين';
          color = 'bg-red-100 text-red-800';
        }
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
            {status}
          </span>
        );
      }
    }
  ];

  const renderStars = (rating) => {
    const numRating = parseFloat(rating) || 0;
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar 
        key={i} 
        className={`inline ${i < numRating ? 'text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <FaChartLine className="text-indigo-600" />
          تقييمات الأداء
        </h1>
        {canEditPerformance && (
          <Button 
            onClick={handleAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <FaPlus className="ml-2" />
            إضافة تقييم أداء
          </Button>
        )}
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-blue-50 border-blue-200">
          <div className="text-center p-4">
            <FaChartLine className="text-3xl text-blue-600 mx-auto mb-2" />
            <h4 className="font-bold text-blue-800">متوسط التقييم</h4>
            <p className="text-2xl font-bold text-blue-600">{avgRating}</p>
          </div>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <div className="text-center p-4">
            <FaStar className="text-3xl text-green-600 mx-auto mb-2" />
            <h4 className="font-bold text-green-800">ممتاز (4.5+)</h4>
            <p className="text-2xl font-bold text-green-600">{excellentReviews}</p>
          </div>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <div className="text-center p-4">
            <FaStar className="text-3xl text-yellow-600 mx-auto mb-2" />
            <h4 className="font-bold text-yellow-800">جيد (3.5-4.5)</h4>
            <p className="text-2xl font-bold text-yellow-600">{goodReviews}</p>
          </div>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <div className="text-center p-4">
            <FaStar className="text-3xl text-red-600 mx-auto mb-2" />
            <h4 className="font-bold text-red-800">يحتاج تحسين (&lt;3.5)</h4>
            <p className="text-2xl font-bold text-red-600">{needsImprovement}</p>
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
              placeholder="البحث في تقييمات الأداء..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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

          <Select 
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            options={[
              { value: '', label: 'جميع الفترات' },
              { value: 'Q1', label: 'الربع الأول' },
              { value: 'Q2', label: 'الربع الثاني' },
              { value: 'Q3', label: 'الربع الثالث' },
              { value: 'Q4', label: 'الربع الرابع' },
              { value: 'annual', label: 'سنوي' },
              { value: 'semi_annual', label: 'نصف سنوي' }
            ]}
          />

          <Button 
            onClick={() => {
              setSearchTerm('');
              setFilterEmployee('');
              setFilterPeriod('');
            }}
            variant="secondary"
            className="w-full"
          >
            مسح الفلاتر
          </Button>
        </div>
      </Card>

      <Card icon={<FaChartLine />}>
        <Table
          columns={columns}
          data={filteredReviews}
          onView={handleView}
          onEdit={canEditPerformance ? handleEdit : null}
          onDelete={canDeletePerformance ? handleDeleteClick : null}
        />
      </Card>

      {/* نافذة العرض */}
      {viewModal && selectedReview && (
        <Modal
          isOpen={viewModal}
          onClose={() => setViewModal(false)}
          title="تفاصيل تقييم الأداء"
          footer={
            <Button variant="secondary" onClick={() => setViewModal(false)}>
              إغلاق
            </Button>
          }
        >
          <div className="space-y-6">
            {/* معلومات أساسية */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">الموظف</label>
                <p className="mt-1 text-sm text-gray-900 font-semibold">
                  {(() => {
                    const employee = employees.find(e => e.id === selectedReview.employeeId);
                    return employee ? employee.fullName : '-';
                  })()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">فترة التقييم</label>
                <p className="mt-1 text-sm text-gray-900">
                  {{
                    'Q1': 'الربع الأول',
                    'Q2': 'الربع الثاني', 
                    'Q3': 'الربع الثالث',
                    'Q4': 'الربع الرابع',
                    'annual': 'سنوي',
                    'semi_annual': 'نصف سنوي'
                  }[selectedReview.reviewPeriod] || selectedReview.reviewPeriod}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">تاريخ التقييم</label>
                <p className="mt-1 text-sm text-gray-900">{selectedReview.reviewDate || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">المقيم</label>
                <p className="mt-1 text-sm text-gray-900">{selectedReview.reviewer || '-'}</p>
              </div>
            </div>

            {/* التقييمات */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">التقييمات التفصيلية</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">التقييم العام:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{selectedReview.overallRating || '-'}</span>
                    {renderStars(selectedReview.overallRating)}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">المعرفة الوظيفية:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{selectedReview.jobKnowledge || '-'}</span>
                    {renderStars(selectedReview.jobKnowledge)}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">جودة العمل:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{selectedReview.workQuality || '-'}</span>
                    {renderStars(selectedReview.workQuality)}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">الإنتاجية:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{selectedReview.productivity || '-'}</span>
                    {renderStars(selectedReview.productivity)}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">التواصل:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{selectedReview.communication || '-'}</span>
                    {renderStars(selectedReview.communication)}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">العمل الجماعي:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{selectedReview.teamwork || '-'}</span>
                    {renderStars(selectedReview.teamwork)}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">القيادة:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{selectedReview.leadership || '-'}</span>
                    {renderStars(selectedReview.leadership)}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">المبادرة:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{selectedReview.initiative || '-'}</span>
                    {renderStars(selectedReview.initiative)}
                  </div>
                </div>
              </div>
            </div>

            {/* التعليقات والأهداف */}
            {selectedReview.strengths && (
              <div>
                <label className="block text-sm font-medium text-gray-700">نقاط القوة</label>
                <p className="mt-1 text-sm text-gray-900 bg-green-50 p-3 rounded border border-green-200">
                  {selectedReview.strengths}
                </p>
              </div>
            )}

            {selectedReview.areasForImprovement && (
              <div>
                <label className="block text-sm font-medium text-gray-700">مجالات التحسين</label>
                <p className="mt-1 text-sm text-gray-900 bg-yellow-50 p-3 rounded border border-yellow-200">
                  {selectedReview.areasForImprovement}
                </p>
              </div>
            )}

            {selectedReview.goals && (
              <div>
                <label className="block text-sm font-medium text-gray-700">الأهداف القادمة</label>
                <p className="mt-1 text-sm text-gray-900 bg-blue-50 p-3 rounded border border-blue-200">
                  {selectedReview.goals}
                </p>
              </div>
            )}

            {selectedReview.comments && (
              <div>
                <label className="block text-sm font-medium text-gray-700">التعليقات العامة</label>
                <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded border border-gray-200">
                  {selectedReview.comments}
                </p>
              </div>
            )}

            {selectedReview.recommendations && (
              <div>
                <label className="block text-sm font-medium text-gray-700">التوصيات</label>
                <p className="mt-1 text-sm text-gray-900 bg-purple-50 p-3 rounded border border-purple-200">
                  {selectedReview.recommendations}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* نافذة الإضافة/التعديل */}
      <Modal
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        title={selectedReview ? "تعديل تقييم الأداء" : "إضافة تقييم أداء جديد"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditModal(false)}>إلغاء</Button>
            <Button 
              variant="success" 
              onClick={handleSubmit}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {selectedReview ? 'حفظ التغييرات' : 'إضافة التقييم'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              label="فترة التقييم *" 
              name="reviewPeriod" 
              value={formData.reviewPeriod} 
              onChange={(e) => setFormData({ ...formData, reviewPeriod: e.target.value })} 
              placeholder="مثال: Q1 2024، سنوي 2024"
              required 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="تاريخ التقييم" 
              name="reviewDate" 
              type="date"
              value={formData.reviewDate} 
              onChange={(e) => setFormData({ ...formData, reviewDate: e.target.value })} 
            />
            <Input 
              label="المقيم" 
              name="reviewer" 
              value={formData.reviewer} 
              onChange={(e) => setFormData({ ...formData, reviewer: e.target.value })} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="التقييم العام (1-5) *" 
              name="overallRating" 
              type="number"
              min="1"
              max="5"
              step="0.1"
              value={formData.overallRating} 
              onChange={(e) => setFormData({ ...formData, overallRating: e.target.value })} 
              required 
            />
            <Input 
              label="المعرفة الوظيفية (1-5)" 
              name="jobKnowledge" 
              type="number"
              min="1"
              max="5"
              step="0.1"
              value={formData.jobKnowledge} 
              onChange={(e) => setFormData({ ...formData, jobKnowledge: e.target.value })} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="جودة العمل (1-5)" 
              name="workQuality" 
              type="number"
              min="1"
              max="5"
              step="0.1"
              value={formData.workQuality} 
              onChange={(e) => setFormData({ ...formData, workQuality: e.target.value })} 
            />
            <Input 
              label="الإنتاجية (1-5)" 
              name="productivity" 
              type="number"
              min="1"
              max="5"
              step="0.1"
              value={formData.productivity} 
              onChange={(e) => setFormData({ ...formData, productivity: e.target.value })} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="التواصل (1-5)" 
              name="communication" 
              type="number"
              min="1"
              max="5"
              step="0.1"
              value={formData.communication} 
              onChange={(e) => setFormData({ ...formData, communication: e.target.value })} 
            />
            <Input 
              label="العمل الجماعي (1-5)" 
              name="teamwork" 
              type="number"
              min="1"
              max="5"
              step="0.1"
              value={formData.teamwork} 
              onChange={(e) => setFormData({ ...formData, teamwork: e.target.value })} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="القيادة (1-5)" 
              name="leadership" 
              type="number"
              min="1"
              max="5"
              step="0.1"
              value={formData.leadership} 
              onChange={(e) => setFormData({ ...formData, leadership: e.target.value })} 
            />
            <Input 
              label="المبادرة (1-5)" 
              name="initiative" 
              type="number"
              min="1"
              max="5"
              step="0.1"
              value={formData.initiative} 
              onChange={(e) => setFormData({ ...formData, initiative: e.target.value })} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نقاط القوة</label>
            <textarea
              name="strengths"
              value={formData.strengths}
              onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="نقاط قوة الموظف..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">مجالات التحسين</label>
            <textarea
              name="areasForImprovement"
              value={formData.areasForImprovement}
              onChange={(e) => setFormData({ ...formData, areasForImprovement: e.target.value })}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="مجالات تحتاج إلى تحسين..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الأهداف القادمة</label>
            <textarea
              name="goals"
              value={formData.goals}
              onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="الأهداف والتطلعات القادمة..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">التعليقات العامة</label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="تعليقات إضافية..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">التوصيات</label>
            <textarea
              name="recommendations"
              value={formData.recommendations}
              onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="توصيات للتطوير..."
            />
          </div>
        </form>
      </Modal>

      {/* نافذة تأكيد الحذف */}
      {deleteModal && reviewToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-100 rounded-full p-4">
                <FaExclamationTriangle className="text-4xl text-red-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              تأكيد حذف تقييم الأداء
            </h2>

            <div className="bg-yellow-50 p-4 rounded-lg mb-4 border border-yellow-200">
              <p className="text-gray-700 text-center mb-2">
                هل أنت متأكد من حذف تقييم الأداء هذا؟
              </p>
              <p className="text-sm text-red-600 text-center font-semibold">
                ⚠️ لا يمكن التراجع عن هذا الإجراء
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">تفاصيل التقييم:</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">الموظف: </span>
                  <span className="font-semibold">
                    {(() => {
                      const employee = employees.find(e => e.id === reviewToDelete.employeeId);
                      return employee ? employee.fullName : '-';
                    })()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">فترة التقييم: </span>
                  <span className="font-semibold">{reviewToDelete.reviewPeriod}</span>
                </div>
                <div>
                  <span className="text-gray-600">التقييم العام: </span>
                  <span className="font-semibold">{reviewToDelete.overallRating || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-600">المقيم: </span>
                  <span className="font-semibold">{reviewToDelete.reviewer || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-600">تاريخ التقييم: </span>
                  <span className="font-semibold">{reviewToDelete.reviewDate}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                نعم، احذف التقييم
              </button>
              <button
                onClick={() => {
                  setDeleteModal(false);
                  setReviewToDelete(null);
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

export default Performance;