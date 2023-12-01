import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  BuyKey as BuyKeyEvent,
  ClaimReferral as ClaimReferralEvent,
  ReferralAllowance as ReferralAllowanceEvent,
  SellKey as SellKeyEvent,
  NftPatreonV1
} from "../generated/NftPatreonV1/NftPatreonV1"
import {
  Referral,
  ReferralAllowance,
  Transaction,
  User,
} from "../generated/schema"

export function handleBuyKey(event: BuyKeyEvent): void {
  const nousContract = NftPatreonV1.bind(event.address);
  const referrer = nousContract.userToReferralAddress(event.params.buy.user)

  createTransaction(
    'buy',
     event.params.buy.user,
     event.params.buy.amount,
     event.params.buy.tokenId,
     event.block.number,
     event.transaction.hash,
     referrer
  )
}

export function handleSellKey(event: SellKeyEvent): void {
  const nousContract = NftPatreonV1.bind(event.address);
  const referrer = nousContract.userToReferralAddress(event.params.sell.user)

  createTransaction(
    'sell',
     event.params.sell.user,
     event.params.sell.amount,
     event.params.sell.tokenId,
     event.block.number,
     event.transaction.hash,
     referrer
  )
}

function createTransaction(activity: string, address: Address, amount: BigInt, tokenId: BigInt, blockNumber: BigInt, txHash: Bytes, referrer: Address): void {
    let transaction = new Transaction(txHash.toHexString())

    transaction.activity = activity
    transaction.address = address.toHexString()
    transaction.amount = amount
    transaction.tokenId = tokenId
    transaction.blockNumber = blockNumber

    transaction.save()

    if (activity === 'buy') handleReferral(address, amount, referrer)

    let user = User.load(address.toHexString())
    if (!user) user = new User(address.toHexString())
    user.save()
}

function handleReferral(address: Address, amount: BigInt, referrer: Address): void {
    let selfReferral = Referral.load(address.toHexString())
    let referrerReferral = Referral.load(referrer.toHexString())

    if (!selfReferral) {
      selfReferral = new Referral(address.toHexString())
      selfReferral.count = new BigInt(0)
      selfReferral.address = address.toHexString()
      selfReferral.save()
    }

    if (!referrerReferral) {
      referrerReferral = new Referral(referrer.toHexString())
      referrerReferral.count = new BigInt(0)
      referrerReferral.address = referrer.toHexString()
    } 

    referrerReferral.count = referrerReferral.count.plus(amount)
    referrerReferral.save()
}

export function handleClaimReferral(event: ClaimReferralEvent): void {
    let referral = Referral.load(event.params.user.toHexString())
    if (!referral) referral = new Referral(event.params.user.toHexString())

    referral.count = new BigInt(0)
    referral.save()
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