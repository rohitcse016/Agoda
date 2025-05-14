import React, { useState, useEffect } from 'react';
import imageCompression from 'browser-image-compression';

function ImageUploadMultipart({ value = [], onChange }) {
  const [previews, setPreviews] = useState([]);
  const [updatedFiles, setUdatedFiles] = useState([]);

  useEffect(() => {
    if (Array.isArray(value)) {
      const previewUrls = value.map(file => ({
        url: URL.createObjectURL(file),
        name: file.name,
      }));
      setPreviews(previewUrls);
    }
  }, [updatedFiles]);

  const handleFileChange = async (e) => {
    const newFiles = Array.from(e.target.files);
    if (newFiles.length === 0) return;

    const compressedFiles = await Promise.all(
      newFiles.map(file =>
        imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
        })
      )
    );

    const updatedFiles = [...value, ...compressedFiles];
    onChange?.(updatedFiles);
    setUdatedFiles(updatedFiles)
  };

  const handleRemove = (indexToRemove) => {
    const updatedFiles = value.filter((_, idx) => idx !== indexToRemove);
    onChange?.(updatedFiles);
    setUdatedFiles(updatedFiles)
  };

  return (
    <div>
      <input type="file" accept="image/*" multiple onChange={handleFileChange} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
        {previews.map((img, index) => (
          <div key={index} style={{ position: 'relative' }}>
            <img
              src={img.url}
              alt={`preview-${index}`}
              style={{ width: 100, height: 'auto', borderRadius: 4, objectFit: 'cover' }}
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                background: '#f5222d',
                color: '#fff',
                border: 'none',
                borderRadius: '0 0 0 4px',
                padding: '2px 6px',
                cursor: 'pointer',
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageUploadMultipart;
