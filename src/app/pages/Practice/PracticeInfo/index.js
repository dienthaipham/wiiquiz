import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Button, Card, Typography, Skeleton, Table, Space, Modal } from 'antd';
import { PracticeInfoWrapper } from './PracticeInfoStyle';
import { useParams, useHistory } from "react-router-dom";
import ReactHtmlParser from 'react-html-parser';

import { FileOutlined, FieldTimeOutlined, OrderedListOutlined, HomeOutlined } from '@ant-design/icons';

import { selectAllStudent } from 'app/store/student';
import { changeStudentPracticeStatus } from "app/store/student";


import {
    getQuizInfoAPI,
    getPracticeIdAPI
} from 'app/api/quiz';

import {
    resetPracticeAPI
} from 'app/api/doTest'


function PracticeInfo() {
    const history = useHistory();

    const { Title } = Typography;

    const { status, quizId, studentId } = useParams();
    console.log('quizID:', quizId);
    console.log('studentID:', studentId);

    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    const [imgUrl, setImgUrl] = useState(null);
    const [quizName, setQuizName] = useState("");
    const [subject, setSubject] = useState("");
    const [grade, setGrade] = useState("");
    const [duration, setDuration] = useState(0);
    const [numberOfQuestions, setNumberOfQuestions] = useState(0);
    const [description, setDescription] = useState("");

    const [buttonLoading, setButtonLoading] = useState(false);
    const [hover, setHover] = useState(false);
    const [visible, setVisible] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const columns = [{
        title: () => { return (<p style={{ margin: '0px', fontSize: '16px', fontWeight: '900' }}>Tên</p>) },
        dataIndex: "fullname",
        render: text =>
          <p style={{ fontSize: '16px', margin: '0px', fontWeight: '500', color: '#667B89' }}>
            {text}
          </p>
      }];

    const rowSelection = {
        // type,
        selectedRowKeys,
        onChange: selectedRowKeys => {
            setSelectedRowKeys(selectedRowKeys);
        }
    };

    const allStudent = useSelector(selectAllStudent);
    const dataSource = allStudent.map(student => (
        { _id: student._id, fullname: student.fullname, key: student._id }
    ));

    const [selectedQuizId, setSelectedQuizId] = useState("");


    useEffect(() => {
        getQuizInfo(quizId);
    }, []);

    const getQuizInfo = async id => {
        try {
            setLoading(true);
            let res = await getQuizInfoAPI({ id: id });
            setLoading(false);
            if (res.code == 1) {
                console.log('quizInfo: ++++++++', res.data);
                setImgUrl(res.data.images.cover);
                setQuizName(res.data.name);
                setSubject(res.data.subject);
                setGrade(res.data.grade);
                setDuration(res.data.duration);
                setNumberOfQuestions(res.data.numberOfQuestions);
                setDescription(res.data.description);


            }
        } catch (error) {
            console.log(error);
        }
    };

    const doPractice = async (quizID, studentID) => {
        const res = await getPracticeIdAPI({ quizId: quizID, userId: studentID });
        if (res.data.status == 'DONE') {
            await resetPracticeAPI({ id: res.data._id });
        }
        console.log("JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ", res);
        history.push(`/student-practice/do-practice/${res.data._id}`);
    };

    const buttonRender = () => {
        if (status === undefined) {
            if (studentId != undefined) {
                return (
                    <Button
                        size="large"
                        className="active-button"
                        onClick={() => {
                            // history.push(`/student-quiz/do-test/${combinedId}`);
                            doPractice(quizId, studentId);
                        }}
                    >
                        Đã sẵn sàng
                    </Button>
                )
            }
            else {
                return (
                    <Button
                        size="large"
                        className="active-button"
                        onClick={() => {
                            setVisible(true);
                            // history.push(`/student-quiz/do-test/${combinedId}`);
                        }}
                    >
                        Chọn học sinh
                    </Button>
                )
            }
        }
        else {
            if (status === "in-process") {
                return (
                    <Button
                        size="large"
                        className="active-button"
                        onClick={() => {
                            // history.push(`/student-quiz/do-test/${combinedId}`);
                            doPractice(quizId, studentId);
                        }}
                    >
                        Tiếp tục
                    </Button>
                )
            }
            else{
                return (
                    <Button
                        size="large"
                        className="active-button"
                        onClick={() => {
                            // history.push(`/student-quiz/do-test/${combinedId}`);
                            dispatch(changeStudentPracticeStatus('2'));
                            doPractice(quizId, studentId);
                        }}
                    >
                        Sẵn sàng làm lại
                    </Button>
                )
            }
        }

    }

    return (
        <PracticeInfoWrapper>
            <Skeleton active loading={loading}>
                <Row>
                    <Col span={10}>
                        <Card
                            className="info-card"
                            cover={<img alt='example' src={imgUrl} />}
                        >
                            {/* <p className="basic-info" style={{ textAlign: 'center' }}>
                                <TeamOutlined style={{ marginRight: '8px' }} />Số học sinh đã làm: {numberOfRegister}
                            </p> */}
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                {buttonRender()}
                                <Modal
                                    centered
                                    onCancel={() => {
                                        setVisible(false);
                                        setSelectedRowKeys([]);
                                        setButtonLoading(false);
                                    }}
                                    visible={visible}
                                    closable={false}
                                    footer={null}
                                    style={{
                                        borderRadius: '10px',
                                        background: '#fff',
                                        padding: '5px',
                                    }}
                                    bodyStyle={{
                                        borderRadius: '5px',
                                        background: '#fff',
                                        boxShadow: '0px 0px 3.5px 3.5px #fff'
                                    }}
                                >
                                    <Title level={4} style={{ fontWeight: '900', marginBottom: '20px', padding: '0px', color: '#150C58' }}>
                                        Chọn học sinh
                                    </Title>
                                    {visible ?
                                        <Table
                                            dataSource={dataSource}
                                            columns={columns}
                                            scroll={{ y: "300px" }}
                                            pagination={false}
                                            rowSelection={{
                                                type: "radio",
                                                ...rowSelection,
                                            }}
                                        />
                                        : null}
                                    <Space size="large" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            onMouseEnter={() => {
                                                setHover(true);
                                            }}
                                            onMouseLeave={() => {
                                                setHover(false);
                                            }}
                                            size="large"
                                            style={{
                                                borderRadius: '5px', marginTop: '20px', fontSize: '16px', fontWeight: '900', borderColor: '#fff',
                                                color: '#1273EB',
                                                ...(hover ? { background: '#f3f3f4' } : null)
                                            }}
                                            onClick={() => {
                                                setVisible(false);
                                                setSelectedRowKeys([]);
                                                setButtonLoading(false);
                                            }}
                                        >
                                            Hủy
                                        </Button>
                                        <Button
                                            type="primary"
                                            size="large"
                                            loading={buttonLoading}
                                            style={{ borderRadius: '5px', marginTop: '20px', fontSize: '16px', fontWeight: '900' }}
                                            onClick={() => {
                                                console.log('((((((((((((SELECTED))', selectedRowKeys);
                                                doPractice(quizId, selectedRowKeys[0]);
                                                // history.push(`practice/${selectedRowKeys[0]}/${practice._id}`)
                                            }}
                                        >
                                            Làm bài ngay
                                        </Button>
                                    </Space>
                                </Modal>
                            </div>
                            <Row>
                                <Col span={16}>
                                    <p className="basic-info">
                                        <FileOutlined style={{ marginRight: '8px' }} />Môn: {subject}
                                    </p>
                                </Col>
                                <Col span={8}>
                                    <p className="basic-info">
                                        <HomeOutlined style={{ marginRight: '8px' }} />Lớp: {grade}
                                    </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={16}>
                                    <p className="basic-info">
                                        <FieldTimeOutlined style={{ marginRight: '8px' }} />Thời gian: {duration} phút
                                    </p>
                                </Col>
                                <Col span={8}>
                                    <p className="basic-info">
                                        <OrderedListOutlined style={{ marginRight: '8px' }} />Số câu: {numberOfQuestions}
                                    </p>
                                </Col>
                            </Row>

                        </Card>
                    </Col>
                    <Col span={14}>
                        <p
                            style={{
                                backgroundColor: 'rgba(28, 28, 80, 0.85)',
                                borderRadius: '5px',
                                color: '#fff',
                                fontSize: '18px',
                                paddingLeft: '20px',
                                paddingTop: '10px',
                                paddingBottom: '10px',
                                marginTop: '0px',
                                marginBottom: '20px',
                                boxShadow: '3px 3px 3px 0px #B0B0B5'
                            }}
                        >
                            {quizName}
                        </p>

                        <Card className="description-card">
                            <div> { ReactHtmlParser (description) } </div>
                        </Card>
                    </Col>
                </Row>
            </Skeleton>
        </PracticeInfoWrapper>
    );
}

export default PracticeInfo;