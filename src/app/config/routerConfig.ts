// routerConfig.ts

import { Routes } from '@angular/router';
import { IndexComponent } from '../components/index/index.component';
import { CreateComponent } from '../components/create/create.component';

export const appRoutes: Routes = [
  { path: 'create',
  component: CreateComponent
},
  { path: 'index',
    component: IndexComponent
  }
];
