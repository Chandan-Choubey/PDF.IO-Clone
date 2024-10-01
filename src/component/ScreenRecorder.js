import React, { useState, useRef } from "react";
import "../Css/VideoTool.css";
const ScreenRecorder = ({ onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      chunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const videoUrl = URL.createObjectURL(blob);
        setVideoUrl(videoUrl);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      alert("Screen recording started.");
    } catch (error) {
      console.error("Error starting screen recording:", error);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      alert("Screen recording stopped.");
    }
  };

  return (
    <div>
      <h2>Screen Recorder</h2>
      {isRecording ? (
        <button className="btn" onClick={handleStopRecording}>
          Stop Recording
        </button>
      ) : (
        <button className="btn" onClick={handleStartRecording}>
          Start Recording
        </button>
      )}
      <button className="btn" onClick={onClose}>
        Close
      </button>

      {videoUrl && (
        <>
          <h3>Recorded Video:</h3>
          <video src={videoUrl} controls width="500" />
          <br />
          <a className="btn" href={videoUrl} download="screen-recording.webm">
            Download Video
          </a>
        </>
      )}

      <ul className="data">
        <li>
          <h2 className="heading">How to record the screen online?</h2>
          <p>To use our web-based screen recorder, follow these steps:</p>
        </li>
        <li>
          <h3>Go to the website</h3>
          <p>
            First, open the website of the online video editor in your web
            browser.
          </p>
        </li>
        <li>
          <h3>Select Layout</h3>
          <p>
            On the homepage, you will see two options – 'Full screen' if you
            want to record the entire screen, and 'Custom' to select a recording
            area. Choose the option that best fits your needs.
          </p>
        </li>
        <li>
          <h3>Start screen recording</h3>
          <p>
            Once you have selected the layout, click on the 'Start recording'
            button to begin the recording process.
          </p>
        </li>
        <li>
          <h3>Save and upload!</h3>
          <p>
            When you're done recording, click the notification to stop. The
            recorded video will be saved automatically, and you can upload and
            edit it using the video editor on the website.
          </p>
        </li>
      </ul>
    </div>
  );
};

export default ScreenRecorder;
