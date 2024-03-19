import { getSupabaseClient } from "@/lib/supabase";
import { propelauth } from "@/lib/propelauth";

//cron job that works at midnight
export default async function handler(request, response) {
  //get the supabase client
  const supabase = await getSupabaseClient();
    
  //select all the orgs from the org_to_delete_table
  const { data: orgs, error: error1} = await supabase.from("org_to_delete_table").select("org_id");

  //delete all the fetched orgs in PropelAuth
  for(let i = 0; i < orgs.length; i++){
    await propelauth.deleteOrg(orgs[i].org_id);
  };

  return response.json({ message:  "Orgs deleted successfully!"});
}