import RegisterDescription from '@/components/auth/RegisterDescription';
import RegisterForm from '@/components/auth/RegisterForm';
import RegisterSplitShell from '@/components/auth/RegisterSplitShell';

export default function RegisterPage() {
  return (
    <RegisterSplitShell>
      <div className="grid min-w-0 grid-cols-1 lg:grid-cols-2">
        <RegisterDescription />
        <RegisterForm />
      </div>
    </RegisterSplitShell>
  );
}
