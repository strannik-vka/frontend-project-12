import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/esm/Row';
import Channels from '../components/channels/Channels';
import Messages from '../components/messages/Messages';

const Home = () => (
  <Container className="rounded shadow h-100 mb-2">
    <Row className="bg-white flex-md-row h-100">
      <Channels />
      <Messages />
    </Row>
  </Container>
);

export default Home;
