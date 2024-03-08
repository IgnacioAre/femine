import { Component } from '@angular/core';
import { Configuracion } from 'src/app/models/configuracion';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-tarjetas',
  templateUrl: './tarjetas.component.html',
  styleUrls: ['./tarjetas.component.scss']
})
export class TarjetasComponent {

  public config:any = Configuracion;
  public cards:any = [];
  public count_cards: number = 0;
  public number_stars:any = [];
  public client:any;

  constructor(private authService: AuthService){

    this.client = JSON.parse(authService.getUser());

    this.cards = this.authService.getUserCardsList(this.client.id);
    this.count_cards = this.cards.length;
    
    if(this.cards.length > 0){
      for (let index = 0; index < this.cards.length; index++) {
        const element = this.cards[index];
        this.number_stars[index] = Array(this.cards[index].stars).fill(0).map((x,i)=>i);
      }
    }
    
  }

}
