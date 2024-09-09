/* eslint-disable indent */
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useSignupMutation } from '../api/auth';
import { appPaths } from '../routes';
import { setUserData } from '../store/slices/appSlice';

const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [signup] = useSignupMutation();

  const signupSchema = Yup.object().shape({
    nickname: Yup.string()
      .required(t('form.errors.required'))
      .min(3, t('form.errors.range'))
      .max(20, t('form.errors.range')),
    password: Yup.string()
      .required(t('form.errors.required'))
      .min(6, t('form.errors.min')),
    passwordConfirm: Yup.string()
      .required(t('form.errors.required'))
      .oneOf([Yup.ref('password'), null], t('form.errors.passwordMustMatch')),
  });

  const handleFormSubmit = async (values, { setErrors }) => {
    const { nickname, password } = values;
    const user = {
      username: nickname,
      password,
    };
    const { data, error } = await signup(user);
    if (data) {
      dispatch(setUserData({ token: data.token, nickname }));
      navigate(appPaths.home());
    }
    if (error) {
      switch (error.status) {
        case 409: {
          setErrors({ nickname: t('form.errors.userExists') });
          break;
        }
        default: {
          setErrors({ nickname: t('form.errors.nickname'), password: t('form.errors.password'), passwordConfirm: t('form.errors.passwordConfirm') });
        }
      }
    }
  };

  return (
    <Container className="mb-auto mt-auto">
      <Row className="justify-content-center">
        <Col xs="12" md="8" xxl="6">
          <Card className="shadow-sm">
            <Card.Body className="row">
              <Col xs="12" md="6" className="d-flex align-items-center justify-content-center">
                <Image src="signup.jpeg" alt={t('signupPage.imgAlt')} />
              </Col>
              <Col xs="12" md="6">
                <Formik
                  initialValues={{ nickname: '', password: '', passwordConfirm: '' }}
                  onSubmit={handleFormSubmit}
                  validationSchema={signupSchema}
                  validateOnChange
                >
                  {({
                    handleSubmit, handleChange, values, errors,
                  }) => (
                    <Form onSubmit={handleSubmit} className="form">
                      <h1>{t('signupPage.title')}</h1>
                      <Form.Group className="mb-3">
                        <Form.Label htmlFor="nickname">{t('signupPage.nickname')}</Form.Label>
                        <Form.Control
                          required
                          id="nickname"
                          value={values.nickname}
                          onChange={handleChange}
                          type="text"
                          name="nickname"
                          isInvalid={!!errors.nickname}
                        />
                        <Form.Control.Feedback type="invalid">{errors.nickname}</Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label htmlFor="password">{t('signupPage.password')}</Form.Label>
                        <Form.Control
                          required
                          id="password"
                          value={values.password}
                          onChange={handleChange}
                          type="password"
                          name="password"
                          isInvalid={!!errors.password}
                        />
                        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label htmlFor="passwordConfirm">{t('signupPage.passwordConfirm')}</Form.Label>
                        <Form.Control
                          required
                          id="passwordConfirm"
                          value={values.passwordConfirm}
                          onChange={handleChange}
                          type="password"
                          name="passwordConfirm"
                          isInvalid={!!errors.passwordConfirm}
                        />
                        <Form.Control.Feedback type="invalid">{errors.passwordConfirm}</Form.Control.Feedback>
                      </Form.Group>
                      <Button type="submit" className="w-100" variant="outline-primary">{t('signupPage.button')}</Button>
                    </Form>
                  )}
                </Formik>
              </Col>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
