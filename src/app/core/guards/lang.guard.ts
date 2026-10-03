import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export const SUPPORTED_LANGS = ['it', 'en'];
export const DEFAULT_LANG = 'it';

export const langGuard: CanActivateFn = (route) => {
  const translate = inject(TranslateService);
  const router = inject(Router);

  const lang = route.paramMap.get('lang');

  if (!lang || !SUPPORTED_LANGS.includes(lang)) {
    router.navigate(['/', DEFAULT_LANG]);
    return false;
  }

  translate.use(lang);
  return true;
};
