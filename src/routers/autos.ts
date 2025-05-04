import { error } from 'console';
import { AutoEstatus, Autos, AutosMeGustas, Beneficiarios, Ciudades, Colores, Combustibles, Imagenes, Marcas, Modelos, ModelosVersiones, Paises, Precios, Prisma, PrismaClient, Provincias, TipoAuto, Usuarios, Valoraciones } from '../../prisma/client'
import { Router } from 'express'

const prisma = new PrismaClient()

const router = Router()




router.get('/todos', async (req, res) => {
  const { pagina, cantidad, pais, marcaId, modeloId, autoAnoInicial, autoAnoFinal, colores, provinciaId, ciudadId } = req.query;
  const PAGINA = Number(pagina ?? '1') - 1;
  const CANTIDAD = Number(cantidad ?? '10');
  const MARCAID = Number(marcaId ?? '0');
  const MODELOID = Number(modeloId ?? '0');
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
      include: {
        color: true,
        precio: true,
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

router.get('/obtener-recomendado', async (req, res) => {
  const { pais } = req.query;

  // Definir los parámetros de búsqueda en función del país recibido.
  let params = {};
  if (pais) {
    params = { paisId: Number(pais) };
  }

  try {
    // Primero, contamos la cantidad de autos que cumplen con el filtro.
    const count = await prisma.autos.count({
      where: { ...params }
    });

    let auto = null;
    if (count > 0) {
      // Generamos un número aleatorio entre 0 y count - 1
      const randomSkip = Math.floor(Math.random() * count);

      // Consultamos únicamente el auto en esa posición usando skip y take.
      const autos = await prisma.autos.findMany({
        where: { ...params },
        skip: randomSkip,
        take: 1,
        include: {
          color: true,
          precio: true,
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
      auto = autos[0]; // Seleccionamos el primer (y único) registro del array.
    }

    res.json(auto);
  } catch (error) {
    console.error(error);
    res.status(501).json({ error });
  }
});



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
      include: {
        color: true,
        precio: true,
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
  const { transmisionId, combustibleId, modeloVersionId, fechaDeViajeInicial, fechaDeViajeFinal, tipoId, marcaId, modeloId, colorId, autoAno, autoDescripcion, beneficiarioId, autoDireccion, autoCoorX, autoCoorY, seguroId, autoKmIncluido, autoCondiciones, autoNumeroViajes, autoNumeroPersonas, autoNumeroPuertas, autoNumeroAsientos, paisId, provinciaId, ciudadId, precioId, autoEstatus } = req.body;
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
        autoNumeroViajes,
        autoNumeroPersonas,
        autoNumeroPuertas,
        autoNumeroAsientos,
        paisId,
        provinciaId,
        ciudadId,
        precioId,
        autoEstatus: 2,
        fechaDeViajeInicial,
        fechaDeViajeFinal,
        modeloVersionId,
        combustibleId,
        transmisionId
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
    res.status(501).json({ error })
  }
})

router.put('/modificar/:id', async (req, res) => {
  const { id } = req.params;
  const {transmisionId, combustibleId, modeloVersionId, fechaDeViajeInicial, fechaDeViajeFinal, tipoId, marcaId, modeloId, colorId, autoAno, autoDescripcion, beneficiarioId, autoDireccion, autoCoorX, autoCoorY, seguroId, autoKmIncluido, autoCondiciones, autoNumeroViajes, autoNumeroPersonas, autoNumeroPuertas, autoNumeroAsientos, paisId, provinciaId, ciudadId, precioId, autoEstatus } = req.body;
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
        precioId,
        fechaDeViajeInicial,
        fechaDeViajeFinal,
        modeloVersionId,
        combustibleId,
        transmisionId
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

router.get('/mas-potentes', async (req, res) => {
  const { pagina, cantidad, pais } = req.query;
  const PAGINA = Number(pagina ?? '1') - 1;
  const CANTIDAD = Number(cantidad ?? '10');


  try {
    let xautos: Autos[] = await prisma.$queryRaw`
       SELECT * FROM "Autos" ORDER BY RANDOM() LIMIT 10;
    `;

    let autos: any = [...xautos];

    for (let i = 0; i < xautos.length; i++) {

      let xauto = autos[i];

      let color: Colores[] = await prisma.$queryRaw`
         SELECT * FROM "Colores" WHERE "colorId" = ${xauto.colorId}
      `;

      let precio: Precios[] = await prisma.$queryRaw`
      SELECT * FROM "Precios" WHERE "precioId" = ${xauto.precioId}
      `;

      let imagenes: Imagenes[] = await prisma.$queryRaw`
       SELECT "imagenId", "imagenArchivo", "imagenNota" FROM "Imagenes" WHERE "autoId" = ${xauto.autoId} AND "imagenEstatus" = 2 ORDER BY "imagenId"
      `;

      let tipos: TipoAuto[] = await prisma.$queryRaw`
      SELECT * FROM "TipoAuto" WHERE "tipoId" = ${xauto.tipoId}
      `;


      let beneficiarios: Beneficiarios[] = await prisma.$queryRaw`
               SELECT * FROM "Beneficiarios" WHERE "beneficiarioId" = ${xauto.beneficiarioId}
             `;


      let paises: Paises[] = await prisma.$queryRaw`
      SELECT * FROM "Paises" WHERE "paisId" = ${xauto.paisId}
      `;

      let provincias: Provincias[] = await prisma.$queryRaw`
       SELECT * FROM "Provincias" WHERE "provinciaId" = ${xauto.provinciaId}
        `;

      let ciudades: Ciudades[] = await prisma.$queryRaw`
          SELECT * FROM "Ciudades" WHERE "ciudadId" = ${xauto.ciudadId}
         `;


      let marcas: Marcas[] = await prisma.$queryRaw`
           SELECT * FROM "Marcas" WHERE "marcaId" = ${xauto.marcaId}
      `;

      let modelos: Modelos[] = await prisma.$queryRaw`
           SELECT * FROM "Modelos" WHERE "modeloId" = ${xauto.modeloId}
          `;

      let modelosVersiones:ModelosVersiones[] = await prisma.$queryRaw`
       SELECT * FROM "ModelosVersiones" WHERE "versionId" = ${xauto.modeloVersionId}
      `;

        let combustibles:Combustibles[] = await prisma.$queryRaw`
            SELECT * FROM "Combustibles" WHERE "combustibleId" = ${xauto.combustibleId}
         `;


      let transmisiones: Modelos[] = await prisma.$queryRaw`
           SELECT * FROM "AutoTipoTransmision" WHERE "transmisionId" = ${xauto.transmisionId}
       `;

      let estatus: AutoEstatus[] = await prisma.$queryRaw`
        SELECT * FROM "AutoEstatus" WHERE "autoEstatus" = ${xauto.autoEstatus}
        `;

      let valoraciones: any[] = await prisma.$queryRaw`
      SELECT * FROM "Valoraciones" WHERE "autoId" = ${xauto.autoId} ORDER BY "valorFecha" DESC
       `;


      let megustas: any[] = await prisma.$queryRaw`
        SELECT "megustaId", "autoId", "usuarioId" FROM "AutosMeGustas" WHERE "autoId" = ${xauto.autoId}
     `;


      for (let j = 0; j < valoraciones.length; j++) {
        let valoracion = valoraciones[j];
        let usuarios: any[] = await prisma.$queryRaw`
        SELECT "usuarioLogin", "usuarioPerfil", "usuarioTipo", "clienteId" FROM "Usuarios" WHERE "usuarioId" = ${valoracion.usuarioId}
         `;
        let usuario = usuarios[0];
        let tipoUsuario = await prisma.$queryRaw`
        SELECT * FROM "UsuarioTipo" WHERE "usuarioTipo" = ${usuario.usuarioTipo}
         `;
        let clientes: any[] = await prisma.$queryRaw`
            SELECT * FROM "Clientes" WHERE "clienteId" = ${usuario.clienteId}
          `;


        valoracion.usuario = usuario;
        usuario.cliente = clientes[0];
        usuario.tipoUsuario = tipoUsuario;
      }



      xauto.color = color[0];
      xauto.precio = precio[0];
      xauto.imagenes = imagenes;
      xauto.tipo = tipos[0];
      xauto.beneficiario = beneficiarios[0];
      xauto.pais = paises[0];
      xauto.provincia = provincias[0];
      xauto.ciudad = ciudades[0];
      xauto.marca = marcas[0];
      xauto.modelo = modelos[0];
      xauto.modeloVersion = modelosVersiones[0];
      xauto.combustible = combustibles[0];
      xauto.transmision = transmisiones[0];
      xauto.valoraciones = valoraciones;
      xauto.autosMeGustas = megustas;
      xauto.estatus = estatus[0];

    }



    res.json(autos)
  } catch (error) {
    console.log(error)
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
            precio: true,
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
        precio: true,
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



export default router;