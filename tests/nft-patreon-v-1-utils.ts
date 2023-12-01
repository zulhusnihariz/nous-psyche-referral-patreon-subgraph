import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  BuyKey,
  ClaimReferral,
  ReferralAllowance,
  SellKey
} from "../generated/NftPatreonV1/NftPatreonV1"

export function createBuyKeyEvent(buy: ethereum.Tuple): BuyKey {
  let buyKeyEvent = changetype<BuyKey>(newMockEvent())

  buyKeyEvent.parameters = new Array()

  buyKeyEvent.parameters.push(
    new ethereum.EventParam("buy", ethereum.Value.fromTuple(buy))
  )

  return buyKeyEvent
}

export function createClaimReferralEvent(
  user: Address,
  userCommission: BigInt,
  userReferralCount: BigInt,
  referralFeePool: BigInt,
  referralCount: BigInt
): ClaimReferral {
  let claimReferralEvent = changetype<ClaimReferral>(newMockEvent())

  claimReferralEvent.parameters = new Array()

  claimReferralEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  claimReferralEvent.parameters.push(
    new ethereum.EventParam(
      "userCommission",
      ethereum.Value.fromUnsignedBigInt(userCommission)
    )
  )
  claimReferralEvent.parameters.push(
    new ethereum.EventParam(
      "userReferralCount",
      ethereum.Value.fromUnsignedBigInt(userReferralCount)
    )
  )
  claimReferralEvent.parameters.push(
    new ethereum.EventParam(
      "referralFeePool",
      ethereum.Value.fromUnsignedBigInt(referralFeePool)
    )
  )
  claimReferralEvent.parameters.push(
    new ethereum.EventParam(
      "referralCount",
      ethereum.Value.fromUnsignedBigInt(referralCount)
    )
  )

  return claimReferralEvent
}

export function createReferralAllowanceEvent(
  user: Address,
  referralCode: Bytes,
  referralAddress: Address
): ReferralAllowance {
  let referralAllowanceEvent = changetype<ReferralAllowance>(newMockEvent())

  referralAllowanceEvent.parameters = new Array()

  referralAllowanceEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  referralAllowanceEvent.parameters.push(
    new ethereum.EventParam(
      "referralCode",
      ethereum.Value.fromBytes(referralCode)
    )
  )
  referralAllowanceEvent.parameters.push(
    new ethereum.EventParam(
      "referralAddress",
      ethereum.Value.fromAddress(referralAddress)
    )
  )

  return referralAllowanceEvent
}

export function createSellKeyEvent(sell: ethereum.Tuple): SellKey {
  let sellKeyEvent = changetype<SellKey>(newMockEvent())

  sellKeyEvent.parameters = new Array()

  sellKeyEvent.parameters.push(
    new ethereum.EventParam("sell", ethereum.Value.fromTuple(sell))
  )

  return sellKeyEvent
}
