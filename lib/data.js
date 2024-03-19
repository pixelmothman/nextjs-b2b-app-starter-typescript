'use server'

import { unstable_noStore as noStore } from "next/cache";
import {getUser} from "@propelauth/nextjs/server/app-router";
import { getSupabaseClient } from "./supabase";
import { v4 as uuidv4 } from 'uuid';

//---------------------------------------------------------------------
// server-side function to fetch favorite personal movies from Supabase
export async function fetchFavoritePersonalMovies(){
    //prevents the response from being cached
    noStore();
    try {

        //check the user exists
        const user = await getUser();

        if (!user) {
            throw new Error('User not found')
        }

        //get the supabase client
        const supabase = await getSupabaseClient();

        //get the favorite movies from the database
        const { data: favPersonalMoviesData, error: favPersonalMoviesError } = await supabase.from("fav_movies_table").select('movie_id, movie_name').eq("movie_view_category", "personal").eq("user_id", user.userId);

        //create an array with the favorite movies
        let movieArray = [];
        for (let i = 0; i < favPersonalMoviesData.length; i++) {
            movieArray.push({
                movieId: favPersonalMoviesData[i].movie_id,
                movieName: favPersonalMoviesData[i].movie_name
            });
        }

        return movieArray;
    } catch (error) {
        console.error('DB Error: ', error);
        throw new Error('Failed to fetch favorite movies')
    };
};
//---------------------------------------------------------------------



//---------------------------------------------------------------------
// server-side function to fetch favorite movies uploaded by all organization members from Supabase
export async function fetchFavoriteOrgMovies(){
    //prevents the response from being cached
    noStore();
    try {

        //check the user exists
        const user = await getUser();

        if (!user) {
            throw new Error('User not found')
        }

        //get the supabase client
        const supabase = await getSupabaseClient();

        //get the org_id 
        let org = user.orgIdToOrgMemberInfo;

        let orgID = Object.keys(org)[0];

        //get the favorite movies from the database
        const { data: favOrgMoviesData, error: favOrgMoviesError } = await supabase.from("fav_movies_table").select('movie_id, movie_name').eq("movie_view_category", "org").eq("user_id", user.userId).eq("org_id", orgID);

        //create an array with the favorite movies
        let movieArray = [];
        for (let i = 0; i < favOrgMoviesData.length; i++) {
            movieArray.push({
                movieId: favOrgMoviesData[i].movie_id,
                movieName: favOrgMoviesData[i].movie_name
            });
        }

        return movieArray;
    } catch (error) {
        console.error('DB Error: ', error);
        throw new Error('Failed to fetch favorite movies')
    };
};
//---------------------------------------------------------------------



//---------------------------------------------------------------------
// server-side function to upload a favorite movie to Supabase
export async function uploadFavoriteMovie(movieName, movieViewCategory){
    //prevents the response from being cached
    noStore();
    try {

        //check the user exists
        const user = await getUser();

        if (!user) {
            throw new Error('User not found')
        }

        //get the supabase client
        const supabase = await getSupabaseClient();

        //get the org_id 
        let org = user.orgIdToOrgMemberInfo;

        let orgID = Object.keys(org)[0];

        //insert the movie name into the database
        const { error } = await supabase.from("fav_movies_table").insert({org_id: orgID, user_id: user.userId, movie_name: movieName, movie_view_category: movieViewCategory});
        
        return;
    } catch (error) {
        console.error('DB Error: ', error);
        throw new Error('Failed to fetch upload data')
    };
};
//---------------------------------------------------------------------



//---------------------------------------------------------------------
// server-side function to delete a favorite movie from Supabase
export async function deleteFavMovie(movieID){
    //prevents the response from being cached
    noStore();
    try {

        //check the user exists
        const user = await getUser();

        if (!user) {
            throw new Error('User not found')
        }

         //get the supabase client
         const supabase = await getSupabaseClient();

        //delete the favorite movie from the database
        const { deleteFavMovieError: error } = await supabase.from("fav_movies_table").delete().eq("movie_id", movieID).eq("user_id", user.userId);
        
        return;
    } catch (error) {
        console.error('DB Error: ', error);
        throw new Error('Failed to fetch upload data')
    };
};
//---------------------------------------------------------------------



