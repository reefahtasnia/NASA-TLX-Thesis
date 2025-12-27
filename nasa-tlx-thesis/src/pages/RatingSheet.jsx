import { useState, useEffect } from 'react';
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
import Slider from '../components/Slider';
import { shortDefinitions } from '../lib/definitions';
import { updateParticipant } from '../services/firebase';

const RatingSheet = () => {
  const { participantId } = useParams();
  const navigate = useNavigate();

  // EXACT LOGIC from old folder: 2-batch system
  const [currentBatch, setCurrentBatch] = useState(1); // Batch 1 or Batch 2
  const [scale, setScale] = useState({
    'Mental Demand': 50,
    'Physical Demand': 50,
    'Temporal Demand': 50,
    Performance: 50,
    Effort: 50,
    'Frustration Level': 50,
  });

  // Load from localStorage if exists (for page refresh recovery)
  useEffect(() => {
    const saved = localStorage.getItem(`ratingSheet_${participantId}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setScale(parsed.scale);
      setCurrentBatch(parsed.batch);
    }
  }, [participantId]);

  // Save to localStorage on every change
  useEffect(() => {
    localStorage.setItem(
      `ratingSheet_${participantId}`,
      JSON.stringify({ scale, batch: currentBatch })
    );
  }, [scale, currentBatch, participantId]);

  const handleChange = (key, value) => {
    setScale((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleContinue = async () => {
    if (currentBatch === 1) {
      // Show second batch
      setCurrentBatch(2);
    } else {
      // Second batch complete - invert Performance and save to Firebase
      const finalScale = { ...scale };
      finalScale.Performance = 100 - finalScale.Performance; // EXACT LOGIC: Invert Performance

      try {
        await updateParticipant(participantId, { scale: finalScale });
        // Clear localStorage
        localStorage.removeItem(`ratingSheet_${participantId}`);
        // Navigate to compare cards
        navigate(`/tlx/${participantId}/compare`);
      } catch (error) {
        console.error('Error saving rating sheet:', error);
        alert('Failed to save data. Please try again.');
      }
    }
  };

  // EXACT LOGIC: First batch (0-3), Second batch (3-6)
  const dimensions = Object.keys(shortDefinitions);
  const batchStart = currentBatch === 1 ? 0 : 3;
  const batchEnd = currentBatch === 1 ? 3 : 6;
  const currentDimensions = dimensions.slice(batchStart, batchEnd);

  const sliders = currentDimensions.map((key, index) => {
    const definition = shortDefinitions[key];
    return (
      <Slider
        key={key}
        id={key}
        title={key}
        description={definition.description}
        leftValue={definition.leftValue}
        rightValue={definition.rightValue}
        value={scale[key]}
        handleChange={handleChange}
        divider={index < currentDimensions.length - 1}
      />
    );
  });

  return (
    <>
      <Menubar />
      <Container className="my-4">
        <Row className="justify-content-center">
          <Col xs={12} lg={10} xl={8}>
            <Card>
              <CardHeader tag="h3">
                Rating Sheet {currentBatch === 1 ? '(Part 1 of 2)' : '(Part 2 of 2)'}
              </CardHeader>
              <CardBody>{sliders}</CardBody>
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

export default RatingSheet;
