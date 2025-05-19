
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UsuariosScalarFieldEnum = {
  usuarioId: 'usuarioId',
  usuarioLogin: 'usuarioLogin',
  usuarioClave: 'usuarioClave',
  fhCreacion: 'fhCreacion',
  usuarioPerfil: 'usuarioPerfil',
  clienteId: 'clienteId',
  beneficiarioId: 'beneficiarioId',
  usuarioEstatus: 'usuarioEstatus',
  usuarioTipo: 'usuarioTipo',
  manejadorId: 'manejadorId',
  cambioClave: 'cambioClave'
};

exports.Prisma.UsuarioEstatusScalarFieldEnum = {
  usuarioEstatus: 'usuarioEstatus',
  usuarioEstatusNombre: 'usuarioEstatusNombre'
};

exports.Prisma.ClientesScalarFieldEnum = {
  clienteId: 'clienteId',
  clienteIdentificacion: 'clienteIdentificacion',
  clienteNombre: 'clienteNombre',
  fhCreacion: 'fhCreacion',
  clienteTelefono1: 'clienteTelefono1',
  clienteTelefono2: 'clienteTelefono2',
  clientedirId: 'clientedirId',
  clienteCorreo: 'clienteCorreo'
};

exports.Prisma.BeneficiariosScalarFieldEnum = {
  beneficiarioId: 'beneficiarioId',
  beneficiarioNombre: 'beneficiarioNombre',
  beneficiarioIdentificacion: 'beneficiarioIdentificacion',
  beneficiarioDireccion: 'beneficiarioDireccion',
  beneficiarioCoorX: 'beneficiarioCoorX',
  beneficiarioCoorY: 'beneficiarioCoorY',
  bancoId: 'bancoId',
  beneficiarioCuentaTipo: 'beneficiarioCuentaTipo',
  beneficiarioCuentaNo: 'beneficiarioCuentaNo',
  beneficiarioFecha: 'beneficiarioFecha',
  beneficiarioCorreo: 'beneficiarioCorreo',
  beneficiarioTelefono: 'beneficiarioTelefono',
  imagenBase64: 'imagenBase64'
};

exports.Prisma.DireccionesScalarFieldEnum = {
  clientedirId: 'clientedirId',
  clientedirNombre: 'clientedirNombre',
  clientedirX: 'clientedirX',
  clientedirY: 'clientedirY',
  clientedirFecha: 'clientedirFecha',
  clienteId: 'clienteId',
  imagenBase64: 'imagenBase64',
  alias: 'alias'
};

exports.Prisma.BancosScalarFieldEnum = {
  bancoId: 'bancoId',
  bancoNombre: 'bancoNombre',
  bancoNota: 'bancoNota',
  fhCreacion: 'fhCreacion'
};

exports.Prisma.ColoresScalarFieldEnum = {
  colorId: 'colorId',
  colorNombre: 'colorNombre',
  colorHexadecimal: 'colorHexadecimal'
};

exports.Prisma.MarcasScalarFieldEnum = {
  marcaId: 'marcaId',
  marcaNombre: 'marcaNombre',
  marcaLogo: 'marcaLogo'
};

exports.Prisma.ModelosScalarFieldEnum = {
  modeloId: 'modeloId',
  modeloNombre: 'modeloNombre',
  marcaId: 'marcaId'
};

exports.Prisma.TarjetasScalarFieldEnum = {
  tarjetaId: 'tarjetaId',
  tarjetaNombre: 'tarjetaNombre',
  tarjetaNumero: 'tarjetaNumero',
  tarjetaCcv: 'tarjetaCcv',
  tarjetaVencimiento: 'tarjetaVencimiento',
  clienteId: 'clienteId'
};

exports.Prisma.TipoAutoScalarFieldEnum = {
  tipoId: 'tipoId',
  tipoNombre: 'tipoNombre'
};

exports.Prisma.SegurosScalarFieldEnum = {
  seguroId: 'seguroId',
  seguroNombre: 'seguroNombre',
  seguroMonto: 'seguroMonto'
};

exports.Prisma.ValoracionesScalarFieldEnum = {
  valorId: 'valorId',
  valorPuntuacion: 'valorPuntuacion',
  valorComentario: 'valorComentario',
  valorFecha: 'valorFecha',
  autoId: 'autoId',
  usuarioId: 'usuarioId'
};

