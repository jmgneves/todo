import { Routes } from '@angular/router';
import { WelcomeComponent } from './features/welcome/welcome.component';
import { TodoListSignalStoreComponent } from './features/todo-list-signal-store/todo-list-signal-store.component';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'signal-store', component: TodoListSignalStoreComponent },
];
