import React from "react";
import { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useLocation } from 'react-router';
import queryString from 'query-string';
import { Spin } from "antd";

import {
    verifySignupAPI
} from 'app/api/auth';



function VerifySignup() {
    //   const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

    const verifySignupToken = queryString.parse(location.search);
    console.log(verifySignupToken);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Create an scoped async function in the hook
        async function verifySignup() {
            let res = await verifySignupAPI(verifySignupToken);
            console.log(res);
            if (res == 'User is created') {
                history.push("/signup/success");
            }
        }
        // Execute the created function directly
        verifySignup();
    }, []);

    // const onFinish = async (values) => {

    // };

    return (
        <div>
            <Spin tip="Đang xác minh Email của bạn..." spinning={true}>
                <div>
                    <p></p>
                </div>
            </Spin>
        </div>

    );
}


export default VerifySignup;
