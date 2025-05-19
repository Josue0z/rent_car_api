
import { Router } from 'express'
import { agregarMarcaAgua, convertBase64ToJpegAndReturnBase64, crearPlanillaDetalleAuto, removerBase64Data, sendEmail } from '../functions'
import namor from "namor"
import { prisma } from '../app'
import { marcaDeAguaCideca } from '../data'


const router = Router()


router.get('/todos', async (req, res) => {

  const {autoId} = req.query;
  try {
    let imagenes = await prisma.imagenes.findMany({
      where:{
        autoId:Number(autoId)
      },
      select: {
        imagenId: true,
        autoId: true,
        imagenArchivo: true,
        imagenNota: true,
        imagenEstatus: true,
        estatus: true
      }
    });

    if(imagenes.length == 0){
      res.status(404).json([])
      return;
    }
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
    let xbase64 = await convertBase64ToJpegAndReturnBase64(base64);

    let imagen = await prisma.imagenes.create({
      data: {
        autoId,
        imagenNota:'',
        imagenBase64: xbase64,
        imagenEstatus: 1,
        imagenArchivo: `${imagenNombre}.jpeg`
      },
    
    });

     let auto = await prisma.autos.update({
      where: {
        autoId: Number(autoId)
      },
      data: {
        autoEstatus: 3
      },
      include:{
        imagenes: true,
        marca: true,
        modelo: true,
        modeloVersion: true,
        beneficiario: {
          include:{
            banco: true,
            bancoCuentaTipo: true
          }
        }
      }
    });

       let html = crearPlanillaDetalleAuto(auto);

       let attachments = [
           {
                  filename: 'imagen.png',
                  content: removerBase64Data(xbase64),
                  cid: 'imagen',
                  encoding: 'base64'
            }
       ];

    sendEmail({
      to: process.env.EMAIL_USERNAME as string,
      subject:`SE SUBIO IMAGEN DEL AUTO - ${auto.marca.marcaNombre} ${auto.modeloVersion?.versionNombre ?? auto.modelo.modeloNombre} - ${auto.autoAno}`,
      text:'',
      html,
      attachments
    });

    res.json(imagen)
  } catch (error) {
    console.log(error)
    res.status(501).json({ error })
  }
})

router.put('/modificar-imagen/:id', async (req, res) => {
  const { id } = req.params;
  const { imagenNota, imagenBase64, autoId } = req.body;
  try {



    let base64 = await agregarMarcaAgua(imagenBase64, marcaDeAguaCideca);
    let xbase64 =  await convertBase64ToJpegAndReturnBase64(base64);

    let imagen = await prisma.imagenes.update({
      where: {
        imagenId: Number(id)
      },
      data: {
        imagenNota,
        imagenBase64:xbase64,
        imagenEstatus: 1
      },
    });

    let auto = await prisma.autos.update({
      where: {
        autoId: Number(autoId)
      },
      data: {
        autoEstatus: 3
      },
      include:{
        imagenes: true,
        marca: true,
        modelo: true,
        modeloVersion: true,
        beneficiario: {
          include:{
            banco: true,
            bancoCuentaTipo: true
          }
        }
      }
    });

      let html = crearPlanillaDetalleAuto(auto);

      let attachments = [
           {
                  filename: 'imagen.png',
                  content:removerBase64Data(xbase64),
                  cid: 'imagen',
                  encoding: 'base64'
            }
       ];

    sendEmail({
      to: process.env.EMAIL_USERNAME as string,
      subject:`SE MODIFICO IMAGEN DEL AUTO - ${auto.marca.marcaNombre} ${auto.modeloVersion?.versionNombre ?? auto.modelo.modeloNombre} - ${auto.autoAno}`,
      text:'',
      html,
      attachments
    });
    res.json(imagen)
  } catch (error) {
    res.status(501).json({ error })
  }
})


router.delete('/eliminar/:id', async (req, res) => {
  const { id } = req.params;
  const {autoId} = req.body;
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

router.put('/aceptar/:id', async (req, res) => {
  const { id } = req.params;
  const { autoId } = req.body;
  
  try {
    let img = await prisma.imagenes.findFirst({
      where: {
        imagenId: Number(id)
      }
    });

    if(img?.imagenEstatus == 2){
      res.status(409).json({
        error:"La imagen esta activa"
      })
     return;
    }

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
          autoId
        },
        data: {
          autoEstatus: 1
        },
      });

    }

       let auto = await prisma.autos.findFirst({
        where: {
          autoId
        },
    
        include:{
          imagenes: true,
          marca: true,
          modelo: true,
          modeloVersion: true,
          beneficiario: {
            include:{
              banco: true,
              bancoCuentaTipo: true
            }
          }
        }
      });

      
      let html = crearPlanillaDetalleAuto(auto);

      let attachments = [
           {
                  filename: 'imagen.png',
                  content: removerBase64Data(imagen.imagenBase64),
                  cid: 'imagen',
                  encoding: 'base64'
            }
       ];

    sendEmail({
      to: auto?.beneficiario.beneficiarioCorreo as string,
      subject:`SE ACEPTO LA IMAGEN DEL AUTO - ${auto?.marca.marcaNombre} ${auto?.modeloVersion?.versionNombre ?? auto?.modelo.modeloNombre} - ${auto?.autoAno}`,
      text:'',
      html,
      attachments
    });
    res.json(imagen)
  } catch (error) {
    console.log(error)
    res.status(501).json({ error })
  }
})

router.put('/rechazar/:id', async (req, res) => {
  const { id } = req.params;
  const { autoId } = req.body;
  try {

    let img = await prisma.imagenes.findFirst({
      where: {
        imagenId: Number(id)
      }
    });

    if(img?.imagenEstatus == 2){
      res.status(409).json({
        error:"La imagen esta activa"
      })
     return;
    }
    let imagen = await prisma.imagenes.update({
      where: {
        imagenId: Number(id)
      },
      data: {
        imagenEstatus: 3
      },

    });



    let auto = await prisma.autos.update({
        where: {
          autoId
        },
        data: {
          autoEstatus: 3
        },
        include:{
          imagenes: true,
          marca: true,
          modelo: true,
          modeloVersion: true,
          beneficiario:{
            include:{
              banco: true,
              bancoCuentaTipo: true
            }
          }
        }
      });


      let html = crearPlanillaDetalleAuto(auto);

      let attachments = [
           {
                  filename: 'imagen.png',
                  content: removerBase64Data(imagen.imagenBase64),
                  cid: 'imagen',
                  encoding: 'base64'
            }
       ];

    sendEmail({
      to: auto.beneficiario.beneficiarioCorreo as string,
      subject:`SE RECHAZO LA IMAGEN DEL AUTO - ${auto.marca.marcaNombre} ${auto.modeloVersion?.versionNombre ?? auto.modelo.modeloNombre} - ${auto.autoAno}`,
      text:'',
      html,
      attachments
    });


    
    res.json(imagen)
  } catch (error) {
    res.status(501).json({ error })
  }
})



export default router;