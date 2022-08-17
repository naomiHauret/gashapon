import LitJsSdk from 'lit-js-sdk'
const client = new LitJsSdk.LitNodeClient({ litNetwork: 'serrano' })
export const chain = 'ethereum'
export const standardContractType = 'ERC721'

class Lit {
  private litNodeClient

  async connect() {
    await client.connect()
    this.litNodeClient = client
  }
}

export default new Lit()
