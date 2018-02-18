# DecentPost
DecentPost is a protocol for decentralized postal services and apps, with Proof of Delivery, bonded shipping, and bounty slashing.

DecentPost is designed to incentivize Senders, Couriers, and Receivers to transact in trustless shipping arrangements by structuring economic incentives on chain.

Concretely, our contract implements the ERC721 interface (with help from OpenZeppelin) to allow a Sender to mint a non-fungible Package. Metadata regarding the Package is stored on IPFS. And we implement a psuedo-State Channel to allow for an expedient delivery experience + flexibility in choosing when to commit a transaction.

Packages available for pickup are discoverable just by listening to the event logs we emit, and are tradable via the ERC721 interface.

# Parties

* Sender - creates Packages, which constitute an Offer for Shipment
* Courier - agrees to Offers, transmits Packages, and collects Proofs of Delivery
* Receiver - can dispute receipt of package

# Incentives

A Shipper can specify a Bond, which a Courier must place in escrow to accept the Offer for Shipment.

They are incentivized by a Bounty, which the Shipper places in escrow on Package creation.

The Shipper also specifies a Deliver-by date, after which the Bounty will be slashed every second.

Finally, the Shipper specifies a public key address of the intended Recipient.

# Proof of Delivery
The experience of receiving a package under ideal conditions from a modern centralized courier is excellent: typically you sign a digital handheld device or show ID, and the transaction is over quickly.

Couriers and Recipients are busy, and neither party wants to wait, but it can sometimes take some time to have a transaction mined in a new block, or fees may be temporarily high.

To facilitate transactions, we have developed a concept we call Proof of Delivery, where the Recipient must prove to the Courier they are the intended Recipient.

When the package arrives, the Recipient must sign a transaction with their private key, proving they control the address the Shipper addressed the Package to.

This Proof of Delivery is saved, and can later be added to the blockchain at the discretion of the Courier. When a Proof of Delivery is mined, the Courier's is paid out their Bond + Bounty.

Should the Recipient dispute receipt of the package, the Courier can prove otherwise.

# Adversarial Conditions
If the timestamp in a Proof of Delivery is after the Deliver-By date, the Bounty is slashed.
When the Drop-Dead time arrives, the Sender is paid out the Bounty + Bond.
If a package is undeliverable, a Courier can ReturnToSender.

# Business Cases and Opportunities
multi-party carriers, i.e. international shipping + last-leg

yield management for long haul trucking and other container services

bike couriers for legal letters

local marketplaces for neighbourhood deliveries

Couriers can pay for duties and require payment during the generation of Proof of Delivery
