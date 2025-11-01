import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'pt-BR' | 'en-US';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  'pt-BR': {
    // Header
    'language': 'Idioma',
    'logout': 'Sair',
    'profile': 'Perfil',
    
    // Login
    'login.title': 'Gestão de Funcionários',
    'login.subtitle': "Giorgio's Mar Azul Restaurante",
    'login.email': 'Email',
    'login.password': 'Senha',
    'login.button': 'Entrar',
    'login.register': 'Criar conta',
    'login.success': 'Login realizado com sucesso!',
    'login.error': 'Email ou senha incorretos',
    
    // Dashboard
    'dashboard.title': 'Funcionários',
    'dashboard.addNew': 'Novo Funcionário',
    'dashboard.search': 'Buscar por nome ou cargo...',
    'dashboard.allStatus': 'Todos',
    'dashboard.active': 'Ativos',
    'dashboard.inactive': 'Inativos',
    'dashboard.name': 'Nome',
    'dashboard.position': 'Cargo',
    'dashboard.email': 'Email',
    'dashboard.phone': 'Telefone',
    'dashboard.status': 'Status',
    'dashboard.actions': 'Ações',
    'dashboard.edit': 'Editar',
    'dashboard.delete': 'Deletar',
    'dashboard.view': 'Ver Perfil',
    'dashboard.deleteConfirm': 'Tem certeza que deseja deletar este funcionário?',
    'dashboard.deleteSuccess': 'Funcionário deletado com sucesso!',
    
    // Employee Form
    'form.title.new': 'Novo Funcionário',
    'form.title.edit': 'Editar Funcionário',
    'form.personalData': 'Dados Pessoais',
    'form.documents': 'Documentos',
    'form.fullName': 'Nome Completo',
    'form.cpf': 'CPF',
    'form.position': 'Cargo',
    'form.admissionDate': 'Data de Admissão',
    'form.email': 'Email',
    'form.phone': 'Telefone',
    'form.address': 'Endereço',
    'form.status': 'Status',
    'form.save': 'Salvar',
    'form.cancel': 'Cancelar',
    'form.uploadDoc': 'Upload de Documento',
    'form.docType': 'Tipo de Documento',
    'form.selectFile': 'Selecionar Arquivo',
    'form.upload': 'Fazer Upload',
    'form.success': 'Funcionário salvo com sucesso!',
    'form.error': 'Erro ao salvar funcionário',
    
    // Employee Profile
    'profile.title': 'Perfil do Funcionário',
    'profile.details': 'Detalhes',
    'profile.documents': 'Documentos',
    'profile.uploadedDocs': 'Documentos Enviados',
    'profile.noDocuments': 'Nenhum documento enviado',
    'profile.deleteDoc': 'Deletar documento',
    'profile.docDeleted': 'Documento deletado com sucesso!',
    
    // Positions
    'position.waiter': 'Garçom',
    'position.chef': 'Chefe de Cozinha',
    'position.souschef': 'Subchefe',
    'position.cook': 'Cozinheiro',
    'position.dishwasher': 'Auxiliar de Cozinha',
    'position.manager': 'Gerente',
    'position.host': 'Recepcionista',
    'position.bartender': 'Barman',
    
    // Document Types
    'docType.rg': 'RG',
    'docType.cpf': 'CPF',
    'docType.medical': 'Exame Médico',
    'docType.contract': 'Contrato',
    'docType.other': 'Outro',
  },
  'en-US': {
    // Header
    'language': 'Language',
    'logout': 'Logout',
    'profile': 'Profile',
    
    // Login
    'login.title': 'Employee Management',
    'login.subtitle': "Giorgio's Mar Azul Restaurant",
    'login.email': 'Email',
    'login.password': 'Password',
    'login.button': 'Sign In',
    'login.register': 'Create account',
    'login.success': 'Login successful!',
    'login.error': 'Invalid email or password',
    
    // Dashboard
    'dashboard.title': 'Employees',
    'dashboard.addNew': 'New Employee',
    'dashboard.search': 'Search by name or position...',
    'dashboard.allStatus': 'All',
    'dashboard.active': 'Active',
    'dashboard.inactive': 'Inactive',
    'dashboard.name': 'Name',
    'dashboard.position': 'Position',
    'dashboard.email': 'Email',
    'dashboard.phone': 'Phone',
    'dashboard.status': 'Status',
    'dashboard.actions': 'Actions',
    'dashboard.edit': 'Edit',
    'dashboard.delete': 'Delete',
    'dashboard.view': 'View Profile',
    'dashboard.deleteConfirm': 'Are you sure you want to delete this employee?',
    'dashboard.deleteSuccess': 'Employee deleted successfully!',
    
    // Employee Form
    'form.title.new': 'New Employee',
    'form.title.edit': 'Edit Employee',
    'form.personalData': 'Personal Data',
    'form.documents': 'Documents',
    'form.fullName': 'Full Name',
    'form.cpf': 'Tax ID',
    'form.position': 'Position',
    'form.admissionDate': 'Admission Date',
    'form.email': 'Email',
    'form.phone': 'Phone',
    'form.address': 'Address',
    'form.status': 'Status',
    'form.save': 'Save',
    'form.cancel': 'Cancel',
    'form.uploadDoc': 'Document Upload',
    'form.docType': 'Document Type',
    'form.selectFile': 'Select File',
    'form.upload': 'Upload',
    'form.success': 'Employee saved successfully!',
    'form.error': 'Error saving employee',
    
    // Employee Profile
    'profile.title': 'Employee Profile',
    'profile.details': 'Details',
    'profile.documents': 'Documents',
    'profile.uploadedDocs': 'Uploaded Documents',
    'profile.noDocuments': 'No documents uploaded',
    'profile.deleteDoc': 'Delete document',
    'profile.docDeleted': 'Document deleted successfully!',
    
    // Positions
    'position.waiter': 'Waiter',
    'position.chef': 'Head Chef',
    'position.souschef': 'Sous Chef',
    'position.cook': 'Cook',
    'position.dishwasher': 'Kitchen Assistant',
    'position.manager': 'Manager',
    'position.host': 'Host',
    'position.bartender': 'Bartender',
    
    // Document Types
    'docType.rg': 'ID Card',
    'docType.cpf': 'Tax ID',
    'docType.medical': 'Medical Exam',
    'docType.contract': 'Contract',
    'docType.other': 'Other',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt-BR');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['pt-BR']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
