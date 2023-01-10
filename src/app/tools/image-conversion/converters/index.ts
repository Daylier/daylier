import Jimp from 'jimp';

export interface Converter {
    convert(file: File, outputMimeType: string): Promise<string>;
    converts(inputMimeType: string, outputMimeType: string): boolean;
}

export let MimeToExt: { [key: string]: string } = {
    'image/jpg': 'jpg',
    [Jimp.MIME_JPEG]: 'jpeg',
    [Jimp.MIME_PNG]: 'png',
    [Jimp.MIME_BMP]: 'bmp',
    [Jimp.MIME_TIFF]: 'tiff',
    [Jimp.MIME_GIF]: 'gif',
    'application/pdf': 'pdf',
};

// return the file's name with the extension changed to its outputMimeType
export function ChangeExt(fileName: string, outputMimeType: string): string {
    if (!MimeToExt.hasOwnProperty(outputMimeType)) {
        throw new Error('Invalid MIME Type');
    }

    // Get the new extension for the file
    let ext = MimeToExt[outputMimeType];

    // Get the filename without the extension
    let pos = fileName.lastIndexOf('.');
    let filename = fileName.substring(0, pos < 0 ? fileName.length : pos);

    // join the new extension to the file.file.name and return
    return [filename, ext].join('.');
}
