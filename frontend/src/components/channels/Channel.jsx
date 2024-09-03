import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { changeChannel } from '../../store/slices/appSlice';
import { setChannelModal } from '../../store/slices/modalSlice';

const Channel = ({ data }) => {
  const dispatch = useDispatch();
  const currentChannelId = useSelector((state) => state.app.currentChannel.id);
  const variantButton = data.id === currentChannelId ? 'secondary' : 'light';
  const { t } = useTranslation();
  const switchChannel = () => {
    const { id, name } = data;
    if (id !== currentChannelId) {
      dispatch(changeChannel({ id, name }));
    }
  };
  const handleShowModal = (modalName, channel = { id: '', name: '' }) => {
    dispatch(setChannelModal({ id: channel.id, name: channel.name, modalName }));
  };
  return (
    <Nav.Item>
      {data.removable ? (
        <Dropdown as={ButtonGroup} drop="down" className="w-100">
          <Button
            onClick={() => switchChannel()}
            className="w-100 rounded-0 text-start text-truncate"
            variant={variantButton}
          >
            {`# ${data.name}`}
          </Button>
          <Dropdown.Toggle
            as={Button}
            className="text-end"
            split
            variant={variantButton}
            id={`dropdown-split-button${data.id}`}
          >
            <span className="visually-hidden">{t('dropdown.toggle')}</span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleShowModal('removing', data)}>{t('channels.dropdown.delete')}</Dropdown.Item>
            <Dropdown.Item onClick={() => handleShowModal('renaming', data)}>{t('channels.dropdown.rename')}</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <Button
          as={ButtonGroup}
          variant={variantButton}
          className="w-100 text-start rounded-0 text-truncate"
          onClick={() => switchChannel(data)}
        >
          {`# ${data.name}`}
        </Button>
      )}
    </Nav.Item>
  );
};

export default Channel;
