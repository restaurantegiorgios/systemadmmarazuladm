import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const { language, setLanguage, t } = useLanguage();
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/dashboard');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-accent to-primary p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)]" />
      
      <div className="absolute top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
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
      </div>

      <Card className="w-full max-w-md shadow-2xl relative z-10 animate-fade-in">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-36 h-36 sm:w-48 sm:h-48 flex items-center justify-center mb-4 bg-white rounded-lg shadow-2xl overflow-hidden">
            <img 
              src="/logo_giorgios_centralizada.png" 
              alt="Logo Giorgio's Mar Azul" 
              className="w-full h-full object-cover"
            />
          </div>
          <CardTitle className="text-3xl font-bold">{t('login.title')}</CardTitle>
          <CardDescription className="text-lg">{t('login.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={[]}
            theme="light"
            localization={{
              variables: {
                sign_up: {
                  email_label: t('login.email'),
                  password_label: t('login.password'),
                  button_label: t('login.register'),
                  email_input_placeholder: 'seu.email@exemplo.com',
                  password_input_placeholder: '••••••••',
                  link_text: "Não tem uma conta? Cadastre-se",
                },
                sign_in: {
                  email_label: t('login.email'),
                  password_label: t('login.password'),
                  button_label: t('login.button'),
                  email_input_placeholder: 'seu.email@exemplo.com',
                  password_input_placeholder: '••••••••',
                  link_text: "Já tem uma conta? Faça login",
                },
                forgotten_password: {
                  link_text: t('forgotPassword.link'),
                  email_label: t('login.email'),
                  button_label: "Enviar instruções",
                  email_input_placeholder: 'seu.email@exemplo.com',
                },
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;