import { KeyIcon } from "@heroicons/react/solid";
import { SelfImprovementTwoTone } from "@mui/icons-material";
import { format, register } from "timeago.js";
import vi from "timeago.js/lib/lang/vi";
import { convertDateTimeZone } from "../../utils/DateTimeZone";
import { useState } from "react";

register("vi", vi);

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Message({ currentRoom, message, self }) {
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  return (
    <li
      className={classNames(
        self !== message.senderId ? "justify-start" : "justify-end",
        "flex"
      )}
    >
      <div
        className="max-w-[60%]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Tin nhắn và thời gian */}
        <div id={message.id}
          className={classNames(
            self !== message.senderId
              ? "text-gray-700 dark:text-white bg-white-600 border border-gray-200 shadow-md dark:bg-gray-900 dark:border-gray-700"
              : "bg-blue-600 dark:bg-blue-500 text-white",
            "p-2 relative block rounded-lg shadow break-words max-w-full"
          )}
          style={{ wordBreak: "break-word" }}
        >
          {/* Tên người gửi nếu cần */}
          {currentRoom.group && self !== message.senderId && (
            <span className="text-s text-gray-500 dark:text-white mt-0.5">
              {message.senderName}{" "}
              {message.senderId === currentRoom.createdBy && (
                <KeyIcon
                  className="d-inline-block h-4 w-4 text-yellow-400 dark:text-yellow-400"
                  aria-hidden="true"
                />
              )}
            </span>
          )}
  
          {/* Nội dung tin nhắn */}
          <span className="block font-normal p-2 text-start min-w-[80px]">
            {message.content}
          </span>
  
          {/* Thời gian bên dưới */}
          <span
            className={(self !== message.senderId ? "text-gray-500 dark:text-white " : "text-white-500 dark:text-white ") +"block text-xs mt-1 text-start"}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {!isHovered
              ? format(convertDateTimeZone(message.createdAt).toString(), "vi")
              : convertDateTimeZone(message.createdAt)
                  .toTimeString()
                  .substring(0, 5)}
          </span>
        </div>
      </div>
    </li>
  );
  
}
