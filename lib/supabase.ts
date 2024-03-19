import {createClient} from '@supabase/supabase-js'
import { Database } from "./supabase.types";

export const getSupabaseClient = async () => {
    
    const options = {
        auth: {
            persistSession: false,
        }
    };

    if(typeof process.env.SUPABASE_URL === 'undefined' || typeof process.env.SUPABASE_SERVICE_KEY === 'undefined') {
        throw new Error('Please define SUPABASE_URL and SUPABASE_SERVICE_KEY in your .env.local file')
    }
    
    return createClient<Database>(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY,
        options
    )
}