exports.Prisma.AutosScalarFieldEnum = {
  autoId: 'autoId',
  tipoId: 'tipoId',
  marcaId: 'marcaId',
  modeloId: 'modeloId',
  colorId: 'colorId',
  autoAno: 'autoAno',
  autoDescripcion: 'autoDescripcion',
  beneficiarioId: 'beneficiarioId',
  autoFecha: 'autoFecha',
  autoDireccion: 'autoDireccion',
  autoCoorX: 'autoCoorX',
  autoCoorY: 'autoCoorY',
  seguroId: 'seguroId',
  autoKmIncluido: 'autoKmIncluido',
  autoCondiciones: 'autoCondiciones',
  autoNumeroViajes: 'autoNumeroViajes',
  autoNumeroPersonas: 'autoNumeroPersonas',
  autoNumeroPuertas: 'autoNumeroPuertas',
  autoNumeroAsientos: 'autoNumeroAsientos',
  paisId: 'paisId',
  provinciaId: 'provinciaId',
  ciudadId: 'ciudadId',
  autoEstatus: 'autoEstatus',
  valoracion: 'valoracion',
  valoracionAcumulacion: 'valoracionAcumulacion',
  cantidadValoracion: 'cantidadValoracion',
  cantidadMeGustas: 'cantidadMeGustas',
  transmisionId: 'transmisionId',
  modeloVersionId: 'modeloVersionId',
  combustibleId: 'combustibleId',
  precio: 'precio'
};

exports.Prisma.ImagenesScalarFieldEnum = {
  imagenId: 'imagenId',
  imagenNota: 'imagenNota',
  imagenBase64: 'imagenBase64',
  autoId: 'autoId',
  imagenEstatus: 'imagenEstatus',
  fhCreacion: 'fhCreacion',
  imagenArchivo: 'imagenArchivo'
};

exports.Prisma.DocumentosScalarFieldEnum = {
  documentoId: 'documentoId',
  imagenBase64: 'imagenBase64',
  documentoEstatus: 'documentoEstatus',
  documentoTipo: 'documentoTipo',
  fhCreacion: 'fhCreacion',
  usuarioId: 'usuarioId',
  imagenArchivo: 'imagenArchivo',
  documentoFormatoId: 'documentoFormatoId'
};

exports.Prisma.TipoDocumentoScalarFieldEnum = {
  documentoTipo: 'documentoTipo',
  name: 'name'
};

exports.Prisma.DocumentoEstatusScalarFieldEnum = {
  id: 'id',
  documentoEstatusNombre: 'documentoEstatusNombre'
};

exports.Prisma.ProvinciasScalarFieldEnum = {
  provinciaId: 'provinciaId',
  provinciaNombre: 'provinciaNombre',
  paisId: 'paisId'
};

exports.Prisma.CiudadesScalarFieldEnum = {
  ciudadId: 'ciudadId',
  ciudadNombre: 'ciudadNombre',
  paisId: 'paisId',
  provinciaId: 'provinciaId'
};

exports.Prisma.PaisesScalarFieldEnum = {
  paisId: 'paisId',
  paisNombre: 'paisNombre'
};

exports.Prisma.ReservasScalarFieldEnum = {
  reservaId: 'reservaId',
  clienteId: 'clienteId',
  beneficiarioId: 'beneficiarioId',
  reservaFhInicial: 'reservaFhInicial',
  reservaFhFinal: 'reservaFhFinal',
  reservaRecogidaX: 'reservaRecogidaX',
  reservaRecogidaY: 'reservaRecogidaY',
  reservaRecogidaDireccion: 'reservaRecogidaDireccion',
  reservaEntregaX: 'reservaEntregaX',
  reservaEntregaY: 'reservaEntregaY',
  reservaEntregaDireccion: 'reservaEntregaDireccion',
  reservaMontoxDias: 'reservaMontoxDias',
  reservaMonto: 'reservaMonto',
  reservaAbono: 'reservaAbono',
  reservaNotaCliente: 'reservaNotaCliente',
  reservaNotaBeneficiario: 'reservaNotaBeneficiario',
  reservaMontoTotal: 'reservaMontoTotal',
  reservaPagado: 'reservaPagado',
  reservaImpuestos: 'reservaImpuestos',
  reservaDescuento: 'reservaDescuento',
  reservaCreado: 'reservaCreado',
  reservaNumero: 'reservaNumero',
  autoId: 'autoId',
  tarjetaId: 'tarjetaId',
  reservaEstatus: 'reservaEstatus',
  tarjetaNumero: 'tarjetaNumero',
  codigoVerificacionEntrega: 'codigoVerificacionEntrega',
  entregaVerificada: 'entregaVerificada'
};

