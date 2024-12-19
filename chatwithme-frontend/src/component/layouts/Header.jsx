import { LogoutIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggler from "./ThemeToggler";
import { getUserInfo, removeToken, removeUserInfo } from "../../services/localStorageService";

export default function Header() {
  const [modal, setModal] = useState(false);

  const [avatar, setAvatar] = useState("/assets/images/logo.png");

  const currentUser = JSON.parse(getUserInfo());

  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(getUserInfo());

    if (!currentUser) {
      navigate("/login");
    }
    if (currentUser && currentUser.photoURL) setAvatar(currentUser.photoURL);
  }, [currentUser]);

  const handleLogout = () => {
    removeToken();
    removeUserInfo();
    navigate("/login")
  }

  return (
    <>
      <nav className="px- px-2 sm:px-4 py-2.5 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 text-gray-900 text-sm rounded border dark:text-white">
        <div className="container mx-auto flex flex-wrap items-center justify-between">
          <Link to="/" className="flex">
            <span className="self-center text-lg font-semibold whitespace-nowrap text-gray-900 dark:text-white">
              Tám Chuyện
            </span>
          </Link>
          <div className="flex md:order-2">
            <ThemeToggler />

            {currentUser && (
              <>
                <button
                  className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none rounded-lg text-sm p-2.5"
                  onClick={() => handleLogout()}
                >
                  <LogoutIcon className="h-8 w-8" aria-hidden="true" />
                </button>

                <Link
                  to="/profile"
                  className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none rounded-full text-sm p-2.5"
                >
                  <img className="h-8 w-8 rounded-full" src={avatar} alt="" />
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}