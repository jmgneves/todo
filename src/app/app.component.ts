import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ButtonModule],
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="text-center text-4xl font-bold text-blue-500">hello world</div>
    <p-button label="Submit" />
  `,
})
export class AppComponent {
  title = 'ava todo';
}
