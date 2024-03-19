'use server'

import { z } from 'zod';
import {getUser} from "@propelauth/nextjs/server/app-router";
import { addOrgToDBDeleteQueue, uploadCalEvent, getSignedUploadURL, getSignedURLsFromSupa, processData, uploadFavoriteMovie, updateCalEvent, deleteFavMovie, deleteCalEvent, deleteOrgFromDeleteQueue } from './data';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getSupabaseClient } from "./supabase";

//---------------------------------------------------------------------
// Server action related to the favorite movie form

// server action for uploading a favorite movie

const FavMovieDataSchema = z.object({
    movie: z.string(),
    movieViewCategory: z.enum(['personal','org']),
});

export async function uploadFavMovie(formData){

    //check the user exists
    const user = await getUser();

    if (!user) {
        throw new Error('User not found');
    };

    //get the data from the form
    //inside the get() write the id of the corresponding html form element
    const { movie, movieViewCategory } = FavMovieDataSchema.parse({
        movie: formData.get('movie-example'),
        movieViewCategory: formData.get('movie-view-category-example'),
    });

    //call a function to process the data
    await uploadFavoriteMovie(movie, movieViewCategory);

    revalidatePath('/dash');
};
//---------------------------------------------------------------------



//---------------------------------------------------------------------

// Server actions related to the favorite movie delete form

// server action for deleting a favorite movie

const DeleteFavMovieDataSchema = z.object({
    movieId: z.string().uuid(),
});

export async function deleteFavoriteMovie(formData){
    //check the user exists
    const user = await getUser();

    if (!user) {
        throw new Error('User not found');
    };

    //get the data from the form
    //inside the get() write the id of the corresponding html form element
    const { movieId } = DeleteFavMovieDataSchema.parse({
        movieId: formData.get('movie-id'),
    });

    //call a function to delete the movie
    await deleteFavMovie(movieId);

    revalidatePath('/dash');
};
//---------------------------------------------------------------------



//---------------------------------------------------------------------

// Server actions related to the form example search params form

// server action for creating a message from the form data

const ExampleDataSchema = z.object({
    username: z.string(),
    age: z.coerce.number(),
    favoriteMovieGenre: z.enum(['horror','sci-fi','romantic comedies', 'action']),
});

export async function createExampleMessage(formData){

    //check the user exists
    const user = await getUser();

    if (!user) {
        throw new Error('User not found');
    };

    //get the data from the form
    //inside the get() write the id of the corresponding html form element
    const { username, age, favoriteMovieGenre } = ExampleDataSchema.parse({
        username: formData.get('username-example'),
        age: formData.get('age-example'),
        favoriteMovieGenre: formData.get('movie-genre-example'),
    });

    //call a function to process the data
    let messageReceived = await processData(username, age, favoriteMovieGenre);

    //in this case we will return the message received
    let newURL = `/dash/message-received?message=${messageReceived}`;
    
    redirect(newURL);
};
//---------------------------------------------------------------------



//---------------------------------------------------------------------

// Server actions related to the organization delete form

// server action for adding an organization to the delete queue

export async function addOrgToDeleteQueue(){

    //check the user exists
    const user = await getUser();

    if (!user) {
        throw new Error('User not found');
    };

    //get the org_id 
    let org = user.orgIdToOrgMemberInfo;

    let orgID = Object.keys(org)[0];

    //check the role of the user is equal to Owner
    let isOwnerRole = user.orgIdToOrgMemberInfo[orgID].isRole("Owner");

    if(!isOwnerRole){
        throw new Error('User is not an Owner');
    }

    //add the org to the delete queue
    await addOrgToDBDeleteQueue(orgID);

    //redirect to menu
    let newURL = `/dash`;
    
    redirect(newURL);
};

// server action for deleting an organization from the delete queue

export async function delOrgFromDeleteQueue(){

    //check the user exists
    const user = await getUser();

    if (!user) {
        throw new Error('User not found');
    };

    //get the org_id 
    let org = user.orgIdToOrgMemberInfo;

    let orgID = Object.keys(org)[0];

    //check the role of the user is equal to Owner
    let isOwnerRole = user.orgIdToOrgMemberInfo[orgID].isRole("Owner");

    if(!isOwnerRole){
        throw new Error('User is not an Owner');
    }

    //add the org to the delete queue
    await deleteOrgFromDeleteQueue(orgID);

    //redirect to menu
    let newURL = `/dash`;
    
    redirect(newURL);
};
//---------------------------------------------------------------------



