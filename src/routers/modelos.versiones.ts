


import { Router } from 'express'
import { prisma } from '../app';


const router = Router()

router.get('/todos', async (req, res) => {
  const { modeloId } = req.query;
  try {
    let versiones = await prisma.modelosVersiones.findMany({
      where: {
        modeloId: Number(modeloId ?? '0')
      },
      orderBy:{
        versionNombre:"asc"
      },
      include: {
        modelo: true
      }
    });
    res.json(versiones)
  } catch (error) {
    console.log(error)
    res.status(501).json({ error })
  }
})

router.post('/crear', async (req, res) => {
    const { versionNombre, modeloId } = req.body;
    try {
      let version = await prisma.modelosVersiones.create({
        data:
        {
          versionNombre,
          modeloId
        },
        include: {
          modelo: true
        }
      });
      res.json(version)
    } catch (error) {
      res.status(501).json({ error })
    }
  })
  

  router.put('/modificar/:id', async (req, res) => {
    const {id} = req.params;
    const { versionNombre, modeloId } = req.body;
    try {
      let version = await prisma.modelosVersiones.update({
        where:{
            versionId:Number(id)
        },
        data:
        {
          versionNombre,
          modeloId
        },
        include: {
          modelo: true
        }
      });
      res.json(version)
    } catch (error) {
      res.status(501).json({ error })
    }
  })
  


export default router




  