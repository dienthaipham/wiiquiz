import React from 'react';
import { Layout, Row, Col } from 'antd';
import { LogoHeaderWrapper } from './LogoHeaderStyle';

import Logo from "assets/images/main-logo.png";
import Wiiquiz from "assets/images/wiiquiz-logo.png";


const { Header } = Layout;

function LogoHeader() {

  return (
    <LogoHeaderWrapper>
      <Header>
        <Row>
          <Col span={4}>
            <div>
              {/* <div style={{}}>
                <img className="logo" src={Logo} style={{ height: '50px' }} />
              </div> */}
              <div style={{paddingLeft: '10px'}}>
                <img className="main-logo" src={Logo} style={{ height: '50px' }} />
                <img className="wiiquiz-logo" src={Wiiquiz} style={{ height: '35px', paddingLeft: '10px' }} />
              </div>

            </div>
          </Col>
        </Row>
      </Header>
    </LogoHeaderWrapper>
  );
};

export default LogoHeader;
