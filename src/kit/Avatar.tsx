import cn from '@/utils/mergeClassNameTailwind';

type AvatarProps = {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeMap = {sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-12 w-12'};

export default function Avatar(props: AvatarProps) {
  const {alt, name, className, src, size = 'md'} = props;
  const initials = name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={alt ?? name ?? 'Avatar'}
        className={cn('rounded-full object-cover', sizeMap[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center pt-1 rounded-full bg-primary/30 text-caption font-medium text-primary',
        sizeMap[size],
        className,
      )}
    >
      {initials ?? '?'}
    </div>
  );
}
