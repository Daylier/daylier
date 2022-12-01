import { Component, OnInit } from '@angular/core';
import { ImageConvertService, MIMEType } from './image-convert.service';

@Component({
  selector: 'app-tool-one',
  templateUrl: './tool-one.component.html',
  styleUrls: ['./tool-one.component.scss'],
})
export class ToolOneComponent implements OnInit {
  constructor(private imageConvertService: ImageConvertService) {}

  convertImage(file: File, outputMimeType: MIMEType): void {
    this.imageConvertService.convertImage().then((result) => {
      console.log(result);
    });
  }

  ngOnInit(): void {
    this.convertImage();
  }
}
