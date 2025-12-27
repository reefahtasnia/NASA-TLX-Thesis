import { useState } from 'react';
import { FormGroup, Label } from 'reactstrap';

const Slider = ({ id, title, description, leftValue, rightValue, value, handleChange, divider }) => {
  const [currentValue, setCurrentValue] = useState(value);

  const onChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    setCurrentValue(newValue);
    handleChange(id, newValue);
  };

  return (
    <>
      <FormGroup className="mb-4">
        <Label className="fw-bold mb-3">{title}</Label>
        <p className="text-muted small mb-3">{description}</p>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="small text-muted">{leftValue}</span>
          <span className="small text-muted">{rightValue}</span>
        </div>
        <input
          type="range"
          className="form-range"
          id={id}
          min="0"
          max="100"
          step="1"
          value={currentValue}
          onChange={onChange}
        />
        <div className="text-center mt-2">
          <span className="badge bg-primary">{currentValue}</span>
        </div>
      </FormGroup>
      {divider && <hr className="my-4" />}
    </>
  );
};

export default Slider;
