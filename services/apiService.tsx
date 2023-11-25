// src/services/apiService.tsx
const API_KEY = process.env.NEXT_PUBLIC_LUMA_API_KEY;

export const createCapture = async (title: string) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `luma-api-key=${API_KEY}`);

    const urlencoded = new URLSearchParams();
    urlencoded.append("title", title);

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };

    try {
        const response = await fetch("https://webapp.engineeringlumalabs.com/api/v2/capture", requestOptions);
        const result = await response.json();
        return result; // This includes the slug and storage bucket
    } catch (error) {
        console.error('Error in createCapture:', error);
    }
};


export const uploadFileToBucket = async (file: File, uploadUrl: string) => {
    const requestOptions = {
        method: 'PUT',
        body: file,
        redirect: 'follow'
    };

    try {
        const response = await fetch(uploadUrl, requestOptions);
        console.log('Upload URL', uploadUrl);
        const result = await response;
        console.log('File upload result:', result);
        return result;
    } catch (error) {
        console.error('Error in uploadFileToBucket:', error);
    }
};


export const triggerCapture = async (slug: string) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `luma-api-key=${API_KEY}`);

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`https://webapp.engineeringlumalabs.com/api/v2/capture/${slug}`, requestOptions);
        const result = await response.text();
        console.log('Capture triggered:', result);
        return result;
    } catch (error) {
        console.error('Error in triggerCapture:', error);
    }
};


export const getCaptureStatus = async (slug: string) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `luma-api-key=${API_KEY}`);

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`https://webapp.engineeringlumalabs.com/api/v2/capture/${slug}`, requestOptions);
        const result = await response.json(); // Parse the response as JSON
        if (result.latestRun && result.latestRun.progress === 100) {
            // Assuming the result contains a URL to download the capture when it's ready
            const downloadUrl = result.latestRun.artifacts[0].url; // Adjust according to the actual response structure
            // Trigger the download
            window.location.href = downloadUrl;
        }
        return result;
    } catch (error) {
        console.error('Error in getCaptureStatus:', error);
    }
};
