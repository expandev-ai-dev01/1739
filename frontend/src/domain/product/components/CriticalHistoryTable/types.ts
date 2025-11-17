import type { CriticalHistoryEntry } from '../../types';

export interface CriticalHistoryTableProps {
  history: CriticalHistoryEntry[];
  isLoading?: boolean;
}
