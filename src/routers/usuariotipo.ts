
import {Router} from 'express'
import { prisma } from '../app';


const router = Router()


router.get('/todos', async (req, res) => {
  try {
    let tipos = await prisma.usuarioTipo.findMany({});
    res.json(tipos)
  } catch (error) {
    res.status(501).json(error)
  }
})


router.post('/crear', async (req, res) => {
  const { usuarioTipoNombre } = req.body;
  try {
    let tipo = await prisma.usuarioTipo.create({
      data: {
        usuarioTipoNombre,

      }
    });
    res.json(tipo)
  } catch (error) {
    res.status(501).json(error)
  }
})


export default router