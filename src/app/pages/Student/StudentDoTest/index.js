import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from "react-router-dom";
import { StudentDoTestWrapper } from "./StudentDoTestStyle";
import { Badge, Affix, notification, Typography, Col, Row, Tabs, Checkbox, Radio, Progress, Button, Statistic, Card, Spin } from "antd";
import { CaretRightOutlined, SendOutlined, LeftCircleOutlined, RightCircleOutlined, RightOutlined, LeftOutlined, ClockCircleTwoTone, FieldTimeOutlined, CheckOutlined } from '@ant-design/icons';


import {
    getRemainTimeAPI,
    updateOneAnswerAPI,
    submitAPI,
    getTestAPI
} from 'app/api/doTest';


function StudentDoTest() {
    const { Countdown } = Statistic;


    const { combinedId } = useParams();
    console.log('QUIZ', combinedId);

    const dispatch = useDispatch();
    const history = useHistory();

    const [quizName, setQuizName] = useState("");
    const [studentName, setStudentName] = useState("");
    const [studentId, setStudentId] = useState("");
    const [grade, setGrade] = useState("");

    const [submitTime, setSubmitTime] = useState(0);

    const [duration, setDuration] = useState(0);
    const [remaining, setRemaining] = useState(0);
    const [flagTime, setFlagTime] = useState(new Date());
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(0);
    const [status, setStatus] = useState("");
    const [total, setTotal] = useState(0);
    const [questions, setQuestions] = useState([{ _id: '2222', image: '', numberOfAnswer: 2, multipleAnswers: false }]);
    const [answers, setAnswers] = useState([[], []]);
    const [current, setCurrent] = useState(1);

    const [numberOfCorrectAnswers, setNumberOfCorrectAnswers] = useState(0);
    const [score, setScore] = useState(0);
    const [totalScore, setTotalScore] = useState(0);

    const [loading, setLoading] = useState(false);

    // useEffect(()=>{
    //     dispatch(createOneTest({combinedId: combinedId}));
    //     console.log('vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv')
    // }, [])
    const studentDotest = async () => {
        try {
            setLoading(true);
            let res = await getTestAPI({ id: combinedId });

            if (res.code === 1) {
                setQuizName(res.data.quizName);
                setStudentName(res.data.fullname);
                setStudentId(res.data.childID);
                setGrade(res.data.grade);

                setDuration(res.data.duration);
                setRemaining(res.data.remaining);
                setStart(res.data.start);
                // setFlagTime(res.data.start);
                setEnd(res.data.end);
                setSubmitTime(res.data.submitDate);
                setStatus(res.data.status);
                setTotal(res.data.length);
                setQuestions(res.data.questions);
                setAnswers(res.data.userAnswer);

                setNumberOfCorrectAnswers(res.data.numberOfCorrectAnswers);
                setScore(res.data.score);
                setTotalScore(res.data.totalScore);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        studentDotest();
        return () => { };
    }, []);

    const showTime = (dateObject) => {
        const dd = dateObject.getDate();
        const mm = dateObject.getMonth() + 1;
        const yyyy = dateObject.getFullYear();
        const h = dateObject.getHours();
        const m = dateObject.getMinutes();
        const s = dateObject.getSeconds();
        return h + " gi??? " + m + " ph??t " + s + " gi??y" + ",  " + dd + "-" + mm + "-" + yyyy
    }

    const countFinish = (answers) => {
        let count = 0;
        for (let x of answers) {
            if (x.length > 0) {
                count += 1
            }
        }
        return count;
    }

    const handleButtonClick = async (value) => {
        setCurrent(value);
        setRemaining(remaining - ((new Date()).getTime() - flagTime.getTime()));
        // setTime(end.getTime() - (new Date()).getTime());
        try {
            let res = await getRemainTimeAPI({ id: combinedId });
            console.log('getRemainTimeAPI', res)
            if (res.code === 1) {
                setRemaining(res.date.remaining);
                setFlagTime(new Date())
                console.log('getRemainTimeAPI...........')
            }

        } catch (error) {
            console.log(error);
        }
        console.log('panigation: ', value);

        // dispatch(changeCurrent({ combinedId: combinedId, value: value }));

    }

    const nextQuestion = async () => {
        setCurrent(current + 1 > total ? 1 : current + 1);
        // setRemaining(remaining - ((new Date()) - flagTime).getTime())
        setRemaining(remaining - ((new Date()).getTime() - flagTime.getTime()));
        // setTime(end.getTime() - (new Date()).getTime());
        try {
            let res = await getRemainTimeAPI({ id: combinedId });
            console.log('getRemainTimeAPI', res)
            if (res.code === 1) {
                setRemaining(res.date.remaining);
                setFlagTime(new Date());
                console.log('getRemainTimeAPI...........')
            }

        } catch (error) {
            console.log(error);
        }

        // dispatch(increaseCurrent({ combinedId: combinedId }));

    }

    const backQuestion = async () => {
        // setTime(end.getTime() - (new Date()).getTime());
        setCurrent(current - 1 === 0 ? total : current - 1);
        // setRemaining(remaining - ((new Date()) - flagTime).getTime())
        setRemaining(remaining - ((new Date()).getTime() - flagTime.getTime()));
        try {
            let res = await getRemainTimeAPI({ id: combinedId });
            console.log('getRemainTimeAPI', res)
            if (res.code === 1) {
                setRemaining(res.date.remaining);
                setFlagTime(new Date());
                console.log('getRemainTimeAPI...........')
            }

        } catch (error) {
            console.log(error);
        }

        // dispatch(decreaseCurrent({ combinedId: combinedId }));

    }

    const onChangeSingle = async (value) => {
        let temp = answers.slice(); //creates the clone of the state
        temp[current - 1] = [value.target.value];
        setAnswers(temp);

        setRemaining(remaining - ((new Date()).getTime() - flagTime.getTime()));

        try {
            let res = await getRemainTimeAPI({ id: combinedId });
            console.log('getRemainTimeAPI', res)
            if (res.code === 1) {
                setRemaining(res.date.remaining);
                setFlagTime(new Date());
                console.log('getRemainTimeAPI...........')
            }

        } catch (error) {
            console.log(error);
        }
        console.log('ONCHANGE', value.target.value);

        try {
            let res = await updateOneAnswerAPI({
                data: { answer: [value.target.value], questionNumber: current - 1 },
                id: combinedId
            });
            if (res.code === 1) {
                // Handle later
            }
        } catch (error) { }
    }

    const onChangeMultiple = async (value) => {
        // update answers state
        let temp = answers.slice(); //creates the clone of the state
        temp[current - 1] = value;
        setAnswers(temp);

        setRemaining(remaining - ((new Date()).getTime() - flagTime.getTime()));

        try {
            let res = await getRemainTimeAPI({ id: combinedId });
            console.log('getRemainTimeAPI', res)
            if (res.code === 1) {
                setRemaining(res.date.remaining);
                setFlagTime(new Date());
                console.log('getRemainTimeAPI...........')
            }

        } catch (error) {
            console.log(error);
        }
        console.log('ONCHANGE', value);

        try {
            let res = await updateOneAnswerAPI({
                data: { answer: value, questionNumber: current - 1 },
                id: combinedId
            });
            if (res.code === 1) {
                // Handle later
            }
        } catch (error) { }
    }

    const options = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    const oneAnswerRender = (number, multiple, choices) => {
        if (multiple === true) {
            const optionsRender = options.slice(0, number).map((x, index) => (
                <Checkbox value={index} className="my-checkbox">{x}</Checkbox>
            ));
            return (
                <Checkbox.Group
                    style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '0px' }}
                    // defaultValue={[1, 0]}
                    value={answers[current - 1]}
                    onChange={onChangeMultiple}
                >
                    {optionsRender}
                </Checkbox.Group>
            )
        }
        else {
            const optionsRender = options.slice(0, number).map((x, index) => (
                <Radio value={index} className="my-checkbox">{x}</Radio>
            ));
            return (
                <Radio.Group
                    style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '0px' }}
                    // defaultValue={0}
                    value={answers[current - 1][0]}
                    onChange={onChangeSingle}
                >
                    {optionsRender}
                </Radio.Group>
            )
        }
    }

    const clearAnswer = async () => {
        let temp = answers.slice(); //creates the clone of the state
        temp[current - 1] = [];
        setAnswers(temp);

        setRemaining(remaining - ((new Date()).getTime() - flagTime.getTime()));

        try {
            let res = await getRemainTimeAPI({ id: combinedId });
            console.log('getRemainTimeAPI', res)
            if (res.code === 1) {
                setRemaining(res.date.remaining);
                setFlagTime(new Date());
                console.log('getRemainTimeAPI...........')
            }

        } catch (error) {
            console.log(error);
        }

        try {
            let res = await updateOneAnswerAPI({
                data: { answer: [], questionNumber: current - 1 },
                id: combinedId
            });
            if (res.code === 1) {
                // Handle later
            }
        } catch (error) { }
    }

    const buttonRender = answers.map((x, index) => (
        <div >
            {(index + 1) === current ?
                <Button
                    key={index}
                    className="button-item"
                    // id="active"
                    id={x.length > 0 ? "finish-active" : "active"}
                    // size="small"
                    onClick={() => handleButtonClick(index + 1)}>
                    {index + 1}
                </Button>
                : null}
            {(index + 1) !== current ?
                <Button
                    key={index}
                    className="button-item"
                    id={x.length > 0 ? "finish" : "remain"}
                    // size="small"
                    onClick={() => handleButtonClick(index + 1)}>
                    {index + 1}
                </Button>
                : null}
        </div>
    ));

    const timeOut = async () => {
        window.scrollTo(0, 0);
        notification.warning({
            message: "???? h???t gi??? l??m b??i!",
            duration: "2"
        });

        // set loading
        setLoading(true);
        setStatus('SUBMITTED');

        // call api
        try {
            let res = await submitAPI({ id: combinedId });
            // console.log('getRemainTimeAPI', res)
            if (res.code === 1) {
                // setRemaining(res.date.remaining);
                setSubmitTime(res.submitDate);
                // console.log('getRemainTimeAPI...........')
            }

        } catch (error) {
            console.log(error);
        }
        setLoading(false);

        // dispatch(finishTest({ combinedId: combinedId }));
        // dispatch(increaseCurrent({ combinedId: combinedId }));
        // history.push('/home');
    }

    const submit = async () => {
        setLoading(true);
        try {
            let res = await getRemainTimeAPI({ id: combinedId });
            console.log('getRemainTimeAPI', res)
            if (res.code === 1) {
                setRemaining(res.date.remaining);
                console.log('getRemainTimeAPI...........')
            }

        } catch (error) {
            console.log(error);
        }

        // setEndTime(new Date());

        window.scrollTo(0, 0);
        notification.success({
            message: "???? n???p b??i!",
            duration: "2"
        });
        // setStatus('SUBMITTED');

        // call api
        try {
            let res = await submitAPI({ id: combinedId });
            if (res.code === 1) {
                // setRemaining(res.date.remaining);
                setSubmitTime(res.submitDate);
                // console.log('getRemainTimeAPI...........')
            }

        } catch (error) {
            console.log(error);
        }
        setLoading(false);
        setStatus('SUBMITTED');

    }



    return (
        // <div>Hello</div>
        <StudentDoTestWrapper>
            {
                loading === false ?
                    <div>
                        {true ?
                            <div>
                                {/* <Title
                                    level={3}
                                    style={{ paddingBottom: '0', marginTop: '0px', paddingTop: '20px', color: '#050541' }}
                                >
                                    <FormOutlined style={{ marginRight: '10px' }} />{quizName} ({total} c??u/ {duration} ph??t)
                                </Title> */}

                                <div style={{ marginBottom: '0px', marginTop: '15px' }}>
                                    <p
                                        style={{
                                            backgroundColor: 'rgba(28, 28, 80, 0.85)',
                                            borderRadius: '5px',
                                            color: '#fff',
                                            fontSize: '18px',
                                            paddingLeft: '20px',
                                            paddingTop: '10px',
                                            paddingBottom: '10px',
                                            boxShadow: '3px 3px 3px 0px #B0B0B5'
                                        }}
                                    >
                                        <Row>
                                            <Col span={12}>
                                                <p className="quiz-info">
                                                    ?????: {quizName}
                                                </p>
                                                <Row>
                                                    <Col span={12}>
                                                        <p className="quiz-info">
                                                            Th???i gian: {duration} ph??t
                                                        </p>
                                                    </Col>
                                                    <Col span={12}>
                                                        <p className="quiz-info">
                                                            S??? c??u: {total}
                                                        </p>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col span={12}>
                                                <p className="quiz-info">
                                                    H???c sinh: {studentName} ({studentId})
                                                </p>
                                                <p className="quiz-info">
                                                    L???p: {grade}
                                                </p>
                                            </Col>
                                        </Row>
                                    </p>
                                </div>

                                {(status === 'REGISTERED' || status === 'IN_PROCESS') ?
                                    <div>
                                        <Row align='middle'>
                                            <Col span={3}>
                                                <p style={{ fontSize: '18px', fontWeight: '900', margin: '0px' }}><CaretRightOutlined />C??u {current}/{total}</p>
                                                {/* <Title level={4} style={{margin: '0px', fontWeight: '900'}}><CaretRightOutlined />C??u 11/24</Title> */}
                                            </Col>
                                            <Col span={3}>
                                                <p style={{ fontSize: '18px', margin: '0px' }}>???? l??m ???????c: </p>
                                            </Col>
                                            <Col span={6}>
                                                <Progress
                                                    percent={(countFinish(answers) / total * 100).toFixed(1)}
                                                    // percent={Math.round(countFinish(answers) / total * 100, 2)}
                                                    trailColor='#DDDDE2'
                                                    style={{ width: '60%' }}
                                                />
                                            </Col>
                                            <Col span={5}>
                                                <p style={{ fontSize: '18px', margin: '0px' }}>C??n l???i: {total - countFinish(answers)} c??u</p>
                                            </Col>
                                            <Col span={4}>
                                                {/* <CountDown style={{ fontSize: 20 }} target={targetTime} /> */}
                                                <Countdown
                                                    prefix={<ClockCircleTwoTone />}
                                                    // value={Date.now() +
                                                    //     1000 * 60 * 60 * Math.floor(remaining / (1000 * 60 * 60)) +
                                                    //     1000 * 60 * Math.floor(remaining / (1000 * 60)) +
                                                    //     1000 * Math.floor((remaining % (60 * 1000)) / 1000)
                                                    // }
                                                    value={Date.now() + remaining}
                                                    style={{ paddingBottom: '5px' }}
                                                    onFinish={timeOut}
                                                />
                                            </Col>
                                            <Col span={3}>
                                                <Button
                                                    size="large"
                                                    icon={<SendOutlined />}
                                                    className="submit-button"
                                                    style={{ width: '100%' }}
                                                    onClick={submit}
                                                >
                                                    N???p b??i
                                                 </Button>
                                            </Col>
                                        </Row>


                                        <Row align='middle' style={{ marginBottom: '50px' }}>
                                            <Col span={1}>
                                                <LeftCircleOutlined
                                                    className="move-icon"
                                                    onClick={backQuestion}
                                                />
                                            </Col>
                                            <Col span={22}>
                                                <Card
                                                    style={{
                                                        marginTop: '20px',
                                                        marginBottom: '40px'
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                        <img
                                                            // src={questions[current - 1]}
                                                            src={questions[current - 1].image}
                                                            style={{
                                                                maxWidth: '935px',
                                                                height: 'auto'
                                                            }}
                                                        />
                                                    </div>

                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}>
                                                        <div>
                                                            {oneAnswerRender(questions[current - 1].numberOfAnswer, questions[current - 1].multipleAnswers, answers[current - 1])}
                                                        </div>
                                                        <div
                                                            style={{
                                                                marginLeft: '20px',
                                                                // paddingTop: '18px'
                                                            }}>
                                                            <Button
                                                                size="large"
                                                                className="clear-button"
                                                                onClick={clearAnswer}
                                                            >
                                                                H???y ch???n
                                                        </Button>
                                                        </div>
                                                    </div>



                                                    {/* <Pagination defaultCurrent={1} total={50} /> */}
                                                </Card>
                                            </Col>
                                            <Col span={1}>
                                                <RightCircleOutlined
                                                    className="move-icon"
                                                    onClick={nextQuestion}
                                                />
                                            </Col>
                                        </Row>

                                        <div 
                                            style={{ display: 'flex', 
                                                    justifyContent: 'center'
                                                    }}
                                        >
                                            <Affix
                                                style={{ 
                                                        // position: 'fixed', 
                                                        bottom: 0, 
                                                        paddingLeft: '30px',
                                                        paddingRight: '30px'
                                                        }}
                                            >
                                                <div 
                                                    style={{ display: 'flex', 
                                                            justifyContent: 'center'
                                                        }}
                                                >
                                                    <div className="item">
                                                        <Button
                                                            id="move-button"
                                                            onClick={backQuestion}
                                                        >
                                                            <LeftOutlined />Quay l???i
                                                        </Button>
                                                    </div>
                                                    <div className="item">
                                                        <div style={{ display: 'flex', margin: '0px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                                            {buttonRender}
                                                        </div>
                                                    </div>
                                                    <div className="item">
                                                        <Button
                                                            id="move-button"
                                                            onClick={nextQuestion}
                                                        >
                                                            Ti???p theo<RightOutlined />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Affix>
                                        </div>

                                    </div>
                                    :
                                    <div>
                                        {
                                            status === "SUBMITTED" ?
                                                <div>
                                                    <Badge.Ribbon
                                                        text="Ch??a ch???m"
                                                        color="#DC3D3D"
                                                    >
                                                        <Card
                                                            className="finish-card"
                                                            // tabBarExtraContent="Hello"
                                                            style={{ marginTop: '25px' }}
                                                        >
                                                            <p>
                                                                <span style={{ fontWeight: '900' }}>???? n???p b??i thi l??c: </span>
                                                                <span style={{ color: '#1273EB' }}>{showTime(new Date(submitTime))}</span>
                                                            </p>
                                                            <p><CheckOutlined style={{ marginRight: '6px', color: 'blue' }} />S??? c??u ???? l??m: {countFinish(answers)}/{total}</p>
                                                            <Progress
                                                                percent={(countFinish(answers) / total * 100).toFixed(1)}
                                                                // percent={Math.round(countFinish(answers) / total * 100, 2)}
                                                                trailColor='#DDDDE2'
                                                                style={{ width: '40%', marginBottom: '15px' }}
                                                                size="small"
                                                            />
                                                            <p><FieldTimeOutlined style={{ marginRight: '6px' }} />Th???i gian ho??n th??nh: {Math.min(((new Date(submitTime)).getTime() - start) / 1000 / 60, duration).toFixed(1)} ph??t</p>

                                                            <Button
                                                                className="detail-button"
                                                                size="large"
                                                                onClick={() => { history.push(`/student-quiz/do-test/${combinedId}/view-result`) }}
                                                            >
                                                                Xem chi ti???t
                                                            </Button>
                                                        </Card>

                                                    </Badge.Ribbon>
                                                </div>
                                                : null
                                        }
                                        {
                                            status === "COMPLETED" ?
                                                <div>
                                                    <Badge.Ribbon
                                                        text={<p style={{ fontSize: '16px' }}>??i???m: {score}/{totalScore}</p>}
                                                        color="blue"
                                                    // placement="start"
                                                    >
                                                        <Card
                                                            className="finish-card"
                                                            style={{ marginTop: '25px' }}
                                                        // tabBarExtraContent="Hello"
                                                        >
                                                            <p
                                                            // style={{marginTop: '30px'}}
                                                            >
                                                                <span style={{ fontWeight: '900' }}>???? n???p b??i thi l??c: </span>
                                                                <span style={{ color: '#1273EB' }}>{showTime(new Date(submitTime))}</span>
                                                            </p>
                                                            <p><CheckOutlined style={{ marginRight: '6px', color: 'blue' }} />S??? c??u ???? l??m: {countFinish(answers)}/{total}</p>
                                                            <Progress
                                                                percent={(countFinish(answers) / total * 100).toFixed(1)}
                                                                // percent={Math.round(countFinish(answers) / total * 100, 2)}
                                                                trailColor='#DDDDE2'
                                                                style={{ width: '40%', marginBottom: '15px' }}
                                                                size="small"
                                                            />
                                                            <p><CheckOutlined style={{ marginRight: '6px', color: 'green' }} />S??? c??u l??m ????ng: {numberOfCorrectAnswers}/{total}</p>
                                                            <Progress
                                                                percent={(numberOfCorrectAnswers / total * 100).toFixed(1)}
                                                                // percent={Math.round(countFinish(answers) / total * 100, 2)}
                                                                strokeColor="#52c41a"
                                                                // trailColor='#FA5B3C'
                                                                style={{ width: '40%', marginBottom: '15px' }}
                                                                size="small"
                                                            />
                                                            <p><FieldTimeOutlined style={{ marginRight: '6px' }} />Th???i gian ho??n th??nh: {Math.min((submitTime - start) / 1000 / 60, duration).toFixed(1)} ph??t</p>

                                                            <Button
                                                                className="detail-button"
                                                                size="large"
                                                                onClick={() => { history.push(`/student-quiz/do-test/${combinedId}/view-result`) }}
                                                            >
                                                                Xem chi ti???t
                                                 </Button>
                                                        </Card>

                                                    </Badge.Ribbon>
                                                </div>
                                                : null
                                        }

                                    </div>

                                }
                            </div>
                            :
                            <div>
                                <p></p>
                            </div>
                        }

                    </div>
                    :
                    <div>
                        <Spin spinning={true} tip="??ang t???i">
                            <p style={{ color: '#fff' }}>Hello</p>
                        </Spin>
                    </div>
            }

        </StudentDoTestWrapper>
    )
}

export default StudentDoTest;
