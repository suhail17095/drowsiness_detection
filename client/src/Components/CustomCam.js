import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import sound from "./Sound/alarm.wav"
import useSound from 'use-sound';

const CustomCam = () => {
  const webcamRef = useRef(null);
  const iRef = useRef(null);
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState(null);
  const [drowsy, setDrowsy] = useState(null);
  const [active, setActive] = useState(null);
  const [playSound, { stop }] = useSound(sound, { loop: true });
  const [cameraPermission,setCameraPermission]=useState(false)



  const capture = React.useCallback(
    async () => {
      if(webcamRef.current){
      const imageSrc = webcamRef.current.getScreenshot();
      let response=null;
      try{
      response = await axios.post('http://localhost:5000/process_frame', { frame: imageSrc });
      const url = `data:image/jpeg;base64,${response.data.image}`;
      const cur_status = response.data.status;
      // console.log(cur_status)  
      if (cur_status == "Drowsy") {
        setDrowsy(prevDrowsy => {
          if (prevDrowsy + 1 >= 30) {
            Alert();
            if (prevDrowsy + 1 == 120) {
              alert("We will send mail instead of this alert message (yet to be integrated)");
            }
          }
          return prevDrowsy + 1;
        });
        setActive(0);
      }
      else if (cur_status == "Active") {
        setActive(preActive => {
          stop();
          removeAlert();
          return preActive + 1;
        });
        setDrowsy(0);
      }

      setImage(url);
      setStatus(cur_status);
      }
      catch(err)
      {
        console.log(err);
      }

    }
    },
    [webcamRef, playSound, stop, setImage]
  );
  function removeAlert() {
    if (iRef.current != null)

      iRef.current.classList.remove("alert");
  }
  function Alert() {
    console.log("hello world");
    playSound();
    iRef.current.classList.add("alert");
  }
  useEffect(() => {
    if(cameraPermission == false)
    {
      navigator.mediaDevices.getUserMedia({ video: true })
      .then(function(stream) {
        setCameraPermission(true);
        // Stop the stream after we're done testing for permission
        let tracks = stream.getTracks();
        tracks.forEach(function(track) {
          track.stop();
        });
      })
      .catch(function(err) {
        setCameraPermission(false);
      }); 
    }
    const interval = setInterval(capture, 100);  // Capture a frame every 100ms (1 second)
    return () => clearInterval(interval);  // Clear the interval when the component unmounts
  }, [capture]);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#282c34' }}>
    <h1 style={{ color: '#61dafb' }}>Welcome Suhail Shaikh</h1>
    {cameraPermission === true && (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#282c34', padding: '20px', borderRadius: '10px' }}>
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          style={{ borderRadius: '10px', marginRight: '20px' }}
        />
        {image && <img src={image} alt="" ref={iRef} style={{ borderRadius: '10px', boxShadow: '0px 0px 10px 5px rgba(0,0,0,0.1)' }} />}
      </div>
    )}
    {cameraPermission === false && <p>Camera permission is not granted</p>}
    {cameraPermission === null && <p>Checking camera permission...</p>}
    <h3 style={{ color: '#61dafb' }}>{"Drowsy: "+drowsy+" Active "+active}</h3>
  </div>
);

};

export default CustomCam;
