import { Component, Input } from '@angular/core';

@Component({
  selector: 'company-detail',
  templateUrl: 'build/components/company-detail/company-detail.html'
})
export class CompanyDetail {

  @Input() company: any;

  constructor() {
  }
}
