type PlaceholderPageProps = {
  title: string;
  description: string;
};

export default function PlaceholderPage(props: PlaceholderPageProps) {
  const {title, description} = props;

  return (
    <div className="flex min-h-0 flex-1 flex-col p-4 sm:p-6">
      <header className="hidden border-b border-border pb-4 sm:pb-5 lg:block">
        <h1 className="text-h4 text-text sm:text-h3">{title}</h1>
        <p className="mt-1 text-body-md text-text-subtle">{description}</p>
      </header>
      <div className="flex flex-1 items-center justify-center py-12">
        <p className="text-body-md text-text-muted">Coming soon.</p>
      </div>
    </div>
  );
}
