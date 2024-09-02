import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useRemoveChannelMutation } from '../../api/channels';
import { changeChannel } from '../../store/slices/appSlice';

const DeleteChannel = (props) => {
  const {
    handleCloseModal, showModal, currentChannelId, modalChannelId,
  } = props;
  const [removeChannel] = useRemoveChannelMutation();
  const defaultChannel = { id: '1', name: 'general' };
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const deleteChannel = async (id) => {
    try {
      await removeChannel(id).unwrap();
      handleCloseModal();
      if (id === currentChannelId) {
        dispatch(changeChannel(defaultChannel));
      }
      toast.success(t('toast.deleteChannel'));
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <Modal show={showModal === 'removing'} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.titleDeleteChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{t('modals.textDeleteChannel')}</p>
        <div className="d-flex justify-content-end mt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCloseModal}
            className="me-2"
          >
            {t('form.buttons.cancel')}
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={() => deleteChannel(modalChannelId)}
          >
            {t('form.buttons.delete')}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteChannel;
