import { Injectable, Inject, PLATFORM_ID, Optional } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from './local-storage.service';
import { BehaviorSubject } from 'rxjs';
import { isPlatformServer, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Request } from 'express';
import { TransferState, makeStateKey } from '@angular/platform-browser';

const LANGUAGE_KEY = makeStateKey<string>('language');
const DIRECTION_KEY = makeStateKey<string>('direction');

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  lang$ = new BehaviorSubject<'en'| 'ar'>('en')
  dir$ = new BehaviorSubject<'rtl' | 'ltr'>('ltr')
  constructor(
    private translate: TranslateService,
    private localStogare:LocalStorageService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject(REQUEST) private request: Request,
    private transferState: TransferState,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.initializeLanguage();
  }

  initializeLanguage(): Promise<void> {
    return new Promise((resolve) => {
      let savedLang = 'en';

      if (isPlatformServer(this.platformId)) {
        // On server side, first try to get language from cookies
        if (this.request?.headers?.cookie) {
          const cookies = this.parseCookies(this.request.headers.cookie);
          if (cookies['lang'] === 'ar' || cookies['lang'] === 'en') {
            savedLang = cookies['lang'];
          }
        }
        // If no cookie, check accept-language header
        else if (this.request?.headers?.['accept-language']) {
          const acceptLang = this.request.headers['accept-language'];
          savedLang = acceptLang.includes('ar') ? 'ar' : 'en';
        }
        
        this.transferState.set(LANGUAGE_KEY, savedLang);
      } else if (isPlatformBrowser(this.platformId)) {
        // On browser side, first check transfer state
        if (this.transferState.hasKey(LANGUAGE_KEY)) {
          savedLang = this.transferState.get(LANGUAGE_KEY, 'en');
          this.transferState.remove(LANGUAGE_KEY);
        } else {
          // If no transfer state, check localStorage
          const lang = localStorage.getItem('lang');
          if (lang === 'en' || lang === 'ar') {
            savedLang = lang;
          }
        }
      }

      // Set initial language and direction
      this.setInitialLanguage(savedLang);
      resolve();
    });
  }

  private setInitialLanguage(lang: string) {
    // Set translate service language
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
    
    // Update subjects
    this.lang$.next(lang as 'en' | 'ar');
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    this.dir$.next(dir);

    // Set document attributes
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('lang', lang);
      document.cookie = `lang=${lang};path=/;max-age=31536000`; // 1 year expiry
    }

    // Set document direction and language
    this.document.documentElement.dir = dir;
    this.document.documentElement.lang = lang;

    // Store direction in transfer state for SSR
    if (isPlatformServer(this.platformId)) {
      this.transferState.set(DIRECTION_KEY, dir);
    }
  }

  private parseCookies(cookieHeader: string): { [key: string]: string } {
    return cookieHeader.split(';').reduce((cookies, cookie) => {
      const [name, value] = cookie.split('=').map(c => c.trim());
      cookies[name] = value;
      return cookies;
    }, {} as { [key: string]: string });
  }

  setLanguage(lang: string) {
    this.translate.use(lang);
    this.lang$.next(lang as 'en' | 'ar');

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('lang', lang);
      document.cookie = `lang=${lang};path=/;max-age=31536000`; // 1 year expiry
    }
    
    this.setDirection(lang);
  }

  getCurrentLanguage(): string {
    return this.translate.currentLang || this.lang$.getValue();
  }

  private setDirection(lang: string) {
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    this.dir$.next(dir);
    
    if (isPlatformServer(this.platformId)) {
      this.transferState.set(DIRECTION_KEY, dir);
    }
    
    if (isPlatformBrowser(this.platformId)) {
      this.document.documentElement.dir = dir;
      this.document.documentElement.lang = lang;
    }
  }
}
