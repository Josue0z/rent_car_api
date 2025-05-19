
import { Router } from 'express'
import { prisma } from '../app';

const router = Router()

/*router.get('/todos', async (req, res) => {
  try {
    let precios = await prisma.precios.findMany({});
    res.json(precios)
  } catch (error) {
    res.status(501).json(error)
  }
})

router.post('/crear', async (req, res) => {
  const { precioNombre, precioCliente, precioBeneficiario } = req.body;
  try {
    let precio = await prisma.precios.create({
      data: {
        precioNombre,
        precioCliente,
        precioBeneficiario

      }
    });
    res.json(precio)
  } catch (error) {
    res.status(501).json(error)
  }
})

router.put('/modificar/:id', async (req, res) => {
  const {id} = req.params;
  const { precioNombre, precioCliente, precioBeneficiario } = req.body;
  try {
    let precio = await prisma.precios.update({
      where:{
        precioId:Number(id)
      },
      data: {
        precioNombre,
        precioCliente,
        precioBeneficiario

      }
    });
    res.json(precio)
  } catch (error) {
    res.status(501).json(error)
  }
})
*/

//export default router