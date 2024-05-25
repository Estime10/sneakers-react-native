import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { icons } from '../../constants'
import { TextInput } from 'react-native-gesture-handler'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Validator from 'email-validator'
import { firebaseAuth, firestoreDB } from '../../config/firebase.config'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

const SignupForm = ({ navigation }) => {
  const SignupFormSchema = Yup.object().shape({
    email: Yup.string().email().required('Valid Email', 'Invalid Email'),
    username: Yup.string()
      .required()
      .min(2, 'Username must be at least 6 characters'),
    password: Yup.string()
      .required()
      .min(6, 'Password must be at least 6 characters'),
  })

  const onSignup = async (email, password, username) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password,
        username
      )
      const user = userCredential.user
      await setDoc(doc(firestoreDB, 'users', user.email), {
        owner_uid: user.email,
        email: user.email,
        username: username,
        avatar: icons.TAB_AVATAR,
      })
      navigation.navigate('HomeScreen')
    } catch (error) {
      Alert.alert('Error', error.message)
    }
  }

  return (
    <View style={styles.Wrapper}>
      <Formik
        initialValues={{ email: '', password: '', username: '' }}
        onSubmit={values => {
          onSignup(values.email, values.password, values.username)
        }}
        validationSchema={SignupFormSchema}
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
                placeholder='Email'
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
                    1 > values.username.length || values.username.length > 1
                      ? '#626567'
                      : '#CB3A3A',
                },
              ]}>
              <TextInput
                style={styles.CaptiontextInput}
                placeholderTextColor='#979A9A'
                placeholder='Username'
                autoCapitalize='none'
                textContentType='username'
                autoFocus={true}
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                value={values.username}
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

            <Pressable
              titleSize={20}
              style={styles.Pressable(isValid)}
              onPress={handleSubmit}>
              <Text style={styles.PressableText}>sign up</Text>
            </Pressable>

            <View style={styles.SignUpContainer}>
              <Text style={styles.CaptionTextSignUpQuestion}>
                Already have an account ?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.CaptionTextSignUp}>Log in</Text>
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
    marginTop: 80,
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

export default SignupForm;
