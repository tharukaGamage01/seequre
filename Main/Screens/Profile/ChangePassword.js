import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export function ChangePassword({ userPassword, onSubmit }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Please fill all the fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('New password and confirm password do not match');
            return;
        }

        if (currentPassword !== userPassword) {
            Alert.alert('Current password is incorrect');
            return;
        }

        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setSuccessMessage('Password changed successfully');

        if (typeof onSubmit === 'function') {
            onSubmit();
        }
    };
    
    return (
        <View style={styles.container}>
            <TextInput
                style={[styles.input, { borderColor: 'black' }]}
                onChangeText={setCurrentPassword}
                value={currentPassword}
                placeholder="Current password"
                secureTextEntry
                testID="current-password-input"
            />
            <TextInput
                style={[styles.input, { borderColor: 'black' }]}
                onChangeText={setNewPassword}
                value={newPassword}
                placeholder="New password"
                secureTextEntry
                testID="new-password-input"
            />
            <TextInput
                style={[styles.input, { borderColor: 'black' }]}
                onChangeText={setConfirmPassword}
                value={confirmPassword}
                placeholder="Confirm password"
                secureTextEntry
                testID="confirm-password-input"
            />
            <TouchableOpacity
                style={[styles.buttonContainer, { marginBottom: 20 }]}
                onPress={handleSubmit}
                testID="submit-button"
            >
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            {successMessage ? <Text testID="success-message">{successMessage}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        color: '#333',
        fontWeight: 'bold',
    },
    input: {
        height: 40,
        width: '100%',
        borderColor: 'black',
        borderWidth: 1,
        marginBottom: 20,
        paddingLeft: 10,
        borderRadius: 5,
    },
    buttonContainer: {
        backgroundColor: '#2f90d8',
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 50,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
});
