import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEmployees, Employee, Document } from '@/contexts/EmployeeProvider';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ArrowLeft, Printer } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Import modular components
import EmployeeProfileHeader from '@/components/employee/EmployeeProfileHeader';
import EmployeeDocumentsTab from '@/components/employee/EmployeeDocumentsTab';
import EmployeePrintTemplate from '@/components/employee/EmployeePrintTemplate';
import EmployeeDetailsTab from '@/components/employee/EmployeeDetailsTab';
import { capitalizeName } from '@/lib/utils';

type DocumentTypeKey = 'all' | 'rg' | 'cpf' | 'medical' | 'contract' | 'other';

const documentTypes: DocumentTypeKey[] = ['all', 'rg', 'cpf', 'medical', 'contract', 'other'];

const EmployeeProfile = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const { getEmployeeById, updateEmployee, addDocument, deleteDocument } = useEmployees();
  const navigate = useNavigate();
  
  const initialEmployee = id ? getEmployeeById(id) : null;
  const printRef = useRef<HTMLDivElement>(null); // Ref for the print template

  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState<Partial<Employee>>({});
  
  // State for document upload form
  const [uploadDocType, setUploadDocType] = useState('rg');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // State for document filtering
  const [documentFilter, setDocumentFilter] = useState<DocumentTypeKey>('all');
  
  const [docToDelete, setDocToDelete] = useState<string | null>(null); // State for confirmation dialog

  useEffect(() => {
    if (initialEmployee) {
      setEditableData({
        fullName: initialEmployee.fullName,
        cpf: initialEmployee.cpf,
        position: initialEmployee.position,
        admissionDate: initialEmployee.admissionDate,
        email: initialEmployee.email,
        phone: initialEmployee.phone,
        address: initialEmployee.address,
        status: initialEmployee.status,
        photo: initialEmployee.photo,
        // NEW FIELDS
        birthDate: initialEmployee.birthDate,
        gender: initialEmployee.gender,
        interviewDate: initialEmployee.interviewDate,
        testDate: initialEmployee.testDate,
        workSchedule: initialEmployee.workSchedule,
      });
    }
  }, [initialEmployee]);

  const filteredDocuments = useMemo(() => {
    if (!initialEmployee) return [];
    if (documentFilter === 'all') {
      return initialEmployee.documents;
    }
    return initialEmployee.documents.filter(doc => doc.type === documentFilter);
  }, [initialEmployee, documentFilter]);

  // --- Utility Functions ---
  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const getInitials = (fullName: string) => {
    const parts = fullName.split(' ').filter(p => p.length > 0);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
  };
  // -------------------------

  // --- Handlers for Details Tab ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    let formattedValue = value;

    if (id === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (id === 'phone') {
      formattedValue = formatPhone(value);
    } else if (id === 'fullName') {
      // Aplica a capitalização ao digitar, mas o salvamento final garante a formatação correta
      formattedValue = capitalizeName(value);
    }

    setEditableData(prev => ({ ...prev, [id]: formattedValue }));
  };

  const handleSelectChange = (id: keyof Employee, value: string) => {
    setEditableData(prev => ({ ...prev, [id]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditableData(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!id || !initialEmployee) return;

    // Aplica a capitalização final ao nome antes de salvar
    const finalData = {
        ...editableData,
        fullName: editableData.fullName ? capitalizeName(editableData.fullName) : initialEmployee.fullName,
    };

    // Basic validation check for required fields
    if (!finalData.fullName || !finalData.cpf || !finalData.admissionDate || !finalData.email || !finalData.phone || !finalData.address || !finalData.interviewDate || !finalData.testDate || !finalData.workSchedule || !finalData.birthDate || !finalData.gender) {
        toast.error(t('form.error'));
        return;
    }

    updateEmployee(id, finalData);
    toast.success(t('form.success'));
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    if (!initialEmployee) return;
    // Reset data to initial state
    setEditableData({
      fullName: initialEmployee.fullName,
      cpf: initialEmployee.cpf,
      position: initialEmployee.position,
      admissionDate: initialEmployee.admissionDate,
      email: initialEmployee.email,
      phone: initialEmployee.phone,
      address: initialEmployee.address,
      status: initialEmployee.status,
      photo: initialEmployee.photo,
      // NEW FIELDS RESET
      birthDate: initialEmployee.birthDate,
      gender: initialEmployee.gender,
      interviewDate: initialEmployee.interviewDate,
      testDate: initialEmployee.testDate,
      workSchedule: initialEmployee.workSchedule,
    });
    setIsEditing(false);
  };
  // --------------------------------

  // --- Handlers for Documents Tab ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !initialEmployee) {
      toast.error('Selecione um arquivo para upload');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const fileData = reader.result as string;
      
      addDocument(initialEmployee.id, {
        type: uploadDocType,
        fileName: selectedFile.name,
        fileData: fileData,
      });
      
      toast.success('Documento enviado com sucesso!');
      setSelectedFile(null);
    };
    reader.readAsDataURL(selectedFile);
  };

  const confirmDeleteDoc = () => {
    if (docToDelete && initialEmployee) {
      deleteDocument(initialEmployee.id, docToDelete);
      toast.success(t('profile.docDeleted'));
      setDocToDelete(null);
    }
  };
  
  const handleViewDoc = (doc: Document) => {
    if (doc.fileData) {
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`<iframe src="${doc.fileData}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
        newWindow.document.title = doc.fileName;
      } else {
        toast.error("Não foi possível abrir a nova janela. Verifique se o bloqueador de pop-ups está ativo.");
      }
    } else {
      toast.error("Dados do arquivo não encontrados.");
    }
  };

  const handleDownloadDoc = (doc: Document) => {
    if (doc.fileData) {
      const link = document.createElement('a');
      link.href = doc.fileData;
      link.download = doc.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      toast.error("Dados do arquivo não encontrados para download.");
    }
  };
  // ----------------------------------
  
  // --- Print Handler ---
  const handlePrint = () => {
    if (initialEmployee && printRef.current) {
      const printContent = printRef.current.innerHTML;
      const printWindow = window.open('', '', 'height=800,width=600');
      
      if (printWindow) {
        printWindow.document.write('<html><head><title>Perfil do Funcionário</title>');
        // Include the application\'s CSS for Tailwind print styles to work
        printWindow.document.write('<link rel="stylesheet" href="/src/index.css" />');
        printWindow.document.write('</head><body>');
        printWindow.document.write('<style>');
        // CSS para impressão
        printWindow.document.write(`
          @media print { 
            @page { 
              margin: 1cm 2cm !important;
            }
            body { 
              margin: 0; 
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              background-color: white !important;
              font-family: sans-serif;
            } 
            /* Força a exibição do conteúdo do template */
            .print-container {
              width: 100%;
              margin: 0;
              padding: 0;
            }
          }
        `);
        printWindow.document.write('</style>');
        printWindow.document.write('<div class="print-container">'); 
        printWindow.document.write(printContent);
        printWindow.document.write('</div>');
        printWindow.document.write('</body></html>');
        
        printWindow.document.close();
        
        printWindow.onload = () => {
          printWindow.print();
        };
      } else {
        toast.error("Não foi possível abrir a janela de impressão. Verifique se o bloqueador de pop-ups está ativo.");
      }
    }
  };
  // ---------------------

  if (!initialEmployee) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-xl">Funcionário não encontrado</p>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-0"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('form.cancel')}
          </Button>
          
          <div className="flex items-center gap-2">
            <Button 
              onClick={handlePrint} 
              variant="secondary" 
              className="bg-accent hover:bg-accent/90 text-white"
            >
              <Printer className="mr-2 h-4 w-4" />
              Imprimir Perfil
            </Button>
          </div>
        </div>

        <Card className="max-w-5xl mx-auto shadow-elegant">
          <CardContent className="p-6">
            
            <div>
              <EmployeeProfileHeader
                employee={initialEmployee}
                editableData={editableData}
                isEditing={isEditing}
                t={t}
                onEditToggle={() => setIsEditing(true)}
                onSave={handleSave}
                onCancel={handleCancelEdit}
                getInitials={getInitials}
              />
            </div>

            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="details">{t('profile.details')}</TabsTrigger>
                <TabsTrigger value="documents">{t('profile.documents')}</TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <EmployeeDetailsTab
                  employee={initialEmployee}
                  editableData={editableData}
                  isEditing={isEditing}
                  t={t}
                  handleInputChange={handleInputChange}
                  handleSelectChange={handleSelectChange}
                  handlePhotoUpload={handlePhotoUpload}
                  getInitials={getInitials}
                />
              </TabsContent>

              <TabsContent value="documents">
                <EmployeeDocumentsTab
                  t={t}
                  employee={initialEmployee}
                  filteredDocuments={filteredDocuments}
                  documentTypes={documentTypes}
                  documentFilter={documentFilter}
                  setDocumentFilter={setDocumentFilter}
                  uploadDocType={uploadDocType}
                  setUploadDocType={setUploadDocType}
                  selectedFile={selectedFile}
                  handleFileChange={handleFileChange}
                  handleUpload={handleUpload}
                  handleViewDoc={handleViewDoc}
                  handleDownloadDoc={handleDownloadDoc}
                  setDocToDelete={setDocToDelete}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      
      {/* Hidden Print Template (Rendered outside the main view, but inside the component) */}
      <div className="hidden print:block">
        <EmployeePrintTemplate 
          ref={printRef}
          employee={initialEmployee}
          t={t}
          getInitials={getInitials}
        />
      </div>
      
      {/* Confirmation Dialog for Document Deletion */}
      <AlertDialog open={!!docToDelete} onOpenChange={() => setDocToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('dashboard.delete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('dashboard.deleteConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('form.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteDoc} className="bg-destructive hover:bg-destructive/90">
              {t('dashboard.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EmployeeProfile;