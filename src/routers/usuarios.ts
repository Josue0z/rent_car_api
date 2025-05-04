
import { Prisma, PrismaClient } from '../../prisma/client'
import { Router } from 'express'
import { hash, compare } from 'bcrypt';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { prisma } from '../app';
import { sendEmail } from '../functions';
import fs from 'fs'
import { join } from 'path';
import { checkSvgBase64, rejectImage } from '../data';

import passwordGenerator from 'password-generator'
import { error } from 'console';

const router = Router()


const createUser = async (req: any, prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) => {


  try {
    let { beneficiario, cliente, usuario } = req.body;
    let { usuarioLogin, usuarioClave, usuarioTipo, manejador} = usuario;
    let { clienteIdentificacion, clienteNombre, clienteTelefono1, clienteTelefono2 } = cliente ?? {};
    let { beneficiarioNombre, beneficiarioIdentificacion, beneficiarioDireccion, beneficiarioCoorX, beneficiarioCoorY, bancoId, beneficiarioCuentaTipo, beneficiarioCuentaNo } = beneficiario ?? {};

    let {nombreCompleto,telefono, correo, manejadorIdentificacion} = manejador;
    const salt = Number(process.env.PASSWORD_SALT);
    const newPassword = await hash(usuarioClave, salt);

    let ben: any, cl: any, ma:any, user: any;

    const _createBen = () => {
      if (beneficiario != undefined) {
        ben = prisma.beneficiarios.create({
          data: {
            beneficiarioNombre,
            beneficiarioIdentificacion,
            beneficiarioDireccion,
            beneficiarioCoorX,
            beneficiarioCoorY,
            bancoId,
            beneficiarioCuentaTipo,
            beneficiarioCuentaNo,
            beneficiarioCorreo: usuarioLogin
          }
        });
        return ben;


      }
      return prisma.colores.findFirst();


    }

    const _createCl = () => {
      if (cliente != undefined) {
        cl = prisma.clientes.create({
          data: {
            clienteIdentificacion,
            clienteNombre,
            clienteTelefono1,
            clienteTelefono2,
            clienteCorreo: usuarioLogin
          }
        });
        return cl;
      }
      return prisma.colores.findFirst();

    }

    const _createMa = () => {
      if (manejador != undefined) {
        ma = prisma.manejadores.create({
          data: {
            manejadorIdentificacion,
            telefono,
            correo,
            nombreCompleto
          }
        });
        return ma;
      }
      return prisma.colores.findFirst();

    }


    let res = await prisma.$transaction(<Prisma.PrismaPromise<any>[]>[
      _createBen(),
      _createCl(),
      _createMa()
    ]);
    ben = res[0];
    cl = res[1];
    user = await prisma.usuarios.create({
      data: {
        usuarioLogin,
        usuarioClave: newPassword,
        usuarioEstatus: 1,
        usuarioTipo,
        clienteId: cl?.clienteId,
        beneficiarioId: ben?.beneficiarioId,
        manejadorId:ma?.manejadorId
      },
      include:
      {
        cliente: true,
        beneficiario: true,
        manejador: true,
        estatus: true
      }
    });
    return {
      ...user
    };
  } catch (e) {
    throw e;
  }
}



router.get(`/todos`, async (req, res) => {
  const {usuarioTipo} = req.query;
  const USUARIOTIPO = Number(usuarioTipo  ??'0');

  let where:any = {};

  if(USUARIOTIPO != 0){
     where['usuarioTipo'] = USUARIOTIPO;
  }
  try {
    const result = await prisma.usuarios.findMany({
      where,
      select: {
        usuarioId: true,
        usuarioLogin: true,
        usuarioClave: false,
        fhCreacion: true,
        usuarioPerfil: true,
        clienteId: true,
        cliente: {
          include: {
            direccion: true
          }
        },
        beneficiarioId: true,
        beneficiario: {
          include: {
            banco: true,
            bancoCuentaTipo: true
          }
        },
        manejador: true,
        tipoUsuario: true,
        estatus: true,
        documentos: {
          select: {
            documentoId: true,
            imagenArchivo: true,
            documentoTipo: true,
            tipo: true,
            estatus: true
          }
        }
      }
    })
    res.json(result)
  } catch (error) {
    res.status(501).json({
      error
    })
  }
})

