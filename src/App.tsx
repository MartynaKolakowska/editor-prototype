import React from "react";
import { Editor } from "./components/editor";
import "antd/dist/antd.css";
import { AppContainer } from "./components/editor.styled";
import { Typography, Divider } from "antd";

function App() {
  return (
    <AppContainer>
      <Typography.Title>Text Editor</Typography.Title>
      <Divider />
      <Editor />
    </AppContainer>
  );
}

export default App;
