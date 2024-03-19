import { Webhook } from "svix";
import { buffer } from "@/lib/buffer";
import { propelauth } from "@/lib/propelauth";
import { getSupabaseClient } from "@/lib/supabase";

export const config = {
    api: {
        bodyParser: false,
    },
};

const secret = process.env.SVIX_WEBHOOK_MOD_ORG;

export default async function POST(req, res) {

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
    const { org_id } = msg;

    //get the supabase client
    const supabase = await getSupabaseClient();

    //get the name of the organization
    const { name } = await propelauth.fetchOrg(org_id)

    //update data from the database
    const { error } = await supabase.from("org_table").update({org_name: name}).eq("org_id", org_id);

    //check for errors
    if(error){
        console.log("Error inserting data into the database: ", error);
        res.status(500).json({
            error: "Error inserting data into the database"
        });
    }

    res.json({message: "Webhook processed successfully!"});
};