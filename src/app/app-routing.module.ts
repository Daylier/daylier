import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
    { path: '', redirectTo: '/image-conversion', pathMatch: 'full' },
    { path: 'image-conversion', loadChildren: () => import('./tools/image-conversion/image-conversion.module').then(m => m.ImageConversionModule) },
    { path: '**', component: PageNotFoundComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
