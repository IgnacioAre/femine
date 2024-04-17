import { Injectable } from '@angular/core';
import { Configuracion } from '../models/configuracion';


@Injectable({
    providedIn: 'root'
})
export class StorageService {

    private userKey: string = 'user';
    private tokenKey: string = 'userToken';
    private saveKey: string = 'userSave';
    private colorsKey: string = 'colors';
    private userUpdateKey: string = 'userUpdate';
    private saveDocument: string = 'userDocument'
    private config = Configuracion;


    setColors(color: string){
        localStorage.setItem(this.colorsKey,color);
    }
    
    getColor():string | null{
        return localStorage.getItem(this.colorsKey);
    }

    setUser(value: Object | null) {
        localStorage.setItem(this.userKey,JSON.stringify(value));
    }

    getUser(): any {
        const value = localStorage.getItem(this.userKey);
        return value;
    }

    setToken(value: any) {
        localStorage.setItem(this.tokenKey,value);
        this.config.userToken = value;
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    setSave(value: string){
        localStorage.setItem(this.saveKey,value);
    }

    getSave(){
        return localStorage.getItem(this.saveKey);
    }

    setDocument(value: string){
        localStorage.setItem(this.saveDocument,value);
    }

    getDocument(){
        return localStorage.getItem(this.saveDocument);
    }

    remove() {
        localStorage.removeItem(this.tokenKey);
        if(!this.config.userSave){
            localStorage.removeItem(this.userKey);
        }else{
            localStorage.setItem(this.userKey,JSON.stringify({'document':this.config.userDocument}));
        }
        this.config.userToken = '';
        this.config.userName = '';
        this.config.userSubname = '';
    }

}