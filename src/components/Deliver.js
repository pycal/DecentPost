import React, { Component } from 'react';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import Blockies from 'ethereum-blockies';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
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
      newPackages: []
    }

    this.handleSubmit = this.handleSubmit.bind(this);
  }

 async getPackage(packageId, contract) {
   const sender = await contract.packageSender(packageId);
   const receiver = await contract.packageReceiver(packageId);
   const bounty = await contract.packageBounty(packageId);
   const insurance = await contract.packageInsurance(packageId);
   const state = await contract.packageState(packageId);

   return {
     id: packageId,
     sender: sender.toString(),
     receiver: receiver.toString(),
     bounty: bounty.toString(),
     state: state.toString(),
     insurance: insurance.toString()
   }
 }

  componentWillReceiveProps(nextProps) {
    if (nextProps.contract) {
      this.setState({
        newPackageIds: [],
        newPackages: []
      })
      nextProps.contract.NewPackage({fromBlock: 0, toBlock: 'latest'}).watch((error, result) => {
        if (!error) {
          const newPackageId = parseInt(result.args._packageId);
          this.getPackage(newPackageId, nextProps.contract).then((newPackage) => {
            if (!this.state.newPackageIds.includes(newPackageId) && newPackage.state == "0") {
              this.setState({
                newPackageIds: [...this.state.newPackageIds, newPackageId],
                newPackages: [...this.state.newPackages, newPackage]
              })
            }
          })
        }
      });
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
      ).then((data) => { alert('package accepted') });
    })
  }

  createAvatar(seed) {
    return Blockies.create({
      seed: seed,
      size: 10,
      scale: 2
    });
  }

  render() {

    // @TODO do this per row

    const rows = this.state.newPackages.map((newPackage, index) => {
      const icon = this.createAvatar(newPackage.sender);
      console.log(icon.toDataURL())
      return (
        <TableRow key={index}>
          <TableRowColumn><Avatar src={icon.toDataURL()} /></TableRowColumn>
          <TableRowColumn>{parseInt(newPackage.bounty) / 1000000000000000000} ETH</TableRowColumn>
          <TableRowColumn>{parseInt(newPackage.insurance) / 1000000000000000000} ETH</TableRowColumn>
          <TableRowColumn>TODO METADATA</TableRowColumn>
          <TableRowColumn>TODO METADATA</TableRowColumn>
          <TableRowColumn><RaisedButton label="Accept" onClick={(e) => this.handleSubmit(newPackage, e)}/></TableRowColumn>
        </TableRow>
      )
    })

    return (
      <div>
        <Card style={styles.card} expanded={true}>
          <CardHeader
            title="Available for Pick Up"
            subtitle="Remember, bond is law!"
            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardText expandable={true} style={styles.table}>
            <Table>
              <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                <TableRow>
                  <TableHeaderColumn>Sender</TableHeaderColumn>
                  <TableHeaderColumn>Bounty</TableHeaderColumn>
                  <TableHeaderColumn>Bond</TableHeaderColumn>
                  <TableHeaderColumn>Pickup</TableHeaderColumn>
                  <TableHeaderColumn>Destination</TableHeaderColumn>
                  <TableHeaderColumn></TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {rows}
              </TableBody>
            </Table>
          </CardText>
        </Card>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    web3: state.web3.web3Instance,
    contract: state.contract.instance
  }
}

export default connect(mapStateToProps)(Deliver);
