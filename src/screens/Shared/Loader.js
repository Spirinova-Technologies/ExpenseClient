import React from 'react';
import {
    Content
} from 'native-base';
import { EASpinner } from "../../components";

import {FormStyle} from "../../styles";

const Loader = () => {
    return (
        <Content padder contentContainerStyle={FormStyle.container}>
          <EASpinner color="red" text="Please wait..." />
        </Content>
      );
};

export default Loader;