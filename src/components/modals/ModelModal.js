import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';
import ModelAPI from '../../API/ModelAPI';
import {Alert, Button} from 'reactstrap';
import {getId} from '../../API/constants';
import {s3upload} from '../../API/awsAPI';

const getModelFileName = () => {
  let fullPath = document.getElementById('customFile').value;
  if (fullPath) {
    var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
    var filename = fullPath.substring(startIndex);
    if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
      filename = filename.substring(1);
    }
  }
  return filename;
};

const uploadModel = async (file, audioFile, setAudioLink, setModelLink, saveType) => {
  const formModelData = new FormData();
  formModelData.append(
    'model',
    file
  );
  if (!!audioFile) {
    const formAudioData = new FormData();
    formAudioData.append(
      'audio',
      audioFile
    );
    const resAudio = await ModelAPI.uploadAudio(formAudioData);
    if (resAudio.status == 200) {
      setAudioLink(resAudio.data.link);
    }
  }
  let resModel = {data: {link: ''}};
  let modelFileName = getModelFileName();
  if (saveType == 'local') {
    resModel = await ModelAPI.uploadModel(formModelData);
  } else {
    s3upload(file, modelFileName, setModelLink);
  }
  // const resModel = (saveType == 'local') ? await ModelAPI.uploadModel(formModelData) : s3upload(file, modelFileName);
  console.log(resModel);
  setModelLink(resModel.data.link);

};
export default function ModelModal (props) {
  var Events = require('../../lib/Events.js');

  const isOpen = props.isOpen;
  const [assetsModel, setAssetModel] = useState([]);
  const [file, setFile] = useState();
  const [modelLink, setModelLink] = useState('');
  const [cdnLink, setCdnLink] = useState('');
  const [textureUpload, setTextureUpload] = useState(false);
  const [textureFile, setTextureFile] = useState();
  const [audioFile, setAudioFile] = useState();
  const [audioLink, setAudioLink] = useState('');
  const [des, setDes] = useState('');

  useEffect(() => {
    generateFromAssets();
  }, [isOpen]);
  const generateFromAssets = () => {
    setAssetModel([]);
    var images = Array.prototype
      .slice.call(document.querySelectorAll('a-assets a-asset-item[src][flag=model]'));
    setAssetModel(images);
  };

  function onFileChange (e) {
    setFile(e.target.files[0]);
  }

  function onTextureFileChange (e) {
    setTextureFile(e.target.files[0]);
  }

  function onAudioFileChange (e) {
    setAudioFile(e.target.files[0]);
  }

  function addModelEntity (link, audioLink) {
    const asset = document.querySelector('#mainAsset');
    const assetId = getId('localModel');
    const audioId = getId('audio');
    Events.emit('entitycreate', {
      element: 'a-asset-item', components: {
        id: assetId,
        src: link
      }
    });
    !!audioLink && Events.emit('entitycreate', {
      element: 'audio', components: {
        id: audioId,
        src: audioLink
      }
    });
    const assetItem = document.querySelectorAll('a-asset-item');
    setTimeout(function () {
      Events.emit('entitycreate', {
        element: 'a-entity', components: {
          id: getId('model-3d'),
          'gltf-model': `#${assetId}`,
          sound: `src: #${audioId}`,
          audiohandler: '',
          detailhandler:'',
          description: des
        }
      });
    }, 1000);

  }

  useEffect(() => {
    !!modelLink && addModelEntity(modelLink, audioLink);
    setModelLink('');
    setCdnLink('');
    setFile('');
    setAudioFile('');
    setAudioLink('');
    setDes('')
  }, [modelLink]);

  function confirmModel () {
    if (!file && !cdnLink.trim()) {
      props.onClose();

      return;
    }
    if (cdnLink.trim()) {
      if (!!audioFile) {
        const formAudioData = new FormData();
        formAudioData.append(
          'audio',
          audioFile
        );
        ModelAPI.uploadAudio(formAudioData)
          .then(res => {
            if (res.status == 200) {
              setAudioLink(res.data.link);
              setModelLink(cdnLink);
            }
          });

      }
      props.onClose();
      return;
    }
    let saveType = document.querySelector('input[name = "server"]:checked').value;
    uploadModel(file, audioFile, setAudioLink, setModelLink, saveType);

    props.onClose();

  }

  const setModelType = () => {
    let modelType = document.querySelector('input[name = "type"]:checked').value;
    modelType == 'obj' ? setTextureUpload(true) : setTextureUpload(false);
  };
  return (
    <Modal
      id="modelModal"
      title="Models"
      isOpen={props.isOpen}
      onClose={props.onClose}
      closeOnClickOutside={false}
    >
      <Alert id='uploadSuccess' color="success" style={{color: 'green'}} className={!!modelLink ? '' : 'hide'}>
        Thêm mới thành công
      </Alert>
      <div className="newimage">

        <div className="new_asset_options">

          <span>Load a new model from one of these sources:</span>
          <ul>
            <li>
              <span>From URL (and press Enter):</span>{' '}
              <input
                type="text"
                className="imageUrl"
                value={cdnLink}
                onChange={(e) => {
                  setCdnLink(e.target.value);
                }}
                // onKeyUp={this.onNewUrl}
              />
            </li>
            <li>
              <span>Tải lên </span>

              <ul>
                <input type="radio" id="local" name="server" value="local"/>
                <label htmlFor="local">Máy chủ hiện tại </label>
                <input type="radio" id="aws" name="server" value="aws" defaultChecked/>
                <label htmlFor="aws">CDN Amazon (Nên dùng với file > 20mb)</label>
              </ul>
              {/*<ul>*/}
              {/*  <input type="radio" id="local" name="type" value="gltf" checked onClick={setModelType}/>*/}
              {/*  <label htmlFor="local">GLTF</label>*/}
              {/*  <input type="radio" id="aws" name="type" value="obj" onClick={setModelType}/>*/}
              {/*  <label htmlFor="aws">OBJ</label>*/}
              {/*</ul>*/}
              {textureUpload &&
              <ul
                // ref="registryGallery"
                className="gallery">
                {/*{this.renderRegistryImages()}*/}
                {/*<label className="custom-file-label" htmlFor="customFile">Choose file</label>*/}
                <label htmlFor="files" className="btn">Tải texture: </label>

                <input id="texture" type="file" onChange={onTextureFileChange}/>

              </ul>
              }
              <ul
                className="gallery">
                <label className="custom-file-label" htmlFor="customFile">Tải file âm thanh</label>
                <input id="audioFile" type="file" onChange={onAudioFileChange} accept=".mp3,.wav"/>

              </ul>
              <ul
                // ref="registryGallery"
                className="gallery">
                {/*{this.renderRegistryImages()}*/}
                <label className="custom-file-label" htmlFor="customFile">Tải Model</label>
                <input id="customFile" type="file" onChange={onFileChange} accept=".gltf,.glb"/>

              </ul>
            </li>
            <li>
              <Button color="primary" size="lg" block onClick={confirmModel}>Xác nhận chọn Model</Button>

            </li>
          </ul>
        </div>
        <div className="preview">
          {/*Name:{' '}*/}
          {/*<input*/}
          {/*  // ref="imageName"*/}
          {/*  // className={*/}
          {/*  //   this.state.preview.name.length > 0 && !validUrl ? 'error' : ''*/}
          {/*  // }*/}
          {/*  readOnly*/}
          {/*  type="text"*/}
          {/*  value={modelLink}*/}
          {/*  // onChange={this.onNameChanged}*/}
          {/*  // onKeyUp={this.onNameKeyUp}*/}
          {/*/>*/}
          <textarea
            id="w3review"
            name="w3review"
            className='detail'
            rows="20"
            cols="50"
            value={des}
            onChange={ (e)=>{
              console.log(e.target.value)
              setDes(e.target.value)
            }}
            placeholder={'Mô tả vật thể'}
          >
          </textarea>
          {/*<img*/}
          {/*  // ref="preview"*/}
          {/*  width="155px"*/}
          {/*  height="155px"*/}
          {/*  // src={preview.src}*/}
          {/*/>*/}
          {/*{this.state.preview.loaded ? (*/}
          {/*  <div className="detail">*/}
          {/*      <span className="title" title={preview.filename}>*/}
          {/*        {preview.filename}*/}
          {/*      </span>*/}
          {/*    <br/>*/}
          {/*    <span>*/}
          {/*        {preview.width} x {preview.height}*/}
          {/*      </span>*/}
          {/*  </div>*/}
          {/*) : (*/}
          {/*  <span/>*/}
          {/*)}*/}
          <br/>
          {/*<button disabled={!validAsset} onClick={this.addNewAsset}>*/}
          {/*  LOAD THIS TEXTURE*/}
          {/*</button>*/}
        </div>
      </div>

    </Modal>
  );
}

ModelModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  selectedModel: PropTypes.string
};
