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
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  readonly routerService = inject(RouterService);
  items = [
    {
      label: 'signal store',
      route: '/signal-store',
    },
    {
      label: 'signals app service',
      route: '/signals-app-service',
    },
    {
      label: 'basic signals',
      route: '/basic-signals',
    },
    {
      label: 'basic app service',
      route: '/basic-app-service',
    },
  ];

  readonly activeTab = this.routerService.activeRoute(this.items);

  onTabChange(route: string | number): void {
    if (typeof route === 'string') {
      this.routerService.navigateTo(route);
    }
  }
}
