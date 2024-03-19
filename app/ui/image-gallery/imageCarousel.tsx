'use client'

import { useEffect, useState } from "react";
import ImageCarouselForm from "./imageCarouselForm";

export default function ImageCarousel({imagesList}){

    const [images, setImages] = useState([]);
    const [offset, setOffset] = useState(4);

    useEffect(() => {
        if(imagesList?.counterOfFiles > 0){
            setImages(imagesList.listSignedURLS);
        };
    }, []);

    const handleOffsetChange = (newOffset) => {
        setOffset(newOffset);
    };

    const handleImagesChange = (newImages) => {
        setImages(newImages);
    };

    return (
        <>
            {
                images && images
                .length > 0 ? (
                    <div className="w-full h-full overflow-hidden">
                        <div className="w-full flex flex-row items-center justify-between pb-4">
                            <span className="text-neutral-800 font-semibold">
                            {`Images: ${imagesList?.counterOfFiles}`}
                            </span>
                            <ImageCarouselForm imageListCounter={imagesList.counterOfFiles} offset={offset} onOffsetChange={handleOffsetChange} images={images} onImagesChange={handleImagesChange}/>
                        </div>
                        <div className="h-full grid grid-cols-4 gap-12 overflow-y-auto">
                        {
                            images.map((image, index) => {
                                return (
                                    <div className={`w-full h-full ${
                                        images.length > 4 && offset !== imagesList.counterOfFiles && index >= images.length - 4 ? 'mb-12' : ''
                                    } `}>
                                        <img src={image} key={index} className="rounded-sm"/>
                                    </div>
                                )
                            })
                        }
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center rounded-sm bg-white border border-neutral-800 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><path d="M216,40H72A16,16,0,0,0,56,56V72H40A16,16,0,0,0,24,88V200a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V184h16a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM72,56H216v62.75l-10.07-10.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L72,109.37ZM184,200H40V88H56v80a16,16,0,0,0,16,16H184Zm32-32H72V132l36-36,49.66,49.66a8,8,0,0,0,11.31,0L194.63,120,216,141.38V168ZM160,84a12,12,0,1,1,12,12A12,12,0,0,1,160,84Z"></path></svg>
                        <span className="font-medium text-base text-neutral-900">
                            No images to show
                        </span>
                    </div>
                )
            }
        </>
        
    )
};