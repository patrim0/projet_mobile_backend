import { User } from "../interfaces/user.interface";
import { database } from "../app";
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
import { ObjectId } from "mongodb";


export class UserService {

    public static async getAllUsers(): Promise<User[]> {
        const users = database.collection<User>("users");
        return users.find().toArray();
    }

    public static async registerNewUser(newUser: User): Promise<void> {
        const users = database.collection<User>("users");
        const hashedPassword = await bcrypt.hash(newUser.password, 10);

        if (await users.findOne({ email: newUser.email })) {
            throw { message: "This email address is already in use", statusCode: 409 };
        }

        if (await users.findOne({ username: newUser.username })) {
            throw { message: "This username is already taken", statusCode: 409 };
        }
        
        await users.insertOne({...newUser, firstName: newUser.firstName || "", lastName: newUser.lastName || "", password: hashedPassword, role: newUser.role || "user" });
    }

    public static async loginUser(username: string, password: string): Promise<string> {
        const users = database.collection<User>("users");
        const user = await users.findOne({ username });
        
        if (!user) {
            throw { message: "Invalid username or password", statusCode: 401 };
        }

        const pwd = await bcrypt.compare(password, user.password);
        if (!pwd) {
            throw { message: "Invalid username or password", statusCode: 401 };
        }
           
        const accessToken = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
        
        return accessToken;
        
    }

    public static async getMe(username: string): Promise<Partial<User>> {
        const users = database.collection<User>("users");
        const user = await users.findOne({ username });
        
        if (!user) {
            throw { message: "User not found", statusCode: 404 };
        }
        
        const { password, ...loggedUser } = user;
        
        return loggedUser;
    }

    public static async editMe(username: string, me: Partial<User> ): Promise<{ user: Partial<User>, accessToken: string }> {
        const users = database.collection<User>("users");

        const user = await users.findOneAndUpdate(
            { username },
            { $set: me },
            { returnDocument: "after" }
        );

        if (!user) {
            throw { message: "User not found", statusCode: 404 };
        }

        const newToken = jwt.sign(
            { username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
        );

        const { password, ...updatedUser } = user;

        return {
            user: updatedUser,
            accessToken: newToken
        };
    }

    public static async getUserById(id: string, role: string): Promise<Partial<User>> {

        if (role !== "admin") {
           throw { message: "Access Forbidden", statusCode: 403}
        }

        if (!ObjectId.isValid(id)) {
            throw { message: "Invalid User ID", statusCode: 400 };
        }

        const users = database.collection<User>("users");
        const user = await users.findOne({ _id: new ObjectId(id) });

        if (!user) {
            throw { message: "User not found", statusCode: 404 };
        }

        const { password, ...returnedUser } = user;

        return returnedUser;
    }
}