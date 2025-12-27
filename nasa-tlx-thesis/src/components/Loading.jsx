import { Spinner, Container } from 'reactstrap';

const Loading = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Spinner color="primary" style={{ width: '3rem', height: '3rem' }}>
          Loading...
        </Spinner>
      </div>
    );
  }

  return (
    <Container className="text-center py-5">
      <Spinner color="primary">
        Loading...
      </Spinner>
    </Container>
  );
};

export default Loading;
