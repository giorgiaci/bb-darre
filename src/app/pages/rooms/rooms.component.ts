import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

type RoomKey = 'POLITEAMA' | 'COLAZIONE' | 'PRETORIA';

const ROOM_ID_TO_KEY: Record<string, RoomKey> = {
  'stanza-politeama': 'POLITEAMA',
  'stanza-sala-colazione': 'COLAZIONE',
  'stanza-pretoria': 'PRETORIA',
};

const ROOM_IMAGES: Record<RoomKey, string[]> = {
  POLITEAMA: [
    '/assets/images/BB-Canepa-9no-min-1.jpg',
    '/assets/images/BB-Canepa-13-min-1.jpg',
    '/assets/images/BB-Canepa-24-principale2-min-iloveimg-compressed.jpg',
    '/assets/images/BB-Canepa-21-min.jpg',
  ],
  COLAZIONE: [
    '/assets/images/BB-Canepa-3.jpg',
    '/assets/images/BB-Canepa-2.jpg',
    '/assets/images/BB-Canepa-17-no.jpg',
    '/assets/images/BB-Canepa-5.jpg',
    '/assets/images/BB-Canepa-6.jpg',
    '/assets/images/BB-Canepa-principale.jpg',
  ],
  PRETORIA: [
    '/assets/images/BB-Canepa-18solo-principale-min.jpg',
    '/assets/images/BB-Canepa-10-min.jpg',
    '/assets/images/BB-Canepa-8-no-min-1.jpg',
    '/assets/images/BB-Canepa-28-min-1.jpg',
    '/assets/images/BB-Canepa-11-min.jpg',
    '/assets/images/BB-Canepa-13-min.jpg',
    '/assets/images/IMG_20170908_181412-min.jpg',
    '/assets/images/BB-Canepa-14.jpg',
  ],
};

@Component({
  selector: 'app-rooms',
  imports: [CommonModule, NgbCarouselModule, TranslatePipe],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.scss',
})
export class RoomsComponent {
  private translate = inject(TranslateService);
  private roomKey: RoomKey | null = null;
  stanze: any[] = [];

  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe((params) => {
      this.roomKey = ROOM_ID_TO_KEY[params['id']] ?? null;
      this.createModel();
    });
    this.translate.onLangChange.subscribe(() => this.createModel());
  }

  createModel() {
    this.stanze = [];
    const key = this.roomKey;
    if (!key) {
      return;
    }

    const model: any = {
      name: this.translate.instant(`ROOMS.${key}.NAME`),
      labelKey: key === 'COLAZIONE' ? 'ROOMS.BREAKFAST_LABEL' : 'ROOMS.ROOM_LABEL',
      images: ROOM_IMAGES[key],
    };

    if (key === 'COLAZIONE') {
      // Extra info is rendered directly in the template via ROOMS.COLAZIONE.EXTRA_INFO_*
    } else {
      model.description = this.translate.instant(`ROOMS.${key}.DESCRIPTION`);
      model.type = this.translate.instant(`ROOMS.${key}.TYPE`);
    }

    this.stanze.push(model);
  }
}
