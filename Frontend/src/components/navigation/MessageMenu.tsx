import { useEffect, useRef, useState } from "react";
import { MessageSquare } from "lucide-react";
import { cn } from "../../utils/cn";
import { Avatar } from "./Avatar";

export interface MessagePreview {
  id: string;
  senderName: string;
  senderAvatarUrl?: string;
  preview: string;
  time: string;
  unread: boolean;
}

const MOCK_MESSAGES: MessagePreview[] = [
  {
    id: "msg-1",
    senderName: "John Carter",
    preview: "John sent you a message",
    time: "5 minutes ago",
    unread: true,
  },
  {
    id: "msg-2",
    senderName: "Vendor Support",
    preview: "Vendor Support replied",
    time: "20 minutes ago",
    unread: true,
  },
  {
    id: "msg-3",
    senderName: "Aisha Khan",
    preview: "Thanks, that resolves it.",
    time: "1 hour ago",
    unread: false,
  },
];

export interface MessageMenuProps {
  messages?: MessagePreview[];
  onViewAll?: () => void;
  className?: string;
}

/**
 * MessageMenu
 *
 * Header button + dropdown showing recent message previews. Static mock
 * data for now — no API wiring. Unread state drives both the small
 * orange dot on the trigger button and the per-row indicator/weight in
 * the list.
 *
 * Closes on outside click and Escape. Dropdown styling (white bg,
 * border, shadow, rounded corners, fade/scale-in) is shared with
 * NotificationMenu so the two read as one dropdown system.
 *
 * Example:
 *   <MessageMenu onViewAll={() => navigate("/messages")} />
 */
export function MessageMenu({ messages = MOCK_MESSAGES, onViewAll, className }: MessageMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = messages.filter((m) => m.unread).length;

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Messages${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        title="Messages"
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500",
          "transition-colors duration-150 hover:bg-slate-100 hover:text-slate-800",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-orange-400",
          open && "bg-slate-100 text-slate-800"
        )}
      >
        <MessageSquare className="h-[18px] w-[18px]" aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white"
            aria-hidden="true"
          />
        )}
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Messages"
          className={cn(
            "absolute right-0 top-[calc(100%+8px)] z-20 w-80 origin-top-right",
            "rounded-xl border border-slate-200 bg-white shadow-lg",
            "animate-in fade-in zoom-in-95 duration-150"
          )}
        >
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-sm font-semibold text-slate-800">Messages</p>
          </div>

          <ul className="max-h-80 overflow-y-auto py-1">
            {messages.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-slate-400">No messages yet</li>
            ) : (
              messages.map((message) => (
                <li key={message.id}>
                  <button
                    type="button"
                    role="menuitem"
                    className={cn(
                      "flex w-full items-start gap-3 px-4 py-2.5 text-left",
                      "transition-colors duration-150 hover:bg-slate-50"
                    )}
                  >
                    <Avatar name={message.senderName} src={message.senderAvatarUrl} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "block truncate text-sm",
                          message.unread ? "font-medium text-slate-800" : "text-slate-600"
                        )}
                      >
                        {message.preview}
                      </span>
                      <span className="block text-xs text-slate-400">{message.time}</span>
                    </span>
                    {message.unread && (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange-500" aria-hidden="true" />
                    )}
                  </button>
                </li>
              ))
            )}
          </ul>

          <div className="border-t border-slate-100 p-1.5">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onViewAll?.();
              }}
              className={cn(
                "w-full rounded-lg px-2.5 py-2 text-center text-sm font-medium text-orange-600",
                "hover:bg-orange-50"
              )}
            >
              View all messages
            </button>
          </div>
        </div>
      )}
    </div>
  );
}