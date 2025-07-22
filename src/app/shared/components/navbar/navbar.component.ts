import { Component } from '@angular/core';
import { LanguageService } from '../../service/language.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  constructor(
    private langService: LanguageService
  ) { }

  changeLanguage(lang: string) {
    this.langService.setLanguage(lang);
  }
}
