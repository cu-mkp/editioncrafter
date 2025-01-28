import EditionCrafter from '../EditionCrafter'

function TagExplore(props) {
  return (
    <div className="tag-explore-grid">
      <div className="tag-explore-pane">
        <p>work in progress</p>
        <p>
          db is at
          {' '}
          {props.dbUrl}
        </p>
      </div>
      <EditionCrafter {...props} />
    </div>
  )
}

export default TagExplore
