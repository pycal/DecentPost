pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

contract DecentPost is ERC721Token {
    string constant public NAME = "DecentPost";
    string constant public SYMBOL = "DPACK";

    event PackageChanged(uint256 indexed _packageId);

    mapping(address => uint256[]) receiving;
    mapping(address => uint256[]) sending;

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
        packageIdToPackage[newId] = Package({
          bounty: _bounty,
          deliverBy: _deliverBy,
          insurance: _insurance,
          receiver: _receiver,
          metadata: _metadata,
          state: State.Open,
          sender: msg.sender
        });
        receiving[_receiver].push(newId);
        sending[msg.sender].push(newId);
        PackageChanged(newId);
    }

    function sendingOf(address _sender) public view returns (uint256[]) {
      return sending[_sender];
    }

    function receivingOf(address _receiver) public view returns (uint256[]) {
      return receiving[_receiver];
    }

    function packageSender(uint256 _packageId) public view returns(address) {
      return packageIdToPackage[_packageId].sender;
    }

    function packageReceiver(uint256 _packageId) public view returns(address) {
      return packageIdToPackage[_packageId].receiver;
    }

    function packageState(uint256 _packageId) public view returns(State) {
      return packageIdToPackage[_packageId].state;
    }

    function packageMetadata(uint256 _packageId) public view returns(string) {
      return packageIdToPackage[_packageId].metadata;
    }

    function packageBounty(uint256 _packageId) public view returns (uint256) {
        return packageIdToPackage[_packageId].bounty;
    }

    function packageDeliverBy(uint256 _packageId) public view returns (uint256) {
        return packageIdToPackage[_packageId].deliverBy;
    }

    function packageInsurance(uint256 _packageId) public view returns(uint256) {
      return packageIdToPackage[_packageId].insurance;
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
        PackageChanged(_package);
    }

    // state must be InTransit to lose
    // should not be callable by receiver
    // should be callable by "carrier" at any time if InTransit
    // should be callable by sender if lossTimeout has expired and if InTransit
    // should transfer sender's original bounty BACK to them
    // AND they get the insurance
    function lose(uint256 _package) public {
      require(packageIdToPackage[_package].state == State.InTransit);
      require(msg.sender != packageIdToPackage[_package].receiver);
      if (msg.sender == packageIdToPackage[_package].sender) {
        require(block.timestamp >= packageIdToPackage[_package].deliverBy);
      }

      packageIdToPackage[_package].state = State.Lost;
      // returns the original bounty to the sender
      uint256 balanceToTransfer = packageIdToPackage[_package].bounty.add(packageIdToPackage[_package].insurance);
      packageIdToPackage[_package].sender.transfer(balanceToTransfer);
      PackageChanged(_package);
    }

    function returnToSender(uint256 _package) public {
      require(packageIdToPackage[_package].state == State.InTransit);
      require(packageIdToPackage[_package].sender == msg.sender);
      require(block.timestamp <= packageIdToPackage[_package].deliverBy);

      packageIdToPackage[_package].state = State.ReturnedToSender;

      packageIdToPackage[_package].sender.transfer(packageIdToPackage[_package].bounty);
      super.ownerOf(_package).transfer(packageIdToPackage[_package].insurance);
      PackageChanged(_package);
    }

    function _deliver(uint256 _package) internal {
      require(block.timestamp <= packageIdToPackage[_package].deliverBy);
      packageIdToPackage[_package].state = State.Delivered;

      // calculate the payout
      // @todo grade this on a curve
      uint256 balanceToTransfer = packageIdToPackage[_package].bounty.add(packageIdToPackage[_package].insurance);
      super.ownerOf(_package).transfer(balanceToTransfer);
      PackageChanged(_package);
    }

    function deliver(uint256 _package) public {
      require(msg.sender == packageIdToPackage[_package].receiver);

      _deliver(_package);
    }

    // @TODO doesn't this also need to be _deliverBy_ time plus that delta?
    // uint256 constant public lossTimout = now + 8 weeks;

    // @TDO think about the transfer case -- we need to require the _acceptee_ to
    // cover the insurance, and transfer the bonded amount to previous owner
    // @todo implement proof of delivery

    function redeemProofOfDelivery(bytes32 msgHash, uint8 v, bytes32 r, bytes32 s) constant returns(address) {
      /* bytes memory prefix = "\x19Ethereum Signed Message:\n32";
      bytes32 prefixedHash = keccak256(prefix, _hash);
      require(ecrecover(prefixedHash, v, r, s) == packageIdToPackage[_package].receiver);

      _deliver(_package); */
      bytes memory prefix = "\x19Ethereum Signed Message:\n32";
      bytes32 prefixedHash = keccak256(prefix, msgHash);
      return ecrecover(prefixedHash, v, r, s);
    }

    function tokenMetadata(uint256 _packageId) constant public returns (string infoUrl) {
      return packageIdToPackage[_packageId].metadata;
    }
}
