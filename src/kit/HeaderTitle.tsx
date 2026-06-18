type HeaderTitleProps = {
  title: string;
  description: string;
};

export const HeaderTitle = (props: HeaderTitleProps) => {
  const {title, description} = props;
  return (
    <header className="hidden border-b border-border pb-4 sm:pb-5 lg:block">
      <h1 className="text-h4 text-text sm:text-h3">{title}</h1>
      <p className="mt-1 text-body-md text-text-subtle">{description}</p>
    </header>
  );
};
