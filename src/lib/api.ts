import { Employee, Document } from '@/contexts/EmployeeProvider';
import { EmployeeFormValues } from '@/lib/validators';

// Mock data movida para a camada de API
const mockFilePlaceholder = 'data:application/pdf;base64,...'; 
let mockEmployees: Employee[] = [
  {
    id: '1',
    fullName: 'Carlos Silva Santos',
    cpf: '123.456.789-00',
    position: 'garcom',
    admissionDate: '2023-01-15',
    email: 'carlos.silva@giorgiomar.com',
    phone: '(11) 98765-4321',
    address: 'Rua das Flores, 123 - São Paulo, SP',
    status: 'active',
    documents: [
      { id: 'd1', type: 'rg', fileName: 'RG_Carlos.pdf', fileData: mockFilePlaceholder, uploadDate: '2023-01-10' },
      { id: 'd2', type: 'cpf', fileName: 'CPF_Carlos.pdf', fileData: mockFilePlaceholder, uploadDate: '2023-01-10' },
    ],
    photo: undefined,
    birthDate: '1995-05-20',
    gender: 'male',
    interviewDate: '2023-01-10',
    testDate: '2023-01-12',
    workSchedule: 'escala 6x1',
  },
  {
    id: '2',
    fullName: 'Maria Oliveira Costa',
    cpf: '234.567.890-11',
    position: 'cozinheiro',
    admissionDate: '2022-06-01',
    email: 'maria.oliveira@giorgiomar.com',
    phone: '(11) 97654-3210',
    address: 'Av. Paulista, 1000 - São Paulo, SP',
    status: 'active',
    documents: [
      { id: 'd3', type: 'rg', fileName: 'RG_Maria.pdf', fileData: mockFilePlaceholder, uploadDate: '2022-05-25' },
      { id: 'd4', type: 'medical', fileName: 'Exame_Maria.pdf', fileData: mockFilePlaceholder, uploadDate: '2022-05-25' },
    ],
    photo: undefined,
    birthDate: '1988-11-15',
    gender: 'female',
    interviewDate: '2022-05-20',
    testDate: '2022-05-25',
    workSchedule: 'escala 5x2',
  },
  {
    id: '3',
    fullName: 'João Pedro Almeida',
    cpf: '345.678.901-22',
    position: 'caixa',
    admissionDate: '2023-03-10',
    email: 'joao.pedro@giorgiomar.com',
    phone: '(11) 96543-2109',
    address: 'Rua Augusta, 500 - São Paulo, SP',
    status: 'active',
    documents: [],
    photo: undefined,
    birthDate: '2000-01-01',
    gender: 'male',
    interviewDate: '2023-03-05',
    testDate: '2023-03-08',
    workSchedule: 'escala 6x1',
  },
  {
    id: '4',
    fullName: 'Ana Carolina Ferreira',
    cpf: '456.789.012-33',
    position: 'auxiliar_administrativo',
    admissionDate: '2021-09-15',
    email: 'ana.carolina@giorgiomar.com',
    phone: '(11) 95432-1098',
    address: 'Rua Consolação, 750 - São Paulo, SP',
    status: 'active',
    documents: [
      { id: 'd5', type: 'contract', fileName: 'Contrato_Ana.pdf', fileData: mockFilePlaceholder, uploadDate: '2021-09-10' },
    ],
    photo: undefined,
    birthDate: '1990-07-22',
    gender: 'female',
    interviewDate: '2021-09-01',
    testDate: '2021-09-10',
    workSchedule: 'escala 5x2',
  },
  {
    id: '5',
    fullName: 'Roberto Lima Souza',
    cpf: '567.890.123-44',
    position: 'cozinheiro',
    admissionDate: '2022-11-20',
    email: 'roberto.lima@giorgiomar.com',
    phone: '(11) 94321-0987',
    address: 'Rua da República, 320 - São Paulo, SP',
    status: 'inactive',
    documents: [],
    photo: undefined,
    birthDate: '1985-03-10',
    gender: 'male',
    interviewDate: '2022-11-10',
    testDate: '2022-11-15',
    workSchedule: 'escala 6x1',
  },
  {
    id: '6',
    fullName: 'Juliana Martins Rocha',
    cpf: '678.901.234-55',
    position: 'atendente',
    admissionDate: '2023-02-01',
    email: 'juliana.martins@giorgiomar.com',
    phone: '(11) 93210-9876',
    address: 'Av. Brigadeiro, 200 - São Paulo, SP',
    status: 'active',
    documents: [],
    photo: undefined,
    birthDate: '1998-09-05',
    gender: 'female',
    interviewDate: '2023-01-25',
    testDate: '2023-01-28',
    workSchedule: 'escala 5x2',
  },
  {
    id: '7',
    fullName: 'Fernando Costa Nunes',
    cpf: '789.012.345-66',
    position: 'acougueiro',
    admissionDate: '2022-08-10',
    email: 'fernando.costa@giorgiomar.com',
    phone: '(11) 92109-8765',
    address: 'Rua Oscar Freire, 890 - São Paulo, SP',
    status: 'active',
    documents: [
      { id: 'd6', type: 'rg', fileName: 'RG_Fernando.pdf', fileData: mockFilePlaceholder, uploadDate: '2022-08-05' },
    ],
    photo: undefined,
    birthDate: '1992-04-18',
    gender: 'male',
    interviewDate: '2022-08-01',
    testDate: '2022-08-05',
    workSchedule: 'escala 6x1',
  },
  {
    id: '8',
    fullName: 'Patrícia Santos Dias',
    cpf: '890.123.456-77',
    position: 'garcom',
    admissionDate: '2023-04-15',
    email: 'patricia.santos@giorgiomar.com',
    phone: '(11) 91098-7654',
    address: 'Rua Haddock Lobo, 450 - São Paulo, SP',
    status: 'active',
    documents: [],
    photo: undefined,
    birthDate: '1997-12-03',
    gender: 'female',
    interviewDate: '2023-04-10',
    testDate: '2023-04-12',
    workSchedule: 'escala 6x1',
  },
  {
    id: '9',
    fullName: 'Ricardo Oliveira Paz',
    cpf: '901.234.567-88',
    position: 'auxiliar_cozinha',
    admissionDate: '2023-05-20',
    email: 'ricardo.oliveira@giorgiomar.com',
    phone: '(11) 90987-6543',
    address: 'Rua dos Pinheiros, 670 - São Paulo, SP',
    status: 'active',
    documents: [],
    photo: undefined,
    birthDate: '1994-02-28',
    gender: 'male',
    interviewDate: '2023-05-15',
    testDate: '2023-05-18',
    workSchedule: 'escala 5x2',
  },
  {
    id: '10',
    fullName: 'Camila Rodrigues Silva',
    cpf: '012.345.678-99',
    position: 'garcom',
    admissionDate: '2022-12-01',
    email: 'camila.rodrigues@giorgiomar.com',
    phone: '(11) 89876-5432',
    address: 'Av. Rebouças, 1200 - São Paulo, SP',
    status: 'inactive',
    documents: [],
    photo: undefined,
    birthDate: '1996-10-10',
    gender: 'female',
    interviewDate: '2022-11-25',
    testDate: '2022-11-28',
    workSchedule: 'escala 6x1',
  },
  {
    id: '11',
    fullName: 'Lucas Henrique Barbosa',
    cpf: '111.222.333-44',
    position: 'cozinheiro',
    admissionDate: '2023-06-01',
    email: 'lucas.henrique@giorgiomar.com',
    phone: '(11) 88765-4321',
    address: 'Rua Bela Cintra, 550 - São Paulo, SP',
    status: 'active',
    documents: [],
    photo: undefined,
    birthDate: '1993-01-25',
    gender: 'male',
    interviewDate: '2023-05-25',
    testDate: '2023-05-28',
    workSchedule: 'escala 5x2',
  },
  {
    id: '12',
    fullName: 'Beatriz Alves Pereira',
    cpf: '222.333.444-55',
    position: 'atendente',
    admissionDate: '2023-07-10',
    email: 'beatriz.alves@giorgiomar.com',
    phone: '(11) 87654-3210',
    address: 'Av. Europa, 890 - São Paulo, SP',
    status: 'active',
    documents: [],
    photo: undefined,
    birthDate: '1999-06-12',
    gender: 'female',
    interviewDate: '2023-07-05',
    testDate: '2023-07-08',
    workSchedule: 'escala 6x1',
  },
  {
    id: '13',
    fullName: 'Gabriel Ferreira Lima',
    cpf: '333.444.555-66',
    position: 'estoquista',
    admissionDate: '2022-10-15',
    email: 'gabriel.ferreira@giorgiomar.com',
    phone: '(11) 86543-2109',
    address: 'Rua Pamplona, 320 - São Paulo, SP',
    status: 'active',
    documents: [],
    photo: undefined,
    birthDate: '1991-08-08',
    gender: 'male',
    interviewDate: '2022-10-10',
    testDate: '2022-10-12',
    workSchedule: 'escala 5x2',
  },
  {
    id: '14',
    fullName: 'Larissa Souza Martins',
    cpf: '444.555.666-77',
    position: 'garcom',
    admissionDate: '2023-08-01',
    email: 'larissa.souza@giorgiomar.com',
    phone: '(11) 85432-1098',
    address: 'Rua Joaquim Floriano, 780 - São Paulo, SP',
    status: 'active',
    documents: [],
    photo: undefined,
    birthDate: '1995-03-17',
    gender: 'female',
    interviewDate: '2023-07-25',
    testDate: '2023-07-28',
    workSchedule: 'escala 6x1',
  },
  {
    id: '15',
    fullName: 'Thiago Costa Santos',
    cpf: '555.666.777-88',
    position: 'servicos_gerais',
    admissionDate: '2023-09-01',
    email: 'thiago.costa@giorgiomar.com',
    phone: '(11) 84321-0987',
    address: 'Av. Faria Lima, 2500 - São Paulo, SP',
    status: 'active',
    documents: [],
    photo: undefined,
    birthDate: '1990-11-29',
    gender: 'male',
    interviewDate: '2023-08-25',
    testDate: '2023-08-28',
    workSchedule: 'escala 5x2',
  },
];

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- Employee API ---

