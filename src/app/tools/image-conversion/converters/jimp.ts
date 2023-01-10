import Jimp from 'jimp';

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

export class JimpConverter {
    constructor() {}

    converts(inputMimeType: string, outputMimeType: string): boolean {
        console.log(
        `jimp converts from ${inputMimeType}: ${jimpFrom.includes(
            inputMimeType
        )} to ${outputMimeType}: ${jimpTo.includes(outputMimeType)}`
        );
        return jimpFrom.includes(inputMimeType) && jimpTo.includes(outputMimeType);
    }

    // converts a file using Jimp
    async convert(file: File, outputMimeType: string): Promise<string> {
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
}
