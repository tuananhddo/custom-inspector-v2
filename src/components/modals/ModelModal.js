import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';
import ModelAPI from '../../API/ModelAPI';
import {Alert, Button} from 'reactstrap';
import {toast} from 'react-toastify';
import Events from '../../lib/Events';
import {DEFAULT_MODEL_URL} from '../../API/constants';

export default function ModelModal (props) {
  var Events = require('../../lib/Events.js');

  const isOpen = props.isOpen;
  const [assetsModel, setAssetModel] = useState([]);
  const [file, setFile] = useState();
  const [modelLink, setModelLink] = useState('');
  const [fileName, setFileName] = useState();
  const [cdnLink, setCdnLink] = useState('');
  useEffect(() => {
    generateFromAssets();
  }, [isOpen]);
  const generateFromAssets = () => {
    setAssetModel([]);
    var images = Array.prototype
      .slice.call(document.querySelectorAll('a-assets a-asset-item[src][flag=model]'));
    setAssetModel(images);
    console.log(images);
  };
  const demoItem = 0;
  const modelClick = () => {
    Events.emit('updateModelUploadedList', demoItem);
  };

  function onFileChange (e) {
    setFile(e.target.files[0]);
  }

  function addModelEntity (name, link) {
    const asset = document.querySelector('#mainAsset');
    Events.emit('entitycreate', {
      element: 'a-asset-item', components: {
        id: name,
        src: DEFAULT_MODEL_URL + '/' + link
      }
    });
    const assetItem = document.querySelectorAll('a-asset-item');
    Events.emit('entitycreate', {
      element: 'a-entity', components: {
        id: `entity-${name}`,
        'gltf-model': `#${name}`
      }
    });
    console.log(asset);
    console.log(assetItem);
    // Events.emit('entitycreate', { element: 'a-entity', components: {
    //   gltf-model:
    //   } });
  }

  function addCdnModelEntity (modelLink) {
    let assetId = 'cdn-' + Date.now();
    Events.emit('entitycreate', {
      element: 'a-asset-item', components: {
        id: assetId,
        src: modelLink
      }
    });
    Events.emit('entitycreate', {
      element: 'a-entity', components: {
        id: `entity-${name}`,
        'gltf-model': `#${assetId}`
      }
    });
  }

  useEffect(() => {
    !!modelLink && !!fileName && addModelEntity(fileName, modelLink);
    !!modelLink && !!cdnLink && addCdnModelEntity(modelLink);
    console.log(modelLink)
    setModelLink('');
    setCdnLink('');
    setFile('')
  }, [modelLink]);

  function confirmModel () {
    // addModelEntity(Date.now(), 'abc');
    if (!file && !!cdnLink) {
      setModelLink(cdnLink);
      props.onClose();
      return;
    }
    const formData = new FormData();
    formData.append(
      'model',
      file
    );
    ModelAPI.uploadModel(formData)
      .then(res => {
        if (res.status === 200) {
          setFileName(res.data.name);
          setModelLink(res.data.link);
        }
        console.log(res);
      });
    props.onClose();

  }

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

          <span>Load a new texture from one of these sources:</span>
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
              <ul
                // ref="registryGallery"
                className="gallery">
                {/*{this.renderRegistryImages()}*/}
                {/*<label className="custom-file-label" htmlFor="customFile">Choose file</label>*/}

                <input id="customFile" type="file" onChange={onFileChange}/>

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
          <img
            // ref="preview"
            width="155px"
            height="155px"
            // src={preview.src}
          />
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