//---------------------------------------------------------------------

// Server actions related to getting upload signed urls 

// server action for getting a signed upload URL

const SingedUploadURLSchema = z.object({
    imageType: z.enum(['png','jpg','jpeg']),
});

export async function getUploadURL(prevState, formData){
    //check the user exists
    const user = await getUser();

    if (!user) {
        throw new Error('User not found');
    };

    //get the data from the form
    //inside the get() write the id of the corresponding html form element
    const { imageType } = SingedUploadURLSchema.parse({
        imageType: formData.get('image-type'),
    });

    //console.log(imageType);

    //get the org_id 
    let org = user.orgIdToOrgMemberInfo;

    let orgID = Object.keys(org)[0];

    //get signed url
    let signedUploadURL = await getSignedUploadURL(orgID, imageType);

    if (!signedUploadURL) {
        return {
            success: false,
            message: 'Failed to get signed upload URL'
        }
    }
    
    return signedUploadURL;
};

// server action for getting multiple signed upload urls

const SingedUploadURLsSchema = z.object({
    imageTypeOne: z.enum(['png','jpg','jpeg']),
    imageTypeTwo: z.enum(['png','jpg','jpeg']),
});

export async function getUploadURLS(prevState, formData){
    //check the user exists
    const user = await getUser();

    if (!user) {
        throw new Error('User not found');
    };

    //get the data from the form
    //inside the get() write the id of the corresponding html form element
    const { imageTypeOne, imageTypeTwo } = SingedUploadURLsSchema.parse({
        imageTypeOne: formData.get('image-type-one'),
        imageTypeTwo: formData.get('image-type-two'),
    });

    //console.log(imageType);

    //get the org_id 
    let org = user.orgIdToOrgMemberInfo;

    let orgID = Object.keys(org)[0];

    //get signed url
    let signedUploadURLOne = await getSignedUploadURL(orgID, imageTypeOne);
    let signedUploadURLTwo = await getSignedUploadURL(orgID, imageTypeTwo);

    if (!signedUploadURLOne || !signedUploadURLTwo) {
        return {
            success: false,
            message: 'Failed to get signed upload URL'
        }
    }

    return {
        success: true,
        signedUploadURLOne,
        signedUploadURLTwo,
    }
};
//---------------------------------------------------------------------



//---------------------------------------------------------------------

// Server actions related to getting signed urls to download images

// server action for getting signed urls

const offsetSchema = z.object({
    offSetNumber: z.string(),
});

