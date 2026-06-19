import UserCard from "./UserCard";

const getWorkspaceInitial = (name) =>
  name?.trim()?.charAt(0)?.toUpperCase() || "W";

const WorkspaceSidebar = ({
  workspaces,
  selectedWorkspace,
  onWorkspaceClick,
  setShowModal,
  user,
  logout,
  deleteWorkspace,
}) => {
  return (
    <aside className="flex h-screen w-20 shrink-0 flex-col items-center border-r border-neutral-800 bg-neutral-950 px-3 py-5 text-white sm:w-24">
      <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-lg font-bold tracking-tight text-neutral-950 shadow-lg shadow-black/30">
        W
      </div>

      <div className="flex flex-1 flex-col items-center gap-3 overflow-y-auto">
        {workspaces.map((workspace) => {
          const isActive = selectedWorkspace?.id === workspace.id;
          const canDeleteWorkspace = workspace.owner_id === user?.id;

          return (
            <div key={workspace.id} className="relative">
              <button
                onClick={() => onWorkspaceClick(workspace)}
                title={workspace.name}
                className={`group flex h-12 w-12 items-center justify-center rounded-2xl text-base font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-950/50"
                    : "bg-neutral-900 text-neutral-300 ring-1 ring-white/5 hover:-translate-y-0.5 hover:bg-neutral-800 hover:text-white"
                }`}
              >
                <span className="transition-transform duration-200 group-hover:scale-105">
                  {getWorkspaceInitial(workspace.name)}
                </span>
              </button>

              {isActive && canDeleteWorkspace && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteWorkspace(workspace);
                  }}
                  title={`Delete ${workspace.name}`}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-800 text-xs text-neutral-500 ring-1 ring-white/10 transition hover:bg-red-500/20 hover:text-red-300"
                >
                  x
                </button>
              )}
            </div>
          );
        })}

        <button
          onClick={() => setShowModal(true)}
          title="Create workspace"
          className="mt-2 flex h-12 w-12 items-center justify-center rounded-2xl border border-dashed border-neutral-700 text-2xl font-light text-neutral-400 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500 hover:bg-neutral-900 hover:text-white"
        >
          +
        </button>
      </div>

      <UserCard user={user} logout={logout} />
    </aside>
  );
};

export default WorkspaceSidebar;
