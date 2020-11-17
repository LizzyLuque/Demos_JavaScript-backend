import { MapService } from '../services/map-service';
import { Request, Response } from 'express';

export default class MapController{
    private mapa= MapService.instance;

    constructor() { }

    getMapa(req: Request, res: Response){
        res.json(this.mapa.getMarcadores());
    }
}