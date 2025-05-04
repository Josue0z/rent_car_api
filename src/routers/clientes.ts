
import { Router } from 'express'
import { prisma } from '../app';


const router = Router()

router.get('/todos',async(req,res) =>{
     try{
        let clientes = await prisma.clientes.findMany({
            include: {
                direccion: true
            }
        });
        res.json(clientes)
     }catch(error){
        res.status(501).json({
            error
        })
     }
})

router.put('/modificar/:id',async(req,res) =>{
    const {id} = req.params;
    const {clienteNombre, clienteIdentificacion, clienteTelefono1, clienteTelefono2,clienteCorreo} = req.body;
    try{
       let cliente = await prisma.clientes.update({
        where: {
          clienteId: Number(id)
        },
        data: {
         clienteNombre,
         clienteIdentificacion,
         clienteTelefono1,
         clienteTelefono2,
         clienteCorreo
        },
           include: {
               direccion: true
           }
       });
       res.json(cliente)
    }catch(error){
       res.status(501).json({
           error
       })
    }
})

export default router;