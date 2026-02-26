import Swal from "sweetalert2";



//recibmos como parametro el stado de una api u tipo para las alertas 
type TipoIcono = 'success' | 'error' | 'info' | 'warning' | 'question';
type TipoEntrada = TipoIcono | '1' | '0' | number;

export function ToastFlotanteChico(tipo: TipoEntrada, texto?: string, titulo?: string) {
  const icono = determinarTipoStados(tipo);
  Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  }).fire({ icon: icono, title: titulo, text: texto });
}

export function ToastFlotanteMediano(tipo: TipoEntrada, texto?: string) {
  const icono = determinarTipoStados(tipo);
  Swal.fire({
    position: "top-end",
    icon: icono,
    text: texto,
    showConfirmButton: false,
    timer: icono === 'error' ? 5000 : 2000,
  });
}


export function Alerta(tipo: TipoEntrada, texto?: string, titulo?: string) {
  const icono = determinarTipoStados(tipo);
  Swal.fire({
    title: titulo,
    text: texto,
    icon: icono,
    showClass: { popup: 'animate__animated animate__fadeInUp animate__faster' },
    hideClass: { popup: 'animate__animated animate__fadeOutDown animate__faster' },
  });
}

/*
export function Alerta(tipo: TipoEntrada, titulo: string, subtitulo?: string) {
  const icono = determinarTipoStados(tipo);

  Swal.fire({
    title: titulo,
    ...(subtitulo && {
      html: `<div style="margin-top:6px;font-size:13px;color:#6b7280">
              ${subtitulo}
            </div>`
    }),
    icon: icono,
    showClass: {
      popup: 'animate__animated animate__fadeInUp animate__faster',
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutDown animate__faster',
    },
  });
}*/

export function AlertaConfirmacion(texto: string): Promise<boolean> {
  return Swal.fire({
    title: '¿Estás seguro?',
    text: texto,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, confirmar",
    cancelButtonText: "Cancelar",
    showClass: { popup: 'animate__animated animate__fadeInUp animate__faster' },
    hideClass: { popup: 'animate__animated animate__fadeOutDown animate__faster' },
  }).then((result) => result.isConfirmed);
}




function determinarTipoStados(tipo: TipoEntrada): TipoIcono {
  // HTTP status codes
  if (typeof tipo === 'number') {
    if (tipo >= 200 && tipo < 300) return 'success';
    if (tipo >= 400 && tipo < 500) return 'warning';
    if (tipo >= 500) return 'error';
    return 'info';
  }

  // string '1' / '0'
  if (tipo === '1') return 'success';
  if (tipo === '0') return 'error';

  // iconos directos
  const validos: TipoIcono[] = ['success', 'error', 'info', 'warning', 'question'];
  if (validos.includes(tipo as TipoIcono)) return tipo as TipoIcono;

  return 'warning';
}