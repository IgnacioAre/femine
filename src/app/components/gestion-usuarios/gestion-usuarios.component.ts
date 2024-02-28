import { Component } from '@angular/core';
import { Configuracion } from 'src/app/models/configuracion';
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

  constructor(private authService: AuthService){

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
              text: res['msg']
            });
          }else{
            Swal.fire({
              title: "Error",
              text: "Ha ocurrido un error y no has podido actualizar al usuario."
            });
          }

        } catch (error) {
           console.error("Error al actualizar usuario: ", error);
        }

      }
      
    });


  }

  deleteUser(id: number,name: string,subname: string){

    Swal.fire({
      title: "Confirmación",
      text: `¿Seguro que deseas eliminar al cliente ${name + ' ' + subname}?`,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar',
    }).then( (result:any) => {

      if (result.isConfirmed) {
  
        try {
           let res = this.authService.deleteUser(id);

           if(res['status'] === 200){
            this.users = this.authService.getUsersList();
           }else if(res['status'] === 202){
            Swal.fire({
              title: "Error",
              text: res['msg']
            });
          }

        } catch (error) {
          Swal.fire({
            title: "Error",
            text: 'Lo siento, ocurrió un error inesperado.'
          });
           console.error("Error al eliminar tarjeta: ", error);
        }

      }
      
    });

  }


}
