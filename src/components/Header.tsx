import { useState } from 'react';
import { Globe, LogOut, User, FileText, Menu } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ProfileModal from './ProfileModal';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { toast } from 'sonner';

export const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error(`Erro ao sair: ${error.message}`);
    }
    // A navegação agora é tratada reativamente pela mudança de estado no AuthContext.
  };

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`;
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <>
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

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
                  {profile?.avatar_url ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile.avatar_url} />
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card z-50 w-64">
                {user && profile && (
                  <>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={profile.avatar_url} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                            {getInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {profile.first_name} {profile.last_name}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onSelect={() => setProfileModalOpen(true)}>
                  <User className="mr-2 h-4 w-4" />
                  {t('profile')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('logout')}
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
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setProfileModalOpen(false)} />
    </>
  );
};