router.get(`/:id`, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await prisma.usuarios.findFirst({
      where: {
        usuarioId: Number(id)
      },
      include: {
        cliente: true,
        beneficiario: true,
        estatus: true
      }
    })
    res.json(result)
  } catch (error) {
    res.status(501).json({
      error
    })
  }
})

router.post('/login-as-client', async (req, res) => {
  const { usuario, clave } = req.body;
  try {
    let user = await prisma.usuarios.findFirst({
      where: {
        usuarioLogin: usuario,
        usuarioTipo:1
      },

      include: {

        cliente: {
          include: {
            direccion: true
          }
        },
        beneficiario: {
          include: {
            banco: true,
            bancoCuentaTipo: true
          }
        },
        estatus: true
      }
    })

    let ux = { ...user };


    if (user) {
      let isCorrect = await compare(clave, user!.usuarioClave);

      if (isCorrect) {
        delete ux.usuarioClave;
       
        res.json(ux)
      } else {
        res.status(409).json({
          error: 'CREDENCIALES NO VALIDAS'
        })
      }
    } else {
      res.status(404).json({
        error: 'USUARIO NO ENCONTRADO'
      })
    }

  } catch (error) {
    console.log(error)
    res.status(501).json({
      error
    })
  }
})


router.post('/login-as-admin', async (req, res) => {
  const { usuario, clave } = req.body;
  try {
    let user = await prisma.usuarios.findFirst({
      where: {
        usuarioLogin: usuario,
        usuarioTipo:{
          in: [2,3]
        }
      },

      include: {

        beneficiario: {
          include: {
            banco: true,
            bancoCuentaTipo: true
          }
        },
        manejador: true,
        estatus: true
      }
    })

    let ux = { ...user };


    if (user) {
      let isCorrect = await compare(clave, user!.usuarioClave);

      if (isCorrect) {
        delete ux.usuarioClave;
       
        res.json(ux)
      } else {
        res.status(409).json({
          error: 'CREDENCIALES NO VALIDAS'
        })
      }
    } else {
      res.status(404).json({
        error: 'USUARIO NO ENCONTRADO'
      })
    }

  } catch (error) {
    console.log(error)
    res.status(501).json({
      error
    })
  }
})

router.post('/asignarclave', async (req, res) => {
  const userId = req.headers['x-user-id'];
  const { viejaClave, nuevaClave } = req.body;
  try {
    let user = await prisma.usuarios.findFirst({
      where: {
        usuarioId: Number(userId)
      }
    });

    if (await compare(viejaClave, user!.usuarioClave)) {
      var bPassword = await hash(nuevaClave, 10);
      user = await prisma.usuarios.update({
        where: {
          usuarioId: Number(userId)
        },
        data: {
          usuarioClave: bPassword
        },

        include: {
          cliente: true,
          beneficiario: true,
          estatus: true
        }
      })

      if (user) {
        res.json({
          message: "CREDENCIALES CAMBIADAS CORRECTAMENTE"
        })
      }
    } else {
      res.status(401).json({
        error: 'CREDENCIALES NO VALIDAS'
      })
    }

  } catch (error) {
    console.log(error)
    res.status(501).json({
      error
    })
  }
})

router.post('/crear', async (req, res) => {
  try {
    const user = await createUser(req, prisma);
    res.json(user)
  } catch (error) {
    console.log(error)
    res.status(501).json({ error })
  }
})

router.put('/aceptar/:id', async (req, res) => {
  const { id } = req.params;
  try {

    const xuser = await prisma.usuarios.findFirst({
      where: {
        usuarioId: Number(id)
      }
    });

    if (!xuser) {
      res.status(404).json({ error: "Usuario no existe" })
      return;
    }

    if (xuser?.usuarioEstatus == 2) {
      res.status(409).json({
        error: "Usuario ya fue aceptado"
      })
      return;
    }

    const user = await prisma.usuarios.update({
      data: {
        usuarioEstatus: 2
      },
      where: {
        usuarioId: Number(id)
      },
      include: {
        estatus: true,
        tipoUsuario: true,
        cliente: true,
        beneficiario: true
      }
    });
    let html = fs.readFileSync(join(__dirname, '../', 'planillas', 'user.accept.html')).toString('utf-8')



    html = html.replaceAll('{{usuarioNombre}}', user.usuarioLogin)

    sendEmail({
      to: user.usuarioLogin,
      subject: `USUARIO ${user.usuarioLogin.toUpperCase()} ACEPTADO - CIDECA`,
      text: '',
      html,
      attachments: [
        {
          filename: 'checkSvgBase64.png',
          content: checkSvgBase64,
          cid: 'checkSvgBase64',
          encoding: 'base64'
        }
      ]

    })
    res.json(user)
  } catch (error) {
    res.status(501).json({ error })
  }
})


