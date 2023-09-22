import React, { useEffect, useState, useRef } from 'react';

const JumpToFolio = (props) => {
  const [textInput, setTextInput] = useState('');

  const handleSubmit = (event) => {
    // Consume the event
    event.preventDefault();

    // Parse out the target
    const data = new FormData(event.target);
    const folioID = data.get('folioID');

    // Submit the request
    props.submitHandler(folioID, props.side);

    // Hide and clear
    props.blurHandler();
    setTextInput('');
  };

  const handleChange = (event) => {
    setTextInput(event.target.value);
  };

  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef, props.isVisible]);

  const divStyle = {
    position: 'fixed',
    zIndex: 1,
    top: props.positionY,
    left: props.positionX,
    display: props.isVisible ? 'inline' : 'none',
  };

  const id = `${props.side}_jumpInput`;

  return (
    <div className="jumpToFolio_component" style={divStyle}>
      <form onSubmit={handleSubmit}>
        <input
          id={id}
          name="folioID"
          onBlur={props.blurHandler}
          onChange={handleChange}
          placeholder="Page Name (e.g. '3r')"
          ref={inputRef}
          type="text"
          value={textInput}
        />
      </form>
    </div>
  );
};

export default JumpToFolio;
