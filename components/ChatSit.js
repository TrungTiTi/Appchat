import React, { useState, useContext } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert, ActivityIndicator,ImageBackground } from 'react-native';

const ChatSit = ({navigation}) => {

    const handleHome = () =>{
        navigation.navigate('Home')
    }

    const handleTest = () => {

    }

    return (
        <View style={styles.container}>
            <Text>hello</Text>
            <TouchableOpacity>
                <Text onPress={handleHome}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <Text onPress={handleTest}>Test</Text>
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center'
    },
})
export default ChatSit;