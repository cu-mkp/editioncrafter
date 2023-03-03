import React from 'react';

class JumpToFolio extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = { textInput: '' };
  }

  handleSubmit(event) {
    // Consume the event
    event.preventDefault();

    // Parse out the target
    const data = new FormData(event.target);
    const folioID = data.get('folioID');

    // Submit the request
    this.props.submitHandler(folioID, this.props.side);

    // Hide and clear
    this.props.blurHandler();
    this.setState({ textInput: '' });
  }

  componentWillReceiveProps(nextProps) {
    // FIXME: this is an over-clever hack, but how else do you force focus?
    if (nextProps.isVisible) {
      const script = document.createElement('script');
      const id = `${this.props.side}_jumpInput`;
      script.innerHTML = `setTimeout(function() { document.getElementById('${id}').focus(); }, 250);`;
      document.body.appendChild(script);
    }
  }

  // Onchange field
  handleChange(event) {
    this.setState({ textInput: event.target.value });
  }

  render() {
    const divStyle = {
	  		position: 'fixed',
      zIndex: 1,
      top: this.props.positionY,
      left: this.props.positionX,
      display: this.props.isVisible ? 'inline' : 'none',
    };
    const id = `${this.props.side}_jumpInput`;
    return (
      <div className="jumpToFolio_component" style={divStyle}>
        <form onSubmit={this.handleSubmit}>
          <input placeholder="Folio Name (e.g. '3r')" value={this.state.textInput} id={id} name="folioID" type="text" onChange={this.handleChange.bind(this)} onBlur={this.props.blurHandler} />
        </form>
      </div>
    );
  }
}

export default (JumpToFolio);
