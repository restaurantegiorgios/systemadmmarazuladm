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
    
    // Forgot Password (NEW)
    'forgotPassword.link': 'Esqueceu sua senha?',
    'forgotPassword.title': 'Recuperar Senha',
    'forgotPassword.description': 'Insira seu email e a nova senha desejada. Você será logado automaticamente após a redefinição.',
    'forgotPassword.newPassword': 'Nova Senha',
    'forgotPassword.confirmNewPassword': 'Confirmar Nova Senha',
    'forgotPassword.resetButton': 'Redefinir Senha',
    'forgotPassword.success': 'Senha redefinida com sucesso!',
    'forgotPassword.error.emailNotFound': 'Email não encontrado no sistema.',
    'forgotPassword.error.generic': 'Erro ao redefinir a senha.',
    
    // Dashboard
    'dashboard.title': 'Funcionários',
    'dashboard.addNew': 'Novo Funcionário',
    'dashboard.search': 'Buscar por nome ou cargo...',
    'dashboard.allStatus': 'Todos',
    'dashboard.allPositions': 'Todos os Cargos',
    'dashboard.active': 'Ativos',
    'dashboard.inactive': 'Inativos',
    'dashboard.photo': 'Foto',
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
    'dashboard.copy': 'Copiar', // Added copy key
    'dashboard.totalEmployees': 'Total de Funcionários', // NEW
    'dashboard.uniquePositions': 'Cargos Únicos', // NEW
    
    // Employee Form
    'form.title.new': 'Novo Funcionário',
    'form.title.edit': 'Editar Funcionário',
    'form.personalData': 'Dados Pessoais',
    'form.documents': 'Documentos',
    'form.fullName': 'Nome Completo',
    'form.cpf': 'CPF',
    'form.position': 'Cargo',
    'form.admissionDate': 'Data de Admissão',
    'form.interviewDate': 'Data de Entrevista', // NEW
    'form.testDate': 'Data de Teste',           // NEW
    'form.workSchedule': 'Escala de Trabalho',  // NEW
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
    'form.optional': 'Opcional',
    
    // Employee Profile
    'profile.title': 'Perfil do Funcionário',
    'profile.details': 'Detalhes',
    'profile.documents': 'Documentos',
    'profile.uploadedDocs': 'Documentos Enviados',
    'profile.noDocuments': 'Nenhum documento enviado',
    'profile.deleteDoc': 'Deletar documento',
    'profile.docDeleted': 'Documento deletado com sucesso!',
    
    // User Profile (Used by ProfileModal) - NEW/MAPPED KEYS
    'userProfile.title': 'Editar Perfil',
    'userProfile.description': 'Atualize suas informações de conta.',
    'userProfile.firstName': 'Nome',
    'userProfile.lastName': 'Sobrenome',
    'userProfile.changePhoto': 'Alterar Foto',
    'userProfile.save': 'Salvar Alterações',
    'userProfile.success': 'Perfil atualizado com sucesso!',
    
    // Receipt Generator
    'receipt.title': 'Gerador de Recibos',
    'receipt.type': 'Tipo de Recibo',
    'receipt.type.service': 'Recibo de Serviços Diversos',
    'receipt.type.passage': 'Recibo de Passagem',
    'receipt.selectEmployee': 'Selecione o Funcionário',
    'receipt.value': 'Valor do Pagamento (R$)',
    'receipt.serviceDate': 'Período da Prestação do Serviço', // UPDATED
    'receipt.generate': 'Gerar Recibo',
    'receipt.print': 'Imprimir Recibo',
    'receipt.error.selectEmployee': 'Selecione um funcionário para gerar o recibo.',
    'receipt.error.invalidValue': 'Insira um valor válido.',
    'receipt.error.invalidDate': 'Insira uma data válida.',
    'receipt.receiptTemplate': 'Modelo de Recibo',
    
    // Service Receipt (Recibo de Serviços Diversos)
    'receipt.service.receiptTitle': 'RECIBO',
    'receipt.service.receivedBy': 'EU,',
    'receipt.service.cpfHolder': 'Portador do CPF:',
    'receipt.service.receivedFrom': 'Recebi de GIORGIOS RESTAURANT LTDA a importância de',
    'receipt.service.serviceReference': 'referente a OS SERVICOS PRESTADOS NO ESTABELECIMENTO.',
    'receipt.service.serviceDateLabel': 'Período da Prestação do Serviço:', // UPDATED
    'receipt.service.note': 'Obs.: DOU PLENA QUITAR DO VALOR ACIMA CITADOS.',
    'receipt.service.location': 'PORTO DE GALINHAS – IPOJUCA – PE,',
    
    // Passage Receipt (Recibo de Passagem) - NEW
    'receipt.passage.declarationTitle': 'DECLARAÇÃO RECIBO DE PASSAGEM',
    'receipt.passage.receivedBy': 'Eu,',
    'receipt.passage.cpfHolder': 'portador(a) do CPF nº',
    'receipt.passage.receivedFrom': 'recebi de GIORGIOS RESTAURANT LTDA',
    'receipt.passage.amount': 'a importância de R$',
    'receipt.passage.dateRealized': '(realizada no dia',
    'receipt.passage.dateRealizedLabel': 'Data de Realização', // NEW
    'receipt.passage.reference': '), referente ao pagamento de passagem de transporte destinados aos dias:',
    'receipt.passage.paymentMethod': 'Forma de pagamento:',
    'receipt.passage.paymentMethod.cash': 'Dinheiro',
    'receipt.passage.paymentMethod.pix': 'Pix',
    'receipt.passage.paymentMethod.transfer': 'Transferência',
    'receipt.passage.paymentMethod.other': 'Outro:',
    'receipt.passage.origin': 'Origem:',
    'receipt.passage.destination': 'Destino:',
    'receipt.passage.passageValue': 'Valor da passagem: R$',
    'receipt.passage.fullDischarge': 'Declaro que recebi o valor acima descrito, dando plena e geral quitação.',
    'receipt.passage.receiver': 'Recebedor:',
    'receipt.passage.responsible': 'RESPONSÁVEL:',
    'receipt.passage.daysPlaceholder': 'Dias de Serviço (ex: 01/01/2024, 02/01/2024)',
    'receipt.passage.originPlaceholder': 'Ex: Casa',
    'receipt.passage.destinationPlaceholder': 'Ex: Restaurante',
    'receipt.passage.error.daysRequired': 'Informe os dias de serviço.',
    'receipt.passage.error.originRequired': 'Informe a origem.',
    'receipt.passage.error.destinationRequired': 'Informe o destino.',
    'receipt.passage.error.paymentMethodRequired': 'Selecione a forma de pagamento.',
    
    // Positions
    'position.waiter': 'Garçom',
    'position.chef': 'Chefe de Cozinha',
    'position.souschef': 'Subchefe',
    'position.cook': 'Cozinheiro',
    'position.dishwasher': 'Auxiliar de Cozinha',
    'position.manager': 'Gerente',
    'position.host': 'Recepcionista',
    'position.bartender': 'Barman',

    // Work Schedules
    'schedule.escala 6x1': 'Escala 6x1',
    'schedule.escala 5x2': 'Escala 5x2',
    
    // Document Types
    'docType.all': 'Todos os Documentos',
    'docType.rg': 'RG',
    'docType.cpf': 'CPF',
    'docType.medical': 'Exame Médico',
    'docType.contract': 'Contrato',
    'docType.other': 'Outro',
    
    // User Profile Errors (used by Forgot Password too)
    'userProfile.error.invalidEmail': 'Email inválido.',
    'userProfile.error.passwordLength': 'A senha deve ter pelo menos 6 caracteres.',
    'userProfile.error.passwordMismatch': 'As senhas não coincidem.',
    'userProfile.error.required': 'Este campo é obrigatório.', // Added missing key
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
    
    // Forgot Password (NEW)
    'forgotPassword.link': 'Forgot your password?',
    'forgotPassword.title': 'Password Recovery',
    'forgotPassword.description': 'Enter your email and the desired new password. You will be automatically logged in after resetting.',
    'forgotPassword.newPassword': 'New Password',
    'forgotPassword.confirmNewPassword': 'Confirm New Password',
    'forgotPassword.resetButton': 'Reset Password',
    'forgotPassword.success': 'Password reset successfully!',
    'forgotPassword.error.emailNotFound': 'Email not found in the system.',
    'forgotPassword.error.generic': 'Error resetting password.',

    // Dashboard
    'dashboard.title': 'Employees',
    'dashboard.addNew': 'New Employee',
    'dashboard.search': 'Search by name or position...',
    'dashboard.allStatus': 'All',
    'dashboard.allPositions': 'All Positions',
    'dashboard.active': 'Active',
    'dashboard.inactive': 'Inactive',
    'dashboard.photo': 'Photo',
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
    'dashboard.copy': 'Copy', // Added copy key
    'dashboard.totalEmployees': 'Total Employees', // NEW
    'dashboard.uniquePositions': 'Unique Positions', // NEW

    // Employee Form
    'form.title.new': 'New Employee',
    'form.title.edit': 'Edit Employee',
    'form.personalData': 'Personal Data',
    'form.documents': 'Documents',
    'form.fullName': 'Full Name',
    'form.cpf': 'Tax ID',
    'form.position': 'Position',
    'form.admissionDate': 'Admission Date',
    'form.interviewDate': 'Interview Date', // NEW
    'form.testDate': 'Test Date',           // NEW
    'form.workSchedule': 'Work Schedule',  // NEW
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
    'form.optional': 'Optional',
    
    // Employee Profile
    'profile.title': 'Employee Profile',
    'profile.details': 'Details',
    'profile.documents': 'Documents',
    'profile.uploadedDocs': 'Uploaded Documents',
    'profile.noDocuments': 'No documents uploaded',
    'profile.deleteDoc': 'Delete document',
    'profile.docDeleted': 'Document deleted successfully!',
    
    // User Profile (Used by ProfileModal) - NEW/MAPPED KEYS
    'userProfile.title': 'Edit Profile',
    'userProfile.description': 'Update your account information.',
    'userProfile.firstName': 'First Name',
    'userProfile.lastName': 'Last Name',
    'userProfile.changePhoto': 'Change Photo',
    'userProfile.save': 'Save Changes',
    'userProfile.success': 'Profile updated successfully!',

    // Receipt Generator
    'receipt.title': 'Receipt Generator',
    'receipt.type': 'Receipt Type',
    'receipt.type.service': 'Service Receipt',
    'receipt.type.passage': 'Passage Receipt',
    'receipt.selectEmployee': 'Select Employee',
    'receipt.value': 'Payment Value (R$)',
    'receipt.serviceDate': 'Service Provision Period', // UPDATED
    'receipt.generate': 'Generate Receipt',
    'receipt.print': 'Print Receipt',
    'receipt.error.selectEmployee': 'Select an employee to generate the receipt.',
    'receipt.error.invalidValue': 'Enter a valid value.',
    'receipt.error.invalidDate': 'Enter a valid date.',
    'receipt.receiptTemplate': 'Receipt Template',

    // Service Receipt (Recibo de Serviços Diversos)
    'receipt.service.receiptTitle': 'RECEIPT',
    'receipt.service.receivedBy': 'I,',
    'receipt.service.cpfHolder': 'CPF Holder:',
    'receipt.service.receivedFrom': 'Received from GIORGIOS RESTAURANT LTDA the amount of',
    'receipt.service.serviceReference': 'referring to SERVICES PROVIDED AT THE ESTABLISHMENT.',
    'receipt.service.serviceDateLabel': 'Service Provision Period:', // UPDATED
    'receipt.service.note': 'Note: I GIVE FULL DISCHARGE OF THE ABOVE CITED VALUE.',
    'receipt.service.location': 'PORTO DE GALINHAS – IPOJUCA – PE,',
    
    // Passage Receipt (Recibo de Passagem) - NEW
    'receipt.passage.declarationTitle': 'PASSAGE RECEIPT DECLARATION',
    'receipt.passage.receivedBy': 'I,',
    'receipt.passage.cpfHolder': 'CPF Holder No.',
    'receipt.passage.receivedFrom': 'received from GIORGIOS RESTAURANT LTDA',
    'receipt.passage.amount': 'the amount of R$',
    'receipt.passage.dateRealized': '(realized on',
    'receipt.passage.dateRealizedLabel': 'Date Realized', // NEW
    'receipt.passage.reference': '), referring to the payment of transport passage destined for the days:',
    'receipt.passage.paymentMethod': 'Payment Method:',
    'receipt.passage.paymentMethod.cash': 'Cash',
    'receipt.passage.paymentMethod.pix': 'Pix',
    'receipt.passage.paymentMethod.transfer': 'Transfer',
    'receipt.passage.paymentMethod.other': 'Other:',
    'receipt.passage.origin': 'Origin:',
    'receipt.passage.destination': 'Destination:',
    'receipt.passage.passageValue': 'Passage Value: R$',
    'receipt.passage.fullDischarge': 'I declare that I received the value described above, giving full and general discharge.',
    'receipt.passage.receiver': 'Receiver:',
    'receipt.passage.responsible': 'RESPONSÁVEL:',
    'receipt.passage.daysPlaceholder': 'Service Days (e.g.: 01/01/2024, 02/01/2024)',
    'receipt.passage.originPlaceholder': 'Ex: Home',
    'receipt.passage.destinationPlaceholder': 'Ex: Restaurant',
    'receipt.passage.error.daysRequired': 'Please inform the service days.',
    'receipt.passage.error.originRequired': 'Please inform the origin.',
    'receipt.passage.error.destinationRequired': 'Please inform the destination.',
    'receipt.passage.error.paymentMethodRequired': 'Please select the payment method.',

    // Positions
    'position.waiter': 'Waiter',
    'position.chef': 'Head Chef',
    'position.souschef': 'Sous Chef',
    'position.cook': 'Cook',
    'position.dishwasher': 'Kitchen Assistant',
    'position.manager': 'Manager',
    'position.host': 'Host',
    'position.bartender': 'Bartender',

    // Work Schedules
    'schedule.escala 6x1': 'Schedule 6x1',
    'schedule.escala 5x2': 'Schedule 5x2',
    
    // Document Types
    'docType.all': 'All Documents',
    'docType.rg': 'ID Card',
    'docType.cpf': 'Tax ID',
    'docType.medical': 'Medical Exam',
    'docType.contract': 'Contract',
    'docType.other': 'Other',
    
    // User Profile Errors (used by Forgot Password too)
    'userProfile.error.invalidEmail': 'Invalid email.',
    'userProfile.error.passwordLength': 'Password must be at least 6 characters.',
    'userProfile.error.passwordMismatch': 'Passwords do not match.',
    'userProfile.error.required': 'This field is required.', // Added missing key
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