import { Typography } from '@material-ui/core'
import Left from '../../TagExplore/assets/Left'
import Right from '../../TagExplore/assets/Right'

function EmptyPaneView(props) {
  return (
    <div style={{ backgroundColor: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center' }}>
        { props.side === 'left' ? <Left /> : <Right /> }
        <Typography>
          Select
          {' '}
          {props.side}
          {' '}
          page
        </Typography>
      </div>
    </div>
  )
}

export default EmptyPaneView
