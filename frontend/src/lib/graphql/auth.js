export const LOGIN_QUERY = `
  mutation Login($identifier: String!, $password: String!, $role: String) {
    login(identifier: $identifier, password: $password, role: $role) {
      token
      user {
        id
        name
        email
        phone
        role
      }
    }
  }
`;

export const SIGNUP_QUERY = `
  mutation Signup($name: String!, $email: String, $phone: String, $password: String!, $role: String) {
    signup(name: $name, email: $email, phone: $phone, password: $password, role: $role) {
      token
      user {
        id
        name
        email
        phone
        role
      }
    }
  }
`;

export const SEND_OTP_MUTATION = `
  mutation SendOTP($identifier: String!) {
    sendOTP(identifier: $identifier) {
      success
      message
      otp
    }
  }
`;

export const RESET_PASSWORD_MUTATION = `
  mutation ResetPassword($identifier: String!, $otp: String!, $newPassword: String!) {
    resetPassword(identifier: $identifier, otp: $otp, newPassword: $newPassword) {
      success
      message
    }
  }
`;

export const ME_QUERY = `
  query Me {
    me {
      id
      name
      email
      phone
      role
    }
  }
`;

export const BUSINESS_LOGIN_QUERY = `
  mutation BusinessLogin($identifier: String!, $password: String!) {
    businessLogin(identifier: $identifier, password: $password) {
      token
      business {
        id
        companyName
        email
        phone
        businessType
      }
    }
  }
`;

export const BUSINESS_SIGNUP_QUERY = `
  mutation BusinessSignup($companyName: String!, $email: String, $phone: String, $password: String!, $businessType: String!, $city: String!, $state: String!, $pinCode: String!, $gstNumber: String) {
    businessSignup(
      companyName: $companyName
      email: $email
      phone: $phone
      password: $password
      businessType: $businessType
      city: $city
      state: $state
      pinCode: $pinCode
      gstNumber: $gstNumber
    ) {
      token
      business {
        id
        companyName
        email
        phone
        businessType
        address {
          city
          state
          pinCode
        }
        isVerified
      }
    }
  }
`;
