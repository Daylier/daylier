import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToolOneComponent } from './tool-one.component';

const routes: Routes = [{ path: '', component: ToolOneComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToolOneRoutingModule { }
