import { Request, Response } from 'express';
import Server from './server-controller';
import UserService from '../services/user-service';

export default class ChatController {
    
    constructor() { }

    // metodo para hacer (PING) desde una petición REST
    getMensajes(req: Request, res: Response) {
        res.json({
            ok: true,
            mensaje: 'Todo está bien'
        });
    }

    // metodo para obtener los ids de los usuarios conectados desde una petición REST
    getUsuarios(req: Request, res: Response) {
        const server = Server.instance;
        server.io.clients((err: any, clientes: string[]) => {
            if (err) {
                return res.json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                clientes: clientes
            });

        });

    }

    // metodo para obtener los usuarios conectados desde una petición REST
    getUsuariosDetalle(req: Request, res: Response) {
        const usuariosConectados = UserService.instance;
        res.json({
            ok: true,
            clientes: usuariosConectados.getLista()
        });
    }

    // metodo para enviar mensajes globales desde una petición REST
    postMensajes(req: Request, res: Response) {
        const cuerpo = req.body.cuerpo;
        const de = req.body.de;
        const server = Server.instance;

        const payload = {
            de,
            cuerpo
        }
        if (de !== undefined && cuerpo !== undefined) {
            server.io.emit('mensaje-nuevo', payload);
            res.json({
                ok: true,
                cuerpo,
                de
            });
        } else {
            res.status(400).send({ message: 'Error en los datos.' });
        }
    }


    // método para enviar mensajes privados desde una petición REST
    postMensajePrivado(req: Request, res: Response) {
        const cuerpo = req.body.cuerpo;
        const de = req.body.de;
        const color = req.body.color;
        const id = req.params.id;
        const server = Server.instance;

        const payload = {
            de,
            cuerpo,
            color
        }
        if (de !== undefined && cuerpo !== undefined && id !== undefined) {
            server.io.in(id).emit('mensaje-privado', payload);
            res.json({
                ok: true,
                cuerpo,
                de,
                color,
                id
            });
        } else {
            res.status(400).send({ message: 'Error en los datos.' });
        }
    }
}
