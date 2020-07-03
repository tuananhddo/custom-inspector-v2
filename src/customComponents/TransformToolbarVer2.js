import React, {useEffect, useState} from 'react';
import ModelAPI from '../API/ModelAPI';
import Modal from '../components/modals/Modal';
import {getId} from '../API/constants';

var Events = require('../lib/Events.js');
import {removeSelectedEntity} from '../lib/entity';

const TransformButtons = [
  {name: 'Di chuyển', value: 'translate', icon: 'fa-arrows-alt'},
  {name: 'Xoay', value: 'rotate', icon: 'fa-repeat'},
  {name: 'Co giãn', value: 'scale', icon: 'fa-expand'}
];
const openDialog = () => {
  Events.emit('openModelModal', '', item => {
  });
};
const openVideoDialog = () => {
  Events.emit('openUploadVideoModal', '', item => {
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

function createLight () {
  Events.emit('entitycreate', {
    element: 'a-entity', components: {
      id: getId('light'),
      light: 'directional'
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
  if (confirm('Bạn có chắc muốn xóa đối tượng')) {
    removeSelectedEntity(true);
  }

}

function resetProfile () {
  if (confirm('Bạn có chắc muốn reset hồ sơ triển lãm')) {
    ModelAPI.reset().then(
      location.reload()
    );
  }

}

const FunctionButtons = [
  {value: 'Thêm Mô hình', icon: 'fa-angle-double-up', onClick: openDialog},
  {value: 'Thêm ánh sáng', icon: 'fa-lightbulb-o', onClick: createLight},
  {value: 'Thêm tường', icon: 'fa-map-o', onClick: createWall},
  {value: 'Thêm điểm dừng', icon: 'fa-bullseye', onClick: createCheckPoint},
  {value: 'Thêm cửa', icon: 'fa-columns', onClick: createDoor},
  {value: 'Thêm ảnh', icon: 'fa-picture-o', onClick: uploadImage},
  {value: 'Thêm bệ đỡ', icon: 'fa-hourglass', onClick: createBase},
  {value: 'Xóa đối tượng', icon: 'fa-times', onClick: deleteEntity},
  {value: 'Thêm video', icon: 'fa-file-video-o', onClick: openVideoDialog},
  {value: 'Đặt lại', icon: 'fa-recycle', onClick: resetProfile}

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
            title={option.name}
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
