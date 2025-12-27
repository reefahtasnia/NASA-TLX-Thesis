import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Table,
  Button,
  ButtonGroup,
  Input,
  Badge,
} from 'reactstrap';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import Menubar from '../components/Menubar';
import Loading from '../components/Loading';
import { getAllParticipants, updateParticipant, exportToCSV } from '../services/firebase';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState([]);
  const [editingTime, setEditingTime] = useState({}); // Track which rows are being edited
  const [timeValues, setTimeValues] = useState({}); // Store temporary time values

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    setLoading(true);
    const result = await getAllParticipants();
    if (result.success) {
      setParticipants(result.data);
      // Initialize time values - convert seconds to minutes and seconds
      const initialTimes = {};
      result.data.forEach(p => {
        const totalSeconds = p.timeTakenSeconds || 0;
        initialTimes[p.id] = {
          minutes: Math.floor(totalSeconds / 60),
          seconds: totalSeconds % 60
        };
      });
      setTimeValues(initialTimes);
    }
    setLoading(false);
  };

  const handleTimeEdit = (participantId) => {
    setEditingTime(prev => ({ ...prev, [participantId]: true }));
  };

  const handleTimeSave = async (participantId) => {
    const timeData = timeValues[participantId];
    const minutes = parseInt(timeData.minutes, 10) || 0;
    const seconds = parseInt(timeData.seconds, 10) || 0;
    
    // Validate
    if (minutes < 0 || seconds < 0 || seconds >= 60) {
      alert('Please enter valid time (seconds must be 0-59)');
      return;
    }

    // Convert to total seconds
    const totalSeconds = (minutes * 60) + seconds;

    // Update Firebase
    const result = await updateParticipant(participantId, {
      timeTakenSeconds: totalSeconds || null,
    });

    if (result.success) {
      setEditingTime(prev => ({ ...prev, [participantId]: false }));
      // Refresh data
      fetchParticipants();
    } else {
      alert('Failed to update time');
    }
  };

  const handleTimeChange = (participantId, field, value) => {
    setTimeValues(prev => ({
      ...prev,
      [participantId]: {
        ...prev[participantId],
        [field]: value
      }
    }));
  };

  const handleExportCSV = () => {
    const csv = exportToCSV(participants);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nasa-tlx-data-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleExportJSON = () => {
    const json = JSON.stringify(
      participants.filter(p => p.completed).map(p => ({
        participantId: p.id,
        ...p.info,
        weightedRating: p.weightedRating,
        timeTakenSeconds: p.timeTakenSeconds,
        date: p.date,
        scale: p.scale,
        workload: p.workload,
        adjustedRating: p.adjustedRating,
      })),
      null,
      2
    );
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nasa-tlx-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  const completedParticipants = participants.filter(p => p.completed);
  const averageScore = completedParticipants.length > 0
    ? (completedParticipants.reduce((sum, p) => sum + (p.weightedRating || 0), 0) / completedParticipants.length).toFixed(2)
    : 0;

  const chartData = completedParticipants.map(p => ({
    name: p.id.substring(0, 8),
    score: p.weightedRating,
  }));

  return (
    <>
      <Menubar />
      <Container fluid className="my-4">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <Card>
              <CardHeader className="d-flex align-items-center">
                <div>
                  <h3 className="mb-1">Admin Dashboard</h3>
                  <p className="text-muted mb-0">
                    Total Participants: {participants.length} | Completed: {completedParticipants.length} | Average Score: {averageScore}
                  </p>
                </div>
                <div className="ms-auto">
                  <ButtonGroup>
                    <Button color="success" onClick={handleExportCSV}>
                      Export CSV
                    </Button>
                    <Button color="info" onClick={handleExportJSON}>
                      Export JSON
                    </Button>
                  </ButtonGroup>
                </div>
              </CardHeader>
            </Card>
          </Col>
        </Row>

        {/* Chart */}
        {completedParticipants.length > 0 && (
          <Row className="mb-4">
            <Col>
              <Card>
                <CardBody>
                  <h5 className="mb-3">Weighted TLX Scores by Participant</h5>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="score" fill="#007bff" name="TLX Score" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}

        {/* Table */}
        <Row>
          <Col>
            <Card>
              <CardBody>
                {completedParticipants.length === 0 ? (
                  <div className="text-center py-5">
                    <h4>No completed assessments yet</h4>
                    <p className="text-muted">Completed participant data will appear here</p>
                  </div>
                ) : (
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Participant ID</th>
                        <th>Email</th>
                        <th>Age</th>
                        <th>Major</th>
                        <th>Gaming Exp.</th>
                        <th>TLX Score</th>
                        <th>Time Taken</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedParticipants.map((participant, index) => (
                        <tr key={participant.id}>
                          <td>{index + 1}</td>
                          <td className="fw-bold">{participant.id}</td>
                          <td>{participant.info?.email || 'N/A'}</td>
                          <td>{participant.info?.age || 'N/A'}</td>
                          <td>{participant.info?.major || 'N/A'}</td>
                          <td>
                            <Badge color="secondary">
                              {participant.info?.gamingExperience || 'N/A'}
                            </Badge>
                          </td>
                          <td className="fw-bold">{participant.weightedRating}</td>
                          <td>
                            {editingTime[participant.id] ? (
                              <div className="d-flex gap-1 align-items-center" style={{ minWidth: '180px' }}>
                                <Input
                                  type="number"
                                  size="sm"
                                  min="0"
                                  value={timeValues[participant.id]?.minutes || ''}
                                  onChange={(e) => handleTimeChange(participant.id, 'minutes', e.target.value)}
                                  placeholder="Min"
                                  style={{ width: '55px' }}
                                />
                                <span className="small">m</span>
                                <Input
                                  type="number"
                                  size="sm"
                                  min="0"
                                  max="59"
                                  value={timeValues[participant.id]?.seconds || ''}
                                  onChange={(e) => handleTimeChange(participant.id, 'seconds', e.target.value)}
                                  placeholder="Sec"
                                  style={{ width: '55px' }}
                                />
                                <span className="small">s</span>
                                <Button
                                  size="sm"
                                  color="success"
                                  onClick={() => handleTimeSave(participant.id)}
                                >
                                  ✓
                                </Button>
                              </div>
                            ) : (
                              <div className="d-flex gap-1 align-items-center">
                                <span>
                                  {participant.timeTakenSeconds
                                    ? `${Math.floor(participant.timeTakenSeconds / 60)}m ${participant.timeTakenSeconds % 60}s`
                                    : '-'}
                                </span>
                                <Button
                                  size="sm"
                                  color="link"
                                  className="p-0"
                                  onClick={() => handleTimeEdit(participant.id)}
                                >
                                  ✏️
                                </Button>
                              </div>
                            )}
                          </td>
                          <td className="small">{participant.date}</td>
                          <td>
                            <Button
                              size="sm"
                              color="primary"
                              onClick={() => navigate(`/results/${participant.id}`)}
                            >
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;
