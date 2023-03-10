import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Button, Typography, Skeleton, Select, Space, Modal, Table, Tag } from 'antd';
import { PracticeWrapper } from './PracticeStyle';
import ReactHtmlParser from 'react-html-parser';

import { CardPractice } from 'app/components/CardPractice';
import { FileTextOutlined, FieldTimeOutlined } from '@ant-design/icons';

import { useHistory } from "react-router-dom";

import { selectAllStudent } from 'app/store/student';

import {
  getListPraticeAPI
} from 'app/api/quiz';


function Practice() {
  const { Title } = Typography;
  const { Option } = Select;

  const [practices, setPratices] = useState([]);
  const [practicesLoading, setPraticesLoading] = useState(true);

  const [quizButtonClick, setQuizButtonClick] = useState(false);
  const [click, setClick] = useState(false);

  const [buttonLoading, setButtonLoading] = useState(false);
  const [hover, setHover] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  // const columns = [{ title: "Tên", dataIndex: "fullname" }];
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

  // let dataSource;

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    getPratices();
  }, []);

  const getPratices = async () => {
    try {
      // setExpiredQuizzesLoading(true);
      let res = await getListPraticeAPI();
      if (res.code === 1) {
        setPraticesLoading(false);
        setPratices(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <PracticeWrapper>
      <Title level={3}><FileTextOutlined style={{ marginRight: '10px' }} />Tất cả các bài luyện tập </Title>

      <Skeleton active loading={practicesLoading}>
        <div>
          <Row gutter={[16, 16]}>
            {practices.map(practice => (
              <Col sm={12} xl={8} style={{ paddingRight: 30 }} key={practice._id}>
                <CardPractice
                  quizOfStudent={false}
                  status={null}
                  quizId={practice._id}
                  studentId={null}
                  quizButtonClick={quizButtonClick}
                  // title={practice.name.length < 21 ? practice.name : practice.name.substring(0, 21) + "..."}
                  title={
                    <div style={{display: 'inline'}}>
                      {practice.name}
                    </div>
                  }
                  imgUrl={practice.images.cover}
                  description={
                    <div>
                      {/* <div>{ReactHtmlParser(practice.description)}</div> */}
                      <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
                        <Tag color="blue" >
                          Đề {practice.language === "VIETNAMESE" ? "Tiếng Việt" : "Tiếng Anh"}
                        </Tag>
                      </div>
                    </div>
                  }
                  actions={[
                    <Row align="middle">
                      <Col span={7}>
                        <p className="quiz-info">
                          {/* <UserOutlined style={{paddingRight: '5px'}}/> */}
                              Lớp {practice.grade}
                        </p>
                      </Col>
                      <Col span={7}>
                        <p className="quiz-info">
                          <FieldTimeOutlined style={{ paddingRight: '5px' }} />{practice.duration} phút
                            </p>
                      </Col>
                      <Col span={10}>
                        <Button
                          className="active-button"
                          size="large"
                          onMouseEnter={() => {
                            setQuizButtonClick(true);
                          }}
                          onMouseLeave={() => {
                            if (click == false) {
                              setQuizButtonClick(false);
                            }

                          }}
                          onClick={() => {
                            setSelectedStudentId(practice._id);
                            setClick(true);
                            setQuizButtonClick(true);
                            setVisible(true);
                          }}
                        >
                          Làm bài
                        </Button>
                        <Modal
                          centered
                          onCancel={() => {
                            setQuizButtonClick(false);
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
                          maskStyle={{
                            background: 'rgba(0, 0, 0, 0.2)'
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
                                setQuizButtonClick(false);
                                setVisible(false);
                                setSelectedRowKeys([]);
                                setButtonLoading(false);
                              }}
                            >
                              Hủy
                            </Button>
                            <Button
                              size="large"
                              type="primary"
                              loading={buttonLoading}
                              style={{ borderRadius: '5px', marginTop: '20px', fontSize: '16px', fontWeight: '900' }}
                              onClick={() => {
                                // handleAssignChildToTest(selectedRowKeys);
                                console.log('((((((((((((SELECTED))', selectedRowKeys);
                                if (selectedRowKeys.length > 0) {
                                  history.push(`practice/${selectedStudentId}/${selectedRowKeys[0]}`)
                                }
                              }}
                            >
                              Đồng ý
                            </Button>
                          </Space>
                        </Modal>
                      </Col>
                    </Row>
                  ]}
                />
              </Col>
            ))}
          </Row>
        </div>
      </Skeleton>



    </PracticeWrapper>
  );
}

export default Practice;