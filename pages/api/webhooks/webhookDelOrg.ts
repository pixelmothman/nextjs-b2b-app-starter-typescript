import { Webhook } from "svix";
import { getSupabaseClient } from "@/lib/supabase";
import { propelauth } from "@/lib/propelauth";
import type { NextApiRequest, NextApiResponse } from 'next'
import { buffer } from "stream/consumers";


export const config = {
    api: {
        bodyParser: false,
    },
};

const secret = process.env.SVIX_WEBHOOK_DEL_ORG;

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

    //fetch the users from the database
    const { data: users, error: error1 } = await supabase.from("user_table").select("user_id").eq("org_id", org_id);

    //check for errors
    if(!users){
        return response.status(500).json({
            error: "Internal server error"
        });
    }

    //delete from the database
    const { error: error2 } = await supabase.from("org_table").delete().eq("org_id", org_id);

    console.log("Users to be deleted: ", users);

    //delete the users from PropelAuth
    for(let i = 0; i < users.length; i++){
        await propelauth.deleteUser(users[i].user_id);
    };

    //check for errors
    if(error1 || error2){
        console.log("Error in the delete org webhook:", error1, error2);
        return response.status(500).json({
            error: "Internal server error"
        });
    };

    return response.json({message: "Webhook processed successfully!"});
};