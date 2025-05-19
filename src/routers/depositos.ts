

import { Router } from 'express'
import { prisma } from '../app';

const router = Router()



router.get('/todos', async (req, res) => {
  try {
    let depositos = await prisma.depositosBeneficiarios.findMany({
        include: {
            beneficiario:{
             include: {
                banco: true,
                bancoCuentaTipo: true
             }
            }
        }
    });


    if(depositos.length == 0){
        res.status(404).json([])
        return;
    }
    res.json(depositos)
  } catch (error) {
    res.status(501).json(error)
  }
})

router.post('/crear', async (req, res) => {
  const { beneficiarioId, imagenBase64, monto} = req.body;
  try {
    let deposito = await prisma.depositosBeneficiarios.create({
      data: {
        beneficiarioId,
        imagenBase64,
        monto
      }
    });
    res.json(deposito)
  } catch (error) {
    console.log(error)
    res.status(501).json(error)
  }
})


router.put('/modificar/:id', async (req, res) => {
  const { id } = req.params;
  const { beneficiarioId, imagenBase64 , monto} = req.body;
  try {
    let deposito = await prisma.depositosBeneficiarios.update({
      where: {
        depositoId: Number(id)
      },
      data: {
        beneficiarioId,
        imagenBase64,
        monto
      }
    });
    res.json(deposito)
  } catch (error) {
    res.status(501).json(error)
  }
})


export default router