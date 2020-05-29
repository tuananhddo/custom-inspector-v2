import getAxios from './axiosConfig';
import {DEFAULT_ENTITY_URL, DEFAULT_MODEL_URL, DEFAULT_URL} from './constants';

export default {

  getUploadedModelList () {
    return getAxios().get(`${DEFAULT_MODEL_URL}`);
  },
  uploadModel (data) {
    return getAxios().post(`${DEFAULT_MODEL_URL}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  createEntity (definition) {
    return getAxios().post(`${DEFAULT_URL}/sync/create`, definition);
  }
};
