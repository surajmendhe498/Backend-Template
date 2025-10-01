import { Router } from 'express';
import TicketController from './ticket.controller.js';
import authenticate from '../../middlewares/auth.middleware.js';
// import validate from '../../middlewares/default/validate.js';
// import rateLimiter from '../../middlewares/default/rateLimiter.js';


const router = Router();
const ticketController = new TicketController();

router.post('/', authenticate, ticketController.create);
router.get('/', ticketController.getAll);
router.get("/my-tickets", authenticate, ticketController.fetchUserTickets); 
router.get('/:id', ticketController.getById);
router.put('/:id/status', ticketController.updateStatus);
// router.get("/my-tickets", authenticate, ticketController.fetchUserTickets);  

export default router;
