import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import sound from "./Sound/alarm.wav"
import useSound from 'use-sound';
import { useNavigate } from 'react-router-dom';
import Acknowledgement from './Acknowledgement';
const CustomCam = (props) => {
  const Navigate=useNavigate()
  const webcamRef = useRef(null);
  const iRef = useRef(null);
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState(null);
  const [drowsy, setDrowsy] = useState(null);
  const [active, setActive] = useState(null);
  const [alert, setAlert] = useState(false);
  const [playSound, { stop }] = useSound(sound, { loop: true });
  const [cameraPermission, setCameraPermission] = useState(false)
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const timeoutId = useRef(null);

  function handleCloseAlert() {
    setAlert(false);
    setDrowsy(0);
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }
  };
  async function sendMail(status)
  {
    console.log("Inside sendMail");
    console.log("Curr user "+props.curUser);
    const email=props.curUser;
    try{
    const res=await axios.post("http://localhost:3002/get_details",{email:email});
    console.log("First messsage"+res.data);
    try{
      const name=res.data.name;
      const email1=res.data.email1;
      const email2=res.data.email2;
      const phone=res.data.phone;
      const currLocation= await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            reject(error);
          }
        );
      });
      
      const res1=await axios.post("http://localhost:3002/send_email",{name:name,email1:email1,email2:email2,phone:phone,longitude:currLocation.longitude,latitude:currLocation.latitude,status:status});
      console.log("second message"+res1.data);
    }
    catch(e)
    {
      console.log("Error inside second one ");
      console.log(e);
    }
   
    }
    catch(err)
    {
      console.log(err);
    }

  }
  const capture = React.useCallback(
    async () => {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        let response = null;
        try {
          response = await axios.post('http://localhost:5000/process_frame', { frame: imageSrc });
          const url = `data:image/jpeg;base64,${response.data.image}`;
          const cur_status = response.data.status;
          // console.log(cur_status)  
          if (cur_status == "Drowsy") {
            setDrowsy(prevDrowsy => {
              if (prevDrowsy + 1 >= 30) {
                Alert();
                if (prevDrowsy + 1 == 120) {
                  setAlert(true);
                  if(!timeoutId.current){
                    timeoutId.current = setTimeout(() => {
                      sendMail("Alert");
                      console.log("I have send the mail");
                      // HERE WE WILL INVOKE THE SEND MAIL AXIOS POST.
                      Navigate("/acknowledgement");
                    }, 5000);
                 
                }
              }
              }
              return prevDrowsy + 1;
            });
            setActive(0);
          }
          else {
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
        catch (err) {
          console.log(err);
        }

      }
    },
    [webcamRef, playSound, stop, setImage,alert,setAlert]
  );
  function removeAlert() {
    if (iRef.current != null)

      iRef.current.classList.remove("alert");
  }
  function Alert() {
    
    playSound();
    iRef.current.classList.add("alert");
  }

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((permissionStatus) => {
          if (permissionStatus.state === 'granted') {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setLocation({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                });
              },
              (error) => {
                console.error(error);
              }
            );
          } else if (
            permissionStatus.state === 'prompt' ||
            permissionStatus.state === 'denied'
          ) {
            alert('Please allow location access.');
          }
        });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };


  useEffect(() => {
    if (cameraPermission == false) {
      getLocation();
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
          setCameraPermission(true);
          // Stop the stream after we're done testing for permission
          let tracks = stream.getTracks();
          tracks.forEach(function (track) {
            track.stop();
          });
        })
        .catch(function (err) {
          setCameraPermission(false);
        });
    }
    const interval = setInterval(capture, 100);  // Capture a frame every 100ms (1 second)
    return () => clearInterval(interval);  // Clear the interval when the component unmounts
  }, [capture]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#282c34' }}>

      <h1 style={{ color: '#61dafb' }}>Welcome Suhail Shaikh</h1>
      {alert == true &&
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
          <strong>Attention!!</strong> We are sending alert mail to your family. Press the cross button to dissmiss it.
          <button type="button" class="close" data-dismiss="alert" aria-label="Close" onClick={handleCloseAlert}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>}
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
      {<p>longitute: {location.longitude}</p>}
      {<p>latitude: {location.latitude}</p>}
      <h3 style={{ color: '#61dafb' }}>{"Drowsy: " + drowsy + " Active " + active}</h3>

    </div>
  );

};

export default CustomCam;
