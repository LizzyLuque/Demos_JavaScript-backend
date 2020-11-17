import { Request, Response, NextFunction } from 'express';
import { SEED_AUTENTICACION } from '../config/enviroment';
const jwt = require('jsonwebtoken');

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        // verificamos el token
        jwt.verify(token, SEED_AUTENTICACION, (err: any, user: any) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    // Se lanza error de sesión caduca
                    return res.status(200).json({
                        ok: false,
                        loguot: true,
                        message: "Su sesión expiró, introduzca sus credenciales nuevamente para continuar"
                    });
                } else {
                    //Si ocurre algun otro error con el token
                    return res.status(200).json({
                        ok: false,
                        loguot: true,
                        message: "Para continuar, introduzca sus credenciales"
                    });
                }
            }
            // Si necesitamos hacer algo con el usuario seria aca            
            next(); // pasamos el control 
        });
    } else {
        res.sendStatus(401); // no esta el header authorization 
    }
};


