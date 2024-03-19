import { Webhook } from "svix";
import { buffer } from "@/lib/buffer";
import { propelauth } from "@/lib/propelauth";
import { getSupabaseClient } from "@/lib/supabase";

export const config = {
    api: {
        bodyParser: false,
    },
};

const secret = process.env.SVIX_WEBHOOK_NEW_USER;

export default async function handler(req, res) {

    console.log("Webhook received! Verifying...");

    if(req.method !== "POST"){
        res.status(405).json({
            error: "Method not allowed"
        });
    }

    const payload = (await buffer(req)).toString();
    const headers = req.headers;

    const wh = new Webhook(secret);
    let msg;
    try {
        msg = wh.verify(payload, headers);
    } catch (err) {
        res.status(400).json({});
    }

    console.log("Webhook verified! Starting to process...");

    //extract useful information from the webhook
    const {org_id, user_id, role} = msg;

    //get the email of the user from Propel
    const { email } = await propelauth.fetchUserMetadataByUserId(user_id);

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
        res.status(500).json({
            error: "Error inserting data into the database"
        });
    }

    res.json({message: "Webhook processed successfully!"});
};