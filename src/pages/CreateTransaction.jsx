/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { forwardRef, useEffect, useState } from 'react';
import { isLogin } from '../api/users';
import {
  Button,
  ButtonToolbar,
  Container,
  Content,
  DatePicker,
  Drawer,
  Form,
  IconButton,
  Input,
  InputGroup,
  InputNumber,
  List,
  Message,
  Panel,
  Popover,
  Table,
  useToaster,
  Whisper,
} from 'rsuite';
import SidebarComp from '../components/SidebarComp';
import HeaderComp from '../components/HeaderComp';
import useTitle from '../hooks/UseTitle';
import { useNavigate } from 'react-router-dom';
import { Edit, PlusRound, Search, SearchPeople, Trash } from '@rsuite/icons';
import Column from 'rsuite/esm/Table/TableColumn';
import { Cell, HeaderCell } from 'rsuite-table';
import { createSales, searchSales } from '../api/sales';
import { getAllCustomer } from '../api/customers';
import { getAllBarang } from '../api/barang';
import { formatRp } from '../utils/formatting';
import { alertError, alertSuccess } from '../utils/sweetalert';

const Overlay = forwardRef(({ datas, onSelect, onClose, ...rest }, ref) => {
  const handleSelect = (data) => {
    onSelect(data);
    onClose();
  };

  return (
    <Popover {...rest} style={{ width: 160 }} ref={ref}>
      <List>
        {datas.map((data, i) => (
          <List.Item
            onClick={() => handleSelect(data)}
            className="flex bg-white hover:cursor-pointer hover:bg-slate-200"
            key={i}
          >
            <div className="font-bold border px-2">{data.kode}</div>
            <div className="mx-2">{data.nama}</div>
          </List.Item>
        ))}
      </List>
    </Popover>
  );
});

const DrawerEditBarang = ({ barang, open, close, onSave }) => {
  const [qty, setQty] = useState(1);
  const [diskon, setDiskon] = useState(0);
  const toaster = useToaster();

  useEffect(() => {
    setQty(barang.qty);
    setDiskon(barang.diskon_nilai * 100);
  }, [barang]);

  const handleSave = () => {
    const diskonNilai = diskon / 100;
    const diskonHarga = parseFloat(barang.harga_bandrol) * diskonNilai;
    const data = {
      barang_id: barang.barang_id,
      harga_bandrol: barang.harga_bandrol,
      qty: parseInt(qty),
      diskon_nilai: diskonNilai,
      diskon_harga: diskonHarga,
      kode: barang.kode,
      nama: barang.nama,
    };
    toaster.push(messageSuccess, { placement: 'topStart', duration: 2000 });
    onSave(data);
    close();
  };

  const handleClose = () => {
    close();
    setQty(1);
    setDiskon(0);
  };

  const messageSuccess = (
    <Message showIcon type="success">
      <b>Success!</b> Berhasil mengedit barang
    </Message>
  );

  let hargaDiskon = 0;
  let total = 0;

  const diskonFloat = diskon / 100;

  hargaDiskon = parseInt(barang.harga_bandrol) * diskonFloat;
  total = parseInt(barang.harga_bandrol) * qty - qty * hargaDiskon;

  return (
    <>
      <Drawer open={open} onClose={handleClose}>
        <Drawer.Header>
          <Drawer.Title style={{ fontWeight: 'bold' }}>
            Edit Barang
          </Drawer.Title>
          <Drawer.Actions>
            <Button appearance="primary" color="blue" onClick={handleSave}>
              Selesai
            </Button>
          </Drawer.Actions>
        </Drawer.Header>
        <Drawer.Body>
          <div className="flex items-center mb-2">
            <Form.ControlLabel className="font-bold w-[65px]">
              Kode
            </Form.ControlLabel>
            <IconButton style={{ width: 150 }} icon={<Search />} disabled>
              {barang.kode}
            </IconButton>
          </div>
          <div className="flex items-center mb-2">
            <Form.ControlLabel className="font-bold w-[75px]">
              Nama
            </Form.ControlLabel>
            <Input name="nama" value={barang.nama} type="text" disabled />
          </div>
          <div className="flex items-center mb-2">
            <Form.ControlLabel className="font-bold w-[75px]">
              Harga Bandrol
            </Form.ControlLabel>
            <Input
              name="harga"
              value={formatRp(barang.harga_bandrol)}
              type="text"
              disabled
            />
          </div>
          <div className="flex items-center mb-2">
            <Form.ControlLabel className="font-bold w-[75px]">
              Kuantitas
            </Form.ControlLabel>
            <InputNumber
              onChange={(value) =>
                setQty(value === '' || value <= 0 ? 1 : value)
              }
              defaultValue={barang.qty}
              name="qty"
              min={1}
            />
          </div>
          <div className="flex items-center mb-2">
            <Form.ControlLabel className="font-bold w-[75px]">
              Diskon
            </Form.ControlLabel>
            <InputGroup>
              <InputNumber
                onChange={(value) =>
                  setDiskon(
                    value === '' || value < 0 ? 0 : value > 100 ? 100 : value
                  )
                }
                defaultValue={barang.diskon_nilai * 100}
                name="diskon"
                max={100}
                min={0}
              />
              <InputGroup.Addon>%</InputGroup.Addon>
            </InputGroup>
          </div>
          <div className="flex items-center mb-2">
            <Form.ControlLabel className="font-bold w-[75px]">
              Harga Diskon
            </Form.ControlLabel>
            <Input
              name="hargaDiskon"
              value={formatRp(hargaDiskon)}
              type="text"
              disabled
            />
          </div>
          <div className="flex items-center mb-2">
            <Form.ControlLabel className="font-bold w-[75px]">
              Total
            </Form.ControlLabel>
            <Input
              name="hargaDiskon"
              value={formatRp(total)}
              type="text"
              disabled
            />
          </div>
        </Drawer.Body>
      </Drawer>
    </>
  );
};

