import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageConversionComponent } from './image-conversion.component';

describe('ToolOneComponent', () => {
    let component: ImageConversionComponent;
    let fixture: ComponentFixture<ImageConversionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ ImageConversionComponent ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ImageConversionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
