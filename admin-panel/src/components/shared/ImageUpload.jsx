import React from 'react';
import imageCompression from 'browser-image-compression';

function ImageUpload({ value, onChange }) {
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const compressedFile = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1024 });
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      onChange(base64);
    };
    reader.readAsDataURL(compressedFile);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {value && (
        <div>
          <p>Preview:</p>
          <img src={value} alt="preview" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      )}
    </div>
  );
}
export default ImageUpload;
