import React from 'react';
import { View, FlatList, StyleSheet, Text, StatusBar, Dimensions } from 'react-native';

import { LoggingMessages, LoggingNotifys } from './logger-factory';
import type { LoggingItem } from './logger-factory';

const LoggingView = () => {
    const { height: screenHeight } = Dimensions.get('window');
    const viewHeight = screenHeight * 0.8 - (StatusBar.currentHeight || 0);
    const [messages, setMessages] = React.useState<Array<LoggingItem>>([]);

    const freshMessages = () => {
        setMessages([...LoggingMessages]);
    }

    LoggingNotifys.push(freshMessages);

    return <View style={{ height: viewHeight }}>
        <FlatList
            data={messages}
            renderItem={({ item }) => <Text>{item.message}</Text>}
            keyExtractor={item => item.id.toString()} />
    </View>;
};

export { LoggingView };