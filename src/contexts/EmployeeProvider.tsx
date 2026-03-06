import React, { createContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EmployeeFormValues } from '@/lib/validators';
import * as api from '@/lib/api';

// As interfaces permanecem aqui, pois são usadas em toda a aplicação
export interface Document {
  id: string;
  type: string;
  fileName: string;
  fileData: string;
  uploadDate: string;
}

export interface Employee extends EmployeeFormValues {
  id: string;
  documents: Document[];
}

// O contexto em si não precisa mais carregar dados, apenas existir
const EmployeeContext = createContext({});

export const EmployeeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <EmployeeContext.Provider value={{}}>
      {children}
    </EmployeeContext.Provider>
  );
};

// O hook `useEmployees` agora é o ponto central para acesso e manipulação de dados
export const useEmployees = () => {
  const queryClient = useQueryClient();

  // Query para buscar todos os funcionários
  const { data: employees = [], isLoading, isError } = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: api.fetchEmployees,
  });

  // Mutação para adicionar um funcionário
  const { mutate: addEmployee } = useMutation({
    mutationFn: api.addEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });

  // Mutação para atualizar um funcionário
  const { mutate: updateEmployee } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Employee> }) => api.updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });

  // Mutação para deletar um funcionário
  const { mutate: deleteEmployee } = useMutation({
    mutationFn: api.deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });

  // Mutação para adicionar um documento
  const { mutate: addDocument } = useMutation({
    mutationFn: ({ employeeId, docData }: { employeeId: string; docData: Omit<Document, 'id' | 'uploadDate'> }) => api.addDocumentToEmployee(employeeId, docData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });

  // Mutação para deletar um documento
  const { mutate: deleteDocument } = useMutation({
    mutationFn: ({ employeeId, docId }: { employeeId: string; docId: string }) => api.deleteDocumentFromEmployee(employeeId, docId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });

  // Função auxiliar para obter um funcionário da lista em cache
  const getEmployeeById = (id: string) => {
    return employees.find(emp => emp.id === id);
  };

  return {
    employees,
    isLoading,
    isError,
    getEmployeeById,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addDocument,
    deleteDocument,
  };
};