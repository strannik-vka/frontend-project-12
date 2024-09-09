import Col from 'react-bootstrap/esm/Col';
import { useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetMessagesQuery } from '../../api/messages';
import Message from './Message';

const Messages = () => {
  const MessagesEnd = useRef();

  const { data: messages = [] } = useGetMessagesQuery();
  const { t } = useTranslation();
  const currentChannelId = useSelector((state) => state.app.currentChannel.id);
  const currentChannelName = useSelector((state) => state.app.currentChannel.name);
  const filteredMessages = messages.filter((message) => message.channelId === currentChannelId);

  useEffect(() => {
    MessagesEnd.current?.scrollIntoView();
  }, [filteredMessages]);

  return (
    <Col className="p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="mb-0">
            <b>
              {`# ${currentChannelName}`}
            </b>
          </p>
          <span className="text-muted">
            {t('messages', { count: filteredMessages.length })}
          </span>
        </div>
        <div className="overflow-auto px-5">
          {filteredMessages.map((message) => (
            <div className="text-break mb-2" key={message.id}>
              <b>{message.username}</b>
              :
              {message.message}
            </div>
          ))}
          <div ref={MessagesEnd} />
        </div>
        <Message />
      </div>
    </Col>
  );
};

export default Messages;
