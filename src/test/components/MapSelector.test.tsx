import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MapSelector } from '../../components/MapSelector';

const mockMapsMetadata = [
  { id: '1', name: 'Ascent', splash: 'ascent.jpg' },
  { id: '2', name: 'Bind', splash: 'bind.jpg' },
];

global.fetch = vi.fn().mockImplementation(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockMapsMetadata),
  })
) as unknown as typeof fetch;

describe('MapSelector Component', () => {
  it('should fetch and display maps', async () => {
    render(<MapSelector />);
    await waitFor(() => {
      expect(screen.getByText('Ascent')).toBeDefined();
    });
  });
});
