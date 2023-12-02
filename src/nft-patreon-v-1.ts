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

  if (activity === 'buy') handleReferral(address, amount, referrer, txHash, activity)

  let user = User.load(address.toHexString())
  if (!user) user = new User(address.toHexString())
  user.save()
}

function handleReferral(address: Address, amount: BigInt, referralAddress: Address, txHash: Bytes, activity:string): void {
  let referral = new Referral(txHash.toHexString())

  referral.address = address.toHexString()
  referral.referral = referralAddress.toHexString()
  referral.count = amount
  referral.activity = activity
  referral.save()
}

export function handleClaimReferral(event: ClaimReferralEvent): void {
  handleReferral(event.params.user, new BigInt(0), event.params.user, event.transaction.hash, 'claim')
}

export function handleReferralAllowance(event: ReferralAllowanceEvent): void {
  handleReferral(event.params.user, new BigInt(0), event.params.referralAddress, event.transaction.hash, 'allowance')
}