export interface User {
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    role: "user"|"admin";
    favoriteCountries?: any[];
}