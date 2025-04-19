import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterService } from './router.service';
import { Subject } from 'rxjs';
import { NavigationEnd } from '@angular/router';

describe('RouterService', () => {
  let service: RouterService;
  let routerMock: jasmine.SpyObj<Router>;
  let routerEvents$: Subject<any>;

  beforeEach(() => {
    routerEvents$ = new Subject<any>();
    routerMock = jasmine.createSpyObj('Router', ['navigateByUrl'], {
      events: routerEvents$.asObservable(),
      url: '/initial',
    });

    TestBed.configureTestingModule({
      providers: [RouterService, { provide: Router, useValue: routerMock }],
    });

    service = TestBed.inject(RouterService);
  });

  it('should initialize currentUrl with the initial router URL', () => {
    const initialUrl = service.currentUrl();
    expect(initialUrl.urlAfterRedirects).toBe('/initial');
  });

  it('should update currentUrl on NavigationEnd events', () => {
    routerEvents$.next(new NavigationEnd(1, '/previous', '/new-url'));
    const updatedUrl = service.currentUrl();
    expect(updatedUrl.urlAfterRedirects).toBe('/new-url');
  });

  it('should compute the active route based on the current URL', () => {
    const routes = [
      { route: '/home' },
      { route: '/about' },
      { route: '/contact' },
    ];

    routerEvents$.next(new NavigationEnd(1, '/previous', '/about'));
    const activeRoute = service.activeRoute(routes)();
    expect(activeRoute).toBe('/about');
  });

  it('should return the first route if no match is found', () => {
    const routes = [
      { route: '/home' },
      { route: '/about' },
      { route: '/contact' },
    ];

    routerEvents$.next(new NavigationEnd(1, '/previous', '/unknown'));
    const activeRoute = service.activeRoute(routes)();
    expect(activeRoute).toBe('/home');
  });

  it('should navigate to the specified route', () => {
    service.navigateTo('/test-route');
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/test-route');
  });
});
