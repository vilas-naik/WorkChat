import { useEffect, useRef,useState } from "react";

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
  setEditText
}) => {
  const bottomRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <main className="flex min-w-0 flex-1 bg-neutral-50 p-4 sm:p-6 lg:p-8">
      <section className="flex min-h-0 h-full w-full flex-col rounded-[2rem] border border-neutral-200/80 bg-white shadow-sm shadow-neutral-200/70">
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4 sm:px-8">
          <div className="min-w-0">
            <p className="text-sm font-medium text-neutral-500">WorkChat</p>
            <h1 className="truncate text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
              {selectedWorkspace?.name || `Welcome ${user?.name || ""}`.trim()}
            </h1>
          </div>
        </div>

        <div className="flex flex-1 flex-col min-h-0">
          {!selectedChannel ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <h2 className="text-4xl font-bold">Select a Channel</h2>

                <p className="mt-3 text-neutral-500">Choose a channel to start chatting.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="min-h-0 flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="
              rounded-2xl
              bg-neutral-100
              p-4
            "
                  >
                    <p className="font-semibold">{message.users?.name}</p>
                    <p className="text-xs text-neutral-500">
                      {new Date(message.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

                    {editingMessage === message.id ? (
                      <div className="mt-2">
                        <input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="
        w-full
        rounded-lg
        border
        p-2
      "
                        />

                        <div className="mt-2 flex gap-2">
                          <button
                            onClick={() => updateMessage(message.id)}
                            className="
          rounded-lg
          bg-blue-600
          px-3
          py-1
          text-white
        "
                          >
                            Save
                          </button>

                          <button
                            onClick={() => {
                              setEditingMessage(null);
                              setEditText("");
                            }}
                            className="
          rounded-lg
          border
          px-3
          py-1
        "
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-1">
                        {message.content}
                        {message.edited_at && <span className="ml-2 text-xs text-neutral-500">(edited)</span>}
                      </p>
                    )}

                    {message.sender_id === user?.id && (
                      <div className="relative">
                        <button onClick={() => setOpenMenu(openMenu === message.id ? null : message.id)}>⋮</button>
                        {openMenu === message.id && (
                          <div
                            className="
      absolute
      right-0
      top-6
      z-10
      w-28
      rounded-xl
      border
      bg-white
      shadow-lg
    "
                          >
                            <button
                              onClick={() => {
                                setEditingMessage(message.id);
                                setEditText(message.content);
                                setOpenMenu(null);
                              }}
                              className="
        block
        w-full
        px-3
        py-2
        text-left
        hover:bg-neutral-100
      "
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => deleteMessage(message.id)}
                              className="
        block
        w-full
        px-3
        py-2
        text-left
        text-red-500
        hover:bg-neutral-100
      "
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                <div ref={bottomRef}></div>
              </div>

              <div className="border-t border-neutral-200 p-4">
                <div className="flex gap-3">
                  <input
                    value={messageInput}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        sendMessage();
                      }
                    }}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={`Message #${selectedChannel.name}`}
                    className="
              flex-1
              rounded-xl
              border
              px-4
              py-3
            "
                  />

                  <button
                    onClick={sendMessage}
                    className="
              rounded-xl
              bg-blue-600
              px-5
              text-white
            "
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default MainContent;