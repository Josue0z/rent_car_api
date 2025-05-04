
import { Router } from 'express'
import { prisma } from '../app';


const router = Router()

router.get('/todos', async (req, res) => {
  try {
    let valoraciones = await prisma.valoraciones.findMany({
      include: {
        usuario: {
          select: {
            usuarioLogin: true,
            usuarioPerfil: true,
            tipoUsuario: true,
            cliente: true
          },
       
        }
      }
    });
    res.json(valoraciones)
  } catch (error) {
    console.log(error)
    res.status(501).json(error)
  }
})

router.post('/crear', async (req, res) => {
  const { valorPuntuacion, valorComentario, autoId, usuarioId } = req.body;
  try {
    let valoracion = await prisma.valoraciones.create({
      data: {
        valorPuntuacion,
        valorComentario,
        autoId,
        usuarioId
      },
      include: {
        usuario: {
          select: {
            usuarioLogin: true,
            usuarioPerfil: true,
            tipoUsuario: true,
            cliente: true
          },
        
        }
      }
    });
    res.json(valoracion)
  } catch (error) {
    res.status(501).json(error)
  }
})


router.put('/modificar/:id', async (req, res) => {
  const { id } = req.params;
  const { valorPuntuacion, valorComentario, autoId } = req.body;
  try {
    let valoracion = await prisma.valoraciones.update({
      where: {
        valorId: Number(id)
      },
      include: {
        usuario: true
      },
      data: {
        valorPuntuacion,
        valorComentario,
        autoId
      }
    });
    res.json(valoracion)
  } catch (error) {
    res.status(501).json(error)
  }
})




export default router