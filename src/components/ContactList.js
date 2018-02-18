import React, {Component} from 'react';
import { connect } from 'react-redux'
import Paper from 'material-ui/Paper';
import {List, ListItem, makeSelectable} from 'material-ui/List';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import {pinkA200, transparent} from 'material-ui/styles/colors';
import {push} from "react-router-redux";

let SelectableList = makeSelectable(List);

function wrapState(ComposedComponent) {
  return class SelectableList extends Component {
    constructor(props) {
      super(props);
      this.state = {selectedIndex: null}
    }

    componentWillMount() {
      this.setState({
        selectedIndex: this.props.defaultValue,
      });
    }

    handleRequestChange = (event, index) => {
      this.setState({
        selectedIndex: index,
      });
    };

    render() {
      return (
        <ComposedComponent
          value={this.state.selectedIndex}
          onChange={this.handleRequestChange}
        >
          {this.props.children}
        </ComposedComponent>
      )
    }
  }
}

SelectableList = wrapState(SelectableList);

class ContactList extends Component {
  constructor(props) {
    super(props);
    this.state = {selectedIndex: null, selectedAddress: null};
    this.selectIndex = this.selectIndex.bind(this);
  }

  selectIndex(contact) {
    this.setState({
      selectedIndex: contact.index,
      selectedAddress: contact.address
    });
  }

  render() {
    return (
      <Paper>
        <SelectableList>
          <ListItem
            primaryText="Chelsea Otakan (0x627306090abaB3A6e1400e9345bC60c78a8BEf57)"
            leftIcon={<ActionGrade color={pinkA200}/>}
            rightAvatar={<Avatar src="images/chexee-128.jpg"/>}
            onClick={() => this.selectIndex({index: 0, address: '0x627306090abaB3A6e1400e9345bC60c78a8BEf57'})}
            value={0}
          />
          <ListItem
            primaryText="Eric Hoffman (0xf17f52151EbEF6C7334FAD080c5704D77216b732)"
            insetChildren={true}
            rightAvatar={<Avatar src="images/kolage-128.jpg"/>}
            onClick={() => this.selectIndex({index: 1, address: '0xf17f52151EbEF6C7334FAD080c5704D77216b732'})}
            value={1}
          />
          <ListItem
            primaryText="James Anderson (0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef)"
            insetChildren={true}
            rightAvatar={<Avatar src="images/jsa-128.jpg"/>}
            onClick={() => this.selectIndex({index: 2, address: '0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef'})}
            value={2}
          />
        </SelectableList>
      </Paper>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    selectedAddress: state.selectedAddress,
    selectedIndex: state.selectedIndex,
  }
};

export default connect(mapStateToProps)(ContactList);