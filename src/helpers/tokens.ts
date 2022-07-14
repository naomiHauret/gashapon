import { chain } from '@wagmi/core'

export const tokens = {
  logos: {
    USDC: '/usdc.webp',
    wETH: '/weth.webp',
    wMATIC: '/matic.webp',
    DAI: '/dai.webp',
  },
  native: {
    [chain.polygon.id]: 'MATIC',
    [chain.polygonMumbai.id]: 'MATIC',
  },
  [chain.polygon.id]: {
    USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    wMATIC: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    wETH: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    DAI: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
  },
  [chain.polygonMumbai.id]: {
    USDC: '0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e',
    wETH: '0x3C68CE8504087f89c640D02d133646d98e64ddd9',
    wMATIC: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
    DAI: '0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F',
  },
}

export const whitelist = {
  [chain.polygon.id]: {
    USDC: tokens[chain.polygon.id].USDC,
    wETH: tokens[chain.polygon.id].wETH,
    wMATIC: tokens[chain.polygon.id].wMATIC,
    DAI: tokens[chain.polygon.id].DAI,
  },
  [chain.polygonMumbai.id]: {
    USDC: tokens[chain.polygonMumbai.id].USDC,
    wETH: tokens[chain.polygonMumbai.id].wETH,
    wMATIC: tokens[chain.polygonMumbai.id].wMATIC,
    DAI: tokens[chain.polygonMumbai.id].DAI,
  },
}

export function getTokenData(addr: string) {
  if ([tokens[chain.polygon.id].USDC, tokens[chain.polygonMumbai.id].USDC].includes(addr))
    return {
      symbol: 'USDC',
      logo: tokens.logos.USDC,
    }
  if ([tokens[chain.polygon.id].wETH, tokens[chain.polygonMumbai.id].wETH].includes(addr))
    return {
      symbol: 'wETH',
      logo: tokens.logos.wETH,
    }
  if ([tokens[chain.polygon.id].wMATIC, tokens[chain.polygonMumbai.id].wMATIC].includes(addr))
    return {
      symbol: 'wMATIC',
      logo: tokens.logos.wMATIC,
    }
  if ([tokens[chain.polygon.id].DAI, tokens[chain.polygonMumbai.id].DAI].includes(addr))
    return {
      symbol: 'DAI',
      logo: tokens.logos.DAI,
    }
  return {
    symbol: 'Unknown token',
    logo: '/unknown.webp',
  }
}
