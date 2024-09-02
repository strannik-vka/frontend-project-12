import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div className="text-center">
      {t('notFoundPage.title')}
    </div>
  );
};

export default NotFound;
