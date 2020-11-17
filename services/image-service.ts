import { IMAGE_PATH } from "../config/enviroment";
var Article = require('../models/article');
import fs from 'fs';
import path from 'path';

export default class ImageService {
    // metodo para retornar una imagen mediante nombre de archivo
    getImage(file: string): any {
        //contruye ruta de la imagen
        let file_path = IMAGE_PATH + file;
        let result = true;
        try {
            // se verifica que exista
            var stats = fs.statSync(file_path);
        }
        catch (err) {
            result = false;
            console.log('El archivo ' + file_path + ' no existe ');
        }
        // si nexiste se retorna el archivo
        if (result) return path.resolve(file_path);
        // si no existe se retorna undefined
        else return undefined
    }

    // metodo para borrar una imagen mediante nombre de archivo
    deleteImage(file: string): boolean {
        //contruye ruta de la imagen
        let path_file = IMAGE_PATH + file;
        let result: boolean = true;
        try {
            // se verifica que exista
            var stats = fs.statSync(path_file);
        }
        catch (err) {
            result = false;
            console.log('El archivo ' + path_file + ' no existe ');
        }

        try {
            // se borra el archivo
            fs.unlinkSync(path_file);
        } catch (err) {
            console.error('Error al borrar el archivo: ' + path_file, err);
            result = false;
        }
        // si todo fue ben retornaremos true
        return result;
    }


    async upload(file_path: string, articleId: string) {
        let messageJSON = {};

        // * ADVERTENCIA * EN WINDOWS
        //var file_split = file_path.split('\\');

        // * ADVERTENCIA * EN LINUX O MAC
        var file_split = file_path.split('/');

        // Nombre del archivo
        var file_name: string = file_split[2];

        // Extensión del fichero
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];

        //extensiones permitidas
        const extensions = ['png', 'PNG', 'jpg', 'JPG', 'jpeg', 'JPEG', 'gif', 'GIF'];

        // Comprobar la extension, solo imagenes, si es valida borrar el fichero
        if (!extensions.includes(file_ext)) {            
            try {
                fs.unlinkSync(file_path);
            } catch (err) {
                console.error('Error al borrar el archivo: ' + file_path, err);
            }
            // asignar error de extensión al JSON
            messageJSON = {
                status: 'error',
                message: 'La extensión de la imagen no es válida !!!'
            };
        } else {
            // Si todo es valido, sacando id de la url
            if (articleId) {
                // Buscar el articulo, asignarle el nombre de la imagen y actualizarlo
                try {
                    let articleUpdated= await Article.findOneAndUpdate({ _id: articleId }, { image: file_name }, { new: true }) ;
                    if (articleUpdated) {
                        // asignar respuesta correcta al JSON
                        messageJSON={
                            status: 'success',
                            article: articleUpdated
                        };
                    }else{
                        // asignar error de guadado del nombre de la imagen en el articulo en el JSON
                        messageJSON={
                            status: 'error',
                            message: 'Error al actualizar el articulo con el nombre de la imagen !!!'
                        };
                    }
                } catch (error) {
                    // asignar error de guardado al JSON
                    messageJSON={
                        status: 'error',
                        message: 'Error al guardar la imagen de articulo !!!'
                    };
                }                
            } else {
                // asignar respuesta correcta, pero sin actualizar el artículo al JSON
                messageJSON = {
                    status: 'success',
                    image: file_name
                };
            }
        }
        return messageJSON;
    }

}