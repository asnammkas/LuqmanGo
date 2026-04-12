import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CheckoutForm from '../components/storefront/CheckoutForm';

describe('CheckoutForm Component', () => {
  const defaultProps = {
    formData: { name: '', email: '', phone: '', address: '', orderNotes: '', paymentMethod: 'Cash on Delivery' },
    setFormData: vi.fn(),
    errors: {},
    isSubmitting: false,
    onSubmit: vi.fn(e => e.preventDefault()),
    showForm: true,
    setShowForm: vi.fn(),
  };

  it('renders all required form fields', () => {
    render(<CheckoutForm {...defaultProps} />);
    
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Shipping Address/i)).toBeInTheDocument();
    expect(screen.getByText(/Payment Method/i)).toBeInTheDocument();
  });

  it('displays error messages when passed in props', () => {
    const propsWithErrors = {
      ...defaultProps,
      errors: {
        name: 'Name is required',
        email: 'Invalid email',
      }
    };
    render(<CheckoutForm {...propsWithErrors} />);
    
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  it('calls setFormData when input values change', () => {
    render(<CheckoutForm {...defaultProps} />);
    
    const nameInput = screen.getByLabelText(/Full Name/i);
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    
    expect(defaultProps.setFormData).toHaveBeenCalled();
  });

  it('shows loading state when isSubmitting is true', () => {
    render(<CheckoutForm {...defaultProps} isSubmitting={true} />);
    
    expect(screen.getByText(/Validating Secure Order/i)).toBeInTheDocument();
  });
});
