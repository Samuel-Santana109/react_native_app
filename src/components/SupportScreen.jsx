import React, {useState, useEffect} from 'react';
import { View, Text, TouchableOpacity,
  Keyboard, TextInput, StyleSheet, ActivityIndicator, 
  KeyboardAvoidingView,Platform, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from "react-native-toast-notifications";
import { sendEmail } from '../api/index'


function SupportScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  useEffect(() => {
    getUserFromStorage()
      .then((userData) => {
        setUser(userData);
      })
      .catch((error) => {
        console.error('Erro ao buscar usuário:', error);
      });
  }, []);

  

  const getUserFromStorage = async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      
      if (userJson !== null) {
        const user = JSON.parse(userJson);
        console.log("user", user)
        return user;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Erro ao buscar usuário do AsyncStorage:', error);
      return null;
    }
  };
  const handleSend = async () => {    
    if (!message)
      return true
    setIsLoading(true);
    try {      
      const result = await sendEmail(user.displayname, user.email, message);
      toast.show("Inviato con successo",{
        placement: "top"
      });
      setMessage('');
      console.log("RESULT", result)
    } catch (error) {
      toast.show("Errore durante l'invio",{
        placement: "top"
      });
      console.log("error send email", error)
      throw error;
    } finally {
      setIsLoading(false);
    }
    
    
  };

  const dismissKeyboard = () => {

    Keyboard.dismiss(); 

  }
  
    
  
  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{fontFamily: "DMSans_700Bold", fontSize: 25}}>Sostegno agli studenti</Text>
          <View style={{padding:15}}>
            <Text style={{ textAlign: 'center', textAlignVertical: 'center', fontFamily: 'DMSans_400Regular', }}>
              Siamo qui per aiutarvi! Se avete domande, si prega di sapere che risponderemo entro un massimo di 48 ore. I nostri orari di assistenza sono dal lunedì al venerdì dalle 09:00 alle 19:00.
            </Text>
          
            
              <TextInput
                multiline={true}
                onSubmitEditing={Keyboard.dismiss}
                placeholder="Inserisci il tuo messaggio..."
                numberOfLines={6}
                value={message}
                onChangeText={setMessage}    
                style={styles.textInputArea}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleSend} disabled={isLoading}>
                  <View
                    style={[
                      styles.loginButton,
                      isLoading && styles.loadingButton,
                    ]}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="white" style={styles.loadingIndicator} />
                    ) : (
                      <Text style={styles.loginButtonText}>Inviare</Text>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            

            
          </View>      
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInputArea:{
    borderWidth: 1, 
    borderColor: "#ccc", 
    borderRadius: 20, 
    textAlignVertical: 'top', 
    paddingTop: 10, 
    paddingLeft: 10, 
    backgroundColor: "white"
  },
  buttonContainer: {
    marginTop: 5,   
    alignItems: "center",
  },
  loginButton: {
    margin: 10,
    width: 280,
    height: 50,
    backgroundColor: "#4b7350",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,    
  },

  loadingButton: {
    backgroundColor: "#999", 
    margin: 10,
    paddingVertical: 5,
  },

  loginButtonText: {
    fontFamily: 'RobotoMedium',
    color: "white",
    fontSize: 16,
  },
  loadingIndicator: {
    width: 40,
    height: 30,
  },

})
export default SupportScreen;