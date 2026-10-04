import { CommonModule } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  imports: [CommonModule, NgbCarouselModule, FontAwesomeModule, RouterLink, TranslatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private translate = inject(TranslateService);

  lang = this.translate.currentLang;
  images: string[] = [];
  ishome = false;

  constructor(private activatedRoute: ActivatedRoute) {
    console.log(this.activatedRoute.snapshot.routeConfig?.path);
    this.ishome = this.activatedRoute.snapshot.routeConfig?.path === '' || this.activatedRoute.snapshot.routeConfig?.path === 'home';
  }

  ngOnInit(): void {
    this.images = [
      'assets/images/cropped-BB-Canepa-28-min-1.jpg',
      'assets/images/BB-Canepa-5.jpg'
    ];
  }
}
