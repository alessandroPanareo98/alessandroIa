import { Component, EventEmitter, Input, Output } from '@angular/core';

export type AppSection =
  | 'home'
  | 'chat'
  | 'communities'
  | 'knowledge'
  | 'rules'
  | 'settings';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent {

  @Input()
  activeSection: AppSection = 'home';

  @Output()
  sectionChange = new EventEmitter<AppSection>();

  navigate(section: AppSection): void {
    this.activeSection = section;
    this.sectionChange.emit(section);
  }

}