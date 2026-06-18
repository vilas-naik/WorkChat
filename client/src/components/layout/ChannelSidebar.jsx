import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { useState } from "react";

const ChannelSidebar = ({
  selectedWorkspace,
  channels,
  selectedChannel,
  setShowChannelModal,
  onChannelClick,
  handleChannelClick,
}) => {
  const [copied, setCopied] = useState(false);
  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-neutral-800 bg-neutral-900 text-white md:flex lg:w-72">
      <div className="border-b border-white/10 px-5 py-5">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          Workspace
        </p>
        <div className="flex justify-between">
          <h2 className="mt-2 truncate text-xl font-bold tracking-tight">
            {selectedWorkspace?.name || "Select workspace"}
          </h2>
          {selectedWorkspace && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(selectedWorkspace?.invite_code);
                setCopied(true);
                clearTimeout(window.copyTimeout);

                window.copyTimeout = setTimeout(() => {
                  setCopied(false);
                }, 5000);
              }}
              className="rounded-lg  px-3 py-1 text-lg"
              data-tooltip-id="basic-tooltip"
              data-tooltip-content={
                copied
                  ? `Copied: ${selectedWorkspace?.invite_code}`
                  : "Copy Invite Code"
              }
            >
              🔗
              <Tooltip id="basic-tooltip" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5">
        <div className="mb-3 flex items-center justify-between px-2">
          <p className="text-sm font-semibold text-neutral-300">Channels</p>
          {selectedWorkspace && (
            <button
              onClick={() => setShowChannelModal(true)}
              className="rounded-lg px-2 py-1 text-sm font-medium text-neutral-400 transition hover:bg-white/10 hover:text-white"
            >
              +
            </button>
          )}
        </div>

        <div className="space-y-1">
          {!selectedWorkspace ? (
            <div className="p-4 text-center">
              <p className="font-medium">Select a workspace first</p>

              <p className="mt-2 text-sm text-neutral-500">
                Choose a workspace to view channels.
              </p>
            </div>
          ) : channels.length > 0 ? (
            channels.map((channel, index) => (
              <button
                key={channel.id}
                onClick={() => onChannelClick(channel)}
                className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 ${
                  selectedChannel?.id === channel.id
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-neutral-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="text-neutral-500">#</span>
                <span className="truncate">{channel.name}</span>
              </button>
            ))
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-5">
              <p className="text-sm font-medium text-neutral-300">
                No channels yet
              </p>
              <p className="mt-1 text-sm leading-6 text-neutral-500">
                Channels will appear here when this workspace has them.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-white/10 p-3">
        {selectedWorkspace && (
          <button
            disabled={!selectedWorkspace}
            className={`
    w-full rounded-xl px-4 py-3
    ${
      selectedWorkspace
        ? "bg-blue-600 text-white"
        : "cursor-not-allowed bg-neutral-200 text-neutral-400"
    }
  `}
          >
            New Channel
          </button>
        )}
      </div>
    </aside>
  );
};

export default ChannelSidebar;
