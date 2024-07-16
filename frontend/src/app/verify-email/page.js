"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifyEmail() {
    const [otp, setOtp] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId');

    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/user/verify', { userId, otp });
            alert('Email verified successfully!');
            router.push('/login');
        } catch (error) {
            alert(error.response.data.error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-0 text-center">Verify Email</h2>
                <form onSubmit={handleVerifyEmail}>
                    <div className="mb-6">
                        <label className="block text-gray-700">OTP</label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        Verify Email
                    </button>
                </form>
            </div>
        </div>
    );
}
