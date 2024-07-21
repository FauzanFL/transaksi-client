import Swal from 'sweetalert2';

export const alertSuccess = (msg) => {
  Swal.fire({
    title: 'Success',
    text: msg,
    icon: 'success',
    timer: 2000,
    timerProgressBar: true,
  });
};

export const alertError = (msg) => {
  Swal.fire({
    title: 'Error',
    text: msg,
    icon: 'error',
    timer: 2000,
    timerProgressBar: true,
  });
};

export const alertConfirm = (msg, next) => {
  Swal.fire({
    title: 'Apakah Anda yakin?',
    text: msg,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#b8b6b0',
    confirmButtonText: 'Ya!',
    cancelButtonText: 'Batal',
  }).then((res) => {
    if (res.isConfirmed) {
      next();
    }
  });
};
