import React from 'react';
import { render } from '@testing-library/react-native';

import Classes from '@/app/classes/index';

describe('Classes screen', () => {
  it('renders key metrics and student performance table', () => {
    const { getByText } = render(<Classes />);

    expect(getByText('Key Metrics')).toBeTruthy();
    expect(getByText('Class Average Score')).toBeTruthy();
    expect(getByText('75%')).toBeTruthy();
    expect(getByText('Student Performance')).toBeTruthy();
    expect(getByText('Akshay Kumar .N')).toBeTruthy();
    expect(getByText('Student Name')).toBeTruthy();
  });
});
