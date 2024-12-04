function Entry(props) {
  return (
    <div className="entry-box">
      <p>
        <a href="#todo">
          {props.elementTag.element_name}
          {' '}
          -
          {props.elementTag.surface_name}
        </a>
      </p>
      <p>category pills go here</p>
      <div className="tag-list">
        <p>tag pills go here</p>
      </div>
    </div>
  )
}

export default Entry
