import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: '',
        children: [
           {
               path: '',
                loadComponent: () => import('./pages/home.page').then(m => m.HomePage)
           },
           {
               path: 'pokemon-list',
               loadComponent: () => import('./pages/pokemon-list.page').then(m => m.PokemonListPage)
           },
           {
               path: 'auth',
               loadComponent: () => import('./pages/auth.page').then(m => m.AuthPage)
           }
        ]
    }
];
