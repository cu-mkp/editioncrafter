import { HiOutlineBookOpen } from 'react-icons/hi2'
import '../styles/loading-splash.css'

function LoadingSplash(props) {
  const { label = 'Loading edition…', percent = null } = props
  const clamped = percent === null ? null : Math.max(0, Math.min(100, percent))

  return (
    <div className="loading-splash">
      <div className="loading-splash-panel">
        <HiOutlineBookOpen className="loading-splash-icon" />
        <p className="loading-splash-label">{label}</p>
        <div
          className="loading-splash-bar-track"
          role="progressbar"
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={clamped === null ? undefined : Math.round(clamped)}
        >
          <div
            className={`loading-splash-bar-fill${clamped === null ? ' indeterminate' : ''}`}
            style={clamped === null ? undefined : { width: `${clamped}%` }}
          />
        </div>
        <p className="loading-splash-percent">
          {clamped === null ? ' ' : `${Math.round(clamped)}%`}
        </p>
      </div>
    </div>
  )
}

export default LoadingSplash
