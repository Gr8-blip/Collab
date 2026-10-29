import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getTokens } from "../api/client";

// Shared input styling so both fields stay identical
const inputClass =
    "w-full rounded-lg border border-white/10 bg-canvas px-3 py-2.5 text-base text-white placeholder:text-slate-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

function LoginPage() {
    const [emailInput, setEmailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const { authError, login, loading, setLoading, setAuthError } = useAuth();

    const navigate = useNavigate();



    const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>, emailInput: string, passwordInput: string) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await getTokens({ email: emailInput, password: passwordInput })
            await login(data, emailInput);
            navigate('/dashboard');
        } catch (e: any) {
            setAuthError(e.message || 'Something went wrong!')
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas px-4 font-sans">
            {/* Ambient indigo glow behind the card */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(129,140,248,0.16),transparent)]" />

            <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/[0.07] bg-surface p-6 shadow-2xl shadow-black/60 sm:p-8">
                {/* Thin accent line on the card's top edge */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />

                <div className="mb-8 text-center">
                    <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Log in to continue to Collab
                    </p>
                </div>

                <form onSubmit={(e) => handleLogin(e, emailInput, passwordInput)} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-xs font-medium uppercase tracking-widest text-slate-400">
                            Your Email
                        </label>
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

                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className="text-xs font-medium uppercase tracking-widest text-slate-400">
                            Your Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            placeholder="Your password"
                            className={inputClass}
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
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
                        {loading ? <span>...</span> : <span>Login!</span>}

                    </button>

                    <span className="mt-4 text-white/70 flex items-center gap-1">
                        Don't have an account? <Link to="/register" className="font-medium text-accent hover:text-accent-hover">Register</Link>
                    </span>
                </form>
            </div>
        </div>
    )
}


export default LoginPage;