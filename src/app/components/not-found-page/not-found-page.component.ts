import { Component } from '@angular/core';
import { Configuracion } from 'src/app/models/configuracion';

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.scss']
})
export class NotFoundPageComponent {

  public config:any = Configuracion;

}
