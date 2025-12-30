import "../assets/webAccountView.css";
import avatar from "../assets/avatar.png";

import TopBar from "../components/TopBar";

export default function WebAccountView() {


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
                                    <input id="username" type="text" />
                                </div>

                                <div className="form-field g-2">
                                    <label htmlFor="email">Email</label>
                                    <input id="email" type="email" />
                                </div>

                                <div className="form-field g-norm">
                                    <label htmlFor="other">Other</label>
                                    <input id="other" type="text" />
                                </div>
                            </form>


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
