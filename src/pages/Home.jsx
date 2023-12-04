import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Model, TYPE } from '../Fit_guy';
import { useReactMediaRecorder } from 'react-media-recorder';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const [type, setType] = useState({type: TYPE.Idle, typePrev: null});
  const [iss, setiss] = useState(false);
  const navigate = useNavigate();

  const onClick = ({ type, data }) =>
    navigate('/workout', { state: { type, data } });

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
    <div
      className="container"
      style={{
        height: '60vh',
        margin: 0,
        marginLeft: '14%',
        position: 'absolute',
        top: '50%',
        msTransform: 'translateY(-50%)',
        transform: 'translateY(-50%)',
      }}
    >
      <div className="row h-100">
        <div className="col">
          <div
            onClick={() => onClick({ type: 'legs' })}
            className="h-100 border bg-light d-flex align-items-center justify-content-center"
            style={{
              color: 'white',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundImage:
                'url("https://liftmanual.com/wp-content/uploads/2023/05/Best-Leg-Workouts-for-Speed.png")',
            }}
          >
            <strong>LEGS</strong>
          </div>
        </div>
        <div className="col">
          <div
            onClick={() => onClick({ type: 'back' })}
            className="h-100 border bg-light d-flex align-items-center justify-content-center"
            style={{
              color: 'white',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundImage:
                'url("https://i0.wp.com/www.strengthlog.com/wp-content/uploads/2023/06/Back-exercises.jpg?fit=2304%2C1536&ssl=1")',
            }}
          >
            <strong>BACK</strong>
          </div>
        </div>
        <div className="col">
          <div
            onClick={() => onClick({ type: 'body' })}
            className="h-100 border bg-light d-flex align-items-center justify-content-center"
            style={{
              color: 'white',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundImage:
                'url("https://www.transparentlabs.com/cdn/shop/articles/how_long_muscle_1200x1200.jpg?v=1602607728")',
            }}
          >
            <strong>BODY</strong>
          </div>
        </div>
        <div className="col">
          <div className="row h-100">
            <div className="col-12">
              <div className="h-50 border bg-light d-flex align-items-center justify-content-center">
                <Canvas
                  camera={{ position: [3, 5, 24], fov: 5 }}
                  style={{
                    backgroundColor: '#111a21',
                    width: '300px',
                    height: '400px',
                  }}
                >
                  <ambientLight intensity={1.25} />
                  <ambientLight intensity={0.1} />
                  <directionalLight intensity={0.4} />
                  <Suspense fallback={null}>
                    <Model position={[0, -1, 0]} type={type.type} typePrev={type.typePrev} />
                  </Suspense>
                  <OrbitControls autoRotate={false} />
                </Canvas>
              </div>
            </div>
            <div className="col-12">
              <div className="h-50 d-flex align-items-center justify-content-center">
                <button
                  onClick={handleStartRecording}
                  className="btn btn-lg "
                  style={{ backgroundColor: '#4caf50', color: 'white' }}
                >
                  Start Recording
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}