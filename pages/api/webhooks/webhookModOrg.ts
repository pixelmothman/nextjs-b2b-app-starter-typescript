import { Webhook } from "svix";
import { propelauth } from "@/lib/propelauth";
import { getSupabaseClient } from "@/lib/supabase";
import type { NextApiRequest, NextApiResponse } from 'next'
import { buffer } from "stream/consumers";

export const config = {
    api: {
        bodyParser: false,
    },
};

const secret = process.env.SVIX_WEBHOOK_MOD_ORG;

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
    const payload = (await buffer(request)).toString();
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
    const { org_id } = msg;

    //get the supabase client
    const supabase = await getSupabaseClient();

    //get the name of the organization
    const orgObject = await propelauth.fetchOrg(org_id)

    //check for errors
    if(!orgObject){
        return response.status(500).json({
            error: "Error fetching data from PropelAuth"
        });
    };
    
    //access the name of the organization
    const name = orgObject.name

    //update data from the database
    const { error: error1 } = await supabase.from("org_table").update({org_name: name}).eq("org_id", org_id);

    //check for errors
    if(error1){
        console.log("Error in the mod org webhook: ", error1);
        return response.status(500).json({
            error: "Error inserting data into the database"
        });
    };

    return response.json({message: "Webhook processed successfully!"});
};