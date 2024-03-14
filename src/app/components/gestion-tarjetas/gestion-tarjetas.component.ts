import { Component } from '@angular/core';
import { Configuracion } from 'src/app/models/configuracion';
import DataTable from 'datatables.net-dt';
import { AuthService } from 'src/app/services/auth.service';
import 'datatables.net-responsive-dt';

declare const $: any;
declare const Swal: any;

@Component({
  selector: 'app-gestion-tarjetas',
  templateUrl: './gestion-tarjetas.component.html',
  styleUrls: ['./gestion-tarjetas.component.scss']
})
export class GestionTarjetasComponent {

  public config:any = Configuracion;
  public cardsCount = -1;
  public table:any;
  public cards:any = [];

  constructor(private authService: AuthService){

    this.cards = this.authService.getCardsList();
    this.cardsCount = this.cards.length;

    if(this.cardsCount > 0){
      setTimeout(() => {
        this.table = new DataTable('#tablaGestionTarjetas', {
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

  editCard(id: number, title: string,desc: string, duration: number, stars: number, type: string){

    Swal.fire({
      title: "Editar Tarjeta",
      html:
          '<div class="d-flex flex-column align-items-start w-75 m-auto"><p>Tipo:</p>' +
          '<select id="swal-input1" class="swal2-input form-control fs-5 mt-0 ms-0 w-100">' +
          '<option '+ ((type === "Estandar") ? 'selected' : '') +'>Estandar</option>' +
          '<option '+ ((type === "Objetivo") ? 'selected' : '') +'>Objetivo</option>' +
          '<option '+ ((type === "Giftcard") ? 'selected' : '') +'>Giftcard</option>' +
          '</select></div>'+
          '<div class="mt-3 d-flex flex-column align-items-start w-75 m-auto"><p>Título:</p>' +
          '<input id="swal-input2" type="text" class="swal2-input mt-0 ms-0 w-100" value="'+title+'"></div>' +
          '<div id="descCard" class="mt-3 d-flex flex-column align-items-start w-75 m-auto"><p>Descripción:</p>' +
          '<input id="swal-input3" type="text" class="swal2-input mt-0 ms-0 w-100" value="'+desc+'"></div>'+
          '<div class="mt-3 d-flex flex-column align-items-start w-75 m-auto"><p>Días de Duración:</p>' +
          '<input id="swal-input4" type="number" class="swal2-input mt-0 ms-0 w-100" value="'+duration+'"></div>' +
          '<div id="starCard" class="mt-3 d-flex flex-column align-items-start w-75 m-auto"><p>Estrellas:</p>' +
          '<input id="swal-input5" type="number" class="swal2-input mt-0 ms-0 w-100" value="'+stars+'"></div>',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar',
      preConfirm: function () {
          return new Promise(function (resolve) {
              resolve([
                  $('#swal-input1').val(),
                  $('#swal-input2').val(),
                  $('#swal-input3').val(),
                  $('#swal-input4').val(),
                  $('#swal-input5').val(),
              ])
          })
      },
    }).then( (result:any) => {

      if (result.isConfirmed) {
        let typeEdit = result.value[0];
        let titleEdit = result.value[1];
        let descEdit = result.value[2];
        let durationEdit = result.value[3];
        let starsEdit = result.value[4];
        
        try {
          
           let res = this.authService.updateCard(id, titleEdit, descEdit, typeEdit, durationEdit, starsEdit);

           if(res['status'] === 200){
            this.cards = this.authService.getCardsList();
           }else if(res['status'] === 202){
            Swal.fire({
              title: "Error",
              text: res['msg'],
              icon: 'error'
            });
          }else{
            Swal.fire({
              title: "Error",
              text: "Ha ocurrido un error y no has podido actualizar la tarjeta.",
              icon: 'error'
            });
          }

        } catch (error) {
          Swal.fire({
            title: "Error",
            text: 'Lo siento, ocurrió un error inesperado.'
          });
           console.error("Error al actualizar tarjeta: ", error);
        }

      }
      
    });

    if(type === 'Giftcard'){
      $('#descCard input').fadeOut();
      $('#descCard p').fadeOut();
      $('#starCard input').fadeOut();
      $('#starCard p').fadeOut();
      setTimeout(()=>{$('#starCard input').val('0');},300);
    }

    $('#swal-input1').on('change',()=>{

      let tipoSelect = $('#swal-input1');

      if(tipoSelect.val() === 'Giftcard'){
        $('#descCard input').fadeOut();
        $('#descCard p').fadeOut();
        $('#starCard input').fadeOut();
        $('#starCard p').fadeOut();
        setTimeout(()=>{$('#starCard input').val('0');},300);
      }else if(tipoSelect.val() === 'Estandar' || tipoSelect.val() === 'Objetivo'){
        $('#descCard input').fadeIn();
        $('#descCard p').fadeIn();
        $('#starCard input').val('');
        $('#starCard input').fadeIn();
        $('#starCard p').fadeIn();
      }
      
      $('#swal-input2').focus();

    });


  }

  deleteCard(id: number, title: string){

    Swal.fire({
      title: "Confirmación",
      text: `¿Seguro que deseas eliminar la tarjeta ${title}?`,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar',
    }).then( (result:any) => {

      if (result.isConfirmed) {
  
        try {
           let res = this.authService.deleteCard(id);

           if(res['status'] === 200){
            this.cards = this.authService.getCardsList();//Crear función para comprobar si quedan 0 rows y llamarla
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

}
