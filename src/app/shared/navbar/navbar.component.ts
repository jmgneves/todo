import { Component, inject } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { TabsModule } from 'primeng/tabs';
import { RouterService } from '../../core/services/router.service';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MenubarModule, TabsModule, RouterModule],
  template: `
    <p-tabs [value]="activeTab()" (valueChange)="onTabChange($event)">
      <p-tablist>
        @for(tab of items; track tab.route) {
        <p-tab [value]="tab.route" [routerLink]="tab.route">
          <span class="uppercase  font-normal">{{ tab.label }}</span>
        </p-tab>
        }
      </p-tablist>
    </p-tabs>
  `,
})
export class NavbarComponent {
  readonly routerService = inject(RouterService);
  items = [
    {
      label: '1. basic',
      route: '/basic',
    },
    {
      label: '2. behavior subject state service',
      route: '/behavior-subject-state-service',
    },
    {
      label: '3. basic signals',
      route: '/basic-signals',
    },
    {
      label: '4. signals state service',
      route: '/signals-state-service',
    },
    {
      label: '5. signal store',
      route: '/signal-store',
    },
  ];

  readonly activeTab = this.routerService.activeRoute(this.items);

  onTabChange(route: string | number): void {
    if (typeof route === 'string') {
      this.routerService.navigateTo(route);
    }
  }
}
