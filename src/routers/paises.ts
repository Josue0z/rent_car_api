
import { Router } from 'express'
import { prisma } from '../app';

const router = Router()



router.get('/todos', async (req, res) => {
  try {
    let paises = await prisma.paises.findMany({});
    res.json(paises)
  } catch (error) {
    res.status(501).json({ error })
  }
})


router.post('/crear', async (req, res) => {
  const { paisNombre, paisId } = req.body;
  try {
    let pais = await prisma.paises.create({
      data:
      {
        paisNombre,
        paisId
      }
    });
    res.json(pais)
  } catch (error) {
    res.status(501).json({ error })
  }
})

router.put('/modificar/:id', async (req, res) => {
  const { id } = req.params;
  const { paisNombre, paisId } = req.body;
  try {
    let pais = await prisma.paises.update({
      where: {
        paisId: Number(id)
      },
      data:
      {
        paisNombre,
        paisId
      }
    });
    res.json(pais)
  } catch (error) {
    res.status(501).json({ error })
  }
})


export default router