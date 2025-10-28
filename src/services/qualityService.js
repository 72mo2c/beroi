// ======================================
// Quality Service - خدمات إدارة الجودة
// ======================================

import { supabase } from './api';

class QualityService {
  // إحصائيات لوحة التحكم
  async getDashboardStats(organizationId) {
    try {
      const [inspectionsResult, nonConformancesResult, complaintsResult] = await Promise.all([
        supabase
          .from('quality_inspections')
          .select('id, status')
          .eq('organization_id', organizationId),
        supabase
          .from('non_conformances')
          .select('id, status')
          .eq('organization_id', organizationId),
        supabase
          .from('customer_complaints')
          .select('id, status')
          .eq('organization_id', organizationId)
      ]);

      const inspections = inspectionsResult.data || [];
      const nonConformances = nonConformancesResult.data || [];
      const complaints = complaintsResult.data || [];

      const totalInspections = inspections.length;
      const passedInspections = inspections.filter(i => i.status === 'passed').length;
      const failedInspections = inspections.filter(i => i.status === 'failed').length;
      const pendingInspections = inspections.filter(i => i.status === 'pending').length;
      const openNonConformances = nonConformances.filter(nc => nc.status === 'open').length;
      const openComplaints = complaints.filter(c => c.status === 'new' || c.status === 'assigned').length;
      
      const qualityScore = totalInspections > 0 
        ? ((passedInspections / totalInspections) * 100).toFixed(1)
        : 0;

      return {
        totalInspections,
        passedInspections,
        failedInspections,
        pendingInspections,
        totalNonConformances: nonConformances.length,
        openNonConformances,
        totalComplaints: complaints.length,
        openComplaints,
        qualityScore: parseFloat(qualityScore)
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  // معايير الجودة
  async getQualityStandards(organizationId) {
    try {
      const { data, error } = await supabase
        .from('quality_standards')
        .select(`
          *,
          departments(name)
        `)
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching quality standards:', error);
      throw error;
    }
  }

  async createQualityStandard(standardData) {
    try {
      const { data, error } = await supabase
        .from('quality_standards')
        .insert([standardData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating quality standard:', error);
      throw error;
    }
  }

  async updateQualityStandard(id, updates) {
    try {
      const { data, error } = await supabase
        .from('quality_standards')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating quality standard:', error);
      throw error;
    }
  }

  async deleteQualityStandard(id) {
    try {
      const { error } = await supabase
        .from('quality_standards')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting quality standard:', error);
      throw error;
    }
  }

  // فحوصات الجودة
  async getInspections(organizationId) {
    try {
      const { data, error } = await supabase
        .from('quality_inspections')
        .select(`
          *,
          products(name),
          employees(first_name, last_name)
        `)
        .eq('organization_id', organizationId)
        .order('inspection_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching inspections:', error);
      throw error;
    }
  }

  async getInspection(id) {
    try {
      const { data, error } = await supabase
        .from('quality_inspections')
        .select(`
          *,
          quality_inspection_results(*),
          products(name),
          employees(first_name, last_name)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching inspection:', error);
      throw error;
    }
  }

  async createInspection(inspectionData) {
    try {
      const { data, error } = await supabase
        .from('quality_inspections')
        .insert([inspectionData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating inspection:', error);
      throw error;
    }
  }

  async updateInspection(id, updates) {
    try {
      const { data, error } = await supabase
        .from('quality_inspections')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating inspection:', error);
      throw error;
    }
  }

  // نتائج الفحص
  async createInspectionResult(resultData) {
    try {
      const { data, error } = await supabase
        .from('quality_inspection_results')
        .insert([resultData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating inspection result:', error);
      throw error;
    }
  }

  async updateInspectionResult(id, updates) {
    try {
      const { data, error } = await supabase
        .from('quality_inspection_results')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating inspection result:', error);
      throw error;
    }
  }

  // عدم المطابقة
  async getNonConformances(organizationId) {
    try {
      const { data, error } = await supabase
        .from('non_conformances')
        .select(`
          *,
          products(name),
          customers(name),
          employees!non_conformances_reported_by_id_fkey(first_name, last_name)
        `)
        .eq('organization_id', organizationId)
        .order('reported_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching non conformances:', error);
      throw error;
    }
  }

  async createNonConformance(ncData) {
    try {
      const { data, error } = await supabase
        .from('non_conformances')
        .insert([ncData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating non conformance:', error);
      throw error;
    }
  }

  async updateNonConformance(id, updates) {
    try {
      const { data, error } = await supabase
        .from('non_conformances')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating non conformance:', error);
      throw error;
    }
  }

  // شكاوى العملاء
  async getComplaints(organizationId) {
    try {
      const { data, error } = await supabase
        .from('customer_complaints')
        .select(`
          *,
          customers(name),
          employees!customer_complaints_assigned_to_id_fkey(first_name, last_name)
        `)
        .eq('organization_id', organizationId)
        .order('reported_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching complaints:', error);
      throw error;
    }
  }

  async createComplaint(complaintData) {
    try {
      const { data, error } = await supabase
        .from('customer_complaints')
        .insert([complaintData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating complaint:', error);
      throw error;
    }
  }

  async updateComplaint(id, updates) {
    try {
      const { data, error } = await supabase
        .from('customer_complaints')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating complaint:', error);
      throw error;
    }
  }

  // التقارير
  async getQualityReport(organizationId, dateFrom, dateTo) {
    try {
      const { data, error } = await supabase
        .from('quality_inspections')
        .select(`
          *,
          quality_inspection_results(*)
        `)
        .eq('organization_id', organizationId)
        .gte('inspection_date', dateFrom)
        .lte('inspection_date', dateTo);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching quality report:', error);
      throw error;
    }
  }

  async getNonConformanceReport(organizationId, dateFrom, dateTo) {
    try {
      const { data, error } = await supabase
        .from('non_conformances')
        .select(`
          *,
          products(name),
          customers(name)
        `)
        .eq('organization_id', organizationId)
        .gte('reported_date', dateFrom)
        .lte('reported_date', dateTo);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching non conformance report:', error);
      throw error;
    }
  }

  async getComplaintAnalysis(organizationId, dateFrom, dateTo) {
    try {
      const { data, error } = await supabase
        .from('customer_complaints')
        .select(`
          *,
          customers(name)
        `)
        .eq('organization_id', organizationId)
        .gte('reported_date', dateFrom)
        .lte('reported_date', dateTo);

      if (error) throw error;

      // تحليل البيانات
      const analysis = {
        total: data.length,
        byType: {},
        byPriority: {},
        byStatus: {},
        avgResolutionDays: 0,
        resolvedComplaints: data.filter(c => c.status === 'closed' && c.resolved_date),
      };

      // حساب المتوسط
      if (analysis.resolvedComplaints.length > 0) {
        const totalDays = analysis.resolvedComplaints.reduce((sum, complaint) => {
          const reported = new Date(complaint.reported_date);
          const resolved = new Date(complaint.resolved_date);
          const days = Math.ceil((resolved - reported) / (1000 * 60 * 60 * 24));
          return sum + days;
        }, 0);
        analysis.avgResolutionDays = (totalDays / analysis.resolvedComplaints.length).toFixed(1);
      }

      // تجميع البيانات
      data.forEach(complaint => {
        // حسب النوع
        analysis.byType[complaint.complaint_type] = (analysis.byType[complaint.complaint_type] || 0) + 1;
        
        // حسب الأولوية
        analysis.byPriority[complaint.priority] = (analysis.byPriority[complaint.priority] || 0) + 1;
        
        // حسب الحالة
        analysis.byStatus[complaint.status] = (analysis.byStatus[complaint.status] || 0) + 1;
      });

      return analysis;
    } catch (error) {
      console.error('Error fetching complaint analysis:', error);
      throw error;
    }
  }
}

export default new QualityService();