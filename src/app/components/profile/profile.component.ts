import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Configuracion } from 'src/app/models/configuracion';
import { AuthService } from 'src/app/services/auth.service';
import * as htmlToImage from 'html-to-image';

declare const $: any;
declare const Swal: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  public config:any = Configuracion;
  public cards:any = [];
  public count_cards: number = 0;
  public cards_assign_option:any = [];
  public number_stars:any = [];
  public client:any;
  public name_capitalize = '';

  constructor(private route: ActivatedRoute,private authService: AuthService){

    let param_id = ((this.route.snapshot.paramMap.get('id')) ? this.route.snapshot.paramMap.get('id') : '');
    let id:number = ((param_id !== null) ? parseInt(param_id) : 0);

    this.client = authService.getUserById(id)['msg'];

    let complete_name = this.client.name + ' ' + this.client.subname;
    let name_split = [];

    if(complete_name.indexOf(' ') > -1){
       name_split = complete_name.split(' ');

       name_split.forEach((n:any) => {
          this.name_capitalize += n[0].toUpperCase() + n.slice(1).toLowerCase() + ' ';
       });

    }else{
      this.name_capitalize += complete_name[0].toUpperCase() + complete_name.slice(1).toLowerCase();
    }
  
    this.updateCards(id);
    
  }

  updateCards(id:number){
    this.cards = this.authService.getUserCardsList(id);    
    console.log(this.cards);
    this.count_cards = this.cards.length;
    if(this.cards.length > 0){
      for (let index = 0; index < this.cards.length; index++) {
        const element = this.cards[index];
        this.number_stars[index] = Array(this.cards[index].stars).fill(0).map((x,i)=>i);
      }
    }
  }

  updateStars(id_assigned:number, card_position:number, star_position:number){

    let star = $('span[data-card="'+card_position+'"][data-value="'+star_position+'"]');
      
      if(star.hasClass('unmarked-star')){
        
        star.removeClass('unmarked-star').addClass('marked-star').text('');

        $('.unmarked-star').map((index:number,element:any)=>{
          let element_unmarked = $('span[data-card="'+star.data('card')+'"][data-value="'+element.innerText+'"]');
          
          if(element_unmarked.data('value') < star.data('value')){
            element_unmarked.removeClass('unmarked-star').addClass('marked-star').text('');
          }

        });

      }
      
      if(star.hasClass('gray-star')){
        
        star.removeClass('gray-star').addClass('violet-star').text('');

        $('.unmarked-star').map((index:number,element:any)=>{
          let element_unmarked = $('span[data-card="'+star.data('card')+'"][data-value="'+element.innerText+'"]');
          
          if(element_unmarked.data('value') < star.data('value')){
            element_unmarked.removeClass('unmarked-star').addClass('marked-star').text('');
          }

        });

      }

      this.authService.updateNumberCard(id_assigned,star.data('value'));

  }

  editUser(id: number){
    
    Swal.fire({
      title: "Editar Cliente",
      html:
          '<div class="d-flex flex-column align-items-start w-75 m-auto"><p>Nombre:</p>' +
          '<input id="swal-input1" type="text" class="swal2-input mt-0 ms-0 w-100" value="'+this.client.name+'"></div>' +
          '<div class="mt-3 d-flex flex-column align-items-start w-75 m-auto"><p>Apellido:</p>' +
          '<input id="swal-input2" type="text" class="swal2-input mt-0 ms-0 w-100" value="'+this.client.subname+'"></div>',
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
            this.client.name = nameEdit;
            this.client.subname = subnameEdit;
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

  changeStateUser(id: number, active:number){

    let msg = '';

    if(active){
      msg = `¿Seguro que deseas <b>restaurar</b> al cliente ${this.name_capitalize}?`;
    }else{
      msg = `¿Seguro que deseas <b>eliminar</b> al cliente ${this.name_capitalize}?`;
    }

    Swal.fire({
      title: "Confirmación",
      html: msg,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar',
      icon: 'warning',
    }).then( (result:any) => {

      if (result.isConfirmed) {
  
        try {
           let res = this.authService.changeStateUser(id,active);

           if(res['status'] === 200){
            window.location.href = window.location.origin + '/admin/gestion-clientes';
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

  assignCard(id: number){

    this.cards_assign_option = this.authService.getCardsUser(this.client.id)['msg'];  

    if(this.cards_assign_option.length > 0){

      let listado = '';

      this.cards_assign_option.forEach((c:any) => {
        listado += `<option value="${c.id}">${c.title}</option>`;
      });

      Swal.fire({
        title: "Asignar Tarjeta al Cliente "+this.name_capitalize,
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
                this.updateCards(id);
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
        title: 'No tienes tarjetas disponibles.',
        html: '<p>No tienes tarjetas disponibles para asignar a este cliente.</p><a href="'+window.location.origin+'/admin/crear-tarjeta">Crea una nueva aquí</a>',
        icon: 'error'
      });

    }

  }

  deleteCardAssigned(id_assign: number,title: string){

    Swal.fire({
      title: "Confirmación",
      text: `¿Seguro que deseas desvincular la tarjeta ${title}?`,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar',
      icon: 'warning',
    }).then( (result:any) => {

      if (result.isConfirmed) {
  
        try {
           let res = this.authService.deleteCardAssigned(id_assign);

           if(res['status'] === 200){
            this.cards = this.authService.getUserCardsList(this.client.id);
            this.count_cards = this.cards.length;
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

  updateGiftCard(id: number){

    let message_giftcard  = $('#vale_giftcard_' + id).val();

    let res = this.authService.updateGiftcard(id,message_giftcard);

    if(res['status'] === 200){
      Swal.fire({
        title: "Giftcard actualizada",
        icon: 'success'
      });
     }else if(res['status'] === 202){
      Swal.fire({
        title: "Error",
        text: res['msg'],
        icon: 'error'
      });
    }

  }

  downloadImage(id: number){

    $('#controls_card_'+id).fadeOut('fast');
    $('#pencil_'+id).fadeOut('fast');
    
    setTimeout(() => {
      
      var node:any = document.getElementById('card_'+id);

      htmlToImage.toPng(node)
        .then(function (dataUrl) {        
          var link = document.createElement("a");

          document.body.appendChild(link);

          link.setAttribute("href", dataUrl);
          link.setAttribute("download", "Tarjeta-Femine.png");
          link.click();

          $('#controls_card_'+id).fadeIn();
          $('#pencil_'+id).fadeIn();

        })
        .catch(function (error) {

          Swal.fire({
            title: "Error",
            text: "Ha ocurrido un error y no se ha podido descargar el archivo.",
            icon: 'error'
          });
          console.error('oops, ocurrió un error.', error);
        });

        $('#controls_card_'+id).fadeIn();
        $('#pencil_'+id).fadeIn();

    }, 300);
    
  }



}
