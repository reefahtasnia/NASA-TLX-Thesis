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
  Alert,
} from 'reactstrap';
import Menubar from '../components/Menubar';
import { getParticipant } from '../services/firebase';
import Loading from '../components/Loading';

const Home = () => {
  const navigate = useNavigate();
  const [participantId, setParticipantId] = useState('');
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateId = () => {
    const newId = uuidv4().split('-')[0]; // Short UUID (8 characters)
    setParticipantId(newId);
    setError('');
    setWarning('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!participantId || participantId.trim() === '') {
      setError('Please enter or generate a Participant ID');
      return;
    }

    setLoading(true);
    setError('');
    setWarning('');

    try {
      // Check if participant ID already exists
      const existingParticipant = await getParticipant(participantId);
      
      if (existingParticipant.exists) {
        setWarning('⚠️ Warning: This Participant ID already exists in the database. If you continue, you may overwrite existing data.');
        setLoading(false);
        return;
      }

      // Navigate to participant info form
      navigate(`/participant/${participantId}`);
    } catch (err) {
      console.error('Error checking participant:', err);
      setError('An error occurred while checking the Participant ID. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueAnyway = () => {
    setWarning('');
    navigate(`/participant/${participantId}`);
  };

  const handleChange = (e) => {
    setParticipantId(e.target.value);
    if (error) setError('');
    if (warning) setWarning('');
  };

  if (loading) {
    return <Loading fullScreen />;
  }

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
                
                {warning && (
                  <Alert color="warning" className="mb-4">
                    {warning}
                    <div className="mt-3 text-end">
                      <Button color="secondary" size="sm" className="me-2" onClick={() => setWarning('')}>
                        Cancel
                      </Button>
                      <Button color="warning" size="sm" onClick={handleContinueAnyway}>
                        Continue Anyway
                      </Button>
                    </div>
                  </Alert>
                )}

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
                <Button color="primary" size="lg" onClick={handleSubmit} disabled={!!warning}>
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
