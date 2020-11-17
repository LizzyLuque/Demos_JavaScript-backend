import { Request, Response } from 'express';
import validator from 'validator';
import fs from 'fs';
import path from 'path';
import MulterRequest from "../interfaces/MulterRequest";
import ImageService from "../services/image-service";

export default class ImageController {
    private _imgService: ImageService;

    constructor() {
        this._imgService = new ImageService();
    }

    //metodo para recuperar una imagen mediante API rest
    getImage(req: Request, res: Response) {
        let file = req.params.image;
        // solicito la imagen
        let file_to_return = this._imgService.getImage(file);
        //si no existe una imagen
        if (file_to_return === undefined) {
            //respondo con el error
            return res.status(404).send({
                status: 'error',
                message: 'La imagen no existe !!!'
            });
        } else {
            //envio la imagen
            return res.sendFile(file_to_return);
        }
    }

    //metodo para borrar una imagen mediante API rest
    deleteImage(req: Request, res: Response) {
        let file = req.params.image;
        // solicito borrar la imagen
        if (this._imgService.deleteImage(file)) {
            //respondo con success si fue borrada
            return res.status(200).send({
                status: 'success',
                message: 'La imagen fue borrada correctamente!!!'
            });
        } else {
            //respondo con error si no pudo ser borrada
            return res.status(404).send({
                status: 'error',
                message: 'La imagen no existe !!!'
            });
        }
    }

    
    upload(req: Request, res: Response) {
        var file_name = 'Imagen no subida...';
        // si no tenemos el objeto correcto
        if (!(req as MulterRequest).files) {
            //respondemos con error
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }

        // Conseguir nombre y la extensión del archivo
        let file_path = (req as MulterRequest).files.image.path;
        //NOTA: en el fromt el nombre del input debe ser image

        //conseguimos el ID del artículo con el que esta relacionada
        let articleId = req.params.id;

        // invocamos el metodo para cargar y actualizar el artículo relacionado con la imagen
        let result = this._imgService.upload(file_path, articleId);
        
        //respodemos el el resultado
        return res.status(200).send(result);

    }
}