// src/auth/cognito.js
import { cognitoConfig } from './config';
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails
} from 'amazon-cognito-identity-js';

const userPool = new CognitoUserPool({
  UserPoolId: cognitoConfig.UserPoolId,
  ClientId: cognitoConfig.ClientId
});

// Core Authentication Functions
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();
    
    if (!cognitoUser) {
      reject(new Error('No user found'));
      return;
    }

    cognitoUser.getSession((err, session) => {
      if (err) {
        reject(err);
        return;
      }
      // Attach additional user attributes
      cognitoUser.getUserAttributes((err, attributes) => {
        if (!err) {
          cognitoUser.attributes = {};
          attributes.forEach(attr => {
            cognitoUser.attributes[attr.Name] = attr.Value;
          });
        }
        cognitoUser.session = session;
        resolve(cognitoUser);
      });
    });
  });
};

export const signUp = (email, password, attributes = {}) => {
  const attributeList = Object.entries({
    email,
    ...attributes
  }).map(([key, value]) => new CognitoUserAttribute({
    Name: key,
    Value: value
  }));

  return new Promise((resolve, reject) => {
    userPool.signUp(email, password, attributeList, null, (err, result) => {
      err ? reject(err) : resolve({
        user: result.user,
        userConfirmed: result.userConfirmed
      });
    });
  });
};

export const signIn = (email, password) => {
  const authDetails = new AuthenticationDetails({
    Username: email,
    Password: password
  });

  const cognitoUser = new CognitoUser({
    Username: email,
    Pool: userPool
  });

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (session) => {
        cognitoUser.session = session;
        resolve(cognitoUser);
      },
      onFailure: reject,
      newPasswordRequired: (userAttributes) => {
        resolve({ requiresNewPassword: true, userAttributes });
      }
    });
  });
};

export const signOut = () => {
  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser) {
    cognitoUser.signOut();
  }
  return Promise.resolve();
};

// Verification & Recovery Functions
export const verifyAccount = (email, code) => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool
    });
    
    cognitoUser.confirmRegistration(code, true, (err, result) => {
      err ? reject(err) : resolve(result);
    });
  });
};

export const resendVerificationCode = (email) => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool
    });
    
    cognitoUser.resendConfirmationCode((err, result) => {
      err ? reject(err) : resolve(result);
    });
  });
};

export const forgotPassword = (email) => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool
    });
    
    cognitoUser.forgotPassword({
      onSuccess: resolve,
      onFailure: reject
    });
  });
};

export const resetPassword = (email, code, newPassword) => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool
    });
    
    cognitoUser.confirmPassword(code, newPassword, {
      onSuccess: resolve,
      onFailure: reject
    });
  });
};

// Helper Functions
export const getSession = async () => {
  const user = await getCurrentUser();
  return user.session;
};

export const getIdToken = async () => {
  const session = await getSession();
  return session.getIdToken().getJwtToken();
};