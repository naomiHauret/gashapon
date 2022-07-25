import { client } from '@config/urql'
import { sleep } from '@helpers/sleep'

const HAS_TX_BEEN_INDEXED = `
  query($request: HasTxHashBeenIndexedRequest!) {
    hasTxHashBeenIndexed(request: $request) { 
	    ... on TransactionIndexedResult {
            indexed
            txReceipt {
                to
                from
                contractAddress
                transactionIndex
                root
                gasUsed
                logsBloom
                blockHash
                transactionHash
                blockNumber
                confirmations
                cumulativeGasUsed
                effectiveGasPrice
                byzantium
                type
                status
                logs {
                    blockNumber
                    blockHash
                    transactionIndex
                    removed
                    address
                    data
                    topics
                    transactionHash
                    logIndex
                }
            }
            metadataStatus {
              status
              reason
            }
        }
        ... on TransactionError {
            reason
            txReceipt {
                to
                from
                contractAddress
                transactionIndex
                root
                gasUsed
                logsBloom
                blockHash
                transactionHash
                blockNumber
                confirmations
                cumulativeGasUsed
                effectiveGasPrice
                byzantium
                type
                status
                logs {
                    blockNumber
                    blockHash
                    transactionIndex
                    removed
                    address
                    data
                    topics
                    transactionHash
                    logIndex
             }
            }
        },
        __typename
    }
  }
`

async function hasTxBeenIndexed(txHash: string) {
  const isIndexed = await client
    .query(HAS_TX_BEEN_INDEXED, {
      request: {
        txHash,
      },
      fetchPolicy: 'network-only',
    })
    .toPromise()
  return isIndexed
}

export async function pollUntilIndexed(txHash: string) {
  while (true) {
    const result = await hasTxBeenIndexed(txHash)

    const response = result.data.hasTxHashBeenIndexed
    console.log(response, response.__typename)
    if (response.__typename === 'TransactionIndexedResult') {
      if (response.metadataStatus) {
        if (response.metadataStatus.status === 'SUCCESS') {
          return response
        }

        if (response.metadataStatus.status === 'METADATA_VALIDATION_FAILED') {
          throw new Error(response.metadataStatus.reason)
        }
      } else {
        if (response.indexed) {
          return response
        }
      }

      // sleep for a 1.5 sec before trying again
      await sleep(1500)
    } else {
      // it got reverted and failed!
      throw new Error(response.reason)
    }
  }
}
