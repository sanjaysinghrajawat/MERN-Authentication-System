"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import queryString from "query-string"
import axios from 'axios';

const baseUrl = "http://localhost:8000/api/user"
export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [invalidUser, setInvalidUser] = useState('');
    const [busy, setBusy] = useState(true);
    const [success, setSuccess] = useState(false);
    const router = useRouter()

    const query = useSearchParams()
    const { token, id } = queryString.parse(query.toString());

    const verifyToken = async () => {
        try {
            await axios.get(`${baseUrl}/verify-token?token=${token}&id=${id}`)
            setBusy(false);

        } catch (error) {
            // console.log(error?.response?.data)
            setBusy(false);
            const { data } = error?.response;
            if (!data.success) {
                setInvalidUser(data.error);
            }
        }
    }

    useEffect(() => {
        verifyToken()
    }, [])

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        if (password.trim().length < 8 || password.trim().length > 20) {
            alert("Password must be 8 to 20 charactor long")
            return;
        }

        try {
            const response = await axios.post(`${baseUrl}/reset-password?token=${token}&id=${id}`, { password })
            console.log("response", response)
            setSuccess(true);
            router.push('/reset-password')

        } catch (error) {
            // console.log(error?.response?.data)
            setBusy(false);
            const { data } = error?.response;
            if (!data.success) {
                alert(data.error);
            }
        }
    };

    if (invalidUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                    <h1 className='text-3xl text-red-500 text-center'>{invalidUser}</h1>
                </div>
            </div>
        );
    }

    if (busy) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                    <h1 className='text-3xl text-center'>Wait a moment... verifying reset token</h1>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                    <h1 className='text-3xl text-center'>Password Reset Successfully</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-0 text-center">Reset Password</h2>
                <form onSubmit={handleResetPassword}>
                    <div className="mb-4">
                        <label className="block text-gray-700">New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
}
