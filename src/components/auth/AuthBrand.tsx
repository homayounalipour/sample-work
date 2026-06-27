import cn from '@/utils/mergeClassNameTailwind';

type AuthBrandProps = {
  align?: 'center' | 'start';
  className?: string;
};

export default function AuthBrand(props: AuthBrandProps) {
  const {align = 'center', className} = props;

  return (
    <div
      className={cn(
        'flex items-center gap-2.5',
        align === 'center' ? 'justify-center' : 'justify-start',
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <img
          src="/favicon.ico"
          alt="ImageTranslate logo"
          width={32}
          height={32}
          className="h-8 w-8 shrink-0 rounded-md"
        />
        <div>
          <p className="text-body-md font-semibold text-text">ImageTranslate</p>
          <p className="text-caption text-primary">AI</p>
        </div>
      </div>
    </div>
  );
}
