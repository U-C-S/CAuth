// import logo from './logo.svg';
import styles from './App.module.css';

import Prompt from './Prompt';

export default function App() {
  return (
    <div className={styles.App}>
      <Prompt guestApp={guestApp} accountAppX={accountAppX} permissions={permissions}/>
    </div>
  );
}

// these are the props needed
const guestApp = {
  name: "GuestApp",
  owner: "GuestAppOwner",
  logoUrl: "/images/app-logo.svg"
}
const accountAppX = {
  name: "YourAppXAccount",
  logoUrl: "/images/avatar.svg"
}
const permissions = [
  "Email",
  "Phone",
  "Local Storage"
]
// export default App;
