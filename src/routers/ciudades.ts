import {Prisma, PrismaClient } from '../../prisma/client'
import {Router} from 'express'

const prisma = new PrismaClient()

const router = Router()


router.get('/todos', async (req, res) => {
  const {provinciaId} = req.query;
  try {
    let ciudades = await prisma.ciudades.findMany({
      where:{
        provinciaId:Number(provinciaId)
      },
      include: {
        provincia: true,
        pais: true
      }
    });
    res.json(ciudades)
  } catch (error) {
    res.status(501).json({ error })
  }
})

router.post('/crear', async (req, res) => {
  const { ciudadNombre, paisId, provinciaId } = req.body;
  try {
    let ciudad = await prisma.ciudades.create({
      data:
      {
        ciudadNombre,
        provinciaId,
        paisId
      }
    });
    res.json(ciudad)
  } catch (error) {
    res.status(501).json({ error })
  }
})

router.put('/modificar/:id', async (req, res) => {
  const { id } = req.params;
  const { ciudadNombre, paisId, provinciaId } = req.body;
  try {
    let ciudad = await prisma.ciudades.update({
      where: {
        ciudadId: Number(id)
      },
      data:
      {
        ciudadNombre,
        provinciaId,
        paisId
      }
    });
    res.json(ciudad)
  } catch (error) {
    res.status(501).json({ error })
  }
})


export default router;