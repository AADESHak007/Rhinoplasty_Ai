import React from 'react'
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
                    <img
                        src={image.url}
                        alt={`Uploaded on ${new Date(image.createdAt).toLocaleDateString()}`}
                        className="w-60 rounded shadow-lg"
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