const DrawerAddBarang = ({ barangInput, open, close, barangs, onAdd }) => {
  const [selectedBarang, setSelectedBarang] = useState({});
  const [qty, setQty] = useState(1);
  const [diskon, setDiskon] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [msg, setMsg] = useState('');
  const toaster = useToaster();

  const handleBarang = (barang) => {
    const isAny = barangInput.filter((item) => item.kode === barang.kode);
    if (isAny.length > 0) {
      setMsg('Barang sudah ada');
      setShowAlert(true);
    } else {
      setSelectedBarang(barang);
      setShowAlert(false);
    }
  };

  const handleAdd = () => {
    const diskonNilai = diskon / 100;
    const data = {
      barang_id: selectedBarang.id,
      harga_bandrol: selectedBarang.harga,
      qty,
      diskon_nilai: diskonNilai,
      diskon_harga: selectedBarang.harga * diskonNilai,
      kode: selectedBarang.kode,
      nama: selectedBarang.nama,
    };
    if (selectedBarang.id) {
      onAdd(data);
      toaster.push(messageSuccess, { placement: 'topStart', duration: 2000 });
      setSelectedBarang({});
      setQty(1);
      setDiskon(0);
      setShowAlert(false);
      close();
    } else {
      setMsg('Harap pilih barang terlebih dahulu');
      setShowAlert(true);
    }
  };

  const handleClose = () => {
    close();
    setSelectedBarang({});
    setQty(1);
    setDiskon(0);
    setShowAlert(false);
  };

  const messageSuccess = (
    <Message showIcon type="success">
      <b>Success!</b> Berhasil menambah barang
    </Message>
  );

  let hargaDiskon = 0;
  let total = 0;

  if (selectedBarang.id) {
    const diskonFloat = diskon / 100;
    hargaDiskon = selectedBarang.harga * diskonFloat;
    total = parseFloat(selectedBarang.harga) * qty - qty * hargaDiskon;
  }

  return (
    <>
      <Drawer open={open} onClose={handleClose}>
        <Drawer.Header>
          <Drawer.Title style={{ fontWeight: 'bold' }}>
            Tambah Barang
          </Drawer.Title>
          <Drawer.Actions>
            <Button appearance="primary" color="blue" onClick={handleAdd}>
              Selesai
            </Button>
          </Drawer.Actions>
        </Drawer.Header>
        {showAlert && (
          <Message showIcon type="error">
            {msg}
          </Message>
        )}
        <Drawer.Body>
          <div className="flex items-center mb-2">
            <Form.ControlLabel className="font-bold w-[65px]">
              Kode
            </Form.ControlLabel>
            <Whisper
              trigger="click"
              placement="rightStart"
              style={{ position: 'relative' }}
              speaker={(props, ref) => {
                const { className, left, top, onClose } = props;
                return (
                  <Overlay
                    style={{ left, top }}
                    datas={barangs}
                    onSelect={handleBarang}
                    onClose={onClose}
                    className={className}
                    ref={ref}
                  />
                );
              }}
            >
              <IconButton style={{ width: 150 }} icon={<Search />}>
                {selectedBarang.kode ? selectedBarang.kode : 'Kode Barang'}
              </IconButton>
            </Whisper>
          </div>
          <div className="flex items-center mb-2">
            <Form.ControlLabel className="font-bold w-[75px]">
              Nama
            </Form.ControlLabel>
            <Input
              name="nama"
              value={selectedBarang.nama}
              type="text"
              disabled
            />
          </div>
          <div className="flex items-center mb-2">
            <Form.ControlLabel className="font-bold w-[75px]">
              Harga Bandrol
            </Form.ControlLabel>
            <Input
              name="harga"
              value={selectedBarang.harga ? formatRp(selectedBarang.harga) : ''}
              type="text"
              disabled
            />
          </div>
          <div className="flex items-center mb-2">
            <Form.ControlLabel className="font-bold w-[75px]">
              Kuantitas
            </Form.ControlLabel>
            <InputNumber
              onChange={(value) =>
                setQty(value === '' || value <= 0 ? 1 : value)
              }
              defaultValue={qty}
              name="qty"
              min={1}
            />
          </div>
          <div className="flex items-center mb-2">
            <Form.ControlLabel className="font-bold w-[75px]">
              Diskon
            </Form.ControlLabel>
            <InputGroup>
              <InputNumber
                onChange={(value) =>
                  setDiskon(
                    value === '' || value < 0 ? 0 : value > 100 ? 100 : value
                  )
                }
                defaultValue={diskon}
                name="diskon"
                max={100}
                min={0}
              />
              <InputGroup.Addon>%</InputGroup.Addon>
            </InputGroup>
          </div>
          <div className="flex items-center mb-2">
            <Form.ControlLabel className="font-bold w-[75px]">
              Harga Diskon
            </Form.ControlLabel>
            <Input
              name="hargaDiskon"
              value={formatRp(hargaDiskon)}
              type="text"
              disabled
            />
          </div>
          <div className="flex items-center mb-2">
            <Form.ControlLabel className="font-bold w-[75px]">
              Total
            </Form.ControlLabel>
            <Input
              name="hargaDiskon"
              value={formatRp(total)}
              type="text"
              disabled
            />
          </div>
        </Drawer.Body>
      </Drawer>
    </>
  );
};

