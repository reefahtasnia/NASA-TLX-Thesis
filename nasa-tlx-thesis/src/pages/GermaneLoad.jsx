import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Alert,
} from 'reactstrap';
import Menubar from '../components/Menubar';
import Loading from '../components/Loading';
import { saveGermaneLoadResponse, getGermaneLoadResponse, getParticipant, createParticipant } from '../services/firebase';

const GermaneLoad = () => {
  const navigate = useNavigate();
  const [participantId, setParticipantId] = useState('');
  const [participantIdSubmitted, setParticipantIdSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [success, setSuccess] = useState('');
  const [checkingParticipant, setCheckingParticipant] = useState(false);

  const questions = [
    {
      id: 'q1',
      question: 'What specific item was found on top of the wreckage chest on the beach?',
      label: 'Finding Items',
      maxPoints: 1
    },
    {
      id: 'q2',
      question: 'What was the name of the captain?',
      label: 'Recalling Names',
      maxPoints: 1
    },
    {
      id: 'q3',
      question: 'What was found beside the captain in the temple?',
      label: 'Recalling Names',
      maxPoints: 1
    },
    {
      id: 'q4',
      question: 'Where was the portion of the map located that led to the hidden temple?',
      label: 'Recalling Map',
      maxPoints: 1
    },
    {
      id: 'q5',
      question: 'What was the name of the character?',
      label: 'Recalling Names',
      maxPoints: 2
    },
    {
      id: 'q6',
      question: 'Besides the trunks and the letter, what specifically was in the temple alcove that frightened the character?',
      label: 'Recalling Details',
      maxPoints: 1
    },
    {
      id: 'q7',
      question: 'Why did the character decide to enter the unstable portal in the forest instead of staying on the beach?',
      label: 'Critical Thinking',
      maxPoints: 3
    },
    {
      id: 'q8',
      question: 'What is the functional purpose of the "Ancient Key" according to the Captain\'s second letter?',
      label: 'Critical Thinking',
      maxPoints: 5
    },
  ];

  const [responses, setResponses] = useState(
    questions.reduce((acc, q) => ({ ...acc, [q.id]: '' }), {})
  );

  const handleParticipantIdSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setWarning('');
    setSuccess('');

    if (!participantId || participantId.trim() === '') {
      setError('Please enter a Participant ID');
      return;
    }

    setCheckingParticipant(true);

    try {
      // Check if participant exists in participants table
      const participantResult = await getParticipant(participantId);
      
      if (!participantResult.exists) {
        // Create a basic participant entry if doesn't exist
        const createResult = await createParticipant(participantId, {
          source: 'Germane Load Only',
          createdAt: new Date().toISOString()
        });
        
        if (!createResult.success) {
          setError('Failed to create participant entry. Please try again.');
          setCheckingParticipant(false);
          return;
        }
      }

      // Check if germane load response already exists (allow overwriting)
      const germaneResult = await getGermaneLoadResponse(participantId);
      if (germaneResult.exists) {
        // Show warning but allow to continue and overwrite
        setWarning('⚠️ Note: You have previously submitted this questionnaire. Submitting again will overwrite your previous responses.');
      }
      
      setParticipantIdSubmitted(true);
    } catch (err) {
      console.error('Error checking participant:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setCheckingParticipant(false);
    }
  };

  useEffect(() => {
    // No longer needed since we get participant ID from form
  }, []);

  const handleChange = (questionId, value) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const validateForm = () => {
    for (const question of questions) {
      if (!responses[question.id] || responses[question.id].trim() === '') {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setError('Please answer all questions before submitting.');
      return;
    }

    setLoading(true);

    try {
      // Save/overwrite germane load response
      const result = await saveGermaneLoadResponse(participantId, {
        responses,
        participantId,
      });

      if (result.success) {
        setSuccess('Thank you! Your responses have been submitted successfully.');
        setTimeout(() => {
          navigate('/germane-load-dashboard');
        }, 2000);
      } else {
        setError(result.error || 'Failed to save responses. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting responses:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingParticipant || loading) {
    return <Loading fullScreen />;
  }

  // Show participant ID form first
  if (!participantIdSubmitted) {
    return (
      <>
        <Menubar />
        <Container className="my-5">
          <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6}>
              <Card>
                <CardHeader>
                  <h3 className="mb-0">Germane Load Questionnaire</h3>
                </CardHeader>
                <CardBody>
                  <p className="mb-4">
                    Please enter your Participant ID to begin the questionnaire.
                  </p>

                  {error && (
                    <Alert color="danger" className="mb-4">
                      {error}
                    </Alert>
                  )}

                  {warning && (
                    <Alert color="warning" className="mb-4">
                      {warning}
                    </Alert>
                  )}

                  <Form onSubmit={handleParticipantIdSubmit}>
                    <FormGroup>
                      <Label for="participantId">Participant ID *</Label>
                      <Input
                        type="text"
                        id="participantId"
                        name="participantId"
                        value={participantId}
                        onChange={(e) => setParticipantId(e.target.value)}
                        placeholder="Enter your participant ID"
                      />
                    </FormGroup>
                  </Form>
                </CardBody>
                <CardFooter className="text-end">
                  <Button
                    color="primary"
                    size="lg"
                    onClick={handleParticipantIdSubmit}
                    disabled={checkingParticipant}
                  >
                    Continue
                  </Button>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  // Show questionnaire form

  return (
    <>
      <Menubar />
      <Container className="my-4">
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8}>
            <Card>
              <CardHeader>
                <h3 className="mb-0">Germane Load Questionnaire</h3>
                <p className="text-muted mb-0 mt-2">Participant ID: <strong>{participantId}</strong></p>
              </CardHeader>
              <CardBody>
                {error && (
                  <Alert color="danger" className="mb-4">
                    {error}
                  </Alert>
                )}

                {warning && (
                  <Alert color="warning" className="mb-4">
                    {warning}
                  </Alert>
                )}

                {success && (
                  <Alert color="success" className="mb-4">
                    {success}
                  </Alert>
                )}

                <p className="mb-4">
                  Please answer the following questions about your experience. Provide detailed responses in your own words.
                </p>

                <Form onSubmit={handleSubmit}>
                  {questions.map((question, index) => (
                    <FormGroup key={question.id} className="mb-4">
                      <Label for={question.id} className="fw-bold">
                        {index + 1}. {question.question}
                      </Label>
                      <Input
                        type="textarea"
                        id={question.id}
                        name={question.id}
                        value={responses[question.id]}
                        onChange={(e) => handleChange(question.id, e.target.value)}
                        rows="4"
                        placeholder="Please provide a detailed response..."
                        disabled={!!success}
                      />
                    </FormGroup>
                  ))}
                </Form>
              </CardBody>
              <CardFooter className="text-end">
                <Button
                  color="secondary"
                  className="me-2"
                  onClick={() => navigate('/dashboard')}
                >
                  View Dashboard
                </Button>
                <Button
                  color="primary"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={loading || !!success}
                >
                  Submit Responses
                </Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default GermaneLoad;
