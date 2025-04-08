// ImageUpload.js
import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';

const ImageUpload = () => {
  const [compressedFile, setCompressedFile] = useState(null);

  const handleImageUpload = async (e) => {
    const imageFile = e.target.files[0];
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };

    try {
      const compressed = await imageCompression(imageFile, options);
      setCompressedFile(compressed);
      console.log('Compressed file:', compressed);

      // TODO: Upload to server using FormData
      const formData = new FormData();
      formData.append('image', compressed);

      await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData,
      });

      alert('Image uploaded!');
    } catch (error) {
      console.error('Compression error:', error);
    }
  };

  return (
    <div className="p-4">
      <input type="file" accept="image/*" onChange={handleImageUpload} />
    </div>
  );
};

export default ImageUpload;
