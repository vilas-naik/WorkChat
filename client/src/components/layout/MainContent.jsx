import { useEffect, useRef, useState } from "react";

const formatMessageTimestamp = (timestamp) => {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMessageDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const dayDifference = Math.round(
    (startOfToday - startOfMessageDay) / 86_400_000,
  );
  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  if (dayDifference === 0) return `Today at ${time}`;
  if (dayDifference === 1) return `Yesterday at ${time}`;

  return `${date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  })} at ${time}`;
};

const MainContent = ({
  user,
  selectedWorkspace,
  selectedChannel,
  messages,
  messageInput,
  setMessageInput,
  sendMessage,
  deleteMessage,
  updateMessage,
  editingMessage,
  setEditingMessage,
  editText,
  setEditText,
}) => {
  const bottomRef = useRef(null);
  const toastTimeoutRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState("");

  useEffect(() => {
    if (messages.length === 0) return;

    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  useEffect(
    () => () => {
      window.clearTimeout(toastTimeoutRef.current);
    },
    [],
  );

  const copyMessage = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopyFeedback("Copied!");
    } catch {
      setCopyFeedback("Could not copy message");
    }

    setOpenMenu(null);
    window.clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = window.setTimeout(() => setCopyFeedback(""), 2000);
  };

  return (
    <main className="flex min-w-0 flex-1 bg-neutral-50 p-4 sm:p-6 lg:p-8">
      <section className="flex h-full min-h-0 w-full flex-col rounded-[2rem] border border-neutral-200/80 bg-white shadow-sm shadow-neutral-200/70">
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4 sm:px-8">
          <div className="min-w-0">
            <p className="text-sm font-medium text-neutral-500">WorkChat</p>
            <h1 className="truncate text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
              {selectedWorkspace?.name || `Welcome ${user?.name || ""}`.trim()}
            </h1>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          {!selectedChannel ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <h2 className="text-4xl font-bold">Select a Channel</h2>
                <p className="mt-3 text-neutral-500">Choose a channel to start chatting.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-6">
                {messages.map((message) => {
                  const isOwnMessage = message.sender_id === user?.id;

                  return (
                    <div
                      key={message.id}
                      className="group relative rounded-2xl bg-neutral-100 p-4"
                    >
                      <div className="pr-9">
                        <p className="font-semibold">{message.users?.name}</p>
                        <time
                          dateTime={message.created_at}
                          className="text-xs text-neutral-500"
                        >
                          {formatMessageTimestamp(message.created_at)}
                        </time>
                      </div>

                      {editingMessage === message.id ? (
                        <div className="mt-2">
                          <input
                            value={editText}
                            onChange={(event) => setEditText(event.target.value)}
                            className="w-full rounded-lg border p-2"
                          />
                          <div className="mt-2 flex gap-2">
                            <button
                              onClick={() => updateMessage(message.id)}
                              className="rounded-lg bg-blue-600 px-3 py-1 text-white"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingMessage(null);
                                setEditText("");
                              }}
                              className="rounded-lg border px-3 py-1"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-1 whitespace-pre-wrap break-words">
                          {message.content}
                          {message.edited_at && (
                            <span className="ml-2 text-xs text-neutral-500">(edited)</span>
                          )}
                        </p>
                      )}

                      <div className="absolute right-3 top-3">
                        <button
                          onClick={() =>
                            setOpenMenu(openMenu === message.id ? null : message.id)
                          }
                          className={`flex h-8 w-8 items-center justify-center rounded-lg text-xl text-neutral-500 transition-all duration-200 hover:bg-white hover:text-neutral-900 focus:opacity-100 group-hover:opacity-100 ${
                            openMenu === message.id ? "bg-white opacity-100" : "opacity-0"
                          }`}
                          aria-label={`Actions for message from ${message.users?.name || "user"}`}
                          aria-expanded={openMenu === message.id}
                        >
                          &#8942;
                        </button>

                        {openMenu === message.id && (
                          <div className="absolute right-0 top-9 z-10 w-36 overflow-hidden rounded-xl border border-neutral-200 bg-white py-1 shadow-lg">
                            <button
                              onClick={() => copyMessage(message.content)}
                              className="block w-full px-3 py-2 text-left text-sm hover:bg-neutral-100"
                            >
                              Copy Message
                            </button>
                            {isOwnMessage && (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingMessage(message.id);
                                    setEditText(message.content);
                                    setOpenMenu(null);
                                  }}
                                  className="block w-full px-3 py-2 text-left text-sm hover:bg-neutral-100"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    setOpenMenu(null);
                                    deleteMessage(message.id);
                                  }}
                                  className="block w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-neutral-100"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              <div className="border-t border-neutral-200 p-4">
                <div className="flex items-end gap-3">
                  <textarea
                    rows={1}
                    value={messageInput}
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" &&
                        !event.shiftKey &&
                        !event.nativeEvent.isComposing
                      ) {
                        event.preventDefault();
                        if (messageInput.trim()) sendMessage();
                      }
                    }}
                    onChange={(event) => setMessageInput(event.target.value)}
                    placeholder={`Message #${selectedChannel.name}`}
                    className="max-h-36 min-h-12 flex-1 resize-y rounded-xl border px-4 py-3"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!messageInput.trim()}
                    className="min-h-12 rounded-xl bg-blue-600 px-5 text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-neutral-300"
                  >
                    Send
                  </button>
                </div>
                <p className="mt-2 text-xs text-neutral-400">
                  Enter to send · Shift+Enter for a new line
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      {copyFeedback && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-neutral-950 px-4 py-2 text-sm font-medium text-white shadow-xl"
        >
          {copyFeedback}
        </div>
      )}
    </main>
  );
};

export default MainContent;
