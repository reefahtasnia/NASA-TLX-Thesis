import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Button,
} from 'reactstrap';
import Menubar from '../components/Menubar';
import { generatePairwiseComparisons, shuffleArray, calculateNASATLX } from '../lib/tlxCalculator';
import { getParticipant, updateParticipant } from '../services/firebase';
import Loading from '../components/Loading';

const CompareCards = () => {
  const { participantId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pairs, setPairs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [workload, setWorkload] = useState({
    'Mental Demand': 0,
    'Physical Demand': 0,
    'Temporal Demand': 0,
    Performance: 0,
    Effort: 0,
    'Frustration Level': 0,
  });

  useEffect(() => {
    const initializeComparisons = async () => {
      // Load saved state from localStorage
      const saved = localStorage.getItem(`compareCards_${participantId}`);
      
      if (saved) {
        const parsed = JSON.parse(saved);
        setPairs(parsed.pairs);
        setCurrentIndex(parsed.currentIndex);
        setWorkload(parsed.workload);
        setLoading(false);
      } else {
        // EXACT LOGIC: Generate all 15 pairwise combinations and shuffle
        const dimensions = Object.keys(workload);
        const allPairs = generatePairwiseComparisons(dimensions);
        const shuffledPairs = shuffleArray(allPairs);
        
        setPairs(shuffledPairs);
        setCurrentIndex(0);
        setLoading(false);
      }
    };

    initializeComparisons();
  }, [participantId]);

  // Save state to localStorage
  useEffect(() => {
    if (pairs.length > 0) {
      localStorage.setItem(
        `compareCards_${participantId}`,
        JSON.stringify({ pairs, currentIndex, workload })
      );
    }
  }, [pairs, currentIndex, workload, participantId]);

  const handleChoice = async (chosenDimension) => {
    // EXACT LOGIC: Increment workload tally for chosen dimension
    const newWorkload = {
      ...workload,
      [chosenDimension]: workload[chosenDimension] + 1,
    };
    setWorkload(newWorkload);

    // Check if this was the last comparison
    if (currentIndex >= pairs.length - 1) {
      // All 15 comparisons complete - calculate final score
      setLoading(true);
      
      try {
        // Get participant's scale data
        const { data } = await getParticipant(participantId);
        
        if (!data || !data.scale) {
          alert('Error: Rating data not found. Please go back and complete the rating sheet.');
          navigate(`/tlx/${participantId}/rating`);
          return;
        }

        // EXACT CALCULATION from old folder
        const result = calculateNASATLX(data.scale, newWorkload);
        
        // Save complete data to Firebase
        await updateParticipant(participantId, {
          workload: newWorkload,
          adjustedRating: result.adjustedRating,
          weightedRating: result.weightedRating,
          completed: result.completed,
          date: result.date,
        });

        // Clear localStorage
        localStorage.removeItem(`compareCards_${participantId}`);
        localStorage.removeItem(`ratingSheet_${participantId}`);

        // Navigate to end page
        navigate(`/end/${participantId}`);
      } catch (error) {
        console.error('Error completing assessment:', error);
        alert('Failed to save results. Please try again.');
        setLoading(false);
      }
    } else {
      // Move to next comparison
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (loading || pairs.length === 0) {
    return <Loading fullScreen />;
  }

  const currentPair = pairs[currentIndex];
  const remainingQuestions = pairs.length - currentIndex;

  return (
    <>
      <Menubar />
      <Container className="my-4">
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8}>
            <Card>
              <CardHeader tag="h3">
                Pairwise Comparison ({remainingQuestions} of 15 remaining)
              </CardHeader>
              <CardBody>
                <p className="text-center text-muted mb-4">
                  Select the factor that contributed MORE to the workload of your task:
                </p>
                <Row className="g-4">
                  <Col xs={12}>
                    <Card
                      className="cursor-pointer hover-shadow"
                      style={{
                        cursor: 'pointer',
                        border: '2px solid #dee2e6',
                        transition: 'all 0.3s ease',
                        minHeight: '100px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#007bff';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,123,255,0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#dee2e6';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      onClick={() => handleChoice(currentPair[0])}
                    >
                      <CardBody className="text-center d-flex align-items-center justify-content-center p-4">
                        <h4 className="mb-0 fw-bold">{currentPair[0]}</h4>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col xs={12}>
                    <Card
                      className="cursor-pointer hover-shadow"
                      style={{
                        cursor: 'pointer',
                        border: '2px solid #dee2e6',
                        transition: 'all 0.3s ease',
                        minHeight: '100px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#007bff';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,123,255,0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#dee2e6';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      onClick={() => handleChoice(currentPair[1])}
                    >
                      <CardBody className="text-center d-flex align-items-center justify-content-center p-4">
                        <h4 className="mb-0 fw-bold">{currentPair[1]}</h4>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
                <div className="mt-4 text-center">
                  <small className="text-muted">
                    Click on the option that was more important to your workload experience
                  </small>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CompareCards;
