import { getSupabaseClient } from "@/lib/supabase";
import { propelauth } from "@/lib/propelauth";
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  message: string
}

//cron job that works at midnight
export default async function handler(request: NextApiRequest, response: NextApiResponse<ResponseData>) {
  //get the supabase client
  const supabase = await getSupabaseClient();
    
  //select all the orgs from the org_to_delete_table
  const { data: orgs, error: error1} = await supabase.from("org_to_delete_table").select("org_id");

  //if there are orgs in the table, delete all the fetched orgs in PropelAuth
  if(orgs){
    for(let i = 0; i < orgs.length; i++){
      await propelauth.deleteOrg(orgs[i].org_id);
    };
    //return a message
    return response.json({ message:  "Orgs deleted successfully!"});
  }
  //if there are no orgs in the table, return a message
  else {
    return response.json({ message:  "No orgs to delete!"});
  }
}