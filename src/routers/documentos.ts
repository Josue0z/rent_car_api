


import { Router } from 'express'
import { agregarMarcaAgua, convertBase64ToJpegAndReturnBase64 } from '../functions'
import namor from "namor"
import { prisma } from '../app'
import { marcaDeAguaCideca } from '../data'


const router = Router()

router.post('/subir-documento', async (req, res) => {

    const { usuarioId, imagenBase64, documentoTipo} = req.body;
  
  
    try {
      let imagenNombre = namor.generate({
        words: 3
      });
  
      let documento = await prisma.documentos.create({
        data: {
          usuarioId,
          documentoTipo,
          documentoEstatus: 1,
          imagenBase64: await convertBase64ToJpegAndReturnBase64(imagenBase64),
          imagenArchivo: `${imagenNombre}.jpeg`
        },
        include: {
          usuario: {
            include: {
              cliente: true,
              beneficiario: true
            }
          },
          estatus: true
        }
      });
  
      await prisma.usuarios.update({
        where: {
          usuarioId,
        },
        data: {
          usuarioEstatus: 1
        }
      });
      res.json(documento)
    } catch (error) {
      console.log(error)
      res.status(501).json({ error })
    }
  })
  
  router.put('/modificar-documento/:id', async (req, res) => {
    const {id} = req.params;
    const { usuarioId, imagenBase64, documentoTipo} = req.body;
  
  
    try {
     
      let documento = await prisma.documentos.update({
        where:{
          documentoId: Number(id)
        },
        data: {
          documentoEstatus: 1,
          documentoTipo,
          imagenBase64: await convertBase64ToJpegAndReturnBase64(imagenBase64),
        },
        include: {
          usuario: {
            include: {
              cliente: true,
              beneficiario: true
            }
          },
          estatus: true
        }
      });
  
      await prisma.usuarios.update({
        where: {
          usuarioId,
        },
        data: {
          usuarioEstatus: 1
        }
      });
      res.json(documento)
    } catch (error) {
      console.log(error)
      res.status(501).json({ error })
    }
  })
  

  router.get('/documentoestatus/todos', async (req, res) => {

    try {
  
      let tipos = await prisma.documentoEstatus.findMany({
      
      });
  
  
      res.json(tipos)
    } catch (error) {
      res.status(501).json({ error })
    }
  })
  
  router.get('/documentotipo/todos', async (req, res) => {
  
    try {
  
      let tipos = await prisma.tipoDocumento.findMany({
        
      });
  
  
      res.json(tipos)
    } catch (error) {
      res.status(501).json({ error })
    }
  })
  
  router.post('/documentotipo/crear', async (req, res) => {
  
    const { name } = req.body;
    try {
  
      let tipo = await prisma.tipoDocumento.create({
        data: {
          name
        },
      });
  
  
      res.json(tipo)
    } catch (error) {
      res.status(501).json({ error })
    }
  })
  
  router.put('/aceptar/:id', async (req, res) => {
    const { id } = req.params;
    try {
  
      let documento = await prisma.documentos.update({
        where: {
          documentoId: Number(id),
        },
        data: {
          documentoEstatus: 2
        },
        include: {
          usuario: {
            include: {
              cliente: true,
              beneficiario: true
            }
          },
          tipo: true,
          estatus: true
        }
      });
  
      let docs = await prisma.documentos.findMany({
        where: {
          usuarioId: documento.usuarioId,
          documentoEstatus: 1
        }
      });
  
      if (docs.length == 0) {
        await prisma.usuarios.update({
          where: {
            usuarioId: Number(documento.usuarioId)
          },
          data: {
            usuarioEstatus: 2
          }
        });
      }
      res.json(documento)
    } catch (error) {
      res.status(501).json({ error })
    }
  })
  
  router.get('/todos', async (req, res) => {
   
    const {usuarioId} = req.query;

    try {
      let docs = await prisma.documentos.findMany({
        where: {
          usuarioId: Number(usuarioId)
        },
        include:{
            tipo: true,
            estatus: true
        }
      });
  
      res.json(docs)
    } catch (error) {
      res.status(501).json({ error })
    }
  })


  router.get('/obtener/:id', async (req, res) => {
    const { id } = req.params;
    try {
  
  
      let imagen = await prisma.documentos.findFirst({
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
  
  
  export default router