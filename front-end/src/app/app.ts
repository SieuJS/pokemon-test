import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from "./components/header.component";

@Component({
  imports: [RouterModule, Header],
  selector: 'app-root',
  template: `
   <app-header/>
   <main class="container mx-auto mt-8 px-4">
    <router-outlet></router-outlet>
  </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
  `,
})
export class App {
  protected title = 'front-end';
}
