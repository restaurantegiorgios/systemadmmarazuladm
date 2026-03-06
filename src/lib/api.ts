import { supabase } from '@/integrations/supabase/client';
import { Employee, Document } from '@/contexts/EmployeeProvider';
import { EmployeeFormValues } from '@/lib/validators';

// --- Employee API ---

export const fetchEmployees = async (): Promise<Employee[]> => {
  const { data, error } = await supabase
    .from('employees')
    .select('*, documents(*)')
    .order('fullName', { ascending: true });

  if (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
  // Supabase returns documents as snake_case, let's ensure it's camelCase if needed
  // Although supabase-js v2 often handles this, an explicit map is safer.
  return (data || []).map(employee => ({
    ...employee,
    documents: employee.documents.map((doc: any) => ({
      id: doc.id,
      type: doc.type,
      fileName: doc.fileName,
      fileData: doc.fileData,
      uploadDate: doc.uploadDate,
    }))
  }));
};

export const addEmployee = async (employeeData: EmployeeFormValues): Promise<Employee> => {
  const { data, error } = await supabase
    .from('employees')
    .insert([employeeData])
    .select('*, documents(*)')
    .single();

  if (error) {
    console.error('Error adding employee:', error);
    throw error;
  }
  return { ...data, documents: data.documents || [] };
};

export const updateEmployee = async (id: string, employeeData: Partial<EmployeeFormValues>): Promise<Employee> => {
  const { data, error } = await supabase
    .from('employees')
    .update(employeeData)
    .eq('id', id)
    .select('*, documents(*)')
    .single();

  if (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
  return { ...data, documents: data.documents || [] };
};

export const deleteEmployee = async (id: string): Promise<{ id: string }> => {
  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
  return { id };
};

// --- Document API ---

export const addDocumentToEmployee = async (employeeId: string, documentData: Omit<Document, 'id' | 'uploadDate'>): Promise<Document> => {
  const newDocumentPayload = {
    ...documentData,
    employee_id: employeeId,
    uploadDate: new Date().toISOString().split('T')[0],
  };

  const { data, error } = await supabase
    .from('documents')
    .insert([newDocumentPayload])
    .select()
    .single();

  if (error) {
    console.error('Error adding document:', error);
    throw error;
  }
  return data;
};

export const deleteDocumentFromEmployee = async (employeeId: string, documentId: string): Promise<{ documentId: string }> => {
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', documentId);

  if (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
  return { documentId };
};