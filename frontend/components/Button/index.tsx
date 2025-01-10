import React from 'react';

type ButtonType = JSX.IntrinsicElements['button'] & {
  label: string;
};

const Button: React.FC<ButtonType> = (props) => {
  return <button {...props}>{props.label}</button>;
};

export default Button;
