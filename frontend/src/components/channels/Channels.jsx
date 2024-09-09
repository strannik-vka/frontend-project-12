import Nav from 'react-bootstrap/Nav';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  useGetChannelsQuery,
} from '../../api/channels';
import Channel from './Channel';
import { changeChannel, defaultChannel, setUserData } from '../../store/slices/appSlice';
import ModalContainer from '../modals';
import { appPaths } from '../../routes';
import { setChannelModal } from '../../store/slices/modalSlice';
import store from '../../store/index';

const Channels = () => {
  const ChannelsStart = useRef();
  const ChannelsEnd = useRef();

  const { data: channels = [], error: channelError } = useGetChannelsQuery();
  const { t } = useTranslation();
  const { dispatch } = store;
  const currentChannel = useSelector((state) => state.app.currentChannel);
  const navigate = useNavigate();

  const handleShowModal = (modalName, channel = { id: '', name: '' }) => {
    dispatch(setChannelModal({ id: channel.id, name: channel.name, modalName }));
  };

  if (currentChannel.id === undefined) {
    dispatch(changeChannel(defaultChannel));
  }

  useEffect(() => {
    if (channelError?.status === 401) {
      dispatch(setUserData({ nickname: '', token: null }));
      localStorage.removeItem('token');
      localStorage.removeItem('nickname');
      navigate(appPaths.login());
    }
  }, [dispatch, channelError, navigate]);

  useEffect(() => {
    const LastChannel = channels[channels.length - 1];

    if (currentChannel.id === defaultChannel.id) {
      ChannelsStart.current?.scrollIntoView();
    } else if (currentChannel.id === LastChannel?.id) {
      setTimeout(() => {
        ChannelsEnd.current?.scrollIntoView();
      }, 1000);
    }
  }, [currentChannel, channels]);

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
