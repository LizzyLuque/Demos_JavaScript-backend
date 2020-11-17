import { User } from "../models/user";

export default class UserService{  // Gestión de los usuarios del Chat
    private static _instance: UserService;  
    private lista: User[];

    private constructor(){
        this.lista=[];
    }

    public static get instance(){
        return this._instance || (this._instance=new this());
    }    

     ///agregar usuario
    public agregar (usuario:User){
        this.lista.push(usuario);
        return usuario;
    }

     ///actualizar nombre de un usuario
    public actualizarNombre(_id:string, user:User){
        for(let usr of this.lista){
            if(usr._id==_id){
                usr.nombre=user.nombre;
                usr.color=user.color;
                usr.sala=user.sala;
                break;
            }
        }

    }


    ///obtener lista de usuarios
    public getLista(){
        return this.lista.filter(usr=>usr.nombre!=='usuario-anónimo');
    }

     ///obtener un usuario
    public getUsuario(id:string){
        return this.lista.find(usuario=>usuario._id===id);
    }

     ///obtener lista de usuarios en sala
    public getUsuariosEnSala(sala:string){
        return this.lista.filter(usuario=>usuario.sala===sala);
    }

    /// borra un usuario
    public borrarUsuario(id:string){
        const tempUsr = this.getUsuario(id);
        this.lista= this.lista.filter(usr=>usr._id!==id);
        return tempUsr;
    }
}