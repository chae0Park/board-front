export interface User {
    id: string;
    email: string;
    password: string;
    nickname: string;
    telNumber: string;
    address: string;
    addressDetail?: string;
    profileImage?: string;
  }


export interface RegisterFormValues {
    id?: string; 
    email: string;
    password: string;
    nickname: string;
    telNumber: string;
    address: string;
    addressDetail?: string;
}
