
import { Router } from 'express'
import { prisma } from '../app';
import fs from 'fs';
import https from 'https'
import moment from 'moment';
import { join } from 'path';
import { crearPlanillaDetalleReserva, obtenerEtiqueta, removerBase64Data, sendEmail } from '../functions';
import { checkSvgBase64 } from '../data';
import { Decimal } from '../../prisma/client/runtime/library';


// Declarar variables 
const Auth1 = "AZUL";
const Auth2 = " AZUL ";
const MainUrl = "pruebas";
const PathCert = " cert.pem";
const PathKey = " Key.pem";
const TimeOut = "40000";
const Store = "3900000000";
const Channel = "EC";
const LogsPath = "\Logs\"";



const router = Router()



const crearPlanillaDeComprobanteDePago = (reserva:any, monto: number) =>{
  let tarjetaNumero = reserva.tarjeta.tarjetaNumero;
  let ultimosCuatroNumeros = tarjetaNumero.substring(tarjetaNumero.length-4);
   let html = fs.readFileSync(join(__dirname,'../','planillas','voucher.pay.html')).toString('utf-8')
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

// Parametros para manejar redirección y las credenciales 
const getOptions = (path: string) => {
  let options = {
    hostname: MainUrl + ' . azul. com.do',
    port: 443,
    path: path,
    method: 'POST',
    timeout: parseInt(TimeOut),
    headers: { 'Content-Type': 'application/json', "Auth1": Auth1, "Auth2": Auth2 },
    json: true,
    key: fs.readFileSync(PathKey),
    cert: fs.readFileSync(PathCert)
  }

  return options;
}

const sendTrx = (jsonData: any, method: string, path: string) => {
  return new Promise((resp, reject) => {
    let req = https.request(getOptions(path), (res) => {
      res.on('data', (data) => {
        let response = JSON.parse(data)
        resp(response)
        logManager(response, method, 'MainUrl', jsonData.OrderNumber, jsonData.CustomOrderId, false);

        req.end();
      });
    });
    req.on('error', (e) => {
      logManager(e, method, 'MainUrl', jsonData.OrderNumber, jsonData.CustomOrderId, true);
      reject(e);
    });
    req.write(JSON.stringify(jsonData));
    req.end();
  });
}

// Generar archivo de log 
const logManager = (resp: any, method: string, url: string, OrderNumber: any, CustomOrderId: any, error: boolean) => {
  if (resp.ResponseCode != "Error" && !error) {
    fs.appendFile(
      `${LogsPath}\ ${method} ${new Date().getDate()} .txt`, ` ${url} | ${new Date()} | ${JSON.stringify(resp)} 
`, (error) => { console.log('Error: ' + error) }
    );
  } else if (!error) {
    fs.appendFile(
      ` ${LogsPath}\ ${method}Validation ${new Date().getDate()} .txt`, ` ${JSON.stringify(resp)} 
`, (error) => { console.log('Error: ' + error) }
    );
  }
}

router.get('/todos',async(req,res)=>{
   try{
    let pagos = await prisma.pagos.findMany({
      include: {
        reserva: {
           include: {
            cliente: true,
            beneficiario: true,
            tarjeta: {
              select: {
                tarjetaNombre: true,
                tarjetaNumero: true
              }
            }
           }
        }
      }
    });
    res.json(pagos)
   }catch(error){
    res.status(501).json({
      error
    })
   }
})

router.post('/probar-pago',async(req,res) =>{
  const {tarjetaId, reservaPagado, reservaImpuestos} = req.body;

     try{
     let tarjeta = await prisma.tarjetas.findFirst({
      where:{
        tarjetaId:Number(tarjetaId)
      }
     });
     console.log(tarjeta)

      const  sale  = { 
        "Channel"  : Channel, 
        "Store"  : Store, 
        "CardNumber"  : tarjeta?.tarjetaNumero, 
        "Expiration" :  moment.utc(tarjeta?.tarjetaVencimiento.toUTCString()).format('YYYYMM'), 
        "CVC" :  tarjeta?.tarjetaCcv, 
        "PosInputMode" :  "E-Commerce" , 
        "Amount" :  reservaPagado.toString(), 
        "Itbis" :  reservaImpuestos.toString(), 
        "CurrencyPosCode" :  "$" , 
        "Payments" : 1, 
        "Plan" : 0, 
        "AcquirerRefData" : 1, 
        "OrderNumber" :  "123456" , 
        "CustomOrderId" :  "1231jrg" , 
        "ForceNo3DS" : 1 
    } 

    console.log(sale);


      // await sendTrx(sale,'Sale','/webservices/JSON/ Default.aspx');

       res.json({
        ...sale,
        message:"Reserva Pagada!"
       })
     }catch(error){
      console.log(error)
        res.status(501).json({error})
     }
})


router.post('/agregar-pago',async(req,res) =>{
  const {reservaId, reservaPagado,reservaImpuestos} = req.body;
     try{

      console.log(reservaPagado);

    
      // await sendTrx(sale,'Sale','/webservices/JSON/ Default.aspx');

      let xreserva = await prisma.reservas.findFirst({
        where: {
         reservaId:Number(reservaId)
        },
        include: {
          tarjeta: true,
          cliente: true,
          beneficiario: true,
          auto:{
            include:{
              marca: true,
              modelo: true
            }
          }
        }
       
     });

     if(!xreserva){
      res.status(404).json({
        error:"No existe la reserva"
      })
     }
   
      let reserva = await prisma.reservas.update({
         where: {
          reservaId:Number(reservaId)
         },
         data: {
            reservaPagado: Number(xreserva?.reservaPagado) + reservaPagado
         },
         include:{
        
          tarjeta: true,
          cliente: true,
          beneficiario: true,
          auto:{
            include:{
              marca: true,
              modelo: true,
              imagenes: true,
            }
          }
         }
      });

      let pago = await prisma.pagos.create({
        data: {
          reservaId: reserva.reservaId,
          monto: reservaPagado
        }
      });

 
   let html  = crearPlanillaDeComprobanteDePago(reserva, reservaPagado);

   
   let tag = obtenerEtiqueta(reserva);

   let attachments = [
       {
              filename: 'checkSvgBase64.png',
              content: checkSvgBase64,
              cid: 'checkSvgBase64',
              encoding: 'base64'
            }
   ];

   let html2 = crearPlanillaDetalleReserva(reserva);

   let base64Data = removerBase64Data(reserva.auto.imagenes[0].imagenBase64);

   let attachments2 = [
    {
      filename: 'imagen.jpeg',
      content: base64Data,
      encoding: 'base64',
      cid: 'imagenReserva'
    }
  ]

   sendEmail({
    subject:`SU PAGO FUE REALIZADO DE LA RESERVA ${tag} - CIDECA`,
    to: reserva.cliente.clienteCorreo ?? '',
    text:'',
    html,
    attachments: [...attachments, ...attachments2]
   });




   if (reserva.beneficiario.beneficiarioCorreo != null) {
     sendEmail({
       to: reserva.beneficiario.beneficiarioCorreo ?? '',
       subject: `SE RECIBIO EL PAGO DE LA RESERVA - ${tag}`,
       text: '',
       html: html2,
       attachments: [...attachments, ...attachments2]
     });
   }


  

       res.json({
        ...reserva,
        pago,
        message:"Reserva Pagada!"
       })
     }catch(error){
      console.log(error)
        res.status(501).json({error})
     }
})

export default router

