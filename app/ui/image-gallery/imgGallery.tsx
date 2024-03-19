import { fetchImgsFromOrg } from "@/lib/data";
import ImageCarousel from "./imageCarousel";

interface ImagesList{
    counterOfFiles: number;
    listSignedURLS: string[];
}

export default async function ImageGallery(){

    const imagesList: ImagesList = await fetchImgsFromOrg();

    return <ImageCarousel imagesList={imagesList}/>
};