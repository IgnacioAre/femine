import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ThemePalette } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule} from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms';
import { AdminComponent } from './components/admin/admin.component';
import { TarjetasComponent } from './components/tarjetas/tarjetas.component';
import { GestionUsuariosComponent } from './components/gestion-usuarios/gestion-usuarios.component';
import { GestionTarjetasComponent } from './components/gestion-tarjetas/gestion-tarjetas.component';
import { CreateCardComponent } from './components/create-card/create-card.component';


@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    NotFoundPageComponent,
    RegisterComponent,
    LoginComponent,
    AdminComponent,
    TarjetasComponent,
    GestionUsuariosComponent,
    GestionTarjetasComponent,
    CreateCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatTooltipModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
