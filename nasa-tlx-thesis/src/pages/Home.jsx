import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  FormFeedback,
} from 'reactstrap';
import Menubar from '../components/Menubar';

const Home = () => {
  const navigate = useNavigate();
  const [participantId, setParticipantId] = useState('');
  const [error, setError] = useState('');

  const handleGenerateId = () => {
    const newId = uuidv4().split('-')[0]; // Short UUID (8 characters)
    setParticipantId(newId);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!participantId || participantId.trim() === '') {
      setError('Please enter or generate a Participant ID');
      return;
    }

    // Navigate to participant info form
    navigate(`/participant/${participantId}`);
  };

  const handleChange = (e) => {
    setParticipantId(e.target.value);
    if (error) setError('');
  };

  return (
    <>
      <Menubar />
      <Container fluid className="mt-5">
        <Row className="justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <Card>
              <CardHeader tag="h3" className="text-center">
                NASA TLX Assessment
              </CardHeader>
              <CardBody>
                <p className="text-muted text-center mb-4">
                  Welcome! Please enter or generate a unique Participant ID to begin the assessment.
                </p>
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label for="participantId">Participant ID</Label>
                    <div className="d-flex gap-2">
                      <Input
                        type="text"
                        id="participantId"
                        name="participantId"
                        value={participantId}
                        onChange={handleChange}
                        invalid={!!error}
                        placeholder="Enter participant ID"
                        className="flex-grow-1"
                      />
                      <Button
                        type="button"
                        color="secondary"
                        onClick={handleGenerateId}
                      >
                        Generate
                      </Button>
                    </div>
                    {error && <FormFeedback className="d-block">{error}</FormFeedback>}
                  </FormGroup>
                </Form>
              </CardBody>
              <CardFooter className="text-end">
                <Button color="primary" size="lg" onClick={handleSubmit}>
                  Start Assessment
                </Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
