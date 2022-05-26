import { NextApiRequest, NextApiResponse } from 'next'

export default (request: NextApiRequest, response: NextApiResponse) => {
  const users = [
    { id: 1, name: 'Jonathas 1' },
    { id: 2, name: 'Jonathas 2' },
    { id: 3, name: 'Jonathas 3' },
  ]

  return response.json(users);
}