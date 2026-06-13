const Sidebar = ({ workspaces, setShowModal,setSelectedWorkspace }) => {

    return (
        <aside className="w-72 border-r bg-white flex flex-col">
            <div className="p-6 border-b">
                <h1 className="text-2xl font-bold">
                    WorkChat
                </h1>
            </div>

            <div className="flex-1 p-4">
                <p className="text-sm text-zinc-500 mb-3">
                    Workspaces
                </p>

                <div className="space-y-2">
                    {
                        workspaces.map((workspace) => (
                            <button
                                key={workspace.id}
                                onClick={() =>
                                    setSelectedWorkspace(workspace)
                                }
                                className="
                w-full
                text-left
                px-3
                py-2
                rounded-lg
                hover:bg-zinc-100
            "
                            >
                                {workspace.name}
                            </button>
                        ))
                    }
                </div>
                <div className="flex items-center justify-between">
                    <p>Workspaces</p>

                    <button
                        onClick={() => setShowModal(true)}
                    >
                        +
                    </button>
                </div>
            </div>

        </aside>

    );
};

export default Sidebar;