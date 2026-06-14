const MainContent = ({ user, selectedWorkspace, channels }) => {
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

        {!selectedWorkspace ? (
          <div className="flex flex-1 items-center justify-center px-6 py-16">
            <div className="max-w-2xl text-center">
              <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-blue-600">
                Team communication, focused
              </p>
              <h2 className="text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
                Build with your team.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-neutral-500">
                Select a workspace to open its channels and start collaborating
                in a calm, organized space.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col px-5 py-6 sm:px-8 lg:px-10">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Active workspace
              </p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl">
                {selectedWorkspace.name}
              </h2>
              <p className="mt-4 text-lg leading-8 text-neutral-500">
                Keep conversations tidy by moving through the channels in this
                workspace.
              </p>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {channels.map((channel) => (
                <div
                  key={channel.id}
                  className="rounded-2xl border border-neutral-200 bg-neutral-50/80 p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-neutral-300 hover:bg-white hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-semibold text-white shadow-lg shadow-blue-200">
                    #
                  </div>
                  <h3 className="mt-5 truncate text-lg font-semibold text-neutral-950">
                    {channel.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-500">
                    Channel conversations and updates appear here.
                  </p>
                </div>
              ))}
            </div>

            {channels.length === 0 && (
              <div className="mt-10 flex flex-1 items-center justify-center rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-16 text-center">
                <div className="max-w-md">
                  <h3 className="text-2xl font-bold tracking-tight text-neutral-950">
                    No channels yet.
                  </h3>
                  <p className="mt-3 text-base leading-7 text-neutral-500">
                    Once channels are created for this workspace, they will show
                    up here with the same structure your team expects.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
};

export default MainContent;
