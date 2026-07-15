export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

type Listener = (toasts: Toast[]) => void;

let toasts: Toast[] = [];
const listeners = new Set<Listener>();

export const toast = {
  show: (message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, message, type };
    toasts = [...toasts, newToast];
    listeners.forEach((l) => l(toasts));
    
    // Automatically dismiss after 4 seconds
    setTimeout(() => {
      toast.dismiss(id);
    }, 4000);
  },
  success: (message: string) => toast.show(message, "success"),
  error: (message: string) => toast.show(message, "error"),
  info: (message: string) => toast.show(message, "info"),
  dismiss: (id: string) => {
    toasts = toasts.filter((t) => t.id !== id);
    listeners.forEach((l) => l(toasts));
  },
  subscribe: (listener: Listener) => {
    listeners.add(listener);
    listener(toasts);
    return () => {
      listeners.delete(listener);
    };
  },
};
