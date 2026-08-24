import { useTranslations } from 'next-intl';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Section } from '@/features/landing/Section';

export const FAQ = () => {
  const t = useTranslations('FAQ');

  return (
    <Section>
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>{t('question_1')}</AccordionTrigger>
          <AccordionContent>{t('answer_1')}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>{t('question_2')}</AccordionTrigger>
          <AccordionContent>{t('answer_2')}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>{t('question_3')}</AccordionTrigger>
          <AccordionContent>{t('answer_3')}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>{t('question_4')}</AccordionTrigger>
          <AccordionContent>{t('answer_4')}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>{t('question_5')}</AccordionTrigger>
          <AccordionContent>{t('answer_5')}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-6">
          <AccordionTrigger>{t('question_6')}</AccordionTrigger>
          <AccordionContent>{t('answer_6')}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </Section>
  );
};
