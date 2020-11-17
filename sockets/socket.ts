import { Socket } from "socket.io";
import EscritorioService from "../services/escritorio-service";
import { MapService } from "../services/map-service";
import UserService from "../services/user-service";
import { Marker } from "../interfaces/marker";
import { User } from "../models/user";

const usuariosConectados=UserService.instance;
const mapa= MapService.instance;

//

// sockets para colas
export const colasSockets =(cliente:Socket, io: SocketIO.Server)=>{

    //Cuando la pantalla pública inicia, y pide los tickets
    cliente.on( 'tickets', () => {
        const colas = EscritorioService.instance;
        let ticketActual = colas.dameActual();
        let ticketsEnAtencion = colas.dameEnAtencion();

        const payload = {
            ticketActual,
            ticketsEnAtencion
        }
        io.emit( 'ticket-en-turno', payload );
    });

    //El escritorio se conecta para atender
    cliente.on('escritorio',(payload:{escritorio:string})=>{
        const colas = EscritorioService.instance;
        let ticketActual = colas.ticketPorAtender(payload.escritorio);
        //solo retorna el tiket que ya le fue asignado (si hay) 
        if(ticketActual) io.emit('ticket-nuevo',ticketActual);
    });  

  
}


// sockets para mapas 
export const mapaSockets =(cliente:Socket, io: SocketIO.Server)=>{
    cliente.on( 'marcador-nuevo', ( marcador: Marker ) => {
        mapa.agregarMarcador( marcador );
        // con broadcast se emite a todos los clientes, menos a la onexión recien creada
        cliente.broadcast.emit( 'marcador-nuevo', marcador );   
    });

    cliente.on( 'marcador-borrar', ( id: string ) => {
        mapa.borrarMarcador( id );
        cliente.broadcast.emit( 'marcador-borrar', id );
    });

    cliente.on( 'marcador-mover', ( marcador: Marker ) => {
        mapa.moverMarcador( marcador );
        cliente.broadcast.emit( 'marcador-mover', marcador );
    });
}

// crear usuario nuevo
export const conectarCliente =(cliente:Socket, io: SocketIO.Server)=>{
    const usuario = new User(cliente.id);
    usuariosConectados.agregar(usuario);   
}

//borrar usuario desconectado
export const desconectar = (cliente:Socket, io: SocketIO.Server) =>{
    cliente.on('disconnect',()=>{
        let usr=usuariosConectados.borrarUsuario(cliente.id);
        io.emit('usuarios-activos',usuariosConectados.getLista());
    });
}

//escuchar mensajes
export const mensaje=(cliente:Socket, io: SocketIO.Server)=>{
    cliente.on('mensaje',(payload:{de:string, cuerpo:string, color:string, sala:string})=>{
        io.emit('mensaje-nuevo',payload);
    });    
};


//Configurar usuarios
export const configurarUsuario=(cliente:Socket, io: SocketIO.Server)=>{
    cliente.on('configurar-usuario',(payload, callback:({})=>any)=>{
        usuariosConectados.actualizarNombre(cliente.id,payload);
        io.emit('usuarios-activos',usuariosConectados.getLista());         
        callback({
            ok: true,
            mensaje :'Usuario ' +payload.nombre+' configurado',
            idUser:cliente.id
        });
    });    
};

//escuchar solicitud de un cliente para saber que usuarios están conectados
export const dameListaUsuarios=(cliente:Socket, io: SocketIO.Server)=>{
    cliente.on('lista-usuarios',()=>{
        io.in(cliente.id).emit('usuarios-activos',usuariosConectados.getLista()); 
    });    
};