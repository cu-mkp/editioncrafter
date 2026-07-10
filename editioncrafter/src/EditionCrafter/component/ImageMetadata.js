export default function ImageMetadata(props) {
  const { data } = props

  return (
    <div className="image-metadata">
      { Object.keys(data)?.map(key => (
        <div key={key}>
          { `${key}: ${data[key]}` }
        </div>
      ))}
    </div>
  )
}
