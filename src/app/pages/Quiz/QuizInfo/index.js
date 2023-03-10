import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Button, Card, Typography, Skeleton, Tabs, Select, Badge, Collapse, Timeline } from 'antd';
import { QuizInfoWrapper } from './QuizInfoStyle';
import { useParams, useHistory } from "react-router-dom";
import ReactHtmlParser from 'react-html-parser';

import { FileOutlined, FieldTimeOutlined, TeamOutlined, OrderedListOutlined, HomeOutlined } from '@ant-design/icons';

import { onVisible } from 'app/store/modal';
import AssignChildToTest from 'app/components/ModalManager/AssignChildToTest';

import {
    initialCurrentNumOfReg,
    selectCurrentNumOfReg
} from 'app/store/quiz';

import {
    getQuizInfoAPI
} from 'app/api/quiz';


function QuizInfo() {
    const history = useHistory();

    const { status, combinedId, quizId } = useParams();
    console.log('combinedID:', combinedId);
    console.log('quizID:', quizId);

    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    const [imgUrl, setImgUrl] = useState(null);
    const [quizName, setQuizName] = useState("");
    const [subject, setSubject] = useState("");
    const [grade, setGrade] = useState("");
    const [duration, setDuration] = useState(0);
    const [numberOfQuestions, setNumberOfQuestions] = useState(0);
    const numberOfRegister = useSelector(selectCurrentNumOfReg);
    const [description, setDescription] = useState("");
    const [registrationDueDate, setRegistrationDueDate] = useState("");
    const [quizOpen, setQuizOpen] = useState("");
    const [quizClose, setQuizClose] = useState("");

    const [selectedQuizId, setSelectedQuizId] = useState("");
    const handleChooseChild = async id => {
        setSelectedQuizId(id);
        dispatch(onVisible());
        console.log('selectedQuizId', selectedQuizId);
        console.log('id', id)
    };

    useEffect(() => {
        getQuizInfo(quizId);
    }, []);

    const getQuizInfo = async id => {
        try {
            setLoading(true);
            let res = await getQuizInfoAPI({ id: id });
            setLoading(false);
            // setLoading(false);
            if (res.code == 1) {
                // setQuizzes(res.data);
                // console.log('quizzes: ++++++++', quizzes);
                console.log('quizInfo: ++++++++', res.data);
                setImgUrl(res.data.images.cover);
                setQuizName(res.data.name);
                setSubject(res.data.subject);
                setGrade(res.data.grade);
                setDuration(res.data.duration);
                // setNumberOfRegister(res.data.numberOfRegister);
                dispatch(initialCurrentNumOfReg(res.data.numberOfRegister));
                setNumberOfQuestions(res.data.numberOfQuestions);
                setDescription(res.data.description);
                setRegistrationDueDate(res.data.registrationDueDate);
                setQuizOpen(res.data.quizOpen);
                setQuizClose(new Date((new Date(res.data.quizOpen)).getTime() + res.data.quizOpenFluctuation * 1000 * 60));
                // setQuizClose(new Date(res.data.quizOpen));

                // test
                let timeobj = new Date(res.data.registrationDueDate);
                console.log('DUE DATE: ', timeobj - (new Date()));
                console.log('DUE DATE: ', timeobj);
                console.log('CLOSE: ', (new Date(res.data.quizOpen)));
                console.log('CLOSE: ', (new Date((new Date(res.data.quizOpen)).getTime() + res.data.quizOpenFluctuation * 1000 * 60)));
                console.log('CLOSE', new Date(res.data.quizOpen));
            }
        } catch (error) {
            console.log(error);
        }
    };

    // handle 0 am
    const getTimeShow = (dateObject) => {
        const dd = dateObject.getDate();
        const mm = dateObject.getMonth() + 1;
        const yyyy = dateObject.getFullYear();
        var h = dateObject.getHours();
        var m = dateObject.getMinutes();
        var time = "";
        if (m < 10){
            m = '0' + m
        }
        if(h > 12){
            h = h - 12;
            time = "chi???u"
        }
        else{
            time = "s??ng"
        }
        return h + ":" + m + " " + time + ",  " + dd + "-" + mm + "-" + yyyy
    }

    const getRibbon = () => {
        const now = new Date();
        if (now < (new Date(registrationDueDate))) {
            return ["C??n h???n ????ng k??", "#6BABC8"]
        }
        else if (now > (new Date(registrationDueDate)) && now < (new Date(quizOpen))) {
            return ["H???t h???n ????ng k??- B??i thi ch??a m???", "#E05F57"]
        }
        else if (now > (new Date(quizOpen)) && now < quizClose) {
            return ["B??i thi ??ang m???", "#48BB36"]
        }
        else {
            return ["B??i thi ???? ????ng", "#DCCD40"]
        }
    }

    const buttonRender = () => {
        if (status == undefined) {
            return (
                <Button
                    size="large"
                    className={(new Date(registrationDueDate)) - (new Date()) > 0 ? "active-button" : "not-active-button"}
                    onClick={() => {
                        if ((new Date(registrationDueDate)) - (new Date()) > 0) {
                            handleChooseChild(quizId)
                        }
                    }}
                >
                    ????ng k?? ngay
                </Button>
            )
        }
        else if (status == "completed") {
            return (
                <Button
                    size="large"
                    className="active-button"
                    onClick={() => {
                        history.push(`/student-quiz/do-test/${combinedId}`);
                    }}
                >
                    Xem k???t qu???
                </Button>
            )
        }
        else if (status == "registered") {
            if (new Date() > (new Date(quizOpen)) && new Date() < quizClose) {
                return (
                    <Button
                        size="large"
                        className="active-button"
                        onClick={() => {
                            history.push(`/student-quiz/do-test/${combinedId}`);
                        }}
                    >
                        S???n s??ng v??o thi
                    </Button>
                )
            }
            else {
                return (
                    <Button
                        size="large"
                        className="not-active-button"
                    >
                        S???n s??ng v??o thi
                    </Button>
                )
            }

        }
        else if (status == "submitted") {
            return (
                <Button
                    size="large"
                    className="active-button"
                    onClick={() => {
                        history.push(`/student-quiz/do-test/${combinedId}`);
                    }}
                >
                    Xem k???t qu???
                </Button>
            )
        }
        else if (status == "in-process") {
            return (
                <Button
                    size="large"
                    className="active-button"
                    onClick={() => {
                        history.push(`/student-quiz/do-test/${combinedId}`);
                    }}
                >
                    Ti???p t???c
                </Button>
            )
        }
    }

    return (
        <QuizInfoWrapper>
            <Skeleton active loading={loading}>
                <Row>
                    <Col span={10}>
                        <Card
                            className="info-card"
                            cover={<img alt='example' src={imgUrl} />}
                        >
                            <p className="basic-info" style={{ textAlign: 'center' }}>
                                <TeamOutlined style={{ marginRight: '8px' }} />S??? h???c sinh ???? ????ng k??: {numberOfRegister}
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                {buttonRender()}
                                <AssignChildToTest quizId={selectedQuizId}></AssignChildToTest>
                            </div>
                            <Row>
                                <Col span={16}>
                                    <p className="basic-info">
                                        <FileOutlined style={{ marginRight: '8px' }} />M??n: {subject}
                                    </p>
                                </Col>
                                <Col span={8}>
                                    <p className="basic-info">
                                        <HomeOutlined style={{ marginRight: '8px' }} />L???p: {grade}
                                    </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={16}>
                                    <p className="basic-info">
                                        <FieldTimeOutlined style={{ marginRight: '8px' }} />Th???i gian: {duration} ph??t
                                    </p>
                                </Col>
                                <Col span={8}>
                                    <p className="basic-info">
                                        <OrderedListOutlined style={{ marginRight: '8px' }} />S??? c??u: {numberOfQuestions}
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

                        <Badge.Ribbon
                            text={getRibbon()[0]}
                            color={getRibbon()[1]}
                        >
                            <Card className="time-card">
                                <Timeline>
                                    <Timeline.Item>
                                        <p>
                                            H???n ch??t ????ng k??:
                                            <span style={{ color: 'gray', fontWeight: '400' }}> {getTimeShow(new Date(registrationDueDate))} </span>
                                        </p>
                                    </Timeline.Item>
                                    <Timeline.Item color="green">
                                        <p>
                                            Th???i gian b??i thi m??? :
                                            <span style={{ color: 'gray', fontWeight: '400' }}> {getTimeShow(new Date(quizOpen))}</span>
                                        </p>
                                    </Timeline.Item>
                                    <Timeline.Item color="red">
                                        <p style={{paddingBottom: '5px'}}>
                                            Th???i gian b??i thi ????ng :
                                            <span style={{ color: 'gray', fontWeight: '400' }}> {getTimeShow(new Date(quizClose))}</span>
                                        </p>
                                    </Timeline.Item>
                                </Timeline>
                            </Card>
                        </Badge.Ribbon>

                        <Card className="description-card">
                            <div> { ReactHtmlParser (description) } </div>
                        </Card>
                    </Col>
                </Row>
            </Skeleton>
        </QuizInfoWrapper>
    );
}

export default QuizInfo;