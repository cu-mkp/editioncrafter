import './Pill.style.css'

function Pill(props) {
  return (
    <button className={props.isActive ? 'active pill' : 'pill'} onClick={props.onClick} type="button">
      {props.children}
      {props.label}
    </button>
  )
}

export default Pill
