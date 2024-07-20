import { useEffect, useState } from 'react';
import {
  Container,
  Content,
  Form,
  ButtonToolbar,
  Button,
  Panel,
  FlexboxGrid,
  Input,
  InputGroup,
} from 'rsuite';
import EyeIcon from '@rsuite/icons/legacy/Eye';
import EyeSlashIcon from '@rsuite/icons/legacy/EyeSlash';
import { isLogin, login } from '../api/users';
import { addCookie } from '../utils/jscookie';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const isLoggedIn = async () => {
      try {
        const res = await isLogin();
        if (res.status === 200) {
          navigate('/dashboard');
        }
      } catch (e) {
        console.log(e);
      }
    };
    isLoggedIn();
  }, [navigate]);

  const isValid = () => {
    let valid = true;
    const msg = [];

    if (username === '') {
      valid = false;
      msg.push('Username is required');
    }

    if (password === '') {
      valid = false;
      msg.push('Password is required');
    }

    return valid;
  };

  const handleLogin = async () => {
    if (isValid()) {
      try {
        const res = await login({ username, password });
        if (res.status === 200) {
          addCookie('token', res.data.token);
          navigate('/dashboard');
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <>
      <Container className="h-[100vh] bg-cover bg-center background">
        <Content>
          <FlexboxGrid justify="center" align="middle" className="h-full p-2">
            <FlexboxGrid.Item colspan={24} className="max-w-96">
              <Panel header={<h3>Login</h3>} className="bg-white" bordered>
                <Form onSubmit={handleLogin} fluid>
                  <Form.Group>
                    <Form.ControlLabel>Username</Form.ControlLabel>
                    <Input
                      name="username"
                      type="text"
                      onChange={(value) => setUsername(value)}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.ControlLabel>Password</Form.ControlLabel>
                    <InputGroup inside>
                      <Input
                        name="password"
                        type={visible ? 'text' : 'password'}
                        autoComplete="off"
                        onChange={(value) => setPassword(value)}
                      />
                      <InputGroup.Button onClick={() => setVisible(!visible)}>
                        {visible ? <EyeIcon /> : <EyeSlashIcon />}
                      </InputGroup.Button>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group>
                    <ButtonToolbar>
                      <Button type="submit" appearance="primary">
                        Sign in
                      </Button>
                    </ButtonToolbar>
                  </Form.Group>
                </Form>
              </Panel>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Content>
      </Container>
    </>
  );
};

export default Home;
