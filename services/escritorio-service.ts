import { Escritorio } from "../interfaces/escritorio";
import { Ticket } from "../interfaces/ticket";
import ColaService from "./cola-service";

export default class EscritorioService {
    private static _instance: EscritorioService;
    private enAtencion: Ticket[];
    private colas: ColaService[];
    private escritorios: Escritorio[];
    private actual: Ticket;

    private constructor() {
        this.enAtencion = [];
        this.colas = [];
        this.actual = {id:"", escritorio:""};
        // se podrian traer de BD, por fines practicos, están en código duro
        // se generan los escritorios de atención
        this.escritorios = [
            {id:"1", nombre:"Información"},
            {id:"2", nombre:"Pagos"},
            {id:"3", nombre:"Cobros"},
            {id:"4", nombre:"Quejas"}
        ];
        this.generaColas();
    }

    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    //genera una cola por cada escritorio
    private generaColas() {
        for (let i = 0; i < this.escritorios.length; i++) {
            this.colas.push(new ColaService(this.escritorios[i]));
        }
    }

    //retorna la lista de tickets que están siendo atendidos
    dameEnAtencion() {
        return this.enAtencion;
    }

    //retorna el ticket que actualmente está siendo llamado
    dameActual() {
        return this.actual.id !== "" ? this.actual : undefined;
    }

    //genera un ticket en la cola del escritorio solicitado
    generaTicket(id: string) {
        let index = this.colas.findIndex(x => x.dameEscritorio().id === id);
        return this.colas[index].generaTicket();
    }

    // quita los tickets del escritorio de la lista de atención y de actual
    cerrarTicketsEscritorio(id: string) {        
        if (this.actual.escritorio === id) this.actual = {id:"", escritorio:""};
        else this.enAtencion = this.enAtencion.filter(x => x.escritorio !== id);        
    }

    // retorna el ticket asignado actualmente al escritorio
    ticketPorAtender(id: string) {
        let temp;
        if (this.actual.escritorio === id) temp = this.actual;
        else {
            let index = this.enAtencion.findIndex(x => x.escritorio === id);
            if (index >= 0) temp = this.enAtencion[index];
        }
        return temp
    }

    // verifica si el escritorio tiene o no tickets asignados
    escritorioDisponible(id: string) {
        var status: boolean = true;
        if (this.actual.escritorio !== id) {
            let index = this.enAtencion.findIndex(x => x.escritorio === id);
            if (index >= 0) status = false;
        } else {
            status = false;
        }
        return status;
    }

    // quita el primer elemento de la cola del escritorio (parametro id)
    quitarCola(id: string) {
        // indice de la cola del escritorio solicitado
        let index = this.colas.findIndex(x => x.dameEscritorio().id === id);
        // saca ticket de la cola del escritorio solicitado     
        let ticket = (this.colas[index].quitarCola() as Ticket);
        // si realmente habia un ticket en la cola
        if (ticket) { 
            // si el actual ticket de atención no pertenece al escritorio solicitado
            if (this.actual.escritorio !== id && this.actual.escritorio !== "") {
                //se agrega a la lista de Atención
                this.enAtencion.unshift(this.actual);
            }
            // el ticket se marca como el que actualmente está siendo llamado
            this.actual = ticket
        }
        return ticket;
    }
}