import { Globe, FileText, Menu } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';

export const Header = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-elegant sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 flex items-center justify-center">
            <img 
              src="/logo_giorgios_centralizada.png" 
              alt="Logo Giorgio's Mar Azul" 
              className="h-full w-auto"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold">{t('login.subtitle')}</h1>
            <p className="text-xs opacity-90">{t('login.title')}</p>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10">
                {t('dashboard.title')}
              </Button>
            </Link>
            <Link to="/receipts">
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10">
                <FileText className="mr-2 h-4 w-4" />
                {t('receipt.title')}
              </Button>
            </Link>
          </nav>

          {/* Language Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card z-50">
              <DropdownMenuItem onClick={() => setLanguage('pt-BR')} className={language === 'pt-BR' ? 'bg-secondary' : ''}>
                🇧🇷 Português
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('en-US')} className={language === 'en-US' ? 'bg-secondary' : ''}>
                🇺🇸 English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] bg-card">
                <nav className="flex flex-col gap-4 mt-8">
                  <SheetClose asChild>
                    <Link to="/dashboard">
                      <Button variant="ghost" className="w-full justify-start text-base">
                        {t('dashboard.title')}
                      </Button>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/receipts">
                      <Button variant="ghost" className="w-full justify-start text-base">
                        <FileText className="mr-2 h-4 w-4" />
                        {t('receipt.title')}
                      </Button>
                    </Link>
                  </SheetClose>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};