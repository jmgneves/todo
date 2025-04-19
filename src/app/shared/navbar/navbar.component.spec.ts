import { TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { RouterService } from '../../core/services/router.service';
import { RouterTestingModule } from '@angular/router/testing';
import { TabsModule } from 'primeng/tabs';
import { MenubarModule } from 'primeng/menubar';
import { computed } from '@angular/core';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let routerService: jasmine.SpyObj<RouterService>;

  beforeEach(async () => {
    const routerServiceSpy = jasmine.createSpyObj('RouterService', [
      'activeRoute',
      'navigateTo',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TabsModule,
        MenubarModule,
        NavbarComponent,
      ],
      providers: [{ provide: RouterService, useValue: routerServiceSpy }],
    }).compileComponents();

    const fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    routerService = TestBed.inject(
      RouterService
    ) as jasmine.SpyObj<RouterService>;

    // Mock activeRoute to return a Computed<string>
    routerService.activeRoute.and.callFake((items) => computed(() => '/basic'));
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize items correctly', () => {
    expect(component.items.length).toBe(5);
    expect(component.items[0].label).toBe('basic');
    expect(component.items[0].route).toBe('/basic');
  });

  it('should call activeRoute with items on initialization', () => {
    expect(routerService.activeRoute).toHaveBeenCalledWith(component.items);
  });

  it('should navigate to the correct route on tab change', () => {
    const route = '/basic-signals';
    component.onTabChange(route);
    expect(routerService.navigateTo).toHaveBeenCalledWith(route);
  });

  it('should not navigate if route is not a string', () => {
    component.onTabChange(123);
    expect(routerService.navigateTo).not.toHaveBeenCalled();
  });

  it('should render the correct number of tabs', () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const tabs = compiled.querySelectorAll('p-tab');
    expect(tabs.length).toBe(5);
  });

  it('should display the correct labels for tabs', () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const tabLabels = Array.from(compiled.querySelectorAll('p-tab span')).map(
      (span) => span.textContent?.trim()
    );
    expect(tabLabels).toEqual([
      'basic',
      'basic signals',
      'behavior subject state service',
      'signals state service',
      'signal store',
    ]); // Match the actual labels in the component
  });
});
