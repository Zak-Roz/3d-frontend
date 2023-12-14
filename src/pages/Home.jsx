import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Model, TYPE } from '../Fit_guy';
import { useReactMediaRecorder } from 'react-media-recorder';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from './../assets/logo.png';

export default function Home() {
  const [type, setType] = useState({type: TYPE.Idle, typePrev: null});
  const [iss, setiss] = useState(false);
  const navigate = useNavigate();

    const onClick = ({type, data}) =>
        navigate('/workout', {state: {type, data}});
    const [isActive, setIsActive] = useState(false);

  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({
      audio: true,
      video: false,
      type: 'audio/wav',
      onStop: async (blobUrl, blob) => {
        let formData = new FormData();
        const audioFile = new File([blob], 'record.wav', { type: 'audio/wav' });
        formData.append('file', audioFile);
        let result = {};
        try {
          result = await axios.post(
            'http://localhost:3002/workouts/speech-to-text',
            formData
          );
        } catch (e) {
          console.log(e.message);
        }

        ////////////////////////
        if (result?.data?.data?.length) {
          onClick({ data: result.data.data });
        }
      },
    });

    const handleStartRecording = useCallback(() => {
        setIsActive(!isActive);
        setType({type: TYPE.Listening, typePrev: TYPE.Idle});
        setiss(true)
        startRecording();
        setTimeout(() => {
            setType({type: TYPE.Idle, typePrev: TYPE.Listening});
            setiss(false)
            stopRecording();
        }, 5000);
    }, [])

    return (
        <div className="container-fluid">
            <div className="row">
                <nav className="navbar navbar-light bg-secondary">
                    <div className="container-fluid align-items-center justify-content-center"
                         style={{
                             userSelect: 'none',
                         }}>
                        <a className="navbar-brand" href="">
                            <img src={logo} alt="" width="150" height="75" className="d-inline-block align-text-top"/>
                        </a>
                    </div>
                </nav>
            </div>

            <div className="row mt-5">
                <div className="col ">
                    <div className="container muscle-groups-container">
                        <div className="row mt-1 muscle-group-label">
                            <div className="col d-flex align-items-center justify-content-center ">
                                <h5>MUSCLE GROUPS</h5>
                            </div>
                        </div>
                        <div className="row h-100 mt-4">
                            <div className="col card-column">
                                <div
                                    onClick={() => onClick({type: 'legs'})}
                                    className="muscle-group-card h-100 border bg-light d-flex align-items-center justify-content-center rounded-5 hover-effect"
                                    style={{
                                        color: 'white',
                                        backgroundPosition: 'center',
                                        backgroundSize: 'cover',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundImage:
                                            'url("https://liftmanual.com/wp-content/uploads/2023/05/Best-Leg-Workouts-for-Speed.png")',
                                        userSelect: 'none',
                                    }}>
                                    <strong>LEGS</strong>
                                </div>
                            </div>
                            <div className="col">
                                <div
                                    onClick={() => onClick({type: 'back'})}
                                    className="muscle-group-card h-75 border bg-light d-flex align-items-center justify-content-center rounded-5 hover-effect"
                                    style={{
                                        color: 'white',
                                        backgroundPosition: 'center',
                                        backgroundSize: 'cover',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundImage:
                                            'url("https://i0.wp.com/www.strengthlog.com/wp-content/uploads/2023/06/Back-exercises.jpg?fit=2304%2C1536&ssl=1")',
                                        userSelect: 'none',
                                    }}>
                                    <strong>BACK</strong>
                                </div>
                            </div>
                            <div className="col">
                                <div
                                    onClick={() => onClick({type: 'body'})}
                                    className="muscle-group-card h-75 border bg-light d-flex align-items-center justify-content-center rounded-5 hover-effect"
                                    style={{
                                        color: 'white',
                                        backgroundPosition: 'center',
                                        backgroundSize: 'cover',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundImage:
                                            'url("https://www.transparentlabs.com/cdn/shop/articles/how_long_muscle_1200x1200.jpg?v=1602607728")',
                                        userSelect: 'none',
                                    }}>
                                    <strong>BODY</strong>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="col-4 ">
                    <div className="row">
                        <div className="col  d-flex justify-content-center">
                            <Canvas className="rounded-5 shadowed"
                                    camera={{position: [3, 5, 24], fov: 5}}
                                    style={{
                                        backgroundColor: '#111a21',
                                        width: '300px',
                                        height: '400px',
                                    }}
                            >
                                <ambientLight intensity={1.25}/>
                                <ambientLight intensity={0.1}/>
                                <directionalLight intensity={0.4}/>
                                <Suspense fallback={null}>
                                    <Model position={[0, -1, 0]} type={type.type} typePrev={type.typePrev}/>
                                </Suspense>
                                <OrbitControls autoRotate={false}/>
                            </Canvas>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col d-flex justify-content-center">
                            <div
                                className={`voice-button ${isActive ? 'active' : ''}`}
                                onClick={handleStartRecording}
                            >
                                <FontAwesomeIcon icon={isActive ? faStop : faMicrophone}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}