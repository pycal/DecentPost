import React from 'react';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import {pinkA200, transparent} from 'material-ui/styles/colors';

const ContactList = () => (
  <Paper>
    <List>
      <ListItem
        primaryText="Chelsea Otakan (0x627306090abaB3A6e1400e9345bC60c78a8BEf57)"
        leftIcon={<ActionGrade color={pinkA200} />}
        rightAvatar={<Avatar src="images/chexee-128.jpg" />}
        fullwidth={true}
      />
      <ListItem
        primaryText="Eric Hoffman (0xf17f52151EbEF6C7334FAD080c5704D77216b732)"
        insetChildren={true}
        rightAvatar={<Avatar src="images/kolage-128.jpg" />}
        fullwidth={true}
      />
      <ListItem
        primaryText="James Anderson (0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef)"
        insetChildren={true}
        rightAvatar={<Avatar src="images/jsa-128.jpg" />}
        fullwidth={true}
      />
    </List>
  </Paper>
);

export default ContactList;