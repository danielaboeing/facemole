import React from 'react';
import { View } from 'react-native';

export default class SinglePersonPage extends React.Component<any,any> {

    constructor(props: any){ 
        super(props);
    }

    render(){
        console.log(this.props.person)
        return (
            <View></View>
        )
    }
}