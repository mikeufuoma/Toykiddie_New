import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, StackActions } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useToast, Icon, Input, Pressable,Spinner } from 'native-base';
import configData from "../Config.json";
import Ionicons from 'react-native-vector-icons/Ionicons';

var { width } = Dimensions.get("window");

const ForgottenPass = () => {

  const [show, setShow] = useState(false);
  const navigation = useNavigation();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isEnabled = email.length > 0;

  const handleBackButtonClick = () => {
    navigation.goBack(null);
    return true;
  }


  const resetPass = async() => {

    setIsLoading(true);

   return  fetch(`${configData.SERVER_URL}/user/forgotten-password`, {
    method: "put",
    headers: {
      Accept: "application/json",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      email
    }) 
      })
    .then((response) => response.json())
    .then((responseJson) => {
          console.log(responseJson)
          
          if(responseJson.status === "success"){
                setIsLoading(false);
                return navigation.navigate('ResetPass', {
                    email:email
                  });
             }
             if(responseJson.status === "error"){
                 toast.show({
                   description: responseJson.message
                  })
                  return setIsLoading(false);
             }
        })
        .catch((error) => {
            console.error(error);
            setIsLoading(false);
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
        <View style={[styles.containerone]}>


         
        <View style={[styles.top]}>
              <TouchableOpacity onPress={handleBackButtonClick} style={{ paddingTop: width / 20 }}>
                <Ionicons name={'arrow-back-sharp'} size={width / 15} style={{ color: "#061237" }} />
              </TouchableOpacity>
            </View>



          <View style={{ paddingVertical: width / 10 }}>
            <Text style={[styles.welcomeText]}>Reset Password</Text>
          </View>

          <View style={[styles.middle]}>

            <Text style={{ alignSelf: 'flex-start', fontSize: width / 30, color: "#6A7187", marginVertical: width / 40 }}>Enter your email</Text>
            <Input w={{ base: "100%", md: "25%" }} 
              _focus={{ borderColor: '#000', backgroundColor: '#fff' }}
              style={{ height: width/8}}
              placeholder="Enter your email address"
              value={email} onChangeText={text => setEmail(text)} />
          </View>

          <View style={[styles.bottom]}>

            <TouchableOpacity onPress={resetPass} disabled={!isEnabled}>
              <LinearGradient style={[(isEnabled) ? styles.disabledBtn : styles.loginBtn]} colors={(isEnabled) ? ['#6654A8', '#423573'] : ['#DDDFE4', '#DDDFE4']}>
                <Text style={[(isEnabled) ? styles.btnText : styles.btnTextOne]}>Submit</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Signin')} style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={{ alignSelf: 'flex-end', fontSize: width / 30, color: "#000", marginVertical: width / 40 }}>I remember password now</Text>
              <Text style={{ fontSize: width / 30, color: "#FD6562", marginVertical: width / 40, fontWeight: "bold" }}> Signin </Text>
            </TouchableOpacity>

          </View>










        </View>

        </>}

      </SafeAreaView>

    </>
  );
};



const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  containerone: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: width / 10

  },
  image: {
    width: 200, height: 200, borderRadius: 250 / 2
  },
  top: {
    width: "100%",
    height: '10%',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  middle: {
    width: "100%",
    height: 'auto',
    marginVertical: width / 20
  },
  bottom: {
    width: "100%",
    marginTop: width / 5
  },
  welcomeText: {
    fontSize: width / 15,
    fontWeight: 'bold',
    color: "#061237"
  },
  subTitle: {
    color: "#6A7187",
    fontSize: width / 30,
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


export default ForgottenPass;