import User from '../models/userModel';
import { IUser } from '../models/userModel';
import validator from 'validator';

class UserService{
    public async get_users(){
        try{
            return await User.find().exec()
        }
        catch (error:any){
            throw new Error(`Error fetching users: ${error.message}`);
        }
    }
    public async find_by_id(id: string){
        try {
            return await User.findById(id).exec()
        }catch (error:any) {
            throw new Error(`Error fetching user by id: ${error.message}`)
        }
    }
    public async create_new_user(userData: IUser) {
        try {
            const newUser = new User(userData);
            return await newUser.save();
        } catch (error: any) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    }
    public async update_user(id: string, userData: Partial<IUser>) {
        if (userData.email && !validator.isEmail(userData.email)) {
            throw new Error('Invalid email address');
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true }).exec();
            if (!updatedUser) {
                throw new Error('User not found');
            }
            return updatedUser;
        } catch (error: any) {
            throw new Error(`Error updating user: ${error.message}`);
        }
    }

    public async delete_user(id: string) {
        try {
            const deletedUser = await User.findByIdAndDelete(id).exec();
            if (!deletedUser) {
                throw new Error('User not found');
            }
        return deletedUser;
        } catch (error: any) {
            throw new Error(`Error deleting user: ${error.message}`);
        }
    }
    public async find_by_email(email: string): Promise<IUser | null> {
        try {
            return await User.findOne({ email }).exec();
        } catch (error: any) {
            throw new Error(`Error finding user by email: ${error.message}`);
        }
    }
}

export default UserService