export const fetchEmployees = async (): Promise<Employee[]> => {
  await simulateDelay(500);
  return JSON.parse(JSON.stringify(mockEmployees)); // Retorna uma cópia para simular imutabilidade
};

export const addEmployee = async (employeeData: EmployeeFormValues): Promise<Employee> => {
  await simulateDelay(500);
  const newEmployee: Employee = {
    ...employeeData,
    id: Date.now().toString(),
    documents: [],
  };
  mockEmployees.push(newEmployee);
  return newEmployee;
};

export const updateEmployee = async (id: string, employeeData: Partial<Employee>): Promise<Employee> => {
    await simulateDelay(500);
    let updatedEmployee: Employee | undefined;
    mockEmployees = mockEmployees.map(emp => {
        if (emp.id === id) {
            updatedEmployee = { ...emp, ...employeeData };
            return updatedEmployee;
        }
        return emp;
    });
    if (!updatedEmployee) throw new Error("Funcionário não encontrado");
    return updatedEmployee;
};

export const deleteEmployee = async (id: string): Promise<{ id: string }> => {
    await simulateDelay(500);
    const initialLength = mockEmployees.length;
    mockEmployees = mockEmployees.filter(emp => emp.id !== id);
    if (mockEmployees.length === initialLength) throw new Error("Funcionário não encontrado");
    return { id };
};

// --- Document API ---

export const addDocumentToEmployee = async (employeeId: string, documentData: Omit<Document, 'id' | 'uploadDate'>): Promise<Document> => {
    await simulateDelay(400);
    const newDocument: Document = {
        ...documentData,
        id: Date.now().toString(),
        uploadDate: new Date().toISOString().split('T')[0],
    };
    
    let found = false;
    mockEmployees = mockEmployees.map(emp => {
        if (emp.id === employeeId) {
            found = true;
            return { ...emp, documents: [...emp.documents, newDocument] };
        }
        return emp;
    });

    if (!found) throw new Error("Funcionário não encontrado");
    return newDocument;
};

export const deleteDocumentFromEmployee = async (employeeId: string, documentId: string): Promise<{ documentId: string }> => {
    await simulateDelay(400);
    let found = false;
    mockEmployees = mockEmployees.map(emp => {
        if (emp.id === employeeId) {
            found = true;
            return { ...emp, documents: emp.documents.filter(doc => doc.id !== documentId) };
        }
        return emp;
    });

    if (!found) throw new Error("Funcionário não encontrado");
    return { documentId };
};