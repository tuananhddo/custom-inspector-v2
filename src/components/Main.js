import React from 'react';

THREE.ImageUtils.crossOrigin = '';

const Events = require('../lib/Events.js');
import ComponentsSidebar from './components/Sidebar';
import ModalTextures from './modals/ModalTextures';
import ModalHelp from './modals/ModalHelp';
import SceneGraph from './scenegraph/SceneGraph';
import CameraToolbar from './viewport/CameraToolbar';
import TransformToolbar from './viewport/TransformToolbar';
import ViewportHUD from './viewport/ViewportHUD';
import {injectCSS} from '../lib/utils';
import ModelModal from './customModal/ModelModal';
import TransformToolbarVer2 from '../customComponents/TransformToolbarVer2';
import UploadImageModal from './customModal/UploadImageModal';
import VideoUploadModal from './customModal/VideoUploadModal';

// Megahack to include font-awesome.
injectCSS('https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css');

export default class Main extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      entity: null,
      inspectorEnabled: true,
      isModalTexturesOpen: false,
      isModelModalOpen: false,
      isUploadImageModalOpen: false,
      isUploadVideoModalOpen: false,
      sceneEl: AFRAME.scenes[0],
      visible: {
        scenegraph: true,
        attributes: true
      }
    };

    Events.on('togglesidebar', event => {
      if (event.which === 'all') {
        if (this.state.visible.scenegraph || this.state.visible.attributes) {
          this.setState({
            visible: {
              scenegraph: false,
              attributes: false
            }
          });
        } else {
          this.setState({
            visible: {
              scenegraph: true,
              attributes: true
            }
          });
        }
      } else if (event.which === 'attributes') {
        this.setState(prevState => ({
          visible: {
            attributes: !prevState.visible.attributes
          }
        }));
      } else if (event.which === 'scenegraph') {
        this.setState(prevState => ({
          visible: {
            scenegraph: !prevState.visible.scenegraph
          }
        }));
      }

      this.forceUpdate();
    });
  }

  componentDidMount () {
    Events.on(
      'opentexturesmodal',
      function (selectedTexture, textureOnClose) {
        this.setState({
          selectedTexture: selectedTexture,
          isModalTexturesOpen: true,

          textureOnClose: textureOnClose
        });

      }.bind(this)
    );
    Events.on(
      'openModelModal',
      function (selectedModel, modelOnClose) {
        this.setState({
          selectedModel: selectedModel,
          isModelModalOpen: true,
          modelOnClose: modelOnClose
        });
      }.bind(this)
    );
    Events.on(
      'openUploadImageModal',
      function (selectedModel, modelOnClose) {
        this.setState({
          selectedModel: selectedModel,
          isUploadImageModalOpen: true,
          modelOnClose: modelOnClose
        });
      }.bind(this)
    );
    Events.on(
      'openUploadVideoModal',
      function (selectedModel, modelOnClose) {
        this.setState({
          selectedModel: selectedModel,
          isUploadVideoModalOpen: true,
          modelOnClose: modelOnClose
        });
      }.bind(this)
    );
    Events.on('entityselect', entity => {
      this.setState({entity: entity});
    });

    Events.on('inspectortoggle', enabled => {
      this.setState({inspectorEnabled: enabled});
    });

    Events.on('openhelpmodal', () => {
      this.setState({isHelpOpen: true});
    });
  }

  onCloseHelpModal = value => {
    this.setState({isHelpOpen: false});
  };
  onCloseModelModal = value => {
    this.setState({isModelModalOpen: false});
  };
  onCloseUploadImageModal = value => {
    this.setState({isUploadImageModalOpen: false});
  };
  onCloseUploadVideoModal = value => {
    this.setState({isUploadVideoModalOpen: false});
  };
  onModalTextureOnClose = value => {
    this.setState({isModalTexturesOpen: false});
    if (this.state.textureOnClose) {
      this.state.textureOnClose(value);
    }
  };

  toggleEdit = () => {
    if (this.state.inspectorEnabled) {
      AFRAME.INSPECTOR.close();
    } else {
      AFRAME.INSPECTOR.open();
    }
  };

  renderComponentsToggle () {
    if (!this.state.entity || this.state.visible.attributes) {
      return null;
    }
    return (
      <div className="toggle-sidebar right">
        <a
          onClick={() => {
            this.setState({visible: {attributes: true}});
            this.forceUpdate();
          }}
          className="fa fa-plus"
          title="Show components"
        />
      </div>
    );
  }

  renderSceneGraphToggle () {
    if (this.state.visible.scenegraph) {
      return null;
    }
    return (
      <div className="toggle-sidebar left">
        <a
          onClick={() => {
            this.setState({visible: {scenegraph: true}});
            this.forceUpdate();
          }}
          className="fa fa-plus"
          title="Show scenegraph"
        />
      </div>
    );
  }

  render () {
    const scene = this.state.sceneEl;
    const toggleButtonText = this.state.inspectorEnabled
      ? 'Quay lại màn hình chính'
      : 'Chỉnh sửa';

    return (
      <div>
        <a id='backToTheSceneButtonLink' className="toggle-edit" onClick={this.toggleEdit}>
          {toggleButtonText}
        </a>

        {this.renderSceneGraphToggle()}
        {/*{this.renderComponentsToggle()}*/}

        <div
          id="inspectorContainer"
          className={this.state.inspectorEnabled ? '' : 'hidden'}
        >
          <SceneGraph
            scene={scene}
            selectedEntity={this.state.entity}
            visible={this.state.visible.scenegraph}
          />

          <div id="viewportBar">
            <CameraToolbar/>
            <ViewportHUD/>
            {/*<TransformToolbar/>*/}
          </div>
          <div id="viewportBarCenter">
            {/*<CameraToolbar/>*/}
            {/*<ViewportHUD/>*/}
            <TransformToolbarVer2/>

            {/*<Button color="primary"></Button>*/}
          </div>
          {/*{this.state.entity && <div id="rightPanel">*/}
          {/*  <ComponentsSidebar*/}
          {/*    entity={this.state.entity}*/}
          {/*    visible={this.state.visible.attributes}*/}
          {/*  />*/}
          {/*</div>}*/}
        </div>

        <ModalHelp
          isOpen={this.state.isHelpOpen}
          onClose={this.onCloseHelpModal}
        />
        <ModalTextures
          ref="modaltextures"
          isOpen={this.state.isModalTexturesOpen}
          selectedTexture={this.state.selectedTexture}
          onClose={this.onModalTextureOnClose}
        />
        <ModelModal
          // ref="modalmodels"
          isOpen={this.state.isModelModalOpen}
          selectedModel={this.state.selectedModel}
          onClose={this.onCloseModelModal}
        />
        <UploadImageModal
          // ref="modalmodels"
          isOpen={this.state.isUploadImageModalOpen}
          selectedModel={this.state.selectedModel}
          onClose={this.onCloseUploadImageModal}
        />
        <VideoUploadModal
          isOpen={this.state.isUploadVideoModalOpen}
          selectedModel={this.state.selectedModel}
          onClose={this.onCloseUploadVideoModal}
        />
      </div>
    );
  }
}
