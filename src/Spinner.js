import React from 'react';
import { Loader, Dimmer } from 'semantic-ui-react';

const Spinner = () => (
  <Dimmer active>
    <Loader size="huge" content={"Connection to server. Please wait..."} />
  </Dimmer>
);

export default Spinner;