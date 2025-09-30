import React, { Fragment } from 'react'
import { Col, Container, Row } from 'react-bootstrap'

const TopPageDetails = ({ pageTitle }) => {
  return (
    <Fragment>
      <Container  fluid={true} className='top-page-banner  p-0'>
        <div className='top-page-layout'>
          <Container>
            <Row>
              <Col className='top-page-text'>
                <h1 className='top-page-title'>{pageTitle}</h1>
              </Col>
            </Row>
          </Container>
        </div>
      </Container>
    </Fragment>
  );
};

export default TopPageDetails