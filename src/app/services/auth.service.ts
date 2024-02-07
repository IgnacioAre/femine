import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Configuracion } from '../models/configuracion';
import { apiUrl } from '../models/configuracion';
declare const $: any;

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private config:any = Configuracion;

    constructor(
        private storageService: StorageService
    ) {

    }


    login(document: string, password: string, save: boolean): any {
        
        let response = '';

        $.ajax({
            url: apiUrl + 'user-login',
            method: 'POST',
            async: false,
            data: {
                document: document,
                password: password,
            },
            dataType: 'JSON',
            success: (res:string, textStatus: string, jqXHR: any) => {

                response = jqXHR;

                if(jqXHR.status === 200){

                    this.storageService.setToken(res);
                    let user: any = this.getUserByToken(res);
                    this.storageService.setUser(user);
                    
                    if(save){
                        this.config.userDocument = document;
                        this.config.userName = user.name;
                        this.config.userRol = user.rol;
                        this.config.userSave = true;
                        this.setSave('true');
                    }else{
                        this.setSave('false');
                        this.config.userDocument = '';
                        this.config.userName = '';
                        this.config.userRol = '';
                        this.config.userSave = false;
                    }

                }
                
            },
            error: (jqXHR:any, textStatus:any)=>{
                console.log('Error en la consulta: '+textStatus);
                response = 'Error';
            }
        });

        return response;
    }

    register(name: string,subname: string,document: string,password: string): any {
        
        let response = '';

        $.ajax({
            url: apiUrl + 'user-register',
            method: 'POST',
            async: false,
            data: {
                name: name,
                subname: subname,
                document: document,
                password: password
            },
            dataType: 'JSON',
            success: (res:any) => {
                response = res;
            },
            error: (jqXHR:any, textStatus:any)=>{
                console.log('Error en la consulta: '+textStatus);
                response = 'Error';
            }
        });

        return response;

    }

    updateUser(id: number,name: string,subname: string): any {

        let response = '';

        $.ajax({
            url: apiUrl + 'user-update',
            method: 'POST',
            async: false,
            data: {
                id: id,
                name: name,
                subname: subname
            },
            dataType: 'JSON',
            success: (res:any) => {
                response = res;
            },
            error: (jqXHR:any, textStatus:any)=>{
                console.log('Error en la consulta: '+textStatus);
                response = 'Error';
            }
        });

        return response;

    }


    getUserByToken(token: string | null){
        
        let response: object = [];
        
        $.ajax({
            url: apiUrl + 'get-user',
            method: 'POST',
            async: false,
            data: {
                token: token
            },
            dataType: 'JSON',
            success: (res:any, textStatus: string, jqXHR: any) => {

                response = [];

                if(jqXHR.status === 200){    

                    this.storageService.setUser(res);
                        
                    response = res;
                    
                }
                
            },
            error: (jqXHR:any, textStatus:any)=>{
                console.log('Error en la consulta: '+textStatus);
                response = [];
            }
        });
        
        return response;

    }

    logout(): void {
        this.storageService.remove();
    }

    getToken(): string | null{
        let token = this.storageService.getToken();
        
        if (token) {
            this.config.userToken = token;
        } else {
            this.config.userToken = '';
        }

        return token;
    }

    getUser() {        
        return this.storageService.getUser();
    }

    getUsersList() {        
        
        let response: object = [];
        
        $.ajax({
            url: apiUrl + 'get-users-list',
            method: 'GET',
            async: false,
            dataType: 'JSON',
            success: (res:any, textStatus: string, jqXHR: any) => {

                response = [];

                if(jqXHR.status === 200){    
                        
                    response = res;
                    
                }
                
            },
            error: (jqXHR:any, textStatus:any)=>{
                console.log('Error en la consulta: '+textStatus);
                response = [];
            }
        });
        
        return response;

    }

    setColors(colors: string){
        this.storageService.setColors(colors);
    }

    getColors(): string | null{
        return this.storageService.getColor();
    }

    setSave(value: string){
        this.storageService.setSave(value);
    }

    getSave(){
        return this.storageService.getSave();
    }

    //Métodos para validar CI

    validation_digit(ci:any){
        var a = 0;
        var i = 0;
        if(ci.length <= 6){
          for(i = ci.length; i < 7; i++){
            ci = '0' + ci;
          }
        }
        for(i = 0; i < 7; i++){
          a += (parseInt("2987634"[i]) * parseInt(ci[i])) % 10;
        }
        if(a%10 === 0){
          return 0;
        }else{
          return 10 - a % 10;
        }
      }
      
      validate_ci(ci:any){
        ci = this.clean_ci(ci);
        var dig = ci[ci.length - 1];
        ci = ci.replace(/[0-9]$/, '');
        return (dig == this.validation_digit(ci));
      }
      
      clean_ci(ci:any){
        return ci.replace(/\D/g, '');
      }

}