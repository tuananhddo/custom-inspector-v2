// import React, {useState, useEffect} from 'react';
// import PropTypes from 'prop-types';
// import Modal from './Modal';
//
// export default function ModelModalOrigin (props) {
//   var Events = require('../../lib/Events.js');
//
//   const isOpen = props.isOpen;
//   const [assetsModel, setAssetModel] = useState([]);
//
//   useEffect(() => {
//     generateFromAssets();
//   }, [isOpen]);
//   const generateFromAssets = () => {
//     setAssetModel([]);
//     var images = Array.prototype
//       .slice.call(document.querySelectorAll('a-assets a-asset-item[src][flag=model]'));
//     // console.log(images[0].getAttribute('src'))
//     setAssetModel(images);
//     console.log(images);
//   };
//   const demoItem = 0;
//   const modelClick = ()=>{
//     Events.emit('updateModelUploadedList', demoItem);
//   };
//   return (
//     <Modal
//       id="textureModal"
//       title="Models"
//       isOpen={props.isOpen}
//       onClose={props.onClose}
//       closeOnClickOutside={false}
//     >
//       <div>
//         <ul className="gallery">
//           {assetsModel
//             .sort(function (a, b) {
//               return a.id > b.id;
//             })
//             .map(
//               function (model) {
//                 return (
//                   <li
//                     key={model.id}
//                     onClick={modelClick}
//                     // className={selectedClass}
//                   >
//                     <div className="detail">
//                       <img width="155px" height="155px" src={'https://i.ytimg.com/vi/ZHFFhLur3FU/maxresdefault.jpg'} />
//                       <span className="title">{model.getAttribute('id')}</span>
//                       {/*<span>{getFilename(model.src)}</span>*/}
//                       {/*<span>*/}
//                       {/*    {model.width} x {model.height}*/}
//                       {/*  </span>*/}
//                     </div>
//                   </li>
//                 )
//               }
//             )}
//         </ul>
//       </div>
//     </Modal>
//   );
// }
//
// ModelModalOrigin.propTypes = {
//   isOpen: PropTypes.bool,
//   onClose: PropTypes.func,
//   selectedModel: PropTypes.string
// };
