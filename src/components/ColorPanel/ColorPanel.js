import React from 'react';
import { Sidebar, Menu, Divider, Button } from 'semantic-ui-react';

class ColorPanel extends React.Component {
  render() {
      return (
        <Sidebar as={Menu} icon='labeled' vertical visible width='very thin' style={{ paddingTop: '21px', background: 'black'}}>
          {/* <Button style={{background: '#00ffa6'}} circular icon='add' size='mini' float= 'center'/> */}
        </Sidebar>
      );
  }
}

export default ColorPanel;
