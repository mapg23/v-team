import "../assets/webAccountView.css";
import avatar from "../assets/avatar.png";

import TopBar from "../components/TopBar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import { useEffect, useState } from "react";

import UserModel from "../models/UserModel";

export default function WebAccountView() {
    const navigate = useNavigate();
    const { logout, userId, checkLoggedin, isLoggedIn } = useAuth();
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState([]);

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    }

    useEffect(() => {

        // if (!isLoggedIn) {
        //     navigate('/login', { replace: true })

        // }
        // if (!checkLoggedin) {
        //     navigate('/login', { replace: true })
        // }

        const fetchData = async () => {
            console.log(userId);
            if (user.length === 0) {
                setUser(await UserModel.getUserById(userId));
            }
        }
        fetchData();

        if (user.length >= 1) {
            setLoading(false);
        }
    })

    if (loading) return (
        <>
            <h1>Loading...</h1>
        </>
    );

    return (
        <>
            <div className="web-layout">
                <TopBar
                    title="Konto"
                    callback={function () { }}
                    canCallback="no"
                />

                <div className="web-content-wrapper">
                    <div className="web-top-panel">
                        <div className="web-top-panel-left">
                            <div className="web-avatar-container">
                                <img src={avatar} />
                            </div>
                        </div>

                        <div className="web-top-panel-right">

                            <form className="web-form">
                                <div className="form-field g-1">
                                    <label htmlFor="username">Username</label>
                                    <input
                                        id="username"
                                        type="text"
                                        value={user[0].username}
                                    />
                                </div>

                                <div className="form-field g-2">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={user[0].email}
                                    />
                                </div>

                                <div className="form-field g-norm">
                                    <label htmlFor="other">Other</label>
                                    <input id="other" type="text" />
                                </div>
                            </form>

                            <button onClick={handleLogout}>Logga ut</button>
                        </div>

                    </div>

                    <div className="web-bottom-row">

                        <div className="web-bottom-col">
                            <h2 className="web-bottom-title">
                                Payment
                            </h2>
                        </div>

                        <div className="web-bottom-col">
                            <h2 className="web-bottom-title">
                                History
                            </h2>


                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

// return (
//     <>
//         <div className="layout">

//             <TopBar
//                 title="Konto"
//                 callback={handleTopBarCallback}
//                 canCallback="yes"
//             />

//             <div className="content-wrapper">

//                 <div className="Account-info">
//                     <div className="Account-spacer" />
//                     <div className="Account-header">
//                         <h1>Aktiv betalningsmetod</h1>

//                         <div className="payment-method" onClick={handlePaymentMethod}>
//                             <div className="payment-left">
//                                 <span className="payment-icon"><CreditCard /></span>
//                                 <span className="payment-name">Metods namn här</span>
//                             </div>

//                             <span className="payment-arrow">›</span>
//                         </div>
//                     </div>

//                     <div className="Account-body">
//                         <div className="details-card">
//                             <div>
//                                 <h1>Ditt saldo <Wallet /></h1>
//                             </div>

//                             <div className="details-card-saldo">
//                                 <p>123 000:-</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="account-buttons">
//                     <div className="account-buttons-body">
//                         <button className="logout-button" onClick={handleAddBalanceMethod}>Lägg till i saldo</button>
//                         <button className="logout-button">Logout</button>
//                     </div>
//                 </div>
//             </div>


//             <div className="navigation">
//                 <Navigation />
//             </div>
//         </div>


//     </>
// );
// }
