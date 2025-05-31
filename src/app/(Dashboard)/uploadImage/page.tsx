import DisplayImage from '@/app/components/DisplayImage'
import UploadForm from '@/app/components/UploadForm'
import getImages from '@/lib/actions/retrieveImages'
import React from 'react'

const page = async () => {
  const imageDataRaw = await getImages();
  const imageData = imageDataRaw.map((img: { id: string; url: string; createdAt: Date }) => ({
    ...img,
    createdAt: img.createdAt.toISOString(),
  }));
  return (
    <div className='mx-auto w-full h-screen p-2'>
      <h1 className='text-2xl font-bold mb-4'>Upload Image</h1>
      <UploadForm />
      <div className='mt-8 w-full h-full p-2 '>
        <DisplayImage imageData={imageData} />
      </div>
    </div>
  )
}

export default page