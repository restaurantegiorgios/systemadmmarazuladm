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
    
    // App Info
    'login.title': 'Gestão de Funcionários',
    'login.subtitle': "Giorgio's Mar Azul Restaurante",
    
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
    'dashboard.deleteConfirm': 'Tem certeza que deseja deletar este funcionário? Todos os seus documentos também serão excluídos permanentemente.',
    'dashboard.deleteSuccess': 'Funcionário deletado com sucesso!',
    'dashboard.copy': 'Copiar',
    'dashboard.totalEmployees': 'Total de Funcionários',
    'dashboard.uniquePositions': 'Cargos Únicos',
    'dashboard.totalMen': 'Total de Homens',
    'dashboard.totalWomen': 'Total de Mulheres',
    'dashboard.export': 'Exportar',
    'dashboard.exportTitle': 'Exportar Dados de Funcionários',
    'dashboard.exportDescription': 'Selecione as colunas que deseja incluir no arquivo exportado.',
    'dashboard.selectAllColumns': 'Selecionar Todas',
    'dashboard.shareView': 'Compartilhar',
    'dashboard.shareSuccess': 'Link com filtros copiado para a área de transferência!',
    
    // Employee Form
    'form.title.new': 'Novo Funcionário',
    'form.title.edit': 'Editar Funcionário',
    'form.personalData': 'Dados Pessoais',
    'form.documents': 'Documentos',
    'form.fullName': 'Nome Completo',
    'form.cpf': 'CPF',
    'form.birthDate': 'Data de Nascimento',
    'form.gender': 'Gênero',
    'form.position': 'Cargo',
    'form.admissionDate': 'Data de Admissão',
    'form.interviewDate': 'Data de Entrevista',
    'form.testDate': 'Data de Teste',
    'form.workSchedule': 'Escala de Trabalho',
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
    'form.notAvailable': 'Não Informado',
    
    // Employee Profile
    'profile.title': 'Perfil do Funcionário',
    'profile.details': 'Detalhes',
    'profile.documents': 'Documentos',
    'profile.uploadedDocs': 'Documentos Enviados',
    'profile.noDocuments': 'Nenhum documento enviado',
    'profile.deleteDoc': 'Deletar documento',
    'profile.deleteDocConfirm': 'Tem certeza que deseja deletar este documento? Esta ação não pode ser desfeita.',
    'profile.docDeleted': 'Documento deletado com sucesso!',
    'userProfile.changePhoto': 'Alterar Foto',
    'userProfile.removePhoto': 'Remover Foto',
    'profile.yearsOld': 'anos',
    
    // Receipt Generator
    'receipt.title': 'Gerador de Recibos',
    'receipt.type': 'Tipo de Recibo',
    'receipt.type.service': 'Recibo de Serviços Diversos',
    'receipt.type.passage': 'Recibo de Passagem',
    'receipt.selectEmployee': 'Selecione o Funcionário',
    'receipt.value': 'Valor do Pagamento (R$)',
    'receipt.serviceDate': 'Período da Prestação do Serviço',
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
    'receipt.service.serviceDateLabel': 'Período da Prestação do Serviço:',
    'receipt.service.note': 'Obs.: DOU PLENA QUITAR DO VALOR ACIMA CITADOS.',
    'receipt.service.location': 'PORTO DE GALINHAS – IPOJUCA – PE,',
    
    // Passage Receipt (Recibo de Passagem)
    'receipt.passage.declarationTitle': 'DECLARAÇÃO RECIBO DE PASSAGEM',
    'receipt.passage.receivedBy': 'Eu,',
    'receipt.passage.cpfHolder': 'portador(a) do CPF nº',
    'receipt.passage.receivedFrom': 'recebi de GIORGIOS RESTAURANT LTDA',
    'receipt.passage.amount': 'a importância de R$',
    'receipt.passage.dateRealized': '(realizada no dia',
    'receipt.passage.useCurrentRealizationDate': 'Usar data de realização atual',
    'receipt.passage.setRealizationDate': 'Data de Realização',
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
    'position.garcom': 'Garçom',
    'position.estoquista': 'Estoquista',
    'position.caixa': 'Caixa',
    'position.atendente': 'Atendente',
    'position.acougueiro': 'Açougueiro',
    'position.cozinheiro': 'Cozinheiro',
    'position.servicos_gerais': 'Serviços Gerais',
    'position.auxiliar_cozinha': 'Auxiliar de Cozinha',
    'position.auxiliar_administrativo': 'Auxiliar Administrativo',

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

    // Gender
    'gender.male': 'Masculino',
    'gender.female': 'Feminino',
    'gender.other': 'Outro',
  },
  'en-US': {
    // Header
    'language': 'Language',
    
    // App Info
    'login.title': 'Employee Management',
    'login.subtitle': "Giorgio's Mar Azul Restaurant",

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
    'dashboard.deleteConfirm': 'Are you sure you want to delete this employee? All of their documents will also be permanently deleted.',
    'dashboard.deleteSuccess': 'Employee deleted successfully!',
    'dashboard.copy': 'Copy',
    'dashboard.totalEmployees': 'Total Employees',
    'dashboard.uniquePositions': 'Unique Positions',
    'dashboard.totalMen': 'Total Men',
    'dashboard.totalWomen': 'Total Women',
    'dashboard.export': 'Export',
    'dashboard.exportTitle': 'Export Employee Data',
    'dashboard.exportDescription': 'Select the columns you want to include in the exported file.',
    'dashboard.selectAllColumns': 'Select All',
    'dashboard.shareView': 'Share Filters',
    'dashboard.shareSuccess': 'Link with filters copied to clipboard!',

    // Employee Form
    'form.title.new': 'New Employee',
    'form.title.edit': 'Edit Employee',
    'form.personalData': 'Personal Data',
    'form.documents': 'Documents',
    'form.fullName': 'Full Name',
    'form.cpf': 'Tax ID',
    'form.birthDate': 'Birth Date',
    'form.gender': 'Gender',
    'form.position': 'Position',
    'form.admissionDate': 'Admission Date',
    'form.interviewDate': 'Interview Date',
    'form.testDate': 'Test Date',
    'form.workSchedule': 'Work Schedule',
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
    'form.notAvailable': 'Not Available',
    
    // Employee Profile
    'profile.title': 'Employee Profile',
    'profile.details': 'Details',
    'profile.documents': 'Documents',
    'profile.uploadedDocs': 'Uploaded Documents',
    'profile.noDocuments': 'No documents uploaded',
    'profile.deleteDoc': 'Delete document',
    'profile.deleteDocConfirm': 'Are you sure you want to delete this document? This action cannot be undone.',
    'profile.docDeleted': 'Document deleted successfully!',
    'userProfile.changePhoto': 'Change Photo',
    'userProfile.removePhoto': 'Remove Photo',
    'profile.yearsOld': 'years old',

    // Receipt Generator
    'receipt.title': 'Receipt Generator',
    'receipt.type': 'Receipt Type',
    'receipt.type.service': 'Service Receipt',
    'receipt.type.passage': 'Passage Receipt',
    'receipt.selectEmployee': 'Select Employee',
    'receipt.value': 'Payment Value (R$)',
    'receipt.serviceDate': 'Service Provision Period',
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
    'receipt.service.serviceDateLabel': 'Service Provision Period:',
    'receipt.service.note': 'Note: I GIVE FULL DISCHARGE OF THE ABOVE CITED VALUE.',
    'receipt.service.location': 'PORTO DE GALINHAS – IPOJUCA – PE,',
    
    // Passage Receipt (Recibo de Passagem)
    'receipt.passage.declarationTitle': 'PASSAGE RECEIPT DECLARATION',
    'receipt.passage.receivedBy': 'I,',
    'receipt.passage.cpfHolder': 'CPF Holder No.',
    'receipt.passage.receivedFrom': 'received from GIORGIOS RESTAURANT LTDA',
    'receipt.passage.amount': 'the amount of R$',
    'receipt.passage.dateRealized': '(realized on',
    'receipt.passage.useCurrentRealizationDate': 'Use current realization date',
    'receipt.passage.setRealizationDate': 'Realization Date',
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
    'position.garcom': 'Waiter',
    'position.estoquista': 'Stocker',
    'position.caixa': 'Cashier',
    'position.atendente': 'Attendant',
    'position.acougueiro': 'Butcher',
    'position.cozinheiro': 'Cook',
    'position.servicos_gerais': 'General Services',
    'position.auxiliar_cozinha': 'Kitchen Assistant',
    'position.auxiliar_administrativo': 'Administrative Assistant',

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

    // Gender
    'gender.male': 'Male',
    'gender.female': 'Female',
    'gender.other': 'Other',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Chave para o localStorage
const LANGUAGE_STORAGE_KEY = 'app-language';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Tenta ler do localStorage na inicialização, com 'pt-BR' como padrão
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (storedLanguage === 'pt-BR' || storedLanguage === 'en-US') {
        return storedLanguage;
      }
    } catch (error) {
      console.error("Não foi possível acessar o localStorage:", error);
    }
    return 'pt-BR';
  });

  // Função para definir o idioma e salvar no localStorage
  const setLanguage = (lang: Language) => {
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch (error) {
      console.error("Não foi possível salvar no localStorage:", error);
    }
    setLanguageState(lang);
  };

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