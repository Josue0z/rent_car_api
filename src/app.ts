import { PrismaClient } from '../prisma/client'
import express from 'express'
import { join } from 'path'
import usuariosRouter from './routers/usuarios'
import autosRouter from './routers/autos'
import reservasRouter from './routers/reservas'
import imagenesRouter from './routers/imagenes'
import provinciasRouter from './routers/provincias'
import ciudadesRouter  from './routers/ciudades'
import paisesRouter from './routers/paises'
import coloresRouter from './routers/colores'
import marcasRouter from './routers/marcas'
import modelosRouter from './routers/modelos'
import clienteDirRouter from './routers/clientedir'
import bancosRouter from './routers/bancos'
import valoracionesRouter from './routers/valoraciones'
import usuarioTipoRouter from './routers/usuariotipo'
import bancoCuentaTipoRouter from './routers/bancoCuentaTipo'
import tarjetasRouter from './routers/tarjetas'
import pagosRouter from './routers/pagos'
import clientesRouter from './routers/clientes'
import documentosRouter from './routers/documentos';
import verificacionesRouter from './routers/verificaciones';
import modelosVersiones from './routers/modelos.versiones';
import combustiblesRouter from './routers/combustibles';
import transmisionesRouter from './routers/transmisiones';
import depositosRouter from './routers/depositos';
import beneficiariosRouter from './routers/beneficiarios';

export const app = express()
export const prisma  = new PrismaClient();




app.use(express.json({ limit: '50mb' }));



app.get('/politicas-de-privacidad', (req, res) => {
  res.sendFile(join(__dirname, '../', 'politicas.html'))
})

/*app.all('*', (req, res, next) => {
  var key = req.headers['key'];
  if (key == process.env.KEY) {
    next();
  }
  else {
    res.status(401).json({
      error: 'NO AUTORIZADO'
    })
  }
})*/

app.get('/', (req, res) => {
  res.send('OK')
})

app.get('/home',(req,res) =>{
  res.send('HOME')
})




app.use('/api/usuarios', usuariosRouter)
app.use('/api/autos',autosRouter)
app.use('/api/reservas',reservasRouter)
app.use('/api/imagenes',imagenesRouter)
app.use('/api/provincias',provinciasRouter)
app.use('/api/ciudades',ciudadesRouter)
app.use('/api/paises',paisesRouter)
app.use('/api/colores',coloresRouter)
app.use('/api/marcas',marcasRouter)
app.use('/api/modelos',modelosRouter)
app.use('/api/modelos-versiones',modelosVersiones)
app.use('/api/clientesdirecciones',clienteDirRouter)
app.use('/api/bancos',bancosRouter)
app.use('/api/valoraciones',valoracionesRouter)
app.use('/api/usuarioTipo',usuarioTipoRouter)
app.use('/api/bancoCuentaTipo',bancoCuentaTipoRouter)
app.use('/api/tarjetas',tarjetasRouter)
app.use('/api/pagos',pagosRouter)
app.use('/api/clientes',clientesRouter)
app.use('/api/documentos',documentosRouter)
app.use('/api/verificaciones',verificacionesRouter)
app.use('/api/combustibles',combustiblesRouter)
app.use('/api/transmisiones',transmisionesRouter)
app.use('/api/depositos',depositosRouter)
app.use('/api/beneficiarios',beneficiariosRouter)


