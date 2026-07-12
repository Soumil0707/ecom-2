"use client"

import { useCheckoutElements, PaymentElement } from "@stripe/react-stripe-js/checkout";
import { ShippingFormInputs } from "@repo/types";
import { useState } from "react";

const CheckoutForm = ({ shippingForm }: { shippingForm: ShippingFormInputs }) => {
    const checkoutState = useCheckoutElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (checkoutState.type !== 'success') {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { checkout } = checkoutState;

            // Update the email address on the Checkout session
            const emailResult = await checkout.updateEmail(shippingForm.email);
            if (emailResult.type === 'error') {
                setError(emailResult.error.message);
                setLoading(false);
                return;
            }

            const completeAddress = {
                line1: shippingForm.address,
                city: shippingForm.city,
                state: 'NY',
                postal_code: '10001',
                country: 'US',
            };

            // Update the shipping address on the Checkout session
            const addressResult = await checkout.updateShippingAddress({
                name: shippingForm.name,
                address: completeAddress
            });
            if (addressResult.type === 'error') {
                setError(addressResult.error.message);
                setLoading(false);
                return;
            }

            // Update the billing address on the Checkout session
            const billingResult = await checkout.updateBillingAddress({
                name: shippingForm.name,
                address: completeAddress
            });
            if (billingResult.type === 'error') {
                setError(billingResult.error.message);
                setLoading(false);
                return;
            }

            // Confirm the Checkout session
            const confirmResult = await checkout.confirm();
            if (confirmResult.type === 'error') {
                setError(confirmResult.error.message);
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    if (checkoutState.type === 'loading') {
        return <div className="text-sm text-gray-500">Loading Checkout...</div>;
    }

    if (checkoutState.type === 'error') {
        return <div className="text-sm text-red-500">Error: {checkoutState.error.message}</div>;
    }

    return (
        <form className="flex flex-col gap-4">
            <PaymentElement options={{ 
                layout: 'accordion',
                fields: {
                    billingDetails: {
                        name: 'never'
                    }
                }
            }} />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
                type="submit"
                disabled={loading}
                onClick={handleClick}
                className="w-full bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 transition-all duration-300 text-white p-2 rounded-lg cursor-pointer flex items-center justify-center gap-2"
            >
                {loading ? "Processing..." : "Pay"}
            </button>
        </form>
    )
}

export default CheckoutForm