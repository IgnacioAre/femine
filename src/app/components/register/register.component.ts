import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Configuracion } from 'src/app/models/configuracion';
import { UserRegister } from 'src/app/models/userRegister';
import { AuthService } from 'src/app/services/auth.service';

declare const $: any;
declare const AOS: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public config:any = Configuracion;
  public user: UserRegister;
  public selectedValue: string = '';
  public clienteCreado = false;
  public inputPassword = true;

  constructor(private _router: Router, private authService: AuthService){
    this.user = new UserRegister('','','','');
  }

  ngOnInit(): void {
    
    $(document).ready(()=>{

      setTimeout(() => {

        AOS.init();

      }, 120);

    });

  }


  public registrarse(form: any){

    let name = this.user.name.toString();
    let subname = this.user.subname.toString();
    let document = this.user.document.toString();
    let password = this.user.password.toString();


    if(!$('#botonRegistrarse').hasClass('buttonDisabled')){

      let ci_validada = this.authService.validate_ci(document);
  
      if(!ci_validada){
        alert('El número de cédula no es válido, intente nuevamente.');
        return;
      }

      let res = this.authService.register(name,subname,document,password);
    
      if(res){
        form.resetForm();
        this.clienteCreado = true;
      }else{
        alert('Ha ocurrido un error y no te has podido registrar.');
        console.log(res);
      }
      
    }

  }


}
