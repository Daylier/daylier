import { Injectable } from '@angular/core';
import Jimp from 'jimp';

Jimp.MIME_JPEG;
export let MIMETypes: string[] = [
  Jimp.MIME_JPEG,
  Jimp.MIME_PNG,
  Jimp.MIME_BMP,
  Jimp.MIME_TIFF,
  Jimp.MIME_GIF,
];

let jimpTo: string[] = [
  Jimp.MIME_JPEG,
  Jimp.MIME_PNG,
  Jimp.MIME_BMP,
  Jimp.MIME_TIFF,
  Jimp.MIME_GIF,
];
let jimpFrom: string[] = [
  'image/jpg',
  Jimp.MIME_JPEG,
  Jimp.MIME_PNG,
  Jimp.MIME_BMP,
  Jimp.MIME_TIFF,
  Jimp.MIME_GIF,
];

let mimeToExt: { [key: string]: string } = {
  'image/jpg': 'jpg',
  [Jimp.MIME_JPEG]: 'jpeg',
  [Jimp.MIME_PNG]: 'png',
  [Jimp.MIME_BMP]: 'bmp',
  [Jimp.MIME_TIFF]: 'tiff',
  [Jimp.MIME_GIF]: 'gif',
};

export interface ConvertableFile {
  file: File;
  outPutMimeType: string;
  convertedFileName: string;
  convertedBase64: string | null;
  error: Error | null;
}

@Injectable({
  providedIn: 'root',
})
export class ImageConvertService {
  constructor() {}

  // given a file, return it converted to the outputMimeType
  convertImage(file: ConvertableFile): Promise<ConvertableFile> {
    // feel like i should make a copy of the file here
    let newFile: ConvertableFile = {
      file: file.file,
      outPutMimeType: file.outPutMimeType,
      convertedFileName: file.file.name,
      convertedBase64: '',
      error: null,
    };
    let p = new Promise<ConvertableFile>((resolve, reject) => {
      if (
        jimpFrom.includes(newFile.file.type) &&
        jimpTo.includes(newFile.outPutMimeType)
      ) {
        this.jimpConvert(newFile.file, newFile.outPutMimeType)
          .then((data) => {
            // able to convert
            newFile.convertedFileName = this.changeExt(newFile);
            newFile.convertedBase64 = data;
            newFile.error = null;
          })
          .catch((error) => {
            // failed to convert
            newFile.convertedBase64 = null;
            newFile.error = error;
          })
          .finally(() => {
            // always resolve with file
            resolve(newFile);
          });
      } else {
        // if we don't support just reosolve with file
        file.error = new Error('Unsupported file type');
        resolve(file);
      }
    });
    return p;
  }

  // converts a file using Jimp
  private async jimpConvert(
    file: File,
    outputMimeType: string
  ): Promise<string> {
    let arrayBuffer: ArrayBuffer;
    try {
      arrayBuffer = await file.arrayBuffer();
    } catch (error) {
      throw new Error('Error converting image to array buffer');
    }

    let buffer: Buffer = Buffer.from(arrayBuffer);

    let image: Jimp;
    try {
      image = await Jimp.read(buffer);
    } catch (error) {
      throw new Error('Error reading image');
    }

    try {
      let data = await image.getBufferAsync(outputMimeType);
      return 'data:' + outputMimeType + ';base64,' + data.toString('base64');
    } catch (error) {
      throw Error('Error converting image to base64');
    }
  }

  // return the file's name with the extension changed to its outputMimeType
  private changeExt(file: ConvertableFile): string {
    if (!mimeToExt.hasOwnProperty(file.outPutMimeType)) {
      throw new Error('Invalid MIME Type');
    }

    // Get the new extension for the file
    let ext = mimeToExt[file.outPutMimeType];

    // Get the filename without the extension
    let pos = file.file.name.lastIndexOf('.');
    let filename = file.file.name.substring(
      0,
      pos < 0 ? file.file.name.length : pos
    );

    // join the new extension to the file.file.name and return
    return [filename, ext].join('.');
  }
}
