import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import Loading from '../components/Loading';
import { createParticipant, getParticipant } from '../services/firebase';

const ParticipantInfo = () => {
  const navigate = useNavigate();
  const { participantId } = useParams();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    age: '',
    major: '',
    gamingExperience: '',
    gamingDuration: '',
    gamingPlatform: '',
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear gaming details if experience is "none"
    if (name === 'gamingExperience' && value === 'none') {
      setFormData(prev => ({
        ...prev,
        gamingDuration: '',
        gamingPlatform: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email || !formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.age || formData.age < 1 || formData.age > 120) {
      newErrors.age = 'Please enter a valid age';
    }

    if (!formData.major || formData.major.trim() === '') {
      newErrors.major = 'Please enter your major/field of study';
    }

    if (!formData.gamingExperience) {
      newErrors.gamingExperience = 'Please select your gaming experience level';
    }

    // If experienced, validate additional fields
    if (formData.gamingExperience !== 'none') {
      if (!formData.gamingDuration || formData.gamingDuration.trim() === '') {
        newErrors.gamingDuration = 'Please specify how long you have been gaming';
      }
      if (!formData.gamingPlatform) {
        newErrors.gamingPlatform = 'Please select your gaming platform';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Check if participant already exists
      const existingParticipant = await getParticipant(participantId);
      
      if (existingParticipant.exists && existingParticipant.data.completed) {
        setError('This participant ID has already completed the assessment. Please use a different ID.');
        setLoading(false);
        return;
      }

      // Create participant in Firebase
      const result = await createParticipant(participantId, formData);

      if (result.success) {
        // Navigate to AboutTLX page
        navigate(`/tlx/${participantId}/about`);
      } else {
        setError(result.error || 'Failed to save participant information');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <>
      <Menubar />
      <Container fluid className="my-4">
        <Row className="justify-content-center">
          <Col xs={12} sm={11} md={10} lg={8} xl={6}>
            <Card>
              <CardHeader tag="h3">
                Participant Information
              </CardHeader>
              <CardBody>
                <p className="text-muted mb-4">
                  Participant ID: <strong>{participantId}</strong>
                </p>
                <p className="text-muted mb-4">
                  Please provide your information below. All fields are required.
                </p>

                {error && (
                  <Alert color="danger" className="mb-4">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {/* Email */}
                  <FormGroup>
                    <Label for="email">Email Address *</Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      invalid={!!errors.email}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && <FormFeedback>{errors.email}</FormFeedback>}
                  </FormGroup>

                  {/* Age */}
                  <FormGroup>
                    <Label for="age">Age *</Label>
                    <Input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      invalid={!!errors.age}
                      placeholder="Enter your age"
                      min="1"
                      max="120"
                    />
                    {errors.age && <FormFeedback>{errors.age}</FormFeedback>}
                  </FormGroup>

                  {/* Major/Field of Study */}
                  <FormGroup>
                    <Label for="major">Major/Field of Study *</Label>
                    <Input
                      type="text"
                      id="major"
                      name="major"
                      value={formData.major}
                      onChange={handleChange}
                      invalid={!!errors.major}
                      placeholder="e.g., Computer Science, Engineering, Business"
                    />
                    {errors.major && <FormFeedback>{errors.major}</FormFeedback>}
                  </FormGroup>

                  {/* Gaming Experience */}
                  <FormGroup>
                    <Label for="gamingExperience">Experience with Video/Console Games *</Label>
                    <Input
                      type="select"
                      id="gamingExperience"
                      name="gamingExperience"
                      value={formData.gamingExperience}
                      onChange={handleChange}
                      invalid={!!errors.gamingExperience}
                    >
                      <option value="">-- Select your experience level --</option>
                      <option value="none">None</option>
                      <option value="rarely">Rarely</option>
                      <option value="occasionally">Occasionally</option>
                    </Input>
                    {errors.gamingExperience && (
                      <FormFeedback>{errors.gamingExperience}</FormFeedback>
                    )}
                  </FormGroup>

                  {/* Gaming Duration (conditional) */}
                  {formData.gamingExperience && formData.gamingExperience !== 'none' && (
                    <>
                      <FormGroup>
                        <Label for="gamingDuration">How long have you been gaming? *</Label>
                        <Input
                          type="text"
                          id="gamingDuration"
                          name="gamingDuration"
                          value={formData.gamingDuration}
                          onChange={handleChange}
                          invalid={!!errors.gamingDuration}
                          placeholder="e.g., 2 years, 6 months"
                        />
                        {errors.gamingDuration && (
                          <FormFeedback>{errors.gamingDuration}</FormFeedback>
                        )}
                      </FormGroup>

                      {/* Gaming Platform (conditional) */}
                      <FormGroup>
                        <Label for="gamingPlatform">Preferred Gaming Platform *</Label>
                        <Input
                          type="select"
                          id="gamingPlatform"
                          name="gamingPlatform"
                          value={formData.gamingPlatform}
                          onChange={handleChange}
                          invalid={!!errors.gamingPlatform}
                        >
                          <option value="">-- Select platform --</option>
                          <option value="PC">PC Gaming</option>
                          <option value="Console">Console Gaming</option>
                          <option value="Both">Both PC and Console</option>
                        </Input>
                        {errors.gamingPlatform && (
                          <FormFeedback>{errors.gamingPlatform}</FormFeedback>
                        )}
                      </FormGroup>
                    </>
                  )}
                </Form>
              </CardBody>
              <CardFooter className="text-end">
                <Button
                  color="secondary"
                  className="me-2"
                  onClick={() => navigate('/')}
                >
                  Back
                </Button>
                <Button
                  color="primary"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  Continue to Assessment
                </Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ParticipantInfo;
