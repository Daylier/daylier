import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageConversionComponent } from './image-conversion.component';

const routes: Routes = [{ path: '', component: ImageConversionComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ImageConversionRoutingModule { }