exports.Prisma.ReservaEstatusScalarFieldEnum = {
  reservaEstatus: 'reservaEstatus',
  reservaEstatusNombre: 'reservaEstatusNombre'
};

exports.Prisma.BancoCuentaTipoScalarFieldEnum = {
  bancoCuentaTipoId: 'bancoCuentaTipoId',
  name: 'name'
};

exports.Prisma.AutoEstatusScalarFieldEnum = {
  autoEstatus: 'autoEstatus',
  autoEstatusNombre: 'autoEstatusNombre'
};

exports.Prisma.UsuarioTipoScalarFieldEnum = {
  usuarioTipo: 'usuarioTipo',
  usuarioTipoNombre: 'usuarioTipoNombre'
};

exports.Prisma.PagosScalarFieldEnum = {
  pagoId: 'pagoId',
  reservaId: 'reservaId',
  monto: 'monto',
  fhCreacion: 'fhCreacion'
};

exports.Prisma.AutoTipoTransmisionScalarFieldEnum = {
  transmisionId: 'transmisionId',
  transmisionNombre: 'transmisionNombre',
  fhCreacion: 'fhCreacion'
};

exports.Prisma.AutosMeGustasScalarFieldEnum = {
  megustaId: 'megustaId',
  autoId: 'autoId',
  usuarioId: 'usuarioId',
  fhCreacion: 'fhCreacion'
};

exports.Prisma.VerificacionesScalarFieldEnum = {
  verificacionId: 'verificacionId',
  code: 'code',
  verificado: 'verificado',
  fechaVencimiento: 'fechaVencimiento',
  fhCreacion: 'fhCreacion'
};

exports.Prisma.ManejadoresScalarFieldEnum = {
  manejadorId: 'manejadorId',
  nombreCompleto: 'nombreCompleto',
  telefono: 'telefono',
  correo: 'correo',
  manejadorIdentificacion: 'manejadorIdentificacion',
  fhCreacion: 'fhCreacion'
};

exports.Prisma.ModelosVersionesScalarFieldEnum = {
  versionId: 'versionId',
  versionNombre: 'versionNombre',
  modeloId: 'modeloId'
};

exports.Prisma.CombustiblesScalarFieldEnum = {
  combustibleId: 'combustibleId',
  combustibleNombre: 'combustibleNombre'
};

exports.Prisma.DocumentoFormatoScalarFieldEnum = {
  formatoId: 'formatoId',
  formatoNombre: 'formatoNombre'
};

exports.Prisma.DepositosBeneficiariosScalarFieldEnum = {
  depositoId: 'depositoId',
  beneficiarioId: 'beneficiarioId',
  imagenBase64: 'imagenBase64',
  fhCreacion: 'fhCreacion',
  monto: 'monto'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  Usuarios: 'Usuarios',
  UsuarioEstatus: 'UsuarioEstatus',
  Clientes: 'Clientes',
  Beneficiarios: 'Beneficiarios',
  Direcciones: 'Direcciones',
  Bancos: 'Bancos',
  Colores: 'Colores',
  Marcas: 'Marcas',
  Modelos: 'Modelos',
  Tarjetas: 'Tarjetas',
  TipoAuto: 'TipoAuto',
  Seguros: 'Seguros',
  Valoraciones: 'Valoraciones',
  Autos: 'Autos',
  Imagenes: 'Imagenes',
  Documentos: 'Documentos',
  TipoDocumento: 'TipoDocumento',
  DocumentoEstatus: 'DocumentoEstatus',
  Provincias: 'Provincias',
  Ciudades: 'Ciudades',
  Paises: 'Paises',
  Reservas: 'Reservas',
  ReservaEstatus: 'ReservaEstatus',
  BancoCuentaTipo: 'BancoCuentaTipo',
  AutoEstatus: 'AutoEstatus',
  UsuarioTipo: 'UsuarioTipo',
  Pagos: 'Pagos',
  AutoTipoTransmision: 'AutoTipoTransmision',
  AutosMeGustas: 'AutosMeGustas',
  Verificaciones: 'Verificaciones',
  Manejadores: 'Manejadores',
  ModelosVersiones: 'ModelosVersiones',
  Combustibles: 'Combustibles',
  DocumentoFormato: 'DocumentoFormato',
  DepositosBeneficiarios: 'DepositosBeneficiarios'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
