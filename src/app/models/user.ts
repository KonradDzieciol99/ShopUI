export interface User {
    name?: string;
    token: string;
    surName?: string;
    roles: string[];
    email: string;
    phoneNumber?:string;
}