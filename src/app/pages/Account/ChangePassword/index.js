import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectAccount,
}
    from 'app/store/account';
import {
    changePasswordAPI
} from 'app/api/user';
import { ChangePasswordWrapper } from './ChangePasswordStyle';
import { Button, Typography, Avatar, Form, Space, Divider, notification, Spin, Input } from 'antd';
import { useHistory } from 'react-router-dom';

const layout = {
    labelCol: { span: 12 },
    wrapperCol: { span: 12 },
};


function ChangePassword() {
    const { Title } = Typography;
    const [form] = Form.useForm();

    const [editLoading, setEditLoading] = useState(false);

    const username = useSelector(selectAccount).username;
    const getCharacter = () => {
        if (username == undefined) {
            return ""
        }
        else {
            return username[0].toUpperCase()
        }
    }
    

    const [passwordValidate, setPasswordValidate] = useState("");
    const [newPasswordValidate, setNewPasswordValidate] = useState("");
    const [confirmedPasswordValidate, setConfirmedPasswordValidate] = useState("");

    const onFinish = async (values) => {
        setConfirmedPasswordValidate("");
        if (values.newPassword != values.confirmedPassword) {
            setConfirmedPasswordValidate("Mật khẩu xác nhận sai!");
        }
        else {
            try {
                setEditLoading(true);
                let res = await changePasswordAPI({ password: values.oldPassword, newPassword: values.newPassword });
                const validations = res.errors;
                console.log(validations);
                console.log(res);
                setEditLoading(false);

                let password_ = "";
                let newPassword_ = "";

                if (validations) {
                    const message = validations[0];
                    if (message.password) {
                        password_ = message.password;
                        console.log('------', password_);
                    }
                    if (message.newPassword) {
                        newPassword_ = message.newPassword;
                        console.log('-----', newPassword_);
                    }
                    setPasswordValidate(password_);
                    setNewPasswordValidate(newPassword_);
                }
                else {
                    setPasswordValidate("");
                    setNewPasswordValidate("");
                    form.resetFields();
                    notification.success({
                        message: "Đổi mật khẩu thành công!",
                        duration: "2"
                    });
                }

            } catch (error) { }
        }

    };

    return (
        <ChangePasswordWrapper>
            <Spin tip="Đang cập nhật..." spinning={editLoading}>
                <div className="container">
                    <div className="item">
                        <Avatar style={{ color: '#272755', backgroundColor: '#a5dff8' }} size={64}>
                            {/* {info.username[0].toUpperCase()} */}
                            {getCharacter()}
                        </Avatar>
                    </div>
                    <div className="item">
                        <Title level={3}>
                            {username}
                        </Title>
                    </div>
                </div>
                <Divider />
                <div>
                    <Form
                        {...layout}
                        form={form}
                        name="basic"
                        layout="vertical"
                        // initialValues={{ remember: true }}
                        onFinish={onFinish}
                    // onFinishFailed={onFinishFailed}
                    >

                        <Form.Item
                            label={<span style={{ fontSize: '16px', fontWeight: '900' }}>Mật khẩu cũ</span>}
                            style={{ margin: '0px' }}
                        >
                            <Form.Item
                                name="oldPassword"
                                validateStatus={passwordValidate.localeCompare("") != 0 ? "error" : null}
                                help={passwordValidate.localeCompare("") != 0 ? passwordValidate : null}
                                // noStyle
                                rules={[
                                    {
                                        required: true,
                                        message: <p style={{ color: 'red' }}>Nhập mật khẩu cũ!</p>
                                    }
                                ]}
                            >
                                <Input.Password
                                    className="input"
                                    type="password"
                                    style={{ width: '60%', minWidth: '250px' }}
                                // onChange={onOldPasswordChanged}
                                />
                            </Form.Item>
                        </Form.Item>


                        <Form.Item
                            label={<span style={{ fontSize: '16px', fontWeight: '900' }}>Mật khẩu mới</span>}
                            style={{ margin: '0px' }}
                        >
                            <Form.Item
                                name="newPassword"
                                validateStatus={newPasswordValidate.localeCompare("") != 0 ? "error" : null}
                                help={newPasswordValidate.localeCompare("") != 0 ? newPasswordValidate : null}
                                // noStyle
                                rules={[{ required: true, message: <p style={{ color: 'red' }}>Nhập mật khẩu mới!</p> }]}
                            >
                                <Input.Password
                                    className="input"
                                    type="password"
                                    style={{ width: '60%', minWidth: '250px' }}
                                // onChange={onNewPasswordChanged}
                                />
                            </Form.Item>
                        </Form.Item>

                        <Form.Item
                            label={<span style={{ fontSize: '16px', fontWeight: '900' }}>Xác nhận mật khẩu</span>}
                            style={{ margin: '0px' }}
                        >
                            <Form.Item
                                name="confirmedPassword"
                                validateStatus={confirmedPasswordValidate.localeCompare("") != 0 ? "error" : null}
                                help={confirmedPasswordValidate.localeCompare("") != 0 ? confirmedPasswordValidate : null}
                                // noStyle
                                rules={[{ required: true, message: <p style={{ color: 'red' }}>Nhập mật khẩu mới!</p> }]}
                            >
                                <Input.Password
                                    className="input"
                                    type="password"
                                    style={{ width: '60%', minWidth: '250px' }}
                                // onChange={onNewPasswordChanged}
                                />
                            </Form.Item>
                        </Form.Item>

                        <Form.Item style={{ paddingTop: "5px" }}>
                            <Space size={'large'}>
                                <Button
                                    size="large"
                                    className="edit-button"
                                    htmlType="submit"
                                    style={{ borderRadius: '6px' }}
                                >
                                    Lưu thay đổi
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </div>
            </Spin>
        </ChangePasswordWrapper>
    )
}

export default ChangePassword;
