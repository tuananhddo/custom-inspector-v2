import React, {useEffect, useState} from 'react';
import ModelAPI from '../API/ModelAPI';
import Modal from '../components/modals/Modal';

var Events = require('../lib/Events.js');

const TransformButtons = [
  {value: 'translate', icon: 'fa-arrows-alt'},
  {value: 'rotate', icon: 'fa-repeat'},
  {value: 'scale', icon: 'fa-expand'}
];
const openDialog = () => {
  Events.emit('openModelModal', '', item => {
  });
};

function createWall () {
  Events.emit('entitycreate', {
    element: 'a-entity', components: {
      id: `wall-${Date.now()}`,
      geometry: 'primitive: box',
      scale: '6.536 3.5 0.14'

    }
  });
}

function createCheckPoint () {
  Events.emit('entitycreate', {
    element: 'a-entity', components: {
      id: `checkpoint-${Date.now()}`,
      geometry: 'primitive: sphere',
      scale: '6.536 3.5 0.14',
      'cursor-listener': ''
    }
  });
}

function uploadImage () {

}

function createDoor () {
    Events.emit('entitycreate', {
    element: 'a-entity', components: {
      id: `door-${Date.now()}`,
      'gltf-model': "#door-glb"
    }
  });
}

function createBase () {

}

const FunctionButtons = [
  {value: 'Create Model', icon: 'fa-angle-double-up', onClick: openDialog},
  {value: 'Create Wall', icon: 'fa-map-o', onClick: createWall},
  {value: 'Create Checkpoint', icon: 'fa-bullseye', onClick: createCheckPoint},
  {value: 'Create Door', icon: 'fa-columns', onClick: createDoor},
  {value: 'Upload Image', icon: 'fa-picture-o', onClick: uploadImage},
  {value: 'Create Base For Object', icon: 'fa-hourglass', onClick: createBase},

];

export default function TransformToolbarVer2 (props) {
  const [selectedTransform, setSelectedTransform] = useState('translate');
  var classNames = require('classnames');

  useEffect(() => {
    Events.on('transformmodechange', mode => {
      setSelectedTransform(mode);
    });
  }, []);
  const renderTransformButtons = () => {
    return TransformButtons.map(
      (option, i) => {
        var selected = option.value === selectedTransform;
        var classes = classNames({
          button: true,
          fa: true,
          [option.icon]: true,
          active: selected
        });

        return (
          <a
            title={option.value}
            value={option.value}
            key={i}
            onClick={() => changeTransformMode(option.value)}
            className={classes}
          />
        );
      }
    );
  };
  const renderFunctionButtons = () => {
    return FunctionButtons.map(
      (option, i) => {
        var selected = option.value === selectedTransform;
        var classes = classNames({
          button: true,
          fa: true,
          [option.icon]: true,
          active: selected
        });

        return (
          <a
            title={option.value}
            value={option.value}
            key={i}
            onClick={option.onClick}
            className={classes}
          />
        );
      }
    );
  };
  const changeTransformMode = mode => {
    setSelectedTransform(mode);
    Events.emit('transformmodechange', mode);
    ga('send', 'event', 'Toolbar', 'selectHelper', mode);
  };

  function clientCoordsTo3DCanvasCoords (
    clientX,
    clientY,
    offsetX,
    offsetY,
    clientWidth,
    clientHeight
  ) {
    return {
      x: (((clientX - offsetX) / clientWidth) * 2) - 1,
      y: (-((clientY - offsetY) / clientHeight) * 2) + 1
    };
  }

  let mouseXX = null;
  let mouseYY = null;
  let mouseXX2 = null;
  let mouseYY2 = null;
  // document.onmousedown = (e) => {
  //   if (e instanceof CustomEvent) {
  //     return;
  //   }
  //   const {x: mouseX, y: mouseY} = clientCoordsTo3DCanvasCoords(
  //     e.clientX, e.clientY,
  //     0, 0, // TODO: Replace with canvas position
  //     window.innerWidth,
  //     window.innerHeight
  //   );
  //   mouseXX = mouseX;
  //   mouseYY = mouseY;
  //   // console.log('x: ' + e.clientX + ' y: ' + e.clientY);
  //   let mouse = new THREE.Vector2();
  //   let camera = AFRAME.scenes[0].camera;
  //   let rect = document.querySelector('body').getBoundingClientRect();
  //   mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  //   mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  //   let vector = new THREE.Vector3(mouse.x, mouse.y, -1).unproject(camera);
  //   mouseXX = vector.x;
  //   mouseYY = vector.y;
  //   console.log(vector);
  //   console.log(mouseX + ':' + mouseY);
  // };
  // document.onmouseup = (e) => {
  //   if (e instanceof CustomEvent) {
  //     return;
  //   }
  //   const {x: mouseX, y: mouseY} = clientCoordsTo3DCanvasCoords(
  //     e.clientX, e.clientY,
  //     0, 0, // TODO: Replace with canvas position
  //     window.innerWidth,
  //     window.innerHeight
  //   );
  //   mouseXX2 = mouseX;
  //   mouseYY2 = mouseY;
  //   // console.log('x: ' + e.clientX + ' y: ' + e.clientY);
  //   console.log(mouseX + ':' + mouseY);
  //   // mouseYY && mouseXX &&
  //   // Events.emit('entitycreate', {
  //   //   element: 'a-entity', components: {
  //   //     id: `wall-${Date.now()}`,
  //   //     geometry: 'primitive: box',
  //   //     // position: '1 1 1',
  //   //     position: `${mouseXX} ${mouseYY} 1`,
  //   //     scale: '6.536 3.5 0.14'
  //   //
  //   //   }
  //   // });
  //   mouseXX = null;
  //   mouseYY = null;
  // };

  function onFileChange (e) {
    console.log(e.target.files[0]);
    const formData = new FormData();
    formData.append(
      'model',
      e.target.files[0]
    );
    // if (confirm('Bạn muốn tải model lên ?') === true) {
    //   ModelAPI.uploadModel(formData);
    // }
    ModelAPI.uploadModel(formData);

  }

  return (
    <div id="transformToolbar" className="toolbarButtons">
      {renderTransformButtons()}
      {renderFunctionButtons()}
    </div>
  );
}
