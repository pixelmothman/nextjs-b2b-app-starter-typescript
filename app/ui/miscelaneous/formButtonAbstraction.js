'use client'

import { useFormStatus } from 'react-dom'

export default function FormButtonAbstraction({loadingText, buttonText, buttonIcon, background = true }){
    const { pending } = useFormStatus();

    const buttonIcons = {
        'delete': <svg className="group-hover:fill-red-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path d="M216,48H40a12,12,0,0,0,0,24h4V208a20,20,0,0,0,20,20H192a20,20,0,0,0,20-20V72h4a12,12,0,0,0,0-24ZM188,204H68V72H188ZM76,20A12,12,0,0,1,88,8h80a12,12,0,0,1,0,24H88A12,12,0,0,1,76,20Z"></path></svg>,
        'rightArrow': <svg className="group-hover:fill-neutral-100" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path d="M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,140H40a12,12,0,0,1,0-24H187L135.51,64.48a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z"></path></svg>
    }

    return (
        <button type="submit" className={`${
            background ? 'self-end w-fit px-4 py-2 border border-neutral-800 rounded-md shadow-sm text-sm font-bold text-neutral-800 hover:bg-neutral-800 hover:text-neutral-100 focus-visible:outline-0 focus-visible:ring-1 focus-visible:ring-black' : 'text-sm font-bold text-neutral-800 hover:underline hover:underline-offset-2'
        }`}>
        {
            pending ? loadingText : (
                buttonIcon && !buttonText ? buttonIcons[buttonIcon] : (
                    buttonIcon && buttonText ? (
                        <div className='flex flex-row gap-2'>
                            {buttonIcons[buttonIcon]}
                            {buttonText}
                        </div>
                    ) : buttonText
                )
            )
        }
        </button>
    )
};