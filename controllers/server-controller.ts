import express from 'express';
import {DB_DATABASE, DB_HOST, DB_PORT, SERVER_PORT} from '../config/enviroment';
import socketIO from 'socket.io';
import http from 'http';
import mongoose from 'mongoose';

import * as socket from '../sockets/socket';

export default class Server{  //Singleton
    private static _instance: Server;  

    public app:express.Application;
    public port:number;
    public io:socketIO.Server;         // servior de sockets
    private httpServer: http.Server;   //intermediario entre extress y socket.io

    private constructor(){
        this.app=express();
        this.port=SERVER_PORT;
        this.httpServer = new http.Server(this.app);
        this.io=socketIO(this.httpServer);
        this.escucharSockets();
    }

    public static get instance(){
        return this._instance || (this._instance=new this());
    }

    private escucharSockets(){
        console.log('Escuchando conexiones - sockets');
        this.io.on('connection', cliente=>{

            // Conectar usuario
            socket.conectarCliente(cliente,this.io);

            // Configurar usuario
            socket.configurarUsuario(cliente,this.io);  
            
            //obtener usuarios activos
            socket.dameListaUsuarios(cliente,this.io);

            //Mensajes
            socket.mensaje(cliente,this.io);

            // Desconectar
            socket.desconectar(cliente,this.io);


            ////////// sockets para  mapa ////////
            /// nuevo marcador
            socket.mapaSockets(cliente,this.io);


            ////////// sockets para  colas ////////
            socket.colasSockets(cliente,this.io);            

        });
    }

    start( callback:() =>any ) {
        mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`,{
             useNewUrlParser: true, 
             useCreateIndex:true, 
             useUnifiedTopology: true
             })
        .then(() => {
             console.log("Conexión a la base de datos establecida satisfactoriamente...");
             this.httpServer.listen( this.port, callback );
        })
        .catch((err:any) => console.log(err));
    }
}