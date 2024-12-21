import React from 'react';
import { Logo } from '../components/ui/Logo';

export const MainPage: React.FC = () => {
  return (
    <div style={styles.container}>
      <Logo size="large" />
      <h1>Welcome to InspectWise!</h1>
      <p>Your trusted partner in inspection and reporting.</p>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
    textAlign: 'center',
  } as React.CSSProperties,
};
