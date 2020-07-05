import getAxios from './axiosConfig';
import {
  DEFAULT_AWS_URL,
  DEFAULT_ENTITY_URL,
  DEFAULT_MODEL_URL,
  DEFAULT_SYNC_URL,
  DEFAULT_URL,
  profileId
} from './constants';

export default {

  getUploadedModelList () {
    return getAxios().get(`${DEFAULT_MODEL_URL}/`);
  },
  uploadModel (data) {
    return getAxios().post(`${DEFAULT_MODEL_URL}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  uploadModelChunk (data, fileName, total, current) {
    return getAxios().post(`${DEFAULT_MODEL_URL}/chunk/${fileName}/${total}/${current}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  uploadModelToAws (data) {
    return getAxios().post(`${DEFAULT_AWS_URL}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  uploadImage (data) {
    return getAxios().post(`${DEFAULT_MODEL_URL}/image`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  uploadImageToAws (data) {
    return getAxios().post(`${DEFAULT_AWS_URL}/image`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  uploadAudio (data) {
    return getAxios().post(`${DEFAULT_MODEL_URL}/audio`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  uploadAudioToAws (data) {
    return getAxios().post(`${DEFAULT_AWS_URL}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  createEntity (definition) {
    return getAxios().post(`${DEFAULT_SYNC_URL}/${profileId}/create`, definition);
  },
  deleteEntity (id) {
    return getAxios().post(`${DEFAULT_SYNC_URL}/${profileId}/delete/${id}`);
  },
  reset () {
    return getAxios().post(`${DEFAULT_SYNC_URL}/${profileId}/reset`);
  }
};
