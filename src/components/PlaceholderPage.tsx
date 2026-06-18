import {HeaderTitle} from '@/kit/HeaderTitle';

type PlaceholderPageProps = {
  title: string;
  description: string;
};

export default function PlaceholderPage(props: PlaceholderPageProps) {
  const {title, description} = props;

  return (
    <div className="flex min-h-0 flex-1 flex-col p-4 sm:p-6">
      <HeaderTitle title={title} description={description} />
      <div className="flex flex-1 items-center justify-center py-12">
        <p className="text-body-md text-text-muted">Coming soon.</p>
      </div>
    </div>
  );
}
