// src/components/UploadCapture.tsx
import React, { useState, useEffect } from 'react';
import { createCapture, uploadFileToBucket, triggerCapture, getCaptureStatus } from '../services/apiService';

const UploadCapture = ({ onCaptureReady }) => {
    const [title, setTitle] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [uploadUrl, setUploadUrl] = useState('');
    const [captureData, setCaptureData] = useState<any>(null); 
    const [status, setStatus] = useState('');
    const [progress, setProgress] = useState(0); // State to keep track of progress

    useEffect(() => {
        let intervalId;
    
        const checkAndUpdateStatus = async () => {
            const captureStatus = await getCaptureStatus(captureData.capture.slug);
            setProgress(captureStatus.latestRun.progress);
            if (captureStatus.latestRun.progress === 100) {
                clearInterval(intervalId); // Stop checking the status
                onCaptureReady(captureStatus.latestRun.artifacts[6].url); // Call the callback with the URL
                console.log('Artifacts:', captureStatus.latestRun.artifacts[6].url);
            }
        };
    
        if (captureData) {
            intervalId = setInterval(checkAndUpdateStatus, 30000);
        }
    
        // Clean up interval on component unmount
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [captureData, onCaptureReady]); 

    const handleTitleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const data = await createCapture(title);
        if (data && data.signedUrls && data.signedUrls.source) {
            console.log('Capture Data:', data);
            setUploadUrl(data.signedUrls.source); // Save the upload URL
            setCaptureData(data); // Save the capture data
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFile = event.target.files ? event.target.files[0] : null;
        if (newFile) {
            setFile(newFile); // Save the file
        }
    };   

    const handleFileUpload = async () => {
        if (file && uploadUrl && captureData) {
            const uploadResult = await uploadFileToBucket(file, uploadUrl);
            if (uploadResult) {
                console.log('File upload success');
                const slug = captureData.capture.slug; 
                console.log('Capture slug:', slug); 
                await triggerCapture(slug);
            }
        }
    };

    const checkStatus = async () => {
        if (captureData) {
            const captureStatus = await getCaptureStatus(captureData.capture.slug);
            if (captureStatus && captureStatus.latestRun) {
                setProgress(captureStatus.latestRun.progress); // Update the progress in the state
            }
        }
    };  

    return (
        <div>
            <form onSubmit={handleTitleSubmit}>
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Enter capture title" 
                />
                <button type="submit">Create Capture</button>
            </form>
            {uploadUrl && (
                <div>
                    <input type="file" onChange={handleFileChange} />
                    <button onClick={handleFileUpload}>Upload File</button>
                    <a href="#" onClick={checkStatus}>Check Status</a>
                    <p>Progress: {progress}%</p> {/* Display the progress */}                  
                </div>
            )}
        </div>
    );
};

export default UploadCapture;
