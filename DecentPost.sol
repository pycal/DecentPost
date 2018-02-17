pragma solidity ^0.4.18;

import "./ERC721/ERC721Token.sol";

contract DecentPost is ERC721Token {
    string constant public NAME = "DecentPost";
    string constant public SYMBOL = "DPACK";

    enum State {
        Open,
        InTransit,
        Lost,
        ReturnedToSender,
        Delivered
    }

    struct Package {
        uint256 price;
        uint256 deliverBy;
        State state;
        address sender;
        uint256 insurance;
        address receiver;
        string metadata;
    }

    mapping(uint256 => Package) packageIdToPackage;

    // MUST be sent an ether amount >= the _price sent - this is held in escrow by the contract
    // 2000, 1519711436, 10000, "0x14723a09acff6d2a60dcdf7aa4aff308fddc160c", "abc"
    function createPackage(uint256 _price,  uint256 _deliverBy, uint256 _insurance, address _receiver, string _metadata) public payable {
        require(msg.value == _price);
        uint256 newId = totalSupply().add(1);
        super._mint(msg.sender, newId);
        packageIdToPackage[newId].price = _price;
        packageIdToPackage[newId].deliverBy = _deliverBy;
        packageIdToPackage[newId].insurance = _insurance;
        packageIdToPackage[newId].receiver = _receiver;
        packageIdToPackage[newId].metadata = _metadata;
        packageIdToPackage[newId].state = State.Ope
    }

    // @TODO doesn't this also need to be _deliverBy_ time plus that delta?
    // uint256 constant public lossTimout = now + 8 weeks;


    function getPackagePrice(uint256 _packageId) public view returns (uint256) {
        return packageIdToPackage[_packageId].price;
    }

    // @TDO think about the transfer case -- we need to require the _acceptee_ to
    // cover the insurance, and transfer the bonded amount to previous owner

    // @todo implement lifecycle functions below

    // state must be open in order to accept
    // receipient should never be able to be owner, should not be able to accept
    // caller must send >= insurance as a bond
    // changes state to accepted
    // changes ownership to caller
    // function pickUp(uint256 _package) public payable {
    //    require(packageToStruct[_package].state == State.Open);
    //    require(msg.value == packageToStruct[_p                                                                                                                                             ackage].insurance);
    //}

    // state must be InTransit to lose
    // should not be callable by recipient
    // should be callable by "carrier" at any time if InTransit
    // should be callable by sender if lossTimeout has expired and if InTransit
    // should transfer sender's original price BACK to them
    // AND they get the insurance
    //function lose(uint256 _package) public;

    //function _deliver()

    // must InTransit
    // recipient is able to call at any time assuming it's in InTransit
    // it's also callable by antoher function - which is redeemProofOfDelivery()
    //function deliver(uint256 _package) public;

    //function returnToSender(uint256) public;

    // @todo implement proof of delivery
    //function redeemProofOfDelivery(bytes32 _proof) public;

    //function tokenMetadata(uint256 _tokenId) constant returns (string infoUrl);
}
