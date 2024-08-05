import { Router, Request, Response } from 'express';
import { UserController } from '../controllers/userController';

const router = Router();

const userController = new UserController()

router.get('/', (request: Request, response:Response) => {
    userController.get_all_users(request, response)
});

router.post('/', (request: Request, response: Response) => {
    userController.create_new_user(request, response);
});

router.put('/:id', (request: Request, response: Response) => {
    userController.update_user(request, response);
});

router.delete('/:id', (request:Request, response:Response) => {
    userController.delete_user(request, response)
});

router.post('/login', (request:Request, response:Response) =>{
    userController.login(request, response)
});
router.post('/verify', (request:Request, response:Response) =>{
    userController.verifyToken(request, response)
});


export default router;
