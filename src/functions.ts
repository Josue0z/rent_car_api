import sharp from "sharp";
import nodemailer from 'nodemailer';
import moment from "moment";
import { join } from "path";
import { Currencies, Money } from "ts-money";
import fs from 'fs';

import { AutoEstatus, Autos, Beneficiarios, Ciudades, Colores, Combustibles, Imagenes, Marcas, Modelos, ModelosVersiones, Paises, PrismaClient, Provincias, TipoAuto } from "../prisma/client";

const prisma = new PrismaClient()

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
    let html = fs.readFileSync(join(__dirname,  'planillas', 'detalle.reserva.html')).toString('utf-8');
  
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

const crearPlanillaDetalleAuto = (auto:any) =>{
    let html = fs.readFileSync(join(__dirname,  'planillas', 'auto.detalle.html')).toString('utf-8');

    html = html.replace('{{beneficiario}}', 'Beneficiario: ')
  
    html = html.replace('{{beneficiarioNombre}}', auto.beneficiario.beneficiarioNombre)

    html = html.replace('{{beneficiarioIdentificacion}}', auto.beneficiario.beneficiarioIdentificacion)
    html = html.replace('{{autoNombre}}', `${auto.marca.marcaNombre} ${auto.modelo.modeloNombre} ${auto.autoAno}`)
    html = html.replace('{{imagen}}', `${auto.imagenes[0].imagenBase64}`);

    html = html.replaceAll('{{marca}}','Marca');
    html = html.replaceAll('{{modelo}}','Modelo');
    html = html.replaceAll('{{version}}','Version');
    html = html.replaceAll('{{anoTag}}','Año');
    html = html.replaceAll('{{marcaNombre}}',auto.marca.marcaNombre);
    html = html.replaceAll('{{modeloNombre}}',auto.modelo.modeloNombre);
    html = html.replaceAll('{{versionNombre}}',auto.modeloVersion.versionNombre);
    html = html.replaceAll('{{ano}}',auto.autoAno);

   
    return html;
}


const obtenerRecomendado = async() =>{


    const count = await prisma.autos.count({
    });
    console.log(count)

    let auto = null;
    if (count > 0) {
      const randomSkip = Math.floor(Math.random() * count);

      const autos = await prisma.autos.findMany({
        skip: randomSkip,
        take: 1,
        where:{
          autoEstatus: {
            in: [1]
          }
        },
        include: {
          color: true,
          imagenes: {
            select: {
              imagenId: true,
              imagenArchivo: true,
              imagenNota: true,
              imagenEstatus: true
            },
            where: { imagenEstatus: 2 }
          },
          tipo: true,
          beneficiario: true,
          pais: true,
          provincia: true,
          ciudad: true,
          marca: true,
          modelo: true,
          modeloVersion: true,
          combustible: true,
          transmision: true,
          valoraciones: {
            include: {
              usuario: {
                select: {
                  usuarioLogin: true,
                  usuarioPerfil: true,
                  tipoUsuario: true,
                  cliente: true
                },
              }
            },
            orderBy:{
              valorFecha:"desc"
            }
          },
          autosMeGustas: {
            select: {
              megustaId: true,
              autoId: true,
              usuarioId: true,
            }
          },
          estatus: true
        }
      });
      auto = autos[0]; // Seleccionamos el primer (y único) registro del array.
    }
    return auto;

}

