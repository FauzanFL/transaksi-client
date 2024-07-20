/* eslint-disable react/prop-types */
import { OffRound } from '@rsuite/icons';
import { Button, Header } from 'rsuite';
import { removeCookie } from '../utils/jscookie';
import { useNavigate } from 'react-router-dom';

const HeaderComp = ({ uname }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    removeCookie('token');
    navigate('/');
  };
  return (
    <>
      <Header
        className="shadow-sm bg-gradient-to-l from-sky-200 to-blue-400"
        style={{
          padding: '10px 20px 10px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div className="text-xl font-bold text-white">{uname}</div>
        <Button color="red" appearance="primary" onClick={handleLogout}>
          <OffRound style={{ marginRight: 2 }} />
          Logout
        </Button>
      </Header>
    </>
  );
};

export default HeaderComp;
