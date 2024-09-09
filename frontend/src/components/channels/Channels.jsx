import Nav from 'react-bootstrap/Nav';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  channelsApi,
  useGetChannelsQuery,
} from '../../api/channels';
import Channel from './Channel';
import { changeChannel, setUserData } from '../../store/slices/appSlice';
import ModalContainer from '../modals';
import { appPaths } from '../../routes';
import { SocketContext } from '../../context/socket';
import { setChannelModal } from '../../store/slices/modalSlice';
import store from '../../store/index';

const Channels = () => {
  const socket = useContext(SocketContext);
  const ChannelsStart = useRef();
  const ChannelsEnd = useRef();

  const { data: channels = [], error: channelError } = useGetChannelsQuery();
  const { t } = useTranslation();
  const { dispatch } = store;
  const currentChannelId = useSelector((state) => state.app.currentChannel.id);
  const navigate = useNavigate();
  const defaultChannel = { id: '1', name: 'general' };

  const handleShowModal = (modalName, channel = { id: '', name: '' }) => {
    dispatch(setChannelModal({ id: channel.id, name: channel.name, modalName }));
  };

  if (currentChannelId === undefined) {
    dispatch(changeChannel(defaultChannel));
  }

  useEffect(() => {
    if (channelError?.status === 401) {
      dispatch(setUserData({ nickname: '', token: null }));
      localStorage.removeItem('token');
      localStorage.removeItem('nickname');
      navigate(appPaths.login());
    }

    const handleNewChannel = (channel) => {
      dispatch(channelsApi.util.updateQueryData('getChannels', undefined, (draft) => {
        draft.push(channel);
      }));

      setTimeout(() => {
        ChannelsEnd.current?.scrollIntoView();
      }, 1000);
    };
    const handleRemoveChannel = ({ id }) => {
      const { app } = store.getState();

      console.log(id, app.currentChannel.id);

      if (id === app.currentChannel.id) {
        dispatch(changeChannel(defaultChannel));

        ChannelsStart.current?.scrollIntoView();
      }

      dispatch(channelsApi.util.updateQueryData('getChannels', undefined, (draft) => {
        const index = draft.findIndex((curChannels) => curChannels.id === id);
        draft.splice(index, 1);

        console.log('handleRemoveChannel');
      }));
    };
    const handleRenameChannel = ({ id, name }) => {
      dispatch(channelsApi.util.updateQueryData('getChannels', undefined, (draft) => {
        const channel = draft;
        const index = channel.findIndex((curChannels) => curChannels.id === id);
        channel[index].name = name;
      }));
    };
    socket.on('newChannel', handleNewChannel);
    socket.on('removeChannel', handleRemoveChannel);
    socket.on('renameChannel', handleRenameChannel);
    return () => {
      socket.off('newChannel');
      socket.off('removeChannel');
      socket.off('renameChannel');
    };
  }, [socket, dispatch, channelError, navigate]);

  return (
    <Col xs="4" md="2" className="border-end px-0 bg-light flex-column h-100 d-flex">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>{t('channels.title')}</b>
        <Button size="sm" variant="outline-primary" onClick={() => handleShowModal('adding')}>
          +
        </Button>
      </div>
      <Nav className="flex-column nav-fill px-2 mb-3 overflow-auto h-100 d-block">
        <div ref={ChannelsStart} />
        {channels.map((channel) => (
          <Channel key={channel.id} data={channel} />
        ))}
        <div ref={ChannelsEnd} />
      </Nav>
      <ModalContainer />
    </Col>
  );
};

export default Channels;
