function Entry(props) {
  return (
    <div>
      {props.elementTag.element_name}
      {' '}
      -
      {props.elementTag.surface_name}
    </div>
  )
}

export default Entry
