import React from 'react'
import Image from 'next/image'
interface imageDataProps {
    imageData: {
        id: string;
        url: string;
        createdAt: string;
    }[];
}
const DisplayImage = ({imageData} : imageDataProps) => {
  
    return (
    <div>
        {imageData.map((image)=>{
            return (
                <div key={image.id} className="mb-4">
                    <Image
                        src={image.url}
                        alt={`Uploaded on ${new Date(image.createdAt).toLocaleDateString()}`}
                        width={240}
                        height={240}
                        className="rounded shadow-lg"
                        unoptimized
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Uploaded on: {new Date(image.createdAt).toLocaleDateString()}
                    </p>
                    
                </div>
            )
        })} 
        <p className="mt-2 text-gray-600">Select atleast 3 Images of yourself</p>     
    </div>
  )
}

export default DisplayImage