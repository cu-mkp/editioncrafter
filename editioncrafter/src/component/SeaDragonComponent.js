import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { BigRingSpinner } from './RingSpinner'

function SeaDragonComponent(props) {
  const { side, initViewer, tileSource } = props
  const [loading, setLoading] = useState(true)
  const viewerRef = useRef(null)

  useEffect(() => {
    const loader = async () => {
      if (viewerRef.current) {
        await initViewer(viewerRef.current, tileSource).then(() => setLoading(false))
      }
    }

    loader()
  }, [])

  const viewer = useMemo(() => (
    <div id={`image-view-seadragon-${side}`} ref={viewerRef}>
      { loading && <BigRingSpinner color="light" delay={1000} />}
    </div>
  ), [loading])

  return viewer
}

export default SeaDragonComponent
