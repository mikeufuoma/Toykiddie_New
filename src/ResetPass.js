
import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useToast, Icon, Input, Pressable,Image, Spinner } from 'native-base';
import configData from "../Config.json";

var { width, height } = Dimensions.get("window");

const ResetPass = ({route}) => {

  const [show, setShow] = useState(false);
  const { email } = route.params;
  const [view, setView] = useState(false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');


  const handleBackButtonClick = () => {
    navigation.goBack(null);
    return true;
  }


  const navigation = useNavigation();
  const toast = useToast();
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isEnabled = pin.length > 0;
  const isEnabledPass = password.length > 0 && newPassword.length > 0 && password === newPassword;

  const verifyPassword = password === newPassword;

  const changePass = async() => {
    

    setIsLoading(true);
    return  fetch(`${configData.SERVER_URL}/user/change-Password`, {
      method: "put",
      headers: {
        Accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email:email,
        password:password
      }) 
        })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        if(responseJson.status === "success"){
            setIsLoading(false)
            toast.show({
                description: responseJson.message
            })
            return navigation.navigate('Signin');
         }
         if(responseJson.status === "error"){
            setIsLoading(false)
              return  toast.show({
                description: responseJson.message
              })
           }
      })
      .catch((error) => {
          console.error(error);
      })

  }

  const submit = async() => {
    if(isNaN(pin)){ 
      return  toast.show({
        description: "Pin should be a number"
      })
    }


     setIsLoading(true);
    return  fetch(`${configData.SERVER_URL}/user/pin-reset`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        pin:pin,
        email:email
      }) 
        })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        if(responseJson.status === "success"){
            setIsLoading(false)
            toast.show({
                description: responseJson.message
            })
            setView(true);
            return
         }
         if(responseJson.status === "error"){
            setIsLoading(false)
              return  toast.show({
                description: responseJson.message
              })
           }
      })
      .catch((error) => {
          console.error(error);
      })


   }


  return (
    <>
      <SafeAreaView style={[styles.body]}>
        <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#fff" translucent={true} />


        
      {isLoading ? <>
          
        <View style={{
             flex: 1, width: '100%',
             backgroundColor: '#fff',opacity: 0.7,
            justifyContent:'center',
            alignItems:'center' }}>
                 <Image source={require('../assets/images/toykiddieIcon.png')} style={{ resizeMode: 'contain'}} />
                 <Spinner color='#6654A8' style={{fontSize:width/2, marginTop:width/20 }}  />
            </View>
      
         </>
          
          :
        <>  

        <KeyboardAwareScrollView extraHeight={8}
          // resetScrollToCoords={{ x: 0, y: 0 }}
          style={[styles.body]} enableOnAndroid>

          <View style={[styles.containerone]}>

            <View style={[styles.top]}>
              <TouchableOpacity onPress={handleBackButtonClick} style={{ paddingTop: width / 20 }}>
                <Ionicons name={'arrow-back-sharp'} size={width / 15} style={{ color: "#061237" }} />
              </TouchableOpacity>
            </View>

     {view ? <>
        <View style={[styles.bottom]}>
              <View style={{ paddingTop: width / 20 }}>
                    <Text style={[styles.welcomeText]}>Enter new password</Text>


                <View style={styles.inputText}>
                    <View style={{ flexDirection: "row" }}>
                    <Text style={{ alignSelf: 'flex-end', fontSize: width / 30, color: "#6A7187", marginVertical: width / 40 }}>New Password</Text>
                    </View>
                    <Input w={{ base: "100%", md: "25%" }}
                    type={show ? "text" : "password"}
                    style={{ height: width/8}}
                    _focus={{ borderColor: '#000', backgroundColor: '#fff' }}
                    value={password} onChangeText={text => setPassword(text)}
                    InputRightElement={
                        <Pressable onPress={() => setShow(!show)}>
                        <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
                        </Pressable>} placeholder="Create a password" />
                </View>

                <View style={styles.inputText}>
                    <View style={{ flexDirection: "row" }}>
                    <Text style={{ alignSelf: 'flex-end', fontSize: width / 30, color: "#6A7187", marginVertical: width / 40 }}>Confirm Password</Text>
                    </View>
                    <Input w={{ base: "100%", md: "25%" }}
                    type={show ? "text" : "password"}
                    style={{ height: width/8}}
                    _focus={{ borderColor: '#000', backgroundColor: '#fff' }}
                    value={newPassword} onChangeText={text => setNewPassword(text)}
                    InputRightElement={
                        <Pressable onPress={() => setShow(!show)}>
                        <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
                        </Pressable>} placeholder="Create a password" />
                </View>

                <View>
                    <View style={{flexDirection:"row", alignItems: "center", textAlign: "center"}}>
                        {/* <Ionicons name={'ios-lock-closed'} size={width / 18} style={{ color: "#061237", width: "10%" }} /> */}
                        {(!verifyPassword) ? <>
                            <Text style={[styles.subTitle, { width: "90%", color:"red" }]}>
                                Both password does not match.
                                </Text>
                        </> : null}
                    </View>

                    <Pressable disabled={!isEnabledPass} onPress={changePass}>
                        <LinearGradient style={[(isEnabledPass) ? styles.disabledBtn : styles.loginBtn]} colors={isEnabledPass ? ['#6654A8', '#423573'] : ['#DDDFE4', '#DDDFE4']}>
                        <Text style={[(isEnabledPass) ? styles.btnText : styles.btnTextOne]}>Submit</Text>
                        </LinearGradient>
                    </Pressable>
                </View>



                  </View>

            </View>
        </> : <>
        <View style={[styles.bottom]}>

              <View style={{ paddingTop: width / 20 }}>
                    <Text style={[styles.welcomeText]}>Enter 6 Digit Code</Text>
                    <Text style={[styles.subTitle]}>Please enter the code we’ve sent to</Text>
                    <Text style={{fontWeight: "bold", marginBottom:width/10, marginTop:width/80}}>{email}.</Text>

                    <View style={styles.inputText}>

                      <Input w={{ base: "100%", md: "25%" }}
                          type={show ? "text" : "password"}  keyboardType="numeric"
                          _focus={{ borderColor: '#000', backgroundColor: '#fff' }}
                          style={{ height: width/8}}
                          value={pin} onChangeText={text => setPin(text)}
                          InputRightElement={
                              <Pressable onPress={() => setShow(!show)}>
                              <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
                              </Pressable>} placeholder="Enter 6 digit PIN code" />
                      </View>
                  </View>

              <View>
                  {/* <View style={{flexDirection:"row", alignItems: "center", textAlign: "center"}}>
                      <Ionicons name={'ios-lock-closed'} size={width / 18} style={{ color: "#061237", width: "10%" }} />
                      <Text style={[styles.subTitle, { width: "90%" }]}>
                        We need to check each person using ToyKiddies to make sure that exchanging toys is done safely.
                        </Text>
                    </View> */}

                    <Pressable disabled={!isEnabled} onPress={submit}>
                      <LinearGradient style={[(isEnabled) ? styles.disabledBtn : styles.loginBtn]} colors={isEnabled ? ['#6654A8', '#423573'] : ['#DDDFE4', '#DDDFE4']}>
                        <Text style={[(isEnabled) ? styles.btnText : styles.btnTextOne]}>Verify</Text>
                      </LinearGradient>
                    </Pressable>
                </View>

            </View>
        </>}

          </View>

        </KeyboardAwareScrollView>


        </>}

      </SafeAreaView>

    </>
  );
};



const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerone: {
    height: height,
    backgroundColor: "#fff",
    paddingHorizontal: width / 10

  },
  top: {
    width: "100%",
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  bottom: {
    width: "100%",
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom:width/5
  },
  welcomeText: {
    fontSize: width / 15,
    fontWeight: 'bold',
    color: "#061237",
    marginBottom:width/50
  },
  subTitle: {
    color: "#6A7187",
    fontSize: width / 32
  },
  disabledBtn: {
    marginVertical: width / 20,
    backgroundColor: '#DDDFE4',
    width: '100%',
    borderRadius: width / 40,
    padding: width / 35,
    elevation: 5,
  },
  loginBtn: {
    marginVertical: width / 20,
    width: '100%',
    borderRadius: width / 40,
    padding: width / 35,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: width / 25,
    fontWeight: "500",
    marginTop: width / 80
  },
  btnTextOne: {
    color: "#6654A8",
    textAlign: "center",
    fontSize: width / 25,
    fontWeight: "500",
    marginTop: width / 80
  },

});


export default ResetPass;