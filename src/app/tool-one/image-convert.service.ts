import { Injectable } from '@angular/core';
import Jimp from 'jimp';

export type MIMEType = string;

export const MIME_JPG: MIMEType = 'image/jpg';
export const MIME_JPEG: MIMEType = 'image/jpeg';
export const MIME_PNG: MIMEType = 'image/png';
export const MIME_BMP: MIMEType = 'image/bmp';
export const MIME_TIFF: MIMEType = 'image/tiff';
export const MIME_GIF: MIMEType = 'image/gif';

let jimpTo: MIMEType[] = [
  MIME_JPG,
  MIME_JPEG,
  MIME_PNG,
  MIME_BMP,
  MIME_TIFF,
  MIME_GIF,
];
let jimpFrom: MIMEType[] = [
  MIME_JPG,
  MIME_JPEG,
  MIME_PNG,
  MIME_BMP,
  MIME_TIFF,
  MIME_GIF,
];

@Injectable({
  providedIn: 'root',
})
export class ImageConvertService {
  constructor() {}

  convertImage(file: File, outputMimeType: MIMEType): Promise<string> {
    if (jimpFrom.includes(file.type) && jimpTo.includes(outputMimeType)) {
      return this.jimpConvert(file, outputMimeType);
    }
    throw new Error('Unsupported conversion');
  }

  private async jimpConvert(
    file: File,
    outputMimeType: MIMEType
  ): Promise<string> {
    let arrayBuffer: ArrayBuffer;
    try {
      arrayBuffer = await file.arrayBuffer();
    } catch (error) {
      console.log(error);
      throw new Error('Error converting image to array buffer');
    }

    let buffer: Buffer = Buffer.from(arrayBuffer);

    let image: Jimp;
    try {
      image = await Jimp.read(buffer);
    } catch (error) {
      console.log(error);
      throw new Error('Error reading image');
    }

    try {
      let base64Src = await image.getBase64Async(Jimp.MIME_JPEG);
      return base64Src;
    } catch (error) {
      console.log(error);
      throw Error('Error converting image to base64');
    }
  }
}
