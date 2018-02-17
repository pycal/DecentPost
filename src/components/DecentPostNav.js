import React, {Component} from "react";
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import FontIcon from 'material-ui/FontIcon';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';

const sendIcon = <FontIcon className="material-icons">send</FontIcon>;
const deliverIcon = <FontIcon className="material-icons">transfer_within_a_station</FontIcon>;
const receiveIcon = <FontIcon className="material-icons">move_to_inbox</FontIcon>;


class DecentPostNav extends Component {
  state = {
    selectedIndex: null,
  };

  select = (index) => this.setState({selectedIndex: index});

  render() {
    return (
      <Paper zDepth={1}>
        <BottomNavigation selectedIndex={this.state.selectedIndex}>
          <BottomNavigationItem
            label="Send"
            icon={sendIcon}
            onClick={() => {
                this.select(0)
                this.props.dispatchSendRoute()
              }
            }
          />
          <BottomNavigationItem
            label="Deliver"
            icon={deliverIcon}
            onClick={() => {
                this.select(1)
                this.props.dispatchDeliverRoute()
              }
            }
          />
          <BottomNavigationItem
            label="Receive"
            icon={receiveIcon}
            onClick={() => {
                this.select(2)
                this.props.dispatchReceiveRoute()
              }
            }
          />
        </BottomNavigation>
      </Paper>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchSendRoute: () => dispatch(push('/send')),
    dispatchDeliverRoute: () => dispatch(push('/deliver')),
    dispatchReceiveRoute: () => dispatch(push('/receive'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DecentPostNav);