export const DEFAULT_URL = 'http://localhost:3000';
// export const DEFAULT_URL = 'https://api-aframe.herokuapp.com';
// export const DEFAULT_URL = 'https://demo-aframe.azurewebsites.net/';

export const DEFAULT_MODEL_URL = DEFAULT_URL + '/model';
export const DEFAULT_ENTITY_URL = DEFAULT_URL + '/entity';
export const DEFAULT_AWS_URL = DEFAULT_URL + '/aws';

export const DEFAULT_IMG_URL = DEFAULT_URL + '/images';

export const removeSpecChar = (str) =>{
  return str.replace(/[^a-zA-Z]/g, "");// your code goes here
}
export const getId = (type) =>{
  console.log(type + "-" + Date.now());
  return type + "-" + Date.now();
}
