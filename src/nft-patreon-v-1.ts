import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  BuyKey as BuyKeyEvent,
  ClaimReferral as ClaimReferralEvent,
  ReferralAllowance as ReferralAllowanceEvent,
  SellKey as SellKeyEvent
} from "../generated/NftPatreonV1/NftPatreonV1"
import {
  ClaimReferral,
  ReferralAllowance,
  Transaction,
  User,
} from "../generated/schema"

export function handleBuyKey(event: BuyKeyEvent): void {
  createTransaction(
    'buy',
     event.params.buy.user,
     event.params.buy.tokenId,
     event.params.buy.amount,
     event.block.number,
     event.transaction.hash
  )
}

export function handleSellKey(event: SellKeyEvent): void {
  createTransaction(
    'sell',
     event.params.sell.user,
     event.params.sell.tokenId,
     event.params.sell.amount,
     event.block.number,
     event.transaction.hash
  )
}

function createTransaction(activity: string, address: Address, amount: BigInt, tokenId: BigInt, blockNumber: BigInt, txHash: Bytes): void {
    let transaction = new Transaction(txHash.toHexString())

    transaction.activity = activity
    transaction.address = address.toHexString()
    transaction.amount = amount
    transaction.tokenId = tokenId
    transaction.blockNumber = blockNumber

    transaction.save()

    let user = User.load(address.toHexString())
    if (!user) user = new User(address.toHexString())
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