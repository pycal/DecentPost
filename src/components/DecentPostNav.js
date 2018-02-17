import React, {Component} from "react";
import FontIcon from 'material-ui/FontIcon';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';

const sendIcon = <FontIcon className="material-icons">send</FontIcon>;
const deliverIcon = <FontIcon className="material-icons">transfer_within_a_station</FontIcon>;
const receiveIcon = <FontIcon className="material-icons">move_to_inbox</FontIcon>;


class DecentPostNav extends Component {
  state = {
    selectedIndex: 0,
  };

  select = (index) => this.setState({selectedIndex: index});

  render() {
    return (
      <Paper zDepth={1}>
        <BottomNavigation selectedIndex={this.state.selectedIndex}>
          <BottomNavigationItem
            label="Send"
            icon={sendIcon}
            onClick={() => this.select(0)}
          />
          <BottomNavigationItem
            label="Deliver"
            icon={deliverIcon}
            onClick={() => this.select(1)}
          />
          <BottomNavigationItem
            label="Receive"
            icon={receiveIcon}
            onClick={() => this.select(2)}
          />
        </BottomNavigation>
      </Paper>
    );
  }
}

export default DecentPostNav;