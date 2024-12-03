import { useEffect, useState } from 'react'
import initSqlJs from 'sql.js'
import EntryListView from './component/EntryListView'
import Sidebar from './component/Sidebar'
import './styles/base.css'

async function initDb(url) {
  const file = await fetch(url)

  if (!file.ok) {
    throw new Error('Failed fetching SQLite file.')
  }

  const buf = await file.arrayBuffer()
  const arr = new Uint8Array(buf)

  const SQL = await initSqlJs({
    locateFile: file => `https://sql.js.org/dist/${file}`,
  })

  const db = new SQL.Database(arr)

  return db
}

function EntryList(props) {
  const [db, setDb] = useState(null)

  useEffect(() => {
    const loadDb = async () => {
      const db = await initDb(props.dbPath)
      setDb(db)
    }

    if (!db) {
      loadDb()
    }

    return () => {
      if (db) {
        db.close()
      }
    }
  }, [props.dbPath, db])

  if (!db) {
    // todo: some sort of loading indicator
    return <p>loading</p>
  }

  return (
    <div className="editioncrafter-entry-list">
      <Sidebar db={db} />
      <EntryListView db={db} />
    </div>
  )
}

export default EntryList
