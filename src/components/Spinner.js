import React from 'react';
import {
    Spinner,
    Text,
    Grid,
    Row,
    View,
} from 'native-base';

const EASpinner = ({ color, text }) => {

    return (
        <Grid>
            <Row style={{ alignItems: 'center' }}>
                <View style={{ alignItems: 'center', width: '100%' }} >
                    <Spinner color={color} />
                    <Text>{text}</Text>
                </View>
            </Row>
        </Grid>
    )
};

export default EASpinner;