import sharp from "sharp";
import nodemailer from 'nodemailer';
import moment from "moment";
import { join } from "path";
import { Currencies, Money } from "ts-money";
import fs from 'fs';

async function convertBase64ToJpegAndReturnBase64(base64String: string): Promise<string> {
    // Si la cadena contiene el encabezado (header), lo removemos
    let base64Data = base64String;
    if (base64String.includes('base64,')) {
      base64Data = base64String.split('base64,')[1];
    }
  
    // Convertir la cadena Base64 en un Buffer
    const inputBuffer = Buffer.from(base64Data, 'base64');
  
    // Convertir la imagen a JPEG y obtener el resultado como Buffer
    const jpegBuffer = await sharp(inputBuffer)
      .jpeg({ quality: 80 }) // Puedes ajustar la calidad de 1 a 100
      .toBuffer();
  
    // Convertir el Buffer resultante a una cadena Base64
    const jpegBase64 = jpegBuffer.toString('base64');
  
    // Opcional: agregar el prefijo de datos si lo necesitas
    const resultBase64 = `data:image/jpeg;base64,${jpegBase64}`;
  
    return resultBase64;
  }
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE, // Puedes usar otros servicios como Outlook, Yahoo, etc.
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  
  
  const sendEmail = (params: {
    to: string,
    subject: string,
    text: string,
    html: string
    attachments?:any[]
  }) => {
    try {
      const { to, subject, text, html,   attachments } = params;
      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: to,
        subject: subject,
        html,
        attachments
      };
  
      transporter.sendMail(mailOptions, (error:any, info:any) => {
        if (error) {
          throw error;
        }
        return info;
      });
    } catch (e) {
      throw e;
    }
  }
  

  const obtenerEtiqueta = (reserva:any) =>{
    const fechaCreacion = new Date(reserva.reservaCreado);
    const fechaFormateada = `${fechaCreacion.getFullYear()}${(fechaCreacion.getMonth() + 1).toString().padStart(2, '0')}${fechaCreacion.getDate().toString().padStart(2, '0')}`;
  
    let reservaNumeroEtiqueta = `CDC-${fechaFormateada}-${reserva?.reservaNumero?.toString().padStart(3, '0')}`
    return reservaNumeroEtiqueta;
  }
  
  const removerBase64Data = (imagenBase64:string) =>{
   return imagenBase64.split('base64,')[1];
  }

  const crearPlanillaDetalleReserva = (reserva: any) => {
    var html = fs.readFileSync(join(__dirname,  'planillas', 'detalle.reserva.html')).toString('utf-8');
  
    html = html.replace('{{clienteNombre}}', reserva.cliente.clienteNombre)
    html = html.replace('{{clienteIdentificacion}}', reserva.cliente.clienteIdentificacion);
    html = html.replace('{{reservaFechas}}', `${moment(reserva.reservaFhInicial).format('DD/MM/YYYY')} | ${moment(reserva.reservaFhFinal).format('DD/MM/YYYY')}`)
    html = html.replace('{{beneficiarioNombre}}', reserva.beneficiario.beneficiarioNombre)
    html = html.replace('{{beneficiarioIdentificacion}}', reserva.beneficiario.beneficiarioIdentificacion)
    html = html.replace('{{autoNombre}}', `${reserva.auto.marca.marcaNombre} ${reserva.auto.modelo.modeloNombre} ${reserva.auto.autoAno}`)
    html = html.replace('{{subtotal}}', `${Money.fromDecimal(reserva.reservaMonto.toNumber(), Currencies.USD, Math.ceil)}`)
    html = html.replace('{{itbis}}', `${Money.fromDecimal(reserva.reservaImpuestos.toNumber(), Currencies.USD, Math.ceil)}`)
    html = html.replace('{{descuento}}', `${Money.fromDecimal(reserva.reservaDescuento.toNumber(), Currencies.USD, Math.ceil)}`)
    html = html.replace('{{total}}', `${Money.fromDecimal(reserva.reservaMontoTotal.toNumber(), Currencies.USD, Math.ceil)}`)
    html = html.replace('{{pagado}}', `${Money.fromDecimal(reserva.reservaPagado.toNumber(), Currencies.USD, Math.ceil)}`)
    html = html.replace('{{deuda}}', `${Money.fromDecimal((reserva.reservaMontoTotal.toNumber() - reserva.reservaPagado.toNumber()), Currencies.USD, Math.ceil)}`)
    html = html.replace('{{imagen}}', `${reserva.auto.imagenes[0].imagenBase64}`);
    html = html.replaceAll('{{reservaTitulo}}', `Reserva ${obtenerEtiqueta(reserva)}`);
    html = html.replaceAll('{{reservaFhInicial}}', moment(reserva.reservaFhInicial).format('YYYYMMDDTHHMMSSZ'));
    html = html.replaceAll('{{reservaFhFinal}}', moment(reserva.reservaFhFinal).format('YYYYMMDDTHHMMSSZ'));
    html = html.replaceAll('{{reservaRecogida}}', reserva.reservaRecogidaDireccion);
    html = html.replaceAll('{{reservaDetalle}}', `${reserva.auto.marca.marcaNombre} ${reserva.auto.modelo.modeloNombre} ${reserva.auto.autoAno}`);
    return html;
  }

  async function agregarMarcaAgua(base64Imagen:string, base64MarcaAgua:string, opacidad = 0.5) {
    const imagenBuffer = Buffer.from(base64Imagen, 'base64');
    const marcaAguaBuffer = Buffer.from(base64MarcaAgua, 'base64');

    const marcaAguaProcesada = await sharp(marcaAguaBuffer)
        .ensureAlpha() // Asegura que la imagen tenga un canal alfa
        .modulate({ brightness: opacidad }) // Ajusta la opacidad
        .toBuffer();

    const imagenProcesada = await sharp(imagenBuffer)
        .composite([{ input: marcaAguaProcesada, gravity: 'southeast', blend: 'over' }]) // Superposición con opacidad
        .toBuffer();

    return imagenProcesada.toString('base64'); // Convertir nuevamente a Base64
}

  export {
    convertBase64ToJpegAndReturnBase64,
    obtenerEtiqueta,
    sendEmail,
    removerBase64Data,
    crearPlanillaDetalleReserva,
    agregarMarcaAgua
  }