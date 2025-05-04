
import { Router } from 'express'
import { prisma } from '../app';

const router = Router()



router.get('/todos', async (req, res) => {
  try {
    let colores = await prisma.colores.findMany({});
    res.json(colores)
  } catch (error) {
    res.status(501).json({ error })
  }
})

router.post('/crear', async (req, res) => {
  const { colorNombre, colorHexadecimal } = req.body;
  try {
    let color = await prisma.colores.create({
      data:
      {
        colorNombre,
        colorHexadecimal
      }
    });
    res.json(color)
  } catch (error) {
    res.status(501).json({ error })
  }
})

router.put('/modificar/:id', async (req, res) => {
  const { id } = req.params;
  const { colorNombre, colorHexadecimal } = req.body;
  try {
    let color = await prisma.colores.update({
      where: {
        colorId: Number(id)
      },
      data:
      {
        colorNombre,
        colorHexadecimal
      }
    });
    res.json(color)
  } catch (error) {
    res.status(501).json({ error })
  }
})



export default router