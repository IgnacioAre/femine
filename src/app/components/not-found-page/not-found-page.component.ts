import { Component, OnInit } from '@angular/core';
import { Configuracion } from 'src/app/models/configuracion';

declare const $: any;
declare const AOS: any;

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.scss']
})
export class NotFoundPageComponent implements OnInit {

  public config:any = Configuracion;
  public window_width:any = 0;

  constructor(){

    this.window_width = $(window).width();

  }

  ngOnInit(): void {
    $(document).ready(()=>{

      setTimeout(() => {

        AOS.init();

      }, 120);

    });
  }

}
