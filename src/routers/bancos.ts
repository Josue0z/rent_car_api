
import { Router } from 'express'
import { prisma } from '../app';

const router = Router()



router.get('/todos', async (req, res) => {
  try {
    let bancos = await prisma.bancos.findMany({
    });

    if(bancos.length == 0){
      res.status(404).json([])
      return;
    }
    res.json(bancos)
  } catch (error) {
    res.status(501).json(error)
  }
})

router.post('/crear', async (req, res) => {
  const { bancoNombre, bancoNota, } = req.body;
  try {
    let banco = await prisma.bancos.create({
      data: {
        bancoNombre,
        bancoNota
      }
    });
    res.json(banco)
  } catch (error) {
    res.status(501).json(error)
  }
})


router.put('/modificar/:id', async (req, res) => {
  const { id } = req.params;
  const { bancoNombre, bancoNota } = req.body;
  try {
    let banco = await prisma.bancos.update({
      where: {
        bancoId: Number(id)
      },
      data: {
        bancoNombre,
        bancoNota
      }
    });
    res.json(banco)
  } catch (error) {
    res.status(501).json(error)
  }
})


export default router