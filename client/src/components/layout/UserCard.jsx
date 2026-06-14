const UserCard = ({ user, logout }) => {
    return (
        <div className="mt-5 w-full border-t border-white/10 pt-4">
            <button
                onClick={logout}
                title={user?.email || "Logout"}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-900 text-sm font-bold text-neutral-300 ring-1 ring-white/5 transition hover:bg-red-500 hover:text-white"
            >
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </button>
        </div>
    );
};

export default UserCard;
