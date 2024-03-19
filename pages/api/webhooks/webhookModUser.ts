import { Webhook } from "svix";
import { propelauth } from "@/lib/propelauth";
import { getSupabaseClient } from "@/lib/supabase";
import type { NextApiRequest, NextApiResponse } from 'next'

export const config = {
    api: {
        bodyParser: false,
    },
};

const secret = process.env.SVIX_WEBHOOK_MOD_USER;

type ResponseData = {
    message?: string;
    error?: string;
};

export default async function POST(request: NextApiRequest, response: NextApiResponse<ResponseData>) {

    console.log("Webhook received! Verifying...");

    //check if the method is POST
    if(request.method !== "POST"){
        response.status(405).json({
            error: "Method not allowed"
        });
    }

    //check if the secret is defined
    if(typeof secret === "undefined"){
        return response.status(500).json({
            error: "Internal server error"
        });
    }

    //read the request
    const payload = request.body;
    const headers: any = request.headers;

    //verify the webhook
    const wh = new Webhook(secret);
    let msg: any;
    try {
        msg = wh.verify(payload, headers);
    } catch (err) {
        return response.status(400).json({});
    }

    console.log("Webhook verified! Starting to process...");

    //extract useful information from the webhook
    const { user_id } = msg;

    //get the supabase client
    const supabase = await getSupabaseClient();

    //get user metadata from PropelAuth
    const UserMetadataByUserId = await propelauth.fetchUserMetadataByUserId(user_id);

    //check for errors
    if(!UserMetadataByUserId){
        return response.status(500).json({
            error: "Error fetching data from PropelAuth"
        });
    };

    //get the new email of the user from PropelAuth
    const email = UserMetadataByUserId.email;

    //update data from the database
    const { error } = await supabase.from("user_table").update({user_email: email}).eq("user_id", user_id);

    //check for errors
    if(error){
        console.log("Error inserting data into the database: ", error);
        return response.status(500).json({
            error: "Error inserting data into the database"
        });
    }

    return response.json({message: "Webhook processed successfully!"});
};