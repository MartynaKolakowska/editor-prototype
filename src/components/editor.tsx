import React, { useState, useEffect } from "react";
import { Input, Typography, Spin, Alert } from "antd";
import axios from "axios";
import { EditorFunctions } from "./constants";
import { binarySearch, sortBySymbol } from "./utils";
import {
  StyledWrapper,
  StyledInput,
  StyledOutput,
  SubmitButton,
} from "./editor.styled";
import PQueue from "p-queue";

const { TextArea } = Input;

export const Editor: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [data, setData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const regexp = new RegExp("{{( |\n)([^}]*/[^}]*)( |\n)}}", "g");

  const queue = new PQueue({ concurrency: 1, interval: 500, intervalCap: 3 });

  const handleChangeInput = (e) => setInputText(e.target.value);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios
        .get("https://api.coinpaprika.com/v1/coins")
        .catch(() => {
          setErrorMessage("Cannot fetch data. Please try again");
          return null;
        })
        .then((res) => {
          return res;
        });
      if (result) {
        setData(result.data.sort(sortBySymbol));
      }
    };
    fetchData();
  }, []);

  const onSubmit = async () => {
    setErrorMessage("");
    setIsLoading(true);
    let outputText = inputText;
    let regexpResult;
    while ((regexpResult = regexp.exec(inputText)) !== null) {
      const editorFunction = regexpResult[2].split("/");

      if (editorFunction[0] === EditorFunctions.GET_NAME) {
        const currencyName = getName(editorFunction[1]);
        if (currencyName) {
          outputText = outputText.replace(regexpResult[0], currencyName);
        }
      } else if (editorFunction[0] === EditorFunctions.GET_EXCHANGE) {
        const exchangeInUSD = await queue.add(() =>
          getExchange(editorFunction[1])
            .catch(() => setErrorMessage("Too many requests."))
            .then((res) => {
              return res;
            })
        );
        if (exchangeInUSD) {
          outputText = outputText.replace(regexpResult[0], exchangeInUSD);
        }
      } else {
        setErrorMessage(`Invalid function name.(${editorFunction[0]})`);
      }
    }
    setOutputText(outputText);
    setIsLoading(false);
  };
  const getName = (symbol: string) => {
    const currency = binarySearch(data, symbol);
    if (!currency) {
      setErrorMessage(`Could not find specified symbol(${symbol}).`);
      return;
    }
    return currency.name;
  };

  const getExchange = async (symbol: string) => {
    const currency = binarySearch(data, symbol);
    if (!currency) {
      setErrorMessage(`Could not find specified symbol(${symbol}).`);
      return;
    }
    const exchange = await axios.get(
      `https://api.coinpaprika.com/v1/coins/${currency.id}/ohlcv/today/`
    );
    return exchange.data[0].close.toFixed(2);
  };
  return (
    <StyledWrapper>
      <StyledInput>
        <Typography.Title>Input</Typography.Title>
        <TextArea
          rows={10}
          placeholder={"Type your text here..."}
          onChange={handleChangeInput}
        />
      </StyledInput>
      <StyledOutput>
        <Typography.Title>Output</Typography.Title>
        <Spin spinning={isLoading} tip="Loading...">
          <TextArea rows={10} value={outputText} />
        </Spin>
      </StyledOutput>
      <SubmitButton
        type="primary"
        size={"large"}
        loading={isLoading}
        onClick={onSubmit}
      >
        Submit
      </SubmitButton>
      {errorMessage && <Alert message={errorMessage} type="error" showIcon />}
    </StyledWrapper>
  );
};
