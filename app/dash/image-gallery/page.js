import ImageGallery from "@/app/ui/image-gallery/imgGallery";
import StyledDropzone from "@/app/ui/image-gallery/uploadImageForm";
import StyledDropzoneMultipleImages from "@/app/ui/image-gallery/uploadImagesForm";

export default async function ImagesPage(){

    return (
        <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-4">
            <StyledDropzone/>
            <StyledDropzoneMultipleImages/>
            <div className="col-span-2 max-h-[372px] p-5 rounded-sm bg-white border border-neutral-800 shadow-sm overflow-hidden">
                <ImageGallery/>
            </div>
        </div>
    )
};