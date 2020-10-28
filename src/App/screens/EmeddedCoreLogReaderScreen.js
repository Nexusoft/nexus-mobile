import React, {useState, useEffect} from 'react';
import { View, TextInput } from 'react-native';
import { Surface, Button, IconButton } from 'react-native-paper';

import ScreenBody from 'components/ScreenBody';
import Text from 'components/Text';
import { ScrollView } from 'react-native-gesture-handler';
import RNFS from 'react-native-fs';
import SvgIcon from 'components/SvgIcon';
import RecoveryIcon from 'icons/recovery.svg';

const styles = {
  screen: {
    paddingTop: 30,
  },
};


async function handleReadFile (logOutput,setLogOutput)
{
    if (logOutput !== true || logOutput === 'finished')
        return;
    if (logOutput === true)
    {
        //TODO: Change this
        const result = await RNFS.readFile(RNFS.DocumentDirectoryPath + "/Nexus/testnet605/client/log/0.log", 'ascii');
        const formated = result.split(`\n`).reverse().join(`\n`);
        setLogOutput(formated);
    }
}



const LogOutput = () => {
    
    const {logOutput, setLogOutput} = EmbeddedCoreLogReaderScreen.logCallback;
    handleReadFile(logOutput, setLogOutput);
    if (logOutput === true)
    {
        return (<Text>Loading</Text>);
    }
    else{
    return (
        <TextInput multiline editable={false}>
            {logOutput}
        </TextInput>
    )}
}


const UpdateLog = () => {
    EmbeddedCoreLogReaderScreen.logCallback.setLogOutput(true);
}


export default function EmbeddedCoreLogReaderScreen( { navigation }) {
    const [logOutput, setLogOutput] = useState(true);
    EmbeddedCoreLogReaderScreen.logCallback = {logOutput, setLogOutput};
  return (
    <ScreenBody style={styles.screen}>
        <ScrollView style={{margin:10, flex:1}}>
            <LogOutput />
        </ScrollView>   
    </ScreenBody>
  );
}

//TODO: Change?
EmbeddedCoreLogReaderScreen.logCallback;

EmbeddedCoreLogReaderScreen.nav = {
  name: 'EmbeddedCoreLogReader',
  options: {
    title: 'Core Log',
    headerRight: ({tintColor}) =>     
        <IconButton
            icon={({ size }) => (
                <SvgIcon icon={RecoveryIcon} size={size} color={tintColor} />
            )}
            color={tintColor}
            size={25}
            onPress={() => {
                UpdateLog();
            }}
        />
  },
};
