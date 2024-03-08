import { Component } from '@angular/core';
import { Configuracion, apiUrl } from 'src/app/models/configuracion';
import DataTable from 'datatables.net-dt';
import { AuthService } from 'src/app/services/auth.service';
import 'datatables.net-responsive-dt';

declare const $: any;
declare const Swal: any;

@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.scss']
})
export class GestionUsuariosComponent{

  public config:any = Configuracion;
  public users:any = [];
  public usersCount = -1;
  public table:any;
  public window_width = 0;
  public cards:any = [];


  constructor(private authService: AuthService){

    this.window_width = $(window).width();

    this.users = this.authService.getUsersList();
    this.usersCount = this.users.length;
    
    if(this.usersCount > 0){
      setTimeout(() => {
        this.table = new DataTable('#tablaGestionUsuarios', {
          responsive: true,
          language: {
            url: '../../assets/js/spanish_datatable.json'
          },
          order: [[0, 'asc']]
        });
      }, 200);
    }
  }

  adminOptionHover(element:any){
    $('#'+element).css('background-color',this.config.backgroundTransparent);
  }

  adminOptionLeave(element:any){
    $('#'+element).css('background-color',this.config.baseColorLight);
  }

  editUser(id: number,name: string,subname: string){
    
    Swal.fire({
      title: "Editar Cliente",
      html:
          '<div class="d-flex flex-column align-items-start w-75 m-auto"><p>Nombre:</p>' +
          '<input id="swal-input1" type="text" class="swal2-input mt-0 ms-0 w-100" value="'+name+'"></div>' +
          '<div class="mt-3 d-flex flex-column align-items-start w-75 m-auto"><p>Apellido:</p>' +
          '<input id="swal-input2" type="text" class="swal2-input mt-0 ms-0 w-100" value="'+subname+'"></div>',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar',
      preConfirm: function () {
          return new Promise(function (resolve) {
              resolve([
                  $('#swal-input1').val(),
                  $('#swal-input2').val()
              ])
          })
      },
      onOpen: function () {
          $('#swal-input1').focus()
      }
    }).then( (result:any) => {

      if (result.isConfirmed) {
        let nameEdit = result.value[0];
        let subnameEdit = result.value[1];    
  
        try {
           let res = this.authService.updateUser(id, nameEdit, subnameEdit);

           if(res['status'] === 200){
            this.users = this.authService.getUsersList();
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

        } catch (error) {
           console.error("Error al actualizar usuario: ", error);
        }

      }
      
    });


  }

  changeStateUser(id: number,name: string,subname: string, active:number){

    let complete_name = name + ' ' + subname;
    
    let name_split = [];
    let name_capitalize = '';


    if(complete_name.indexOf(' ') > -1){
       name_split = complete_name.split(' ');

       name_split.forEach(n => {
          name_capitalize += n[0].toUpperCase() + n.slice(1).toLowerCase() + ' ';
       });

    }else{
      name_capitalize += complete_name[0].toUpperCase() + complete_name.slice(1).toLowerCase();
    }

    let msg = '';

    if(active){
      msg = `¿Seguro que deseas <b>restaurar</b> al cliente ${name_capitalize}?`;
    }else{
      msg = `¿Seguro que deseas <b>eliminar</b> al cliente ${name_capitalize}?`;
    }

    Swal.fire({
      title: "Confirmación",
      html: msg,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar',
    }).then( (result:any) => {

      if (result.isConfirmed) {
  
        try {
           let res = this.authService.changeStateUser(id,active);

           if(res['status'] === 200){
            this.users = this.authService.getUsersList();
           }else if(res['status'] === 202){
            Swal.fire({
              title: "Error",
              text: res['msg'],
              icon: 'error'
            });
          }

        } catch (error) {
          Swal.fire({
            title: "Error",
            text: 'Lo siento, ocurrió un error inesperado.',
            icon: 'error'
          });
           console.error("Error al eliminar tarjeta: ", error);
        }

      }
      
    });

  }

  assignCard(id: number,name: string){

    let name_split = [];
    let name_capitalize = '';


    if(name.indexOf(' ') > -1){
       name_split = name.split(' ');

       name_split.forEach(n => {
          name_capitalize += n[0].toUpperCase() + n.slice(1).toLowerCase() + ' ';
       });

    }else{
      name_capitalize += name[0].toUpperCase() + name.slice(1).toLowerCase();
    }

    this.cards = this.authService.getCardsUser(id)['msg'];  

    if(this.cards.length > 0){

      let listado = '';

      this.cards.forEach((c:any) => {
        listado += `<option value="${c.id}">${c.title}</option>`;
      });

      Swal.fire({
        title: "Asignar Tarjeta al Cliente "+name_capitalize,
        html:
            '<div class="d-flex flex-column align-items-start w-75 m-auto"><p>Selecciona una tarjeta:</p>' +
            '<select id="swal-input1" class="swal2-input mt-0 ms-0 w-100">'+listado+'</select></div>',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar',
        preConfirm: function () {
            return new Promise(function (resolve) {
                resolve($('#swal-input1').val())
            })
        }
      }).then( (result:any) => {

        if (result.isConfirmed) {

          if(result.value !== ''){

            try {
              let res = this.authService.assignCard(result.value,id);
 
              if(res['status'] === 200){
                Swal.fire({
                  title: 'Tarjeta asignada correctamente!',
                  icon: 'success'
                });
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
 
           } catch (error) {
              console.error("Error al actualizar usuario: ", error);
           }

          }

        }
        
      });

    }else{

      Swal.fire({
        title: 'Aún no has creado tarjetas',
        html: '<p>No tienes tarjetas disponibles para asignar a este cliente.</p><a href="'+window.location.origin+'/admin/crear-tarjeta">Crea una nueva aquí</a>',
        icon: 'error'
      });

    }

  }

  viewProfile(id: number){

    window.location.href = window.location.origin+'/admin/cliente/'+id;

  }

}
