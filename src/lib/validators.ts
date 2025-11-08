import * as z from 'zod';

export const employeeSchema = z.object({
  fullName: z.string().min(3, 'O nome completo é obrigatório.'),
  cpf: z.string().refine(cpf => cpf.replace(/\D/g, '').length === 11, 'CPF deve ter 11 dígitos.'),
  birthDate: z.string().min(1, 'A data de nascimento é obrigatória.'),
  gender: z.enum(['male', 'female', 'other'], { required_error: 'O gênero é obrigatório.' }),
  position: z.string().min(1, 'O cargo é obrigatório.'),
  workSchedule: z.enum(['escala 6x1', 'escala 5x2']),
  interviewDate: z.string().min(1, 'A data da entrevista é obrigatória.'),
  testDate: z.string().min(1, 'A data do teste é obrigatória.'),
  admissionDate: z.string().min(1, 'A data de admissão é obrigatória.'),
  email: z.string().email('Email inválido.'),
  phone: z.string().refine(phone => phone.replace(/\D/g, '').length >= 10, 'O telefone deve ter pelo menos 10 dígitos.'),
  address: z.string().min(5, 'O endereço é obrigatório.'),
  status: z.enum(['active', 'inactive']),
  photo: z.string().optional(),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;