import {
  toast,
  type ConnectToastOptions,
} from "@powerhousedao/design-system/connect";

export const INVOICE_TOAST_CONTAINER_ID = "invoice-editor-toast";

export const invoiceToast = (
  message: Parameters<typeof toast>[0],
  options?: ConnectToastOptions,
) =>
  toast(message, {
    ...options,
    containerId: INVOICE_TOAST_CONTAINER_ID,
  } as ConnectToastOptions);
