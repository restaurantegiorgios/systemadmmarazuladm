import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Employee {
  id: string;
  fullName: string;
  cpf: string;
  position: string;
  admissionDate: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  documents: Document[];
  photo?: string; // Added photo field
}

export interface Document {
  id: string;
  type: string;
  fileName: string;
  uploadDate: string;
}

interface EmployeeContextType {
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id' | 'documents'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  getEmployeeById: (id: string) => Employee | undefined;
  addDocument: (employeeId: string, document: Omit<Document, 'id' | 'uploadDate'>) => void;
  deleteDocument: (employeeId: string, documentId: string) => void;
}

const mockEmployees: Employee[] = [
  {
    id: '1',
    fullName: 'Carlos Silva Santos',
    cpf: '123.456.789-00',
    position: 'waiter',
    admissionDate: '2023-01-15',
    email: 'carlos.silva@giorgiomar.com',
    phone: '(11) 98765-4321',
    address: 'Rua das Flores, 123 - São Paulo, SP',
    status: 'active',
    documents: [
      { id: 'd1', type: 'rg', fileName: 'RG_Carlos.pdf', uploadDate: '2023-01-10' },
      { id: 'd2', type: 'cpf', fileName: 'CPF_Carlos.pdf', uploadDate: '2023-01-10' },
    ],
    photo: undefined,
  },
  {
    id: '2',
    fullName: 'Maria Oliveira Costa',
    cpf: '234.567.890-11',
    position: 'chef',
    admissionDate: '2022-06-01',
    email: 'maria.oliveira@giorgiomar.com',
    phone: '(11) 97654-3210',
    address: 'Av. Paulista, 1000 - São Paulo, SP',
    status: 'active',
    documents: [
      { id: 'd3', type: 'rg', fileName: 'RG_Maria.pdf', uploadDate: '2022-05-25' },
      { id: 'd4', type: 'medical', fileName: 'Exame_Maria.pdf', uploadDate: '2022-05-25' },
    ],
    photo: undefined,
  },
  {
    id: '3',
    fullName: 'João Pedro Almeida',
    cpf: '345.678.901-22',
    position: 'bartender',
    admissionDate: '2023-03-10',
    email: 'joao.pedro@giorgiomar.com',
    phone: '(11) 96543-2109',
    address: 'Rua Augusta, 500 - São Paulo, SP',
    status: 'active',
    documents: [],
    photo: undefined,
  },
  {
    id: '4',
    fullName: 'Ana Carolina Ferreira',
    cpf: '456.789.012-33',
    position: 'manager',
    admissionDate: '2021-09-15',
    email: 'ana.carolina@giorgiomar.com',
    phone: '(11) 95432-1098',
    address: 'Rua Consolação, 750 - São Paulo, SP',
    status: 'active',
    documents: [
      { id: 'd5', type: 'contract', fileName: 'Contrato_Ana.pdf', uploadDate: '2021-09-10' },
    ],
    photo: undefined,
  },
  {
    id: '5',
    fullName: 'Roberto Lima Souza',
    cpf: '567.890.123-44',
    position: 'cook',
    admissionDate: '2022-11-20',
    email: 'roberto.lima@giorgiomar.com',
    phone: '(11) 94321-0987',
    address: 'Rua da República, 320 - São Paulo, SP',
    status: 'inactive',
    documents: [],
    photo: undefined,
  },
  {
    id: '6',
    fullName: 'Juliana Martins Rocha',
    cpf: '678.901.234-55',
    position: 'host',
    admissionDate: '2023-02-01',
    email: 'juliana.martins@giorgiomar.com',
    phone: '(11) 93210-9876',
    address: 'Av. Brigadeiro, 200 - São Paulo, SP',
    status: 'active',
    documents: [],
    photo: undefined,
  },
  {
    id: '7',
    fullName: 'Fernando Costa Nunes',
    cpf: '789.012.345-66',
    position: 'souschef',
    admissionDate: '2022-08-10',
    email: 'fernando.costa@giorgiomar.com',
    phone: '(11) 92109-8765',
    address: 'Rua Oscar Freire, 890 - São Paulo, SP',
    status: 'active',
    documents: [
      { id: 'd6', type: 'rg', fileName: 'RG_Fernando.pdf', uploadDate: '2022-08-05' },
    ],
    photo: undefined,
  },
  {
    id: '8',
    fullName: 'Patrícia Santos Dias',
    cpf: '890.123.456-77',
    position: 'waiter',
    admissionDate: '2023-04-15',
    email: 'patricia.santos@giorgiomar.com',
    phone: '(11) 91098-7654',
    address: 'Rua Haddock Lobo, 450 - São Paulo, SP',
    status: 'active',
    documents: [],
    photo: undefined,
  },
  {
    id: '9',
    fullName: 'Ricardo Oliveira Paz',
    cpf: '901.234.567-88',
    position: 'dishwasher',
    admissionDate: '2023-05-20',
    email: 'ricardo.oliveira@giorgiomar.com',
    phone: '(11) 90987-6543',
    address: 'Rua dos Pinheiros, 670 - São Paulo, SP',
    status: 'active',
    documents: [],
    photo: undefined,
  },
  {
    id: '10',
    fullName: 'Camila Rodrigues Silva',
    cpf: '012.345.678-99',
    position: 'waiter',
    admissionDate: '2022-12-01',
    email: 'camila.rodrigues@giorgiomar.com',
    phone: '(11) 89876-5432',
    address: 'Av. Rebouças, 1200 - São Paulo, SP',
    status: 'inactive',
    documents: [],
    photo: undefined,
  },
  {
    id: '11',
    fullName: 'Lucas Henrique Barbosa',
    cpf: '111.222.333-44',
    position: 'cook',
    admissionDate: '2023-06-01',
    email: 'lucas.henrique@giorgiomar.com',
    phone: '(11) 88765-4321',
    address: 'Rua Bela Cintra, 550 - São Paulo, SP',
    status: 'active',
    documents: [],
    photo: undefined,
  },
  {
    id: '12',
    fullName: 'Beatriz Alves Pereira',
    cpf: '222.333.444-55',
    position: 'host',
    admissionDate: '2023-07-10',
    email: 'beatriz.alves@giorgiomar.com',
    phone: '(11) 87654-3210',
    address: 'Av. Europa, 890 - São Paulo, SP',
    status: 'active',
    documents: [],
    photo: undefined,
  },
  {
    id: '13',
    fullName: 'Gabriel Ferreira Lima',
    cpf: '333.444.555-66',
    position: 'bartender',
    admissionDate: '2022-10-15',
    email: 'gabriel.ferreira@giorgiomar.com',
    phone: '(11) 86543-2109',
    address: 'Rua Pamplona, 320 - São Paulo, SP',
    status: 'active',
    documents: [],
    photo: undefined,
  },
  {
    id: '14',
    fullName: 'Larissa Souza Martins',
    cpf: '444.555.666-77',
    position: 'waiter',
    admissionDate: '2023-08-01',
    email: 'larissa.souza@giorgiomar.com',
    phone: '(11) 85432-1098',
    address: 'Rua Joaquim Floriano, 780 - São Paulo, SP',
    status: 'active',
    documents: [],
    photo: undefined,
  },
  {
    id: '15',
    fullName: 'Thiago Costa Santos',
    cpf: '555.666.777-88',
    position: 'dishwasher',
    admissionDate: '2023-09-01',
    email: 'thiago.costa@giorgiomar.com',
    phone: '(11) 84321-0987',
    address: 'Av. Faria Lima, 2500 - São Paulo, SP',
    status: 'active',
    documents: [],
    photo: undefined,
  },
];

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const EmployeeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);

  const addEmployee = (employeeData: Omit<Employee, 'id' | 'documents'>) => {
    const newEmployee: Employee = {
      ...employeeData,
      id: Date.now().toString(),
      documents: [],
    };
    setEmployees([...employees, newEmployee]);
  };

  const updateEmployee = (id: string, employeeData: Partial<Employee>) => {
    setEmployees(employees.map(emp => 
      emp.id === id ? { ...emp, ...employeeData } : emp
    ));
  };

  const deleteEmployee = (id: string) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  const getEmployeeById = (id: string) => {
    return employees.find(emp => emp.id === id);
  };

  const addDocument = (employeeId: string, documentData: Omit<Document, 'id' | 'uploadDate'>) => {
    const newDocument: Document = {
      ...documentData,
      id: Date.now().toString(),
      uploadDate: new Date().toISOString().split('T')[0],
    };
    
    setEmployees(employees.map(emp => 
      emp.id === employeeId 
        ? { ...emp, documents: [...emp.documents, newDocument] }
        : emp
    ));
  };

  const deleteDocument = (employeeId: string, documentId: string) => {
    setEmployees(employees.map(emp => 
      emp.id === employeeId 
        ? { ...emp, documents: emp.documents.filter(doc => doc.id !== documentId) }
        : emp
    ));
  };

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        getEmployeeById,
        addDocument,
        deleteDocument,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployees must be used within an EmployeeProvider');
  }
  return context;
};