export async function getSingedURLS(prevState, formData){
    //check the user exists
    const user = await getUser();

    if (!user) {
        throw new Error('User not found');
    };

    //get the data from the form
    //inside the get() write the id of the corresponding html form element
    const { offSetNumber } = offsetSchema.parse({
        offSetNumber: formData.get('off-img-number'),
    });

    if(Number(offSetNumber) === NaN || Number(offSetNumber) === undefined || Number(offSetNumber) === null){
        throw new Error('Not a number');
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

    if (listOfImgsError) {
        throw new Error('Failed to get list of images');
    }

    if(offSetNumber > listOfImgs.length){
        throw new Error('Offset number is greater than the number of images');
    }

    //get signed urls
    let signedURLS = await getSignedURLsFromSupa(orgID, offSetNumber);


    if (!signedURLS) {
        return {
            success: false,
            message: 'Failed to get signed URLs'
        }
    }

    return {
        success: true,
        signedURLS,
    }
};
//---------------------------------------------------------------------



//---------------------------------------------------------------------

// Server actions related to the calendar event form

// server action for uploading a calendar event

const CalendarEventSchema = z.object({
    calendarEventLabel: z.enum(['organization','personal']),
    calendarEventName: z.string().min(1).max(50),
    calendarEventDescription: z.string().min(1).max(100),
    calendarEventStartDate: z.string().length(16),
    calendarEventEndDate: z.string().length(16),
});

export async function uploadCalendarEvent(formData){

    //check the user exists
    const user = await getUser();

    if (!user) {
        throw new Error('User not found');
    };

    //get the data from the form
    //inside the get() write the id of the corresponding html form element
    const { calendarEventLabel, calendarEventName, calendarEventDescription, calendarEventStartDate, calendarEventEndDate } = CalendarEventSchema.parse({
        calendarEventLabel: formData.get('calendar-event-label'),
        calendarEventName: formData.get('calendar-event-name'),
        calendarEventDescription: formData.get('calendar-event-description'),
        calendarEventStartDate: formData.get('calendar-event-start-date'),
        calendarEventEndDate: formData.get('calendar-event-end-date'),
    });

    //verify calEventStartDate and calEventEndDate both start and end in the same day
    if(calendarEventStartDate.split('T')[0] !== calendarEventEndDate.split('T')[0]){
        throw new Error('Event start and end must be in the same day');
    }

    //verify calEventStartDate is before calEventEndDate
    let startDateTime = new Date(calendarEventStartDate);
    let endDateTime = new Date(calendarEventEndDate);

    if(startDateTime.getTime() > endDateTime.getTime()){
        throw new Error('Event start must be before event end');
    }

    //call a function to process the data
    await uploadCalEvent(calendarEventLabel, calendarEventName, calendarEventDescription, calendarEventStartDate, calendarEventEndDate);

    console.log('Calendar event uploaded');

    revalidatePath('/dash/calendar');
};

const CalendarEventUpdateSchema = z.object({
    calendarEventID: z.string().uuid(),
    calendarEventLabel: z.enum(['organization','personal']),
    calendarEventName: z.string().min(1).max(50),
    calendarEventDescription: z.string().min(1).max(100),
    calendarEventStartDate: z.string().length(16),
    calendarEventEndDate: z.string().length(16),
});

// server action for updating a calendar event

export async function updateCalendarEvent(formData){

    //check the user exists
    const user = await getUser();

    if (!user) {
        throw new Error('User not found');
    };

    //get the data from the form
    //inside the get() write the id of the corresponding html form element
    const { calendarEventID, calendarEventLabel, calendarEventName, calendarEventDescription, calendarEventStartDate, calendarEventEndDate } = CalendarEventUpdateSchema.parse({
        calendarEventID: formData.get('calendar-event-id'),
        calendarEventLabel: formData.get('calendar-event-label'),
        calendarEventName: formData.get('calendar-event-name'),
        calendarEventDescription: formData.get('calendar-event-description'),
        calendarEventStartDate: formData.get('calendar-event-start-date'),
        calendarEventEndDate: formData.get('calendar-event-end-date'),
    });

    
    //verify calEventStartDate and calEventEndDate both start and end in the same day
    if(calendarEventStartDate.split('T')[0] !== calendarEventEndDate.split('T')[0]){
        throw new Error('Event start and end must be in the same day');
    }

    //verify calEventStartDate is before calEventEndDate
    let startDateTime = new Date(calendarEventStartDate);
    let endDateTime = new Date(calendarEventEndDate);

    if(startDateTime.getTime() > endDateTime.getTime()){
        throw new Error('Event start must be before event end');
    }

    //call a function to process the data
    await updateCalEvent(
        calendarEventID,
        calendarEventLabel,
        calendarEventName,
        calendarEventDescription,
        calendarEventStartDate,
        calendarEventEndDate
    );

    console.log('Calendar event updated');

    revalidatePath('/dash/calendar');
};

const CalendarEventDeleteSchema = z.object({
    calendarEventID: z.string().uuid(),
});

// server action for deleting a calendar event

export async function deleteCalendarEvent(formData){
    //check the user exists
    const user = await getUser();

    if (!user) {
        throw new Error('User not found');
    };

    //get the data from the form
    //inside the get() write the id of the corresponding html form element
    const { calendarEventID } = CalendarEventDeleteSchema.parse({
        calendarEventID: formData.get('calendar-event-id'),
    });

    //call a function to delete the movie
    await deleteCalEvent(calendarEventID);

    console.log('Deleting calendar event');

    revalidatePath('/dash');
};
//---------------------------------------------------------------------