import {Router} from 'express'

const router = Router()

router.get('/create-order', (req, res) => res.send('creating order'))

router.get('/seccess', (req, res) => res.send('creanting order'))

router.get('/webhook', (req, res) => res.send('webhook'))

export default router