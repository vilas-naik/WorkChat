const MainContent = ({
  user,
  selectedWorkspace,
  selectedChannel,
  messages,
  messageInput,
  setMessageInput,
  sendMessage,
}) => {
  return (
    <main className="flex min-w-0 flex-1 bg-neutral-50 p-4 sm:p-6 lg:p-8">
      <section className="flex min-h-full w-full flex-col rounded-[2rem] border border-neutral-200/80 bg-white shadow-sm shadow-neutral-200/70">
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4 sm:px-8">
          <div className="min-w-0">
            <p className="text-sm font-medium text-neutral-500">WorkChat</p>
            <h1 className="truncate text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
              {selectedWorkspace?.name || `Welcome ${user?.name || ""}`.trim()}
            </h1>
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          {!selectedChannel ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <h2 className="text-4xl font-bold">Select a Channel</h2>

                <p className="mt-3 text-neutral-500">
                  Choose a channel to start chatting.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="border-b border-neutral-200 px-8 py-5">
                <h2 className="text-2xl font-bold"># {selectedChannel.name}</h2>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
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

                    <p className="mt-1">{message.content}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-neutral-200 p-4">
                <div className="flex gap-3">
                  <input
                    value={messageInput}
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