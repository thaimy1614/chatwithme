import { KeyIcon } from "@heroicons/react/solid";
import { SelfImprovementTwoTone } from "@mui/icons-material";
import { format, register } from "timeago.js";
import vi from 'timeago.js/lib/lang/vi';

register('vi', vi);

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Message({ currentRoom, message, self }) {
  return (
    <>
      <li
        className={classNames(
          self !== message.senderId ? "justify-start" : "justify-end",
          "flex"
        )}
      >
        <div className="max-w-[60%]">
          <div
            className={classNames(
              self !== message.senderId
                ? "text-gray-700 dark:text-gray-400 bg-white border border-gray-200 shadow-md dark:bg-gray-900 dark:border-gray-700"
                : "bg-blue-600 dark:bg-blue-500 text-white",
              "p-2 relative block rounded-lg shadow break-words min-w-[5px]"
            )}
          >
            {currentRoom.group && self !== message.senderId && (
              <span
            className={classNames(
              "text-s text-gray-500 dark:text-gray-400 mt-0.5"
            )}
          >
            {message.senderName} {message.senderId===currentRoom.createdBy && (
              <KeyIcon className="d-inline-block h-4 w-4 text-yellow-400 dark:text-yellow-400"
              aria-hidden="true"/>
            )}
                      
          </span>
            )}
            
            <span
              className="block font-normal p-2
                text-start"
            >
              {message.content}
            </span>
          </div>

          {/* Thời gian sẽ nằm bên trái cho tin nhắn của người khác và bên phải cho bản thân */}
          <span
            className={classNames(
              self !== message.senderId
                ? "text-left mr-auto"
                : "text-right ml-auto",
              "block text-xs text-gray-500 dark:text-gray-400 mt-0.5"
            )}
          >
            {format(message.createdAt, 'vi')}
          </span>
        </div>
      </li>
    </>
  );
}
