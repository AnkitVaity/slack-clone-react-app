import React from 'react';
import { Loader, Dimmer } from 'semantic-ui-react';

const Spinner = () => (
  <Dimmer active>
  <Loader size="massive" content={"Preparing Chat..."} />
  </Dimmer>
)

export default Spinner;
