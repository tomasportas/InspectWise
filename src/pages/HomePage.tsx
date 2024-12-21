// src/pages/HomePage.tsx
import React from 'react';
import { Logo } from '../components/ui/Logo';

export const HomePage: React.FC = () => {
  return (
    <div style={styles.container}>
      <Logo size="large" />
      <h1>Welcome Home!</h1>
      <p>This is your Home page. Customize it as needed!</p>
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
