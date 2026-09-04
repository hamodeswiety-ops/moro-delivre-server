import { Injectable } from '@nestjs/common';
import * as i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import * as path from 'path';

@Injectable()
export class I18nService {
  private i18n = i18next;

  constructor() {
    this.initializeI18n();
  }

  private initializeI18n() {
    this.i18n.use(Backend).init({
      lng: 'en',
      fallbackLng: 'en',
      backend: {
        loadPath: path.join(__dirname, '../../i18n/{{lng}}.json'),
      },
      ns: [],
      defaultNS: 'translation',
      interpolation: {
        escapeValue: false,
      },
    });
  }

  t(key: string, lang: string = 'en', options?: any): string {
    this.i18n.changeLanguage(lang);
    const result = this.i18n.t(key, options);
    return typeof result === 'string' ? result : key;
  }

  getLanguage(): string {
    return (this.i18n as any).language || 'en';
  }

  changeLanguage(lang: string): void {
    this.i18n.changeLanguage(lang);
  }
}
