type AuthDividerProps = {
  text: string;
};

export default function AuthDivider(props: AuthDividerProps) {
  const {text} = props;

  return (
    <div className="relative my-5 sm:my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border/80" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-surface px-3 text-xs text-text-muted">{text}</span>
      </div>
    </div>
  );
}
