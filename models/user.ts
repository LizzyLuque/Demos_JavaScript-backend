//Modelo para los usuarios del chat
export class User{
    public color;
    public nombre: string;
    public sala:string;

    constructor(
        public _id:string
    ){
            this.nombre='usuario-anónimo';
            this.sala="sin-sala";
            this.color="";
    }
}