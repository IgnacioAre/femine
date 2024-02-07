import { Component } from '@angular/core';
import { Configuracion } from 'src/app/models/configuracion';

@Component({
  selector: 'app-tarjetas',
  templateUrl: './tarjetas.component.html',
  styleUrls: ['./tarjetas.component.scss']
})
export class TarjetasComponent {

  public config:any = Configuracion;

}
