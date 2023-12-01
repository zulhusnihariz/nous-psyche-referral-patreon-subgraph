import {
  BuyKey as BuyKeyEvent,
  ClaimReferral as ClaimReferralEvent,
  ReferralAllowance as ReferralAllowanceEvent,
  SellKey as SellKeyEvent
} from "../generated/NftPatreonV1/NftPatreonV1"
import {
  ClaimReferral,
  ReferralAllowance,
  SubscribeToken,
  User
} from "../generated/schema"

export function handleBuyKey(event: BuyKeyEvent): void {
  const tokenId = event.params.buy.tokenId.toString()
  const address = event.params.buy.user.toHexString()

  let subscribeToken = SubscribeToken.load(`${tokenId}-${address}`) 

  if (!subscribeToken){
    let subscribeToken = new SubscribeToken(`${tokenId}-${address}`)

    subscribeToken.amount = event.params.buy.amount
    subscribeToken.tokenId = event.params.buy.tokenId
    subscribeToken.user = address

    subscribeToken.save()
  } else {
    subscribeToken.amount = subscribeToken.amount.plus(event.params.buy.amount)
    subscribeToken.save()
  }


  let user = User.load(address)
  if (!user) user = new User(address)

  user.save()
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
  const tokenId = event.params.sell.tokenId.toString()
  const address = event.params.sell.user.toHexString()

  let subscribeToken = SubscribeToken.load(`${tokenId}-${address}`) 

  if (subscribeToken) {
    subscribeToken.amount = subscribeToken.amount.minus(event.params.sell.amount)
    subscribeToken.save()
  }
}
