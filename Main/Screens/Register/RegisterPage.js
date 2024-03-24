import React, { useState, useRef } from "react";
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import {firebase} from "../../components/firebaseConfig"

const RegisterPage = ({ navigation }) => {
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [phoneno, setPhone] = useState(null);
    const [password1, setPass1] = useState(null);
    const [password2, setPass2] = useState(null);
    const emailInputRef = useRef(null);
    const fullNameRef = useRef(null);
    const password1InputRef = useRef(null);
    const password2InputRef = useRef(null);
    const phoneNoRef = useRef(null);

    const registerUser = async (name, email, phoneno, password1) => {
        try {
            //creating user 
           await firebase.auth().createUserWithEmailAndPassword(email,password1)
           const user =  firebase.auth().currentUser;
           const userId = user.uid;
           createUserCollection(userId,name,email,phoneno);
            Alert.alert('User Successfully Created. Go to Login Page.')
        } catch (error) {
            alert('Error signing up:', error);
        }


    }
    
    //user details storing
    const createUserCollection = async (uid, name, email, phone) => {
    try {
        
        firebase.firestore().collection("users").add({
            name,
            email,
            phone,
            uid
          })

    
    } catch (error) {
        
        throw new Error('Error creating user collection:', error);
        
    }
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, marginHorizontal: 22 }}>
                <View style={{ marginVertical: 10 , marginTop: 50, alignItems: "center"}}>
                    <Text style={styles.title}>Register</Text>
                    <Text style={styles.slogan}>Join SeeQuRe: Where Security Meets Simplicity</Text>
                    
                </View>

                <View style={{ marginBottom: 12 }}>
                    <Text style={styles.subtitle}>Create Account</Text>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Full Name</Text>

                    <View style={{
                        width: "100%",
                        height: 40,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <TextInput
                            ref={fullNameRef}
                            placeholder='Enter your Full Name'
                            placeholderTextColor={COLORS.black}
                            keyboardType='email-address'
                            style={{
                                width: "100%"
                            }}
                            onChangeText={(e)=>{
                                setName(e)
                            }}
                        />
                    </View>
                </View>

                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Email address</Text>

                    <View style={{
                        width: "100%",
                        height: 40,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <TextInput
                            ref={emailInputRef}
                            placeholder='Enter your email address'
                            placeholderTextColor={COLORS.black}
                            keyboardType='email-address'
                            style={{
                                width: "100%"
                            }}
                            onChangeText={(e)=>{
                                setEmail(e)
                            }}
                        />
                    </View>
                </View>

                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Mobile Number</Text>

                    <View style={{
                        width: "100%",
                        height: 40,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingLeft: 22
                    }}>
                        <TextInput
                            placeholder='+94'
                            placeholderTextColor={COLORS.black}
                            keyboardType='numeric'
                            style={{
                                width: "12%",
                                borderRightWidth: 1,
                                borderLeftColor: COLORS.grey,
                                height: "100%"
                            }}
                        />

                        <TextInput
                            ref={phoneNoRef}
                            placeholder='Enter your phone number'
                            placeholderTextColor={COLORS.black}
                            keyboardType='numeric'
                            style={{
                                width: "80%"
                            }}
                            onChangeText={(e)=>{
                                setPhone(e)
                            }}
                        />
                    </View>
                </View>

                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Password</Text>

                    <View style={{
                        width: "100%",
                        height: 40,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <TextInput
                            ref={password1InputRef}
                            placeholder='Enter your password'
                            placeholderTextColor={COLORS.black}
                            secureTextEntry={!isPasswordShown}
                            style={{
                                width: "100%"
                            }}
                            onChangeText={(e)=>{
                                setPass1(e)
                            }}
                        />

                        <TouchableOpacity
                            onPress={() => setIsPasswordShown(!isPasswordShown)}
                            style={{
                                position: "absolute",
                                right: 12
                            }}
                        >
                            {
                                isPasswordShown == true ? (
                                    <Ionicons name="eye-off" size={24} color={COLORS.black} />
                                ) : (
                                    <Ionicons name="eye" size={24} color={COLORS.black} />
                                )
                            }

                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Confirm Password</Text>

                    <View style={{
                        width: "100%",
                        height: 40,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <TextInput
                            ref={password2InputRef}
                            placeholder='Re Enter your password'
                            placeholderTextColor={COLORS.black}
                            secureTextEntry={!isPasswordShown}
                            style={{
                                width: "100%"
                            }}
                            onChangeText={(e)=>{
                                setPass2(e)
                            }}
                        />

                        <TouchableOpacity
                            onPress={() => setIsPasswordShown(!isPasswordShown)}
                            style={{
                                position: "absolute",
                                right: 12
                            }}
                        >
                            {
                                isPasswordShown == true ? (
                                    <Ionicons name="eye-off" size={24} color={COLORS.black} />
                                ) : (
                                    <Ionicons name="eye" size={24} color={COLORS.black} />
                                )
                            }

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

                    <Text>I agree to the terms and conditions</Text>
                </View>

                <Button
                    title="Sign Up"
                    filled
                    onPress={() => registerUser(name, email, phoneno, password1)}
                    style={{
                        marginTop: 10,
                        marginBottom: 4,
                        height: 40,
                    }}
                />

               

                <View style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: 'center',
                    marginVertical: 10
                }}>
                    <Text style={{ fontSize: 16, color: COLORS.black, flex: 0.6, lineHeight: 15, paddingTop: 6 }}>Already have an account ? </Text>
                    <Button title="Login" onPress={() => navigation.navigate("login")} style={{ borderRadius: 0, borderWidth: 0, backgroundColor: 'transparent' }} />
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

export default RegisterPage;

const COLORS = {
    white: "#FFFFFF",
    black: "#222222",
    primary: "#007260",
    secondary: "#39B68D",
    blue: "#2f90d8",
    grey: "#CCCCCC"
}

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
                ...props.style
            }}
            onPress={props.onPress}
        >
            <Text style={{ fontSize: 16, ... { color: textColor } }}>{props.title}</Text>
        </TouchableOpacity>
    )
}



const styles = StyleSheet.create({
    button: {
        paddingBottom: 5,
        paddingVertical: 5,
        borderColor: COLORS.blue,
        borderWidth: 2,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center'
    },

    title: {
        fontSize: 32,
        // fontWeight: 'bold',
        marginVertical: 1,
        color: COLORS.black,
        marginBottom: 10,
        
    },
    slogan: {
        fontSize: 16,
        color: COLORS.black,
        textAlign: 'center',

    },
    subtitle: {
        fontSize: 16,
        color: COLORS.black,
        fontWeight: "bold",
        marginTop: 15 
    },

})


