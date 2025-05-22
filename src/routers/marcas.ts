
import { Router } from 'express'
import { prisma } from '../app';

const router = Router()


router.get('/todos', async (req, res) => {
  try {
    const {display} = req.query;
    const keys = (display as string).split(',');

      let params:any = {};
    if(keys.length > 0){
    

    for(let i = 0;i< keys.length;i++){
      params[keys[i]] = true;
    }
    
    }
    else{
      params['marcaId'] = true;
      params['marcaNombre'] = true;
      params['marcaLogo'] = true;
    }
    let marcas = await prisma.marcas.findMany({
      select:{
        ...params
      },
      orderBy:{
        marcaNombre:"asc"
      }
    });

    if(marcas.length == 0){
      res.status(404).json([])
      return;
    }
    res.json(marcas)
  } catch (error) {
    console.log(error)
    res.status(501).json({ error })
  }
})


router.post('/crear', async (req, res) => {
  const { marcaNombre, marcaLogo } = req.body;
  try {
    let marca = await prisma.marcas.create({
      data:
      {
        marcaNombre,
        marcaLogo
      }
    });
    res.json(marca)
  } catch (error) {
    res.status(501).json({ error })
  }
})

router.put('/modificar/:id', async (req, res) => {
  const { id } = req.params;
  const { marcaNombre, marcaLogo } = req.body;
  try {
    let marca = await prisma.marcas.update({
      where: {
        marcaId: Number(id)
      },
      data:
      {
        marcaNombre,
        marcaLogo
      }
    });
    res.json(marca)
  } catch (error) {
    console.log(error)
    res.status(501).json({ error })
  }
})




export default router