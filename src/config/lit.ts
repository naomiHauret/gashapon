import LitJsSdk from 'lit-js-sdk'
const client = new LitJsSdk.LitNodeClient()
const chain = 'ethereum'
const standardContractType = 'ERC721'

class Lit {
  private litNodeClient

  async connect() {
    await client.connect()
    this.litNodeClient = client
  }
}

export default new Lit()
