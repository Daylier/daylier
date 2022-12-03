import { Component, OnInit } from '@angular/core';
import {
  ImageConvertService,
  MIMETypes,
  ConvertableFile,
} from './image-convert.service';

@Component({
  selector: 'app-tool-one',
  templateUrl: './tool-one.component.html',
  styleUrls: ['./tool-one.component.scss'],
})
export class ToolOneComponent implements OnInit {
  constructor(private imageConvertService: ImageConvertService) {}

  mimeTypes: string[] = MIMETypes;
  outputMimeType: string = MIMETypes[0];
  files: ConvertableFile[] = [];

  convertImage(): void {
    if (this.files.length == 0 || !this.outputMimeType) {
      return;
    }
    for (let i = 0; i < this.files.length; i++) {
      if (this.files[i].convertedBase64 || this.files[i].error) {
        continue;
      }
      this.imageConvertService
        .convertImage(this.files[i])
        .then((file: ConvertableFile) => {
          this.files[i] = file;
        })
        .catch((file: ConvertableFile) => {
          this.files[i] = file;
        });
    }
  }

  downloadImage(file: ConvertableFile, event: Event) {
    let a: any = document.createElement('a');
    if (!a) {
      return;
    }
    a.href = file.convertedBase64;
    a.download = file.convertedFileName;
    a.click();
  }

  onFileOutputMimeTypeChange(file: ConvertableFile, event: Event): void {
    let target = <HTMLInputElement>event.target;
    let foundFile = this.files.find((f) => f == file);
    if (!foundFile) {
      return;
    }
    foundFile.outPutMimeType = target.value;
  }

  onFileChange(event: any): void {
    let target = <HTMLInputElement>event.target;
    if (!target.files) {
      return;
    }
    for (let i = 0; i < target.files.length; i++) {
      console.log(this.outputMimeType);
      this.files.push({
        file: target.files[i],
        convertedFileName: target.files[i].name,
        outPutMimeType: this.outputMimeType,
        convertedBase64: '',
        error: null,
      });
    }
  }

  onOutputMimeTypeChange(event: Event): void {
    let target = <HTMLInputElement>event.target;
    this.outputMimeType = target.value;
  }

  deleteFile(file: ConvertableFile): void {
    this.files = this.files.filter((f) => f != file);
  }

  ngOnInit(): void {}
}
