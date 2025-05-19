import { Router } from 'express'
import { prisma } from '../app';


const router = Router()

router.get('/todos',async(req,res) =>{
    try{
       let transmisiones =  await prisma.autoTipoTransmision.findMany({
        orderBy: {
            transmisionNombre:"asc"
        }
       });

       if(transmisiones.length == 0){
        res.status(404).json([])
        return;
       }
       res.json(transmisiones)
    }catch(error){
        res.status(501).json({error})
    }
})

router.post('/crear',async(req,res) =>{
    try{
        const {transmisionNombre} = req.body;
       let transmision =  await prisma.autoTipoTransmision.create({
        data: {
            transmisionNombre
        }
       });

       if(!transmision){
        res.status(409).json({error:"no se pudo crear la transmision"})
        return;
       }
       res.json(transmision)
    }catch(error){
        res.status(501).json({error})
    }
})

router.put('/modificar/:id',async(req,res) =>{
    try{
        const {id} = req.params;
        const {transmisionNombre} = req.body;
       let transmision =  await prisma.autoTipoTransmision.update({
        where:{
            transmisionId:Number(id)
        },
        data: {
            transmisionNombre
        }
       });

       if(!transmision){
        res.status(409).json({error:"no se pudo actualizar la transmision"})
        return;
       }
       res.json(transmision)
    }catch(error){
        res.status(501).json({error})
    }
})

export default router