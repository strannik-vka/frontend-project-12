import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import NewChannel from './NewChannel';
import { setChannelModal } from '../../store/slices/modalSlice';
import { useGetChannelsQuery } from '../../api/channels';
import RenameChannel from './RenameChannel';
import DeleteChannel from './DeleteChannel';

const modals = {
  adding: NewChannel,
  renaming: RenameChannel,
  removing: DeleteChannel,
};

const ModalContainer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentChannelId = useSelector((state) => state.app.currentChannelId);
  const modalChannelId = useSelector((state) => state.modal.modalChannelId);
  const { data: channels = [] } = useGetChannelsQuery();
  const channelsNames = channels.map((channel) => channel.name);
  const channelNameSchema = Yup.object().shape({
    channelName: Yup.string()
      .notOneOf(channelsNames, t('channelExists'))
      .min(3, t('form.errors.range'))
      .max(20, t('form.errors.range'))
      .required(t('form.errors.required')),
  });
  const handleCloseModal = () => {
    dispatch(setChannelModal({ id: '', name: '', modalName: '' }));
  };
  const showModal = useSelector((state) => state.modal.showModal);
  const ModalComponent = modals[showModal];
  if (!ModalComponent) {
    return null;
  }
  return (
    <ModalComponent
      handleCloseModal={handleCloseModal}
      showModal={showModal}
      currentChannelId={currentChannelId}
      modalChannelId={modalChannelId}
      channelNameSchema={channelNameSchema}
    />
  );
};

export default ModalContainer;
