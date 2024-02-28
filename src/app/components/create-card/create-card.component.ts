import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardCreate } from 'src/app/models/cadCreate';
import { Configuracion } from 'src/app/models/configuracion';
import { AuthService } from 'src/app/services/auth.service';

declare const $: any;
declare const AOS: any;
declare const Swal: any;

@Component({
  selector: 'app-create-card',
  templateUrl: './create-card.component.html',
  styleUrls: ['./create-card.component.scss']
})
export class CreateCardComponent implements OnInit {

  public config:any = Configuracion;
  public card: CardCreate;
  public selectedValue: string = '';
  public cardCreated = false;
  public inputPassword = true;

  constructor(private _router: Router, private authService: AuthService){
    this.card = new CardCreate('','','','');
  }

  ngOnInit(): void {
    
    $(document).ready(()=>{

      setTimeout(() => {

        AOS.init();

      }, 120);

    });

  }


  public create(form: any){

    let title = this.card.title.toString();
    let desc = this.card.desc.toString();
    let duration = this.card.duration;
    let stars = this.card.stars;


    if(!$('#btnCreate').hasClass('buttonDisabled')){
  
      if(duration === 0){
        Swal.fire({
          title: "Error",
          text: 'Los días de duración es obligatorio, intente nuevamente.'
        });
        return;
      }

      if(stars === 0){
        Swal.fire({
          title: "Error",
          text: 'El número de estrellas es obligatorio, intente nuevamente.'
        });
        return;
      }

      let res = this.authService.createCard(title,desc,duration,stars);
      
      if(res['status'] === 200){
        form.resetForm();
        this.cardCreated = true;
      }else if(res['status'] === 202){
        Swal.fire({
          title: "Error",
          text: res['msg']
        });
      }else{
        Swal.fire({
          title: "Error",
          text: "Ha ocurrido un error y no te has podido registrar."
        });

        console.log(res['msg']);

      }
      
    }

  }

}
