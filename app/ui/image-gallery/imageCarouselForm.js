'use client'

import { useFormState } from 'react-dom'
import { useFormStatus } from 'react-dom'
import { getSingedURLS } from "@/lib/actions"
import { useEffect, useState } from 'react';
import FormButtonAbstraction from '../miscelaneous/formButtonAbstraction';

export default function ImageCarouselForm({imageListCounter, offset, onOffsetChange, images, onImagesChange}){
    //for the form
    const [ formState, formAction ] = useFormState(getSingedURLS, null)
    const { pending } = useFormStatus();
    
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(loading) return; // Prevent the useEffect hook from running if a fetch request is in progress

        if(formState && formState.success === true && formState.signedURLS && offset < imageListCounter){
            setLoading(true); // Set loading to true when a fetch request starts
            onImagesChange([...images, ...formState.signedURLS]);
            console.log(offset + formState.signedURLS.length);
            onOffsetChange(offset + formState.signedURLS.length);
            setLoading(false); // Set loading to false when the fetch request is done
        }
    }, [formState]);

    return (
        <div className="group w-fit h-full flex flex-row gap-1">
            {
                imageListCounter > 4 && offset !== imageListCounter ? (
                    <form action={formAction} disabled={pending} className="flex flex-col gap-4">
                        <input autoComplete="off" type="hidden" value={
                            offset
                        } id="off-img-number" name="off-img-number" className="form-input w-full h-10 px-4 py-2 rounded-md bg-neutral-100 text-neutral-800 outline-0 ring-0 border-0 focus-visible:ring-black"/>
                        <FormButtonAbstraction loadingText="..." buttonText="Load more"/>
                    </form>
               ) : null
            }
            
        </div>
    )
};