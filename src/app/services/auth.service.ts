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
        
        let response:any = [];

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

                response['msg'] = res;
                response['status'] = jqXHR.status;

                if(jqXHR.status === 200){

                    this.storageService.setToken(res);
                    let user: any = this.getUserByToken(res);
                    this.storageService.setUser(user);
                    
                    if(save){
                        this.config.userDocument = document;
                        this.config.userSave = true;
                        this.setSave('true');
                    }else{
                        this.setSave('false');
                        this.config.userDocument = '';
                        this.config.userSave = false;
                    }

                    this.config.userName = user.name;
                    this.config.userRol = user.rol;

                }
                
            },
            error: (jqXHR:any, textStatus:any)=>{
                response['msg'] = 'Error en la consulta: '+textStatus;
                response['status'] = 400;
            }
        });

        return response;
    }

    register(name: string,subname: string,document: string,password: string): any {
        
        let response:any = [];

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
            success: (res:string, textStatus: string, jqXHR: any) => {
                response['msg'] = res;
                response['status'] = jqXHR.status;
            },
            error: (res:any, textStatus:any)=>{
                response['msg'] = 'Error en la consulta: '+textStatus;
                response['status'] = 400;
            }
        });

        return response;

    }

    updateUser(id: number,name: string,subname: string): any {

        let response:any = [];

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
            success: (res:string, textStatus: string, jqXHR: any) => {
                response['msg'] = res;
                response['status'] = jqXHR.status;
            },
            error: (jqXHR:any, textStatus:any)=>{
                response['msg'] = 'Error en la consulta: '+textStatus;
                response['status'] = 400;
            }
        });

        return response;

    }

    changeStateUser(id: number, active: number): any {

        let response:any = [];

        $.ajax({
            url: apiUrl + 'user-change-state',
            method: 'POST',
            async: false,
            data: {
                id: id,
                active: active
            },
            dataType: 'JSON',
            success: (res:string, textStatus: string, jqXHR: any) => {
                response['msg'] = res;
                response['status'] = jqXHR.status;
            },
            error: (jqXHR:any, textStatus:any)=>{
                response['msg'] = 'Error en la consulta: '+textStatus;
                response['status'] = 400;
            }
        });

        return response;


    }


    getUserByToken(token: string | null){
        
        let response: any = [];
        
        $.ajax({
            url: apiUrl + 'get-user',
            method: 'POST',
            async: false,
            data: {
                token: token
            },
            dataType: 'JSON',
            success: (res:any, textStatus: string, jqXHR: any) => {

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
        
        let response: any = [];
        
        $.ajax({
            url: apiUrl + 'get-users-list',
            method: 'GET',
            async: false,
            dataType: 'JSON',
            success: (res:any, textStatus: string, jqXHR: any) => {

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

    getUserById(id: number) {
        
        let response: any = [];
        
        $.ajax({
            url: apiUrl + 'get-user-id',
            method: 'POST',
            data: {
                id: id
            },
            async: false,
            dataType: 'JSON',
            success: (res:string, textStatus: string, jqXHR: any) => {
                response['msg'] = res;
                response['status'] = jqXHR.status;
            },
            error: (jqXHR:any, textStatus:any)=>{
                response['msg'] = 'Error en la consulta: '+textStatus;
                response['status'] = 400;
            }
        });
        
        return response;

    }


    getCardsList() {
        
        let response: any = [];
        
        $.ajax({
            url: apiUrl + 'get-cards-list',
            method: 'GET',
            async: false,
            dataType: 'JSON',
            success: (res:any, textStatus: string, jqXHR: any) => {
                
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

    getCardsUser(client_id: number) {
        
        let response: any = [];
        
        $.ajax({
            url: apiUrl + 'get-cards-users',
            method: 'POST',
            data:{
                client_id: client_id
            },
            async: false,
            dataType: 'JSON',
            success: (res:string, textStatus: string, jqXHR: any) => {
                response['msg'] = res;
                response['status'] = jqXHR.status;
            },
            error: (jqXHR:any, textStatus:any)=>{
                response['msg'] = 'Error en la consulta: '+textStatus;
                response['status'] = 400;
            }
        });
        
        return response;

    }


    updateCard(id: number,title: string,desc: string, type: string, duration: number, stars: number): any {

        let response:any = [];

        $.ajax({
            url: apiUrl + 'card-update',
            method: 'POST',
            async: false,
            data: {
                id: id,
                title: title,
                desc: desc,
                type: type,
                duration: duration,
                stars: stars
            },
            dataType: 'JSON',
            success: (res:string, textStatus: string, jqXHR: any) => {
                response['msg'] = res;
                response['status'] = jqXHR.status;
            },
            error: (jqXHR:any, textStatus:any)=>{
                response['msg'] = 'Error en la consulta: '+textStatus;
                response['status'] = 400;
            }
        });

        return response;

    }


    deleteCard(id: number): any {

        let response:any = [];

        $.ajax({
            url: apiUrl + 'card-delete',
            method: 'POST',
            async: false,
            data: {
                id: id,
            },
            dataType: 'JSON',
            success: (res:string, textStatus: string, jqXHR: any) => {
                response['msg'] = res;
                response['status'] = jqXHR.status;
            },
            error: (jqXHR:any, textStatus:any)=>{
                response['msg'] = 'Error en la consulta: '+textStatus;
                response['status'] = 400;
            }
        });

        return response;

    }

    createCard(title: string,desc: string, type: string, duration: number, stars: number): any {
        
        let response:any = [];

        $.ajax({
            url: apiUrl + 'card-create',
            method: 'POST',
            async: false,
            data: {
                title: title,
                desc: desc,
                type: type,
                duration: duration,
                stars: stars
            },
            dataType: 'JSON',
            success: (res:string, textStatus: string, jqXHR: any) => {
                response['msg'] = res;
                response['status'] = jqXHR.status;
            },
            error: (res:any, textStatus:any)=>{
                response['msg'] = 'Error en la consulta: '+textStatus;
                response['status'] = 400;
            }
        });

        return response;

    }

    assignCard(card_id:number,client_id:number): any{

        let response:any = [];

        $.ajax({
            url: apiUrl + 'card-assign',
            method: 'POST',
            async: false,
            data: {
                card_id: card_id,
                client_id: client_id
            },
            dataType: 'JSON',
            success: (res:string, textStatus: string, jqXHR: any) => {
                response['msg'] = res;
                response['status'] = jqXHR.status;
            },
            error: (res:any, textStatus:any)=>{
                response['msg'] = 'Error en la consulta: '+textStatus;
                response['status'] = 400;
            }
        });

        return response;

    }

    getUserCardsList(client_id: number) {
        
        let response: any = [];
        
        $.ajax({
            url: apiUrl + 'get-user-cards-list',
            method: 'POST',
            data: {
                client_id: client_id
            },
            async: false,
            dataType: 'JSON',
            success: (res:any, textStatus: string, jqXHR: any) => {
                
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

    updateNumberCard(id_assigned: number,position: number): any {

        let response:any = [];

        $.ajax({
            url: apiUrl + 'number-card-update',
            method: 'POST',
            async: false,
            data: {
                id_assigned: id_assigned,
                position: position
            },
            dataType: 'JSON',
            success: (res:string, textStatus: string, jqXHR: any) => {
                response['msg'] = res;
                response['status'] = jqXHR.status;
            },
            error: (jqXHR:any, textStatus:any)=>{
                response['msg'] = 'Error en la consulta: '+textStatus;
                response['status'] = 400;
            }
        });

        return response;

    }

    deleteCardAssigned(id_assigned: number): any {

        let response:any = [];

        $.ajax({
            url: apiUrl + 'card-assigned-delete',
            method: 'POST',
            async: false,
            data: {
                id_assigned: id_assigned,
            },
            dataType: 'JSON',
            success: (res:string, textStatus: string, jqXHR: any) => {
                response['msg'] = res;
                response['status'] = jqXHR.status;
            },
            error: (jqXHR:any, textStatus:any)=>{
                response['msg'] = 'Error en la consulta: '+textStatus;
                response['status'] = 400;
            }
        });

        return response;

    }

    updateGiftcard(id_assigned: number, message: string): any {

        let response:any = [];

        $.ajax({
            url: apiUrl + 'update-message-giftcard',
            method: 'POST',
            async: false,
            data: {
                id_assigned: id_assigned,
                message: message
            },
            dataType: 'JSON',
            success: (res:string, textStatus: string, jqXHR: any) => {
                response['msg'] = res;
                response['status'] = jqXHR.status;
            },
            error: (jqXHR:any, textStatus:any)=>{
                response['msg'] = 'Error en la consulta: '+textStatus;
                response['status'] = 400;
            }
        });

        return response;

    }

    giftcardUsed(id_assigned: number){

        let response:any = [];

        $.ajax({
            url: apiUrl + 'update-used-giftcard',
            method: 'POST',
            async: false,
            dataType: 'JSON',
            data: {
                id_assigned: id_assigned,
            },
            success: (res:string, textStatus: string, jqXHR: any) => {
                response['msg'] = res;
                response['status'] = jqXHR.status;
            },
            error: (jqXHR:any, textStatus:any)=>{
                response['msg'] = 'Error en la consulta: '+textStatus;
                response['status'] = 400;
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