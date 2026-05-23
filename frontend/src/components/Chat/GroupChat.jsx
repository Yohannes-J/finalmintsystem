import { useState, useEffect } from "react";
import axios from "axios";
import useAuthStore from "../../store/auth.store";
import useThemeStore from "../../store/themeStore";

const backendUrl = "http://localhost:1221";

export default function GroupChat({ onSelectGroup, selectedGroup }) {
  const dark = useThemeStore((s) => s.dark);
  const currentUser = useAuthStore((s) => s.user);

  const [groups, setGroups] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState(new Set());
  const [search, setSearch] = useState("");

  // ✅ Fetch data safely
  useEffect(() => {
    if (!currentUser || !currentUser._id) return;

    setSelectedUserIds(new Set([currentUser._id]));

    axios
      .get(`${backendUrl}/api/users/get-users`, { withCredentials: true })
      .then((res) => {
        console.log("Users:", res.data);
        setAllUsers(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => console.error("Users error:", err));

    fetchGroups();
  }, [currentUser]);

  // ✅ Fetch groups safely
  const fetchGroups = () => {
    axios
      .get(`${backendUrl}/api/chat/groups`, { withCredentials: true })
      .then((res) => {
        console.log("Groups:", res.data);
        setGroups(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => console.error("Groups error:", err));
  };

  // ✅ Toggle user selection safely
  const toggleUser = (id) => {
    if (!currentUser?._id) return;

    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(id) && id !== currentUser._id) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ✅ Create group
  const handleCreateGroup = () => {
    if (!groupName || selectedUserIds.size < 2) return;

    axios
      .post(
        `${backendUrl}/api/chat/groups`,
        { name: groupName, members: Array.from(selectedUserIds) },
        { withCredentials: true }
      )
      .then(() => {
        fetchGroups();
        setShowCreateForm(false);
        setGroupName("");
        setSearch("");
        setSelectedUserIds(new Set([currentUser._id]));
      })
      .catch((err) => console.error("Create group error:", err));
  };

  // ✅ Leave group
  const handleLeave = (groupId) => {
    axios
      .post(
        `${backendUrl}/api/chat/groups/${groupId}/leave`,
        {},
        { withCredentials: true }
      )
      .then(fetchGroups)
      .catch((err) => console.error("Leave error:", err));
  };

  // ✅ Delete group
  const handleDelete = (groupId) => {
    axios
      .delete(`${backendUrl}/api/chat/groups/${groupId}`, {
        withCredentials: true,
      })
      .then(() => {
        fetchGroups();
        onSelectGroup(null);
      })
      .catch((err) => console.error("Delete error:", err));
  };

  // ✅ Safe filtering
  const filteredUsers = allUsers.filter(
    (u) =>
      u &&
      u.fullName &&
      u.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const wrapperBg = dark
    ? "bg-gray-800 border-gray-700 text-white"
    : "bg-[rgba(13,42,92,0.08)] border-[rgba(13,42,92,0.1)] text-[#0D2A5C]";

  const hoverBg = dark ? "hover:bg-gray-700" : "hover:bg-blue-50";

  return (
    <div className={`p-2 ${wrapperBg} text-sm`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-[#040613]">Groups</h2>
        <button
          className="text-xs text-[#F36F21] hover:underline"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? "Cancel" : "Create"}
        </button>
      </div>

      {/* Create Group */}
      {showCreateForm && (
        <div className="bg-gray-50 p-2 mt-2 rounded shadow-sm">
          <input
            placeholder="Group name"
            className="w-full mb-2 px-2 py-1 border rounded text-sm"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />

          <input
            placeholder="Search users..."
            className="w-full mb-2 px-2 py-1 border rounded text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="max-h-32 overflow-y-auto mb-2 border p-1 rounded text-sm">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <label
                  key={user._id}
                  className="flex items-center space-x-2 mb-1"
                >
                  <input
                    type="checkbox"
                    checked={selectedUserIds.has(user._id)}
                    disabled={user._id === currentUser?._id}
                    onChange={() => toggleUser(user._id)}
                  />
                  <span>
                    {user.fullName}
                    {user._id === currentUser?._id ? " (You)" : ""}
                  </span>
                </label>
              ))
            ) : (
              <div className="text-xs text-gray-400 text-center mt-2">
                No users found.
              </div>
            )}
          </div>

          <button
            className="bg-[#040613] hover:bg-[#00337A] text-white py-1 px-3 rounded text-sm w-full"
            onClick={handleCreateGroup}
            disabled={!groupName || selectedUserIds.size < 2}
          >
            Create Group
          </button>
        </div>
      )}

      {/* Groups List */}
      <ul className="mt-3 space-y-1">
        {Array.isArray(groups) &&
          groups.map((group) => {
            const isOwner =
              currentUser && group.owner === currentUser._id;

            return (
              <li key={group._id}>
                <div
                  className={`flex justify-between items-center p-2 rounded cursor-pointer ${hoverBg}`}
                  onClick={() => onSelectGroup(group)}
                >
                  <span>{group.name}</span>

                  <div className="space-x-1 text-xs">
                    {isOwner ? (
                      <button
                        className="text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(group._id);
                        }}
                      >
                        Delete
                      </button>
                    ) : (
                      <button
                        className="text-gray-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLeave(group._id);
                        }}
                      >
                        Leave
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
}