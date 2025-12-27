import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, CardHeader, CardBody, CardTitle } from 'reactstrap';
import Menubar from '../components/Menubar';
import Loading from '../components/Loading';
import Chart from '../components/Chart';
import DataCard from '../components/DataCard';
import { getParticipant } from '../services/firebase';

const Results = () => {
  const { participantId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getParticipant(participantId);
        
        if (!result.exists || !result.data.completed) {
          setError('Assessment not completed or data not found.');
          setLoading(false);
          return;
        }

        setData(result.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching results:', err);
        setError('Failed to load results.');
        setLoading(false);
      }
    };

    fetchData();
  }, [participantId]);

  if (loading) {
    return <Loading fullScreen />;
  }

  if (error || !data) {
    return (
      <>
        <Menubar />
        <Container className="my-5">
          <Row className="justify-content-center">
            <Col xs={12} md={8}>
              <Card className="text-center p-5">
                <h3 className="text-danger">{error || 'Data not found'}</h3>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  return (
    <>
      <Menubar />
      <Container fluid className="my-4">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <h3 className="mb-2">
                  Raw Data of Participant "{participantId}"
                </h3>
                <h5 className="text-muted mb-0">
                  Assessment completed on {data.date}
                </h5>
              </CardHeader>
              <CardBody>
                <CardTitle tag="h3">Weighted Rating: {data.weightedRating}</CardTitle>
                
                {/* Charts */}
                <Chart
                  adjustedRating={data.adjustedRating}
                  weightedRating={data.weightedRating}
                />

                {/* Data Tables */}
                <DataCard title="Raw Ratings (0-100 scale)" values={data.scale} />
                <DataCard
                  title="Sources of Workload Tally (number of times selected)"
                  values={data.workload}
                />
                <DataCard
                  title="Adjusted Rating (Weight × Raw Rating)"
                  values={data.adjustedRating}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Results;
