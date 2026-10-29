import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { register, getTokens } from "../api/client";

const inputClass =
    "w-full rounded-lg border border-white/10 bg-field px-3 py-2.5 text-base text-white placeholder:text-slate-600 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

const labelClass =
    "text-xs font-medium uppercase tracking-widest text-slate-400";

const RegisterPage = () => {

    const [emailInput, setEmailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [confirmPasswordInput, setConfirmPasswordInput] = useState("");

    const { login, authError, loading, setAuthError, setLoading } = useAuth();

    const navigate = useNavigate();


    const handleRegister = async (e: React.SubmitEvent<HTMLFormElement>, email: string, password: string, confirmPassword: string) => {
        e.preventDefault();
        setLoading(true);

        if (password !== confirmPassword) {
            setAuthError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const data = await register( {email, password} );
            const tokens = await getTokens( {email: email, password: password} );
            await login(tokens, data.email);
            navigate('/dashboard');
        } catch (e: any) {
            setAuthError(e.message || 'Something went wrong!');
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="relative flex h-screen items-center justify-center overflow-hidden bg-canvas px-4 font-sans">
            {/* Ambient indigo glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(129,140,248,0.16),transparent)]" />

            <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/[0.07] bg-surface p-6 shadow-2xl shadow-black/60 sm:p-8">
                {/* Accent line on card edge */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />

                <div className="mb-8 text-center">
                    <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Join Collab and start building together
                    </p>
                </div>

                <form onSubmit={(e) => handleRegister(e, emailInput, passwordInput, confirmPasswordInput)} className="flex flex-col gap-5">

                    {/* Email */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className={labelClass}>Email</label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            required
                            placeholder="you@example.com"
                            className={inputClass}
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className={labelClass}>Password</label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            placeholder="Create a password"
                            className={inputClass}
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                        />
                    </div>

                    {/* Confirm password */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="confirm-password" className={labelClass}>Confirm Password</label>
                        <input
                            id="confirm-password"
                            type="password"
                            autoComplete="new-password"
                            required
                            placeholder="Repeat your password"
                            className={inputClass}
                            value={confirmPasswordInput}
                            onChange={(e) => setConfirmPasswordInput(e.target.value)}
                        />
                    </div>

                    {authError && (
                        <p
                            role="alert"
                            className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-300"
                        >
                            {authError}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-accent py-2.5 font-display font-semibold text-canvas shadow-lg shadow-accent/20 transition-all hover:bg-accent-hover hover:shadow-accent/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                        disabled={loading}
                    >
                        {loading ? <span>...</span> : <span>Register</span>}
                    </button>

                    <span className="mt-4 text-white/70 flex items-center gap-1">
                        Already have an account? <Link to="/login" className="font-medium text-accent hover:text-accent-hover">Login</Link>
                    </span>
                </form>
            </div>
        </div>
    )
}

export default RegisterPage