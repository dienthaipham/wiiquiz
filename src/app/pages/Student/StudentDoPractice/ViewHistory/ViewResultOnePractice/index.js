import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from "react-router-dom";
import { ViewResultOnePracticeWrapper } from "./ViewResultOnePracticeStyle";
import { Affix, Col, Row, Checkbox, Radio, Card, Spin, Button } from "antd";
import { CaretRightOutlined, LeftCircleOutlined, RightCircleOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';

import Correct from "assets/images/correct.png";
import Wrong from "assets/images/wrong.png";

import {
    getPracticeHistoryAPI
} from 'app/api/quiz';


function ViewResultOnePractice() {

    const { studentId, combinedId, practiceId } = useParams();
    console.log('QUIZ', combinedId);

    const dispatch = useDispatch();
    const history = useHistory();

    const [quizName, setQuizName] = useState("");
    const [studentName, setStudentName] = useState("");
    // const [studentId, setStudentId] = useState("");
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
    // const [answers, setAnswers] = useState([[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]]);
    const [answers, setAnswers] = useState(Array(100).fill([0]));
    // const [correctAnswers, setCorrectAnswers] = useState([[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]]);
    const [correctAnswers, setCorrectAnswers] = useState(Array(100).fill([0]));
    const [current, setCurrent] = useState(1);

    const [loading, setLoading] = useState(false);



    const getResult = async () => {
        try {
            setLoading(true);
            let res = await getPracticeHistoryAPI({ combinedId: combinedId });

            if (res.code === 1) {
                setDuration(res.data.quiz.duration);
                setQuizName(res.data.quiz.name);
                setStudentName(res.data.user.fullname);
                setGrade(res.data.quiz.grade);

                setDuration(res.data.quiz.duration);
                setStart(res.data.practice[parseInt(practiceId) - 1].startDate);
                setSubmitTime(res.data.practice[parseInt(practiceId) - 1].submitDate);
                setAnswers(res.data.practice[parseInt(practiceId) - 1].userAnswer);

                setTotal(res.data.quiz.questions.length);
                // setScore(res.data.practice[parseInt(practiceId) - 1].score);

                setQuestions(res.data.quiz.questions);
                // setAnswers(res.data.userAnswer);
                setCorrectAnswers(res.data.correctAnswers);


                // setNumberOfCorrectAnswers(res.data.practice[parseInt(practiceId) - 1].numberOfCorrectAnswers);

                console.log('quizzes: ++++++++', res.data.practice[parseInt(practiceId) - 1].startDate);
                console.log('quizzes: ++++++++', res.data.practice[parseInt(practiceId) - 1].submitDate);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // studentDoPractice();
        // return () => { };
        getResult();
        console.log("KAKAKAKAKAKAKKAKAKAKAKAKKAKAKAKAKKAKAKak")
    }, []);




    const handleButtonClick = async (value) => {
        setCurrent(value);
    }

    const nextQuestion = async () => {
        setCurrent(current + 1 > total ? 1 : current + 1);
    }

    const backQuestion = async () => {
        setCurrent(current - 1 === 0 ? total : current - 1);
    }

    const optionStatus = () => {
        if (status === 'SUBMITTED') {
            console.log('MY CHECKBOX')
            return "my-checkbox"
        }
        else {
            console.log('MY CHECKBOX ____')
            return answers[current - 1][0] === correctAnswers[current - 1][0]
                ? "my-correct-checkbox" : "my-wrong-checkbox"
        }
    }

    const optionStatusMultiple = (index) => {
        if (status === 'SUBMITTED') {
            console.log('MY CHECKBOX')
            return "my-checkbox"
        }
        else {
            console.log('MY CHECKBOX ____')
            if (correctAnswers[current - 1].includes(index)) {
                return "my-correct-checkbox-multiple"
            }
            else {
                return "my-wrong-checkbox-multiple"
            }
        }
    }


    const options = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    const oneAnswerRender = (number, multiple, choices) => {
        if (multiple === true) {
            const optionsRender = options.slice(0, number).map((x, index) => (
                <Checkbox 
                    value={index} 
                    className={optionStatusMultiple(index)}
                >
                    {x}
                </Checkbox>
            ));
            return (
                <Checkbox.Group
                    style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '0px' }}
                    // defaultValue={[1, 0]}
                    value={answers[current - 1]}
                // onChange={onChangeMultiple}
                >
                    {optionsRender}
                </Checkbox.Group>
            )
        }
        else {
            const optionsRender = options.slice(0, number).map((x, index) => (
                <Radio
                    value={index}
                    className={optionStatus()}
                >
                    {x}
                </Radio>
            ));
            return (
                <Radio.Group
                    size="large"
                    style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '0px' }}
                    // defaultValue={0}
                    value={answers[current - 1][0]}
                // onChange={onChangeSingle}
                >
                    {optionsRender}
                </Radio.Group>
            )
        }
    }

    const compareTwoAnswers = (answers, correctAnswers) => {
        if (answers.length !== correctAnswers.length) {
            return false
        }
        else {
            var i;
            for (i = 0; i < answers.length; i++) {
                if (answers[i] !== correctAnswers[i]) {
                    return false;
                }
            }
        }
        return true
    }

    const buttonStatus = (x_, index, active) => {
        // if (status === "DONE") {
        if (active === true) {
            if (x_.length == 0) {
                return "wrong-active"
            }
            else {
                // return x_[0] === correctAnswers[index][0] ? "correct-active" : "wrong-active"
                return compareTwoAnswers(x_, correctAnswers[index]) ? "correct-active" : "wrong-active"
            }
        }
        else {
            if (x_.length == 0) {
                return "wrong"
            }
            else {
                // return x_[0] === correctAnswers[index][0] ? "correct" : "wrong"
                return compareTwoAnswers(x_, correctAnswers[index]) ? "correct" : "wrong"
            }
        }

    }

    const buttonRender = answers.map((x, index) => (
        <div >
            {(index + 1) === current ?
                <Button
                    key={index}
                    className="button-item"
                    // id="active"
                    id={buttonStatus(x, index, true)}
                    // size="small"
                    onClick={() => handleButtonClick(index + 1)}>
                    {index + 1}
                </Button>
                : null}
            {(index + 1) !== current ?
                <Button
                    key={index}
                    className="button-item"
                    id={buttonStatus(x, index, false)}
                    // size="small"
                    onClick={() => handleButtonClick(index + 1)}>
                    {index + 1}
                </Button>
                : null}
        </div>
    ));



    const correctAnswersString = (correctAnswers) => {
        const len = correctAnswers.length
        if (len <= 1) {
            return options[correctAnswers[0]]
        }
        else {
            let str = "";
            var i;
            for (i = 0; i < len; i++) {
                if (i !== len - 1) {
                    str = str + options[correctAnswers[i]] + ", ";
                }
                else {
                    str = str + options[correctAnswers[i]];
                }
            }
            return str
        }
    }

    return (
        <ViewResultOnePracticeWrapper>
            {
                loading === false ?
                    <div>
                        {true ?
                            <div>
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
                                                    Đề: {quizName}
                                                </p>
                                                <Row>
                                                    <Col span={12}>
                                                        <p className="quiz-info">
                                                            Thời gian: {duration} phút
                                                        </p>
                                                    </Col>
                                                    <Col span={12}>
                                                        <p className="quiz-info">
                                                            Số câu: {total}
                                                        </p>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col span={12}>
                                                <p className="quiz-info">
                                                    Học sinh: {studentName} ({studentId})
                                                </p>
                                                <p className="quiz-info">
                                                    Lớp: {grade}
                                                </p>
                                            </Col>
                                        </Row>
                                    </p>
                                </div>

                                <div>
                                    <Row align='middle'>
                                        <Col span={3}>
                                            <p style={{ fontSize: '18px', fontWeight: '900', margin: '0px' }}><CaretRightOutlined />Câu {current}/{total}</p>
                                        </Col>
                                        <Col span={12}>
                                            {
                                                // answers[current - 1][0] === correctAnswers[current - 1][0] ?
                                                compareTwoAnswers(answers[current - 1], correctAnswers[current - 1]) ?
                                                    <p style={{ fontSize: '18px', fontWeight: '900', margin: '0px', color: 'green' }}>
                                                        <img className="fg-item" id="f" src={Correct} alt="Tick"
                                                            style={{
                                                                paddingBottom: '0px',
                                                                height: '26px'
                                                            }}>
                                                        </img>
                                                    </p>
                                                    :
                                                    <p style={{ fontSize: '18px', fontWeight: '900', margin: '0px', color: 'red' }}>

                                                        <img className="fg-item" id="f" src={Wrong} alt="Tick"
                                                            style={{
                                                                paddingBottom: '0px',
                                                                height: '26px'
                                                            }}>
                                                        </img>
                                                    </p>
                                            }
                                        </Col>
                                        <Col span={4}>
                                            <p style={{ fontSize: '18px', margin: '0px' }}>Đáp án: {correctAnswersString(correctAnswers[current - 1])}</p>
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
                                            <Card style={{ marginTop: '20px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <img
                                                        src={questions[current - 1].image}
                                                        style={{
                                                            maxWidth: '935px',
                                                            height: 'auto'
                                                        }}
                                                    />
                                                </div>
                                                {oneAnswerRender(questions[current - 1].numberOfAnswer, questions[current - 1].multipleAnswers, answers[current - 1])}

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
                                        style={{
                                            display: 'flex',
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
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <div className="item">
                                                    <Button
                                                        id="move-button"
                                                        onClick={backQuestion}
                                                    >
                                                        <LeftOutlined />Quay lại
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
                                                        Tiếp theo<RightOutlined />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Affix>
                                    </div>
                                </div>

                            </div>
                            :
                            <div>
                                <p></p>
                            </div>
                        }

                    </div>
                    :
                    <div>
                        <Spin spinning={true} tip="Đang tải">
                            <p style={{ color: '#fff' }}>Hello</p>
                        </Spin>
                    </div>
            }

        </ViewResultOnePracticeWrapper>
    )
}

export default ViewResultOnePractice;
