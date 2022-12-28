import React from "react";
import { useState, useContext, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useLocation } from 'react-router';
import queryString from 'query-string';
import { Spin, Typography } from "antd";

import {
    forgetPasswordAPI,
    verifyEmailAPI
} from 'app/api/auth';


function VerifyNewPassword() {
    const { Title } = Typography;
    //   const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

    const verifyForgetPasswordToken = queryString.parse(location.search);
    // const verifyForgetPasswordToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRpZW50aGFpcGhhbTEwM0BnbWFpbC5jb20iLCJwYXNzd29yZCI6IiRhcmdvbjJpJHY9MTkkbT00MDk2LHQ9MyxwPTEkYUJoV2MrZk5YclNydXR0dlJYMlJucXhTdUREWk02U2JJdUYxQTI5TWYvVSRVVE9oa0RPQWJYbVVKSlV0eGtsZ3lFNFFkM0Q5aVp2VHRicldOSTZhaGdrIiwiaWF0IjoxNjE0NDM3ODkwLCJleHAiOjE2MTQ0MzgxOTB9.kWl9CrK76ot5lYFUtfuc8VOT1RNPZRfXvVO0nPtfVVY";
    console.log('TOKEN===================', verifyForgetPasswordToken);

    const [loading, setLoading] = useState(false);

    const verifyEmail = async () => {
        let res = await verifyEmailAPI(verifyForgetPasswordToken);
        console.log(res);
        if (res === "Password is Forgeted") {
            history.push("/forget-password/success");
        }
    }

    useEffect(() => {
        // Create an scoped async function in the hook
        // async function verifyEmail() {
        //     let res = await verifyEmailAPI(verifyForgetPasswordToken);
        //     console.log(res);
        //     if (res.isSuccess === true) {
        //         history.push("/forget-password/success");
        //     }
        // }
        // Execute the created function directly
        verifyEmail();
    }, []);

    // const onFinish = async (values) => {

    // };

    return (
        <div>
            <Title level={2}
                    style={{ paddingTop: '15px', paddingBottom: '0px', color: '#1273EB', display: 'flex', justifyContent: 'center' }}
                >
                    WiiQuiz
            </Title>
            <Spin tip="Đang tạo mật khẩu mới..." spinning={true}>
                <div>
                    <p></p>
                </div>
            </Spin>
        </div>

    );
}


export default VerifyNewPassword;
