import { Component, OnInit } from '@angular/core';
import { Configuracion } from './models/configuracion';
import { AuthService } from './services/auth.service';

declare const $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  
  public showFiller = false;
  public config: any;
  private linkInicio: any;
  private linkAdmin: any;
  private linkTarjeta: any;

  constructor(private authService: AuthService){
    this.config = Configuracion;
  }

  ngOnInit(): void {

    //Comprobacion de token y validación
    
    if(this.authService.getToken() != null){
      let valid: any = this.authService.getUserByToken(this.authService.getToken());      
      
      if(valid != null){
        this.config.userToken = this.authService.getToken();
        this.config.userDocument = valid.document;
        this.config.userName = valid.name;
        this.config.userRol = valid.rol;
      }

    }

    if(this.authService.getSave() == 'true'){
      this.config.userSave = true;
    }

  }

  changeMenu(menu:any){

    if(this.showFiller){
      this.showFiller = false;
    }else{
      this.showFiller = true;
    }

    menu.toggle();

  }

  cerrarSesion(){

    this.authService.logout();

  }
  
}
