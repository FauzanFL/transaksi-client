import { useEffect, useState } from 'react';
import { isLogin } from '../api/users';
import useTitle from '../hooks/UseTitle';
import { useNavigate } from 'react-router-dom';
import { Container, Content, Panel } from 'rsuite';
import SidebarComp from '../components/SidebarComp';
import HeaderComp from '../components/HeaderComp';
import { alertError } from '../utils/sweetalert';
import { getAllSales } from '../api/sales';
import { formatRp } from '../utils/formatting';
import { getAllBarang } from '../api/barang';
import { getAllCustomer } from '../api/customers';

const Dashboard = () => {
  const navigate = useNavigate();
  const [uname, setUname] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [barangs, setBarangs] = useState([]);
  const [customers, setCustomers] = useState([]);
  useTitle('Dashboard | Program Transaksi');

  useEffect(() => {
    const isLoggedIn = async () => {
      try {
        const res = await isLogin();
        setUname(res.data.user.username);
      } catch (e) {
        if (e.response.status === 403) {
          alertError('Silakan login terlebih dahulu');
          navigate('/');
        } else {
          console.log(e);
        }
      }
    };

    const fetchTransactions = async () => {
      try {
        const res = await getAllSales();
        if (res.status === 200) {
          setTransactions(res.data);
        }
      } catch (e) {
        console.log(e);
      }
    };
    const fetchBarang = async () => {
      try {
        const res = await getAllBarang();
        if (res.status === 200) {
          setBarangs(res.data);
        }
      } catch (e) {
        console.log(e);
      }
    };
    const fetchCustomer = async () => {
      try {
        const res = await getAllCustomer();
        if (res.status === 200) {
          setCustomers(res.data);
        }
      } catch (e) {
        console.log(e);
      }
    };

    fetchBarang();
    fetchCustomer();
    fetchTransactions();
    isLoggedIn();
  }, [navigate]);

  const sum = transactions.length;
  const sumBarang = barangs.length;
  const sumCust = customers.length;
  let max = 0;
  let min = 0;
  if (transactions.length !== 0) {
    max = Math.max(...transactions.map((t) => parseFloat(t.total_bayar)));
    min = Math.min(...transactions.map((t) => parseFloat(t.total_bayar)));
  }

  const total = transactions.reduce(
    (prev, item) => prev + parseFloat(item.total_bayar),
    0
  );
  return (
    <>
      <Container className="h-[100vh]">
        <SidebarComp page={'dashboard'} />
        <Container>
          <HeaderComp uname={uname} />
          <Content style={{ padding: 10, overflow: 'auto' }}>
            <h1 className="mb-3">Dashboard</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Panel header={<h2 className="text-xl">Summary</h2>} bordered>
                <table>
                  <tbody>
                    <tr>
                      <th className="p-1 m-1 text-start">Jumlah transaksi</th>
                      <td className="p-1 font-bold">:</td>
                      <td className="p-1">{sum}</td>
                    </tr>
                    <tr>
                      <th className="p-1 m-1 text-start">Transaksi terbesar</th>
                      <td className="p-1 font-bold">:</td>
                      <td className="p-1">{formatRp(max)}</td>
                    </tr>
                    <tr>
                      <th className="p-1 m-1 text-start">Transaksi terkecil</th>
                      <td className="p-1 font-bold">:</td>
                      <td className="p-1">{formatRp(min)}</td>
                    </tr>
                    <tr>
                      <th className="p-1 m-1 text-start">Total transaksi</th>
                      <td className="p-1 font-bold">:</td>
                      <td className="p-1">{formatRp(total)}</td>
                    </tr>
                    <tr>
                      <th className="p-1 m-1 text-start">Total Customer</th>
                      <td className="p-1 font-bold">:</td>
                      <td className="p-1">{sumCust}</td>
                    </tr>
                    <tr>
                      <th className="p-1 m-1 text-start">Total Barang</th>
                      <td className="p-1 font-bold">:</td>
                      <td className="p-1">{sumBarang}</td>
                    </tr>
                  </tbody>
                </table>
              </Panel>
            </div>
          </Content>
        </Container>
      </Container>
    </>
  );
};

export default Dashboard;
