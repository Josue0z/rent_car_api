
import { Router } from 'express'
import { prisma } from '../app';
import { join } from 'path'
import fs from 'fs'
import { crearPlanillaDetalleReserva, obtenerEtiqueta, removerBase64Data, sendEmail } from '../functions';
import moment from 'moment'
import { Money, Currencies } from 'ts-money'
import { error } from 'console';

const generarICS = (reserva: any) => {
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TuAplicacion//Reservas//EN
BEGIN:VEVENT
UID:${reserva.reservaNumero}@app.cideca.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '')}Z
DTSTART:${new Date(reserva.reservaFhInicial).toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${new Date(reserva.reservaFhFinal).toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:Reserva ${obtenerEtiqueta(reserva)}
DESCRIPTION:Reserva realizada por ${reserva.cliente.clienteNombre} para el vehículo ${reserva.auto.marca.marcaNombre} ${reserva.auto.modelo.modeloNombre} ${reserva.auto.autoAno}
LOCATION:${reserva.reservaRecogidaDireccion}
STATUS:CONFIRMED
ORGANIZER;CN=${reserva.beneficiario.beneficiarioNombre}
END:VEVENT
END:VCALENDAR`;
};







const router = Router()

router.get('/historicoCliente', async (req, res) => {
  const { clienteId, pagina, cantidad } = req.query;
  const PAGINA = Number(pagina ?? '1') - 1;
  const CANTIDAD = Number(cantidad ?? '10');
  try {
    let reservas = await prisma.reservas.findMany({
      where: {
        clienteId: Number(clienteId)
      },
      skip: PAGINA * CANTIDAD,
      take: CANTIDAD,

      include: {
        estatus: true,
        cliente: {
          select: {
            clienteId: true,
            clienteNombre: true,
            clienteIdentificacion: true,
            clienteCorreo: true,
            clientedirId: true,
            clienteTelefono1: true,
            clienteTelefono2: true,
            direccion: {
              select: {
                clientedirId: true,
                clientedirNombre: true,
                alias: true,
                clientedirX: true,
                clientedirY: true,
                clientedirFecha: true,

              }
            }
          }
        },
        beneficiario: {
          include: {
            banco: true,
            bancoCuentaTipo: true
          }
        },
        auto: {
          include: {
            tipo: true,
            marca: true,
            modelo: true,
            color: true,
            provincia: true,
            ciudad: true,
            modeloVersion: true,
            combustible: true,
            transmision: true,
            imagenes: {
              select: {
                imagenId: true,
                imagenArchivo: true,
                imagenEstatus: true
              },
              where: {
                imagenEstatus: 2
              }
            },
            valoraciones: {
              include: {
                usuario: {
                  select: {
                    usuarioLogin: true,
                    usuarioPerfil: true,
                    tipoUsuario: true,
                    cliente: {
                      select: {
                        clienteId: true,
                        clienteNombre: true,
                        clienteIdentificacion: true,
                        clienteCorreo: true,
                        clientedirId: true,
                        clienteTelefono1: true,
                        clienteTelefono2: true,
                        direccion: {
                          select: {
                            clientedirId: true,
                            clientedirNombre: true,
                            alias: true,
                            clientedirX: true,
                            clientedirY: true,
                            clientedirFecha: true,

                          }
                        }
                      }
                    }
                  },

                }
              }
            },
          }
        },
        tarjeta: {
          select: {
            tarjetaId: true,
            tarjetaNombre: true,
            tarjetaNumero: true,
            tarjetaVencimiento: true,
            clienteId: true
          }
        }
      }
    });

    // Formatear la respuesta con el campo personalizado
    reservas = reservas.map(reserva => {
      const fechaCreacion = new Date(reserva.reservaCreado);
      const fechaFormateada = `${fechaCreacion.getFullYear()}${(fechaCreacion.getMonth() + 1).toString().padStart(2, '0')}${fechaCreacion.getDate().toString().padStart(2, '0')}`;
      return {
        ...reserva,
        reservaNumeroEtiqueta: `CDC-${fechaFormateada}-${reserva?.reservaNumero?.toString().padStart(3, '0')}`
      };
    });

    if(reservas.length == 0){
      res.status(404).json([])
      return;
    }

    res.json(reservas);
  } catch (error) {
    res.status(501).json({ error });
  }
});

router.get('/historicoBeneficiario', async (req, res) => {
    const { beneficiarioId, pagina, cantidad,fechaInicial, fechaFinal } = req.query;
  const PAGINA = Number(pagina ?? '1') - 1;
  const CANTIDAD = Number(cantidad ?? '10');
  try {
    let reservas = await prisma.reservas.findMany({
      where: {
        beneficiarioId: Number(beneficiarioId),
            AND: [
          {
            reservaCreado: {
              gte: new Date(fechaInicial as string)
            }
          },
          {
            reservaCreado: {
              lte: new Date(fechaFinal as string)
            }
          },

  
        ],
      },
      skip: PAGINA * CANTIDAD,
      take: CANTIDAD,
      

      include: {
        estatus: true,
        cliente: {
          select: {
            clienteId: true,
            clienteNombre: true,
            clienteIdentificacion: true,
            clienteCorreo: true,
            clientedirId: true,
            clienteTelefono1: true,
            clienteTelefono2: true,
            direccion: {
              select: {
                clientedirId: true,
                clientedirNombre: true,
                alias: true,
                clientedirX: true,
                clientedirY: true,
                clientedirFecha: true,

              }
            }
          }
        },
        beneficiario: {
          include: {
            banco: true,
            bancoCuentaTipo: true
          }
        },
        auto: {
          include: {
            tipo: true,
            marca: true,
            modelo: true,
            color: true,
            provincia: true,
            ciudad: true,
            modeloVersion: true,
            combustible: true,
            transmision: true,
            imagenes: {
              select: {
                imagenId: true,
                imagenArchivo: true,
                imagenEstatus: true
              },
              where: {
                imagenEstatus: 2
              }
            },
            valoraciones: {
              include: {
                usuario: {
                  select: {
                    usuarioLogin: true,
                    usuarioPerfil: true,
                    tipoUsuario: true,
                    cliente: {
                      select: {
                        clienteId: true,
                        clienteNombre: true,
                        clienteIdentificacion: true,
                        clienteCorreo: true,
                        clientedirId: true,
                        clienteTelefono1: true,
                        clienteTelefono2: true,
                        direccion: {
                          select: {
                            clientedirId: true,
                            clientedirNombre: true,
                            alias: true,
                            clientedirX: true,
                            clientedirY: true,
                            clientedirFecha: true,

                          }
                        }
                      }
                    }
                  },

                }
              }
            },
          }
        },
        tarjeta: {
          select: {
            tarjetaId: true,
            tarjetaNombre: true,
            tarjetaNumero: true,
            tarjetaVencimiento: true,
            clienteId: true
          }
        }
      }
    });

    // Formatear la respuesta con el campo personalizado
    reservas = reservas.map(reserva => {
      const fechaCreacion = new Date(reserva.reservaCreado);
      const fechaFormateada = `${fechaCreacion.getFullYear()}${(fechaCreacion.getMonth() + 1).toString().padStart(2, '0')}${fechaCreacion.getDate().toString().padStart(2, '0')}`;
      return {
        ...reserva,
        reservaNumeroEtiqueta: `CDC-${fechaFormateada}-${reserva?.reservaNumero?.toString().padStart(3, '0')}`
      };
    });

    if(reservas.length == 0){
      res.status(404).json([])
      return;
    }

    res.json(reservas);
  } catch (error) {
    console.log(error)
    res.status(501).json({ error });
  }
})

router.post('/crear', async (req, res) => {
  const { tarjetaNumero, clienteId, beneficiarioId, reservaFhInicial, reservaFhFinal, reservaRecogidaX, reservaRecogidaY, reservaRecogidaDireccion, reservaEntregaX, reservaEntregaY, reservaEntregaDireccion, reservaMontoxDias, reservaMonto, reservaAbono, reservaNotaCliente, reservaNotaBeneficiario, reservaMontoTotal, reservaPagado, reservaImpuestos, reservaDescuento, autoId, tarjetaId } = req.body;
  try {
    let codigoVerificacionEntrega = (100000 + Math.random() * 900000);
    let xreserva = await prisma.reservas.findFirst({
      where: {
        AND
          : [
            { reservaFhInicial: { lt: new Date(reservaFhFinal) } },
            { reservaFhFinal: { gt: new Date(reservaFhInicial) } }
          ]
      }
    });

    if (xreserva) {
      res.status(409).json({
        error: `Existe una reserva para las fechas ${reservaFhInicial} - ${reservaFhFinal}`
      })
      return;
    }
    let reserva = await prisma.reservas.create({

      data: {
        clienteId,
        beneficiarioId,
        reservaFhInicial: new Date(reservaFhInicial),
        reservaFhFinal: new Date(reservaFhFinal),
        reservaRecogidaX,
        reservaRecogidaY,
        reservaRecogidaDireccion,
        reservaEntregaX,
        reservaEntregaY,
        reservaEntregaDireccion,
        reservaMontoxDias,
        reservaMonto,
        reservaAbono,
        reservaNotaCliente,
        reservaNotaBeneficiario,
        reservaMontoTotal,
        reservaPagado,
        reservaImpuestos,
        reservaDescuento,
        autoId,
        tarjetaId,
        reservaEstatus: 1,
        codigoVerificacionEntrega,
        tarjetaNumero
      },
      include: {
        auto: {
          include: {
            marca: true,
            modelo: true,
            tipo: true,
            valoraciones: true,
            ciudad: true,
            provincia: true,
            pais: true,
            color: true,
            transmision: true,
            estatus: true,
            imagenes: {
              select: {
                imagenId: true,
                imagenArchivo: true,
                imagenEstatus: true,
                imagenBase64: true,

              },
              where: {
                imagenEstatus: 2
              }
            }
          }
        },
        tarjeta: true,
        cliente: true,
        beneficiario: true,
        estatus: true
      }
    });


    let reservaNumeroEtiqueta = obtenerEtiqueta(reserva);

    let html = crearPlanillaDetalleReserva(reserva);

    let base64Data = removerBase64Data(reserva.auto.imagenes[0].imagenBase64);

    let attachments = [
      {
        filename: 'imagen.jpeg',
        content: base64Data,
        encoding: 'base64',
        cid: 'imagenReserva'
      }
    ]

    if (reserva.cliente.clienteCorreo != null) {
      sendEmail({
        to: reserva.cliente.clienteCorreo,
        subject: `HICISTE TU RESERVACION - ${reservaNumeroEtiqueta}`,
        text: '',
        html,
        attachments
      });
    }

    if (reserva.beneficiario.beneficiarioCorreo != null) {
      sendEmail({
        to: reserva.beneficiario.beneficiarioCorreo,
        subject: `HAZ RECIBIDO UNA RESERVACION - ${reservaNumeroEtiqueta}`,
        text: '',
        html,
        attachments
      });
    }

    res.json(reserva)
  } catch (error) {
    console.log(error)
    res.status(501).json({ error })
  }
})


router.put('/aceptar/:id', async (req, res) => {
  const { id } = req.params;
  try {

    let r = await prisma.reservas.findFirst({
      where: {
        reservaId:Number(id)
      }
    });

    if(r?.reservaEstatus == 3){
      res.status(409).json({
        error:"no se puede aceptar una reserva ya cerrada"
      })
      return;

    }

      if(r?.reservaEstatus == 4){
      res.status(409).json({
        error:"no se puede aceptar una reserva ya cencelada"
      })
      return;

    }

      if(r?.reservaEstatus == 5){
      res.status(409).json({
        error:"no se puede aceptar una reserva ya en ejecucion"
      })
      return;

    }
    let reserva = await prisma.reservas.update({
      where: {
        reservaId: Number(id)
      },
      data: {
        reservaEstatus: 2
      },
      include: {
        auto: {

          include: {
            marca: true,
            modelo: true,
            transmision: true,
            imagenes: true
          }
        },
        tarjeta: true,
        cliente: true,
        beneficiario: true,
        estatus: true
      }
    });



    let html = crearPlanillaDetalleReserva(reserva);

    let reservaNumeroEtiqueta = obtenerEtiqueta(reserva);
    let base64Data = removerBase64Data(reserva.auto.imagenes[0].imagenBase64);
    let attachments = [
      {
        filename: 'imagen.jpeg',
        content: base64Data,
        encoding: 'base64',
        cid: 'imagenReserva'
      },
      {
        filename: 'reserva.ics',
        content: generarICS(reserva)
      }
    ]

    await prisma.autos.update({
      where: {
        autoId: reserva.autoId,
      },
      data: {
        autoEstatus: 2
      },
    });
    sendEmail({
      to: reserva.cliente.clienteCorreo ?? '',
      subject: `SE ACEPTO TU RESERVACION - ${reservaNumeroEtiqueta} - CIDECA`,
      text: '',
      html,
      attachments
    })
    sendEmail({
      to: reserva.beneficiario.beneficiarioCorreo ?? '',
      subject: `ACEPTASTE LA RESERVACION - ${reservaNumeroEtiqueta} - CIDECA`,
      text: '',
      html,
      attachments
    })
    res.json(reserva)
  } catch (error) {
    res.status(501).json({ error })
  }
})

router.put('/cancelar/:id', async (req, res) => {
  const { id } = req.params;
  try {
    let r = await prisma.reservas.findFirst({
      where:{
        reservaId:Number(id)
      }
    });

    if(!r){
      res.status(404).json({error:"No existe la reserva"})
      return;
    }
    if(r?.reservaEstatus == 4){
      res.status(409).json({error:"La reserva ya esta cancelada"})
      return;
    }



  
    let reserva = await prisma.reservas.update({
      where: {
        reservaId: Number(id)
      },
      data: {
        reservaEstatus: 4,
        reservaPagado:0,
        reservaImpuestos:0,
        reservaMonto:0,
        reservaMontoTotal:0,
        reservaDescuento:0,
        reservaMontoxDias:0,
        reservaAbono: 0
      },
      include: {
        auto: {

          include: {
            marca: true,
            modelo: true,
            transmision: true,
            imagenes: true
          }
        },
        tarjeta: true,
        cliente: true,
        beneficiario: true,
        estatus: true
      }
    });

    let pago  = await prisma.pagos.findFirst({
      where: {
        reservaId:reserva.reservaId
      }
    });

    await prisma.pagos.delete({
      where: {
        pagoId: pago?.pagoId
      }
    })



    let html = crearPlanillaDetalleReserva(reserva);

    let reservaNumeroEtiqueta = obtenerEtiqueta(reserva);
    let base64Data = removerBase64Data(reserva.auto.imagenes[0].imagenBase64);
    let attachments = [
      {
        filename: 'imagen.jpeg',
        content: base64Data,
        encoding: 'base64',
        cid: 'imagenReserva'
      },
      {
        filename: 'reserva.ics',
        content: generarICS(reserva)
      }
    ]

    await prisma.autos.update({
      where: {
        autoId: reserva.autoId,
      },
      data: {
        autoEstatus: 1
      },
    });
    sendEmail({
      to: reserva.cliente.clienteCorreo ?? '',
      subject: `SE CANCELO TU RESERVACION - ${reservaNumeroEtiqueta} - CIDECA`,
      text: '',
      html,
      attachments
    })
    sendEmail({
      to: reserva.beneficiario.beneficiarioCorreo ?? '',
      subject: `SE CANCELO LA RESERVACION - ${reservaNumeroEtiqueta} - CIDECA`,
      text: '',
      html,
      attachments
    })
    res.json(reserva)
  } catch (error) {
    res.status(501).json({ error })
  }
})


router.put('/cerrar/:id', async (req, res) => {
  const { id } = req.params;
  try {
    let r = await prisma.reservas.findFirst({
      where:{
        reservaId:Number(id)
      }
    });

    if(!r){
      res.status(404).json({error:"No existe la reserva"})
      return;
    }
    if(r?.reservaEstatus == 3){
      res.status(409).json({error:"La reserva ya esta cerrada"})
      return;
    }

  
    let reserva = await prisma.reservas.update({
      where: {
        reservaId: Number(id)
      },
      data: {
        reservaEstatus: 3
      },
      include: {
        auto: {

          include: {
            marca: true,
            modelo: true,
            transmision: true,
            imagenes: true
          }
        },
        tarjeta: true,
        cliente: true,
        beneficiario: true,
        estatus: true
      }
    });



    let html = crearPlanillaDetalleReserva(reserva);

    let reservaNumeroEtiqueta = obtenerEtiqueta(reserva);
    let base64Data = removerBase64Data(reserva.auto.imagenes[0].imagenBase64);
    let attachments = [
      {
        filename: 'imagen.jpeg',
        content: base64Data,
        encoding: 'base64',
        cid: 'imagenReserva'
      },
      {
        filename: 'reserva.ics',
        content: generarICS(reserva)
      }
    ]

    await prisma.autos.update({
      where: {
        autoId: reserva.autoId,
      },
      data: {
        autoEstatus: 1
      },
    });
    sendEmail({
      to: reserva.cliente.clienteCorreo ?? '',
      subject: `SE FINALIZO TU RESERVACION - ${reservaNumeroEtiqueta} - CIDECA`,
      text: '',
      html,
      attachments
    })
    sendEmail({
      to: reserva.beneficiario.beneficiarioCorreo ?? '',
      subject: `SE FINALIZO LA RESERVACION - ${reservaNumeroEtiqueta} - CIDECA`,
      text: '',
      html,
      attachments
    })
    res.json(reserva)
  } catch (error) {
    res.status(501).json({ error })
  }
})

router.put('/verificar-codigo-entrega/:id',async(req,res) =>{
  const {id} = req.params;
  const {codigoVerificacionEntrega} = req.body;
   try{
      let r = await prisma.reservas.findFirst({
      where:{
        reservaId:Number(id)
      }
    });
    if(r?.codigoVerificacionEntrega == codigoVerificacionEntrega){
         await prisma.reservas.update({
          where: {
            reservaId:Number(id)
          },
          data: {
            entregaVerificada: true
          }
         });
         res.json(r)
    }else{
      res.status(409).json({error:"no se pudo verificar la entrega"})
    }
   }catch(error){
    res.status(501).json({error})
   }
})

router.put('/entregar/:id', async (req, res) => {
  const { id } = req.params;

  try {
    let r = await prisma.reservas.findFirst({
      where:{
        reservaId:Number(id)
      }
    });

    if(!r){
      res.status(404).json({error:"no existe la reserva"})
      return;
    }
  
    let reserva = await prisma.reservas.update({
      where: {
        reservaId: Number(id)
      },
      data: {
        reservaEstatus: 5
      },
      include: {
        auto: {
          include: {
            marca: true,
            modelo: true,
            transmision: true,
            imagenes: true,
          }
        },
        tarjeta: {
          select: {
            tarjetaNombre: true,
            tarjetaNumero: true
          }
        },
        cliente: true,
        beneficiario: {
          include: {
            banco: true,
            bancoCuentaTipo: true
          }
        },
        estatus: true
      }
    });

    await prisma.autos.update({
      where: {
        autoId: reserva.autoId,
      },
      data: {
        autoEstatus: 2
      },
    });


    res.json(reserva)
  } catch (error) {
    res.status(501).json({ error })
  }
})

router.put('/devolver/:id', async (req, res) => {
  const { id } = req.params;

  try {
    let r = await prisma.reservas.findFirst({
      where:{
        reservaId:Number(id)
      }
    });

    if(!r){
      res.status(404).json({error:"no existe la reserva"})
      return;
    }
  
    let reserva = await prisma.reservas.update({
      where: {
        reservaId: Number(id)
      },
      data: {
        reservaEstatus: 3
      },
      include: {
        auto: {
          include: {
            marca: true,
            modelo: true,
            transmision: true,
            imagenes: true,
          }
        },
        tarjeta: {
          select: {
            tarjetaNombre: true,
            tarjetaNumero: true
          }
        },
        cliente: true,
        beneficiario: {
          include: {
            banco: true,
            bancoCuentaTipo: true
          }
        },
        estatus: true
      }
    });

    await prisma.autos.update({
      where: {
        autoId: reserva.autoId,
      },
      data: {
        autoEstatus: 1
      },
    });


    res.json(reserva)
  } catch (error) {
    res.status(501).json({ error })
  }
})

router.get('/obtener-fechas', async (req, res) => {
  const { clienteId } = req.query;
  try {
    let reservas = await prisma.reservas.findMany({
      select: {
        reservaFhInicial: true,
        reservaFhFinal: true
      },
      where: {
        clienteId: Number(clienteId),
        OR: [
          {
            reservaEstatus: 1
          },
          {
            reservaEstatus: 2
          }
        ],

      }
    });
    res.json(reservas)
  } catch (error) {
    res.status(501).json({
      error
    })
  }
})

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {

    let reserva = await prisma.reservas.findFirst({
      where: {
        reservaId: Number(id)
      },
      include: {
        auto: {
          include: {
            marca: true,
            modelo: true,
            tipo: true,
            valoraciones: true,
            ciudad: true,
            provincia: true,
            pais: true,
            color: true,
            modeloVersion: true,
            combustible: true,
            transmision: true,
            estatus: true,

            imagenes: {
              select: {
                imagenId: true,
                imagenArchivo: true,
                imagenEstatus: true,
                imagenBase64: true,

              },

              where: {
                imagenEstatus: 2
              }
            }
          }
        },
        tarjeta: true,
        cliente: true,
        beneficiario: true,

        estatus: true
      }
    });



    if (!reserva) {
      res.status(404).json({
        error: 'No existe la reserva'
      })
      return;
    }

    res.json({ ...reserva, reservaNumeroEtiqueta: obtenerEtiqueta(reserva) })
  } catch (error) {
    console.log(error)
    res.status(501).json({ error })
  }
})
export default router;