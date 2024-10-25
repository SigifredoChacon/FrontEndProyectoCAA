import UserRegister from "../components/User/UserRegister.jsx";


function RegisterPage({role}) {
    return (
        <div>
            <UserRegister role={role}/>
        </div>
    );
}

export default RegisterPage;