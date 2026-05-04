import { useEffect, useState } from "react";
import API from "../api/axios";
import {
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function CommentSection({ videoId }) {
  const { user } = useAuth();

  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [menuId, setMenuId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  /* ================= USER ID FIX ================= */
  const currentUserId =
    user?._id || user?.id || user?.user?._id;

  /* ================= FETCH ================= */
  const fetchComments = async () => {
    const res = await API.get(`/comments/${videoId}`);
    setComments(res.data);
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  /* ================= ADD ================= */
  const addComment = async () => {
    if (!text.trim()) return;

    const res = await API.post("/comments", {
      text,
      videoId,
    });

    setComments([res.data, ...comments]);
    setText("");
  };

  /* ================= DELETE ================= */
  const deleteComment = async (id) => {
    await API.delete(`/comments/${id}`);
    setComments((prev) => prev.filter((c) => c._id !== id));
  };

  /* ================= EDIT ================= */
  const saveEdit = async () => {
    const res = await API.put(`/comments/${editId}`, {
      text: editText,
    });

    setComments((prev) =>
      prev.map((c) => (c._id === editId ? res.data : c))
    );

    setEditId(null);
    setEditText("");
  };

  /* ================= LIKE ================= */
  const likeComment = async (id) => {
    const res = await API.put(`/comments/like/${id}`);

    setComments((prev) =>
      prev.map((c) => (c._id === id ? res.data : c))
    );
  };

  /* ================= DISLIKE ================= */
  const dislikeComment = async (id) => {
    const res = await API.put(`/comments/dislike/${id}`);

    setComments((prev) =>
      prev.map((c) => (c._id === id ? res.data : c))
    );
  };

  return (
    <div className="mt-6 text-white max-w-3xl">

      {/* HEADER */}
      <h3 className="text-lg font-semibold mb-4">
        {comments.length} Comments
      </h3>

      {/* ADD COMMENT */}
      <div className="flex gap-3 items-start">
        <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center font-bold">
          {user?.username?.charAt(0)?.toUpperCase()}
        </div>

        <div className="flex-1">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-transparent border-b border-gray-600 focus:outline-none py-2"
            placeholder="Add a comment..."
          />

          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setText("")}
              className="px-3 py-1 text-sm text-gray-400"
            >
              Cancel
            </button>

            <button
              onClick={addComment}
              className="bg-blue-600 px-4 py-1 rounded-full text-sm"
            >
              Comment
            </button>
          </div>
        </div>
      </div>

      {/* COMMENTS */}
      <div className="mt-6 space-y-5">
        {comments.map((c) => {
          const commentUserId = c.user?._id || c.user;

          const isOwner =
            String(currentUserId) === String(commentUserId);

          return (
            <div key={c._id} className="flex gap-3 group">

              {/* AVATAR */}
              <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-sm font-bold">
                {c.user?.username?.charAt(0)?.toUpperCase()}
              </div>

              <div className="flex-1">

                {/* TOP */}
                <div className="flex justify-between">

                  <div>
                    <p className="text-sm font-semibold">
                      {c.user?.username}
                      <span className="text-gray-400 text-xs ml-2">
                        {new Date(c.createdAt).toLocaleString()}
                      </span>
                    </p>

                    {editId === c._id ? (
                      <div className="mt-1 flex gap-2">
                        <input
                          value={editText}
                          onChange={(e) =>
                            setEditText(e.target.value)
                          }
                          className="bg-[#222] px-2 py-1 rounded text-sm"
                        />

                        <button
                          onClick={saveEdit}
                          className="text-blue-400 text-sm"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm mt-1">{c.text}</p>
                    )}
                  </div>

                  {/* 3 DOT MENU */}
                  <div className="relative">
                    <MoreVertical
                      size={18}
                      className="cursor-pointer opacity-70 hover:opacity-100"
                      onClick={() =>
                        setMenuId(menuId === c._id ? null : c._id)
                      }
                    />

                    {menuId === c._id && (
                      <div className="absolute right-0 mt-1 w-36 bg-[#222] border border-[#333] rounded shadow-lg z-50">

                        {isOwner ? (
                          <>
                            <button
                              onClick={() => {
                                setEditId(c._id);
                                setEditText(c.text);
                                setMenuId(null);
                              }}
                              className="w-full text-left px-3 py-2 hover:bg-[#333]"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => deleteComment(c._id)}
                              className="w-full text-left px-3 py-2 text-red-400 hover:bg-[#333]"
                            >
                              Delete
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => alert("Reported")}
                            className="w-full text-left px-3 py-2 hover:bg-[#333]"
                          >
                            Report
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* LIKE / DISLIKE */}
                <div className="flex items-center gap-5 mt-2 text-sm text-gray-400">

                  <div
                    onClick={() => likeComment(c._id)}
                    className="flex items-center gap-1 cursor-pointer hover:text-white"
                  >
                    <ThumbsUp size={16} />
                    {c.likes?.length || 0}
                  </div>

                  <div
                    onClick={() => dislikeComment(c._id)}
                    className="flex items-center gap-1 cursor-pointer hover:text-white"
                  >
                    <ThumbsDown size={16} />
                    {c.dislikes?.length || 0}
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}