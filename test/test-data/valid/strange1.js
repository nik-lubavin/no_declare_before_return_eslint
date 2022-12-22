function a() {
    // let fsFile;
    let height;
    // let metadata;
    let width;
    switch (data.type) {
        case 'avatar':
            try {
                ({ width, height } = libImageHelpers.getImageSize(data.upload.path));

            } catch (err) {
                log.error('<< ERRORLEVEL: UPLOAD >>', err.stack);
                throw E.generic('Unable to process uploaded file; please try again.');
            }

            return metadata;

        case 'relFile': case 'mdExcel': {
            metadata = {
                uploadType: data.type,
                name: data.upload.name,
                size: data.upload.size,
                type: data.upload.type,
            };

            const fileInput = data.upload.stream ? data.upload.stream : data.upload.path;
            fsFile = this.new().insert(fileInput, metadata);
            metadata.fileID = fsFile.id;
            metadata.id = fsFile.name;
            metadata.gridID = fsFile.name;
            metadata.link = fsFile.link;

            return metadata;
        }

        case 'image': {
            try {
                ({ width, height } = libImageHelpers.getImageSize(data.upload.path));

                const imageHasMaxDimensions = maxWidth && (maxWidth > 0) && maxHeight && (maxHeight > 0);
                const imageSurpassMaxDimensions = (width > maxWidth) || (height > maxHeight);

                if (imageHasMaxDimensions && imageSurpassMaxDimensions) {
                    if (resizeOnSurpassDimensions) {
                        // Resize the image and perform no scaling.
                        libImageHelpers.resizeImageSync(data.upload.path, maxWidth, maxHeight, false);
                    } else {
                        throw E.validation(`Uploaded image surpasses the mandatory dimensions. Please upload a picture with a maximum of ${maxWidth}x${maxHeight} pixels.`);
                    }
                }

                return metadata;
            } catch (error) {
            }
        }

    }

    return undefined;
}