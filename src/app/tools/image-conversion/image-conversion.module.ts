import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImageConversionRoutingModule } from './image-conversion-routing.module';
import { ImageConversionComponent } from './image-conversion.component';


@NgModule({
    declarations: [
        ImageConversionComponent
    ],
    imports: [
        CommonModule,
        ImageConversionRoutingModule
    ]
})
export class ImageConversionModule { }