const generateKode = async () => {
  const now = new Date(Date.now());
  const kodeSearch = `${now.getFullYear()}${now.getDate()}`;
  try {
    const res = await searchSales(kodeSearch);
    if (res.status === 200) {
      const arr = res.data;
      if (arr.length === 0) {
        return kodeSearch + '-0001';
      } else {
        const kodeGet = Math.max(
          ...arr.map((item) => parseInt(item.kode.slice(-4)))
        );

        const num = kodeGet + 1;
        return `${kodeSearch}-${num.toString().padStart(4, '0')}`;
      }
    }
  } catch (e) {
    console.log(e);
  }
};

const createRowData = (item, rowIndex, onDelete, onEdit) => {
  const harga = formatRp(item.harga_bandrol);

  const diskonRp = formatRp(item.diskon_harga);

  const diskonSum = item.qty * item.diskon_harga;
  const hargaDiskon = formatRp(diskonSum);

  const totalHarga = item.harga_bandrol * item.qty - diskonSum;
  const total = formatRp(totalHarga);

  const diskon = item.diskon_nilai * 100;

  const Action = () => {
    return (
      <ButtonToolbar>
        <IconButton
          appearance="primary"
          color="yellow"
          size="md"
          onClick={onEdit}
          icon={<Edit />}
        ></IconButton>
        <IconButton
          appearance="primary"
          color="red"
          size="md"
          onClick={() => onDelete(item)}
          icon={<Trash />}
        ></IconButton>
      </ButtonToolbar>
    );
  };

  return {
    aksi: <Action />,
    no: rowIndex + 1,
    kode: item.kode,
    nama: item.nama,
    qty: item.qty,
    harga,
    diskonPercent: diskon.toString() + '%',
    diskonRp,
    hargaDiskon,
    total,
  };
};

