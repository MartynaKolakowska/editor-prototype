import styled from "styled-components";
import { Button } from "antd";

export const StyledWrapper = styled.div`
  display: grid;
  column-gap: 32px;
  row-gap: 32px;
  grid-template-areas:
    "input output"
    "submit submit";
`;

export const AppContainer = styled.div`
  padding: 32px;
  text-align: center;
`;

export const StyledInput = styled.section`
  grid-area: input;
`;
export const StyledOutput = styled.section`
  grid-area: output;
`;

export const SubmitButton = styled(Button)`
  grid-area: submit;
  justify-self: center;
  width: 200px;
`;
