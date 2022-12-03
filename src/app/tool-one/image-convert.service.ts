import { toBase64String } from '@angular/compiler/src/output/source_map';
import { Injectable } from '@angular/core';
import Jimp from 'jimp';
import jsPDF from 'jspdf';

Jimp.MIME_JPEG;
export let MIMETypes: string[] = [
  Jimp.MIME_JPEG,
  Jimp.MIME_PNG,
  Jimp.MIME_BMP,
  Jimp.MIME_TIFF,
  Jimp.MIME_GIF,
  'application/pdf',
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

let jsPDFTo: string[] = ['application/pdf'];

let jsPDFFrom: string[] = [
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
  ['application/pdf']: 'pdf',
};

export interface ConvertableFile {
  file: File;
  outPutMimeType: string;
  convertedFileName: string;
  convertedBase64: string | null;
  error: Error | null;
}

interface ImageDimension {
  width: number;
  height: number;
}

// Calculates the best possible position of an image on the A4 paper format,
// so that the maximal area of A4 is used and the image ratio is preserved.
const imageDimensionsOnA4 = (dimensions: ImageDimension) => {
  const isLandscapeImage = dimensions.width >= dimensions.height;

  // If the image is in landscape, the full width of A4 is used.
  if (isLandscapeImage) {
    return {
      width: A4_PAPER_DIMENSIONS.width,
      height:
        A4_PAPER_DIMENSIONS.width / (dimensions.width / dimensions.height),
    };
  }

  // If the image is in portrait and the full height of A4 would skew
  // the image ratio, we scale the image dimensions.
  const imageRatio = dimensions.width / dimensions.height;
  if (imageRatio > A4_PAPER_RATIO) {
    const imageScaleFactor =
      (A4_PAPER_RATIO * dimensions.height) / dimensions.width;

    const scaledImageHeight = A4_PAPER_DIMENSIONS.height * imageScaleFactor;

    return {
      height: scaledImageHeight,
      width: scaledImageHeight * imageRatio,
    };
  }

  // The full height of A4 can be used without skewing the image ratio.
  return {
    width: A4_PAPER_DIMENSIONS.height / (dimensions.height / dimensions.width),
    height: A4_PAPER_DIMENSIONS.height,
  };
};

// The dimensions are in millimeters.
const A4_PAPER_DIMENSIONS = {
  width: 210,
  height: 297,
};

const A4_PAPER_RATIO = A4_PAPER_DIMENSIONS.width / A4_PAPER_DIMENSIONS.height;

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
      } else if (
        jsPDFFrom.includes(newFile.file.type) &&
        jsPDFTo.includes(newFile.outPutMimeType)
      ) {
        this.jsPDFConvert(newFile.file, newFile.outPutMimeType)
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

  // converts a file using jsPDF
  private async jsPDFConvert(
    file: File,
    outputMimeType: string
  ): Promise<string> {
    let p = new Promise<string>((resolve, reject) => {
      // Default export is A4 paper, portrait, using millimeters for units.
      const doc = new jsPDF();
      // We let the images add all pages,
      // therefore the first default page can be removed.
      doc.deletePage(1);

      let imageURL = URL.createObjectURL(file);
      let image = new Image();
      image.onload = () => {
        const imageDimensions = imageDimensionsOnA4({
          width: image.width,
          height: image.height,
        });
        doc.addPage();
        doc.addImage(
          image.src,
          file.type.split('/')[1],
          // Images are vertically and horizontally centered on the page.
          (A4_PAPER_DIMENSIONS.width - imageDimensions.width) / 2,
          (A4_PAPER_DIMENSIONS.height - imageDimensions.height) / 2,
          imageDimensions.width,
          imageDimensions.height
        );

        // Creates a PDF and opens it in a new browser tab.
        const d: string = doc.output('datauristring', {
          filename: this.internalChangeExt(file, outputMimeType),
        });
        resolve(d);
      };
      image.src = imageURL;
    });

    return p;
  }

  // return the file's name with the extension changed to its outputMimeType
  private changeExt(file: ConvertableFile): string {
    return this.internalChangeExt(file.file, file.outPutMimeType);
  }

  // return the file's name with the extension changed to its outputMimeType
  private internalChangeExt(file: File, outputMimeType: string): string {
    if (!mimeToExt.hasOwnProperty(outputMimeType)) {
      throw new Error('Invalid MIME Type');
    }

    // Get the new extension for the file
    let ext = mimeToExt[outputMimeType];

    // Get the filename without the extension
    let pos = file.name.lastIndexOf('.');
    let filename = file.name.substring(0, pos < 0 ? file.name.length : pos);

    // join the new extension to the file.file.name and return
    return [filename, ext].join('.');
  }
}
