import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FeedbackPage from '../FeedbackPage';

describe('<FeedbackPage />', () => {
  it('allows the user to fill the form', () => {
    const { getByTestId } = render(<FeedbackPage />);
    
    // Simulate user selecting a radio button
    const radioButton = getByTestId('radio-opt1');
    fireEvent.press(radioButton);
    
    // Simulate user entering text into the comment field
    const commentField = getByTestId('comment-input');
    fireEvent.changeText(commentField, 'Great service!');
    
    // Check if the radio button and comment field values are updated
    expect(radioButton.props.checked).toBe(true);
    expect(commentField.props.value).toBe('Great service!');
  });

  it('calls the submitFeedback function when the submit button is pressed', () => {
    // Mock the submitFeedback function
    const submitFeedback = jest.fn();

    // Render the FeedbackPage component with the mocked submitFeedback function
    const { getByTestId } = render(<FeedbackPage onSubmit={submitFeedback} />);

    // Simulate user input by selecting a radio button and filling the comment field
    const radioButton = getByTestId('radio-opt1');
    const commentField = getByTestId('comment-input');
    fireEvent.press(radioButton);
    fireEvent.changeText(commentField, 'Great service!');

    // Simulate button press to submit the feedback
    const submitButton = getByTestId('submit-button');
    fireEvent.press(submitButton);

    // Check if the submitFeedback function was called
    expect(submitFeedback).toHaveBeenCalled();
  });
});