const CreateTransaction = () => {
  const navigate = useNavigate();
  const [uname, setUname] = useState('');
  const [customers, setCustomers] = useState([]);
  const [barangs, setBarangs] = useState([]);
  const [selectedCust, setSelectedCust] = useState({});
  const [selectedBarang, setSelectedBarang] = useState({});
  const [kode, setKode] = useState('');
  const [tgl, setTgl] = useState('');
  const [openDrawerAdd, setOpenDrawerAdd] = useState(false);
  const [openDrawerEdit, setOpenDrawerEdit] = useState(false);
  const [barangsInput, setBarangsInput] = useState([]);
  const [diskon, setDiskon] = useState(0);
  const [ongkir, setOngkir] = useState(0);
  const [errMsg, setErrMsg] = useState([]);
  const toaster = useToaster();
  useTitle('Buat Transaksi | Program Transaksi');

  useEffect(() => {
    const isLoggedIn = async () => {
      try {
        const res = await isLogin();
        setUname(res.data.user.username);
      } catch (e) {
        console.log(e);
        if (e.response.status === 403) {
          alertError('Silakan login terlebih dahulu');
          navigate('/');
        }
      }
    };
    const getCode = async () => {
      const code = await generateKode();
      setKode(code);
    };
    const getCustomers = async () => {
      try {
        const res = await getAllCustomer();
        if (res.status === 200) {
          setCustomers(res.data);
        }
      } catch (e) {
        console.log(e);
      }
    };
    const getBarang = async () => {
      try {
        const res = await getAllBarang();
        if (res.status === 200) {
          setBarangs(res.data);
        }
      } catch (e) {
        console.log(e);
      }
    };

    getCode();
    getBarang();
    getCustomers();
    isLoggedIn();
  }, [navigate]);

  const handleCust = (cust) => {
    setSelectedCust(cust);
  };

  const handleAddBarangs = (barang) => {
    const items = [...barangsInput, barang];
    setBarangsInput(items);
  };

  const handleEditBarangs = (barang) => {
    const barangsArr = [...barangsInput];
    const index = barangsArr.findIndex((item) => item.kode === barang.kode);
    barangsArr.splice(index, 1, barang);
    setBarangsInput(barangsArr);
    setSelectedBarang({});
  };

  const handleCloseEditBarang = () => {
    setOpenDrawerEdit(false);
    setSelectedBarang({});
  };

  const isValid = () => {
    let valid = true;
    const msg = [];

    if (tgl === '') {
      msg.push('Pilih tanggal terlebih dahulu');
      valid = false;
    }

    if (selectedCust.id === undefined) {
      msg.push('Pilih customer terlebih dahulu');
      valid = false;
    }

    if (barangsInput.length <= 0) {
      msg.push('Pilih barang terlebih dahulu');
      valid = false;
    }

    setErrMsg(msg);
    return valid;
  };

  const handleSimpan = async () => {
    if (isValid()) {
      const date = new Date(tgl);
      const data = {
        kode,
        tgl: date.toISOString(),
        cust_id: selectedCust.id,
        subtotal,
        diskon,
        ongkir,
        total_bayar: totalBayar,
        items: barangsInput,
      };
      try {
        const res = await createSales(data);
        if (res.status === 201) {
          alertSuccess('Transaksi berhasil dibuat');
          navigate('/transactions');
        }
      } catch (e) {
        console.log(e);
        alertError(e.response.data.message);
      }
    } else {
      pushToasterErr();
    }
  };

  let subtotal = 0;
  const data = barangsInput.map((barang, i) => {
    const handleEditBarang = () => {
      setSelectedBarang(barang);
      setOpenDrawerEdit(true);
    };

    const handleRemoveBarang = (barang) => {
      const items = barangsInput.filter((item) => item.kode !== barang.kode);
      setBarangsInput(items);
      pushToasterSuccess();
    };

    const diskonSum = barang.qty * barang.diskon_harga;
    const totalHarga = barang.harga_bandrol * barang.qty - diskonSum;
    subtotal += parseFloat(totalHarga);
    return createRowData(barang, i, handleRemoveBarang, handleEditBarang);
  });

  const ongkirAndDiskon = parseInt(ongkir) + parseInt(diskon);
  const totalBayar = subtotal - ongkirAndDiskon;

  const setTotal = () => {
    if (totalBayar < 0) {
      return 0;
    }
    return totalBayar;
  };

  const pushToasterErr = () => {
    toaster.push(messageErr, { placement: 'topStart', duration: 5000 });
  };

  const pushToasterSuccess = () => {
    toaster.push(messageSuccess, { placement: 'topStart', duration: 3000 });
  };

  const messageSuccess = (
    <Message showIcon type="success">
      <b>Success!</b> Berhasil menghapus barang
    </Message>
  );

  const messageErr = (
    <Message showIcon type="error" header="Error" closable>
      <ol className="list-disc">
        {errMsg.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ol>
    </Message>
  );

  return (
    <>
      <Container className="h-[100vh]">
        <SidebarComp page={'createTransaction'} />
        <Container>
          <HeaderComp uname={uname} />
          <Content style={{ padding: 10, overflow: 'auto' }}>
            <h1 className="mb-3">Buat Transaksi</h1>
            <Panel
              header="Transaksi"
              bordered
              style={{ maxWidth: 500, marginBottom: 10 }}
            >
              <div className="flex items-center mb-2">
                <Form.ControlLabel className="font-bold w-[70px]">
                  No
                </Form.ControlLabel>
                <Input name="no" type="text" value={kode} disabled />
              </div>
              <div className="flex items-center">
                <Form.ControlLabel className="font-bold w-[60px]">
                  Tanggal
                </Form.ControlLabel>
                <DatePicker
                  onChange={(value) => setTgl(value)}
                  name="tgl"
                  format="dd-MMM-yyyy"
                />
              </div>
            </Panel>
            <Panel
              header="Customer"
              bordered
              style={{ maxWidth: 500, marginBottom: 10 }}
            >
              <div className="flex items-center mb-2">
                <Form.ControlLabel className="font-bold w-[60px]">
                  Kode
                </Form.ControlLabel>
                <Whisper
                  trigger="click"
                  placement="bottom"
                  speaker={(props, ref) => {
                    const { className, left, top, onClose } = props;
                    return (
                      <Overlay
                        style={{ left, top }}
                        datas={customers}
                        onSelect={handleCust}
                        onClose={onClose}
                        className={className}
                        ref={ref}
                      />
                    );
                  }}
                >
                  <IconButton style={{ width: 150 }} icon={<SearchPeople />}>
                    {selectedCust.kode ? selectedCust.kode : 'Cari Kode'}
                  </IconButton>
                </Whisper>
              </div>
              <div className="flex items-center mb-2">
                <Form.ControlLabel className="font-bold w-[70px]">
                  Nama
                </Form.ControlLabel>
                <Input
                  name="nama"
                  value={selectedCust.nama}
                  type="text"
                  disabled
                />
              </div>
              <div className="flex items-center">
                <Form.ControlLabel className="font-bold w-[70px]">
                  Telp
                </Form.ControlLabel>
                <Input
                  name="telp"
                  value={selectedCust.telp}
                  type="text"
                  disabled
                />
              </div>
            </Panel>
            <Panel header="Barang" bordered>
              <IconButton
                appearance="primary"
                color="green"
                style={{ marginBottom: 5 }}
                onClick={() => setOpenDrawerAdd(true)}
                icon={<PlusRound />}
              >
                Tambah
              </IconButton>
              <Table
                data={data}
                bordered
                cellBordered
                autoHeight
                rowHeight={60}
              >
                <Column minWidth={150} flexGrow={2} fixed>
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
                <Column minWidth={100} flexGrow={2}>
                  <HeaderCell align="center" className="font-bold">
                    Kode Barang
                  </HeaderCell>
                  <Cell dataKey="kode" align="end" />
                </Column>
                <Column minWidth={100} flexGrow={2}>
                  <HeaderCell align="center" className="font-bold">
                    Nama Barang
                  </HeaderCell>
                  <Cell dataKey="nama" align="end" />
                </Column>
                <Column width={50}>
                  <HeaderCell align="center" className="font-bold">
                    Qty
                  </HeaderCell>
                  <Cell dataKey="qty" align="end" />
                </Column>
                <Column minWidth={120} flexGrow={2}>
                  <HeaderCell align="center" className="font-bold">
                    Harga Bandrol
                  </HeaderCell>
                  <Cell dataKey="harga" align="end" />
                </Column>
                <Column width={80}>
                  <HeaderCell align="center" className="font-bold">
                    Diskon (%)
                  </HeaderCell>
                  <Cell dataKey="diskonPercent" align="end" />
                </Column>
                <Column minWidth={120} flexGrow={2}>
                  <HeaderCell align="center" className="font-bold">
                    Diskon (Rp)
                  </HeaderCell>
                  <Cell dataKey="diskonRp" align="end" />
                </Column>
                <Column minWidth={120} flexGrow={2}>
                  <HeaderCell align="center" className="font-bold">
                    Harga Diskon
                  </HeaderCell>
                  <Cell dataKey="hargaDiskon" align="end" />
                </Column>
                <Column minWidth={120} flexGrow={2}>
                  <HeaderCell align="center" className="font-bold">
                    Total
                  </HeaderCell>
                  <Cell dataKey="total" align="end" />
                </Column>
              </Table>
              <div className="flex justify-end mt-4">
                <div className="min-w-[250px] mr-2">
                  <table className="w-full">
                    <tr className="h-8">
                      <th className="text-start">Sub Total</th>
                      <td className="text-end">{formatRp(subtotal)}</td>
                    </tr>
                    <tr className="h-10">
                      <th className="text-start">Diskon</th>
                      <td className="text-end">
                        <InputNumber
                          min={0}
                          max={totalBayar}
                          onChange={(value) =>
                            setDiskon(value === '' || value < 0 ? 0 : value)
                          }
                        />
                      </td>
                    </tr>
                    <tr className="h-10">
                      <th className="text-start">Ongkir</th>
                      <td className="text-end">
                        <InputNumber
                          min={0}
                          max={totalBayar}
                          onChange={(value) =>
                            setOngkir(value === '' || value < 0 ? 0 : value)
                          }
                        />
                      </td>
                    </tr>
                    <tr className="h-8">
                      <th className="text-start">Total Bayar</th>
                      <td className="text-end">{formatRp(setTotal())}</td>
                    </tr>
                  </table>
                </div>
              </div>
            </Panel>
            <div className="flex justify-center items-center">
              <ButtonToolbar style={{ margin: 10 }}>
                <Button
                  appearance="primary"
                  onClick={handleSimpan}
                  color="blue"
                >
                  Simpan
                </Button>
                <Button onClick={() => navigate('/transactions')}>Batal</Button>
              </ButtonToolbar>
            </div>
          </Content>
        </Container>
        <DrawerAddBarang
          barangInput={barangsInput}
          barangs={barangs}
          open={openDrawerAdd}
          close={() => setOpenDrawerAdd(false)}
          onAdd={handleAddBarangs}
        />
        <DrawerEditBarang
          barang={selectedBarang}
          barangs={barangs}
          open={openDrawerEdit}
          close={handleCloseEditBarang}
          onSave={handleEditBarangs}
        />
      </Container>
    </>
  );
};

export default CreateTransaction;
