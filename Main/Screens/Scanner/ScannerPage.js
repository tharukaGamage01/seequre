import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  Animated,
  Easing,
  TouchableOpacity,
  Modal,
  Linking,
} from "react-native";
import { Camera } from "expo-camera";
import { useFocusEffect, Link } from "@react-navigation/native";
import axios from "axios";
import { useAtom } from "jotai";
// import { userIdAtom } from '../userAtom';
import { userDocIdAtom } from '../userAtom';
import { firebase } from "../../components/firebaseConfig";

export default function ScannerPage({ navigation }) {
  // State variables for camera permission, scanned status, and scanned URL
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedUrl, setScannedUrl] = useState("Not yet scanned");
  // const [userId] = useAtom(userIdAtom);
  const [userDocId] = useAtom(userDocIdAtom);
  const [responseState, setResponseState] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Animated value for the scanning line position
  const lineYPos = useRef(new Animated.Value(-150)).current;
  
  // Request camera permission on component mount
  useEffect(() => {
    const askForCameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    askForCameraPermission();
  }, []);

  const handleRedirect = () => {
    Linking.openURL(scannedUrl);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  // Start the scanning line animation when the scanned state changes
  useEffect(() => {
    if (!scanned) {
      startLineAnimation();
    }
  }, [scanned]);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    setScannedUrl(data);

    try {
      const response = await axios
        .post("https://qr-server-bb897ad1539c.herokuapp.com/model_prediction", {
          url: data,
        })
       
        const pred_result = response.data.prediction;
      
        setIsModalVisible(true);
        setResponseState(response.data);

        const collectionRef = firebase.firestore().collection('users');
        const documentRef = collectionRef.doc(userDocId);
        const docSnapshot = await documentRef.get();
        const existingData = docSnapshot.data();

        let updatedURLs;
         if (existingData && existingData.URLs) {
      
      updatedURLs = {
        ...existingData.URLs, 
        [data]: pred_result 
      };
    } else {
      
      updatedURLs = {
        [data]: pred_result
      };
    }

        await documentRef.set({
          ...existingData, 
          URLs: updatedURLs 
        });
        console.log('Document successfully written with URL prediction!');

    } catch (error) {
      console.error("Error sending scanned URL:", error);
    }
  };

  // Function to start the scanning line animation
  const startLineAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(lineYPos, {
          toValue: 300,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(lineYPos, {
          toValue: -150,
          duration: 0,
          useNativeDriver: false,
        }),
      ])
    ).start();
  };



  // Function to reset the scanner state
  const resetScanner = () => {
    setScanned(false);
    setScannedUrl("Not yet scanned");
    // Restart the scanning line animation
    startLineAnimation();
  };

  // Effect hook to handle focus effect
  useFocusEffect(
    React.useCallback(() => {
      setScanned(false);
      setScannedUrl("Not yet scanned");
      startLineAnimation();
      return () => {
        lineYPos.stopAnimation();
      };
    }, [])
  );

  // Render UI based on camera permission status
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>No access to camera</Text>
        <Button
          title={"Allow Camera"}
          onPress={() => askForCameraPermission()}
        />
      </View>
    );
  }

  // Render camera view, scanning line, scanned URL, and scan again button
  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.barcodebox}>
          <Animated.View
            style={[
              styles.scanningLine,
              {
                transform: [{ translateY: lineYPos }],
              },
            ]}
          />
        </View>
      </Camera>
      <Text style={styles.maintext}>{scannedUrl}</Text>
      {scanned && (
        <Button title={"Scan again?"} onPress={resetScanner} color="tomato" />
      )}
      {responseState && (
        <Modal visible={isModalVisible} transparent={true} animationType="fade">
          <TouchableOpacity disabled={true} style={styles.containerBox}>
            <View style={styles.modal}>
              <View style={styles.textView}>
                <Text style={styles.text}>{responseState.prediction}</Text>
                {responseState.prediction === "SAFE" ? (
                  <Text style={styles.text}>
                    This URL seems to be {responseState.prediction}. Do you want
                    to continue ?
                  </Text>
                ) : (
                  <Text style={styles.text}>
                    This URL seems to be {responseState.prediction}. Do you want
                    to continue ?
                  </Text>
                )}
              </View>
              <View style={styles.buttonView}>
                <TouchableOpacity
                  style={styles.touchableOpacity}
                  onPress={handleModalClose}
                >
                  {responseState.prediction === "SAFE" ? (
                    <Text style={[styles.text, { color: "black" }]}>
                      Cancel
                    </Text>
                  ) : (
                    <Text style={[styles.text, { color: "red" }]}>Block</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.touchableOpacity}
                  onPress={handleRedirect}
                >
                  <Text style={[styles.text, { color: "green" }]}>
                    Continue
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
}

// Stylesheet
const styles = StyleSheet.create({
  containerBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  textView: {
    alignItems: "center",
  },

  text: {
    margin: 5,
    fontSize: 16,
    fontWeight: "bold",
  },

  buttonView: {
    width: "100%",
    flexDirection: "row",
  },

  touchableOpacity: {
    flex: 1,
    paddingVertical: 5,
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    width: 300,
    height: 300,
    overflow: "hidden",
    borderRadius: 30,
  },
  maintext: {
    fontSize: 16,
    margin: 20,
    fontWeight: "bold", // Make the scanned URL bold
  },
  barcodebox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  scanningLine: {
    position: "absolute",
    width: "100%",
    height: 3,
    backgroundColor: "green",
  },
});
