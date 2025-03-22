import MessageForm from "../components/messaging/MessageForm";
import NavigationBar from "../components/NavigationBar";

function Messaging() {
  return (
    <>
      <NavigationBar page="Рассылка" />
      <div style={{ margin: "30px" }}>
        <MessageForm />
      </div>
    </>
  );
}

export default Messaging;
