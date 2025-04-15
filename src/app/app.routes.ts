import { Routes } from '@angular/router';

import { TodoListSignalStoreComponent } from './features/todo-list-signal-store/todo-list-signal-store.component';

import { TodoListBasicSignalsComponent } from './features/todo-list-basic-signals/todo-list-basic-signals.component';
import { TodoListBasicAppServiceComponent } from './features/todo-list-basic-app-service/todo-list-basic-app-service.component';
import { TodoListSignalStateServiceComponent } from './features/todo-list-signal-state-service/todo-list-signal-state-service.component';

export const routes: Routes = [
  { path: '', redirectTo: 'signal-store', pathMatch: 'full' },
  { path: 'signal-store', component: TodoListSignalStoreComponent },
  {
    path: 'signals-state-service',
    component: TodoListSignalStateServiceComponent,
  },
  { path: 'basic-signals', component: TodoListBasicSignalsComponent },
  { path: 'basic-app-service', component: TodoListBasicAppServiceComponent },
];
