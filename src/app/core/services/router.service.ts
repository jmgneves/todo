import { Injectable, computed, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, startWith } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  router = inject(Router);

  // Reactive signal for router URL (only emits on NavigationEnd)
  readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      startWith({ urlAfterRedirects: this.router.url } as NavigationEnd)
    ),
    { initialValue: { urlAfterRedirects: this.router.url } as NavigationEnd }
  );

  // Compute the active tab reactively based on the URL
  activeRoute(items: { route: string }[]) {
    return computed(() => {
      const url = this.currentUrl().urlAfterRedirects;
      const match = items.find((item) => url.startsWith(item.route));
      return match?.route ?? items[0].route;
    });
  }

  navigateTo(route: string): void {
    this.router.navigateByUrl(route);
  }
}
