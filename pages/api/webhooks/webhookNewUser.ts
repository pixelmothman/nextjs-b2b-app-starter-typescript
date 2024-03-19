import { Webhook } from "svix";
import { propelauth } from "@/lib/propelauth";
import { getSupabaseClient } from "@/lib/supabase";
import type { NextApiRequest, NextApiResponse } from 'next'

export const config = {
    api: {
        bodyParser: false,
    },
};

const secret = process.env.SVIX_WEBHOOK_NEW_USER;

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
        response.status(400).json({});
    }

    console.log("Webhook verified! Starting to process...");

    //extract useful information from the webhook
    const {org_id, user_id, role} = msg;

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

    //get the supabase client
    const supabase = await getSupabaseClient();

    //insert data into the database
    const { error } = await supabase.from("user_table").insert({
        user_id: user_id,
        org_id: org_id,
        user_email: email,
        user_role: role,
    })

    //check for errors
    if(error){
        console.log("Error inserting data into the database: ", error);
        return response.status(500).json({
            error: "Error inserting data into the database"
        });
    }

    return response.json({message: "Webhook processed successfully!"});
};