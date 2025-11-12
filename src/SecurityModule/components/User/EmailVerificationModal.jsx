import React, { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';
import { verifyEmailCode, resendVerificationCode } from '../../services/userService.jsx';

function EmailVerificationModal({ isOpen, cedulaCarnet, correoEmail, onVerified }) {
    const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState(null);

    const inputsRef = useRef([]);

    const focusInput = (index) => {
        const input = inputsRef.current[index];
        if (input) input.focus();
    };

    useEffect(() => {
        if (isOpen) {
            focusInput(0);
        }
    }, [isOpen]);

    const handleChangeDigit = (index, value) => {
        setError(null);

        if (!/^\d?$/.test(value)) return;

        const newDigits = [...codeDigits];
        newDigits[index] = value;
        setCodeDigits(newDigits);

        if (value && index < newDigits.length - 1) {
            focusInput(index + 1);
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace') {
            if (codeDigits[index]) {
                const newDigits = [...codeDigits];
                newDigits[index] = '';
                setCodeDigits(newDigits);
            } else if (index > 0) {
                focusInput(index - 1);
                const newDigits = [...codeDigits];
                newDigits[index - 1] = '';
                setCodeDigits(newDigits);
            }
        }

        if (e.key === 'ArrowLeft' && index > 0) {
            focusInput(index - 1);
        }
        if (e.key === 'ArrowRight' && index < codeDigits.length - 1) {
            focusInput(index + 1);
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (!text) return;

        const newDigits = [...codeDigits];
        for (let i = 0; i < 6; i++) {
            newDigits[i] = text[i] || '';
        }
        setCodeDigits(newDigits);

        const lastIndex = Math.min(text.length - 1, 5);
        focusInput(lastIndex >= 0 ? lastIndex : 0);
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setError(null);

        const code = codeDigits.join('');
        if (code.length !== 6) {
            setError('Ingresa los 6 dígitos del código');
            return;
        }

        setLoading(true);
        try {
            await verifyEmailCode(cedulaCarnet, code);
            Swal.fire({
                title: 'Correo verificado',
                text: 'Tu cuenta ha sido activada correctamente',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
            });
            onVerified();
        } catch (err) {
            const msg = err?.response?.data?.message || 'Error al verificar el código';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError(null);
        setResending(true);
        try {
            await resendVerificationCode(cedulaCarnet);
            Swal.fire({
                title: 'Código reenviado',
                text: `Hemos enviado un nuevo código a ${correoEmail}`,
                icon: 'info',
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (err) {
            const msg = err?.response?.data?.message || 'Error al reenviar el código';
            setError(msg);
        } finally {
            setResending(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm flex justify-center items-center p-3">
            <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-slate-200">

                <div className="bg-gradient-to-r from-pantone-blue to-pantone-blue/90 px-6 py-5">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-2xl font-extrabold text-white text-center">
                            Verifica tu correo
                        </h3>
                        <div className="text-lg text-blue-100 text-center">
                            Enviamos un código a:
                            <span className="block font-semibold mt-1 break-words">
                                {correoEmail}
                            </span>
                        </div>
                    </div>
                </div>


                <form onSubmit={handleVerify} className="px-5 py-6 space-y-6">
                    <p className="text-base text-slate-600 text-center">
                        Ingresa el código de 6 dígitos que recibiste en tu correo electrónico.
                    </p>

                    <div
                        className="flex justify-center gap-3"
                        onPaste={handlePaste}
                    >
                        {codeDigits.map((digit, idx) => (
                            <input
                                key={idx}
                                ref={(el) => (inputsRef.current[idx] = el)}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChangeDigit(idx, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(idx, e)}
                                className="
                                    w-12 h-14 text-2xl
                                    text-center font-semibold
                                    rounded-xl border border-slate-300 bg-white
                                    shadow-sm focus:border-pantone-blue focus:ring-2 focus:ring-pantone-blue/30
                                    outline-none
                                "
                                aria-label={`Dígito ${idx + 1} del código`}
                            />
                        ))}
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                            <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <p className="text-sm text-red-700 font-medium">
                                {error}
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col gap-4 items-center">
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={resending}
                            className="text-sm font-medium text-pantone-blue hover:text-pantone-blue/80 disabled:text-slate-400"
                        >
                            {resending ? 'Reenviando código…' : '¿No recibiste el código? Reenviar código'}
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-pantone-blue px-6 py-3
                                       text-base font-semibold text-white shadow-md
                                       hover:bg-pantone-blue/90 disabled:bg-slate-300"
                        >
                            {loading ? 'Verificando…' : 'Verificar correo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EmailVerificationModal;
