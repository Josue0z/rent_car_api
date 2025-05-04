
import { Router } from 'express'
import { prisma } from '../app';


const router = Router()


router.get('/todos', async (req, res) => {
  const { clienteId } = req.query;
  try {
    let direcciones = await prisma.direcciones.findMany({
      where: {
        clienteId: Number(clienteId)
      },
      orderBy: {
        clientedirId: 'asc'
      },
      include: {
        cliente: true
      }
    });
    res.json(direcciones)
  } catch (error) {
    res.status(501).json(error)
  }
})

router.post('/crear', async (req, res) => {
  const { clientedirNombre, clientedirX, clientedirY, clienteId, imagenBase64, alias } = req.body;
  try {

     let counts = await prisma.direcciones.count({
       where:{
         clienteId
       }
     });



    let dir = await prisma.direcciones.create({
      data: {
        clientedirNombre,
        clientedirX,
        clientedirY,
        clienteId,
        imagenBase64,
        alias
      },
      include: {
        cliente: true
      }
    });

    if (counts == 0) {
       await prisma.clientes.update({
         where: {
           clienteId
         },
         data: {
           clientedirId: dir.clientedirId
         },
 
       });
     }
    res.json({
      ...dir,
      counts
    })
  } catch (error) {
    console.log(error)
    res.status(501).json(error)
  }
})

router.put('/modificar/:id', async (req, res) => {
  const { id } = req.params;
  const { clientedirNombre, clientedirX, clientedirY, imagenBase64, alias } = req.body;
  try {
    let dir = await prisma.direcciones.update({
      where: {
        clientedirId: Number(id)
      },
      data: {
        clientedirNombre,
        clientedirX,
        clientedirY,
        imagenBase64,
        alias
      },
      include: {
        cliente: true
      }
    });
    res.json(dir)
  } catch (error) {
    res.status(501).json(error)
  }
})

router.put('/asignar', async (req, res) => {
  const { clienteId, clientedirId } = req.body;
  try {
    await prisma.clientes.update({
      where: {
        clienteId
      },
      data: {
        clientedirId
      },
    });
    let dir = await prisma.direcciones.findFirst({
      where: {
        clientedirId
      },
      include: {
        cliente: true
      }
    });
    res.json(dir)
  } catch (error) {
    res.status(501).json(error)
  }
})


router.delete('/eliminar/:id', async (req, res) => {
  const { id } = req.params;
  const { clienteId } = req.body;

  try {

    await prisma.$transaction([
      prisma.clientes.update({
        where: {
          clienteId
        },
        data: {
          clientedirId: null
        },
      }),
      prisma.direcciones.delete({
        where: {
          clientedirId: Number(id),
        },
        include: {
          cliente: true
        }
      })
    ]);




    let xdir = await prisma.direcciones.findFirst({
      where: {
        clienteId
      }
    });



    await prisma.clientes.update({
      where: {
        clienteId
      },
      data: {
        clientedirId: xdir?.clientedirId
      },
    });

  
    res.json(xdir)
  } catch (error) {
    console.log(error)
    res.status(501).json(error)
  }
})
export default router