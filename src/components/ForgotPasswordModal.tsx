import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { resetPassword } = useUser();

  const forgotPasswordSchema = z.object({
    email: z.string().email(t('userProfile.error.invalidEmail')),
    newPassword: z.string().min(6, t('userProfile.error.passwordLength')),
    confirmPassword: z.string(),
  }).refine(data => data.newPassword === data.confirmPassword, {
    message: t('userProfile.error.passwordMismatch'),
    path: ['confirmPassword'],
  });

  type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
      newPassword: '',
      confirmPassword: '',
    }
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    const result = resetPassword(data.email, data.newPassword);

    if (result.success) {
      toast.success(t('forgotPassword.success'));
      reset();
      onClose();
    } else {
      toast.error(result.error ? t(result.error) : t('forgotPassword.error.generic'));
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('forgotPassword.title')}</DialogTitle>
          <DialogDescription>{t('forgotPassword.description')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          
          <div className="space-y-2">
            <Label htmlFor="email">{t('login.email')}</Label>
            <Input id="email" type="email" {...register('email')} placeholder="seu.email@exemplo.com" />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">{t('forgotPassword.newPassword')}</Label>
            <Input id="newPassword" type="password" {...register('newPassword')} placeholder="••••••••" />
            {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t('forgotPassword.confirmNewPassword')}</Label>
            <Input id="confirmPassword" type="password" {...register('confirmPassword')} placeholder="••••••••" />
            {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>{t('form.cancel')}</Button>
            <Button type="submit" className="bg-gradient-to-r from-primary to-accent">
              {t('forgotPassword.resetButton')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordModal;