import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';
import ModelAPI from '../../API/ModelAPI';
import {Alert, Button} from 'reactstrap';
import {getId} from '../../API/constants';
import {s3upload} from '../../API/awsAPI';

const getModelFileName = () => {
  let fullPath = document.getElementById('customVideoFile').value;
  if (fullPath) {
    var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
    var filename = fullPath.substring(startIndex);
    if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
      filename = filename.substring(1);
    }
  }
  return filename;
};

const uploadModel = async (file, setModelLink, saveType) => {
  const formModelData = new FormData();
  formModelData.append(
    'model',
    file
  );

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
export default function VideoUploadModal (props) {
  var Events = require('../../lib/Events.js');

  const [file, setFile] = useState();
  const [modelLink, setModelLink] = useState('');
  const [cdnLink, setCdnLink] = useState('');

  function onFileChange (e) {
    setFile(e.target.files[0]);
  }

  function addModelEntity (link) {
    const asset = document.querySelector('#mainAsset');
    const assetId = getId('video');
    Events.emit('entitycreate', {
      element: 'video', components: {
        id: assetId,
        src: link,
        crossorigin: "anonymous"
      }
    });
    setTimeout(function () {
      Events.emit('entitycreate', {
        element: 'a-video', components: {
          id: getId('video-player'),
          src: `#${assetId}`,
          width: '4',
          height: '2',
          'video-handler': ''
        }
      });
    }, 1000);

  }

  useEffect(() => {
    !!modelLink && addModelEntity(modelLink);
    setModelLink('');
    setCdnLink('');
    setFile('');
  }, [modelLink]);

  function confirmModel () {
    if (!file && !cdnLink.trim()) {
      props.onClose();
      return;
    }
    if (cdnLink.trim()) {
      setModelLink(cdnLink);
      props.onClose();
      return;
    }
    // let saveType = document.querySelector('input[name = "server"]:checked').value;
    let saveType = 'aws';
    uploadModel(file, setModelLink, saveType);

    props.onClose();

  }

  return (
    <Modal
      id="videoModal"
      title="Video Uploader"
      isOpen={props.isOpen}
      onClose={props.onClose}
      closeOnClickOutside={false}
    >
      <Alert color="success" style={{color: 'green'}} className={!!modelLink ? '' : 'hide'}>
        Thêm mới thành công
      </Alert>
      <div className="newimage">

        <div className="new_asset_options">

          <span>Load a new video from one of these sources:</span>
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
              />
            </li>
            <li>
              <span>Tải lên </span>

              {/*<ul>*/}
              {/*  <input type="radio" id="local" name="server" value="local"/>*/}
              {/*  <label htmlFor="local">Máy chủ hiện tại </label>*/}
              {/*  <input type="radio" id="aws" name="server" value="aws" defaultChecked/>*/}
              {/*  <label htmlFor="aws">CDN Amazon (Nên dùng với file > 20mb)</label>*/}
              {/*</ul>*/}

              <ul
                className="gallery">
                <label className="custom-file-label" htmlFor="customVideoFile">Tải Video</label>
                <input id="customVideoFile" type="file" onChange={onFileChange} accept=".mp4"/>
              </ul>
            </li>
            <li>
              <Button color="primary" size="lg" block onClick={confirmModel}>Xác nhận chọn Model</Button>
            </li>
          </ul>
        </div>
        <div className="preview">
          <img
            width="155px"
            height="155px"
          />
          <br/>
        </div>
      </div>

    </Modal>
  );
}

VideoUploadModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  selectedModel: PropTypes.string
};
