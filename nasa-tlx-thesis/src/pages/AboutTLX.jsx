import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
} from 'reactstrap';
import Menubar from '../components/Menubar';
import instructions from '../lib/instructions';

const AboutTLX = () => {
  const { participantId } = useParams();
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate(`/tlx/${participantId}/definitions`);
  };

  return (
    <>
      <Menubar />
      <Container className="my-4">
        <Row className="justify-content-center">
          <Col xs={12} lg={10} xl={8}>
            <Card>
              <CardHeader tag="h3">Instructions</CardHeader>
              <CardBody>
                <div className="mt-3">
                  {instructions.instructions.map((paragraph, index) => (
                    <p key={index} className="mb-3">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardBody>
              <CardFooter className="text-end">
                <Button color="primary" size="lg" onClick={handleContinue}>
                  Continue
                </Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AboutTLX;
