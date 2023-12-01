import {
  BuyKey as BuyKeyEvent,
  ClaimReferral as ClaimReferralEvent,
  ReferralAllowance as ReferralAllowanceEvent,
  SellKey as SellKeyEvent
} from "../generated/NftPatreonV1/NftPatreonV1"
import {
  BuyKey,
  ClaimReferral,
  ReferralAllowance,
  SellKey,
} from "../generated/schema"

export function handleBuyKey(event: BuyKeyEvent): void {
 let entity = new BuyKey(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )

  entity.buy_user = event.params.buy.user
  entity.buy_tokenId = event.params.buy.tokenId
  entity.buy_amount = event.params.buy.amount
  entity.buy_price = event.params.buy.price
  entity.buy_protocolFee = event.params.buy.protocolFee
  entity.buy_nftFee = event.params.buy.nftFee
  entity.buy_referralFee = event.params.buy.referralFee
  entity.buy_totalSupply = event.params.buy.totalSupply
  entity.buy_supplyPerUser = event.params.buy.supplyPerUser

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save() 
}

export function handleClaimReferral(event: ClaimReferralEvent): void {
  let entity = new ClaimReferral(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.userCommission = event.params.userCommission
  entity.userReferralCount = event.params.userReferralCount
  entity.referralFeePool = event.params.referralFeePool
  entity.referralCount = event.params.referralCount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleReferralAllowance(event: ReferralAllowanceEvent): void {
  let entity = new ReferralAllowance(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.referralCode = event.params.referralCode
  entity.referralAddress = event.params.referralAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSellKey(event: SellKeyEvent): void {
  let entity = new SellKey(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.sell_user = event.params.sell.user
  entity.sell_tokenId = event.params.sell.tokenId
  entity.sell_amount = event.params.sell.amount
  entity.sell_price = event.params.sell.price
  entity.sell_protocolFee = event.params.sell.protocolFee
  entity.sell_nftFee = event.params.sell.nftFee
  entity.sell_totalSupply = event.params.sell.totalSupply
  entity.sell_supplyPerUser = event.params.sell.supplyPerUser

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