const obtenerMasPotentes = async() =>{
  // const { pagina, cantidad, pais } = req.query;
   // const PAGINA = Number(pagina ?? '1') - 1;
   // const CANTIDAD = Number(cantidad ?? '10');
  
  
    try {
      let xautos: Autos[] = await prisma.$queryRaw`
         SELECT * FROM "Autos" WHERE "autoEstatus" in (1) ORDER BY RANDOM() LIMIT 6;
      `;
  
      let autos: any = [...xautos];
  
      for (let i = 0; i < xautos.length; i++) {
  
        let xauto = autos[i];
  
        let color: Colores[] = await prisma.$queryRaw`
           SELECT * FROM "Colores" WHERE "colorId" = ${xauto.colorId}
        `;
  
    
        let imagenes: Imagenes[] = await prisma.$queryRaw`
         SELECT "imagenId", "imagenArchivo", "imagenNota" FROM "Imagenes" WHERE "autoId" = ${xauto.autoId} AND "imagenEstatus" = 2 ORDER BY "imagenId"
        `;
  
        let tipos: TipoAuto[] = await prisma.$queryRaw`
        SELECT * FROM "TipoAuto" WHERE "tipoId" = ${xauto.tipoId}
        `;
  
  
        let beneficiarios: Beneficiarios[] = await prisma.$queryRaw`
                 SELECT * FROM "Beneficiarios" WHERE "beneficiarioId" = ${xauto.beneficiarioId}
               `;
  
  
        let paises: Paises[] = await prisma.$queryRaw`
        SELECT * FROM "Paises" WHERE "paisId" = ${xauto.paisId}
        `;
  
        let provincias: Provincias[] = await prisma.$queryRaw`
         SELECT * FROM "Provincias" WHERE "provinciaId" = ${xauto.provinciaId}
          `;
  
        let ciudades: Ciudades[] = await prisma.$queryRaw`
            SELECT * FROM "Ciudades" WHERE "ciudadId" = ${xauto.ciudadId}
           `;
  
  
        let marcas: Marcas[] = await prisma.$queryRaw`
             SELECT * FROM "Marcas" WHERE "marcaId" = ${xauto.marcaId}
        `;
  
        let modelos: Modelos[] = await prisma.$queryRaw`
             SELECT * FROM "Modelos" WHERE "modeloId" = ${xauto.modeloId}
            `;
  
        let modelosVersiones:ModelosVersiones[] = await prisma.$queryRaw`
         SELECT * FROM "ModelosVersiones" WHERE "versionId" = ${xauto.modeloVersionId}
        `;
  
          let combustibles:Combustibles[] = await prisma.$queryRaw`
              SELECT * FROM "Combustibles" WHERE "combustibleId" = ${xauto.combustibleId}
           `;
  
  
        let transmisiones: Modelos[] = await prisma.$queryRaw`
             SELECT * FROM "AutoTipoTransmision" WHERE "transmisionId" = ${xauto.transmisionId}
         `;
  
        let estatus: AutoEstatus[] = await prisma.$queryRaw`
          SELECT * FROM "AutoEstatus" WHERE "autoEstatus" = ${xauto.autoEstatus}
          `;
  
        let valoraciones: any[] = await prisma.$queryRaw`
        SELECT * FROM "Valoraciones" WHERE "autoId" = ${xauto.autoId} ORDER BY "valorFecha" DESC
         `;
  
  
        let megustas: any[] = await prisma.$queryRaw`
          SELECT "megustaId", "autoId", "usuarioId" FROM "AutosMeGustas" WHERE "autoId" = ${xauto.autoId}
       `;
  
  
        for (let j = 0; j < valoraciones.length; j++) {
          let valoracion = valoraciones[j];
          let usuarios: any[] = await prisma.$queryRaw`
          SELECT "usuarioLogin", "usuarioPerfil", "usuarioTipo", "clienteId" FROM "Usuarios" WHERE "usuarioId" = ${valoracion.usuarioId}
           `;
          let usuario = usuarios[0];
          let tipoUsuario = await prisma.$queryRaw`
          SELECT * FROM "UsuarioTipo" WHERE "usuarioTipo" = ${usuario.usuarioTipo}
           `;
          let clientes: any[] = await prisma.$queryRaw`
              SELECT * FROM "Clientes" WHERE "clienteId" = ${usuario.clienteId}
            `;
  
  
          valoracion.usuario = usuario;
          usuario.cliente = clientes[0];
          usuario.tipoUsuario = tipoUsuario;
        }
  
  
  
        xauto.color = color[0];
        xauto.imagenes = imagenes;
        xauto.tipo = tipos[0];
        xauto.beneficiario = beneficiarios[0];
        xauto.pais = paises[0];
        xauto.provincia = provincias[0];
        xauto.ciudad = ciudades[0];
        xauto.marca = marcas[0];
        xauto.modelo = modelos[0];
        xauto.modeloVersion = modelosVersiones[0];
        xauto.combustible = combustibles[0];
        xauto.transmision = transmisiones[0];
        xauto.valoraciones = valoraciones;
        xauto.autosMeGustas = megustas;
        xauto.estatus = estatus[0];
  
      }
  
  
  
       return autos;
    } catch (error) {
      throw error;
    }
}

const obtenerMarcas = async() =>{
  try {
    let marcas = await prisma.marcas.findMany({
      orderBy:{
        marcaNombre:"asc"
      }
    });
    return marcas;
  } catch (error) {
    throw error;
  }
}


const crearPlanillaDeComprobanteDePago = (reserva:any, monto: number) =>{
  let tarjetaNumero = reserva.tarjeta.tarjetaNumero;
  let ultimosCuatroNumeros = tarjetaNumero.substring(tarjetaNumero.length-4);
   let html = fs.readFileSync(join(__dirname,'planillas','voucher.pay.html')).toString('utf-8')
   html = html.replaceAll('{{cliente}}','Cliente:');
   html = html.replaceAll('{{clienteNombre}}',reserva.cliente.clienteNombre);
   html = html.replaceAll('{{monto}}',`$${monto.toFixed(2)}`);
   html = html.replaceAll('{{marca}}','Marca');
   html = html.replaceAll('{{modelo}}','Modelo');
   html = html.replaceAll('{{anoTag}}','Año');
   html = html.replaceAll('{{marcaNombre}}',reserva.auto.marca.marcaNombre);
   html = html.replaceAll('{{modeloNombre}}',reserva.auto.modelo.modeloNombre);
   html = html.replaceAll('{{ano}}',reserva.auto.autoAno);
   html = html.replaceAll('{{mensaje}}','¡Gracias por su pago!');
   html = html.replaceAll('{{mensajeTarjeta}}',`Tarjeta finalizada en ${ultimosCuatroNumeros}`);
   
   return html;
}
  export {
    convertBase64ToJpegAndReturnBase64,
    obtenerEtiqueta,
    sendEmail,
    removerBase64Data,
    crearPlanillaDetalleReserva,
    agregarMarcaAgua,
    obtenerMasPotentes,
    obtenerRecomendado,
    obtenerMarcas,
    crearPlanillaDeComprobanteDePago,
    crearPlanillaDetalleAuto
  }