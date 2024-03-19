import { Webhook } from "svix";
import { getSupabaseClient } from "@/lib/supabase";
import type { NextApiRequest, NextApiResponse } from 'next'
import { buffer } from "stream/consumers";

export const config = {
    api: {
        bodyParser: false,
    },
};

const secret = process.env.SVIX_WEBHOOK_NEW_ORG;

type ResponseData = {
    message?: string;
    error?: string;
};

export default async function POST(request: NextApiRequest, response: NextApiResponse<ResponseData>) {

    console.log("Webhook received! Verifying...");

    //check if the method is POST
    if(request.method !== "POST"){
        return response.status(405).json({
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
    const payload = (await buffer(request)).toString();
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
    const { org_id, name } = msg;

    //get the supabase client
    const supabase = await getSupabaseClient();

    //insert data into the database
    const { error } = await supabase.from("org_table").insert({
        org_id: org_id,
        org_name: name
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