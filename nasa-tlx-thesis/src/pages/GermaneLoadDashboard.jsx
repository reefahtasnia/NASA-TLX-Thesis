import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Table,
  Button,
  Alert,
  Badge,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import Menubar from '../components/Menubar';
import Loading from '../components/Loading';
import { getAllGermaneLoadResponses, saveGermaneLoadScores } from '../services/firebase';

// Question definitions with max points
const questions = [
  { id: 'q1', question: 'Did you try to find connections between the information that was presented and things you already knew?', maxPoints: 10 },
  { id: 'q2', question: 'Did you try to understand how the information could be applied in practice?', maxPoints: 10 },
  { id: 'q3', question: 'Did you think about how the information relates to other things you have learned?', maxPoints: 10 },
  { id: 'q4', question: 'Did you try to combine different pieces of information to create new insights?', maxPoints: 15 },
  { id: 'q5', question: 'Did you actively think about what the information means?', maxPoints: 15 },
  { id: 'q6', question: 'Did you try to understand the underlying concepts rather than just memorizing?', maxPoints: 20 },
  { id: 'q7', question: 'Did you think critically about the information presented?', maxPoints: 20 },
];

const getTotalMaxPoints = () => questions.reduce((sum, q) => sum + q.maxPoints, 0);

const GermaneLoadDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [responses, setResponses] = useState([]);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [isGrading, setIsGrading] = useState(false);
  const [scores, setScores] = useState({});

  useEffect(() => {
    loadResponses();
  }, []);

  const loadResponses = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await getAllGermaneLoadResponses();
      
      if (result.success) {
        setResponses(result.data);
      } else {
        setError(result.error || 'Failed to load responses');
      }
    } catch (err) {
      console.error('Error loading responses:', err);
      setError('An error occurred while loading responses');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const viewDetails = (response) => {
    setSelectedResponse(response);
    setIsGrading(false);
    // Initialize scores if already graded
    if (response.scores) {
      setScores(response.scores);
    } else {
      setScores({});
    }
    setError('');
    setSuccess('');
  };

  const startGrading = () => {
    setIsGrading(true);
    setError('');
    setSuccess('');
  };

  const handleScoreChange = (questionId, value) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) || value === '') {
      setScores(prev => ({ ...prev, [questionId]: value === '' ? '' : numValue }));
    }
  };

  const calculateTotalScore = () => {
    return Object.values(scores).reduce((sum, score) => sum + (parseFloat(score) || 0), 0);
  };

  const validateScores = () => {
    for (const question of questions) {
      const score = scores[question.id];
      if (score === undefined || score === '') {
        return { valid: false, message: 'Please grade all questions' };
      }
      if (score < 0 || score > question.maxPoints) {
        return { valid: false, message: `Score for question ${question.id} must be between 0 and ${question.maxPoints}` };
      }
    }
    return { valid: true };
  };

  const saveScores = async () => {
    const validation = validateScores();
    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const totalScore = calculateTotalScore();
      const result = await saveGermaneLoadScores(selectedResponse.participantId, scores, totalScore);

      if (result.success) {
        setSuccess(`Scores saved successfully! Total: ${totalScore}/${getTotalMaxPoints()}`);
        setIsGrading(false);
        // Reload responses to get updated data
        await loadResponses();
        // Update selected response
        const updatedResponse = { ...selectedResponse, scores, totalScore, gradedAt: new Date().toISOString() };
        setSelectedResponse(updatedResponse);
      } else {
        setError(result.error || 'Failed to save scores');
      }
    } catch (err) {
      console.error('Error saving scores:', err);
      setError('An error occurred while saving scores');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Participant ID',
      'Submitted At',
      'Graded At',
      'Total Score',
      ...questions.map(q => `Q${q.id.slice(1)}: ${q.question.slice(0, 50)}...`),
      ...questions.map(q => `Q${q.id.slice(1)} Score`),
    ];

    const rows = responses.map(response => [
      response.participantId,
      formatDate(response.submittedAt),
      response.gradedAt ? formatDate(response.gradedAt) : 'Not Graded',
      response.totalScore !== undefined ? `${response.totalScore}/${getTotalMaxPoints()}` : 'Not Graded',
      ...questions.map(q => response.responses?.[q.id] || 'N/A'),
      ...questions.map(q => response.scores?.[q.id] !== undefined ? response.scores[q.id] : 'Not Graded'),
    ]);

    const csvContent = [
      headers.map(h => `"${h}"`).join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `germane_load_responses_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  if (loading && !selectedResponse) {
    return <Loading fullScreen />;
  }

  return (
    <>
      <Menubar />
      <Container fluid className="my-4">
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <div className="d-flex justify-content-between align-items-center">
                  <h3 className="mb-0">Germane Load Responses Dashboard</h3>
                  <div>
                    <Badge color="primary" pill className="me-2">
                      {responses.length} Response{responses.length !== 1 ? 's' : ''}
                    </Badge>
                    {!selectedResponse && responses.length > 0 && (
                      <Button color="success" size="sm" onClick={exportToCSV}>
                        Export CSV
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                {error && (
                  <Alert color="danger" className="mb-4">
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert color="success" className="mb-4">
                    {success}
                  </Alert>
                )}

                {!selectedResponse ? (
                  <>
                    {responses.length === 0 ? (
                      <p className="text-muted text-center py-5">
                        No responses submitted yet.
                      </p>
                    ) : (
                      <div className="table-responsive">
                        <Table hover>
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Participant ID</th>
                              <th>Submitted At</th>
                              <th>Total Score</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {responses.map((response, index) => (
                              <tr key={response.participantId}>
                                <td>{index + 1}</td>
                                <td><strong>{response.participantId}</strong></td>
                                <td>{formatDate(response.submittedAt)}</td>
                                <td>
                                  {response.totalScore !== undefined ? (
                                    <Badge color="success">
                                      {response.totalScore}/{getTotalMaxPoints()}
                                    </Badge>
                                  ) : (
                                    <Badge color="warning">Not Graded</Badge>
                                  )}
                                </td>
                                <td>
                                  {response.gradedAt ? (
                                    <Badge color="info">Graded</Badge>
                                  ) : (
                                    <Badge color="secondary">Pending</Badge>
                                  )}
                                </td>
                                <td>
                                  <Button
                                    color="info"
                                    size="sm"
                                    onClick={() => viewDetails(response)}
                                  >
                                    View & Grade
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    )}
                  </>
                ) : (
                  <div>
                    <Button
                      color="secondary"
                      size="sm"
                      className="mb-4"
                      onClick={() => {
                        setSelectedResponse(null);
                        setIsGrading(false);
                        setScores({});
                      }}
                    >
                      ← Back to List
                    </Button>

                    <h4 className="mb-3">
                      Participant: <Badge color="primary">{selectedResponse.participantId}</Badge>
                      {selectedResponse.totalScore !== undefined && (
                        <Badge color="success" className="ms-2">
                          Score: {selectedResponse.totalScore}/{getTotalMaxPoints()}
                        </Badge>
                      )}
                    </h4>
                    <p className="text-muted mb-2">
                      Submitted: {formatDate(selectedResponse.submittedAt)}
                    </p>
                    {selectedResponse.gradedAt && (
                      <p className="text-muted mb-4">
                        Graded: {formatDate(selectedResponse.gradedAt)}
                      </p>
                    )}

                    {!isGrading && (
                      <div className="mb-4">
                        <Button color="primary" onClick={startGrading}>
                          {selectedResponse.scores ? 'Edit Grades' : 'Start Grading'}
                        </Button>
                      </div>
                    )}

                    <div className="responses-detail">
                      {selectedResponse.responses && questions.map((question, index) => {
                        const answer = selectedResponse.responses[question.id];
                        const currentScore = scores[question.id];
                        
                        return (
                        <Card key={question.id} className="mb-3">
                          <CardBody>
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h6 className="text-primary mb-0">Question {index + 1}</h6>
                              <Badge color="info">{question.maxPoints} points</Badge>
                            </div>
                            <p className="mb-2"><strong>{question.question}</strong></p>
                            <div className="p-3 bg-light rounded mb-3">
                              <p className="mb-0">{answer || 'No answer provided'}</p>
                            </div>
                            
                            {isGrading ? (
                              <Form>
                                <FormGroup>
                                  <Label for={`score-${question.id}`}>
                                    Score (0 - {question.maxPoints})
                                  </Label>
                                  <Input
                                    type="number"
                                    id={`score-${question.id}`}
                                    value={currentScore === undefined ? '' : currentScore}
                                    onChange={(e) => handleScoreChange(question.id, e.target.value)}
                                    min="0"
                                    max={question.maxPoints}
                                    step="0.5"
                                    placeholder={`Enter score (max ${question.maxPoints})`}
                                  />
                                </FormGroup>
                              </Form>
                            ) : (
                              selectedResponse.scores && selectedResponse.scores[question.id] !== undefined && (
                                <div className="mt-2">
                                  <strong>Score: </strong>
                                  <Badge color="success">
                                    {selectedResponse.scores[question.id]}/{question.maxPoints}
                                  </Badge>
                                </div>
                              )
                            )}
                          </CardBody>
                        </Card>
                        );
                      })}
                    </div>

                    {isGrading && (
                      <div className="mt-4 p-3 bg-light rounded">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h5 className="mb-0">Total Score</h5>
                          <h4 className="mb-0">
                            <Badge color="primary">
                              {calculateTotalScore()}/{getTotalMaxPoints()}
                            </Badge>
                          </h4>
                        </div>
                        <div className="text-end">
                          <Button
                            color="secondary"
                            className="me-2"
                            onClick={() => {
                              setIsGrading(false);
                              setScores(selectedResponse.scores || {});
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            color="success"
                            onClick={saveScores}
                            disabled={loading}
                          >
                            Save Scores
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default GermaneLoadDashboard;
