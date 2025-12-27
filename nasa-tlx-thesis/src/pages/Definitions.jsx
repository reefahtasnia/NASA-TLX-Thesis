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
import definitions from '../lib/definitions';

const Definitions = () => {
  const { participantId } = useParams();
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate(`/tlx/${participantId}/rating`);
  };

  const definitionsList = Object.keys(definitions).map((key) => (
    <div key={key} className="row mb-3">
      <dt className="col-md-3 col-xl-2 mt-2 fw-bold">{key}</dt>
      <dd className="col-md-9 col-xl-10 mt-2 text-justify">{definitions[key]}</dd>
    </div>
  ));

  return (
    <>
      <Menubar />
      <Container className="my-4">
        <Row className="justify-content-center">
          <Col xs={12} lg={10} xl={8}>
            <Card>
              <CardHeader tag="h3">Definitions</CardHeader>
              <CardBody>
                <dl className="mb-0">{definitionsList}</dl>
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

export default Definitions;
