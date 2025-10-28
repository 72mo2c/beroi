import React, { useState, useEffect } from 'react';
import { 
  Wrench, Plus, Search, Edit, Trash2, Save, X, ArrowLeft, 
  Calculator, Package, Layers, Clock, AlertTriangle, CheckCircle,
  FileText, Copy, ChevronDown, ChevronRight, Upload, Download
} from 'lucide-react';

const BillOfMaterials = () => {
  const [boms, setBoms] = useState([]);
  const [selectedBom, setSelectedBom] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [expandedBom, setExpandedBom] = useState(null);
  const [currentForm, setCurrentForm] = useState({
    name: '',
    description: '',
    version: '1.0',
    status: 'مسودة',
    category: '',
    materials: [],
    operations: [],
    totalCost: 0,
    estimatedTime: 0
  });

  // محاكاة البيانات
  const mockBoms = [
    {
      id: 1,
      name: 'قائمة مواد المنتج A',
      description: 'قائمة المواد الرئيسية للمنتج A',
      version: '1.0',
      status: 'نشط',
      category: 'إلكترونيات',
      totalCost: 1250.50,
      estimatedTime: 480,
      materials: [
        { id: 1, name: 'لوحة الدائرة الرئيسية', quantity: 1, unit: 'قطعة', unitCost: 450, totalCost: 450, supplier: 'شركة الإلكترونيات' },
        { id: 2, name: 'المعالج', quantity: 1, unit: 'قطعة', unitCost: 320, totalCost: 320, supplier: 'مورد التقنية' },
        { id: 3, name: 'الذاكرة', quantity: 2, unit: 'قطعة', unitCost: 85, totalCost: 170, supplier: 'مخزن التقنية' },
        { id: 4, name: 'الغلاف الخارجي', quantity: 1, unit: 'قطعة', unitCost: 180, totalCost: 180, supplier: 'شركة البلاستيك' },
        { id: 5, name: 'الكابلات', quantity: 5, unit: 'قطعة', unitCost: 26.10, totalCost: 130.50, supplier: 'مورد الكابلات' }
      ],
      operations: [
        { id: 1, name: 'تركيب لوحة الدائرة', duration: 30, workstation: 'محطة 1', operator: 'أحمد محمد' },
        { id: 2, name: 'تركيب المعالج', duration: 45, workstation: 'محطة 2', operator: 'سارة أحمد' },
        { id: 3, name: 'اختبار أولي', duration: 20, workstation: 'محطة الاختبار', operator: 'محمد علي' }
      ],
      createdDate: '2025-10-01',
      lastModified: '2025-10-15'
    },
    {
      id: 2,
      name: 'قائمة مواد المنتج B',
      description: 'قائمة المواد للمنتج B',
      version: '2.1',
      status: 'تحت المراجعة',
      category: 'أجهزة منزلية',
      totalCost: 850.25,
      estimatedTime: 360,
      materials: [
        { id: 1, name: 'الإطار المعدني', quantity: 1, unit: 'قطعة', unitCost: 200, totalCost: 200, supplier: 'شركة المعادن' },
        { id: 2, name: 'المحرك', quantity: 1, unit: 'قطعة', unitCost: 350, totalCost: 350, supplier: 'مورد المحركات' },
        { id: 3, name: 'نظام التحكم', quantity: 1, unit: 'قطعة', unitCost: 180, totalCost: 180, supplier: 'شركة التحكم' },
        { id: 4, name: 'الأجزاء البلاستيكية', quantity: 8, unit: 'قطعة', unitCost: 15, totalCost: 120, supplier: 'مورد البلاستيك' }
      ],
      operations: [
        { id: 1, name: 'تجميع الهيكل', duration: 60, workstation: 'خط الإنتاج 1', operator: 'خالد محمود' },
        { id: 2, name: 'تركيب المحرك', duration: 90, workstation: 'خط الإنتاج 2', operator: 'علي حسن' },
        { id: 3, name: 'توصيل نظام التحكم', duration: 45, workstation: 'محطة التحكم', operator: 'نور الدين' }
      ],
      createdDate: '2025-09-15',
      lastModified: '2025-10-20'
    }
  ];

  const categories = [
    'إلكترونيات',
    'أجهزة منزلية',
    'معدات طبية',
    'سيارات',
    'أثاث',
    'ملابس',
    'مواد غذائية',
    'أخرى'
  ];

  const statusOptions = [
    { value: 'مسودة', label: 'مسودة', color: 'bg-gray-100 text-gray-800' },
    { value: 'تحت المراجعة', label: 'تحت المراجعة', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'نشط', label: 'نشط', color: 'bg-green-100 text-green-800' },
    { value: 'متوقف', label: 'متوقف', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    setBoms(mockBoms);
  }, []);

  const filteredBoms = boms.filter(bom =>
    bom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bom.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bom.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateTotalCost = (materials) => {
    return materials.reduce((sum, material) => sum + material.totalCost, 0);
  };

  const calculateTotalTime = (operations) => {
    return operations.reduce((sum, operation) => sum + operation.duration, 0);
  };

  const handleSaveBom = () => {
    if (currentForm.name && currentForm.materials.length > 0) {
      const totalCost = calculateTotalCost(currentForm.materials);
      const totalTime = calculateTotalTime(currentForm.operations);
      
      const newBom = {
        ...currentForm,
        id: Date.now(),
        totalCost,
        estimatedTime: totalTime,
        createdDate: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0]
      };

      if (selectedBom) {
        setBoms(boms.map(bom => bom.id === selectedBom.id ? newBom : bom));
      } else {
        setBoms([...boms, newBom]);
      }

      resetForm();
    }
  };

  const handleEdit = (bom) => {
    setSelectedBom(bom);
    setCurrentForm(bom);
    setShowForm(true);
    setIsEditing(true);
  };

  const handleDelete = (bomId) => {
    if (window.confirm('هل أنت متأكد من حذف قائمة المواد هذه؟')) {
      setBoms(boms.filter(bom => bom.id !== bomId));
    }
  };

  const addMaterial = () => {
    setCurrentForm({
      ...currentForm,
      materials: [
        ...currentForm.materials,
        {
          id: Date.now(),
          name: '',
          quantity: 1,
          unit: 'قطعة',
          unitCost: 0,
          totalCost: 0,
          supplier: ''
        }
      ]
    });
  };

  const updateMaterial = (index, field, value) => {
    const updatedMaterials = [...currentForm.materials];
    updatedMaterials[index][field] = value;
    
    // تحديث التكلفة الإجمالية للمادة
    if (field === 'quantity' || field === 'unitCost') {
      updatedMaterials[index].totalCost = updatedMaterials[index].quantity * updatedMaterials[index].unitCost;
    }
    
    setCurrentForm({
      ...currentForm,
      materials: updatedMaterials
    });
  };

  const removeMaterial = (index) => {
    setCurrentForm({
      ...currentForm,
      materials: currentForm.materials.filter((_, i) => i !== index)
    });
  };

  const addOperation = () => {
    setCurrentForm({
      ...currentForm,
      operations: [
        ...currentForm.operations,
        {
          id: Date.now(),
          name: '',
          duration: 0,
          workstation: '',
          operator: ''
        }
      ]
    });
  };

  const updateOperation = (index, field, value) => {
    const updatedOperations = [...currentForm.operations];
    updatedOperations[index][field] = value;
    
    setCurrentForm({
      ...currentForm,
      operations: updatedOperations
    });
  };

  const removeOperation = (index) => {
    setCurrentForm({
      ...currentForm,
      operations: currentForm.operations.filter((_, i) => i !== index)
    });
  };

  const resetForm = () => {
    setCurrentForm({
      name: '',
      description: '',
      version: '1.0',
      status: 'مسودة',
      category: '',
      materials: [],
      operations: [],
      totalCost: 0,
      estimatedTime: 0
    });
    setSelectedBom(null);
    setShowForm(false);
    setIsEditing(false);
  };

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.color : 'bg-gray-100 text-gray-800';
  };

  const exportBom = (bom) => {
    const bomData = {
      ...bom,
      exportedDate: new Date().toISOString(),
      exportedBy: 'المستخدم الحالي'
    };
    
    const dataStr = JSON.stringify(bomData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `BOM_${bom.name}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3 space-x-reverse">
          <Layers className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">قوائم المواد (BOM)</h1>
        </div>
        <div className="flex space-x-3 space-x-reverse">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 space-x-reverse transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>قائمة مواد جديدة</span>
          </button>
        </div>
      </div>

      {/* شريط البحث والفلاتر */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="البحث في قوائم المواد..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
            <option>جميع الفئات</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
            <option>جميع الحالات</option>
            {statusOptions.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* قائمة قوائم المواد */}
      <div className="grid gap-6">
        {filteredBoms.map((bom) => (
          <div key={bom.id} className="bg-white rounded-lg shadow-sm border">
            <div 
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedBom(expandedBom === bom.id ? null : bom.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    {expandedBom === bom.id ? 
                      <ChevronDown className="w-5 h-5 text-gray-500" /> : 
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    }
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{bom.name}</h3>
                      <p className="text-gray-600">{bom.description}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 space-x-reverse">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(bom.status)}`}>
                    {statusOptions.find(s => s.value === bom.status)?.label}
                  </span>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">التكلفة الإجمالية</div>
                    <div className="text-lg font-semibold text-green-600">{bom.totalCost.toFixed(2)} ريال</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">الوقت المقدر</div>
                    <div className="text-lg font-semibold text-blue-600">{bom.estimatedTime} دقيقة</div>
                  </div>
                  <div className="flex space-x-2 space-x-reverse">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        exportBom(bom);
                      }}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="تصدير"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(bom);
                      }}
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="تعديل"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(bom.id);
                      }}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* التفاصيل الموسعة */}
            {expandedBom === bom.id && (
              <div className="border-t border-gray-200 p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* المواد */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2 space-x-reverse">
                      <Package className="w-5 h-5" />
                      <span>المواد المطلوبة</span>
                    </h4>
                    <div className="space-y-2">
                      {bom.materials.map((material, index) => (
                        <div key={material.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium">{material.name}</div>
                            <div className="text-sm text-gray-500">{material.quantity} {material.unit}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{material.totalCost.toFixed(2)} ريال</div>
                            <div className="text-sm text-gray-500">{material.unitCost.toFixed(2)} ريال/{material.unit}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* العمليات */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2 space-x-reverse">
                      <Wrench className="w-5 h-5" />
                      <span>العمليات الإنتاجية</span>
                    </h4>
                    <div className="space-y-2">
                      {bom.operations.map((operation, index) => (
                        <div key={operation.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{operation.name}</div>
                              <div className="text-sm text-gray-500">محطة العمل: {operation.workstation}</div>
                              <div className="text-sm text-gray-500">المشغل: {operation.operator}</div>
                            </div>
                            <div className="text-sm text-blue-600 font-medium">{operation.duration} دقيقة</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* معلومات إضافية */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">الفئة:</span>
                      <span className="mr-2 font-medium">{bom.category}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">الإصدار:</span>
                      <span className="mr-2 font-medium">{bom.version}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">تاريخ الإنشاء:</span>
                      <span className="mr-2 font-medium">{bom.createdDate}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">آخر تعديل:</span>
                      <span className="mr-2 font-medium">{bom.lastModified}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* نموذج إنشاء/تعديل قائمة المواد */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  {isEditing ? 'تعديل قائمة المواد' : 'قائمة مواد جديدة'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* معلومات أساسية */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">اسم قائمة المواد</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    value={currentForm.name}
                    onChange={(e) => setCurrentForm({...currentForm, name: e.target.value})}
                    placeholder="أدخل اسم قائمة المواد"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    value={currentForm.description}
                    onChange={(e) => setCurrentForm({...currentForm, description: e.target.value})}
                    placeholder="وصف مختصر"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الإصدار</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    value={currentForm.version}
                    onChange={(e) => setCurrentForm({...currentForm, version: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الفئة</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    value={currentForm.category}
                    onChange={(e) => setCurrentForm({...currentForm, category: e.target.value})}
                  >
                    <option value="">اختر الفئة</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    value={currentForm.status}
                    onChange={(e) => setCurrentForm({...currentForm, status: e.target.value})}
                  >
                    {statusOptions.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* المواد */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">المواد المطلوبة</h3>
                  <button
                    onClick={addMaterial}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg flex items-center space-x-2 space-x-reverse text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة مادة</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {currentForm.materials.map((material, index) => (
                    <div key={material.id} className="grid grid-cols-12 gap-2 p-4 bg-gray-50 rounded-lg">
                      <div className="col-span-3">
                        <input
                          type="text"
                          placeholder="اسم المادة"
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500"
                          value={material.name}
                          onChange={(e) => updateMaterial(index, 'name', e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="الكمية"
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500"
                          value={material.quantity}
                          onChange={(e) => updateMaterial(index, 'quantity', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          placeholder="الوحدة"
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500"
                          value={material.unit}
                          onChange={(e) => updateMaterial(index, 'unit', e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="تكلفة الوحدة"
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500"
                          value={material.unitCost}
                          onChange={(e) => updateMaterial(index, 'unitCost', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          placeholder="المورد"
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500"
                          value={material.supplier}
                          onChange={(e) => updateMaterial(index, 'supplier', e.target.value)}
                        />
                      </div>
                      <div className="col-span-1 flex items-center justify-center">
                        <button
                          onClick={() => removeMaterial(index)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* العمليات */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">العمليات الإنتاجية</h3>
                  <button
                    onClick={addOperation}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg flex items-center space-x-2 space-x-reverse text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة عملية</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {currentForm.operations.map((operation, index) => (
                    <div key={operation.id} className="grid grid-cols-12 gap-2 p-4 bg-gray-50 rounded-lg">
                      <div className="col-span-4">
                        <input
                          type="text"
                          placeholder="اسم العملية"
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500"
                          value={operation.name}
                          onChange={(e) => updateOperation(index, 'name', e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="المدة (دقيقة)"
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500"
                          value={operation.duration}
                          onChange={(e) => updateOperation(index, 'duration', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="text"
                          placeholder="محطة العمل"
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500"
                          value={operation.workstation}
                          onChange={(e) => updateOperation(index, 'workstation', e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          placeholder="المشغل"
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500"
                          value={operation.operator}
                          onChange={(e) => updateOperation(index, 'operator', e.target.value)}
                        />
                      </div>
                      <div className="col-span-1 flex items-center justify-center">
                        <button
                          onClick={() => removeOperation(index)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3 space-x-reverse">
              <button
                onClick={resetForm}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveBom}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 space-x-reverse transition-colors"
              >
                <Save className="w-5 h-5" />
                <span>حفظ قائمة المواد</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillOfMaterials;