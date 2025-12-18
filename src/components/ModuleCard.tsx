import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  gradient: string;
  stats?: {
    label: string;
    value: string;
  };
}

export function ModuleCard({ title, description, icon: Icon, href, gradient, stats }: ModuleCardProps) {
  return (
    <Link to={href} className="group block">
      <div className={cn(
        "relative overflow-hidden rounded-xl border border-border/50 bg-card/50 p-6",
        "backdrop-blur-sm transition-all duration-300",
        "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10",
        "hover:-translate-y-1"
      )}>
        {/* Background gradient */}
        <div className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300",
          gradient
        )} />
        
        {/* Icon */}
        <div className={cn(
          "inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4",
          "bg-gradient-to-br from-primary/20 to-accent/20",
          "border border-primary/30"
        )}>
          <Icon className="w-6 h-6 text-primary" />
        </div>
        
        {/* Content */}
        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {description}
        </p>
        
        {/* Stats */}
        {stats && (
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <span className="text-xs text-muted-foreground">{stats.label}</span>
            <span className="text-sm font-mono font-semibold text-primary">{stats.value}</span>
          </div>
        )}
        
        {/* Arrow indicator */}
        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
