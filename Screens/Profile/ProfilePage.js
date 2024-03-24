import React, { useState } from "react";
import {
  View,
  Button,
  Image,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAtom } from "jotai";
import { userIdAtom } from '../userAtom';
import { userNameAtom } from '../userAtom';
import { firebase } from "../../components/firebaseConfig";
import { userDocIdAtom } from '../userAtom';


// Import your avatar images
import avatar1 from "../../assets/Avatars/avatar 1.png";
import avatar2 from "../../assets/Avatars/avatar 2.jpeg";
import avatar3 from "../../assets/Avatars/avatar 3.jpeg";
import avatar4 from "../../assets/Avatars/avatar 4.jpeg";
import avatar5 from "../../assets/Avatars/avatar 5.jpeg";


const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5];
const avatarSize = 150; 
const avatarBorderRadius = 90; 
const avatarOptionSize = 60; 


export function ProfilePage() {
  const navigation = useNavigation();
  const [avatar, setAvatar] = useState(avatars[0]); 
  const [modalVisible, setModalVisible] = useState(false);
  const [userId] = useAtom(userIdAtom);
  const [userName] = useAtom(userNameAtom);
  const nameArray = userName.split(" ");
  const firstName = nameArray[0];
  const [userDocId] = useAtom(userDocIdAtom);
  // Alert.alert("User's ID from login-profile: ", userId);
  // Alert.alert("Username from login-profile: ", userName);
  const changeAvatar = (newAvatar) => {
    setAvatar(newAvatar);
    setModalVisible(false);
  };
  const deleteAccount = () => {
    const user = firebase.auth().currentUser;
    deleteDocument(userDocId)
    user.delete().then(() => {
      Alert.alert('User deleted successfully.');
      navigation.navigate("login"); 
    }).catch((error) => {
      console.error("Error deleting account:", error);
    });
  };
  const deleteDocument = async (documentId) => {
    try {
      await firebase.firestore().collection('users').doc(documentId).delete();
      console.log('Document successfully deleted!');
    } catch (error) {
      console.error('Error removing document: ', error);
    }
  };

  const avatarContainerWidth = avatars.length * (avatarOptionSize + 20); 
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)} testID="avatarButton">
        <Image source={avatar} style={styles.avatar} testID="avatar" />
        <Text style={styles.greetingText}>Hi, {firstName}</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        testID="modal"
      >
        <View style={styles.modalContainer}>
          <ScrollView horizontal={true}>
            <View
              style={[styles.avatarContainer, { width: avatarContainerWidth }]}
            >
              {avatars.map((avatarOption, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => changeAvatar(avatarOption)}
                  testID={`avatarOption${index}`}
                >
                  <Image
                    source={avatarOption}
                    style={[
                      styles.avatarOption,
                      { width: avatarOptionSize, height: avatarOptionSize },
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </Modal>

      <View style={styles.buttonWrapper}>
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => navigation.navigate("changePassword")}
            title="Change Password"
            color="#2f90d8"
            testID="changePasswordButton"
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => navigation.navigate("feedback")}
            title="Feedback"
            color="#2f90d8"
            testID="feedbackButton"
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => navigation.navigate("login")}
            title="Logout"
            color="#2f90d8"
            testID="logoutButton"
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            onPress={deleteAccount}
            title="Delete Account"
            color="#FF0000"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  avatar: {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarBorderRadius,
    borderColor: "black", 
    borderWidth: 2, 
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  avatarContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0)", 
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: -380,
    marginBottom: -10,
  },
  avatarOption: {
    borderRadius: avatarOptionSize / 2,
    marginHorizontal: 5,
  },
  buttonWrapper: {
    marginTop: 50,
    width: 250,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  buttonContainer: {
    marginBottom: 20,
  },
});
