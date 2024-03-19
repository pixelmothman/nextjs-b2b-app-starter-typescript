"use client"

import {useRedirectFunctions} from "@propelauth/nextjs/client";

export default function SignupAndLoginButtons() {
	const {redirectToSignupPage, redirectToLoginPage} = useRedirectFunctions()
	return <div className="flex flex-row gap-4">
        <button onClick={() => redirectToLoginPage()} className='w-full px-4 py-2 border border-neutral-800 rounded-md shadow-sm text-sm font-bold text-neutral-800 hover:bg-neutral-800 hover:text-neutral-100 focus-visible:outline-0 focus-visible:ring-1 focus-visible:ring-black'>
			Log in
		</button>
		<button onClick={() => redirectToSignupPage()} className="w-full px-4 py-2 border border-neutral-800 rounded-md shadow-sm text-sm font-bold text-neutral-800 hover:bg-neutral-800 hover:text-neutral-100 focus-visible:outline-0 focus-visible:ring-1 focus-visible:ring-black">
			Sign up
		</button>
	</div>
}