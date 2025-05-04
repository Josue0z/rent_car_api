
import { Router } from 'express'
import { prisma } from '../app';


const router = Router()


router.get('/todos', async (req, res) => {
  const { marcaId } = req.query;
  try {
    let modelos = await prisma.modelos.findMany({
      where: {
        marcaId: Number(marcaId ?? '0')
      },
      orderBy:{
        modeloNombre:"asc"
      },
      include: {
        marca: true
      }
    });
    res.json(modelos)
  } catch (error) {
    console.log(error)
    res.status(501).json({ error })
  }
})

router.post('/crear', async (req, res) => {
  const { modeloNombre, marcaId } = req.body;
  try {
    let marca = await prisma.modelos.create({
      data:
      {
        modeloNombre,
        marcaId
      },
      include: {
        marca: true
      }
    });
    res.json(marca)
  } catch (error) {
    res.status(501).json({ error })
  }
})


router.put('/modificar/:id', async (req, res) => {
  const { id } = req.params;
  const { modeloNombre, marcaId } = req.body;
  try {
    let marca = await prisma.modelos.update({
      where: {
        modeloId: Number(id)
      },
      data:
      {
        modeloNombre,
        marcaId
      },
      include: {
        marca: true
      }
    });
    res.json(marca)
  } catch (error) {
    res.status(501).json({ error })
  }
})





export default router