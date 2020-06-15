import React, {useEffect, useState} from 'react';
import ModelAPI from '../API/ModelAPI';
import Modal from '../components/modals/Modal';
import {getId} from '../API/constants';

var Events = require('../lib/Events.js');
import {removeSelectedEntity} from '../lib/entity';

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
    element: 'a-box', components: {
      id: getId('wall'),
      scale: '6.536 3.5 0.14',
      color: '#cdc6c6'
    }
  });
}

function createCheckPoint () {
  Events.emit('entitycreate', {
    element: 'a-entity', components: {
      id: getId('check-point'),
      geometry: 'primitive: sphere',
      scale: '6.536 3.5 0.14',
      'cursor-listener': ''
    }
  });
}

function uploadImage () {
  Events.emit('openUploadImageModal', '', item => {
  });
}

function createDoor () {
  Events.emit('entitycreate', {
    element: 'a-entity', components: {
      id: getId('door'),
      'gltf-model': '#door-glb'
    }
  });
}

function createBase () {
  Events.emit('entitycreate', {
    element: 'a-entity', components: {
      id: getId('base'),
      'gltf-model': '#base-glb'
    }
  });
}

function deleteEntity () {
  let selected = AFRAME.INSPECTOR.selectedEntity;
  console.log();
  removeSelectedEntity(true);
}

const FunctionButtons = [
  {value: 'Create Model', icon: 'fa-angle-double-up', onClick: openDialog},
  {value: 'Create Wall', icon: 'fa-map-o', onClick: createWall},
  {value: 'Create Checkpoint', icon: 'fa-bullseye', onClick: createCheckPoint},
  {value: 'Create Door', icon: 'fa-columns', onClick: createDoor},
  {value: 'Upload Image', icon: 'fa-picture-o', onClick: uploadImage},
  {value: 'Create Base For Object', icon: 'fa-hourglass', onClick: createBase},
  {value: 'Delete', icon: 'fa-hourglass', onClick: deleteEntity}

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
