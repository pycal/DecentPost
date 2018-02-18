import React, { Component } from 'react';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import Blockies from 'ethereum-blockies';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FontIcon from 'material-ui/FontIcon';
import Snackbar from 'material-ui/Snackbar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import getPackage from '../util/getPackage';
import ethUtil from 'ethereumjs-util';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import TextField from 'material-ui/TextField';

const styles = {
  card: {
    margin: 20
  },
  table: {
    padding: 0
  }
}

class Deliver extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newPackageIds: [],
      newPackages: [],
      ownedPackageIds: [],
      ownedPackages: [],
      open: false,
      openProof: false
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleProofSubmit = this.handleProofSubmit.bind(this);
  }

 updateOwned(contract, account) {
   contract.tokensOf(account).then((data) => {
     data.forEach((packageId) => {
       packageId = parseInt(packageId);
       getPackage(packageId, contract).then((ownedPackage) => {
         if (!this.state.ownedPackageIds.includes(ownedPackage.id)) {
           this.setState({
             ownedPackageIds: [...this.state.ownedPackageIds, ownedPackage.id],
             ownedPackages: [...this.state.ownedPackages, ownedPackage]
           })
         }
       })
     })
   })
 }

  componentWillReceiveProps(nextProps, ownProps) {
    if (nextProps.contract) {
      this.setState({
        newPackageIds: [],
        newPackages: []
      })
      // observe new packages
      nextProps.contract.PackageChanged({fromBlock: 0, toBlock: 'latest'}).watch((error, result) => {
        if (!error) {
          const packageId = parseInt(result.args._packageId).toString();
          getPackage(packageId, nextProps.contract).then((changedPackage) => {
            if (!this.state.newPackageIds.includes(packageId) && changedPackage.state == "Open") {
              this.setState({
                newPackageIds: [...this.state.newPackageIds, packageId],
                newPackages: [...this.state.newPackages, changedPackage],
                open: true
              })

              // doesn't include it yet but we own it
              // try to remove from newPackages
              // add it to owned packages
            } else if (!this.state.ownedPackageIds.includes(packageId) && (changedPackage.owner == this.props.account.account.toLowerCase())){

              this.setState({
                ownedPackageIds: [...this.state.ownedPackageIds, packageId],
                ownedPackages: [...this.state.ownedPackages, changedPackage],
                open: true
              })

              if (this.state.newPackageIds.includes(packageId)) {
                const newPackages = this.state.newPackages.filter((newPackage) => {
                  return newPackage.id.toString() != packageId.toString()
                })

                const newPackageIds = this.state.newPackageIds.filter((newPackageId) => {
                  return newPackageId.toString() != packageId.toString()
                })

                this.setState({
                  newPackageIds: newPackageIds,
                  newPackages: newPackages
                })
              }

              // does include it yet but its old
            } else if (this.state.ownedPackageIds.includes(packageId)) {
              this.updateOwned(this.props.contract, this.props.account.account)
            }
          })
        }
      });
    }
    if (nextProps.account.account && (nextProps.contract || ownProps.contract)) {
      this.updateOwned(nextProps.contract || ownProps.contract, nextProps.account.account);
    }
  }

  handleSubmit(newPackage, event) {
    event.preventDefault();

    this.props.web3.eth.getAccounts((err, accounts) => {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accounts.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      var account = accounts[0];

      var transaction = this.props.contract.pickUp(
        newPackage.id,
        {
          from: account,
          value: newPackage.insurance
        }
      );
    })
  }

  handleProofOfDelivery(ownedPackage, event) {
    event.preventDefault();

    this.setState({
      openProof: true,
      proofPackageId: ownedPackage.id,
    })
  }

  createAvatar(seed) {
    return Blockies.create({
      seed: seed,
      color: '#dfe',
      bgcolor: '#aaa',
      size: 10,
      scale: 2
    });
  }

  handleProofClose = () => {
    this.setState({
      openProof: false,
      proofPackageId: null,
      proofOfDelivery: null
    })
  }

  handleProofSubmit = () => {
    let message = window.web3.sha3(this.state.proofPackageId.toString());
    let signature = this.state.proofOfDelivery;

    let signatureData = ethUtil.fromRpcSig(signature)
    let v = ethUtil.bufferToHex(signatureData.v)
    let r = ethUtil.bufferToHex(signatureData.r)
    let s = ethUtil.bufferToHex(signatureData.s)

    this.props.contract.redeemProofOfDelivery.call(
      message, v, r, s,
      {
        from: this.props.account.account
      }
    ).then(
      (data) => {

      },
      (error) => {
        this.setState({
          proofFail: "Your proof failed!"
        })
      }
    );
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {

    // @TODO do this per row

    const rowsNew = this.state.newPackages.map((newPackage, index) => {
      const icon = this.createAvatar(newPackage.sender);

      const pickUpMapLink = `https://www.google.com/maps/?q=${newPackage.metadata.destination.lng},${newPackage.metadata.destination.lat}`

      const destinationMapLink = `https://www.google.com/maps/?q=${newPackage.metadata.pickUp.lng},${newPackage.metadata.pickUp.lat}`

      return (
        <TableRow key={index}>
          <TableRowColumn><Avatar src={icon.toDataURL()} /></TableRowColumn>
          <TableRowColumn>{parseInt(newPackage.bounty) / 1000000000000000000} ETH / {parseInt(newPackage.insurance) / 1000000000000000000} ETH</TableRowColumn>
          <TableRowColumn>{newPackage.deliverBy}</TableRowColumn>
          <TableRowColumn><a target="_blank" href={pickUpMapLink}>Map</a></TableRowColumn>
          <TableRowColumn><a target="_blank" href={destinationMapLink}>Map</a></TableRowColumn>
          <TableRowColumn><RaisedButton label="Pick Up" onClick={(e) => this.handleSubmit(newPackage, e)}/></TableRowColumn>
        </TableRow>
      )
    });

    const rowsOwned = this.state.ownedPackages.map((ownedPackage, index) => {
      const icon = this.createAvatar(ownedPackage.id);
      const timeLeft = Math.floor(parseInt(ownedPackage.deliverBy) - (new Date().valueOf() / 1000))

      const action = ownedPackage.state == "InTransit" ? (<RaisedButton icon={<FontIcon className="material-icons">gavel</FontIcon>} secondary={true} onClick={(e) => this.handleProofOfDelivery(ownedPackage, e)}/>) : null;

      const mapLink = `https://www.google.com/maps/?q=${ownedPackage.metadata.destination.lng},${ownedPackage.metadata.destination.lat}`
      return (
        <TableRow key={index}>
          <TableRowColumn><Avatar src={icon.toDataURL()} /></TableRowColumn>
          <TableRowColumn>{parseInt(ownedPackage.bounty) / 1000000000000000000} ETH / {parseInt(ownedPackage.insurance) / 1000000000000000000} ETH</TableRowColumn>
          <TableRowColumn>{timeLeft} seconds</TableRowColumn>
          <TableRowColumn><a target="_blank" href={mapLink}>Map</a></TableRowColumn>
          <TableRowColumn>{ownedPackage.state}</TableRowColumn>
          <TableRowColumn>
            {action}
          </TableRowColumn>
        </TableRow>
      )
    });

    return (
      <div>
        <Card style={styles.card} expanded={true}>
          <CardHeader
            title="Available for Pick Up"
            subtitle="Look out, get paid!"
            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardText expandable={true} style={styles.table}>
            <Table>
              <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                <TableRow>
                  <TableHeaderColumn>Sender</TableHeaderColumn>
                  <TableHeaderColumn>Bounty / Bond</TableHeaderColumn>
                  <TableHeaderColumn>Deliver By</TableHeaderColumn>
                  <TableHeaderColumn>Pickup</TableHeaderColumn>
                  <TableHeaderColumn>Destination</TableHeaderColumn>
                  <TableHeaderColumn></TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {rowsNew}
              </TableBody>
            </Table>
          </CardText>
        </Card>

        <Card style={styles.card} expanded={true}>
          <CardHeader
            title="Bonded Packages"
            subtitle="Remember, bond is law!"
            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardText expandable={true} style={styles.table}>
            <Table>
              <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                <TableRow>
                  <TableHeaderColumn>Package</TableHeaderColumn>
                  <TableHeaderColumn>Bounty / Bond</TableHeaderColumn>
                  <TableHeaderColumn>Time Left</TableHeaderColumn>
                  <TableHeaderColumn>Destination</TableHeaderColumn>
                  <TableHeaderColumn>State</TableHeaderColumn>
                  <TableHeaderColumn></TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {rowsOwned}
              </TableBody>
            </Table>
          </CardText>
        </Card>

        <Snackbar
          open={this.state.open}
          message="Package updated"
          autoHideDuration={3000}
          onRequestClose={this.handleRequestClose}
        />

        <Dialog
          title="Redeem Proof of Delivery"
          actions={[
            <FlatButton
              label="Cancel"
              primary={true}
              onClick={this.handleProofClose}
            />,
            <FlatButton
              label="Submit"
              primary={true}
              keyboardFocused={true}
              onClick={this.handleProofSubmit}
            />,
          ]}
          modal={false}
          open={this.state.openProof}
          onRequestClose={this.handleProofClose}
        >

          <TextField
            hintText="Redeem PoD from receiver"
            errorText={this.state.proofFail}
            onChange={(event, text) => {
              this.setState({proofOfDelivery: text})
            }}
          />
        </Dialog>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    web3: state.web3.web3Instance,
    contract: state.contract.instance,
    account: state.account
  }
}

export default connect(mapStateToProps)(Deliver);
