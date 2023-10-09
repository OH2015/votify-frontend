import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { RoundButton, PlusIcon } from "./Top";
import axios from "axios";
import { API_URL } from "../config";

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.5);
`;

const PopupContent = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 450px;
  transform: translate(-50%, -50%);
  z-index: 3;
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  max-height: 500px; /* 高さが400pxを超えた場合にスクロールさせる */
  overflow-y: auto; /* 縦方向にスクロールバーを表示する */
`;

const MinusIcon = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  width: 10px;
  height: 10px;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    width: 2px;
    height: 10px;
    background-color: white;
  }
  &::before {
    transform: rotate(90deg);
  }
`;

const FlexBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;

  > button {
    margin: 0 5px;
  }
`;

const Button = styled.button`
  width: 120px;
`;

// ボディコンポーネント
const QuestionForm = ({ userId, handleClosePopup }) => {
  const [jsonData, setJsonData] = useState({
    title: "",
    explanation: "",
    choices: ["", ""],
    genre: "その他",
    auth_level: 0,
    user: userId,
  });

  const onTitleChange = (event) => {
    let { name, value } = event.target;
    setJsonData((prevjsonData) => ({ ...prevjsonData, [name]: value }));
  };

  const onExplanationChange = (event) => {
    let { name, value } = event.target;
    setJsonData((prevjsonData) => ({ ...prevjsonData, [name]: value }));
  };

  const onChoiceChange = (event) => {
    let { name, value } = event.target;
    setJsonData((prevjsonData) => ({
      ...prevjsonData,
      choices: prevjsonData.choices.map((choice, index) =>
        index === parseInt(event.target.dataset.index) ? value : choice
      ),
    }));
  };

  const onPlusClicked = (event) => {
    setJsonData((prevjsonData) => ({
      ...prevjsonData,
      choices: [...prevjsonData.choices, ""],
    }));
  };

  const onMinusClicked = (event) => {
    setJsonData((prevjsonData) => ({
      ...prevjsonData,
      choices: prevjsonData.choices.slice(0, -1),
    }));
  };

  const handleSubmit = () => {
    // 入力値チェック
    const filledChoices = jsonData.choices.filter((choice) => choice);
    if (!jsonData.title) {
      window.alert("タイトルは空にできません");
      return;
    }
    if (filledChoices.length < 2) {
      window.alert("選択肢は最低2つ必要です");
      return;
    }
    jsonData.choices = filledChoices;
    // API送信
    axios
      .post(API_URL + "/create_question/", jsonData)
      .then((res) => {
        window.location.href = "/";
      })
      .catch((e) => {
        window.alert("投稿に失敗しました。");
      });
  };

  return (
    <PopupOverlay onClick={handleClosePopup}>
      <PopupContent onClick={(event) => event.stopPropagation()}>
        <div className="container mt-12">
          <div className="form-group">
            <label htmlFor="title">タイトル</label>
            <input
              required
              value={jsonData.title}
              onInput={onTitleChange}
              name="title"
              className="form-control"
              placeholder="タイトルを入力してください"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">説明欄</label>
            <textarea
              value={jsonData.explanation}
              onInput={onExplanationChange}
              name="explanation"
              className="form-control"
              placeholder="説明を入力してください"
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="options">選択肢</label>
            {jsonData.choices.map((choice, idx) => (
              <input
                required
                name="choice"
                data-index={idx}
                key={idx}
                value={choice}
                onInput={onChoiceChange}
                className="form-control"
                placeholder="選択肢を入力してください"
              />
            ))}
          </div>
          <FlexBox>
            <RoundButton onClick={(event) => onPlusClicked(event)}>
              <PlusIcon></PlusIcon>
            </RoundButton>
            {jsonData.choices.length > 2 && (
              <RoundButton onClick={(event) => onMinusClicked(event)}>
                <MinusIcon></MinusIcon>
              </RoundButton>
            )}
          </FlexBox>
          <FlexBox>
            <Button
              onClick={handleSubmit}
              className="btn btn-primary btn-block"
            >
              作成
            </Button>
            <Button
              onClick={handleClosePopup}
              className="btn btn-secondary btn-block"
            >
              キャンセル
            </Button>
          </FlexBox>
        </div>
      </PopupContent>
    </PopupOverlay>
  );
};

export default QuestionForm;