//---------------------------------------------------------------------
// server-side function to process data and return a message
export async function processData(username, age, favoriteMovieGenre){
    //prevents the response from being cached
    noStore();
    try {

        //check the user exists
        const user = await getUser();

        if (!user) {
            throw new Error('User not found')
        }

        //example (returning something random)
        let message = `${username}_${age}_${favoriteMovieGenre}`;
        
        return message;
    } catch (error) {
        console.error('DB Error: ', error);
        throw new Error('Failed to fetch upload data')
    };
};
//---------------------------------------------------------------------



//---------------------------------------------------------------------
// server-side function to insert into an org into a delete queue
export async function addOrgToDBDeleteQueue(orgID){
    //prevents the response from being cached
    noStore();
    try {

        //check the user exists
        const user = await getUser();

        if (!user) {
            throw new Error('User not found')
        };

        //get the supabase client
        const supabase = await getSupabaseClient();

        //add the org to the delete queue
        const { error } = await supabase.from("org_to_delete_table").insert({org_id: orgID, user_id: user.userId});
        
        return;
    } catch (error) {
        console.error('DB Error: ', error);
        throw new Error('Failed to fetch upload data')
    };
};
//---------------------------------------------------------------------



//---------------------------------------------------------------------
// server-side function to fetch if the org is in the delete queue
export async function getIsOrgInDeleteQueue(){
    //prevents the response from being cached
    noStore();
    try {

        //check the user exists
        const user = await getUser();

        if(!user){
            return new Error('User not found')
        };

        //get the Supabase client
        const supabase = await getSupabaseClient();

        //get the org_id 
        let org = user.orgIdToOrgMemberInfo;

        let orgID = Object.keys(org)[0];

        //fetch the org in the org_to_delete_table table
        const {data: orgInDeleteQueue, error: orgInDeleteQueueError} = await supabase.from("org_to_delete_table").select('org_id, user_id').eq('org_id', orgID);

        //if the org is in the table, it is in the delete queue
        if(orgInDeleteQueue.length === 0) {
            return {
                isOrgInDeleteQueue: false
            }
        } else {
            //fetch email of user who added the org to the delete queue
            const {data: userWhoTriggeredOrgDelete, error: userWhoTriggeredOrgDeleteError} = await supabase.from("user_table").select('user_email').eq('user_id', orgInDeleteQueue[0].user_id);

            return {
                isOrgInDeleteQueue: true,
                userWhoTriggeredOrgDeleteEmail: userWhoTriggeredOrgDelete[0].user_email
            }
        };

    } catch (error) {
        console.error('DB Error: ', error);
        throw new Error('Failed to fetch the org to be deleted in queue')
    };
};
//---------------------------------------------------------------------



//---------------------------------------------------------------------
// server-side function to delete the org from the delete queue
export async function deleteOrgFromDeleteQueue(orgID){
    //prevents the response from being cached
    noStore();
    try {

        //check the user exists
        const user = await getUser();

        if(!user){
            return new Error('User not found')
        };

        //get the Supabase client
        const supabase = await getSupabaseClient();

        //fetch the org in the org_to_delete_table table
        const {error: deleteOrgInDeleteQueueError} = await supabase.from("org_to_delete_table").delete('org_id').eq('org_id', orgID);

        return;

    } catch (error) {
        console.error('DB Error: ', error);
        throw new Error('Failed to fetch the org to be deleted in queue')
    };
};
//---------------------------------------------------------------------



//---------------------------------------------------------------------
// server-side function to create a singed url for an image upload
export async function getSignedUploadURL(orgID, imageType){
    //prevents the response from being cached
    noStore();
    try {

        //check the user exists
        const user = await getUser();

        if (!user) {
            throw new Error('User not found')
        };

        //get the supabase client
        const supabase = await getSupabaseClient();

        //get the signed url
        //use the uuid to make the image name unique
        let imageName = uuidv4();
        const { data: theSignedUploadURL, error } = await supabase.storage.from('images').createSignedUploadUrl(`${orgID}/${imageName}.${imageType}`);
        
        //return the signed url
        let signedUploadURL = {
            p: theSignedUploadURL.path,
            t: theSignedUploadURL.token
        }

        return signedUploadURL;
    } catch (error) {
        console.error('DB Error: ', error);
        throw new Error('Failed to fetch upload data')
    };
}
//---------------------------------------------------------------------



