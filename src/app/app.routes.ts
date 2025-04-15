import { Routes } from '@angular/router';

import { TodoListSignalStoreComponent } from './features/todo-list-signal-store/todo-list-signal-store.component';
import { TodoListSignalAppServiceComponent } from './features/todo-list-signal-app-service/todo-list-signal-app-service.component';
import { TodoListBasicSignalsComponent } from './features/todo-list-basic-signals/todo-list-basic-signals.component';
import { TodoListBasicAppServiceComponent } from './features/todo-list-basic-app-service/todo-list-basic-app-service.component';

export const routes: Routes = [
  { path: '', redirectTo: 'signal-store', pathMatch: 'full' },
  { path: 'signal-store', component: TodoListSignalStoreComponent },
  {
    path: 'signals-state-service',
    component: TodoListSignalAppServiceComponent,
  },
  { path: 'basic-signals', component: TodoListBasicSignalsComponent },
  { path: 'basic-app-service', component: TodoListBasicAppServiceComponent },
];
