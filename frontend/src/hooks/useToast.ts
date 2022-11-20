import {
  ToastId,
  ToastPosition,
  useToast as useChakraToast
} from "@chakra-ui/react";

interface ToastProp {
  title: string;
  position: ToastPosition;
  status?: "info" | "warning" | "success" | "error" | "loading" | undefined;
  description?: string;
  duration?: number | null | undefined;
  isClosable?: boolean;
}

const toastQueue: ToastId[] = [];
const MAX_TOAST_NUM = 1;
function useToast() {
  const toast = useChakraToast();

  function addToast({
    title,
    position,
    status,
    duration,
    description,
    isClosable
  }: ToastProp) {
    if (toastQueue.length >= MAX_TOAST_NUM && toastQueue.length > 0) {
      toast.close(toastQueue.shift() as ToastId);
    }
    const newToastId = toast({
      title,
      position,
      status,
      duration,
      isClosable,
      description
    });
    toastQueue.push(newToastId);
  }

  return addToast;
}
export default useToast;
