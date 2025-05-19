
import { Router } from 'express'
import { prisma } from '../app';

const router = Router()



router.get('/todos', async (req, res) => {
    const {buscar} = req.query;
  try {
    let beneficiarios = await prisma.beneficiarios.findMany({
        where: {
            beneficiarioNombre: {
                contains: buscar as string,
                mode:"insensitive"
            }
        },
    });
  
    res.json(beneficiarios)
  } catch (error) {
    res.status(501).json({
        error
    })
  }
})

router.put('/modificar/:id',async(req,res) => {
  const {id}=req.params;
  const {imagenBase64,beneficiarioCoorX,beneficiarioCoorY,beneficiarioDireccion,bancoId,beneficiarioCuentaTipo,beneficiarioCuentaNo} = req.body;
    try {
    let beneficiario = await prisma.beneficiarios.update({
        where: {
           beneficiarioId:Number(id)
        },
        data: {
      imagenBase64,
      beneficiarioDireccion,
      beneficiarioCoorX,
      beneficiarioCoorY,
      bancoId,
      beneficiarioCuentaTipo,
      beneficiarioCuentaNo
        },
      include: {
        banco: true,
        bancoCuentaTipo: true
      }
    });
  
    res.json(beneficiario)
  } catch (error) {
    console.log(error)
    res.status(501).json({
        error
    })
  }
})





export default router