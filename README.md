# DecentPost
Protocol for decentralized postal services, with Proof of Delivery, bonded shipping, and bounty slashing

DecentPost implements the OpenZeppelin ERC721 contract to allow a Shipper to generate non-fungible Packages intended for a Recipient.

A Package is a contract with incentives and penalties designed to facilitate global participation in the New Economy. 

# Proof of Delivery
Under adversarial conditions, a recipient can prove they are the intended recipient, and a courier can prove they have successfully delivered a package.

# Bonded shipping
A sender can specify a Bond value be put up by a courier as a condition of accepting a delivery contract. This bond is held in escrow until the courier has Proof of Delivery.

# Bounty Slashing
Our protocol provides for variable rate incentives - if the carrier delivers the package faster, they get paid a higher bounty

Parties
* Sender
* Receiver
* Carrier

Our non-fungible "package" tokens have the following properties
```
solidity code?
```
* sender (address)
* bounty (uint)
* deliverBy (uint)
* insurance (uint)
* receiver (address)
* state (enum)
* metadata (string)


# Business Cases
multi-party carriers, i.e. international shipping vs. last-leg
long haul trucking
bike couriers
local marketplaces for delivery


h@cker0!


// TODO
decide what should happen on _deliver if the DEADLINE has been reached
