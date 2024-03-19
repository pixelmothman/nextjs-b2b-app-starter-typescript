import { Webhook } from "svix";
import { propelauth } from "@/lib/propelauth";
import { getSupabaseClient } from "@/lib/supabase";
import type { NextApiRequest, NextApiResponse } from 'next'

export const config = {
    api: {
        bodyParser: false,
    },
};

const secret = process.env.SVIX_WEBHOOK_DEL_USER;

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
    const { org_id, removed_user_id } = msg;

    //delete the user from PropelAuth
    await propelauth.deleteUser(removed_user_id);

    //get the supabase client
    const supabase = await getSupabaseClient();

    //delete from the database
    const { error: error1 } = await supabase.from("user_table").delete().eq("user_id", removed_user_id);

    //check for errors
    if(error1){
        console.log("Error in the delete user webhook:", error1);
        return response.status(500).json({
            error: "Internal server error"
        });
    };

    return response.json({message: "Webhook processed successfully!"});
};