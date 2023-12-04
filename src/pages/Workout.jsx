import React, { useEffect, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Model, TYPE } from '../Fit_guy';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function Workout() {
  const {
    state: { type, data = [] },
  } = useLocation();
  
  const [items, setItems] = useState([]);

  const getItems = async () => {
    let result = {};
    try {
      result = await axios.get(`http://localhost:3002/workouts?muscleGroup=${type}`);
    } catch (e) {
      console.log(e.message);
    }
    setItems(result?.data?.data);
  };

  useEffect(() => {
    type && getItems();
  }, [type]);
  
  const [show, setShow] = useState(false);
  const [id, setId] = useState(0);

  const handleClose = () => {
    setShow(false)
    setId(0)
  };
  const handleShow = (id) => {
    setShow(true)
    setId(id)
  };

  const getType = (muscleGroup) => {
    if (muscleGroup === 'back') {
      return TYPE.Rhomboid_pulls;
    } else if (muscleGroup === 'legs') {
      return TYPE.Squats;
    } else if (muscleGroup === 'body') {
      return TYPE.Push_ups;
    } 
    return TYPE.some;
  }

  return [...data, ...items].map((item) => (
    <div className="list-group align-items-center justify-content-center mt-2">
          {show && item.id === id ?
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Canvas
            camera={{ position: [3, 5, 24], fov: 7 }}
            style={{
              backgroundColor: '#111a21',
              height: '500px',
              width: '500px',
            }}
          >
            <ambientLight intensity={1.25} />
            <ambientLight intensity={0.1} />
            <directionalLight intensity={0.4} />
            <Suspense fallback={null}>
              <Model position={[0, -0.8, 0]} type={getType(item.muscleGroup)} />
            </Suspense>
            <OrbitControls autoRotate />
          </Canvas>
        </Modal.Header>
      </Modal>
           : null}
      <div className="card mb-3" style={{ maxWidth: '800px' }} onClick={() => handleShow(item.id)}>
        <div className="row g-0">
          <div className="col-md-4">
            <img
              src={
                item?.file?.link ||
                'https://liftmanual.com/wp-content/uploads/2023/05/Best-Leg-Workouts-for-Speed.png'
              }
              className="img-fluid rounded-start"
              alt={item?.file?.name || 'Some name'}
            />
            
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h5 className="card-title">{item.name || 'Some name'}</h5>
              <p className="card-text">{item.descriptions || 'Some name'}</p>
              <p className="card-text">Level: {item.level || 'Some name'}</p>
              <p className="card-text">
                Muscle Group: {item.muscleGroup || 'Some name'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ));
}
