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
    
    // Login & Auth
    'login.title': 'Gestão de Funcionários',
    'login.subtitle': "Giorgio's Mar Azul Restaurante",
    'login.email': 'Email',
    'login.password': 'Senha',
    'login.button': 'Entrar',
    'login.register': 'Criar conta',
    'login.success': 'Login realizado com sucesso!',
    'login.error': 'Email ou senha incorretos',
    'auth.checkEmail': 'Cadastro realizado! Verifique seu e-mail para confirmar sua conta.',
    'auth.passwordResetSent': 'Se o e-mail estiver correto, enviamos um link para redefinir sua senha.',
    'auth.invalidCredentials': 'E-mail ou senha inválidos.',
    'auth.userExists': 'Um usuário com este e-mail já existe.',
    'auth.passwordMinLength': 'A senha deve ter pelo menos 6 caracteres.',
    'auth.passwordsDoNotMatch': 'As senhas não coincidem.',
    'auth.fillAllFields': 'Por favor, preencha todos os campos obrigatórios.',
    'auth.confirmPassword': 'Confirmar Senha',
    
    // Forgot Password
    'forgotPassword.link': 'Esqueceu sua senha?',
    'forgotPassword.title': 'Recuperar Senha',
    'forgotPassword.description': 'Insira seu e-mail para receber as instruções de recuperação de senha.',
    'forgotPassword.button': 'Enviar Instruções',
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
    'dashboard.copy': 'Copiar',
    'dashboard.totalEmployees': 'Total de Funcionários',
    'dashboard.uniquePositions': 'Cargos Únicos',
    
    // Employee Form
    'form.title.new': 'Novo Funcionário',
    'form.title.edit': 'Editar Funcionário',
    'form.personalData': 'Dados Pessoais',
    'form.documents': 'Documentos',
    'form.fullName': 'Nome Completo',
    'form.cpf': 'CPF',
    'form.birthDate': 'Data de Nascimento',
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
    'profile.docDeleted': 'Documento deletado com sucesso!',
    
    // User Profile (Used by ProfileModal)
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
    'receipt.serviceDate': 'Período da Prestação do Serviço',
    'receipt.generate': 'Gerar Recibo',
    'receipt.print': 'Imprimir Recibo',
    'receipt.error.selectEmployee': 'Selecione um funcionário para gerar o recibo.',
    'receipt.error.invalidValue': 'Insira um valor válido.',
    'receipt.error.invalidDate': 'Insira uma data válida.',
    'receipt.receiptTemplate': 'Modelo de Recibo',
    
    // Service Receipt
    'receipt.service.receiptTitle': 'RECIBO',
    'receipt.service.receivedBy': 'EU,',
    'receipt.service.cpfHolder': 'Portador do CPF:',
    'receipt.service.receivedFrom': 'Recebi de GIORGIOS RESTAURANT LTDA a importância de',
    'receipt.service.serviceReference': 'referente a OS SERVICOS PRESTADOS NO ESTABELECIMENTO.',
    'receipt.service.serviceDateLabel': 'Período da Prestação do Serviço:',
    'receipt.service.note': 'Obs.: DOU PLENA QUITAR DO VALOR ACIMA CITADOS.',
    'receipt.service.location': 'PORTO DE GALINHAS – IPOJUCA – PE,',
    
    // Passage Receipt
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
    
    // User Profile Errors
    'userProfile.error.invalidEmail': 'Email inválido.',
    'userProfile.error.passwordLength': 'A senha deve ter pelo menos 6 caracteres.',
    'userProfile.error.passwordMismatch': 'As senhas não coincidem.',
    'userProfile.error.required': 'Este campo é obrigatório.',
  },
  'en-US': {
    // ... (English translations remain the same)
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt-BR');

  const t = (key: string): string => {
    const lang = language as keyof typeof translations;
    return translations[lang]?.[key as keyof typeof translations[typeof lang]] || key;
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