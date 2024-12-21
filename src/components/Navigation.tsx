import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ClipboardList, FileSpreadsheet } from 'lucide-react';

type NavigationLink = {
  to: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export function Navigation() {
  const location = useLocation();

  const links: NavigationLink[] = [
    { to: '/', label: 'Templates', icon: FileSpreadsheet },
    { to: '/inspections', label: 'Inspections', icon: ClipboardList },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <div style={styles.wrapper}>
          <div style={styles.links}>
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                style={{
                  ...styles.link,
                  ...(location.pathname === to ? styles.activeLink : {}),
                }}
              >
                <Icon style={styles.icon} />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  } as React.CSSProperties,
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 16px',
  } as React.CSSProperties,
  wrapper: {
    display: 'flex',
    height: '64px',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as React.CSSProperties,
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
  } as React.CSSProperties,
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#4B5563',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: 500,
    transition: 'color 0.2s',
  } as React.CSSProperties,
  activeLink: {
    color: '#1D4ED8',
  } as React.CSSProperties,
  icon: {
    width: '20px',
    height: '20px',
  } as React.CSSProperties,
};
