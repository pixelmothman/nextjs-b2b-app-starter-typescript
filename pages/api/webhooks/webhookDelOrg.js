import { Webhook } from "svix";
import { buffer } from "@/lib/buffer";
import { getSupabaseClient } from "@/lib/supabase";
import { propelauth } from "@/lib/propelauth";

export const config = {
    api: {
        bodyParser: false,
    },
};

const secret = process.env.SVIX_WEBHOOK_DEL_ORG;

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

    //fetch the users from the database
    const { data: users, error: error1 } = await supabase.from("user_table").select("user_id").eq("org_id", org_id);

    //delete from the database
    const { error: error2 } = await supabase.from("org_table").delete().eq("org_id", org_id);

    console.log("Users to be deleted: ", users);

    //delete the users from PropelAuth
    for(let i = 0; i < users.length; i++){
        await propelauth.deleteUser(users[i].user_id);
    };

    //check for errors
    if(error){
        console.log("Error inserting data into the database: ", error);
        res.status(500).json({
            error: "Error inserting data into the database"
        });
    };

    res.json({message: "Webhook processed successfully!"});
};