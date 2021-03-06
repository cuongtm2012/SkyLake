import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { IndexComponent } from './components/index/index.component';
import { SendSmsService } from './service/sendSms.service';
import { appRoutes } from './config/routerConfig';
import { EnvService } from './service/env.service';
import { CreateComponent } from './components/create/create.component';
import { ValidationUtilService } from './service/validation-util.service';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    CreateComponent
  ],
  imports: [
    BrowserModule, RouterModule.forRoot(appRoutes), HttpClientModule, ReactiveFormsModule
  ],
  providers: [SendSmsService, EnvService, ValidationUtilService],
  bootstrap: [AppComponent]
})
export class AppModule { }
