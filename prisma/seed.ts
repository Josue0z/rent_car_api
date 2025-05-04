import { PrismaClient } from '../prisma/client'

const prisma = new PrismaClient()

const usuarioEstatus = [
  {
    'id': 1,
    'name': 'PENDIENTE'
  },
  {
    'id': 2,
    'name': 'APROBADO'
  },
  {
    'id': 3,
    'name': 'DECLINADO'
  }
];

const reservaEstatus = [
  {
    'id': 1,
    'name': 'PENDIENTE'
  },
  {
    'id': 2,
    'name': 'ACEPTADA'
  },
  {
    'id': 3,
    'name': 'CERRADA'
  },
  {
    'id': 4,
    'name': 'RECHAZADA'
  }
];

const autoEstatus = [
  {
    id: 1,
    name: 'DISPONIBLE'
  },
  {
    id: 2,
    name: 'NO DISPONIBLE'
  }
];

const marcas = [
  {
    name: 'AUDI'
  },
  {
    name: 'BMW'
  },
  {
    name: 'CHEVROLET'
  }
];

const modelos = [
  {
    name: 'TAHOE',
    marcaId: 3
  }
];

const paises = [
  {
    id: 214,
    name: 'REPUBLICA DOMINICANA'
  }
];

const tipoAutos = [
  {
    name: 'SUV'
  }
];
const imagenEstatus = [
  {
    name: 'EN REVISION'
  },
  {
    name: 'ACTIVA'
  }
];

async function main() {
  console.log(`Start seeding ...`)

  /*for (let estatus of usuarioEstatus) {
    await prisma.usuarioEstatus.create({
      data: {
        usuarioEstatusNombre: estatus.name
      }
    });
  }
*/
 /* for (let estatus of reservaEstatus) {
    await prisma.reservaEstatus.create({
      data: {
        reservaEstatusNombre: estatus.name
      }
    });
  }*/

  /*for (let estatus of autoEstatus) {
    await prisma.autoEstatus.create({
      data: {
        autoEstatusNombre: estatus.name
      }
    });
  }*/

 /* for (let marca of marcas) {
    await prisma.marcas.create({
      data: {
        marcaNombre: marca.name,
        marcaLogo: ''
      }
    });
  }*/

  /*for (let modelo of modelos) {
    await prisma.modelos.create({
      data: {
        modeloNombre: modelo.name,
        marcaId: modelo.marcaId
      }
    });
  }*/

  /*for (let pais of paises) {
    await prisma.paises.create({
      data: {
        paisId: pais.id,
        paisNombre: pais.name
      }
    });
  }*/

  for (let tipo of tipoAutos) {
    await prisma.tipoAuto.create({
      data: {
        tipoNombre: tipo.name
      }
    });
  }

  for (let estatus of imagenEstatus) {
    await prisma.documentoEstatus.create({
      data: {
        documentoEstatusNombre: estatus.name
      }
    });
  }


  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
