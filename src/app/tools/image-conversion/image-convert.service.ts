import { Injectable } from '@angular/core';
import { Converter, ChangeExt } from './converters';
import { JimpConverter } from './converters/jimp';
import { JsPDFConverter } from './converters/js-pdf';

export interface ConvertibleFile {
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

@Injectable({
    providedIn: 'root',
})
export class ImageConvertService {
    private converters: Converter[] = [];
    constructor() {
        this.converters.push(new JimpConverter());
        this.converters.push(new JsPDFConverter());
    }

    // given a file, return it converted to the outputMimeType
    async convertImage(file: ConvertibleFile): Promise<ConvertibleFile> {
        // feel like i should make a copy of the file here
        let newFile: ConvertibleFile = {
            file: file.file,
            outPutMimeType: file.outPutMimeType,
            convertedFileName: '',
            convertedBase64: null,
            error: null,
        };

        console.log(`converting from ${file.file.type} to ${file.outPutMimeType}`);
        try {
        for (let converter of this.converters) {
            if (converter.converts(file.file.type, file.outPutMimeType)) {
            newFile.convertedFileName = ChangeExt(
                newFile.file.name,
                newFile.outPutMimeType
            );
            newFile.convertedBase64 = await converter.convert(
                newFile.file,
                newFile.outPutMimeType
            );
            }
        }
        } catch (error: any) {
            newFile.error = error;
        }

        return newFile;
    }
}
