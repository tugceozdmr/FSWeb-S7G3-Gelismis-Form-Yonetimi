import React, { useState, useEffect } from "react";
import * as yup from "yup";
import axios from "axios";


const schema = yup.object().shape({
    isimSoyisim: yup
        .string()
        .required("isimSoyisim gerekli")
        .max(15, "en az 15 karakter kullanılmalı"),

    eMail: yup
        .string()
        .required("eMail gerekli"),

    sifre: yup
        .string()
        .min(5, "en az 5 karakter kullanılmalı")
        .required("sifre gerekli"),

    kutucuk: yup
        .mixed()
        .oneOf([true]),
})

function Form() {
    const [formData, setformData] = useState({
        isimSoyisim: "",
        eMail: "",
        sifre: "",
        kutucuk: "false"
    });

    const [errors, setErrors] = useState({
        isimSoyisim: "",
        eMail: "",
        sifre: "",
        kutucuk: ""
    });

    const [disabled, setDisabled] = useState(true);
    const [gelen, setGelen] = useState([]);

    useEffect(() => {
        schema.isValid(formData).then((valid) => setDisabled(!valid));
    }, [formData]);


    const checkFormErrors = (name, value) => {
        yup
            .reach(schema, name)
            .validate(value)
            .then(() => {

                setErrors({
                    ...errors,
                    [name]: "",
                });
            })
            .catch((err) => {
                setErrors({
                    ...errors,
                    [name]: err.errors[0],
                });
            });
    };

    const handleChange = (event) => {

        const { checked, name, value, type } = event.target;
        const valueToUse = type === "checkbox" ? checked : value;


        checkFormErrors(name, valueToUse);
        setformData({
            ...formData,
            [name]: valueToUse
        })
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const newUser = {
            isimSoyisim: formData.isimSoyisim.trim(),
            eMail: formData.eMail.trim(),
            sifre: formData.sifre.trim(),
            kutucuk: formData.kutucuk
        };
        axios
            .post("https://reqres.in/api/user", newUser)
            .then((res) => {
                console.log(res.data);
                setGelen(res.data);
                console.log(res.data);

                setformData({
                    isimSoyisim: "",
                    eMail: "",
                    sifre: "",
                    kutucuk: "false"
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div>
            <div style={{ color: "red" }}>
                <div>{errors.isimSoyisim}</div>
                <div className="cy-mailError">{errors.eMail}</div>
                <div className="cy-passwordError">{errors.sifre}</div>
                <div>{errors.kutucuk}</div>
            </div>


            <form
                onSubmit={handleSubmit}
                style={{
                    backgroundColor: "#C8F4F9",
                    maxWidth: "600px",
                    margin: "0 auto",
                    padding: "5px 0",
                }}
            >

            <p>
                <label>
                    <span>İsim-Soyisim</span>
                    <input type="text" id="isimSoyisim" name="isimSoyisim" value={formData.isimSoyisim}
                    onChange={handleChange} />
                </label>
            </p>
            <p>
                <label>
                    <span>E-mail</span>
                    <input type="text" id="eMail" name="eMail" value={formData.eMail} 
                    onChange={handleChange}/>
                </label>
            </p>

            <p>
                <label>
                    <span>Sifre</span>
                    <input type="text" id="sifre" name="" sifre value={formData.sifre}
                    onChange={handleChange} />
                </label>
            </p>

            <p>
                <label>
                    <span>Sifre</span>
                    <input type="checkbox" id="kutucuk" name="kutucuk" checked={formData.kutucuk}
                    onChange={handleChange} />
                </label>
            </p>

            <p>
                <label>
                    <input type="submit" disabled={disabled} className="cy-submit " value="Submit" />
                </label>
            </p>
        </form>







        <div>
            {gelen && (
                <div
                    className="cy-uyeDiv"
                    style={{
                        backgroundColor: "#FBE5C8",
                        maxWidth: "600px",
                        margin: "20px auto",
                    }}
                >
                    <pre>
                        {Object.entries(gelen).map(([key, value]) => {
                            return (
                                <div>
                                    {key} : {value.toString()}
                                </div>
                            );
                        })}
                    </pre>
                </div>
            )}
        </div>
        </div>
)}

export default Form;