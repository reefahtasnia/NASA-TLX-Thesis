import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardFooter,
  Button,
} from 'reactstrap';
import Menubar from '../components/Menubar';

const End = () => {
  const { participantId } = useParams();
  const navigate = useNavigate();

  const handleViewResults = () => {
    navigate(`/results/${participantId}`);
  };

  return (
    <>
      <Menubar />
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8}>
            <Card>
              <CardBody className="text-center py-5">
                <div className="mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="80"
                    height="80"
                    fill="currentColor"
                    className="text-success"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                  </svg>
                </div>
                <h1 className="display-4 mb-3">Thank You!</h1>
                <p className="lead mb-4">
                  You have successfully completed the NASA-TLX questionnaire.
                </p>
                <p className="text-muted">
                  Your responses have been recorded. You can now view your results or close this window.
                </p>
              </CardBody>
              <CardFooter className="text-center">
                <Button color="primary" size="lg" onClick={handleViewResults}>
                  View My Results
                </Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default End;
