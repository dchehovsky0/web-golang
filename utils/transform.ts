import { TokenData } from "@/types/token"
import dayjs from 'dayjs'

export function mapEventToTokenData(ev: any): TokenData {
  const types: TokenData["type"] = []
  if (ev.isMigrated) types.push("Dev Migrations")
  if (ev.average_mcap > 0) types.push("Average Mcap")
  if (ev.isCommunity) types.push("Community")

  const relatedTokens = (ev.migratedlist ?? []).map((item: any) => ({
    ticker: `$${item.tokenSymbol}`,
    name: item.tokenName,
    timeAgo: "N/A",
    value: `${ev.solAmountFloat.toFixed(1)}k`,
    migrated: true,
  }))

  return {
    address: ev.mint,
    symbol: ev.symbol,
    name: ev.name,
    migrationPercent: ev.migrationPerc,
    migrationColor:
      ev.migrationPerc >= 70
        ? 'bg-green-500'
        : ev.migrationPerc >= 30
        ? 'bg-orange-500'
        : 'bg-red-500',
    type: types.length ? types : ["Dev Migrations"],
    relatedTokens: relatedTokens.length ? relatedTokens : undefined,
    communityAverageMcap: ev.average_mcap?.toLocaleString() ?? undefined,
    communityLastMcap: undefined,
    communityTotal: undefined,
    communityTweetScoutValue: undefined,
    communityAlphaGateValue: undefined,
    communityLink: ev.twitter?.includes("/i/communities/") ? "Community" : undefined,
    twitterHandle: ev.twitter?.startsWith("http") ? undefined : ev.twitter,
  }
}
