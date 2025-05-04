
import { Router } from 'express'
import { agregarMarcaAgua, convertBase64ToJpegAndReturnBase64 } from '../functions'
import namor from "namor"
import { prisma } from '../app'
import { marcaDeAguaCideca } from '../data'


const router = Router()


router.get('/todos', async (req, res) => {
  try {
    let imagenes = await prisma.imagenes.findMany({

      select: {
        imagenId: true,
        imagenArchivo: true,
        imagenNota: true,
        imagenEstatus: true,
        estatus: true
      }
    });
    res.json(imagenes)
  } catch (error) {
    res.status(501).json({
      error
    })
  }
})

router.get('/obtener/:id', async (req, res) => {
  const { id } = req.params;
  try {


    let imagen = await prisma.imagenes.findFirst({
      where: {
        imagenArchivo: id
      },
    });

    let doc;



    if (!imagen) {
      doc = await prisma.documentos.findFirst({
        where: {
          imagenArchivo: id
        }
      });
    }

    let xbase64 = imagen?.imagenBase64 ?? doc?.imagenBase64;

    res.setHeader('Content-Type', 'image/jpeg');

    let base64 = xbase64?.split('base64,')[1];

    res.send(Buffer.from(base64!, 'base64'))

  } catch (error) {
    res.status(501).json({ error })
  }
})


router.post('/subir-imagen', async (req, res) => {
  const { imagenNota, imagenBase64, autoId } = req.body;
  try {

    let imagenNombre = namor.generate({
      words: 3
    });

    let base64 = await agregarMarcaAgua(imagenBase64, marcaDeAguaCideca);

    let imagen = await prisma.imagenes.create({
      data: {
        autoId,
        imagenNota,
        imagenBase64: await convertBase64ToJpegAndReturnBase64(base64),
        imagenEstatus: 1,
        imagenArchivo: `${imagenNombre}.jpeg`
      },
    });

    await prisma.autos.update({
      where: {
        autoId: Number(autoId)
      },
      data: {
        autoEstatus: 2
      }
    });
    res.json(imagen)
  } catch (error) {
    res.status(501).json({ error })
  }
})

router.put('/modificar-imagen/:id', async (req, res) => {
  const { id } = req.params;
  const { imagenNota, imagenBase64, autoId } = req.body;
  try {



    let base64 = await agregarMarcaAgua(imagenBase64, marcaDeAguaCideca);

    let imagen = await prisma.imagenes.update({
      where: {
        imagenId: Number(id)
      },
      data: {
        imagenNota,
        imagenBase64: await convertBase64ToJpegAndReturnBase64(base64),
        imagenEstatus: 1
      },
    });

    await prisma.autos.update({
      where: {
        autoId: Number(autoId)
      },
      data: {
        autoEstatus: 2
      }
    });
    res.json(imagen)
  } catch (error) {
    res.status(501).json({ error })
  }
})


router.delete('/eliminar/:id', async (req, res) => {
  const { id } = req.params;
  try {


    let imagen = await prisma.imagenes.delete({
      where: {
        imagenId: Number(id)
      }
    });


    res.json(imagen)
  } catch (error) {
    res.status(501).json({ error })
  }
})

router.post('/aceptar/:id', async (req, res) => {
  const { id } = req.params;
  const { autoId } = req.body;
  try {


    let imagen = await prisma.imagenes.update({
      where: {
        imagenId: Number(id)
      },
      data: {
        imagenEstatus: 2
      },

    });

    let imagenes = await prisma.imagenes.findMany({
      where: {
        autoId: Number(autoId),
        imagenEstatus: 1
      }
    });



    if (imagenes.length == 0) {
      await prisma.autos.update({
        where: {
          autoId: Number(autoId)
        },
        data: {
          autoEstatus: 1
        }
      });
    }
    res.json(imagen)
  } catch (error) {
    res.status(501).json({ error })
  }
})



export default router;