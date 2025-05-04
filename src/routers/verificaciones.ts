


import { Router } from 'express'
import { prisma } from '../app';
import twilio from 'twilio';
import { sendEmail } from '../functions';


const router = Router()


const accountSid = 'AC6045db8c73356ad4c2d041f47f68a0e6'; // Reemplázalo con tu Account SID
const authToken = '5692d11c8e13eee17afa9e035b97cbe3'; // Reemplázalo con tu Auth Token
const client = twilio(accountSid, authToken);
const verifySid = 'VA155c94a883312047341e9f69a2992715';

router.post('/enviar-verificacion-telefono', async (req, res) => {
    const { telefono } = req.body;
    console.log(telefono)
    try {
        const verification = await client.verify.v2.services(verifySid)
            .verifications.create({ to: telefono, channel: 'sms' });

        res.json(verification)
    } catch (error) {
        console.log(error)
        res.status(501).json({ error })
    }
})


router.post('/verificar-codigo-telefono', async (req, res) => {
    const { telefono, code } = req.body;
    console.log(telefono)
    console.log(code)
    try {
        const check = await client.verify.v2.services(verifySid)
            .verificationChecks.create({ to: telefono, code: code });

      
        res.json({
            mensaje: "Codigo valido"
        })
    } catch (error) {

        console.error(`Error al verificar código: ${error}`);
        res.status(501).json({
            error: "Codigo no valido"
        })
    }
})


router.post('/enviar-verificacion', async (req, res) => {
    const { email } = req.body;


    let code = (10000 + Math.random() * 90000).toFixed(0);
    let date = new Date();

    date.setHours(date.getHours() + 2);

    try {

        let verificacion = await prisma.verificaciones.create({
            data: {
                code: code.toString(),
                fechaVencimiento: date
            }
        });

        sendEmail({
            to: email,
            subject: 'CODIGO DE VERIFICACION - CIDECA',
            text: '',
            html: `<h1>Tu codigo de verificacion es: ${code}</h1>`
        });

        res.json(verificacion)
    } catch (error) {
        res.status(501).json({ error })
    }
})


router.post('/verificar-codigo', async (req, res) => {
    const { code } = req.body;

    console.log(code)

    try {

        let verificacion = await prisma.verificaciones.findFirst({
            where: {
                code
            },
        });

        if (!verificacion) {
            res.status(404).json({
                error: "El codigo no es valido"
            })
            return;
        }

        let date = new Date();

        let d1 = date.getTime();
        let d2 = verificacion?.fechaVencimiento.getTime();

        if (d2 && d1 > d2) {
            res.status(201).json({
                error: "El codigo vencio"
            })
            return;
        }

        verificacion = await prisma.verificaciones.update({
            where: {
                verificacionId: verificacion?.verificacionId,
                code
            }, data: {
                verificado: true
            }
        });

        res.json(verificacion)
    } catch (error) {
        res.status(501).json({ error })
    }
})


export default router