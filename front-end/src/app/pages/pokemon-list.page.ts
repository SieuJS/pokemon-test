import { ChangeDetectionStrategy, Component, signal, inject, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TwMergePipe } from '../pipes/tw-merge.pipe';
import { PokemonFavoriteService, PokemonService } from '../api/services';
import { merge, debounceTime, filter, switchMap, map, startWith, Subject } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ItemCardComponent } from "../components/item-card.component";
import { MatDialog } from '@angular/material/dialog';
import { ItemDetailComponent } from '../components/item-detail.component';
import { LocalAuthService } from '../services/local-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pokemon-list',
  imports: [CommonModule, TwMergePipe, ReactiveFormsModule, ItemCardComponent],
  template: `
     <section class="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8">
            <div class="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
                <div>
                    <label for="search" class="block text-sm font-medium text-gray-700 mb-2">Search Pokémon</label>
                    <form class="relative" [formGroup]="searchForm">
                        <input type="text" id="search" placeholder="Search by name..." formControlName="name"
                            class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base">
                        <i class="fas fa-search absolute left-3 top-4 text-gray-400"></i>
                    </form>
                </div>

                <div class="flex items-end">
                    <button (click)="toggleAdvancedFilters()" class="w-full lg:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors touch-manipulation">
                        <i class="fas fa-filter mr-2"></i>Advanced Filters
                    </button>
                </div>
            </div>

            <div [class]="[ !openFilter() && 'hidden', 'mt-6 pt-6 border-t border-gray-200'] | twMerge">
                <form class="space-y-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:space-y-0" [formGroup]="filterForm">
                    <div>
                        <label for="type-filter" class="block text-sm font-medium text-gray-700 mb-2">Type</label>
                        <select id="type-filter" class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base" formControlName="type">
                            <option value="">All Types</option>
                            <option value="grass">Grass</option>
                            <option value="fire">Fire</option>
                            <option value="water">Water</option>
                            <option value="electric">Electric</option>
                            <option value="psychic">Psychic</option>
                            <option value="ice">Ice</option>
                            <option value="dragon">Dragon</option>
                            <option value="dark">Dark</option>
                            <option value="fairy">Fairy</option>
                            <option value="normal">Normal</option>
                            <option value="fighting">Fighting</option>
                            <option value="poison">Poison</option>
                            <option value="ground">Ground</option>
                            <option value="flying">Flying</option>
                            <option value="bug">Bug</option>
                            <option value="rock">Rock</option>
                            <option value="ghost">Ghost</option>
                            <option value="steel">Steel</option>
                        </select>
                    </div>
                    <div>
                        <label for="legendary-filter" class="block text-sm font-medium text-gray-700 mb-2">Legendary Status</label>
                        <select id="legendary-filter" class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base" formControlName="legendary">
                            <option value="">All</option>
                            <option value="true">Legendary</option>
                            <option value="false">Non-Legendary</option>
                        </select>
                    </div>
                    <div class="md:col-span-2 lg:col-span-1">
                        <label for="speed-min" class="block text-sm font-medium text-gray-700 mb-2">Speed Range</label>
                        <div class="flex space-x-2">
                            <input type="number" id="speed-min" placeholder="Min" class="w-1/2 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base" formControlName="fromSpeed">
                            <input type="number" id="speed-max" placeholder="Max" class="w-1/2 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base" formControlName="toSpeed">
                        </div>
                      </div>
                </form>
                <div class="mt-6 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    <button class="flex-1 sm:flex-none bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors touch-manipulation">
                        Apply Filters
                    </button>
                    <button (click)="clearFilters()" class="flex-1 sm:flex-none bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors touch-manipulation">
                        Clear Filters
                    </button>
                </div>
            </div>
        </section>

        <section class="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0 mb-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                <span id="results-info" class="text-gray-600 text-sm md:text-base">Showing {{ filterPokemonList()?.items?.length  }} Pokémon</span>
                <form class="flex items-center space-x-2" [formGroup]="paginationForm">
                    <label for="per-page" class="text-sm text-gray-600 whitespace-nowrap">Per page:</label>
                    <select id="per-page" class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base" formControlName="limit">
                        <option value="10">10</option>
                        <option value="20" selected>20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </form>
            </div>
            <div class="mt-6 flex justify-center">
          <nav class="inline-flex rounded-md shadow-sm" aria-label="Pagination">
            <button
              class="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              [disabled]="(paginationForm.get('page')?.value ?? 1) <= 1"
              (click)="goToPage((paginationForm.get('page')?.value ?? 1) - 1)"
            >
              Previous
            </button>
            <ng-container *ngFor="let pageNum of getPageNumbers(); let i = index">
              <button
                class="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium hover:bg-blue-100"
                [ngClass]="{'bg-blue-600 text-red-400': pageNum === (paginationForm.get('page')?.value ?? 1)}"
                (click)="goToPage(pageNum)"
                [disabled]="pageNum === (paginationForm.get('page')?.value ?? 1)"
              >
                {{ pageNum }}
              </button>
            </ng-container>
            <button
              class="-ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              [disabled]="!hasNextPage()"
              (click)="goToPage((paginationForm.get('page')?.value ?? 1) + 1)"
            >
              Next
            </button>
          </nav>
        </div>
        </section>

        <div id="pokemon-list" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          @for (item of filterPokemonList()?.items; track $index) {
            <div class="relative">
              <app-item-card class="transition-transform duration-200 hover:scale-105 hover:shadow-lg cursor-pointer" [item]="item" (click)="clickDetail.next(item.id)"></app-item-card>
            </div>
          }
        </div>

  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonListPage {
  private dialog = inject(MatDialog);
  readonly clickDetail = new Subject<string>();
  readonly pokemonService = inject(PokemonService);
  readonly favoritePokemonService = inject(PokemonFavoriteService);
  readonly authService = inject(LocalAuthService);
  private router = inject(Router);
  constructor() {
    effect(() => {
      if(!this.authService.isLoggedIn) {
        this.authService.clearToken();
        this.router.navigate(['/auth']);
        return;
      }
      this.pokemonDetail();
      if (this.pokemonDetail()) {
        this.dialog.open(ItemDetailComponent, {
          data: this.pokemonDetail(),
        });
      }
    });
  }

  getPageNumbers(): number[] {
    const total = this.filterPokemonList()?.meta.total ?? 0;
    const limit = this.paginationForm.get('limit')?.value ?? 20;
    const pageCount = Math.ceil(total / limit);
    const current = this.paginationForm.get('page')?.value ?? 1;
    const delta = 2;
    let start = Math.max(1, current - delta);
    let end = Math.min(pageCount, current + delta);
    if (end - start < 4) {
      if (start === 1) end = Math.min(pageCount, start + 4);
      if (end === pageCount) start = Math.max(1, end - 4);
    }
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  goToPage(page: number) {
    const total = this.filterPokemonList()?.meta.total ?? 0;
    const limit = this.paginationForm.get('limit')?.value ?? 20;
    const pageCount = Math.ceil(total / limit);
    if (page < 1 || page > pageCount) return;
    this.paginationForm.patchValue({ page });
  }

  hasNextPage(): boolean {
    const total = this.filterPokemonList()?.meta.total ?? 0;
    const limit = this.paginationForm.get('limit')?.value ?? 20;
    const current = this.paginationForm.get('page')?.value ?? 1;
    const pageCount = Math.ceil(total / limit);
    return current < pageCount;
  }
  openFilter = signal(false);
  fb = inject(FormBuilder);

  toggleAdvancedFilters() {
    this.openFilter.set(!this.openFilter());
  }
  searchForm = this.fb.group({
    name: [''],
  });

  filterForm = this.fb.group({
    type: [undefined],
    legendary: [undefined],
    fromSpeed: [undefined],
    toSpeed: [undefined],
  });
  paginationForm = this.fb.group({
    page: [1],
    limit: [20],
  });
  filterPokemonList$ = merge(
    this.searchForm.valueChanges.pipe(startWith(this.searchForm.value)),
    this.filterForm.valueChanges.pipe(startWith(this.filterForm.value)),
    this.paginationForm.valueChanges.pipe(startWith(this.paginationForm.value)),
  ).pipe(
    debounceTime(300),
    map(() => ({
      search: this.searchForm.value,
      filter: this.filterForm.value,
      pagination: this.paginationForm.value,
    })),
    switchMap(({ search, filter, pagination }) => {
      return this.pokemonService.pokemonControllerGetPokemonList({
        page: pagination.page || 1,
        limit: pagination.limit || 20,
        type: filter.type || undefined,
        name: search.name || undefined,
        legendary: filter.legendary || undefined,
        fromSpeed: filter.fromSpeed || undefined,
        toSpeed: filter.toSpeed || undefined,
      });
    }),
    filter((response) => !!response.items),
  );

  filterPokemonList = toSignal(this.filterPokemonList$);

  pokemonDetail$ = this.clickDetail.pipe(
    switchMap((id: string) => {
      return this.pokemonService.pokemonControllerGetPokemonDetails({ id });
    })
  );
  pokemonDetail = toSignal(this.pokemonDetail$, { initialValue: null });

  clearFilters() {
    this.filterForm.reset();
  }
}
