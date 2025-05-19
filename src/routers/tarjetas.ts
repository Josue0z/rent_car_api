
import {Router} from 'express'
import { prisma } from '../app';
import { error } from 'console';


const router = Router()

router.get('/todos', async (req, res) => {
  const {clienteId} =req.query;
    try {
      let tarjetas = await prisma.tarjetas.findMany({
        where:{
          clienteId:Number(clienteId)
        },
        orderBy:{
          tarjetaId:'desc'
        },
        select: {
          tarjetaId: true,
          tarjetaNombre: true,
          tarjetaNumero: true,
          tarjetaVencimiento: true
        }
      });
      if(tarjetas.length == 0){
        res.status(404).json([])
        return;
      }
      res.json(tarjetas)
    } catch (error) {
      res.status(501).json({ error })
    }
  })
  
  router.post('/crear', async (req, res) => {
    const { clienteId, tarjetaNombre, tarjetaNumero, tarjetaCcv, tarjetaVencimiento } = req.body;
    try {


      let tarjeta = await prisma.tarjetas.create({
        data: {
          clienteId,
          tarjetaNombre,
          tarjetaNumero,
          tarjetaCcv,
          tarjetaVencimiento: new Date(tarjetaVencimiento)
        },
        select: {
          tarjetaId: true,
          tarjetaNombre: true,
          tarjetaNumero: true,
          tarjetaVencimiento: true
        }
      });
      res.json(tarjeta)
    } catch (error) {
      console.log(error)
      res.status(501).json({ error })
    }
  })

  

  router.delete('/eliminar/:id', async (req, res) => {
    const {id} = req.params;
    try {

      let reservas = await prisma.reservas.findMany({
        where: {
          tarjetaId:Number(id),
          reservaEstatus: {
            in:[1,2]
          }
        }
      });

      if(reservas.length > 0){
        res.status(409).json({
          error:"no se puede eliminar la tarjeta por que tiene reservas pendientes de pago"
        })
        return;
      }
      let tarjeta = await prisma.tarjetas.delete({
        where:{
          tarjetaId:Number(id)
        },
     
        select: {
          tarjetaId: true,
          tarjetaNombre: true,
          tarjetaNumero: true,
          tarjetaVencimiento: true
        }
      });
      res.json(tarjeta)
    } catch (error) {
      console.log(error)
      res.status(501).json({ error })
    }
  })

export default router