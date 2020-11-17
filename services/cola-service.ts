import { Escritorio } from "../interfaces/escritorio";
import { Ticket } from "../interfaces/ticket";

export default class ColaService{  
    private cola: Ticket[];    
    private numTicket: number; 
    private escritorio: Escritorio; 

    constructor(escritorio: Escritorio) {
        this.cola = [];        
        this.numTicket = 0;
        this.escritorio=escritorio;
    }

    dameEscritorio(): Escritorio{
        return this.escritorio;
    }

    generaTicket() : Ticket{
        let texto= this.escritorio.nombre.substring(0, 2).toUpperCase();
        let num = (++this.numTicket).toString();
        var ticket: string = "";
        for (let i = num.length; i < 3; i++) {
            ticket += "0";
        }
        let newTicket = {id:texto+"-" + ticket + num, escritorio:this.escritorio.id};

        if(newTicket) this.agregarAcola(newTicket);

        return newTicket;
    }

    agregarAcola(ticket: Ticket): void {
        this.cola.push(ticket);
    }

    dameCola() : Ticket[]{
        return this.cola;
    }

    quitarCola() {        
        return this.cola.shift(); 
    }
}