'use client';

import { useEffect, useCallback } from 'react';
import useIndraStore from '@/store/indra-store';
import { sovereignAudio } from '@/lib/audio/sound-effects';

export function useControlRoomShortcuts() {
  const { isAgentWorking, abortTask, addToast } = useIndraStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // 1. Emergency Abort / Trip: Escape
      if (e.key === 'Escape') {
        if (isAgentWorking) {
          e.preventDefault();
          abortTask();
          sovereignAudio.playAlertTone(0.22);
          addToast({
            type: 'warning',
            title: 'EMERGENCY TASK ABORT / TRIP',
            message: 'Active reasoning task aborted by operator via [Esc] trip interlock.',
          });
          return;
        }
      }

      // Check if target is an interactive typing element
      const activeEl = document.activeElement;
      const isInput =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        activeEl?.getAttribute('contenteditable') === 'true';

      // Escape trip interlock handled above
    },
    [isAgentWorking, abortTask, addToast]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
