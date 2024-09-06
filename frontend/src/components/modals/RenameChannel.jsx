import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import * as filter from 'leo-profanity';
import { Formik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useUpdateChannelMutation } from '../../api/channels';
import { changeChannel } from '../../store/slices/appSlice';

const RenameChannel = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    handleCloseModal, showModal, modalChannelId, channelNameSchema,
  } = props;
  const input = useRef();
  const [updateChannel] = useUpdateChannelMutation();
  const modalChannelName = useSelector((state) => state.modal.modalChannelName);

  const renameChannel = async (values) => {
    try {
      const { channelName, channelId } = values;
      const data = {
        name: filter.clean(channelName.trim()),
        removable: true,
        id: channelId,
      };
      await updateChannel(data).unwrap();
      handleCloseModal();
      dispatch(changeChannel({ id: channelId, name: channelName }));
      toast.success(t('toast.renameChannel'));
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    if (input.current) {
      input.current.focus();
      input.current.select();
    }
  }, []);
  return (
    <Modal show={showModal === 'renaming'} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.titleRenameChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ channelName: modalChannelName, channelId: modalChannelId }}
          validationSchema={channelNameSchema}
          onSubmit={renameChannel}
        >
          {({
            values, handleChange, handleSubmit, errors, isSubmitting,
          }) => (
            <Form onSubmit={isSubmitting ? () => { } : handleSubmit}>
              <Form.Label htmlFor="channelName" visuallyHidden>{t('form.labels.channelName')}</Form.Label>
              <Form.Control
                ref={input}
                value={values.channelName}
                name="channelName"
                onChange={handleChange}
                id="channelName"
                isInvalid={!!errors.channelName}
                autoFocus
              />
              <Form.Control.Feedback type="invalid">{errors.channelName}</Form.Control.Feedback>
              <div className="d-flex justify-content-end mt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCloseModal}
                  className="me-2"
                >
                  {t('form.buttons.cancel')}
                </Button>
                <Button type="submit" variant="primary">{t('form.buttons.submit')}</Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default RenameChannel;
