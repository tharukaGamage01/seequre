import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { RadioButton } from "react-native-paper";
import { useAtom } from "jotai";
import { userDocIdAtom } from '../userAtom';
import { firebase } from "../../components/firebaseConfig";

const FeedbackPage = ({ onSubmit }) => {
  const [checked, setChecked] = useState(null); // Initialize checked state to null
  const [text, onChangeText] = useState("");
  const scrollViewRef = useRef();
  const [userDocId] = useAtom(userDocIdAtom);
  const feedbacktxtRef = useRef(null);

  const submitFeedback = async() => {
    try{
        const collectionRef = firebase.firestore().collection('users');
        const documentRef = collectionRef.doc(userDocId);
        const docSnapshot = await documentRef.get();
        const existingData = docSnapshot.data();
        let updatedFBs;
        if (existingData && existingData.feedbacks) {
     
        updatedFBs = {
       ...existingData.feedbacks, 
       [text]: checked 
     };
   } else {
     
    updatedFBs = {
      [text]: checked 
     };
   }
   await documentRef.set({
    ...existingData, 
    feedbacks: updatedFBs 
  });
  console.log("Feedback Submitted:", { rating: checked, comments: text });
   Alert.alert("Feedback Submitted. Thank You."); 
   feedbacktxtRef.current.clear();
    }catch (error){
      console.error("Error sending feedback :", error);
    }
    
  };

  const handleOutsidePress = () => {
    Keyboard.dismiss();
   };

  const handleSubmit = () => {
    // Do something with the feedback data, for example:
    const feedbackData = {
      rating: checked,
      comment: text
    };
    onSubmit(feedbackData); // Call the onSubmit function with feedback data
 };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "android" ? "padding" : "height"}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Feedback</Text>
            <Text style={{ fontSize: 16, textAlign: "center" }}>
              Share your thoughts! Your feedback helps us improve for a better
              experience
            </Text>
          </View>
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>
              How did you feel about the service?
            </Text>
            <View style={styles.radioContainer}>
            // Inside the FeedbackPage component's RadioButton components:
              <RadioButton
                value="opt1"
                status={checked === "opt1" ? "checked" : "unchecked"}
                onPress={() => setChecked("opt1")}
                checked={checked === "opt1"} // Ensure the checked prop is set
                color="#6FCF97"
                testID="radio-opt1"
             />
              <Text style={styles.radioText}> Excellent </Text>
            </View>
            <View style={styles.radioContainer}>
              <RadioButton
                value="opt2"
                status={checked === "opt2" ? "checked" : "unchecked"}
                onPress={() => setChecked("opt2")}
                color="#FFD700"
                testID="radio-opt2"
              />
              <Text style={styles.radioText}> Good </Text>
            </View>
            <View style={styles.radioContainer}>
              <RadioButton
                value="opt3"
                status={checked === "opt3" ? "checked" : "unchecked"}
                onPress={() => setChecked("opt3")}
                color="#FF9F6F"
                testID="radio-opt3"
              />
              <Text style={styles.radioText}> Average </Text>
            </View>
          </View>
          <View style={styles.commentSection}>
            <Text style={{ marginTop: 10, fontSize: 16 }}>
              Additional Comment
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                ref = {feedbacktxtRef}
                style={styles.input}
                multiline
                placeholder="Share your feedback, comments, and suggestions here..."
                onChangeText={(newText) => onChangeText(newText)}
                value={text}
                onFocus={() =>
                  scrollViewRef.current.scrollTo({ y: 200, animated: true })
                }
                testID="comment-input"
              />
              <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                {" "}
                ٠ Characters 1000
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.submitButton}
            testID="submit-button"
            onPress={handleSubmit} // Call handleSubmit function on button press
         >
            <Text style={styles.submitButtonText}>Submit Feedback</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default FeedbackPage;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },

  container: {
    flex: 1,
    padding: 20,
  },

  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 50,
  },

  headerText: {
    fontSize: 32,
  },

  questionContainer: {
    marginBottom: 20,
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
  },

  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  radioText: {
    fontSize: 14,
    marginLeft: 8,
  },

  questionText: {
    fontSize: 16,
    marginBottom: 15,
  },

  commentSection: {
    marginBottom: 10,
  },

  inputContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    marginTop: 20,
    padding: 15,
  },

  input: {
    height: 100,
    width: "100%",
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    color: "#333",
  },

  submitButton: {
    backgroundColor: "#2f90d8",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    marginTop: 10,
  },

  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
});
