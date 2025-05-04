


import { Router } from 'express'
import { prisma } from '../app';


const router = Router()

router.get('/todos',async(req,res) =>{
    try{
       let combustibles =  await prisma.combustibles.findMany({});
       res.json(combustibles)
    }catch(error){
        res.status(501).json({error})
    }
})

router.post('/crear',async(req,res) =>{
    try{
        const {combustibleNombre} = req.body;
       let combustible =  await prisma.combustibles.create({
        data: {
            combustibleNombre
        }
       });
       res.json(combustible)
    }catch(error){
        res.status(501).json({error})
    }
})

router.put('/modificar/:id',async(req,res) =>{
    try{
        const {id} = req.params;
        const {combustibleNombre} = req.body;
       let combustible =  await prisma.combustibles.update({
        where:{
            combustibleId:Number(id)
        },
        data: {
            combustibleNombre
        }
       });
       res.json(combustible)
    }catch(error){
        res.status(501).json({error})
    }
})

export default router