import { fetchImgsFromOrg } from "@/lib/data";
import ImageCarousel from "./imageCarousel";

export default async function ImageGallery(){

    const imagesList = await fetchImgsFromOrg();

    return <ImageCarousel imagesList={imagesList}/>
};