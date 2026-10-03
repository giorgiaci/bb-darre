import { Routes } from '@angular/router';
import { langGuard, DEFAULT_LANG } from './core/guards/lang.guard';

export const routes: Routes = [
  { path: '', redirectTo: DEFAULT_LANG, pathMatch: 'full' },
  {
    path: ':lang',
    canActivate: [langGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
      { path: 'tariffe', loadComponent: () => import('./pages/info/info.component').then(m => m.InfoComponent) },
      {
        path: 'stanze',
        children: [
          { path: ':id', loadComponent: () => import('./pages/rooms/rooms.component').then(m => m.RoomsComponent) }
        ]
      },
      { path: 'regolamento', loadComponent: () => import('./pages/rules/rules.component').then(m => m.RulesComponent) },
      { path: 'contatti', loadComponent: () => import('./pages/contats/contats.component').then(m => m.ContatsComponent) },
      { path: 'location', loadComponent: () => import('./pages/location/location.component').then(m => m.LocationComponent) },
    ]
  },
  { path: '**', redirectTo: DEFAULT_LANG },
];
