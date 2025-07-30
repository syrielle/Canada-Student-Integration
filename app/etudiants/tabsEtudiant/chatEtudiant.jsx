import { StyleSheet, Text, View } from 'react-native';

const ChatEtudiant = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Chat à venir</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 24,
        color: '#333'
    }
});

export default ChatEtudiant;