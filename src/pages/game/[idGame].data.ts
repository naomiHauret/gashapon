import { createResource } from 'solid-js'
import { getPublication } from '@graphql/publications/get-publication'

async function fetchGameData(publicationId) {
  const game = await getPublication(`${publicationId}`)
  return game
}

export function GameData({ params }) {
  const [game] = createResource(() => params.idGame, fetchGameData)
  return game
}

export default GameData
