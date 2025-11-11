import React from 'react';
import { Employee, Document } from '@/contexts/EmployeeProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, Trash2, FileText, Download } from 'lucide-react';

type DocumentTypeKey = 'all' | 'rg' | 'cpf' | 'medical' | 'contract' | 'other';

interface EmployeeDocumentsTabProps {
  t: (key: string) => string;
  employee: Employee;
  filteredDocuments: Document[];
  documentTypes: DocumentTypeKey[];
  documentFilter: DocumentTypeKey;
  setDocumentFilter: (type: DocumentTypeKey) => void;
  uploadDocType: string;
  setUploadDocType: (type: string) => void;
  selectedFile: File | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpload: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleViewDoc: (doc: Document) => void;
  handleDownloadDoc: (doc: Document) => void;
  setDocToDelete: (docId: string) => void;
}

const EmployeeDocumentsTab: React.FC<EmployeeDocumentsTabProps> = ({
  t,
  filteredDocuments,
  documentTypes,
  documentFilter,
  setDocumentFilter,
  uploadDocType,
  setUploadDocType,
  selectedFile,
  handleFileChange,
  handleUpload,
  handleViewDoc,
  handleDownloadDoc,
  setDocToDelete,
}) => {
  return (
    <div className="space-y-6">
      <Card className="bg-secondary/50">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">{t('form.uploadDoc')}</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="docType">{t('form.docType')}</Label>
                <Select value={uploadDocType} onValueChange={setUploadDocType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card z-50">
                    {/* Note: 'all' is not included here as it's for filtering, not uploading */}
                    <SelectItem value="rg">{t('docType.rg')}</SelectItem>
                    <SelectItem value="cpf">{t('docType.cpf')}</SelectItem>
                    <SelectItem value="medical">{t('docType.medical')}</SelectItem>
                    <SelectItem value="contract">{t('docType.contract')}</SelectItem>
                    <SelectItem value="other">{t('docType.other')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">{t('form.selectFile')}</Label>
                {/* 
                  Estilizando o Input type="file" para ter um cursor pointer e um efeito visual de hover.
                  O Input de arquivo é notoriamente difícil de estilizar de forma consistente.
                  Aqui, usamos classes Tailwind para garantir que o campo se destaque.
                */}
                <Input
                  id="file"
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer file:cursor-pointer file:text-primary file:bg-secondary hover:file:bg-secondary/80 transition-colors"
                />
              </div>
            </div>
            <Button type="button" onClick={handleUpload} className="w-full bg-gradient-to-r from-primary to-accent" disabled={!selectedFile}>
              <Upload className="mr-2 h-4 w-4" />
              {t('form.upload')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h3 className="text-lg font-semibold">{t('profile.uploadedDocs')}</h3>
          <div className="w-full sm:w-[200px]">
            <Select 
              value={documentFilter} 
              onValueChange={(value: DocumentTypeKey) => setDocumentFilter(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('docType.all')} />
              </SelectTrigger>
              <SelectContent className="bg-card z-50">
                {documentTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {t(`docType.${type}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {filteredDocuments.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            {t('profile.noDocuments')}
          </p>
        ) : (
          <div className="space-y-2">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="hover:shadow-soft transition-shadow">
                <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Clicar no item abre a visualização */}
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleViewDoc(doc)}>
                    <FileText className="h-8 w-8 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium hover:underline break-all">{doc.fileName}</p>
                      <p className="text-sm text-muted-foreground">
                        {t(`docType.${doc.type}`)} • {new Date(doc.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 self-end sm:self-center">
                    {/* Botão de Download */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownloadDoc(doc)}
                      title="Baixar Documento"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDocToDelete(doc.id)} // Open confirmation dialog
                      title={t('profile.deleteDoc')}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDocumentsTab;