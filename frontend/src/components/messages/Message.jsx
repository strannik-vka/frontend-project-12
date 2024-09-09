import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/Form';
import { Send } from 'react-bootstrap-icons';
import InputGroup from 'react-bootstrap/InputGroup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useAddMessageMutation } from '../../api/messages';
import { filter } from '../../context/filter';

const Message = () => {
  const currentChannelId = useSelector((state) => state.app.currentChannel.id);
  const username = useSelector((state) => state.app.username);
  const [addMessage] = useAddMessageMutation();
  const { t } = useTranslation();
  const handleFormSubmit = async (values, { resetForm }) => {
    const { message } = values;
    if (!message.length) return;
    const data = {
      message: filter.clean(message),
      channelId: currentChannelId,
      username,
    };
    await addMessage(data).unwrap()
      .then(() => {
        resetForm();
      }).catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="mt-auto py-3 px-5">
      <Formik initialValues={{ message: '' }} onSubmit={handleFormSubmit}>
        {({ handleSubmit, handleChange, values }) => (
          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Form.Label htmlFor="new-message" hidden>{t('form.labels.message')}</Form.Label>
              <Form.Control
                placeholder={t('form.placeholders.message')}
                autoFocus
                id="new-message"
                aria-label={t('form.placeholders.message')}
                value={values.message}
                onChange={handleChange}
                type="text"
                name="message"
              />
              <Button type="submit">
                <Send />
              </Button>
            </InputGroup>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Message;
