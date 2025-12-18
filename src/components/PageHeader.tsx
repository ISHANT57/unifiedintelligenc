import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient?: string;
}

export function PageHeader({ title, description, icon: Icon, gradient = "from-primary to-accent" }: PageHeaderProps) {
  return (
    <div className="relative mb-8">
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center",
          "bg-gradient-to-br",
          gradient
        )}>
          <Icon className="w-7 h-7 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
}
