import { Marker } from "../interfaces/marker";

export class MapService {
  private static _instance: MapService;  
  private marcadores: Marker[];

  private  constructor() {
    let id = Math.floor(Math.random() * 9999999);
    this.marcadores = [{
      id: (id * Math.round(Math.random() * 9999999)).toString(),
      nombre: 'Fernando',
      lng: -122.4043474074707,
      lat: 37.78454333264889,
      color: '#dd8fee'
    },
    {
      id: (id * Math.round(Math.random() * 9999999)).toString(),
      nombre: 'Amy',
      lng: -122.45430086816405,
      lat: 37.77640283584961,
      color: '#790af0'
    },
    {
      id: (id * Math.round(Math.random() * 9999999)).toString(),
      nombre: 'Orlando',
      lng: -122.41741783287351,
      lat: 37.7501479648582,
      color: '#19884b'
    }];
  }

  public static get instance(){
    return this._instance || (this._instance=new this());
  }   

  getMarcadores() {
    return this.marcadores;
  }

  borrarMarcador(id: string) {
    let index = this.marcadores.findIndex(x => x.id === id);
    this.marcadores.splice(index,1);
  }

  moverMarcador(marcador: Marker) {

    let index = this.marcadores.findIndex(x => x.id === marcador.id);
    if (index != -1) {
      this.marcadores[index].lng = marcador.lng;
      this.marcadores[index].lat = marcador.lat;
    }
  }

  agregarMarcador(marcador: Marker) {
    this.marcadores.push(marcador);
  }
}