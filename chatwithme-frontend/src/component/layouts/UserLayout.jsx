import { format } from "timeago.js";
import { useUser } from "../../context/UserContext";
import { convertDateTimeZone } from "../../utils/DateTimeZone";

export default function UserLayout({ user, onlineUsersId }) {
  const { currentUser } = useUser();
  return (
  <div className="relative flex items-center w-full">
      <img
        className="w-10 h-10 rounded-full flex-shrink-0"
        src={user && user.photoURL ? user.photoURL : "/assets/images/logo.png"}
        alt="Avatar"
      />
      <div className="ml-2 flex-1">
        {/* Tên người dùng */}
        <span className="block text-gray-500 dark:text-gray-400 truncate">
          {user.fullName}
        </span>
        {user.lastMessage && (
          <div className="flex justify-between items-center w-full">
            {/* Tin nhắn */}
            <span
              className="text-gray-500 dark:text-gray-400 truncate"
              style={{
                maxWidth: "250px", // Giới hạn chiều rộng của tin nhắn để dành chỗ cho thời gian
                overflow: "hidden", // Ẩn phần thừa
                whiteSpace: "nowrap", // Không cho xuống dòng
                textOverflow: "ellipsis", // Hiển thị dấu "..."
              }}
            >
              {user.lastMessage.senderId === currentUser.userId
                ? "Bạn: "
                : `${user.lastMessage.senderName}: `}{" "}
              {user.lastMessage.content}
            </span>

            {/* Thời gian */}
            <span
              className="text-xs text-gray-400 flex-shrink-0 ml-2"
              style={{
                whiteSpace: "nowrap", // Không cho xuống dòng
              }}
            >
              {convertDateTimeZone(user.lastMessage.createdAt)
                .toTimeString()
                .substring(0, 5)}
            </span>
          </div>
        )}
      </div>
      {/* {onlineUsersId?.includes(user?.userId) ? (
          <span className="bottom-0 left-7 absolute  w-3.5 h-3.5 bg-green-500 dark:bg-green-400 border-2 border-white rounded-full"></span>
        ) : (
          <span className="bottom-0 left-7 absolute  w-3.5 h-3.5 bg-gray-400 border-2 border-white rounded-full"></span>
        )} */}
    </div>
  );
}
