import { Request, response, Response } from 'express';
import  UserService  from '../services/userService';
import { IUser } from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class UserController{
    private userService: UserService

    constructor(){
        this.userService = new UserService()
    }

    public async get_all_users(request: Request, response: Response){
        try {
            const users = await this.userService.get_users()
            return response.status(200).json(users)
        } catch (error: any) {
            return response.status(400).json({'error': error})
        }
    }

    public async create_new_user(request: Request, response: Response) {
        try {
            const { name, email, password, role } = request.body;
            const userData:any = { name, email, password, role };
            const user = await this.userService.create_new_user(userData);

            return response.status(201).json(user);
        } catch (error: any) {
            if (error.name === 'ValidationError') {
                return response.status(400).json({ message: error.message });
            } else if (error.code === 11000) {
                return response.status(400).json({ message: 'Email already exists' });
            } else {
                return response.status(500).json({ message: error.message });
            }
        }
    }

    public async update_user(request: Request, response: Response) {
        try {
            const { id } = request.params;
            const { name, email, password, role } = request.body;
            const userData: Partial<IUser> = { name, email, password, role };
        
            const updatedUser = await this.userService.update_user(id, userData);
            return response.status(200).json(updatedUser);
        } catch (error: any) {
            return response.status(500).json({ message: error.message });
        }
    }

    public async delete_user(request: Request, response: Response) {
        try {
            const { id } = request.params;
            const deletedUser = await this.userService.delete_user(id);
            return response.status(200).json(deletedUser);
        } catch (error: any) {
            return response.status(500).json({ message: error.message });
        }
    }

    public async login(request:Request, response:Response){
        try{
            const {email, password} = request.body
            const user = await this.userService.find_by_email(email)

            if (!user){
                return response.status(400).json({message: 'Invalid credential'})
            }

            const user_find = await bcrypt.compare(password, user.password)

            if(!user_find){
                return response.status(401).json({ message: 'Invalid credentials' });
            }
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
            return response.status(200).json({ token });
        }
        catch(error: any){
            return response.status(500).json({ message: error.message });
        }
    }
}