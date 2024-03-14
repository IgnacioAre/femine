import { Component, Input, OnInit } from '@angular/core';
import { Configuracion } from 'src/app/models/configuracion';
import { Router } from '@angular/router';
import { userToken } from 'src/app/models/userLogin';
import { AuthService } from 'src/app/services/auth.service';

declare const $: any;
declare const AOS: any;
declare const Swal: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public config:any = Configuracion;
  public user: userToken;
  public document: string | null = '';
  public saved: boolean = false;
  public inputPassword = true;

  constructor(private _router: Router, private authService: AuthService){

    let userJson = JSON.parse(this.authService.getUser());
    
    if(this.config.userSave){
      this.document = userJson.document;
      this.saved = true;
    }

    this.user = new userToken(this.document,'',this.saved);
  }

  ngOnInit(): void {

    $(document).ready(()=>{

      setTimeout(() => {

        AOS.init();

      }, 120);

    });

    if(this.config.userToken != ''){
      this._router.navigate(['/inicio']);
    }
    
  }

  public iniciarSesion(){
    if(!$('#botonLogin').hasClass('buttonDisabled')){

      let save = false;

      if(this.user.saveUser){
        save = true;
      }

      let res = this.authService.login(this.user.document.toString(),this.user.password.toString(), save);

      let complete_name = this.config.userName;
    
      let name_split = [];
      let name_capitalize = '';


      if(complete_name.indexOf(' ') > -1){
        name_split = complete_name.split(' ');

        name_split.forEach((n:any) => {
            name_capitalize += n[0].toUpperCase() + n.slice(1).toLowerCase() + ' ';
        });

      }else{
        name_capitalize += complete_name[0].toUpperCase() + complete_name.slice(1).toLowerCase();
      }

      if(res.status === 200){
        this._router.navigate(['/inicio']);

        if(this.config.userRol === 'ADMIN'){
          Swal.fire({
            title: "¡Has iniciado sesión como administrador!",
            text: "Bienvenido " + name_capitalize,
            icon: 'info'
          });
        }

      }else if(res['status'] === 202){
        Swal.fire({
          title: "Error",
          text: res['msg'],
          icon: 'error'
        });
      }else{
        Swal.fire({
          title: "Error",
          text: "Ha ocurrido un error y no has podido actualizar al usuario.",
          icon: 'error'
        });
      }

    }
  }

  public cerrarSesion(){
    this.authService.logout();
    this._router.navigate(['/inicio']);
  }
  
}
