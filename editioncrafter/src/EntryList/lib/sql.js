export function getObjs(statement) {
  const records = []

  while (statement.step()) {
    records.push(statement.getAsObject())
  }

  return records
}
