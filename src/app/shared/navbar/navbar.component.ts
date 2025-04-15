import { Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { TabsModule } from 'primeng/tabs';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, Observable, startWith } from 'rxjs';
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
  readonly router = inject(Router);
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

  // Reactive signal for router URL (only emits on NavigationEnd)
  currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      // Emit first value immediately in case of full-page reload
      // Fallback to router.url
      startWith({ urlAfterRedirects: this.router.url } as NavigationEnd)
    ),
    { initialValue: { urlAfterRedirects: this.router.url } as NavigationEnd }
  );

  // Compute the active tab reactively based on the URL
  readonly activeTab = computed(() => {
    const url = this.currentUrl().urlAfterRedirects;
    const match = this.items.find((item) => url.startsWith(item.route));
    return match?.route ?? this.items[0].route;
  });

  onTabChange(route: string | number): void {
    if (typeof route === 'string') {
      this.router.navigateByUrl(route);
    }
  }
}
