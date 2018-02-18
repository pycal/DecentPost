import React, { Component } from 'react';
import getPackage from '../util/getPackage';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import QRCode from 'qrcode.react';
import FontIcon from 'material-ui/FontIcon';

const style = {
  paper: {
    width: '95vw',
    margin: '20px auto',
    padding: 20,
    display: 'block',
  }
};

class Receive extends Component {
  constructor(props) {
    super(props);

    this.state = {
      receivingPackageIds: [],
      receivingPackages: []
    }

    this.generateProof = this.generateProof.bind(this);
    this.handleAccept = this.handleAccept.bind(this)
  }

  handleAccept(packageId) {

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

      var transaction = this.props.contract.deliver(
        packageId,
        {
          from: account
        }
      ).then(() => { setTimeout(() => window.location.reload(), 5000) });
    })
  }

  generateProof(receivingPackage) {
    this.props.web3.eth.sign(
      window.web3.sha3(receivingPackage.id.toString()),
      this.props.account.account.toLowerCase()
    ).then((data) => {
      receivingPackage.proof = data;
      this.setState({
        updatedAt: new Date()
      })
    });
  }

  updateReceiving(contract, account) {
    contract.receivingOf(account).then((data) => {
      data.forEach((packageId) => {
        packageId = parseInt(packageId);
        getPackage(packageId, contract).then((receivingPackage) => {
          if (!this.state.receivingPackageIds.includes(receivingPackage.id)) {
            this.setState({
              receivingPackageIds: [...this.state.receivingPackageIds, receivingPackage.id],
              receivingPackages: [...this.state.receivingPackages, receivingPackage]
            })
          }
        })
      })
    })
  }

  componentWillReceiveProps(nextProps, ownProps) {
    if (nextProps.account && nextProps.account.account && (nextProps.contract || ownProps.contract)) {
      this.updateReceiving(nextProps.contract || ownProps.contract, nextProps.account.account);
    }
  }

  render() {
    const papers = this.state.receivingPackages.map((receivingPackage, index) => {

      const lockOrQr = receivingPackage.proof ? <QRCode value={receivingPackage.proof} /> : (
        <FontIcon className="material-icons" style={{fontSize: '84px'}}>lock</FontIcon>
      )

      const proofButton = receivingPackage.proof ? null : (
        <FlatButton
          label="Generate Proof"
          primary={true}
          onClick={() => this.generateProof(receivingPackage)}
        />
      );

      const acceptButton = receivingPackage.state == "Delivered" ? null : (
        <RaisedButton label="Accept Delivery" fullWidth={true} primary={true} onClick={() => this.handleAccept(receivingPackage.id)} />
      );

      return (
        <div>
          <Paper style={style.paper} zDepth={2}>
            <div style={{
              float: 'left',
              height: '160px',
              width: '190px',
              textAlign: 'center'
            }}>
              {lockOrQr}
              {proofButton}
            </div>
            <div>
              <p><strong>PKG ID</strong> {receivingPackage.id}</p>
              <p><strong>Sender</strong> {receivingPackage.sender}</p>
              <p><strong>Deliver By</strong> {receivingPackage.deliverBy}</p>
              <p><strong>State</strong> { receivingPackage.state}</p>
              {acceptButton}
            </div>
          </Paper>
        </div>
      )
    });

    return (
      <div>
        {papers}
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

export default connect(mapStateToProps)(Receive);
