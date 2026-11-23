import { useParams } from "react-router-dom";
import ChatConnection from "../components/chat/ChatConnection";

const ChatPage = () => {

    const { chatId } = useParams();

    return (
        <div>
            <h2>Real-Time Chat</h2>
            <ChatConnection chatId={chatId} />
        </div>
    );
};

export default ChatPage;