
import { Router } from 'express'
import {obtenerRecomendado,obtenerMasPotentes, obtenerMarcas, crearPlanillaDeComprobanteDePago, crearPlanillaDetalleAuto, sendEmail} from '../functions'
import { PrismaClient } from '../../prisma/client'
const prisma = new PrismaClient()

const router = Router()




router.get('/todos', async (req, res) => {

  const {beneficiarioId, estado, pagina, cantidad, pais, marcaId, modeloId, modeloVersionId, autoAnoInicial, autoAnoFinal, colores, provinciaId, ciudadId } = req.query;
  const PAGINA = Number(pagina ?? '1') - 1;
  const CANTIDAD = Number(cantidad ?? '10');
  const MARCAID = Number(marcaId ?? '0');
  const MODELOID = Number(modeloId ?? '0');
  const MODELOVERSIONID = Number(modeloVersionId ?? '0');
  const AUTOANOINICIAL = Number(autoAnoInicial ?? '1950');
  const AUTOANOFINAL = Number(autoAnoFinal ?? '2050');
  const COLORES = typeof colores == 'string' ? colores.split(',').map(Number) : [];
  const ESTADO = Number(estado ?? '0');

  const PROVINCIAID = Number(provinciaId ?? '0');
  const CIUDADID = Number(ciudadId ?? '0');
  const BENEFICIARIOID = Number(beneficiarioId ?? '0');


  let params: any = {};

  if (pais) {
    params = {
      paisId: Number(pais)
    };
  }

  if (MARCAID != 0) {
    params['marcaId'] = MARCAID;
  }
  if (MODELOID != 0) {
    params['modeloId'] = MODELOID;
  }


  if (PROVINCIAID != 0) {
    params['provinciaId'] = PROVINCIAID;
  }

  if (CIUDADID != 0) {
    params['ciudadId'] = CIUDADID;
  }

  if (COLORES.length > 0 && COLORES[0] != 0) {
    params['colorId'] = { in: COLORES };
  }

  if(MODELOVERSIONID != 0){
    params['modeloVersionId'] = MODELOVERSIONID;
  }

  if(ESTADO  != 0){
     params['autoEstatus'] = ESTADO;
  }
  if(BENEFICIARIOID != 0){
    params['beneficiarioId'] = BENEFICIARIOID;
  }
 

  try {
    let autos = await prisma.autos.findMany({
      skip: (PAGINA) * CANTIDAD,
      take: CANTIDAD,
      where: {
        ...params,
        AND: [
          {
            autoAno: {
              gte: AUTOANOINICIAL
            }
          },
          {
            autoAno: {
              lte: AUTOANOFINAL
            }
          }
        ],

        


      },
      orderBy: {
        autoEstatus:'desc'
      },
      include: {
        color: true,
        imagenes: {
          select: {
            imagenId: true,
            autoId: true,
            imagenArchivo: true,
            imagenNota: true,
            imagenEstatus: true
          },
       
        },
        tipo: true,
        beneficiario: true,
        pais: true,
        provincia: true,
        ciudad: true,
        marca: true,
        modelo: true,
        modeloVersion: true,
        combustible: true,
        transmision: true,
        valoraciones: {
          include: {
            usuario: {
              select: {
                usuarioLogin: true,
                usuarioPerfil: true,
                tipoUsuario: true,
                cliente: true
              },

            }
          },
          orderBy:{
            valorFecha:"desc"
          }
        },
        autosMeGustas: {
          select: {
            megustaId: true,
            autoId: true,
            usuarioId: true,
          }
        },
        estatus: true
      }
    });

    if(autos.length ==0){
      res.status(404).json([])
      return;
    }


    res.json(autos)
  } catch (error) {
    
    console.log(error)
    res.status(501).json({ error })
  }
})




