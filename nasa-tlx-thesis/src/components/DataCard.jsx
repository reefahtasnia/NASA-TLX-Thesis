import { Card, CardBody, CardTitle, Table } from 'reactstrap';

const DataCard = ({ title, values }) => {
  const tableHead = [];
  const tableContent = [];

  Object.entries(values)
    .sort()
    .forEach(([key, value]) => {
      tableHead.push(
        <th key={key} className="text-start align-baseline" style={{ width: '16.67%' }}>
          {key}
        </th>
      );
      tableContent.push(
        <td key={key} className="text-start align-baseline">
          {typeof value === 'number' ? value.toFixed(2) : value}
        </td>
      );
    });

  return (
    <Card className="mt-4">
      <CardBody>
        <CardTitle tag="h5" className="mb-3">{title}</CardTitle>
        <Table responsive bordered>
          <thead>
            <tr>{tableHead}</tr>
          </thead>
          <tbody>
            <tr>{tableContent}</tr>
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default DataCard;
