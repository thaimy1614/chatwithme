import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateAvatar } from "../../utils/GenerateAvatar";
import { updateMyInfo } from "../../services/ChatService";
import { useUser } from "../../context/UserContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useUser();

  const [avatars, setAvatars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(
    currentUser?.photoURL || ""
  );
  const [fullName, setFullName] = useState(currentUser?.fullName || "");

  useEffect(() => {
    const fetchData = () => {
      const res = generateAvatar();
      setAvatars(res);
    };

    fetchData();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const profile = {
        fullName,
        photoURL: selectedAvatar,
        userId: currentUser.userId,
      };
      const res = await updateMyInfo(profile);
      
      setCurrentUser(profile);
      navigate("/");
    } catch (e) {
      console.error(e);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-4 text-3xl text-center tracking-tight font-light dark:text-white">
            Chọn 1 bộ mặt
          </h2>
        </div>
        <form className="space-y-6" onSubmit={handleFormSubmit}>
          <div className="flex flex-wrap -m-1 md:-m-2">
            {avatars.map((avatar, index) => (
              <div key={index} className="flex flex-wrap w-1/3">
                <div className="w-full p-1 md:p-2">
                  <img
                    alt="gallery"
                    className={classNames(
                      index === selectedIndex
                        ? "border-4 border-blue-700 dark:border-blue-700"
                        : "cursor-pointer hover:border-4 hover:border-blue-700",
                      "block object-cover object-center w-36 h-36 rounded-full"
                    )}
                    src={avatar}
                    onClick={() => {
                      setSelectedAvatar(avatar);
                      setSelectedIndex(index);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-md shadow-sm -space-y-px">
            <input
              id="username"
              name="fullName"
              type="text"
              autoComplete="fullName"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 placeholder-gray-500 rounded-t-md bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Nhập pháp danh"
              value={fullName}
              onInvalid={(e) =>
                e.target.setCustomValidity("Nhập pháp danh của mi vào")
              }
              onInput={(e) => e.target.setCustomValidity("")}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Cập nhật rồ pi lê
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
