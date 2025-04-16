import { Routes } from '@angular/router';

import { TodoListSignalStoreComponent } from './features/todo-list-signal-store/todo-list-signal-store.component';

import { TodoListBasicSignalsComponent } from './features/todo-list-basic-signals/todo-list-basic-signals.component';
import { TodoListBehaviorSubjectStateServiceComponent } from './features/todo-list-behavior-subject-state-service/todo-list-behavior-subject-state-service.component';
import { TodoListSignalStateServiceComponent } from './features/todo-list-signal-state-service/todo-list-signal-state-service.component';

export const routes: Routes = [
  { path: '', redirectTo: 'signal-store', pathMatch: 'full' },
  { path: 'signal-store', component: TodoListSignalStoreComponent },
  {
    path: 'signals-state-service',
    component: TodoListSignalStateServiceComponent,
  },
  { path: 'basic-signals', component: TodoListBasicSignalsComponent },
  {
    path: 'behavior-subject-state-service',
    component: TodoListBehaviorSubjectStateServiceComponent,
  },
];
