import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardBody, Row, Col } from 'reactstrap';

const Chart = ({ adjustedRating, weightedRating }) => {
  // EXACT LOGIC from old folder: adjusted rating divided by 15
  const chartData = Object.entries(adjustedRating).map(([key, value]) => ({
    name: key,
    score: parseFloat((value / 15).toFixed(2)),
  }));

  return (
    <Card className="mt-4">
      <CardBody>
        <Row className="justify-content-center align-items-stretch">
          <Col xs={12} lg={9}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" hide>
                  <Label value="Importance Weight" offset={-10} position="bottom" />
                </XAxis>
                <YAxis
                  label={{ value: 'Rating', angle: -90, position: 'insideLeft' }}
                  domain={[0, 'dataMax + 10']}
                />
                <Tooltip />
                <Bar dataKey="score" fill="#2E81C0">
                  <LabelList dataKey="name" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Col>
          <Col xs={12} lg={3}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={[{ tag: 'Weighted Rating', score: weightedRating }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tag" hide>
                  <Label value="Overall Workload" offset={-10} position="bottom" />
                </XAxis>
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="#004B82">
                  <LabelList dataKey="tag" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default Chart;
