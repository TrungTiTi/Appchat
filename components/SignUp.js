import React, { useState, useContext } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert, ActivityIndicator,ImageBackground } from 'react-native';

// import environment variables.
import { cometChatConfig } from '../env';
// import Context to get shared data.
import Context from "../context";
// import validator to validate user's information.
import validator from "validator";
// import firebase authentication.
import { auth, createUserWithEmailAndPassword } from "../firebase";

const image = { uri: "https://wallpaperaccess.com/full/245620.jpg" };

const SignUp = () => {
  const { cometChat } = useContext(Context);

  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onFullnameChanged = (fullname) => {
    setFullname(() => fullname);
  };

  const onEmailChanged = (email) => {
    setEmail(() => email);
  };

  const onPasswordChanged = (password) => {
    setPassword(() => password);
  };

  const onConfirmPasswordChanged = (confirmPassword) => {
    setConfirmPassword(() => confirmPassword);
  };

  const generateAvatar = () => {
    // hardcode list of user's avatars for the demo purpose.
    const avatars = [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJx-BvmNvi7c19A1weDQZNnvNnNRTcfMWaoQ&usqp=CAU',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZIpGT0jijtjfW8bfF8SY2jpfrJR0Svxi0DQ&usqp=CAU',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi7G9kJ5bJCS6MqZLpdqFsYarQvO_Bjy50yw&usqp=CAU',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSwese3WMdVTlYe-5ZjU5S8L_gJXpTUKZa5g&usqp=CAU',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOf4hNCvGeBVpxK7iCqSmGHQv6SKimx8CIpg&usqp=CAU'
    ];
    const avatarPosition = Math.floor(Math.random() * avatars.length);
    return avatars[avatarPosition];
  }

  const showMessage = (title, message) => {
    Alert.alert(
      title,
      message
    );
  };

  const isSignupValid = ({ fullname, email, password, confirmPassword }) => {
    if (validator.isEmpty(fullname)) {
      showMessage('Error', 'Please input your full name');
      return false;
    }
    if (validator.isEmpty(email) || !validator.isEmail(email)) {
      showMessage('Error', 'Please input your email');
      return false;
    }
    if (validator.isEmpty(password)) {
      showMessage('Error', 'Please input your password');
      return false;
    }
    if (validator.isEmpty(confirmPassword)) {
      showMessage('Error', 'Please input your confirm password');
      return false;
    }
    if (password !== confirmPassword) {
      showMessage('Error', 'Your confirm password must be matched with your password');
      return false;
    }
    return true;
  };

  const register = () => {
    if (isSignupValid({ fullname, email, password, confirmPassword })) {
      setIsLoading(true);
     
      const userAvatar = generateAvatar();
      
      createUserWithEmailAndPassword(auth, email, password).then((userCrendentials) => {
        if (userCrendentials) {
          const firebaseUid = userCrendentials._tokenResponse.localId;
          
          const authKey = `${cometChatConfig.cometChatAuthKey}`;
         
          const user = new cometChat.User(firebaseUid);
          user.setName(fullname);
          user.setAvatar(userAvatar);

          cometChat.createUser(user, authKey).then(
            user => {
              showMessage('Info', `${userCrendentials.user.email} was created successfully! Please sign in `);
              setIsLoading(false);
            }, error => {
              console.log(error);
              setIsLoading(false);
            }
          )
        }
      }).catch((error) => {
        console.log(error);
        setIsLoading(false);
        showMessage('Error', 'Fail to create you account. Your account might be existed.');
      });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    
      <View style={styles.container}>
        <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <TextInput
          autoCapitalize='none'
          onChangeText={onFullnameChanged}
          placeholder="Full name"
          placeholderTextColor="white"
          style={styles.input}
        />
        <TextInput
          autoCapitalize='none'
          onChangeText={onEmailChanged}
          placeholder="Email"
          placeholderTextColor="white"
          style={styles.input}
        />
        <TextInput
          autoCapitalize='none'
          onChangeText={onPasswordChanged}
          placeholder="Password"
          placeholderTextColor="white"
          secureTextEntry
          style={styles.input}
        />
        <TextInput
          autoCapitalize='none'
          onChangeText={onConfirmPasswordChanged}
          placeholder="Confirm Password"
          placeholderTextColor="white"
          secureTextEntry
          style={styles.input}
        />
        <TouchableOpacity style={styles.register} onPress={register}>
          <Text style={styles.registerLabel}>Register</Text>
        </TouchableOpacity>
        </ImageBackground>
      </View>
    
    
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  image: {
    flex: 1,
    justifyContent: "center"
  },
  input: {
    borderColor: '#ccc',
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    color:'white',
    marginHorizontal: 24,
    marginVertical: 8,
    padding: 12,
   
  },
  register: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    fontSize: 16,
    marginHorizontal: 24,
    marginVertical: 8,
    padding: 16,
  },
  registerLabel: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});

export default SignUp;