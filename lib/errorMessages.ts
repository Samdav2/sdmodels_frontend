/**
 * User-friendly error messages
 * Converts technical backend errors into comprehensible messages
 */

export const getErrorMessage = (error: any): string => {
  // If error is already a string, check if it needs translation
  if (typeof error === 'string') {
    return translateError(error);
  }

  // Handle axios error response
  if (error?.response?.data?.detail) {
    return translateError(error.response.data.detail);
  }

  // Handle network errors
  if (error?.message === 'Network Error' || !error?.response) {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }

  // Handle timeout errors
  if (error?.code === 'ECONNABORTED') {
    return 'The request took too long. Please try again.';
  }

  // Handle specific status codes
  if (error?.response?.status) {
    switch (error.response.status) {
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 401:
        return 'Your session has expired. Please log in again.';
      case 403:
        return 'You don\'t have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'This action conflicts with existing data. Please refresh and try again.';
      case 422:
        return 'The data provided is invalid. Please check your input.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Something went wrong on our end. Please try again later.';
      case 503:
        return 'The service is temporarily unavailable. Please try again in a few minutes.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  // Default fallback
  return 'Something went wrong. Please try again.';
};

/**
 * Translate technical error messages to user-friendly ones
 */
const translateError = (message: string): string => {
  const lowerMessage = message.toLowerCase();

  // Authentication errors
  if (lowerMessage.includes('not authenticated') || lowerMessage.includes('unauthorized')) {
    return 'Please log in to continue.';
  }
  if (lowerMessage.includes('invalid credentials') || lowerMessage.includes('incorrect password')) {
    return 'The email or password you entered is incorrect.';
  }
  if (lowerMessage.includes('token') && lowerMessage.includes('expired')) {
    return 'Your session has expired. Please log in again.';
  }

  // Validation errors
  if (lowerMessage.includes('username already exists') || lowerMessage.includes('username') && lowerMessage.includes('taken')) {
    return 'This username is already taken. Please choose another one.';
  }
  if (lowerMessage.includes('email already exists') || lowerMessage.includes('email') && lowerMessage.includes('registered')) {
    return 'An account with this email already exists.';
  }
  if (lowerMessage.includes('required field') || lowerMessage.includes('field is required')) {
    return 'Please fill in all required fields.';
  }
  if (lowerMessage.includes('invalid email')) {
    return 'Please enter a valid email address.';
  }
  if (lowerMessage.includes('password') && lowerMessage.includes('too short')) {
    return 'Password must be at least 8 characters long.';
  }
  if (lowerMessage.includes('passwords do not match')) {
    return 'The passwords you entered don\'t match.';
  }

  // File upload errors
  if (lowerMessage.includes('file too large') || lowerMessage.includes('file size')) {
    return 'The file is too large. Please upload a smaller file.';
  }
  if (lowerMessage.includes('invalid file type') || lowerMessage.includes('file format')) {
    return 'This file type is not supported. Please upload a different file.';
  }

  // Payment errors
  if (lowerMessage.includes('payment') && lowerMessage.includes('failed')) {
    return 'Payment failed. Please check your payment details and try again.';
  }
  if (lowerMessage.includes('insufficient funds')) {
    return 'Insufficient funds. Please add funds to your account.';
  }

  // Permission errors
  if (lowerMessage.includes('permission denied') || lowerMessage.includes('not allowed')) {
    return 'You don\'t have permission to perform this action.';
  }

  // Resource errors
  if (lowerMessage.includes('not found')) {
    return 'The item you\'re looking for doesn\'t exist or has been removed.';
  }
  if (lowerMessage.includes('already exists')) {
    return 'This item already exists. Please try a different one.';
  }

  // Network/Server errors
  if (lowerMessage.includes('network') || lowerMessage.includes('connection')) {
    return 'Connection error. Please check your internet and try again.';
  }
  if (lowerMessage.includes('timeout')) {
    return 'The request took too long. Please try again.';
  }
  if (lowerMessage.includes('server error') || lowerMessage.includes('internal error')) {
    return 'Something went wrong on our end. Please try again later.';
  }

  // If no translation found, return the original message if it's user-friendly
  // Otherwise return a generic message
  if (message.length < 100 && !message.includes('Exception') && !message.includes('Error:')) {
    return message;
  }

  return 'An error occurred. Please try again.';
};

/**
 * Get success message for common actions
 */
export const getSuccessMessage = (action: string): string => {
  const messages: Record<string, string> = {
    'profile_updated': 'Your profile has been updated successfully!',
    'password_changed': 'Your password has been changed successfully!',
    'settings_saved': 'Your settings have been saved!',
    'payment_added': 'Payment method added successfully!',
    'payment_removed': 'Payment method removed successfully!',
    'session_revoked': 'Session has been revoked successfully!',
    'upload_success': 'File uploaded successfully!',
    'model_published': 'Your model has been published!',
    'purchase_complete': 'Purchase completed successfully!',
    'message_sent': 'Your message has been sent!',
    'review_submitted': 'Thank you for your review!',
    'follow_success': 'You are now following this creator!',
    'unfollow_success': 'You have unfollowed this creator.',
  };

  return messages[action] || 'Action completed successfully!';
};
