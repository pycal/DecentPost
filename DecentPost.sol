pragma solidity ^0.4.18;

import "./ERC721/ERC721Token.sol";

contract DecentPost is ERC721Token {
    string constant public NAME = "DecentPost";
    string constant public SYMBOL = "DPACK";
    uint256 constant public DEADLINE = 604800; // 7 days

    event NewPackage(uint256 indexed _packageId);

    enum State {
        Open,
        InTransit,
        Lost,
        ReturnedToSender,
        Delivered
    }

    struct Package {
        uint256 bounty;
        uint256 deliverBy;
        State state;
        address sender;
        uint256 insurance;
        address receiver;
        string metadata;
    }

    mapping(uint256 => Package) packageIdToPackage;

    // MUST be sent an ether amount >= the _bounty sent - this is held in escrow by the contract
    // 2000, 1519711436, 10000, "0x14723a09acff6d2a60dcdf7aa4aff308fddc160c", "abc"
    // 1000000000000000000, 1519711436, 10000000000000000000, "0x14723a09acff6d2a60dcdf7aa4aff308fddc160c", "abc"
    // "1000000000000000000", 100, "10000000000000000000", "0x14723a09acff6d2a60dcdf7aa4aff308fddc160c", "abc"
    function createPackage(uint256 _bounty,  uint256 _deliverBy, uint256 _insurance, address _receiver, string _metadata) public payable {
        require(msg.value == _bounty);
        uint256 newId = totalSupply().add(1); // just always increment by 1
        super._mint(msg.sender, newId);
        packageIdToPackage[newId].bounty = _bounty;
        packageIdToPackage[newId].deliverBy = _deliverBy;
        packageIdToPackage[newId].insurance = _insurance;
        packageIdToPackage[newId].receiver = _receiver;
        packageIdToPackage[newId].metadata = _metadata;
        packageIdToPackage[newId].state = State.Open;
        packageIdToPackage[newId].sender = msg.sender;
        NewPackage(newId);
    }

    function getPackageBounty(uint256 _packageId) public view returns (uint256) {
        return packageIdToPackage[_packageId].bounty;
    }

    // state must be open in order to accept
    // receipient should never be able to be owner, should not be able to accept
    // caller must send >= insurance as a bond
    // changes state to inTransit
    // changes ownership to caller
    function pickUp(uint256 _package) public payable {
        require(packageIdToPackage[_package].state == State.Open);
        require(msg.value == packageIdToPackage[_package].insurance);

        // set new state
        packageIdToPackage[_package].state = State.InTransit;
        // transfer the token from the sender to the msg.sender (delivery agent)
        address sender = super.ownerOf(_package);
        clearApprovalAndTransfer(sender, msg.sender, _package);
    }

    // state must be InTransit to lose
    // should not be callable by recipient
    // should be callable by "carrier" at any time if InTransit
    // should be callable by sender if lossTimeout has expired and if InTransit
    // should transfer sender's original bounty BACK to them
    // AND they get the insurance
    function lose(uint256 _package) public {
      require(packageIdToPackage[_package].state == State.InTransit);
      require(msg.sender != packageIdToPackage[_package].receiver);
      if (msg.sender == packageIdToPackage[_package].sender) {
        require(block.timestamp.add(DEADLINE) >= packageIdToPackage[_package].deliverBy);
      }

      packageIdToPackage[_package].state = State.Lost;
      // returns the original bounty to the sender
      uint256 balanceToTransfer = packageIdToPackage[_package].bounty.add(packageIdToPackage[_package].insurance);
      packageIdToPackage[_package].sender.transfer(balanceToTransfer);
    }

    function returnToSender(uint256 _package) public {
      require(packageIdToPackage[_package].state == State.InTransit);
      require(packageIdToPackage[_package].sender == msg.sender);
      require(block.timestamp.add(DEADLINE) <= packageIdToPackage[_package].deliverBy);

      packageIdToPackage[_package].state = State.ReturnedToSender;

      packageIdToPackage[_package].sender.transfer(packageIdToPackage[_package].bounty);
      super.ownerOf(_package).transfer(packageIdToPackage[_package].insurance);
    }

    function _deliver(uint256 _package) internal {
      require(block.timestamp.add(DEADLINE) <= packageIdToPackage[_package].deliverBy);
      packageIdToPackage[_package].state = State.Delivered;

      // calculate the payout
      // @todo grade this on a curve
      uint256 balanceToTransfer = packageIdToPackage[_package].bounty.add(packageIdToPackage[_package].insurance);
      super.ownerOf(_package).transfer(balanceToTransfer);
    }

    function deliver(uint256 _package) public {
      require(msg.sender == packageIdToPackage[_package].recipient);

      _deliver(_package);
    }

    // @TODO doesn't this also need to be _deliverBy_ time plus that delta?
    // uint256 constant public lossTimout = now + 8 weeks;

    // @TDO think about the transfer case -- we need to require the _acceptee_ to
    // cover the insurance, and transfer the bonded amount to previous owner
    // @todo implement proof of delivery
    //function redeemProofOfDelivery(bytes32 _proof) public;

    //function tokenMetadata(uint256 _tokenId) constant returns (string infoUrl);
}
