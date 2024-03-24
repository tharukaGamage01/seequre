import React, { useState,useRef } from "react";
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { firebase } from "../../components/firebaseConfig";
import { useSetAtom } from "jotai";
import { userIdAtom } from '../userAtom';
import { userNameAtom } from '../userAtom';
import { userDocIdAtom } from '../userAtom';

const Login = ({ navigation }) => {
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const setUserId = useSetAtom(userIdAtom);
    const setUserName = useSetAtom(userNameAtom);
    const setUserDocId = useSetAtom(userDocIdAtom);
    const emailInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    const loginUser = async (email, password, navigation) => {
        try {
            if (!email || !password) {
                throw new Error("Please provide both email and password.");
            }

            // Firebase authentication
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            const userUID = user.uid;       //user's UID
            const userRef = firebase.firestore().collection('users');
            const snapshot = await userRef.where('uid', '==', user.uid).get();
            let userName = '';
            let userDocId = '';

            snapshot.forEach(doc => {
                userName = doc.data().name;
                userDocId = doc.id;
            });

            setUserName(userName);
            setUserId(userUID);
            setUserDocId(userDocId);

            setEmail("");
            setPassword("");
            emailInputRef.current.clear();
            passwordInputRef.current.clear();
            navigation.navigate('main', { screen: 'scanner' });

        } catch (error) {
            let errorMessage = "An error occurred while logging in.";

            if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
                errorMessage = "Invalid email or password. Please try again.";
            } else if (error.code === "auth/invalid-email") {
                errorMessage = "Invalid email address.";
            }

            console.error("Login error:", error);
            alert(errorMessage);
        }
    };

    const handleLogin = async () => {
        await loginUser(email, password, navigation);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ alignItems: 'center', marginTop: 70 }}>
                    <Image
                        source={require("../../assets/SeeQuReLogo.png")}
                        style={{
                            height: 250,
                            width: 250,
                            borderRadius: 20,
                            marginBottom: 0,
                        }}
                    />
                </View>

                <View style={{ marginVertical: 0, alignItems: 'center', letterSpacing: 2 }}>
                    <Text style={styles.logoText}>
                        See
                        <Text style={styles.qText}>Q</Text>
                        <Text>u</Text>
                        <Text style={styles.rText}>R</Text>
                        e
                    </Text>
                </View>

                <View style={{ flex: 1, marginHorizontal: 22 }}>
                    <View style={{ marginVertical: 10, alignItems: 'center' }}>
                        <Text style={{
                            fontSize: 16,
                            marginVertical: 10,
                            color: COLORS.black
                        }}>
                            Where Security Meets Simplicity
                        </Text>
                    </View>

                    <View style={{ marginBottom: 12 }}>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: 400,
                            marginVertical: 8
                        }}>Email address</Text>

                        <View style={styles.inputContainer}>
                            <TextInput
                                ref={emailInputRef}
                                placeholder='Enter your email address'
                                placeholderTextColor={COLORS.black}
                                keyboardType='email-address'
                                style={styles.input}
                                onChangeText={(text) => setEmail(text)}
                                testID="email-input"
                                value={email}
                            />
                        </View>
                    </View>

                    <View style={{ marginBottom: 12 }}>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: 400,
                            marginVertical: 8
                        }}>Password</Text>

                        <View style={styles.inputContainer}>
                            <TextInput
                                ref={passwordInputRef}
                                placeholder='Enter your password'
                                placeholderTextColor={COLORS.black}
                                secureTextEntry={!isPasswordShown}
                                style={styles.input}
                                onChangeText={(text) => setPassword(text)}
                                testID="password-input"
                                value={password}
                            />
                            <TouchableOpacity
                                onPress={() => setIsPasswordShown(!isPasswordShown)}
                                style={styles.eyeIcon}
                            >
                                <Ionicons name={isPasswordShown ? "eye-off" : "eye"} size={24} color={COLORS.black} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        marginVertical: 6
                    }}>
                        <Checkbox
                            style={{ marginRight: 8 }}
                            value={isChecked}
                            onValueChange={setIsChecked}
                            color={isChecked ? COLORS.blue : undefined}
                        />
                        <Text>Remember Me</Text>
                    </View>

                    <Button
                        title="Sign In"
                        filled
                        style={{
                            marginTop: 10,
                            marginBottom: 4,
                            height: 40,
                        }}
                        onPress={handleLogin}
                    />

                    <View style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: 'center',
                        marginVertical: 10
                    }}>
                        <Text style={{ paddingTop: 6, fontSize: 16, color: COLORS.black, flex: 0.6, lineHeight: 15 }}>Don't have an account ? </Text>
                        <Button title="Register" onPress={() => navigation.navigate("register")} style={{ borderRadius: 0, borderWidth: 0, padding: 10, backgroundColor: 'transparent' }} />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const COLORS = {
    white: "#FFFFFF",
    black: "#222222",
    darkGreen: "#007260",
    lightGreen: "#82fa63",
    blue: "#2f90d8",
    lightBlue: "#46a7e4",
    grey: "#CCCCCC"
};

const Button = (props) => {
    const filledBgColor = props.color || COLORS.blue;
    const outlinedColor = COLORS.white;
    const bgColor = props.filled ? filledBgColor : outlinedColor;
    const textColor = props.filled ? COLORS.white : COLORS.blue;

    return (
        <TouchableOpacity
            style={{
                ...styles.button,
                ...{ backgroundColor: bgColor },
                ...props.style,
                overflow: 'hidden'
            }}
            onPress={props.onPress}
        >
            <Text style={{ fontSize: 16, ... { color: textColor } }}>{props.title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    logoText: {
        fontSize: 32,
        color: COLORS.black,
    },
    qText: {
        color: COLORS.lightGreen,
        fontWeight: 'bold',
    },
    rText: {
        color: COLORS.lightBlue,
        fontWeight: 'bold',
    },
    inputContainer: {
        width: "100%",
        height: 40,
        borderColor: COLORS.black,
        borderWidth: 1,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: 22
    },
    input: {
        width: "100%"
    },
    eyeIcon: {
        position: "absolute",
        right: 12
    },
    button: {
        paddingBottom: 5,
        paddingVertical: 5,
        borderColor: COLORS.blue,
        borderWidth: 1,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default Login;
