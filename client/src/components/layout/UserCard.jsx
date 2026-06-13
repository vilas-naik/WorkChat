const UserCard = ({ user, logout }) => {
    return (
        <div className="border-t p-4">
            <p className="font-medium">
                {user?.name}
            </p>

            <p className="text-sm text-zinc-500">
                {user?.email}
            </p>

            <button
                onClick={logout}
                className="mt-3 w-full rounded-lg bg-black text-white py-2"
            >
                Logout
            </button>
        </div>
    );
};

export default UserCard;