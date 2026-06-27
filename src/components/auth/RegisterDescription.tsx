import AuthBrand from '@/components/auth/AuthBrand';
import {IconCheckCircle} from '@/kit/icons';

const FEATURES = [
  '50 free image translations per month',
  '100+ supported languages with OCR',
  'Export translated images as PNG or JPG',
] as const;

export default function RegisterDescription() {
  return (
    <div className="flex flex-col justify-center bg-background-muted/20 px-6 py-2 sm:px-8 sm:py-10 lg:px-10">
      <AuthBrand align="start" className="mb-6 sm:mb-8" />

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
          Start translating free
        </h1>
        <span className="mt-3 inline-block rounded-full bg-primary/90 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-white">
          FREE
        </span>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-text-subtle sm:text-base">
          Create your account and translate text in images instantly — no credit
          card needed.
        </p>
      </div>

      <ul className="mt-8 space-y-3">
        {FEATURES.map(feature => (
          <li
            key={feature}
            className="flex items-center gap-2.5 text-sm text-text-subtle sm:text-base"
          >
            <IconCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success sm:h-5 sm:w-5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