router.get('/buscar', async (req, res) => {
  const { pagina, cantidad, pais, marcaId, modeloId, autoAnoInicial, autoAnoFinal, colores, provinciaId, ciudadId } = req.query;
  const PAGINA = Number(pagina ?? '1') - 1;
  const CANTIDAD = Number(cantidad ?? '10');
  const MARCAID = Number(marcaId);
  const MODELOID = Number(modeloId);
  const AUTOANOINICIAL = Number(autoAnoInicial ?? '1950');
  const AUTOANOFINAL = Number(autoAnoFinal ?? '2050');
  const COLORES = typeof colores == 'string' ? colores.split(',').map(Number) : [];


  const PROVINCIAID = Number(provinciaId ?? '0');
  const CIUDADID = Number(ciudadId ?? '0');


  let params: any = {};

  if (pais) {
    params = {
      paisId: Number(pais)
    };
  }

  if (MARCAID != 0) {
    params['marcaId'] = MARCAID;
  }
  if (MODELOID != 0) {
    params['modeloId'] = MODELOID;
  }


  if (PROVINCIAID != 0) {
    params['provinciaId'] = PROVINCIAID;
  }

  if (CIUDADID != 0) {
    params['ciudadId'] = CIUDADID;
  }

  if (COLORES.length > 0 && COLORES[0] != 0) {
    params['colorId'] = { in: COLORES };
  }

  params['autoEstatus'] = {in: [1]};

  /*let reservas:{
    autoId:number
  }[] = [];*/

  
  try {

    /*if(reservaFhInicial && reservaFhFinal){
      reservas = await prisma.reservas.findMany({
        select: {
          autoId: true
        },
        where:{
          AND: [
           {
             reservaFhInicial:  {
               gte: new Date(reservaFhInicial as  string)
             }
           },
           {
             reservaFhFinal: {
               lte: new Date(reservaFhFinal as string)
             }
           }
          ]
        }
     });
 
    }*/

  
    /*let autoIds  = reservas.map((r)=> r.autoId);

    if(autoIds.length > 0){
      params['autoId'] = {
        notIn: autoIds
      };
    }*/

    let autos = await prisma.autos.findMany({
      skip: (PAGINA) * CANTIDAD,
      take: CANTIDAD,
      where: {
       ...params,
      
        AND: [
          {
            autoAno: {
              gte: AUTOANOINICIAL
            }
          },
          {
            autoAno: {
              lte: AUTOANOFINAL
            }
          },

  
        ],


      },
      include: {
        color: true,
        imagenes: {
          select: {
            imagenId: true,
            imagenArchivo: true,
            imagenNota: true,
            imagenEstatus: true
          },
          where: { imagenEstatus: 2 }
        },
        tipo: true,
        beneficiario: true,
        pais: true,
        provincia: true,
        ciudad: true,
        marca: true,
        modelo: true,
        modeloVersion: true,
        combustible: true,
        transmision: true,
        valoraciones: {
          include: {
            usuario: {
              select: {
                usuarioLogin: true,
                usuarioPerfil: true,
                tipoUsuario: true,
                cliente: true
              },

            }
          },
          orderBy:{
            valorFecha:"desc"
          }
        },
        autosMeGustas: {
          select: {
            megustaId: true,
            autoId: true,
            usuarioId: true,
          }
        },
        estatus: true
      }
    });

    if (autos.length == 0) {
      res.status(404).json(autos)
      return;
    }

    res.json(autos)
  } catch (error) {
    console.log(error)
    res.status(501).json({ error })
  }
})


router.post('/crear', async (req, res) => {
  const {precio, transmisionId, combustibleId, modeloVersionId, fechaDeViajeInicial, fechaDeViajeFinal, tipoId, marcaId, modeloId, colorId, autoAno, autoDescripcion, beneficiarioId, autoDireccion, autoCoorX, autoCoorY, seguroId, autoKmIncluido, autoCondiciones, autoNumeroViajes, autoNumeroPersonas, autoNumeroPuertas, autoNumeroAsientos, paisId, provinciaId, ciudadId, precioId, autoEstatus } = req.body;
  try {
    let auto = await prisma.autos.create({
      data: {
        tipoId,
        
        marcaId,
        modeloId,
        colorId,
        autoAno,
        autoDescripcion,
        beneficiarioId,
        autoDireccion,
        autoCoorX,
        autoCoorY,
        seguroId,
        autoKmIncluido,
        autoCondiciones,
        autoNumeroViajes:0,
        autoNumeroPersonas,
        autoNumeroPuertas,
        autoNumeroAsientos,
        paisId,
        provinciaId,
        ciudadId,
        autoEstatus: 3,
        modeloVersionId,
        combustibleId,
        transmisionId,
        precio
      
      },
      include: {
        color: true,
        imagenes: true,
        beneficiario: true,
        pais: true,
        provincia: true,
        ciudad: true,
        marca: true,
        modelo: true,
        modeloVersion: true,
        combustible: true,
        transmision: true,
        autosMeGustas: {
          select: {
            megustaId: true,
            autoId: true,
            usuarioId: true,
          }
        },
      }
    });


    res.json(auto)
  } catch (error) {
    console.log(error)
    res.status(501).json({ error })
  }
})

