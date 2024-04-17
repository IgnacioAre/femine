import { Component } from '@angular/core';
import { Configuracion } from 'src/app/models/configuracion';
import { AuthService } from 'src/app/services/auth.service';
import * as htmlToImage from 'html-to-image';

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
  public cards:any = [];
  public window_width = 0;
  public number_stars:any = [];

  constructor(private authService: AuthService){

    this.window_width = $(window).width();

    this.cards = this.authService.getCardsList();
    this.cardsCount = this.cards.length;

    if(this.cardsCount > 0){
        for (let index = 0; index < this.cards.length; index++) {
          const element = this.cards[index];
          this.number_stars[index] = Array(this.cards[index].stars).fill(0).map((x,i)=>i);
        }

        console.log(this.number_stars);
        
    }

  }

  adminOptionHover(element:any){
    $('#'+element).css('background-color',this.config.backgroundTransparent);
  }

  adminOptionLeave(element:any){
    $('#'+element).css('background-color',this.config.baseColorLight);
  }

  mobileActionCard(id: number, title: string,desc: string, duration: number, stars: number, type: string){

    Swal.fire({
      title: "Selecciona la acción",
      text: "Tarjeta seleccionada: " + title,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Editar",
      denyButtonText: "Eliminar",
      cancelButtonText: "Cancelar"
    }).then((result:any) => {
      if (result.isConfirmed) {
        this.editCard(id,title,desc,duration,stars,type);
      } else if (result.isDenied) {
        this.deleteCard(id,title);
      }
    });

  }

  editCard(id: number, title: string,desc: string, duration: number, stars: number, type: string){

    Swal.fire({
      title: "Editar Tarjeta",
      html:
          '<div class="d-flex flex-column align-items-start w-100 px-1 px-md-5 m-auto"><p>Tipo:</p>' +
          '<select id="swal-input1" class="swal2-input form-control fs-5 mt-0 ms-0 w-100">' +
          '<option '+ ((type === "Estandar") ? 'selected' : '') +'>Estandar</option>' +
          '<option '+ ((type === "Objetivo") ? 'selected' : '') +'>Objetivo</option>' +
          '<option '+ ((type === "Giftcard") ? 'selected' : '') +'>Giftcard</option>' +
          '</select></div>'+
          '<div class="mt-3 d-flex flex-column align-items-start w-100 px-1 px-md-5 m-auto"><p>Título:</p>' +
          '<input id="swal-input2" type="text" class="swal2-input mt-0 ms-0 w-100" value="'+title+'"></div>' +
          '<div id="descCard" class="mt-3 d-flex flex-column align-items-start w-100 px-1 px-md-5 m-auto"><p>Descripción:</p>' +
          '<input id="swal-input3" type="text" class="swal2-input mt-0 ms-0 w-100" value="'+desc+'"></div>'+
          '<div class="mt-3 d-flex flex-column align-items-start w-100 px-1 px-md-5 m-auto"><p>Días de Duración:</p>' +
          '<input id="swal-input4" type="number" class="swal2-input mt-0 ms-0 w-100" value="'+duration+'"></div>' +
          '<div id="starCard" class="mt-3 d-flex flex-column align-items-start w-100 px-1 px-md-5 m-auto"><p>Estrellas:</p>' +
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
        
    
        if(titleEdit !== ''){
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
        }else{

          if(titleEdit === ''){
            Swal.fire({
              title: "Error",
              text: 'El título no puede estar vacio.',
              icon: 'error'
            });
          }

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
      }else if((tipoSelect.val() === 'Estandar' || tipoSelect.val() === 'Objetivo') && type === 'Giftcard'){
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
      icon: 'warning',
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

  firstLetter(str: string){

    return str.substring(0,3).toUpperCase();

  }

  downloadImage(id: number){

    $('#edit_card_'+id).fadeOut('fast');
    $('#download_card_'+id).fadeOut('fast');
    $('#delete_card_'+id).fadeOut('fast');
    $('#title_card_'+id).addClass('w-100');
    $('#action_card_'+id).removeClass('w-25');
    $('#water_mark_'+id).addClass('opacity-01');
    
    setTimeout(() => {
      
      var node:any = document.getElementById('card_'+id);

      htmlToImage.toPng(node)
        .then(function (dataUrl:any) {        
          var link = document.createElement("a");

          document.body.appendChild(link);

          link.setAttribute("href", dataUrl);
          link.setAttribute("download", "Tarjeta-Femine.png");
          link.click();

        })
        .catch(function (error:any) {

          Swal.fire({
            title: "Error",
            text: "Ha ocurrido un error y no se ha podido descargar el archivo.",
            icon: 'error'
          });
          console.error('oops, ocurrió un error.', error);

        });

        setTimeout(() => {
          $('#edit_card_'+id).fadeIn();
          $('#download_card_'+id).fadeIn();
          $('#delete_card_'+id).fadeIn();
          $('#title_card_'+id).removeClass('w-100');
          $('#action_card_'+id).addClass('w-25');
          $('#water_mark_'+id).addClass('d-none');
        }, 500);


    }, 500);
    
  }


}
