import React, { useState } from 'react';
import Login from "../Login/Login";
import Register from "../Register/Register";

const Auth: React.FC = () => {
    const [loginRegister, toggleLoginRegister] = useState<boolean>(false);

    return (
        <div>
            {loginRegister ?
                <Register toggle={() => toggleLoginRegister(false)} /> :
                <Login toggle={() => toggleLoginRegister(true)} />
            }
            <div className="login-background-text">
                Programs <br />
                just <br />
                for <br />
                you
            </div>
            <div className="login-preview">
                <div className="login-preview-menu">Programs</div>
            </div>
        </div>
    )
}

export default Auth
