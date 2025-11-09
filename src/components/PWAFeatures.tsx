import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Download, Share, RefreshCw } from 'lucide-react';

const PWAFeatures = () => {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true);
    }
  }, []);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      console.log(`Service Worker at: ${swUrl}`);
      r && setInterval(() => {
        r.update();
      }, 60 * 60 * 1000); // check for updates every hour
    },
    onRegisterError(error) {
      console.log('SW registration error:', error);
    },
  });

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    setInstallPrompt(null);
  };

  useEffect(() => {
    if (offlineReady) {
      toast.success('App está pronto para funcionar offline!');
      setOfflineReady(false);
    }
  }, [offlineReady, setOfflineReady]);

  useEffect(() => {
    if (needRefresh) {
      toast.info('Nova versão disponível!', {
        action: (
          <Button
            size="sm"
            onClick={() => {
              updateServiceWorker(true);
              setNeedRefresh(false);
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
        ),
        duration: Infinity,
      });
    }
  }, [needRefresh, setNeedRefresh, updateServiceWorker]);

  useEffect(() => {
    if (isIOS && !isStandalone) {
      toast.info('Para instalar, toque no ícone de Compartilhar e "Adicionar à Tela de Início"', {
        icon: <Share className="h-4 w-4" />,
        duration: 10000,
      });
    } else if (installPrompt && !isStandalone) {
      toast.info('Instale o aplicativo para uma melhor experiência!', {
        action: (
          <Button size="sm" onClick={handleInstall}>
            <Download className="mr-2 h-4 w-4" />
            Instalar
          </Button>
        ),
        duration: 10000,
      });
    }
  }, [isIOS, isStandalone, installPrompt]);

  return null; // This component only renders toasts
};

export default PWAFeatures;