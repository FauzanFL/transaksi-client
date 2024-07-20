import { useEffect, useState } from 'react';
import { isLogin } from '../api/users';
import useTitle from '../hooks/UseTitle';
import { useNavigate } from 'react-router-dom';
import { Container, Content } from 'rsuite';
import SidebarComp from '../components/SidebarComp';
import HeaderComp from '../components/HeaderComp';

const Dashboard = () => {
  const navigate = useNavigate();
  const [uname, setUname] = useState('');
  useTitle('Dashboard | Program Transaksi');

  useEffect(() => {
    const isLoggedIn = async () => {
      try {
        const res = await isLogin();
        console.log(res);
        setUname(res.data.user.username);
      } catch (e) {
        console.log(e);
        if (e.response.status === 403) {
          navigate('/');
        }
      }
    };
    isLoggedIn();
  }, [navigate]);
  return (
    <>
      <Container className="h-[100vh]">
        <SidebarComp page={'dashboard'} />
        <Container>
          <HeaderComp uname={uname} />
          <Content style={{ padding: 10, overflow: 'auto' }}>
            <h1>Dashboard</h1>
          </Content>
        </Container>
      </Container>
    </>
  );
};

export default Dashboard;
