


import { Router } from 'express'
import { agregarMarcaAgua, convertBase64ToJpegAndReturnBase64 } from '../functions'
import namor from "namor"
import { prisma } from '../app'
import { marcaDeAguaCideca } from '../data'


const router = Router()

router.post('/subir-documento', async (req, res) => {

    const { usuarioId, imagenBase64, documentoTipo, documentoFormatoId} = req.body;
    
 
  
    try {

      let base64 = '';
      let archivo = '';

      let imagenNombre = namor.generate({
        words: 3
      });
  

      if(documentoFormatoId == 1){
        base64 = await convertBase64ToJpegAndReturnBase64(imagenBase64);
        archivo = `${imagenNombre}.jpeg`;
      }
  
      if(documentoFormatoId == 2){
        archivo = `${imagenNombre}.pdf`;
        base64 = `data:application/pdf;base64,${imagenBase64}`;
      }


      let documento = await prisma.documentos.create({
        data: {
          usuarioId,
          documentoTipo,
          documentoEstatus: 1,
          imagenBase64: base64,
          imagenArchivo: archivo,
          documentoFormatoId
        },
        include: {
          usuario: {
            include: {
              cliente: true,
              beneficiario: true
            }
          },
          documentoFormato: true,
          estatus: true
        }
      });
  
      await prisma.usuarios.update({
        where: {
          usuarioId,
        },
        data: {
          usuarioEstatus: 3
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
    const { usuarioId, imagenBase64, documentoTipo, documentoFormatoId} = req.body;
  
  
    try {

      let base64 = '';
      let archivo = '';

      let imagenNombre = namor.generate({
        words: 3
      });
  

      if(documentoFormatoId == 1){
        base64 = await convertBase64ToJpegAndReturnBase64(imagenBase64);
        archivo = `${imagenNombre}.jpeg`;
      }
  
      if(documentoFormatoId == 2){
        archivo = `${imagenNombre}.pdf`;
        base64 = `data:application/pdf;base64,${imagenBase64}`;
      }

      let documento = await prisma.documentos.update({
        where:{
          documentoId: Number(id)
        },
        data: {
          documentoEstatus: 1,
          documentoTipo,
          imagenBase64: base64,
          documentoFormatoId
        },
        include: {
          usuario: {
            include: {
              cliente: true,
              beneficiario: true
            }
          },
          documentoFormato: true,
          estatus: true
        }
      });
  
      await prisma.usuarios.update({
        where: {
          usuarioId,
        },
        data: {
          usuarioEstatus: 3
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

      let doc = await prisma.documentos.findFirst({
        where: {
          documentoId: Number(id)
        }
      });
  
      if(doc?.documentoEstatus == 2){
        res.status(409).json({
          error:"El documento esta activo"
        })
       return;
      }
  
  
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

  router.put('/rechazar/:id', async (req, res) => {
    const { id } = req.params;
    try {
      let doc = await prisma.documentos.findFirst({
        where: {
          documentoId: Number(id)
        }
      });
  
      if(doc?.documentoEstatus == 2){
        res.status(409).json({
          error:"El documento esta activo"
        })
       return;
      }
      let documento = await prisma.documentos.update({
        where: {
          documentoId: Number(id),
        },
        data: {
          documentoEstatus: 3
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
  

  
    
     await prisma.usuarios.update({
          where: {
            usuarioId: Number(documento.usuarioId)
          },
          data: {
            usuarioEstatus: 3
          }
        });
      
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
            documentoFormato: true,
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

      if(doc?.documentoFormatoId == 1){
        res.setHeader('Content-Type', 'image/jpeg');

      }

      if(doc?.documentoFormatoId == 2){
        res.setHeader('Content-Type', 'application/pdf');

      }
  
   

  
      let base64 = xbase64?.split('base64,')[1];
  
      res.send(Buffer.from(base64!, 'base64'))
  
    } catch (error) {
      res.status(501).json({ error })
    }
  })
  
  
  export default router