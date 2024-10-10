import { useState } from 'react';
import { sendAllEmail } from "../services/userService.jsx";
import { useNavigate } from 'react-router-dom';

function EmailPage() {
    const [asunto, setAsunto] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const navigate = useNavigate();

    const handleSendEmail = async () => {
        try {
            await sendAllEmail({ asunto, descripcion });
            alert('Email enviado correctamente');
            navigate('/');
        } catch (error) {
            console.error('Error al enviar email:', error);
            alert('Error al enviar email');
        }
    };

    return (
        <div style={{maxWidth: '800px', margin: '0 auto', padding: '20px'}}>
            <button
                onClick={() => navigate('/manageReservations')}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    position: 'absolute',
                    top: '80px',
                    left: '10px',
                    padding: '5px',
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                     stroke="currentColor" style={{width: '32px', height: '32px'}}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>


            </button>
            <h1 style={{textAlign: 'center', fontSize: '32px', fontWeight: 'bold', marginBottom: '20px'}}>
                Enviar Email
            </h1>

            <div style={{marginBottom: '30px'}}>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Asunto:</label>
                <input
                    type="text"
                    value={asunto}
                    onChange={(e) => setAsunto(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '10px',
                        fontSize: '16px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        transition: 'border-color 0.3s ease',
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#004080'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#ccc'}
                />
            </div>

            <div style={{marginBottom: '20px'}}>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Descripción:</label>
                <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '10px',
                        fontSize: '16px',
                        height: '150px',
                        resize: 'vertical',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        transition: 'border-color 0.3s ease',
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#004080'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#ccc'}
                />
            </div>

            <button
                onClick={handleSendEmail}
                style={{
                    backgroundColor: '#002855',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    fontSize: '16px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#004080'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#002855'}
            >
                Enviar Email
            </button>
        </div>
    );
}

export default EmailPage;
