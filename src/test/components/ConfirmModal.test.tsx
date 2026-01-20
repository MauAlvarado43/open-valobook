import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConfirmModal } from '../../components/ConfirmModal';
import { useEditorStore } from '../../lib/store/editorStore';

describe('ConfirmModal Component', () => {
  beforeEach(() => {
    useEditorStore.setState({ confirmModal: null });
  });

  it('should render and handle confirmation', () => {
    const onConfirm = vi.fn();
    useEditorStore.setState({
      confirmModal: { title: 'Test', message: 'Ready?', onConfirm },
    });

    render(<ConfirmModal />);
    expect(screen.getByText('Test')).toBeDefined();

    fireEvent.click(screen.getByText('Confirm'));
    expect(onConfirm).toHaveBeenCalled();
    expect(useEditorStore.getState().confirmModal).toBeNull();
  });
});
