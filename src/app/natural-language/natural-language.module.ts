import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TypeaheadModule } from 'ngx-bootstrap';



import { NaturalLanguageComponent } from './natural-language.component';

@NgModule ({
  imports: [
    CommonModule,
    FormsModule,
    TypeaheadModule.forRoot()
  ],
  declarations: [
    NaturalLanguageComponent
  ],
  exports: [
    NaturalLanguageComponent
  ]
})

export class NaturalLanguageModule {}



