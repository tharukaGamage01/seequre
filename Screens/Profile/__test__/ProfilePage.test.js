import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import {ProfilePage} from '../ProfilePage';
import { useNavigation } from '@react-navigation/native';

// Mock useNavigation
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
}));

describe('ProfilePage', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<ProfilePage />);
    const avatar = getByTestId('avatar');
    // console.log('Avatar:', avatar);
    expect(avatar).toBeTruthy();
  });

  it('navigates to changePassword screen', () => {
    // Mock navigate function
    useNavigation.mockReturnValue({ navigate: jest.fn() });

    const { getByText } = render(<ProfilePage />);
    const button = getByText('Change Password');
    // console.log('Button:', button);
    fireEvent.press(button);
    expect(useNavigation().navigate).toHaveBeenCalledWith('changePassword');
  });

  it('navigates to feedback screen', () => {
    // Mock navigate function
    useNavigation.mockReturnValue({ navigate: jest.fn() });

    const { getByText } = render(<ProfilePage />);
    const button = getByText('Feedback');
    // console.log('Button:', button);
    fireEvent.press(button);
    expect(useNavigation().navigate).toHaveBeenCalledWith('feedback');
  });

  it('navigates to login screen', () => {
    // Mock navigate function
    useNavigation.mockReturnValue({ navigate: jest.fn() });

    const { getByText } = render(<ProfilePage />);
    const button = getByText('Logout');
    // console.log('Button:', button);
    fireEvent.press(button);
    expect(useNavigation().navigate).toHaveBeenCalledWith('login');
  });
});
