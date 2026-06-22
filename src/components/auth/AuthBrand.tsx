import {IconAuthLogo} from '@/kit/icons';
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
      <IconAuthLogo className="h-8 w-8 shrink-0 sm:h-9 sm:w-9" />
      <p className="text-base font-semibold tracking-tight text-text sm:text-[17px]">
        ImageTranslate <span className="text-primary">AI</span>
      </p>
    </div>
  );
}
