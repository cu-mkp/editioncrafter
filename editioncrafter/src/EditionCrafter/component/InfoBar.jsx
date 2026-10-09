import { BsX } from 'react-icons/bs'
import { HiInformationCircle } from 'react-icons/hi'

function InfoBar(props) {
  return (
    <div className="tag-bar">
      <div className="tag-list">
        <span className="tag-label">
          <HiInformationCircle />
          <div className="info-bar-text">
            { props.data && Object.keys(props.data)?.map(key => (
              <div key={key}>
                { `${key}: ${props.data[key]}` }
              </div>
            ))}
          </div>
        </span>
      </div>
      <button
        className="tag-bar-close"
        onClick={props.toggleMetadata}
        type="button"
      >
        <BsX />
      </button>
    </div>
  )
}

export default InfoBar
