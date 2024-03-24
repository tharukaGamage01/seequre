import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { ChangePassword } from '../ChangePassword'; 

describe('<ChangePassword />', () => {
    it('shows an error when fields are not filled', async () => {
        const { getByTestId } = render(<ChangePassword userPassword="currentPassword" />);
        const currentPasswordField = getByTestId('current-password-input');
        const newPasswordField = getByTestId('new-password-input');
        const confirmPasswordField = getByTestId('confirm-password-input');
    
        fireEvent.changeText(currentPasswordField, 'currentPassword');
        fireEvent.changeText(newPasswordField, 'newPassword');
        fireEvent.changeText(confirmPasswordField, 'newPassword');
    
        const submitButton = getByTestId('submit-button');
        fireEvent.press(submitButton);
    
        await waitFor(() => {
            expect(currentPasswordField.props.value).toBe('');
            expect(newPasswordField.props.value).toBe('');
            expect(confirmPasswordField.props.value).toBe('');
        });
    });
    
    it('displays success message after changing the password', async () => {
        const { getByTestId, findByText } = render(<ChangePassword userPassword="currentPassword" />);
        const currentPasswordField = getByTestId('current-password-input');
        const newPasswordField = getByTestId('new-password-input');
        const confirmPasswordField = getByTestId('confirm-password-input');
    
        fireEvent.changeText(currentPasswordField, 'currentPassword');
        fireEvent.changeText(newPasswordField, 'newPassword');
        fireEvent.changeText(confirmPasswordField, 'newPassword');
    
        const changePasswordButton = getByTestId('submit-button');
        fireEvent.press(changePasswordButton);
    
        const successMessage = await findByText('Password changed successfully');
        expect(successMessage).toBeTruthy();
    });
    
    it('calls the handleSubmit function when the submit button is pressed', () => {
        const handleSubmit = jest.fn();
        const { getByTestId } = render(<ChangePassword userPassword="currentPassword" onSubmit={handleSubmit} />);
        const currentPasswordField = getByTestId('current-password-input');
        const newPasswordField = getByTestId('new-password-input');
        const confirmPasswordField = getByTestId('confirm-password-input');
    
        fireEvent.changeText(currentPasswordField, 'currentPassword');
        fireEvent.changeText(newPasswordField, 'newPassword');
        fireEvent.changeText(confirmPasswordField, 'newPassword');
    
        const changePasswordButton = getByTestId('submit-button');
        fireEvent.press(changePasswordButton);
    
        expect(handleSubmit).toHaveBeenCalled();
    });
    
});
