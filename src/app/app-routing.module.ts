import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importar los componentes
import { InicioComponent } from './components/inicio/inicio.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { TarjetasComponent } from './components/tarjetas/tarjetas.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminComponent } from './components/admin/admin.component';
import { GestionUsuariosComponent } from './components/gestion-usuarios/gestion-usuarios.component';
import { GestionTarjetasComponent } from './components/gestion-tarjetas/gestion-tarjetas.component';
import { CreateCardComponent } from './components/create-card/create-card.component';

const routes: Routes = [

    //PÚBLICO
    {path: '', component: InicioComponent},
    {path: 'inicio', component: InicioComponent},
    {path: 'iniciar-sesion', component: LoginComponent},
    {path: 'tarjetas', component: TarjetasComponent},

    //ADMINISTRACIÓN
    {path: 'admin', component: AdminComponent},

    //CLIENTES
    {path: 'admin/gestion-clientes', component: GestionUsuariosComponent},
    {path: 'admin/registrar-cliente', component: RegisterComponent},

    //TARJETAS
    {path: 'admin/gestion-tarjetas', component: GestionTarjetasComponent},
    {path: 'admin/crear-tarjeta', component:CreateCardComponent},

    //ERROR 404
    {path: '**', component: NotFoundPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
