import React, { useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const ImageCropModal = ({ imageSrc, onCropComplete, onClose }) => {
  const [crop, setCrop] = useState({
    unit: '%',
    width: 90,
    aspect: 1, // Square crop for profile images
    x: 5,
    y: 5,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

  const handleCropChange = (newCrop) => {
    setCrop(newCrop);
  };

  const handleCropComplete = (crop) => {
    setCompletedCrop(crop);
  };

  const handleSave = async () => {
    if (!imgRef.current || !completedCrop) {
      return;
    }

    const image = imgRef.current;
    const croppedImageBlob = await getCroppedImg(image, completedCrop);
    
    // Convert blob to file
    const file = new File([croppedImageBlob], 'profile-image.jpg', { type: 'image/jpeg' });
    
    onCropComplete(file);
    onClose();
  };

  const getCroppedImg = (image, crop) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.95);
    });
  };

  return (
    <div className="crop-modal-overlay" onClick={onClose}>
      <div className="crop-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="crop-modal-header">
          <h3>تعديل الصورة الشخصية</h3>
          <button className="crop-modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="crop-modal-body">
          {imageSrc && (
            <ReactCrop
              crop={crop}
              onChange={handleCropChange}
              onComplete={handleCropComplete}
              aspect={1}
              minWidth={50}
            >
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Crop preview"
                style={{ maxWidth: '100%', maxHeight: '400px' }}
              />
            </ReactCrop>
          )}
        </div>
        
        <div className="crop-modal-footer">
          <button className="crop-btn crop-btn-cancel" onClick={onClose}>
            إلغاء
          </button>
          <button 
            className="crop-btn crop-btn-save" 
            onClick={handleSave}
            disabled={!completedCrop}
          >
            حفظ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
