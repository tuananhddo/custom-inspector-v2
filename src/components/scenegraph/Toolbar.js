import classnames from 'classnames';
import React from 'react';
import Events from '../../lib/Events.js';
import {saveBlob, saveString} from '../../lib/utils';
import {DEFAULT_SYNC_URL, DEFAULT_URL, profileId} from '../../API&Constant/constants';

const LOCALSTORAGE_MOCAP_UI = 'aframeinspectormocapuienabled';

function filterHelpers (scene, visible) {
  scene.traverse(o => {
    if (o.userData.source === 'INSPECTOR') {
      o.visible = visible;
    }
  });
}

function getSceneName (scene) {
  return scene.id || slugify(window.location.host + window.location.pathname);
}

/**
 * Slugify the string removing non-word chars and spaces
 * @param  {string} text String to slugify
 * @return {string}      Slugified string
 */
function slugify (text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '-') // Replace all non-word chars with -
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

/**
 * Tools and actions.
 */
export default class Toolbar extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      isPlaying: false
    };
  }

  exportSceneToGLTF () {
    ga('send', 'event', 'SceneGraph', 'exportGLTF');
    const sceneName = getSceneName(AFRAME.scenes[0]);
    const scene = AFRAME.scenes[0].object3D;
    filterHelpers(scene, false);
    AFRAME.INSPECTOR.exporters.gltf.parse(
      scene,
      function (buffer) {
        filterHelpers(scene, true);
        const blob = new Blob([buffer], {type: 'application/octet-stream'});
        saveBlob(blob, sceneName + '.glb');
      },
      {binary: true}
    );
  }

  addEntity () {
    Events.emit('entitycreate', {element: 'a-entity', components: {}});
  }

  /**
   * Try to write changes with aframe-inspector-watcher.
   */
  writeChanges = () => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', DEFAULT_SYNC_URL + '/' + profileId + '/save');
    xhr.onerror = () => {
      alert('Có lỗi xảy ra trong quá trình đồng bộ');
    };
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(AFRAME.INSPECTOR.history.updates));
  };

  toggleScenePlaying = () => {
    if (this.state.isPlaying) {
      AFRAME.scenes[0].pause();
      this.setState({isPlaying: false});
      AFRAME.scenes[0].isPlaying = true;
      document.getElementById('aframeInspectorMouseCursor').play();
      return;
    }
    AFRAME.scenes[0].isPlaying = false;
    AFRAME.scenes[0].play();
    this.setState({isPlaying: true});
  };

  render () {
    const watcherClassNames = classnames({
      button: true
    });
    const watcherTitle = 'Lưu chỉnh sửa';

    return (
      <div id="toolbar">
        <div className="toolbarActions row">
          {/*<a*/}
          {/*  className="button fa fa-plus"*/}
          {/*  title="Add a new entity"*/}
          {/*  onClick={this.addEntity}*/}
          {/*/>*/}
          {/*<a*/}
          {/*  id="playPauseScene"*/}
          {/*  className={'button fa ' + (this.state.isPlaying ? 'fa-pause' : 'fa-play')}*/}
          {/*  title={this.state.isPlaying ? 'Pause scene' : 'Resume scene'}*/}
          {/*  onClick={this.toggleScenePlaying}>*/}
          {/*</a>*/}
          <a className={'ml-3 col-4'}
             title="Export to GLTF"
             onClick={this.exportSceneToGLTF}>
            <img src={'https://aframe.io/aframe-inspector/assets/gltf.svg'} style={{height: '40px', width: '40px'}}/>
          </a>
          <a className={'col-4 mt-2'}
             title={watcherTitle}
             onClick={this.writeChanges}
          >
            <i className='fa fa-save' style={{fontSize: '25px'}}></i>
          </a>
        </div>
      </div>
    );
  }
}
