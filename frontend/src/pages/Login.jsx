/* eslint-disable indent */
import { Formik } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../api/auth';
import { setUserData } from '../store/slices/appSlice';
import { appPaths } from '../routes';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login] = useLoginMutation();

  const submitForm = async (values, { setErrors }) => {
    const { nickname, password } = values;
    const user = {
      username: nickname,
      password,
    };
    const { data, error } = await login(user);
    if (data) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('nickname', nickname);
      dispatch(setUserData({ token: data.token, nickname }));
      navigate(appPaths.home());
    }
    if (error) {
      switch (error.status) {
        case 401: {
          setErrors({ password: t('form.errors.password') });
          break;
        }
        case 'FETCH_ERROR': {
          toast.error(t('toast.errorNetwork'));
          break;
        }
        default: {
          setErrors({ password: t('form.errors.password') });
        }
      }
    }
  };

  return (
    <Container className="container-fluid h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col xs="12" md="8" xxl="8">
          <Card className="shadow-sm">
            <Card.Body className="row">
              <Col xs="12" md="6" className="d-flex align-items-center justify-content-center">
                <Image src="login.jpeg" alt={t('loginPage.title')} />
              </Col>
              <Col xs="12" md="6">
                <Formik
                  initialValues={{ nickname: '', password: '' }}
                  onSubmit={submitForm}
                >
                  {({
                    handleSubmit, handleChange, values, errors,
                  }) => (
                    <Form onSubmit={handleSubmit} className="form">
                      <h1>{t('loginPage.title')}</h1>
                      <Form.Group className="mb-3">
                        <Form.Label htmlFor="nickname">{t('loginPage.nickname')}</Form.Label>
                        <Form.Control
                          id="nickname"
                          required
                          value={values.nickname}
                          onChange={handleChange}
                          type="text"
                          name="nickname"
                          isInvalid={!!errors.password}
                          autoFocus
                        />
                      </Form.Group>
                      <Form.Group className="mb-3 position-relative">
                        <Form.Label htmlFor="password">{t('loginPage.password')}</Form.Label>
                        <Form.Control
                          id="password"
                          required
                          value={values.password}
                          onChange={handleChange}
                          type="password"
                          name="password"
                          isInvalid={!!errors.password}
                        />
                        <Form.Control.Feedback type="invalid" tooltip>{errors.password}</Form.Control.Feedback>
                      </Form.Group>
                      <Button type="submit" className="w-100" variant="outline-primary">{t('loginPage.button')}</Button>
                    </Form>
                  )}
                </Formik>
              </Col>
            </Card.Body>
            <Card.Footer className="p-4">
              <div className="text-center">
                <span>
                  {t('loginPage.footer.text')}
                  {' '}
                  <Link to={appPaths.signup()}>{t('loginPage.footer.link')}</Link>
                </span>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
