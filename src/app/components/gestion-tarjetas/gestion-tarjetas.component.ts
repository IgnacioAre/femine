import { Component } from '@angular/core';
import { Configuracion } from 'src/app/models/configuracion';

declare const $: any;
declare const AOS: any;

@Component({
  selector: 'app-gestion-tarjetas',
  templateUrl: './gestion-tarjetas.component.html',
  styleUrls: ['./gestion-tarjetas.component.scss']
})
export class GestionTarjetasComponent {

  public config:any = Configuracion;

  adminOptionHover(element:any){
    $('#'+element).css('background-color',this.config.backgroundTransparent);
  }

  adminOptionLeave(element:any){
    $('#'+element).css('background-color',this.config.baseColorLight);
  }

}
