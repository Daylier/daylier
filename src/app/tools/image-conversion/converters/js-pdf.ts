import Jimp from 'jimp';
import jsPDF from 'jspdf';
import { ChangeExt } from '.';

let jsPDFTo: string[] = ['application/pdf'];

let jsPDFFrom: string[] = [
    'image/jpg',
    Jimp.MIME_JPEG,
    Jimp.MIME_PNG,
    Jimp.MIME_BMP,
    Jimp.MIME_TIFF,
    Jimp.MIME_GIF,
];

interface ImageDimension {
    width: number;
    height: number;
}

// The dimensions are in millimeters.
const A4_PAPER_DIMENSIONS = {
    width: 210,
    height: 297,
};

const A4_PAPER_RATIO = A4_PAPER_DIMENSIONS.width / A4_PAPER_DIMENSIONS.height;

export class JsPDFConverter {
    constructor() {}

    converts(inputMimeType: string, outputMimeType: string): boolean {
        console.log(
            `jsPDF converts from ${inputMimeType}: ${jsPDFFrom.includes(
                inputMimeType
            )} to ${outputMimeType}: ${jsPDFTo.includes(outputMimeType)}`
        );
        return (
            jsPDFFrom.includes(inputMimeType) && jsPDFTo.includes(outputMimeType)
        );
    }

    // converts a file using jsPDF
    async convert(file: File, outputMimeType: string): Promise<string> {
        let p = new Promise<string>((resolve, reject) => {
            // Default export is A4 paper, portrait, using millimeters for units.
            const doc = new jsPDF();
            // We let the images add all pages,
            // therefore the first default page can be removed.
            doc.deletePage(1);

            let imageURL = URL.createObjectURL(file);
            let image = new Image();
            image.onload = () => {
                const imageDimensions = this.imageDimensionsOnA4({
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
                    filename: ChangeExt(file.name, outputMimeType),
                });
                resolve(d);
            };
            image.src = imageURL;
        });

        return p;
    }

    // Calculates the best possible position of an image on the A4 paper format,
    // so that the maximal area of A4 is used and the image ratio is preserved.
    private imageDimensionsOnA4 = (dimensions: ImageDimension) => {
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
}
