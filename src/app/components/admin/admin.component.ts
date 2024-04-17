import { Component, OnInit } from '@angular/core';
import { Configuracion } from 'src/app/models/configuracion';
import { AuthService } from 'src/app/services/auth.service';

declare const $: any;
declare const AOS: any;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  public config:any = Configuracion;
  public window_width = 0;

  constructor(private authService: AuthService){

    this.window_width = $(window).width();
    
  }

  ngOnInit(): void {
    $(document).ready(()=>{

      setTimeout(() => {

        AOS.init();

      }, 120);

    });
  }

  adminOptionHover(element:any){
    $('#'+element).css('background-color',this.config.backgroundTransparent);
  }

  adminOptionLeave(element:any){
    $('#'+element).css('background-color',this.config.baseColorLight);
  }

}
