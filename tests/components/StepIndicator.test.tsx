import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppProvider } from '../../src/contexts/AppContext';
import StepIndicator from '../../src/components/StepIndicator';

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <AppProvider>
      {component}
    </AppProvider>
  );
};

describe('StepIndicator Component', () => {
  it('renders all three steps', () => {
    renderWithProvider(<StepIndicator />);
    
    expect(screen.getByText('Employee Data')).toBeInTheDocument();
    expect(screen.getByText('Prediction')).toBeInTheDocument();
    expect(screen.getByText('Blockchain')).toBeInTheDocument();
  });

  it('shows first step as current when no data is provided', () => {
    renderWithProvider(<StepIndicator />);
    
    const steps = screen.getAllByRole('listitem');
    expect(steps).toHaveLength(3);
    
    // First step should be current (has blue styling)
    const firstStep = steps[0];
    expect(firstStep.querySelector('.border-blue-600')).toBeInTheDocument();
  });

  it('displays step icons correctly', () => {
    const { container } = renderWithProvider(<StepIndicator />);
    
    // All icons should be present as SVG elements
    const svgElements = container.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThanOrEqual(3);
  });

  it('has proper navigation structure', () => {
    renderWithProvider(<StepIndicator />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Progress');
    
    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
  });

  it('shows progress connectors between steps', () => {
    const { container } = renderWithProvider(<StepIndicator />);
    
    // Should have connector lines between steps
    const connectors = container.querySelectorAll('.w-16');
    expect(connectors.length).toBeGreaterThanOrEqual(2);
  });

  it('has responsive design classes', () => {
    const { container } = renderWithProvider(<StepIndicator />);
    
    const stepIndicator = container.querySelector('.bg-white');
    expect(stepIndicator).toHaveClass('rounded-xl', 'shadow-lg', 'p-6', 'border', 'border-gray-100', 'mb-8');
  });
});