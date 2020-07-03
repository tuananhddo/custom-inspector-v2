import React, {useEffect, useState} from 'react';

export default function InputId (props) {
  const {value} = props;
  return (
    <input
      type="text"
      className="string"
      value={value}
      disabled={true}
    />
  );
}
