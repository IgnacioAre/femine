import { Component } from '@angular/core';
import { Configuracion } from 'src/app/models/configuracion';
import { AuthService } from 'src/app/services/auth.service';
import * as htmlToImage from 'html-to-image';
import Swal from 'sweetalert2';

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
  public name_capitalize: string = '';
  public window_width:any = 0;

  constructor(private authService: AuthService){

    this.window_width = $(window).width();

    this.client = JSON.parse(authService.getUser());

    let name_split = [];

    if(this.client.name.indexOf(' ') > -1){
       name_split = this.client.name.split(' ');

       name_split.forEach((n:any) => {
          this.name_capitalize += n[0].toUpperCase() + n.slice(1).toLowerCase() + ' ';
       });

    }else{
      this.name_capitalize += this.client.name[0].toUpperCase() + this.client.name.slice(1).toLowerCase();
    }

    console.log(this.client);
    
    this.cards = this.authService.getUserCardsList(this.client.id); 
    console.log(this.cards);
    this.count_cards = this.cards.length;
    
    if(this.cards.length > 0){
      for (let index = 0; index < this.cards.length; index++) {
        const element = this.cards[index];
        this.number_stars[index] = Array(this.cards[index].stars).fill(0).map((x,i)=>i);
      }
    }
    
  }

  downloadImage(id: number){

    $('#download_card_'+id).fadeOut('fast');
    
    setTimeout(() => {
      
      var node:any = document.getElementById('card_'+id);

      htmlToImage.toPng(node)
        .then(function (dataUrl) {        
          var link = document.createElement("a");

          document.body.appendChild(link);

          link.setAttribute("href", dataUrl);
          link.setAttribute("download", "Tarjeta-Femine.png");
          link.click();

        })
        .catch(function (error) {

          Swal.fire({
            title: "Error",
            text: "Ha ocurrido un error y no se ha podido descargar el archivo.",
            icon: 'error'
          });
          console.error('oops, ocurrió un error.', error);

        });

        setTimeout(() => {
          $('#download_card_'+id).fadeIn();
        }, 500);


    }, 500);
    
  }


}
