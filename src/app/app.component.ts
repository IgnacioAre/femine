import { Component, OnInit } from '@angular/core';
import { Configuracion } from './models/configuracion';
import { AuthService } from './services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { empty } from 'rxjs';

declare const $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  
  public showFiller = false;
  public config: any;
  public ruta_actual = '';

  constructor(private authService: AuthService,private router: Router){
    this.config = Configuracion;
  }

  ngOnInit(): void {

    //Comprobacion de token y validación
    

    this.config.userSave = this.authService.getSave();
    this.config.userDocument = this.authService.getDocument();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentRoute = event.url;
        this.ruta_actual = currentRoute;
      }
    });
    
    if(this.authService.getToken() != null){
      let valid: any = this.authService.getUserByToken(this.authService.getToken());      
      
      if(valid.typeof === undefined && valid.length === 0){
        this.cerrarSesion();
      }

      if(valid.length > 0 || valid != 'null'){        
        this.config.userToken = this.authService.getToken();
        this.config.userDocument = valid.document;
        this.config.userName = valid.name;
        this.config.userSubname = valid.subname;
        this.config.userRol = valid.rol;
      }

    }

  }

  changeMenu(menu:any,anchor: string = ''){

    if(this.showFiller){
      this.showFiller = false;
    }else{
      this.showFiller = true;
    }

    menu.toggle();

    if(anchor !== ''){

      let block_position = 'center';

      if(anchor === 'containerBeneficios' || anchor === 'containerServicios') block_position = 'start'

      if(this.ruta_actual !== '/inicio') {

        this.router.navigateByUrl('/');

        setTimeout(() => {
          $('#'+anchor).get(0).scrollIntoView({behavior: 'smooth', block: block_position});
        }, 300);

      }else{

        $('#'+anchor).get(0).scrollIntoView({behavior: 'smooth', block: block_position});

      }

    }

  }

  cerrarSesion(){

    this.authService.logout();

  }
  
}
