const AuthShell = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden border-r border-white/10 bg-neutral-950 px-10 py-8 lg:flex lg:flex-col">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-lg font-bold tracking-tight text-neutral-950 shadow-lg shadow-black/30">
              W
            </div>
            <p className="text-lg font-bold tracking-tight">WorkChat</p>
          </div>

          <div className="flex flex-1 items-center">
            <div className="max-w-2xl">
              <p className="mb-5 text-sm font-semibold uppercase tracking-wide text-blue-400">
                Modern team workspace
              </p>
              <h1 className="text-5xl font-bold tracking-tight text-white xl:text-6xl">
                Build with your team.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-400">
                A focused place for workspaces, channels, and the conversations
                that move projects forward.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {["Workspace", "Channels", "Focus"].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3"
              >
                <p className="text-sm font-semibold text-neutral-200">{item}</p>
                <p className="mt-1 text-xs text-neutral-500">Ready</p>
              </div>
            ))}
          </div>
        </section>

        <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-10 text-neutral-950 sm:px-6 lg:px-10">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-950 text-lg font-bold tracking-tight text-white">
                W
              </div>
              <p className="text-lg font-bold tracking-tight">WorkChat</p>
            </div>

            <div className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-xl shadow-neutral-200/70 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                WorkChat
              </p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight text-neutral-950">
                {title}
              </h2>
              <p className="mt-3 text-base leading-7 text-neutral-500">
                {subtitle}
              </p>

              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuthShell;
