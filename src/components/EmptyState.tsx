import React from 'react';
import { FileSearch, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description: string;
  icon: React.ElementType;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon,
  actionButton,
  className,
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-12 text-center bg-card border border-dashed rounded-lg shadow-soft",
      className
    )}>
      <div className="mb-4 p-4 rounded-full bg-muted/50 text-primary">
        <Icon className="h-10 w-10" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      {actionButton && (
        <Button onClick={actionButton.onClick} className="bg-gradient-to-r from-primary to-accent">
          {actionButton.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;