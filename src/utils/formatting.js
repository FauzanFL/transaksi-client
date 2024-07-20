export const formatRp = (val) => {
  return parseFloat(val).toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
  });
};

export const formatTgl = (tgl) => {
  const tglObj = new Date(tgl);
  const hari = tglObj.getDate();
  const bulanIndex = tglObj.getMonth();
  const bulan = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'agu',
    'Sep',
    'Okt',
    'Nov',
    'Dec',
  ][bulanIndex];
  const tahun = tglObj.getFullYear();
  return `${hari}-${bulan}-${tahun}`;
};
