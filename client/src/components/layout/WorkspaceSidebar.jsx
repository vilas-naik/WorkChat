import { useEffect, useRef, useState } from "react";

import UserCard from "./UserCard";

const getWorkspaceInitial = (name) =>
  name?.trim()?.charAt(0)?.toUpperCase() || "W";

const WorkspaceSidebar = ({
  workspaces,
  selectedWorkspace,
  onWorkspaceClick,
  setShowModal,
  setShowJoinModal,
  user,
  logout,
  deleteWorkspace,
  updateWorkspace,
  sidebarExpanded,
  setSidebarExpanded,
}) => {
  const [editingWorkspace, setEditingWorkspace] = useState(null);
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceSearch, setWorkspaceSearch] = useState("");
  const inputRef = useRef(null);
  const renameFormRef = useRef(null);
  const filteredWorkspaces = workspaces.filter((workspace) =>
    workspace.name
      .toLocaleLowerCase()
      .includes(workspaceSearch.trim().toLocaleLowerCase()),
  );

  const cancelRenamingWorkspace = () => {
    setEditingWorkspace(null);
    setWorkspaceName("");
  };

  const saveWorkspaceName = async (workspace) => {
    const nextName = workspaceName.trim();

    if (!nextName || nextName === workspace.name) {
      cancelRenamingWorkspace();
      return;
    }

    await updateWorkspace(workspace, nextName);
    cancelRenamingWorkspace();
  };

  const startRenamingWorkspace = (workspace) => {
    setSidebarExpanded(true);
    setEditingWorkspace(workspace.id);
    setWorkspaceName(workspace.name);
  };

  useEffect(() => {
    if (!editingWorkspace) return;

    inputRef.current?.focus();
    inputRef.current?.select();
  }, [editingWorkspace, sidebarExpanded]);

  useEffect(() => {
    if (!editingWorkspace) return;

    const handleOutsideClick = (event) => {
      if (renameFormRef.current?.contains(event.target)) return;

      const workspace = workspaces.find((item) => item.id === editingWorkspace);

      if (workspace) {
        saveWorkspaceName(workspace);
      } else {
        cancelRenamingWorkspace();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [editingWorkspace, workspaceName, workspaces]);

  return (
    <aside
      className={`flex h-screen shrink-0 flex-col border-r border-neutral-800 bg-neutral-950 px-3 py-5 text-white transition-all duration-300 ease-out ${
        sidebarExpanded ? "w-64 items-stretch" : "w-20 items-center sm:w-24"
      }`}
    >
      <button
        onClick={() => setSidebarExpanded((expanded) => !expanded)}
        className={`mb-7 flex h-12 items-center rounded-2xl bg-white text-neutral-950 shadow-lg shadow-black/30 transition-all duration-300 hover:-translate-y-0.5 ${
          sidebarExpanded ? "w-full justify-start gap-3 px-3" : "w-12 justify-center"
        }`}
        title={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-neutral-950 text-sm font-bold text-white">
          W
        </span>
        <span
          className={`overflow-hidden whitespace-nowrap text-lg font-bold tracking-tight transition-all duration-300 ${
            sidebarExpanded ? "max-w-40 opacity-100" : "max-w-0 opacity-0"
          }`}
        >
          WorkChat
        </span>
      </button>

      <div className={`mb-5 transition-all duration-300 ${sidebarExpanded ? "w-full" : "w-12"}`}>
        <label htmlFor="workspace-search" className="sr-only">
          Search workspaces
        </label>
        <input
          id="workspace-search"
          type="search"
          value={workspaceSearch}
          onFocus={() => setSidebarExpanded(true)}
          onChange={(event) => setWorkspaceSearch(event.target.value)}
          placeholder={sidebarExpanded ? "Search workspaces" : "🔍︎"}
          title="Search workspaces"
          className={`h-10 rounded-xl border border-white/10 bg-neutral-900 text-sm text-white outline-none transition-all duration-300 placeholder:text-neutral-500 focus:border-blue-500 ${
            sidebarExpanded ? "w-full px-3" : "w-12 px-2 text-transparent placeholder:text-transparent"
          }`}
        />
      </div>

      <div
        className={`flex flex-1 flex-col gap-3 overflow-y-auto scrollbar-none transition-all duration-300 ${
          sidebarExpanded ? "items-stretch" : "items-center"
        }`}
      >
        {filteredWorkspaces.map((workspace) => {
          const isActive = selectedWorkspace?.id === workspace.id;
          const canManageWorkspace = workspace.owner_id === user?.id;
          const isEditing = editingWorkspace === workspace.id;

          return (
            <div key={workspace.id} className="group relative">
              <div
                className={`flex min-h-12 items-center rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-950/50"
                    : "bg-neutral-900 text-neutral-300 ring-1 ring-white/5 hover:-translate-y-0.5 hover:bg-neutral-800 hover:text-white"
                } ${sidebarExpanded ? "w-full gap-3 px-3 py-2" : "w-12 justify-center"}`}
              >
                <button
                  onClick={() => onWorkspaceClick(workspace)}
                  title={workspace.name}
                  className={`flex min-w-0 items-center text-left ${
                    sidebarExpanded ? "flex-1 gap-3" : "w-full justify-center gap-0"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base font-bold transition-transform duration-200 group-hover:scale-105 ${
                      isActive ? "bg-white/15" : "bg-neutral-800"
                    }`}
                  >
                    {getWorkspaceInitial(workspace.name)}
                  </span>

                  <span
                    className={`min-w-0 text-sm font-semibold leading-5 transition-all duration-300 ${
                      sidebarExpanded
                        ? "max-w-36 whitespace-normal break-words opacity-100"
                        : "max-w-0 overflow-hidden opacity-0"
                    }`}
                  >
                    {workspace.name}
                  </span>
                </button>

                {sidebarExpanded && canManageWorkspace && !isEditing && (
                  <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startRenamingWorkspace(workspace);
                      }}
                      title={`Rename ${workspace.name}`}
                      className="rounded-md px-1 text-xs text-neutral-300 transition hover:bg-white/10 hover:text-white"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteWorkspace(workspace);
                      }}
                      title={`Delete ${workspace.name}`}
                      className="rounded-md px-1 text-xs text-neutral-300 transition hover:bg-red-500/20 hover:text-red-300"
                    >
                      x
                    </button>
                  </div>
                )}
              </div>

              {!sidebarExpanded && isActive && canManageWorkspace && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startRenamingWorkspace(workspace);
                    }}
                    title={`Rename ${workspace.name}`}
                    className="absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-800 text-[10px] text-neutral-500 opacity-0 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white group-hover:opacity-100"
                  >
                    ✏️
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteWorkspace(workspace);
                    }}
                    title={`Delete ${workspace.name}`}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-800 text-xs text-neutral-500 opacity-0 ring-1 ring-white/10 transition hover:bg-red-500/20 hover:text-red-300 group-hover:opacity-100"
                  >
                    x
                  </button>
                </>
              )}

              {isEditing && (
                <form
                  ref={renameFormRef}
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveWorkspaceName(workspace);
                  }}
                  className={`z-20 flex gap-1 rounded-xl border border-white/10 bg-neutral-900 p-2 shadow-xl transition-all duration-300 ${
                    sidebarExpanded
                      ? "mt-2 w-full opacity-100"
                      : "absolute left-14 top-0 w-44 opacity-100"
                  }`}
                >
                  <input
                    ref={inputRef}
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        cancelRenamingWorkspace();
                      }
                    }}
                    className="min-w-0 flex-1 rounded-lg border border-white/10 bg-neutral-950 px-2 py-1 text-sm text-white outline-none transition focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-2 text-xs text-white transition hover:bg-blue-500"
                  >
                    Save
                  </button>
                </form>
              )}
            </div>
          );
        })}

        {workspaceSearch.trim() && filteredWorkspaces.length === 0 && (
          <div
            className={`rounded-2xl border border-white/10 bg-white/[0.03] text-center transition-all duration-300 ${
              sidebarExpanded ? "px-3 py-4 opacity-100" : "h-0 overflow-hidden opacity-0"
            }`}
          >
            <p className="text-sm font-medium text-neutral-300">No workspaces found</p>
            <p className="mt-1 text-xs text-neutral-500">Try a different search.</p>
          </div>
        )}

        <button
          onClick={() => setShowModal(true)}
          title="Create workspace"
          className={`mt-2 flex min-h-12 items-center rounded-2xl border border-dashed border-neutral-700 font-medium text-neutral-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500 hover:bg-neutral-900 hover:text-white ${
            sidebarExpanded
              ? "w-full justify-start gap-3 px-3 text-sm"
              : "w-12 justify-center text-2xl font-light"
          }`}
        >
          <span className="text-2xl font-light leading-none">+</span>
          <span
            className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
              sidebarExpanded ? "max-w-36 opacity-100" : "max-w-0 opacity-0"
            }`}
          >
            Create Workspace
          </span>
        </button>

        <button
          onClick={() => setShowJoinModal(true)}
          className={`flex min-h-11 items-center rounded-2xl text-sm font-medium text-neutral-400 transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-900 hover:text-white ${
            sidebarExpanded ? "w-full justify-start px-3 opacity-100" : "h-0 w-12 justify-center overflow-hidden p-0 opacity-0"
          }`}
          tabIndex={sidebarExpanded ? 0 : -1}
        >
          <span
            className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
              sidebarExpanded ? "max-w-36 opacity-100" : "max-w-0 opacity-0"
            }`}
          >
            Join Workspace
          </span>
        </button>
      </div>

      <UserCard user={user} logout={logout} />
    </aside>
  );
};

export default WorkspaceSidebar;
