import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  NgbDropdownModule,
  NgbNavModule
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgbNavModule,
    NgbDropdownModule,
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private router = inject(Router);
  private translate = inject(TranslateService);

  lang = this.translate.currentLang;

  menuOpen = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {     
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.menuOpen = false;
  }

  switchLang(lang: string): void {
    const segments = this.router.url.split('/');
    segments[1] = lang;
    this.router.navigateByUrl(segments.join('/'));
    this.closeMenu();
  }
}