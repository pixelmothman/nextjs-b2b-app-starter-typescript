import {createClient} from '@supabase/supabase-js'

export const getSupabaseClient = async () => {
    
    const options = {
        auth: {
            persistSession: false,
        }
    };
    
    return createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY,
        options
    )
}