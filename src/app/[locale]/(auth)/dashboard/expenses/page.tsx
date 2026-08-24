import { getTranslations, setRequestLocale } from 'next-intl/server';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { ExpenseForm } from '@/features/expenses/ExpenseForm';
import { ExpenseList } from '@/features/expenses/ExpenseList';

export default async function ExpensesPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'ExpensesPage',
  });

  return (
    <>
      <TitleBar
        title={t('title_bar')}
        description={t('title_bar_description')}
      />

      <div className="flex flex-col gap-y-6">
        <ExpenseForm />

        <ExpenseList />
      </div>
    </>
  );
};
