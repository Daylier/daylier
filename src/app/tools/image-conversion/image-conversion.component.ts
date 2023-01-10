import { Component, OnInit } from '@angular/core';
import { ImageConvertService, ConvertibleFile } from './image-convert.service';

const MIMETypes: string[] = [
    'image/jpeg',
    'image/png',
    'image/bmp',
    'image/tiff',
    'image/gif',
    'application/pdf',
];

@Component({
    templateUrl: './image-conversion.component.html',
    styleUrls: ['./image-conversion.component.scss'],
})
export class ImageConversionComponent implements OnInit {
    constructor(private imageConvertService: ImageConvertService) {}

    mimeTypes: string[] = MIMETypes;
    outputMimeType: string = MIMETypes[0];
    files: ConvertibleFile[] = [];

    convertImage(): void {
        if (this.files.length == 0 || !this.outputMimeType) {
        return;
        }
        for (let i = 0; i < this.files.length; i++) {
        if (this.files[i].convertedBase64 || this.files[i].error) {
            continue;
        }
        console.log(`I promise (${i}).`)
        this.imageConvertService
            .convertImage(this.files[i])
            .then((file: ConvertibleFile) => {
                this.files[i] = file;
                console.log(`Told ya (${i}).`)
            })
            .catch((file: ConvertibleFile) => {
                this.files[i] = file;
            });
        }

        console.log('hey yah');
    }

    downloadImage(file: ConvertibleFile, event: Event) {
        let a: any = document.createElement('a');
        if (!a) {
            return;
        }
        a.href = file.convertedBase64;
        a.download = file.convertedFileName;
        a.click();
    }

    onFileOutputMimeTypeChange(file: ConvertibleFile, event: Event): void {
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

    deleteFile(file: ConvertibleFile): void {
        this.files = this.files.filter((f) => f != file);
    }

    ngOnInit(): void {}
}


// dropZoneElement.addEventListener("drop", (e) => {
//   e.preventDefault();
// if (e.dataTransfer.files.length) {
//     inputElement.files = e.dataTransfer.files;
//     updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
//   }
// dropZoneElement.classList.remove("drop-zone--over");
// });
// });
