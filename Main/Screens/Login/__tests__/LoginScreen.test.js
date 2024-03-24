import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import Login from '../LoginScreen';

describe('<Login />', () => {
  it('updates state when user types in email input', () => {
    const { getByTestId } = render(<Login />);
    const emailInput = getByTestId('email-input');

    fireEvent.changeText(emailInput, 'test@example.com');

    // Check if the state has been updated
    expect(emailInput.props.value).toBe('test@example.com');
  });

  it('updates state when user types in password input', () => {
    const { getByTestId } = render(<Login />);
    const passwordInput = getByTestId('password-input');

    fireEvent.changeText(passwordInput, 'password123');

    // Check if the state has been updated
    expect(passwordInput.props.value).toBe('password123');
  });
});
