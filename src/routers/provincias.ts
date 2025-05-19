
import { Router } from 'express'
import { prisma } from '../app';

const router = Router()



router.get('/todos', async (req, res) => {
   
    try {
        let provincias = await prisma.provincias.findMany({
            include: {
                pais: true
            }
        });

        if(provincias.length == 0){
            res.status(404).json([])
            return;
        }
        res.json(provincias)
    } catch (error) {
        console.log(error)
        res.status(501).json({ error })
    }
})

router.post('/crear', async (req, res) => {
    const { provinciaNombre, paisId } = req.body;
    try {
        let provincia = await prisma.provincias.create({
            data:
            {
                provinciaNombre,
                paisId
            }
        });
        res.json(provincia)
    } catch (error) {
        res.status(501).json({ error })
    }
})

router.put('/modificar/:id', async (req, res) => {
    const { id } = req.params;
    const { provinciaNombre, paisId } = req.body;
    try {
        let provincia = await prisma.provincias.update({
            where: {
                provinciaId: Number(id)
            },
            data:
            {
                provinciaNombre,
                paisId
            }
        });
        res.json(provincia)
    } catch (error) {
        res.status(501).json({ error })
    }
})


export default router;