import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Validator from 'email-validator';
import {
  firebaseAuth,
  firestoreDB,
  storage,
} from '../../config/firebase.config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { icons } from 'react-native-elements'

const LoginForm = ({ navigation }) => {
  const LoginFormSchema = Yup.object().shape({
    email: Yup.string()
      .email()
      .required('Valid Email', 'Invalid Email', value => {
        return Validator.validate(value)
      }),
    password: Yup.string()
      .required()
      .min(6, 'Password must be at least 6 characters'),
  })

  const onLogin = async (email, password) => {
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password).then(
        userCredential => {
          const user = userCredential.user

          const userId = user.email
          setDoc(doc(firestoreDB, 'users', userId), {
            owner_uid: userId,
            email: email,
            avatar: user.photoURL,
          }).then(() => {
            navigation.navigate('HomeScreen')
          })
        }
      )
    } catch (error) {
      Alert.alert(error.message)
    }
  }

  return (
    <View style={styles.Wrapper}>
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={values => {
          onLogin(values.email, values.password)
        }}
        validationSchema={LoginFormSchema}
        validateOnMount={true}>
        {({ handleChange, handleBlur, handleSubmit, values, isValid }) => (
          <>
            <View
              style={[
                styles.InputField,
                {
                  borderColor:
                    values.email.length < 1 || Validator.validate(values.email)
                      ? '#626567'
                      : '#CB3A3A',
                },
              ]}>
              <TextInput
                style={styles.CaptiontextInput}
                placeholderTextColor='#979A9A'
                placeholder='Phone number , Username or Email'
                autoCapitalize='none'
                keyboardType='email-address'
                textContentType='emailAddress'
                autoFocus={true}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
              />
            </View>

            <View
              style={[
                styles.InputField,
                {
                  borderColor:
                    1 > values.password.length || values.password.length > 5
                      ? '#626567'
                      : '#CB3A3A',
                },
              ]}>
              <TextInput
                style={styles.CaptiontextInput}
                placeholderTextColor='#979A9A'
                placeholder='Password'
                autoCapitalize='none'
                secureTextEntry={true}
                autoCorrect={false}
                textContentType='password'
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
              />
            </View>
            <View style={styles.ForgotPassword}>
              <Text style={styles.CaptiontextPassword}>
                Forgot your password?
              </Text>
            </View>

            <Pressable
              titleSize={20}
              style={styles.Pressable(isValid)}
              onPress={handleSubmit}>
              <Text style={styles.PressableText}>Log in</Text>
            </Pressable>

            <View style={styles.SignUpContainer}>
              <Text style={styles.CaptionTextSignUpQuestion}>
                Don't have an account?
              </Text>
              <TouchableOpacity onPress={() => navigation.push('SignupScreen')}>
                <Text style={styles.CaptionTextSignUp}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Formik>
    </View>
  )
}

const styles = StyleSheet.create({
  Wrapper: {
    marginTop: 80,
  },
  InputField: {
    borderRadius: 4,
    padding: 10,
    borderColor: '#626567',
    marginBottom: 20,
    borderWidth: 1,
  },

  CaptiontextInput: {
    color: 'white',
    fontSize: 20,
    textAlign: 'justify',
    overflow: 'hidden',
    padding: 4,
  },
  ForgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 40,
  },
  CaptiontextPassword: {
    color: '#424242',
    fontSize: 14,
  },
  Pressable: isValid => ({
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
    marginBottom: 50,
    backgroundColor: isValid ? '#D0D3D4' : '#000000',
  }),
  PressableText: {
    color: '#212121',
    fontSize: 20,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  SignUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  CaptionTextSignUpQuestion: {
    color: '#979A9A',
    fontSize: 18,
  },
  CaptionTextSignUp: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default LoginForm;
