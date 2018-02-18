import React, { Component } from 'react';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import Blockies from 'ethereum-blockies';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import Snackbar from 'material-ui/Snackbar';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

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
    }

    this.handleSubmit = this.handleSubmit.bind(this);
  }

 async getPackage(packageId, contract) {
   const sender = await contract.packageSender(packageId);
   const receiver = await contract.packageReceiver(packageId);
   const bounty = await contract.packageBounty(packageId);
   const insurance = await contract.packageInsurance(packageId);
   const deliverBy = await contract.packageDeliverBy(packageId);
   let state = await contract.packageState(packageId);
   const owner = await contract.ownerOf(packageId);

   state = state.toString();
   switch(state) {
     case "0":
       state = "Open"
       break;
     case "1":
       state = "InTransit"
       break;
     case "2":
       state = "Lost"
       break;
     case "3":
       state = "ReturnedToSender"
       break;
     case "4":
       state = "Delivered"
       break;
    }

   return {
     id: parseInt(packageId).toString(),
     sender: sender.toString(),
     receiver: receiver.toString(),
     bounty: bounty.toString(),
     state: state.toString(),
     insurance: insurance.toString(),
     owner: owner.toString(),
     deliverBy: deliverBy.toString()
   }
 }

 updateOwned(contract, account) {
   contract.tokensOf(account).then((data) => {
     data.forEach((packageId) => {
       packageId = parseInt(packageId);
       this.getPackage(packageId, contract).then((ownedPackage) => {
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
          this.getPackage(packageId, nextProps.contract).then((changedPackage) => {
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

                debugger

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

  createAvatar(seed) {
    return Blockies.create({
      seed: seed,
      color: '#dfe',
      bgcolor: '#aaa',
      size: 10,
      scale: 2
    });
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {

    // @TODO do this per row

    const rowsNew = this.state.newPackages.map((newPackage, index) => {
      debugger
      const icon = this.createAvatar(newPackage.sender);
      return (
        <TableRow key={index}>
          <TableRowColumn><Avatar src={icon.toDataURL()} /></TableRowColumn>
          <TableRowColumn>{parseInt(newPackage.bounty) / 1000000000000000000} ETH / {parseInt(newPackage.insurance) / 1000000000000000000} ETH</TableRowColumn>
          <TableRowColumn>{newPackage.deliverBy}</TableRowColumn>
          <TableRowColumn>TODO METADATA</TableRowColumn>
          <TableRowColumn>TODO METADATA</TableRowColumn>
          <TableRowColumn><RaisedButton label="Accept" onClick={(e) => this.handleSubmit(newPackage, e)}/></TableRowColumn>
        </TableRow>
      )
    });

    const rowsOwned = this.state.ownedPackages.map((ownedPackage, index) => {
      const icon = this.createAvatar(ownedPackage.id);
      const timeLeft = Math.floor(parseInt(ownedPackage.deliverBy) - (new Date().valueOf() / 1000))

      return (
        <TableRow key={index}>
          <TableRowColumn><Avatar src={icon.toDataURL()} /></TableRowColumn>
          <TableRowColumn>{parseInt(ownedPackage.bounty) / 1000000000000000000} ETH / {parseInt(ownedPackage.insurance) / 1000000000000000000} ETH</TableRowColumn>
          <TableRowColumn>{timeLeft} seconds</TableRowColumn>
          <TableRowColumn>TODO METADATA</TableRowColumn>
          <TableRowColumn>{ownedPackage.state}</TableRowColumn>
          <TableRowColumn><RaisedButton label="Deliver" onClick={(e) => this.handleSubmit(ownedPackage, e)}/></TableRowColumn>
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
            title="Packages in Transit"
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
