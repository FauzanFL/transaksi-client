/* eslint-disable react/prop-types */
import { OffRound } from '@rsuite/icons';
import { Header, IconButton } from 'rsuite';
import { removeCookie } from '../utils/jscookie';
import { useNavigate } from 'react-router-dom';
import { alertSuccess } from '../utils/sweetalert';

const HeaderComp = ({ uname }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    removeCookie('token');
    alertSuccess('Logout berhasil');
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
        <div className="hidden md:block">
          <IconButton
            color="red"
            appearance="primary"
            icon={<OffRound />}
            onClick={handleLogout}
          >
            Logout
          </IconButton>
        </div>
        <div className="block md:hidden">
          <IconButton
            color="red"
            appearance="primary"
            icon={<OffRound />}
            onClick={handleLogout}
          />
        </div>
      </Header>
    </>
  );
};

export default HeaderComp;
