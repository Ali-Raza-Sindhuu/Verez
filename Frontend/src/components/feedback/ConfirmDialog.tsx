import { Modal } from "./Modal";
import { Button } from "../ui/Button";

export interface ConfirmDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  loading?: boolean;
}

/**
 * ConfirmDialog
 *
 * Confirmation prompt built on top of Modal, used for destructive or
 * significant actions: delete user, delete product, cancel order, approve
 * vendor, deactivate account.
 *
 * This is a UI primitive only — it does not perform the action itself.
 * The caller supplies onConfirm and is responsible for the actual mutation
 * (API call, Redux dispatch, etc). Requires a `ConfirmDialogProvider` (or
 * simply local `useState`) to control `open` from wherever it's triggered.
 *
 * Example:
 *   <ConfirmDialog
 *     open={isOpen}
 *     onCancel={() => setIsOpen(false)}
 *     onConfirm={handleDeleteUser}
 *     title="Delete user"
 *     description="This will permanently remove the user and cannot be undone."
 *     confirmLabel="Delete"
 *     danger
 *     loading={isDeleting}
 *   />
 */
export function ConfirmDialog({
  open,
  onCancel,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      description={description}
      size="sm"
      closeOnOverlayClick={!loading}
      closeOnEscape={!loading}
      footer={
        <>
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={danger ? "danger" : "primary"}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    />
  );
}