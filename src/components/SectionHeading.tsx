

interface SectionHeadingProps {
  children: React.ReactNode;
  color?: 'secondary' | 'accent';
}

export function SectionHeading({ children, color = 'secondary' }: SectionHeadingProps) {
  const colorClass = color === 'secondary' ? 'text-(--color-secondary-500)' : 'text-(--color-accent-500)';
  
  return (
    <p className={`font-mono ${colorClass} font-bold pt-10 pb-2`}>
      # {children}
    </p>
  );
}