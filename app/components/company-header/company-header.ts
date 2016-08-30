import { Component, Input } from '@angular/core';

@Component({
  selector: 'company-header',
  templateUrl: 'build/components/company-header/company-header.html'
})
export class CompanyHeader {

  @Input() company: any;

  constructor() {
  }
}
