
import { Router } from 'express'
import { prisma } from '../app';


const router = Router()


router.get('/todos', async (req, res) => {
    try {
      let tipos = await prisma.bancoCuentaTipo.findMany({
  
      });
      res.json(tipos)
    } catch (error) {
      res.status(501).json(error)
    }
  })
  
  
  
  router.post('/crear', async (req, res) => {
    const { name } = req.body;
    try {
      let tipo = await prisma.bancoCuentaTipo.create({
        data: {
          name,
  
        }
      });
      res.json(tipo)
    } catch (error) {
      res.status(501).json(error)
    }
  })
  


export default router