router.put('/rechazar/:id', async (req, res) => {
  const { id } = req.params;
  const { razones } = req.body;
  try {

    const xuser = await prisma.usuarios.findFirst({
      where: {
        usuarioId: Number(id)
      },

    });

    if (!xuser) {
      res.status(404).json({ error: "Usuario no existe" })
      return;
    }

    if (xuser?.usuarioEstatus == 3) {
      res.status(409).json({
        error: "Usuario ya fue rechazado"
      })
      return;
    }

    const user = await prisma.usuarios.update({
      data: {
        usuarioEstatus: 3
      },
      where: {
        usuarioId: Number(id)
      },
      include: {
        cliente: true,
        beneficiario: true,
        estatus: true
      }
    });

    let html = fs.readFileSync(join(__dirname, '../', 'planillas', 'user.reject.html')).toString('utf-8')



    html = html.replaceAll('{{beneficiarioNombre}}', user!.beneficiario!.beneficiarioNombre ?? '')

    html = html.replaceAll('{{razones}}', razones);

    sendEmail({
      to: user.usuarioLogin,
      subject: `USUARIO ${user.usuarioLogin.toUpperCase()} RECHAZADO - CIDECA`,
      text: '',
      html,
      attachments: [
        {
          filename: 'rejectImage.png',
          content: rejectImage,
          cid: 'rejectImage',
          encoding: 'base64'
        }
      ]

    })
    res.json(user)
  } catch (error) {
    res.status(501).json({ error })
  }
})


router.put('/cambiar-clave', async (req, res) => {
  const { usuarioId, claveVieja, claveNueva } = req.body;
  try {
    let usuario = await prisma.usuarios.findFirst({
      where: {
        usuarioId
      }
    });

    if (!usuario) {
      res.status(404).json({
        error: "No se encontro el usuario"
      })
      return;
    }
    let isCorrect = await compare(claveVieja, usuario!.usuarioClave);

    if (isCorrect) {
      let _nuevaClave = await hash(claveNueva, Number(process.env.PASSWORD_SALT));
      await prisma.usuarios.update({
        where: {
          usuarioId
        },
        data: {
          usuarioClave: _nuevaClave,
          cambioClave: false
          
        }
      });

      res.json({
        message: "se cambio la clave"
      })
    }else{
      res.status(409).json({
        error:"la clave no es correcta"
      })
    }


  } catch (error) {
    res.status(501).json({ error })
  }
})

router.post('/enviar-clave',async(req,res) =>{
  const {correo} = req.body;
   try{

     let usuario = await prisma.usuarios.findFirst({
        where :{
           usuarioLogin: correo
        },
        include:{
          cliente: true,
          beneficiario: true,
          manejador: true
        }
      });

      if(!usuario){
        res.status(404).json({
          error:"no existe el correo"
        })
        return;
      }

      let pass = passwordGenerator();

      let salt= Number(process.env.PASSWORD_SALT)
      let newPass = await hash(pass,salt);

      usuario = await prisma.usuarios.update({
        where:{
          usuarioLogin: correo
        },
        data: {
           usuarioClave: newPass,
           cambioClave: true
        },
        include:{
          cliente: true,
          beneficiario: true,
          manejador: true
        }
      });

      sendEmail(
        {
          to: usuario?.cliente?.clienteCorreo ?? usuario?.beneficiario?.beneficiarioCorreo ?? usuario.manejador?.correo ?? '',
          subject:'CAMBIO DE CLAVE - CIDECA',
          text:'',
          html:`<H2>Tu clave es ${pass}</H2>`
        }
      );

      res.json(usuario)
   }catch(e){
    res.status(501).json({
      error:"no se pudo cambiar la clave"
    })
   }
})


export default router;