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
