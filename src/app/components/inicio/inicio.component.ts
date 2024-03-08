import { Component, OnInit } from '@angular/core';
import { Configuracion } from 'src/app/models/configuracion';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

declare const $: any;
declare const e: any;
declare const AOS: any;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  public config:any = Configuracion;
  public cards:any = [];
  public count_cards: number = 0;
  public number_stars:any = [];

  constructor(private _router:Router, private authService: AuthService){

    this.cards = this.authService.getCardsList();
    this.count_cards = this.cards.length;

    if(this.cards.length > 0){
      for (let index = 0; index < this.cards.length; index++) {
        const element = this.cards[index];
        this.number_stars[index] = Array(this.cards[index].stars).fill(0).map((x,i)=>i);
      }
    }

  }

  ngOnInit(): void {
    
    $(document).ready(()=>{

      if(this._router.url === '/'){
        this._router.navigate(['/inicio']);
      }

      setTimeout(() => {

        AOS.init();

        $('.fotoPortada').click((e:any)=>{

          let element = $(e.target)[0].id;
          let id = element.split('_')[1];

          $('#imgCarouselPortada1').removeClass('active');
          $('#imgCarouselPortada2').removeClass('active');
          $('#imgCarouselPortada3').removeClass('active');

          $('#indicadorPortada1').removeClass('active');
          $('#indicadorPortada2').removeClass('active');
          $('#indicadorPortada3').removeClass('active');

          $('#imgCarouselPortada'+id).addClass('active');
          $('#indicadorPortada'+id).addClass('active');

          $('#carouselPortada').removeClass('d-none');
          $('#carouselPortada').fadeIn('fast');
      });

      $('.carousel').click((e:any)=>{

          let element = $(e.target)[0].id;
        
          if(element === 'carouselPortada' || element === 'imgCarouselPortada1' || element === 'imgCarouselPortada2' || element === 'imgCarouselPortada3'){
              $('#carouselPortada').fadeOut('fast');
          }

      });

      $('.closePortada').click(()=>{
          $('#carouselPortada').fadeOut('fast');
      });

      },120);

      $(document).keydown((event:any)=>{
        if (event.code === 'Escape' || event.keyCode === 27) {
          $('#carouselPortada').fadeOut('fast');
        }
      });

    });
    
  }

}
