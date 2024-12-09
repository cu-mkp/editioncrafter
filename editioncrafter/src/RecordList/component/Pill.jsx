import { IoCheckmarkSharp } from 'react-icons/io5'

function Pill(props) {
  return (
    <button className={props.isActive ? 'active pill' : 'pill'} onClick={props.onClick} type="button">
      {props.isActive ? <IoCheckmarkSharp /> : null}
      {props.label}
    </button>
  )
}

export default Pill