router.put('/modificar/:id', async (req, res) => {
  const { id } = req.params;
  const {precio,transmisionId, combustibleId, modeloVersionId, fechaDeViajeInicial, fechaDeViajeFinal, tipoId, marcaId, modeloId, colorId, autoAno, autoDescripcion, beneficiarioId, autoDireccion, autoCoorX, autoCoorY, seguroId, autoKmIncluido, autoCondiciones, autoNumeroViajes, autoNumeroPersonas, autoNumeroPuertas, autoNumeroAsientos, paisId, provinciaId, ciudadId, precioId, autoEstatus } = req.body;
  try {
    let auto = await prisma.autos.update({
      where: {
        autoId: Number(id)
      },
      data: {
        tipoId,
        marcaId,
        modeloId,
        colorId,
        autoAno,
        autoDescripcion,
        beneficiarioId,
        autoDireccion,
        autoCoorX,
        autoCoorY,
        seguroId,
        autoKmIncluido,
        autoCondiciones,
        autoNumeroViajes,
        autoNumeroPersonas,
        autoNumeroPuertas,
        autoNumeroAsientos,
        paisId,
        provinciaId,
        ciudadId,
        autoEstatus,

        modeloVersionId,
        combustibleId,
        transmisionId,
        precio
      },
      include: {
        color: true,
        imagenes: true,
        beneficiario: true,
        pais: true,
        provincia: true,
        ciudad: true,
        marca: true,
        modelo: true,
        modeloVersion: true,
    
        transmision: true,
        autosMeGustas: {
          select: {
            megustaId: true,
            autoId: true,
            usuarioId: true,
          }
        },
      }
    });


    res.json(auto)
  } catch (error) {
    console.log(error)
    res.status(501).json({ error })
  }
})


router.put('/aceptar/:id', async (req, res) => {
  const { id } = req.params;
  try {
    let auto = await prisma.autos.update({
      where: {
        autoId: Number(id)
      },
      data: {
        autoEstatus: 1
      },
      include: {
        color: true,
        imagenes: true,
        beneficiario: true,
        pais: true,
        provincia: true,
        ciudad: true,
        marca: true,
        modelo: true,
        transmision: true,
        autosMeGustas: {
          select: {
            megustaId: true,
            autoId: true,
            usuarioId: true,
          }
        },
      }
    });
    res.json(auto)
  } catch (error) {
    res.status(501).json({ error })
  }
})


router.put('/deshabilitar/:id', async (req, res) => {
  const { id } = req.params;
  try {
    let auto = await prisma.autos.update({
      where: {
        autoId: Number(id)
      },
      data: {
        autoEstatus: 2
      },
      include: {
        color: true,
        imagenes: true,
        beneficiario: true,
        pais: true,
        provincia: true,
        ciudad: true,
        marca: true,
        modelo: true,
        transmision: true,
        autosMeGustas: {
          select: {
            megustaId: true,
            autoId: true,
            usuarioId: true,
          }
        },
      }
    });
    res.json(auto)
  } catch (error) {
    res.status(501).json({ error })
  }
})

router.get('/transmisiones', async (req, res) => {
  try {
    let transmisiones = await prisma.autoTipoTransmision.findMany({});
    res.json(transmisiones)
  } catch (error) {
    res.status(501).json({ error })
  }
})

router.get('/transmisiones/crear', async (req, res) => {
  const { transmisionNombre } = req.body;
  try {
    let transmision = await prisma.autoTipoTransmision.create({
      data: {
        transmisionNombre
      }
    });
    res.json(transmision)
  } catch (error) {
    res.status(501).json({ error })
  }
})



