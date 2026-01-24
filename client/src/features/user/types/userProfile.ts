export type myProfile = {
    fileName?:string,
    username?:string,
    lastName?:string,
    avatar?:string,
    description?:string,
}
export type getProfile = {
    firstName?:string,
    username:string,
    lastName?:string,
    avatar?:string,
    description?:string,
    email:string
}