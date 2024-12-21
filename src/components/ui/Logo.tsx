import React from 'react';

type LogoProps = {
  style?: React.CSSProperties;
  size?: 'small' | 'medium' | 'large';
};

export const Logo: React.FC<LogoProps> = ({ style = {}, size = 'medium' }) => {
  const sizes: Record<'small' | 'medium' | 'large', React.CSSProperties> = {
    small: { fontSize: '20px' },
    medium: { fontSize: '30px' },
    large: { fontSize: '40px' },
  };

  return (
    <div style={{ ...styles.logo, ...sizes[size], ...style }}>
      Inspect<span style={styles.highlight}>Wise</span>
    </div>
  );
};

const styles = {
  logo: {
    fontFamily: 'Arial, sans-serif',
    fontWeight: 'bold',
    color: '#333',
  } as React.CSSProperties,
  highlight: {
    color: '#007bff',
  } as React.CSSProperties,
};