router.post('/agregar-me-gusta', async (req, res) => {
  const { autoId, usuarioId } = req.body;
  try {

    let like = await prisma.autosMeGustas.findFirst({
       where:{
        autoId,
        usuarioId
       }
    });

    if(like){
       res.status(409).json({
        error:"ya existe el me gusta"
       })
       return;
    }

    await prisma.autosMeGustas.create({
      data: {
        usuarioId,
        autoId
      }
    });

    let megustas = await prisma.autosMeGustas.findMany({
      where: {
        autoId
      }
    });

    res.json(megustas)

  } catch (error) {
    res.status(501).json({ error })
  }
})

router.delete('/eliminar-me-gusta', async (req, res) => {
  const { autoId, usuarioId } = req.body;
  try {
    let megusta = await prisma.$queryRaw`DELETE FROM public."AutosMeGustas" WHERE "autoId" = ${autoId} AND "usuarioId" = ${usuarioId}`;

    res.json(megusta)
  } catch (error) {
    res.status(501).json({ error })
  }
})

router.get('/tipo-autos/todos', async (req, res) => {

  try {

    let tiposAuto = await prisma.tipoAuto.findMany({

    });
    res.json(tiposAuto)
  } catch (error) {
    res.status(501).json({ error })
  }
})



router.post('/tipo-autos/crear', async (req, res) => {
  const { tipoNombre } = req.body;
  try {

    let tipoAuto = await prisma.tipoAuto.create({
      data: {
        tipoNombre
      }
    });
    res.json(tipoAuto)
  } catch (error) {
    res.status(501).json({ error })
  }
})

router.put('/tipo-autos/modificar/:id', async (req, res) => {
  const { id } = req.params;
  const { tipoNombre } = req.body;
  try {

    let tipoAuto = await prisma.tipoAuto.update({
      where: {
        tipoId: Number(id)
      },
      data: {
        tipoNombre
      }
    });
    res.json(tipoAuto)
  } catch (error) {
    res.status(501).json({ error })
  }
})

router.get('/me-gustas/todos', async (req, res) => {
  const { usuarioId } = req.query;
  try {
    let megustas = await prisma.autosMeGustas.findMany({
      where:{
        usuarioId:Number(usuarioId)
      },
      include: {
        
        auto: {
          include: {
            color: true,
            imagenes: {
              select: {
                imagenId: true,
                imagenArchivo: true,
                imagenNota: true,
                imagenEstatus: true
              }
            },
          
            beneficiario: true,
            pais: true,
            provincia: true,
            ciudad: true,
            marca: true,
            modelo: true,
            modeloVersion: true,
            combustible: true,
            transmision: true,
            
            autosMeGustas: {
              select: {
                megustaId: true,
                autoId: true,
                usuarioId: true,
              }
            },
          }
        }
      }
    });
    let autos =  megustas.map((e)=> e.auto);
    res.json(autos);
  } catch (error) {
    res.status(501).json({ error })
  }
})

router.get('/:id',async(req,res) =>{
  const {id} = req.params;
   try{
     let auto = await prisma.autos.findFirst({
      where:{
        autoId:Number(id)
      },
      include:{
        color: true,
        imagenes: {
          select: {
            imagenId: true,
            imagenArchivo: true,
            imagenNota: true,
            imagenEstatus: true
          },
          where: { imagenEstatus: 2 }
        },
        tipo: true,
        beneficiario: true,
        pais: true,
        provincia: true,
        ciudad: true,
        marca: true,
        modelo: true,
        modeloVersion: true,
        combustible: true,
        transmision: true,
        valoraciones: {
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
        },
        autosMeGustas: {
          select: {
            megustaId: true,
            autoId: true,
            usuarioId: true,
          }
        },
        estatus: true
      }
     });

     if(!auto){
      res.status(404).json({
        error:"No se encontro el auto"
      })
      return;
     }
     res.json(auto)
   }catch(error){
    res.status(501).json({error})
   }
})


router.get('/obtener-datos-inicio/todos',async(req,res) =>{
  try{
    let auto = await obtenerRecomendado();
    let autos = await obtenerMasPotentes();
    let marcas = await obtenerMarcas();

    if(autos.length == 0){
      res.status(404).json({
        error:"no encontrados"
      })
      return;
    }
    res.json({
      auto,
      autos,
      marcas
    })
  }catch(error){
    res.status(501).json({
    error
    })
  }
})


export default router;