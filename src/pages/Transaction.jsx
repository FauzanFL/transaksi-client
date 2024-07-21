import { useEffect, useState } from 'react';
import { isLogin } from '../api/users';
import {
  Container,
  Content,
  IconButton,
  Input,
  InputGroup,
  Pagination,
  Panel,
  Table,
  useMediaQuery,
} from 'rsuite';
import SidebarComp from '../components/SidebarComp';
import HeaderComp from '../components/HeaderComp';
import { useNavigate } from 'react-router-dom';
import useTitle from '../hooks/UseTitle';
import { deleteSales, getAllSales, searchSales } from '../api/sales';
import Column from 'rsuite/esm/Table/TableColumn';
import { Cell, HeaderCell } from 'rsuite-table';
import { Plus, Search, Trash } from '@rsuite/icons';
import { formatRp, formatTgl } from '../utils/formatting';
import { alertConfirm, alertError, alertSuccess } from '../utils/sweetalert';

const createRowData = (item, rowIndex, render) => {
  const subtotal = formatRp(item.subtotal);
  const diskon = formatRp(item.diskon);
  const ongkir = formatRp(item.ongkir);
  const total = formatRp(item.total_bayar);

  const deleteData = async () => {
    try {
      const res = await deleteSales(item.id);
      if (res.status === 200) {
        alertSuccess('Berhasil menghapus data');
        render();
      }
    } catch (e) {
      console.log(e);
      alertError(e.response.data.message);
    }
  };

  return {
    aksi: (
      <IconButton
        appearance="primary"
        color="red"
        size="md"
        onClick={() =>
          alertConfirm('Data tidak dapat dipulihakan kembali', deleteData)
        }
        icon={<Trash />}
      ></IconButton>
    ),
    no: rowIndex + 1,
    noTransaksi: item.kode,
    tgl: formatTgl(item.tgl),
    custName: item.customer.nama,
    jmlBarang: item.items.length,
    subtotal,
    diskon,
    ongkir,
    total,
  };
};

const Transaction = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [uname, setUname] = useState('');
  const [sales, setSales] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [isMobile] = useMediaQuery('(max-width: 600px)');
  useTitle('Transaksi | Program Transaksi');

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

    const fetchTransaksi = async () => {
      try {
        const res = await getAllSales();
        if (res.status === 200) {
          setSales(res.data);
          setLoading(false);
        }
      } catch (e) {
        console.log(e);
      }
    };

    fetchTransaksi();
    isLoggedIn();
  }, [navigate]);

  const render = async () => {
    try {
      const res = await getAllSales();
      console.log(res);
      if (res.status === 200) {
        setSales(res.data);
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleSearch = async (key) => {
    try {
      const res = await searchSales(key);
      if (res.status === 200) {
        setSales(res.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const limit = 10;
  const startIndex = (activePage - 1) * limit;
  const endIndex = startIndex + limit;

  let displayedItems = sales;
  if (sales.length != 0) {
    displayedItems = sales.slice(startIndex, endIndex);
  }

  let total = sales.reduce(
    (prev, sale) => prev + parseFloat(sale.total_bayar),
    0
  );
  const data = displayedItems.map((sale, i) => {
    return createRowData(sale, i, render);
  });

  total = total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
  return (
    <>
      <Container className="h-[100vh]">
        <SidebarComp page={'transaction'} />
        <Container>
          <HeaderComp uname={uname} />
          <Content style={{ padding: 10, overflow: 'auto' }}>
            <h1 className="mb-3">Transaksi</h1>
            <Panel header="Daftar transaksi" bordered bodyFill>
              <div className="flex justify-between gap-3 mb-2 mx-2">
                <div className="block md:hidden">
                  <IconButton
                    icon={<Plus />}
                    color="green"
                    appearance="primary"
                    onClick={() => navigate('/transactions/add')}
                  />
                </div>
                <div className="hidden md:block">
                  <IconButton
                    icon={<Plus />}
                    color="green"
                    appearance="primary"
                    onClick={() => navigate('/transactions/add')}
                  >
                    Tambah Transaksi
                  </IconButton>
                </div>
                <InputGroup
                  inside
                  style={{ maxWidth: 350 }}
                  className="shadow-sm"
                >
                  <Input
                    placeholder="Cari..."
                    onChange={(value) => handleSearch(value)}
                  />
                  <InputGroup.Addon>
                    <Search />
                  </InputGroup.Addon>
                </InputGroup>
              </div>
              <Table
                data={data}
                bordered
                cellBordered
                autoHeight
                rowHeight={60}
                loading={loading}
              >
                <Column width={70} fixed>
                  <HeaderCell align="center" className="font-bold">
                    Aksi
                  </HeaderCell>
                  <Cell dataKey="aksi" align="center" />
                </Column>
                <Column width={50}>
                  <HeaderCell align="center" className="font-bold">
                    No
                  </HeaderCell>
                  <Cell dataKey="no" align="end" />
                </Column>
                <Column minWidth={150} flexGrow={2}>
                  <HeaderCell align="center" className="font-bold">
                    No. Transaksi
                  </HeaderCell>
                  <Cell dataKey="noTransaksi" align="center" />
                </Column>
                <Column minWidth={150} flexGrow={2}>
                  <HeaderCell align="center" className="font-bold">
                    Tanggal
                  </HeaderCell>
                  <Cell dataKey="tgl" align="center" />
                </Column>
                <Column minWidth={100} flexGrow={2}>
                  <HeaderCell align="center" className="font-bold">
                    Nama Customer
                  </HeaderCell>
                  <Cell dataKey="custName" align="center" />
                </Column>
                <Column minWidth={100} flexGrow={2}>
                  <HeaderCell align="center" className="font-bold">
                    Jumlah Barang
                  </HeaderCell>
                  <Cell dataKey="jmlBarang" align="end" />
                </Column>
                <Column minWidth={150} flexGrow={2}>
                  <HeaderCell align="center" className="font-bold">
                    Sub Total
                  </HeaderCell>
                  <Cell dataKey="subtotal" align="center" />
                </Column>
                <Column minWidth={150} flexGrow={2}>
                  <HeaderCell align="center" className="font-bold">
                    Diskon
                  </HeaderCell>
                  <Cell dataKey="diskon" align="center" />
                </Column>
                <Column minWidth={150} flexGrow={2}>
                  <HeaderCell align="center" className="font-bold">
                    Ongkir
                  </HeaderCell>
                  <Cell dataKey="ongkir" align="center" />
                </Column>
                <Column minWidth={150} flexGrow={2}>
                  <HeaderCell align="center" className="font-bold">
                    Total
                  </HeaderCell>
                  <Cell dataKey="total" align="center" />
                </Column>
              </Table>
              <Pagination
                layout={
                  isMobile ? ['-', 'pager'] : ['total', '-', '|', 'pager']
                }
                limit={limit}
                total={sales.length}
                first
                last
                next
                prev
                size={isMobile ? 'sm' : 'md'}
                maxButtons={3}
                activePage={activePage}
                onChangePage={setActivePage}
                style={{ margin: 10 }}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 px-2 text-lg font-bold bg-slate-100">
                <div className="text-end">Grand Total</div>
                <div className="text-end md:text-center">{total}</div>
              </div>
            </Panel>
          </Content>
        </Container>
      </Container>
    </>
  );
};

export default Transaction;
