import React, {useEffect, useState, Suspense} from 'react';
import {Canvas} from '@react-three/fiber';
import {OrbitControls} from '@react-three/drei';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {useLocation} from 'react-router-dom';
import {Model, TYPE} from '../Fit_guy';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import logo from "../assets/logo.png";
import { Dropdown } from 'react-bootstrap';

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
            <div className="container exercises-container">
                <div className="row mt-1 muscle-group-label">
                    <div className="col d-flex align-items-center justify-content-center">
                        <h5>REQUESTED EXERCISES</h5>
                    </div>
                </div>
                <div className="container exercise-card-container">
                    {([...data, ...items]).reduce((rows, item, index) => {
                        const rowIndex = Math.floor(index / 3);
                        const colIndex = index % 3;

                        if (!rows[rowIndex]) {
                            rows[rowIndex] = [];
                        }
                        rows[rowIndex].push(
                            <div className="col-4 mt-1 mb-1" key={index}>
                                {show && item.id === id ?
                                    <Modal show={show} onHide={handleClose}>
                                        <Modal.Title className="modal-title">Perfomance example: {item.name || 'Default Title'}</Modal.Title>
                                        <Modal.Header>
                                            <Canvas className="modal-body"
                                                camera={{ position: [3, 5, 24], fov: 7 }}
                                                style={{
                                                    backgroundColor: '#111a21',
                                                    height: '500px',
                                                    width: '500px',
                                                }}>
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
                                <div className="card mb-3 exercise-card" style={{ maxWidth: '800px', height: '100%', width: '100%' }} >
                                    <div className="row g-0">
                                        <div className="col-md-4">
                                            <img
                                                src={
                                                    item?.file?.link ||
                                                    'https://liftmanual.com/wp-content/uploads/2023/05/Best-Leg-Workouts-for-Speed.png'
                                                }
                                                className="img-fluid rounded-start m-1"
                                                alt={item?.file?.name || 'Some name'}
                                                onClick={() => handleShow(item.id)}
                                            />
                                        </div>
                                        <div className="col-md-8">
                                            <div className="card-body">
                                                <h5 className="card-title" onClick={() => handleShow(item.id)}>{item.name || 'Some name'}</h5>
                                                <p className="card-text" onClick={() => handleShow(item.id)}>
                                                    Muscle Group: {item.muscleGroup || 'Some name'}
                                                </p>
                                                <p className="card-text" onClick={() => handleShow(item.id)}>Level: {item.level || 'Some name'}</p>
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                                        Show Description
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu>
                                                        <Dropdown.ItemText className="dropdown-item-text">
                                                            {item.descriptions || 'Some name'}
                                                        </Dropdown.ItemText>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                        return rows;
                    }, []).map((row, rowIndex) => (
                        <div className="row" key={rowIndex}>
                            {row}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
