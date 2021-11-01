import React, { useState, useEffect } from "react";

import nutemployee from "./services/nutemployee";
import IUserData from "./types/users";

import logo from "./images/logo.png";

import { Modal } from "./components/Modal";

function App() {
    const arrayUsers: IUserData[] = [];
    const [users, setUsers]: [IUserData[], (users: IUserData[]) => void] = useState(arrayUsers);

    const listAllUsers = () => {
        nutemployee
            .getAll()
            .then((response) => setUsers(response.data))
            .catch((err) => {
                console.error("Ops! an error has occurred" + err);
            });
    }

    useEffect(() => {
        listAllUsers();
    }, []);

    const [modal, setVisibleModal] = useState(false);
    const changeVisibleModal = () => setVisibleModal(modal ? false : true);

    const [alertModal, setVisiblealertModal] = useState(false);
    const changeVisiblealertModal = () => setVisiblealertModal(alertModal ? false : true);

    const [typeAlert, setTypeAlert] = useState("");
    const changeTypeAlert = (type: string) => setTypeAlert(type);


    const objectUser: IUserData = {
        name: "",
        email: "",
        birthDate: "",
        gender: "",
        cpf: ""
    };

    const [inputs, setInputs]: [IUserData, Function] = useState(objectUser);

    const handleChange = (event: { target: { name: any; value: any; }; }) => {
        const name = event.target.name;
        const value = event.target.value;

        setInputs((values: any) => ({ ...values, [name]: value }));
    }

    const [alert, setVisibleAlert]: [string[], Function] = useState([]);

    let validateInput = true;
    let fieldsValidate: Array<any> = [];

    let fieldsRequired = [
        "name",
        "email",
        "birthDate",
        "gender",
        "cpf",
    ];

    let fieldsIgnore = [
        "_id", "startDate", "team",
    ];

    const validateFilds = () => {
        fieldsValidate = [];

        if (Object.keys(inputs).length !== 0) {
            for (let i = 0; i < fieldsRequired.length; i++) {
                Object.entries(inputs).forEach(([key, value]) => {
                    if (!fieldsIgnore.includes(key)) {
                        if (!fieldsRequired.includes(key)) {
                            validateInput = false;
                        }

                        if (fieldsRequired[i] === key) {
                            if (value === '') {
                                fieldsValidate.push(fieldsRequired[i]);
                                validateInput = false;
                            }
                        }
                    }
                });
            }
        } else {
            validateInput = false;
        }
    }

    const createNewRegister = () => {
        validateFilds();

        if (validateInput) {
            setVisibleAlert([]);
            inputs.startDate = String((new Date()).toLocaleDateString());

            nutemployee
                .create(inputs)
                .then((response) => {
                    if (response.status === 201) {
                        listAllUsers();
                        setInputs(objectUser);
                        changeVisibleModal();

                        changeVisiblealertModal();
                        changeTypeAlert("create");
                    }
                })
                .catch((err) => {
                    console.error("Ops! an error has occurred" + err);
                });
        } else {
            setVisibleAlert(fieldsValidate);
        }
    }

    const changeRegister = (id: any) => {
        nutemployee
            .get(id)
            .then((response) => {
                setInputs(response.data);
                changeVisibleModal();
            })
            .catch((err) => {
                console.error("Ops! an error has occurred" + err);
            });
    }

    const changeRegisterSave = (id: any) => {
        if (id) {
            validateFilds();

            if (validateInput) {
                setVisibleAlert([]);

                delete inputs._id

                nutemployee
                    .update(inputs, id)
                    .then((response) => {
                        listAllUsers();
                        setInputs(response.data);
                        changeVisibleModal();

                        changeVisiblealertModal();
                        changeTypeAlert("change")
                    })
                    .catch((err) => {
                        console.error("Ops! an error has occurred" + err);
                    });
            } else {
                setVisibleAlert(fieldsValidate);
            }
        }
    }

    const removeRegister = (id: any) => {
        if (id) {
            if (window.confirm("Are you sure you want to delete this register?")) {
                nutemployee
                    .delete(id)
                    .then((response) => {
                        listAllUsers();
                        changeVisiblealertModal();
                        changeTypeAlert("delete")
                    })
                    .catch((err) => {
                        console.error("Ops! an error has occurred" + err);
                    });
            }
        }
    }

    const cancelRegister = () => {
        setVisibleAlert([]);
        setInputs(objectUser);
        changeVisibleModal()
    }

    const dateFormat = (date: any) => {
        return date.split('-').reverse().join('/');
    }

    return (
        <main>
            <div className="AppContainer">
                <div className="AppContentHeader">
                    <img src={logo} alt="logo" />
                    <button className="AppButton AppButtonPrimary AppButtonLg" onClick={changeVisibleModal}>New Register</button>
                </div>
                <div className="AppContentMask">
                    <div className="Mask"></div>
                </div>
                <div className="AppContent">
                    <div className="AppList">
                        <div className="AppListHeader">
                            <div>Name</div>
                            <div>CPF</div>
                            <div>Birth date</div>
                            <div>Gender</div>
                            <div>Start date</div>
                            <div>Team</div>
                            <div></div>
                        </div>
                        {users.length == 0 &&
                            <h4>
                                No results found.
                            </h4>
                        }
                        {users.map((user, key) => (
                            <div className="AppListGrid" key={key}>
                                <div>
                                    <h1>Name</h1>
                                    <h2><a href="#" onClick={() => changeRegister(user._id)}>{user.name}</a></h2>
                                    <p>{user.email}</p>
                                </div>
                                <div>
                                    <h1>CPF</h1>
                                    <p>{user.cpf}</p>
                                </div>
                                <div>
                                    <h1>Birth Date</h1>
                                    <p>{dateFormat(user.birthDate)}</p>
                                </div>
                                <div>
                                    <h1>Gender</h1>
                                    <p>{user.gender}</p>
                                </div>
                                <div>
                                    <h1>Start date</h1>
                                    <p>{user.startDate}</p>
                                </div>
                                <div>
                                    <h1>Team</h1>
                                    <p>{user.team}</p>
                                </div>
                                <div className="AppButtonRemove"><button className="AppButton AppButtonXs AppButtonDanger" onClick={() => removeRegister(user._id)}>Remove</button></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Modal visible={modal}>
                <div className="AppModalHeader">
                    <h1>New register</h1>
                    <p>Fields marked with (<span className="AppTextDanger">*</span>) are mandatory</p>
                </div>
                <div className="AppModalBody">
                    <div className="AppFormGroup">
                        <label>Name <span className="AppTextDanger">*</span></label>
                        <input type="text" name="name" value={inputs.name || ''} onChange={handleChange}></input>
                    </div>
                    <div className="AppFormGroup">
                        <label>Email <span className="AppTextDanger">*</span></label>
                        <input type="text" name="email" value={inputs.email || ''} onChange={handleChange}></input>
                    </div>
                    <div className="AppFormGroup">
                        <label>Birth date <span className="AppTextDanger">*</span></label>
                        <input type="date" name="birthDate" value={inputs.birthDate || ''} onChange={handleChange}></input>
                    </div>
                    <div className="AppFormGroup">
                        <label>Gender <span className="AppTextDanger">*</span></label>
                        <select name="gender" onChange={handleChange}>
                            <option value="">Select an option</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="AppFormGroup">
                        <label>CPF <span className="AppTextDanger">*</span></label>
                        <input type="text" name="cpf" value={inputs.cpf || ''} onChange={handleChange}></input>
                    </div>
                    <div className="AppFormGroup">
                        <label>Team </label>
                        <select name="team" onChange={handleChange}>
                            <option value="">Select an option</option>
                            <option value="No team">No team</option>
                            <option value="Team junior">Team junior</option>
                            <option value="Team senior">Team senior</option>
                            <option value="Team pleno">Team pleno</option>
                        </select>
                    </div>
                    {alert.length > 0 &&
                        <div className="AppAlertDanger">
                            The fields below are mandatory:<br />
                            <ul>
                                {alert.map((item, key) => {
                                    return <li key={key}>{item}</li>;
                                })}
                            </ul>
                        </div>
                    }
                </div>
                <div className="AppModalBottom">
                    {
                        inputs._id ?
                            <button className="AppButton AppButtonLg AppButtonPrimary" onClick={() => changeRegisterSave(inputs._id)}>Save</button> :
                            <button className="AppButton AppButtonLg AppButtonPrimary" onClick={createNewRegister}>Register</button>
                    }
                    <button className="AppButton AppButtonLg AppButtonDanger" onClick={cancelRegister}>Cancel</button>
                </div>
            </Modal>

            <Modal visible={alertModal}>
                <div className="AppModalBody">
                    <div className="AppModalAlert">
                        {typeAlert === "create" ? "Registration successful!" : ""}
                        {typeAlert === "change" ? "Registration changed successfully!" : ""}
                        {typeAlert === "delete" ? "Registration removed successfully!" : ""}
                    </div>
                </div>

                <div className="AppModalBottom">
                    <button className="AppButton AppButtonLg AppButtonDanger" onClick={changeVisiblealertModal}>Close</button>
                </div>
            </Modal>
        </main>
    );
}

export default App;