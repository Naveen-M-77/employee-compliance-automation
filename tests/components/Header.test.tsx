import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from '../../src/components/Header';

describe('Header Component', () => {
  it('renders the application title', () => {
    render(<Header />);
    
    expect(screen.getByText('Employee Compliance Automation')).toBeInTheDocument();
    expect(screen.getByText('ML-powered compliance prediction with blockchain integration')).toBeInTheDocument();
  });

  it('displays ML Model and Blockchain indicators', () => {
    render(<Header />);
    
    expect(screen.getByText('ML Model')).toBeInTheDocument();
    expect(screen.getByText('Blockchain')).toBeInTheDocument();
  });

  it('renders the shield icon', () => {
    const { container } = render(<Header />);
    
    // Look for SVG element with shield icon
    const svgElements = container.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThan(0);
  });

  it('has proper styling classes', () => {
    const { container } = render(<Header />);
    
    const header = container.querySelector('header');
    expect(header).toHaveClass('bg-white', 'border-b', 'border-gray-200', 'sticky', 'top-0', 'z-40');
  });

  it('is responsive with proper container classes', () => {
    const { container } = render(<Header />);
    
    const headerContent = container.querySelector('.max-w-7xl');
    expect(headerContent).toHaveClass('mx-auto', 'px-4', 'sm:px-6', 'lg:px-8');
  });
});