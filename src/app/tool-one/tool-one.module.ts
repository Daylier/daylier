import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToolOneRoutingModule } from './tool-one-routing.module';
import { ToolOneComponent } from './tool-one.component';


@NgModule({
  declarations: [
    ToolOneComponent
  ],
  imports: [
    CommonModule,
    ToolOneRoutingModule
  ]
})
export class ToolOneModule { }
