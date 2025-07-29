export interface TokenEvent {
  source: string
  mint: string
  name: string
  symbol: string
  twitter: string
  creator: string
  uri: string
  ath?: { mint: string; price: number; timestamp: number }[]
  migratedlist?: { mint: string; tokenName: string; tokenSymbol: string }[]
  time: string       // RFC-3339
  solAmountFloat: number
  migrationPerc: number
  average_mcap: number
  isMigrated: boolean
  isAth: boolean
  isCommunity: boolean
}

export type TokenType = 'Dev Migrations' | 'Average Mcap' | 'Community'

export interface RelatedToken {
  ticker: string
  name: string
  timeAgo: string
  value: string
  migrated?: boolean
}

export interface TokenData {
  address: string
  symbol: string
  name: string
  migrationPercent: number
  migrationColor: string
  type: TokenType[]
  relatedTokens?: RelatedToken[]
  communityAverageMcap?: string
  communityLastMcap?: string
  communityTotal?: number
  communityTweetScoutValue?: number
  communityAlphaGateValue?: number
  communityLink?: string
  twitterHandle?: string
}
