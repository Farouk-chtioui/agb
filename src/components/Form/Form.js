import React, { useState, useEffect } from 'react';
import './Form.css'; // Import the CSS file
import img from '../../images/Group3.png'
const Form = ({
  formData,
  handleChange,
  handleSubmit,
  setShowForm,
  isEditMode,
  title,
  fields
}) => {
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (isEditMode && formData) {
      fields.forEach(field => {
        if (field.type !== 'file') {
          handleChange({ target: { name: field.name, value: formData[field.name] || '' } });
        }
      });
    }
  }, [isEditMode, formData, handleChange, fields]);

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(e);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        handleChange({
          target: {
            name: e.target.name,
            value: base64String
          }
        });
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-1/2 h-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-blue-600 font-custom">
            {title}
          </h2>
          <button
            className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-2xl"
            onClick={() => setShowForm(false)}
          >
            &times;
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {fields.map((field, index) => (
              <div key={index} className={`col-span-${field.colSpan || 2}`}>
                <label className="block text-blue-700 mb-2">{field.label}</label>
                {field.type === 'file' ? (
                  <div className="file-upload-container">
                    <label htmlFor="file-upload" className="file-upload-label">
                      <div className="file-upload-placeholder">
                        <img src={img} alt="Upload" />
                        <p>Choose a file or drag & drop it here</p>
                      </div>
                      <input
                        id="file-upload"
                        type="file"
                        name={field.name}
                        onChange={handleFileChange}
                      />
                    </label>
                    {imagePreview && (
                      <div className="image-preview-container">
                        <img src={imagePreview} alt="Preview" className="image-preview" />
                      </div>
                    )}
                    <p className="file-upload-hint">JPEG, PNG, PDF, and MP4 formats, up to 50MB</p>
                  </div>
                ) : (
                  <input
                    className="border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-600"
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <button
              className="bg-blue-500 text-white px-12 py-3 rounded-full shadow hover:bg-blue-600 transition"
              type="submit"
            >
              {isEditMode ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
