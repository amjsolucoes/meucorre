import { create } from 'zustand';

type AlertType = 'success' | 'error' | 'info';

interface AlertState {
  visible: boolean;
  type: AlertType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  showAlert: (config: { 
    type: AlertType; 
    title: string; 
    message: string; 
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
    onConfirm?: () => void;
    onCancel?: () => void;
  }) => void;
  hideAlert: () => void;
}

export const useUIStore = create<AlertState>((set) => ({
  visible: false,
  type: 'success',
  title: '',
  message: '',
  confirmText: 'ENTENDIDO',
  cancelText: 'CANCELAR',
  showCancel: false,
  onConfirm: undefined,
  onCancel: undefined,
  showAlert: (config) => set({ 
    confirmText: 'ENTENDIDO',
    cancelText: 'CANCELAR',
    showCancel: false,
    onCancel: undefined,
    onConfirm: undefined,
    ...config, 
    visible: true 
  }),
  hideAlert: () => set({ 
    visible: false, 
    onConfirm: undefined,
    onCancel: undefined,
    showCancel: false 
  }),
}));
