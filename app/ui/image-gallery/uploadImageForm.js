'use client'

import { getUploadURL } from '@/lib/actions';
import React, {useEffect, useState, useMemo} from 'react';
import { useFormState } from 'react-dom'
import {useDropzone} from 'react-dropzone';
import { createClient } from '@supabase/supabase-js';
import toast, { Toaster } from 'react-hot-toast';
import FormButtonAbstraction from '../miscelaneous/formButtonAbstraction';

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px',
    borderWidth: 2,
    borderRadius: 4,
    borderColor: '#262626',
    borderStyle: 'solid',
    backgroundColor: '#f5f5f5',
    color: '#525252',
    outline: 'none',
    transition: 'border .24s ease-in-out'
  };
  
  const focusedStyle = {
    borderColor: '#2563eb'
  };
  
  const acceptStyle = {
    borderColor: '#22c55e'
  };
  
  const rejectStyle = {
    borderColor: '#ef4444'
  };

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON
);


export default function StyledDropzone(props) {
  //for the form
  const [ formState, formAction ] = useFormState(getUploadURL, null)
  //for the image
  const [files, setFiles] = useState([]);
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject
  } = useDropzone({
    accept: {
      'image/*': []
    },
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    }
  });
  
  const thumbs = files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
          // Revoke data uri after image is loaded
          onLoad={() => { URL.revokeObjectURL(file.preview) }}
        />
      </div>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, []);


  //to manage the response from the server
  useEffect(() => {
    if (formState !== null && formState?.success !== false) {
      uploadImage(formState?.p, formState?.t,files[0])
    }
  }, [formState]);
  

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isFocused,
    isDragAccept,
    isDragReject
  ]);

  const uploadImage = async (p, t, fileToUpload) => {
    const { data, error } = await supabase.storage.from('images').uploadToSignedUrl(p, t, fileToUpload)
    if (error) {
      toast.custom((t) => {
        return (
          <div className='w-fit h-fit mb-2 mr-2 flex flex-row items-center justify-center gap-2 p-4 bg-neutral-50 border border-neutral-800 rounded-sm shadow-sm shadow-neutral-800'>
            <div className='w-6 h-6 flex items-center justify-center bg-neutral-800 fill-neutral-50 rounded-md'>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256"><path d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212ZM76,108a16,16,0,1,1,16,16A16,16,0,0,1,76,108Zm104,0a16,16,0,1,1-16-16A16,16,0,0,1,180,108Zm-3.26,57a12,12,0,0,1-19.48,14,36,36,0,0,0-58.52,0,12,12,0,0,1-19.48-14,60,60,0,0,1,97.48,0Z"></path></svg>
            </div>
            <p className='text-sm font-bold text-neutral-800'>
            Image upload error
            </p>
          </div>
        )
      });
    } else if (data) {
      toast.custom((t) => {
        return (
          <div className='w-fit h-fit mb-2 mr-2 flex flex-row items-center justify-center gap-2 p-4 bg-neutral-50 border border-neutral-800 rounded-sm shadow-sm shadow-neutral-800'>
            <div className='w-6 h-6 flex items-center justify-center bg-neutral-800 fill-neutral-50 rounded-md'>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path d="M178.39,158c-11,19.06-29.39,30-50.39,30s-39.36-10.93-50.39-30a12,12,0,0,1,20.78-12c3.89,6.73,12.91,18,29.61,18s25.72-11.28,29.61-18a12,12,0,1,1,20.78,12ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128ZM92,124a16,16,0,1,0-16-16A16,16,0,0,0,92,124Zm72-32a16,16,0,1,0,16,16A16,16,0,0,0,164,92Z"></path></svg>
            </div>
            <p className='text-sm font-bold text-neutral-800'>
            Image uploaded successfully!
            </p>
          </div>
        )
      });
    };
  };


  return (
    <div className="w-full h-full flex flex-col p-5 rounded-sm bg-white border border-neutral-800 shadow-sm overflow-y-auto">
        <div className='w-full h-fit flex flex-col gap-2'>
          <h2 className="text-2xl font-bold text-neutral-800">
          Upload an image
          </h2>
          <p className="text-neutral-800 mb-4">
          Upload up to 1 image.
          </p>
        </div>
        <div {...getRootProps({className: 'dropzone', style})}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop an image, or click to select images</p>
        </div>
        <aside style={thumbsContainer}>
            {thumbs}
        </aside>
        <form action={formAction} className="h-full flex flex-col gap-4 justify-between">
          <div className="flex flex-col gap-2">
              <label htmlFor="movie-example" className="hidden">
              Image Type
              </label>
              <input autoComplete="off" type="hidden" value={
                files[0]?.path.split('.').pop()
              } id="image-type" name="image-type" className="form-input w-full h-10 px-4 py-2 rounded-md bg-neutral-100 text-neutral-800 outline-0 ring-0 border-0 focus-visible:ring-black"/>
          </div>
          <FormButtonAbstraction loadingText="Uploading..." buttonText="Upload" />
        </form>
        {
          formState?.success === false && (
            <p className="text-red-500 text-sm">
              {formState?.message}
            </p>
          )
        }
        <Toaster
            position='bottom-right'
            reverseOrder={false}
            toastOptions={{
                duration: 3000,
            }}
        />
    </div>
  );
}