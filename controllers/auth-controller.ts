import { Request, Response } from 'express';
import { CADUCIDAD_TOKEN, SEED_AUTENTICACION } from '../config/enviroment';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usuario = require("../models/user-login");

export default class AuthController {

    login(req: Request, res: Response) {
        let body = req.body;
        Usuario.findOne({ email: body.email }, (err: any, usuarioStored: any) => {
            if (err) {
                //responder con el error
                return res.status(500).json({
                    ok: false,
                    err: err
                });
            }
            // Verifica que exista un usuario con el email escrita por el usuario.
            if (!usuarioStored) {
               // responder codigo 200 con error que maneja el cliente
                return res.status(200).json({
                    ok: false,
                    message: "Usuario o contraseña incorrectos"
                });
            }
            // Valida que la contraseña escrita por el usuario, sea la almacenada en la db   
            if (!bcrypt.compareSync(body.password, usuarioStored.password)) {
                // responder codigo 200 con error que maneja el cliente
                return res.status(200).json({
                    ok: false,
                    message: "Usuario o contraseña incorrectos"
                });
            }
            // Genera el token de autenticación    
            let token = jwt.sign(
                { usuario: usuarioStored }, // era: usuario: usuarioStored,
                SEED_AUTENTICACION,
                { expiresIn: CADUCIDAD_TOKEN }
            );
            // responder con el usuario almacenado y el token de inicio de sesión
            res.json({
                ok: true,
                usuario: usuarioStored,
                token,
            });
        });
    }

    register(req: Request, res: Response) {
        let body = req.body;
        // recuperar los datos desde el body
        let { nombre, email, password } = body;
        //Crear el objeto a almacenar
        let usuario = new Usuario({
            nombre,
            email,
            password: bcrypt.hashSync(password, 10)
        });
        //Guardar el usuario en la base de datos
        usuario.save((err: any, usuarioStored: any) => {
            if (err) {
                // responder codigo 200 con error que maneja el cliente
                return res.status(200).json({
                    ok: false,
                    err,
                });
            }
            // Genera el token de autenticación    
            let token = jwt.sign(
                { usuario: usuarioStored },
                SEED_AUTENTICACION,
                { expiresIn: CADUCIDAD_TOKEN }
            );
            // responder con el usuario creado correctamente y el token de inicio de sesión
            res.json({
                ok: true,
                usuario: usuarioStored,
                token,
            });
        });
    }
}