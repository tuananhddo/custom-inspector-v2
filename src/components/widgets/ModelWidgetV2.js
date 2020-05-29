import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import ModelAPI from '../../API/ModelAPI';

export default function ModelWidgetV2 (props) {
  var Events = require('../../lib/Events.js');
  useEffect(() => {
    Events.on('updateModelUploadedList', data => {
      ModelAPI.getUploadedModelList().then(r => console.log(r));
    });
    ModelAPI.getUploadedModelList().then(r => console.log(r));

  }, []);

  const testVal = 'http://localhost:3000/models/wall.glb';
  const initValue = props.value || '';
  const [chosenValue, setChosenValue] = useState({label: 1, value: initValue});
  const options = [1, 2, 3, initValue, testVal].map(i => {
    return {label: i, value: i};
  });
//   const hint = 'ADD';
//   useEffect(() => {
//     var canvas = document.getElementById('modelCanvas');
//     var context = canvas.getContext('2d');
//     var grd = context.createLinearGradient(0, 0, 200, 0);
//     grd.addColorStop(0, 'red');
//     grd.addColorStop(1, 'white');
//
// // Fill with gradient
//     context.fillStyle = grd;
//     context.fillRect(0, 0, 150, 80);
//
//   }, []);
  const onChange = value => {
    setChosenValue(value);
    if (props.onChange) {
      props.onChange(props.name, value.value);
    }
  };
  const openDialog = () => {
    Events.emit('openModelModal', chosenValue.value, item => {
    });
  };
  return (
    <div>
      <Select
        className="select-widget"
        classNamePrefix="select"
        options={options}
        simpleValue
        clearable={true}
        placeholder=""
        value={chosenValue}
        noResultsText="No value found"
        onChange={onChange}
        searchable={true}
      />
      {/*< canvas*/}
      {/*  id={'modelCanvas'}*/}
      {/*  // ref='canvas'*/}
      {/*  width='32'*/}
      {/*  height='16'*/}
      {/*  title={hint}*/}
      {/*  onClick={openDialog}*/}
      {/*/>*/}
      <button onClick={openDialog}>Add</button>
    </div>
  );
}

ModelWidgetV2.propTypes = {
  componentname: PropTypes.string.isRequired,
  entity: PropTypes.object,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.string
};
