function a() {
    let fsFile; let height; let metadata; let
        width;
      switch (data.type) {
        case 'avatar':
          try {
            libImageHelpers.resizeImageSync(data.upload.path, 384, 384);
  
            ({ width, height } = libImageHelpers.getImageSize(data.upload.path));
  
            metadata = {
              uploadType: data.type,
              name: data.upload.name,
              size: data.upload.size,
              type: data.upload.type,
              w: width,
              h: height,
            };
  
            fsFile = this.new().insert(data.upload.path, metadata);
          } catch (err) {
            log.error('<< ERRORLEVEL: UPLOAD >>', err.stack);
            throw E.generic('Unable to process uploaded file; please try again.');
          }
  
          metadata.id = fsFile.name;
          metadata.fileID = fsFile.id;
          metadata.gridID = fsFile.name;
  
          return metadata;
  
          // case 'relFile': case 'mdExcel': {
          //     metadata = {
          //         uploadType: data.type,
          //         name: data.upload.name,
          //         size: data.upload.size,
          //         type: data.upload.type,
          //     };
  
          //     const fileInput = data.upload.stream ? data.upload.stream : data.upload.path;
          //     fsFile = this.new().insert(fileInput, metadata);
          //     metadata.fileID = fsFile.id;
          //     metadata.id = fsFile.name;
          //     metadata.gridID = fsFile.name;
          //     metadata.link = fsFile.link;
  
          //     return metadata;
          // }
  
          // case 'image': {
          //     try {
          //         ({ width, height } = libImageHelpers.getImageSize(data.upload.path));
  
          //         const imageHasMaxDimensions = maxWidth && (maxWidth > 0) && maxHeight && (maxHeight > 0);
          //         const imageSurpassMaxDimensions = (width > maxWidth) || (height > maxHeight);
  
          //         if (imageHasMaxDimensions && imageSurpassMaxDimensions) {
          //             if (resizeOnSurpassDimensions) {
          //                 // Resize the image and perform no scaling.
          //                 libImageHelpers.resizeImageSync(data.upload.path, maxWidth, maxHeight, false);
          //             } else {
          //                 throw E.validation(`Uploaded image surpasses the mandatory dimensions. Please upload a picture with a maximum of ${maxWidth}x${maxHeight} pixels.`);
          //             }
          //         }
  
          //         return metadata;
          //     } catch (error) {
          //     }
          // }
  
      }
  
      return undefined;
  }