//---------------------------------------------------------------------
// server-side function to fetch the amount of images in the org's bucket and the signed urls of the first 4 images
export async function fetchImgsFromOrg(){
    //prevents the response from being cached
    noStore();
    try {

        //check the user exists
        const user = await getUser();

        if (!user) {
            throw new Error('User not found')
        }

        //get the org_id 
        let org = user.orgIdToOrgMemberInfo;

        let orgID = Object.keys(org)[0];

        //get the supabase client
        const supabase = await getSupabaseClient();

        //list all files in the images bucket related to the org
        const { data: listOfImgs, error: listOfImgsError } = await supabase
            .storage
            .from('images')
            .list(`${orgID}`, {
            offset: 0,
        })

        if(listOfImgs.length === 0){
            let imagesData = {
                counterOfFiles: 0,
                listSignedURLS: []
            }

            return imagesData
        } else {
            let counterOfFiles = listOfImgs.length;
            let arrayOfPaths = [];
            for (let i = 0; i < 4; i++) {
                if(listOfImgs[i] === undefined){
                    break;
                }
                arrayOfPaths.push(`${orgID}/${listOfImgs[i].name}`);
            }

            //get the singned urls of images from the org from the database
            const { data: listOfSignedURLS, error: listOfSignedURLSError} = await supabase
            .storage
            .from('images')
            .createSignedUrls( arrayOfPaths , 300)

            //filter to get only an array og the signedUrl keys
            let listSignedURLS = [];
            for (let i = 0; i < listOfSignedURLS.length; i++) {
                listSignedURLS.push(listOfSignedURLS[i].signedUrl);
            }

            let imagesData = {
                counterOfFiles,
                listSignedURLS
            }

            return imagesData;
        }
    } catch (error) {
        console.error('DB Error: ', error);
        throw new Error('Failed to fetch images data')
    };
};
//---------------------------------------------------------------------



//---------------------------------------------------------------------
// server-side function to fetch signed urls of the next 4 images in the org's bucket
export async function getSignedURLsFromSupa(orgID, offSetNumber){
    //prevents the response from being cached
    noStore();
    try {

        //check the user exists
        const user = await getUser();

        if (!user) {
            throw new Error('User not found')
        }

        //get the supabase client
        const supabase = await getSupabaseClient();

        //list all files in the images bucket related to the org
        const { data: listOfImgs, error: listOfImgsError } = await supabase
            .storage
            .from('images')
            .list(`${orgID}`, {
            limit: 4,
            offset: offSetNumber,
            sortBy: { column: 'name', order: 'asc' },
        })

        let arrayOfPaths = [];
        for (let i = 0; i < listOfImgs.length; i++) {
            arrayOfPaths.push(`${orgID}/${listOfImgs[i].name}`);
        }

        //get the singned urls of images from the org from the database
        const { data: listOfSignedURLS, error: listOfSignedURLSError} = await supabase
        .storage
        .from('images')
        .createSignedUrls( arrayOfPaths , 300)

        //filter to get only an array og the signedUrl keys
        let listSignedURLS = [];
        for (let i = 0; i < listOfSignedURLS.length; i++) {
            listSignedURLS.push(listOfSignedURLS[i].signedUrl);
        }


        return listSignedURLS;
    } catch (error) {
        console.error('DB Error: ', error);
        throw new Error('Failed to fetch images')
    };
};
//---------------------------------------------------------------------



//---------------------------------------------------------------------
// server-side function to fetch calendar events from the database
export async function fetchCalendarEvents(date){
    //prevents the response from being cached
    noStore();
    try {

        //check the user exists
        const user = await getUser();

        if (!user) {
            throw new Error('User not found')
        }

        //get the supabase client
        const supabase = await getSupabaseClient();

        //get the org_id 
        let org = user.orgIdToOrgMemberInfo;

        let orgID = Object.keys(org)[0];

        //get the first day of the month and delete eveything after T00:00:00.000Z
        let startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        startDate = startDate.toISOString().split('T')[0];


        //get the first day of the next month
        let endDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        endDate = endDate.toISOString().split('T')[0];

        //get the calendar events from the database that have the 'organization' label
        const { data: calOrgEvents, error: calOrgEventsError } = await supabase
        .from("calendar_events_table")
        .select("*")
        .eq('cal_event_label', 'organization')
        .eq("org_id", orgID)
        .gte('cal_event_start_date', startDate)
        .lt('cal_event_start_date', endDate)

        //get the calendar events from the database that have the 'personal' label
        const { data: calPersonalEvents, error: calPersonalEventsError } = await supabase
        .from("calendar_events_table")
        .select("*")
        .eq('cal_event_label', 'personal')
        .eq("user_id", user.userId)
        .gte('cal_event_start_date', startDate)
        .lt('cal_event_start_date', endDate)


        //create an array with the calendar events
        let calEventsArray = [];
        for (let i = 0; i < calOrgEvents.length; i++) {
            calEventsArray.push(calOrgEvents[i]);
        };
        for (let i = 0; i < calPersonalEvents.length; i++) {
            calEventsArray.push(calPersonalEvents[i]);
        };
        
        return calEventsArray;
    } catch (error) {
        console.error('DB Error: ', error);
        throw new Error('Failed to fetch calendar events')
    };
};
//---------------------------------------------------------------------



