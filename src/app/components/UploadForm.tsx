// components/UploadForm.tsx
'use client';

import React, { useState } from 'react';

export default function UploadForm() {
  const [imageUrl, setImageUrl] = useState('');

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem('file') as HTMLInputElement;

    if (!fileInput?.files?.length) return;

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setImageUrl(data.secure_url);
  };

  return (
    <form onSubmit={handleUpload}>
      <input type="file" name="file" className='p-1 border-2 border-amber-100 rounded-b-md ' accept="image/*" required />
      <button type="submit" className="bg-blue-500 text-white px-3 py-1 mt-2 border-amber-100 rounded-full">Upload</button>

      {imageUrl && (
        <div className="mt-4">
          <p className="text-green-500">Uploaded Successfully:</p>
          <img src={imageUrl} alt="Uploaded" className="w-60 rounded mt-2" />
        </div>
      )}
    </form>
  );
}
