"use client"

import { loadStripe } from '@stripe/stripe-js';
import { CheckoutElementsProvider } from '@stripe/react-stripe-js/checkout';
import CheckoutForm from './CheckoutForm';
import { useAuth } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { ShippingFormInputs, CartItemsType } from '@repo/types';
import useCartStore from '@/stores/cartStore';
const stripe = loadStripe("pk_test_51TRICBSdvRzfdv3WCmKu1cCXV5nG81BOUlqm8DFKOW2ecZcKGpA8Nbs4iZgKvYXBNs3ois9s1WhMMdqeRPEfRH3000T5E9Wbvj");

const fetchClientSecret = async (cart: CartItemsType, token: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_PAYMENT_SEVICE_URL}/sessions/create-checkout-session`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ cart })
        });
        if (!response.ok) {
            const errBody = await response.json().catch(() => ({}));
            console.error("Failed to fetch client secret. Status:", response.status, errBody);
            return null;
        }
        const json = await response.json();
        return json.checkoutSessionClientSecret;
    } catch (error) {
        console.error("Error fetching client secret:", error);
        return null;
    }
}

export default function StripePaymentForm({ shippingForm }: { shippingForm: ShippingFormInputs }) {
    const { cart } = useCartStore()

    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { getToken } = useAuth();

    useEffect(() => {
        getToken().then((token) => {
            if (token) {
                fetchClientSecret(cart, token).then((secret) => {
                    if (secret) {
                        setClientSecret(secret);
                    } else {
                        setError("Failed to create checkout session. Please check backend logs or console.");
                    }
                }).catch((err) => {
                    setError("Failed to fetch checkout session.");
                });
            } else {
                setError("User session token is missing.");
            }
        });
    }, [getToken, cart]);

    if (error) {
        return (
            <div className='text-red-500 font-medium p-4 border border-red-200 rounded bg-red-50'>
                {error}
            </div>
        )
    }

    if (!clientSecret) {
        return (
            <div className=''>Loading...</div>
        )
    }
    return (
        <CheckoutElementsProvider
            stripe={stripe}
            options={{ clientSecret }}
        >
            <CheckoutForm shippingForm={shippingForm} />
        </CheckoutElementsProvider>
    )
}