//---------------------------------------------------------------------
// server-side function to upload a calendar event to the database
export async function uploadCalEvent(calEventLabel, calEventName, calEventDescription, calEventStartDate, calEventEndDate){
    //prevents the response from being cached
    noStore();
    try {

        //check the user exists
        const user = await getUser();

        if (!user) {
            throw new Error('User not found')
        }

        //get the supabase client
        const supabase = await getSupabaseClient();

        //get the org_id 
        let org = user.orgIdToOrgMemberInfo;

        let orgID = Object.keys(org)[0];

        //upload the calendar event to the database
        const { error: calUploadEventError } = await supabase.from("calendar_events_table").insert({
            org_id: orgID,
            user_id: user.userId,
            cal_event_label: calEventLabel,
            cal_event_name: calEventName,
            cal_event_description: calEventDescription,
            cal_event_start_date: calEventStartDate,
            cal_event_end_date: calEventEndDate,
        });

        return;
    } catch (error) {
        console.error('DB Error: ', error);
        throw new Error('Failed to upload calendar events')
    };
};
//---------------------------------------------------------------------



//---------------------------------------------------------------------
// server-side function to update a calendar event to the database
export async function updateCalEvent(
    calendarEventID,
    calendarEventLabel,
    calendarEventName,
    calendarEventDescription,
    calendarEventStartDate,
    calendarEventEndDate
){
    //prevents the response from being cached
    noStore();
    try {

        //check the user exists
        const user = await getUser();

        if (!user) {
            throw new Error('User not found')
        }

        //get the supabase client
        const supabase = await getSupabaseClient();

        //get the org_id 
        let org = user.orgIdToOrgMemberInfo;

        let orgID = Object.keys(org)[0];

        //delete the calendar event from the database with id calendarEventID
        const { error: calDeleteEventError } = await supabase.from("calendar_events_table").delete().eq("cal_event_id", calendarEventID).eq("org_id", orgID);

        //upload the calendar event to the database
        const { error: calUploadEventError } = await supabase.from("calendar_events_table").insert({
            org_id: orgID,
            user_id: user.userId,
            cal_event_label: calendarEventLabel,
            cal_event_name: calendarEventName,
            cal_event_description: calendarEventDescription,
            cal_event_start_date: calendarEventStartDate,
            cal_event_end_date: calendarEventEndDate,
        });

        return;
    } catch (error) {
        console.error('DB Error: ', error);
        throw new Error('Failed to fetch favorite movies')
    };
};
//---------------------------------------------------------------------



//---------------------------------------------------------------------
// server-side function to delete a calendar event to the database
export async function deleteCalEvent(calendarEventID){
    //prevents the response from being cached
    noStore();
    try {

        //check the user exists
        const user = await getUser();

        if (!user) {
            throw new Error('User not found')
        }

        //get the supabase client
        const supabase = await getSupabaseClient();

        //get the org_id 
        let org = user.orgIdToOrgMemberInfo;

        let orgID = Object.keys(org)[0];

        //delete the calendar event from the database with id calendarEventID
        const { error: deleteCalEvent } = await supabase.from("calendar_events_table").delete().eq("cal_event_id", calendarEventID).eq("org_id", orgID);
        
        return;
    } catch (error) {
        console.error('DB Error: ', error);
        throw new Error('Failed to delete calendar event')
    };
};
//---------------------------------------------------------------------