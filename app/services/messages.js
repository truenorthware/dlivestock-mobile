const Common = {
  Invalid_params: 'Invalid parameters.',
  Access_denied: 'Access denied.',
  Create_failed: 'Failed to create a new one.',
  Update_failed: 'Failed to update an existing one.',
  Delete_failed: 'Failed to delete an existing one.',
  Create_success: 'A new {{item}} has been successfully created.',
  Update_success: 'Selected {{item}} was successfully updated.',
  Delete_success: '{{item}} was successfully deleted.',
  Undefined_error: 'Something went wrong. Please try again later.',
  Not_found: 'Not found',
  Mapping_success: 'Successful Mapping update.',
  No_document: 'You must select a document',
}

export const CommonMessages = Common

export const SignUpMessages = {
  ...Common,
  Undefined_error: 'Failed to create New Account.',
  Success:
    'A verification link has been sent to your email. If you cannot see the email in your Inbox, please check your Spam folder.',
  Sms_request_error: 'Failed to send verification code.',
  Sms_request_success: 'A 6-digit verification code has been sent via SMS!',
  Sms_verification_success: 'SMS verification successful!',
  Sms_verification_failed: 'Incorrect SMS verification code.',
}

export const VerificationMessages = {
  ...Common,
  Undefined_error: 'Sorry, email verification failed.',
  Invalid_token: 'Invalid verification code! Please return to verification email.',
  Success: 'Your account has been verified successfully.',
  Property_success: 'Property has been successfully updated.',
  Property_input_failed: 'Property update unsuccessful. Please try again.',
  Property_required: 'Please add properties.',
  Geolocation_required: 'Please pick the location of your Property from the map.',
}

export const LoginMessages = {
  ...Common,
  Invalid_credentials: 'Incorrect Email or Password. Please try again.',
  Invalid_token: 'Authorisation Failed.',
  Account_unverified: 'Your email was not verified. Please check your verification email.',
  Account_deactivated: 'Your account has been De-Activated. Please contact Admin.',
}

export const ProfileMessages = {
  ...Common,
  Undefined_error:
    'Something went wrong. Please try again. If problem persists, please contact Admin.',
  Invalid_credentials: 'Password is incorrect.',
  Update_success: 'Your profile was successfully updated.',
  Password_success: 'Password was successfully changed.',
}

export const ComparePriceMessages = {
  ...Common,
  Add_success: 'Prices successfully added.',
  Wrong_select: 'Please select Prices to compare for each company.',
  No_select: 'You must select Prices for each company.',
}

export const FreightMessages = {
  ...Common,
  Invalid_distance: 'Please be sure the from distance is not after the to distance.',
  Duplicate_distance: 'Distance input overlapped or duplicated.',
  No_rates: 'Please add rates to add.',
  Invalid_weight: 'Please input the max weight to restrict.',
}

export const PriceGridMessages = {
  ...Common,
  Invalid_weight: 'Either weight(from) or weight(to) must be selected.',
  Invalid_teeth: 'Either teeth(from) or teeth(to) must be selected.',
  No_grid: 'Please add grids to add.',
}

export const replacePlaceholder = (template, value, placeholder = '{{item}}') => {
  return template.replace(placeholder, value)
}
