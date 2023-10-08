import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { RoundButton, PlusIcon } from "./Top";
import axios from "axios";

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
  const [formData, setFormData] = useState({
    title: "",
    explanation: "",
    choices: ["", ""],
    genre: "その他",
    auth_level: 0,
    user: userId,
  });

  const handleChange = (event, param) => {
    let { name, value } = event.target;
    if (name === "choice") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        choices: prevFormData.choices.map((choice, index) =>
          index === parseInt(event.target.dataset.index) ? value : choice
        ),
      }));
    } else if (param === "plus") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        choices: [...prevFormData.choices, ""],
      }));
    } else if (param === "minus") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        choices: prevFormData.choices.slice(0, -1),
      }));
    } else {
      setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    // 入力値チェック
    const filledChoices = formData.choices.filter((choice) => choice);
    if (!formData.title) {
      window.alert("タイトルは空にできません");
      return;
    }
    if (filledChoices.length < 2) {
      window.alert("選択肢は最低2つ必要です");
      return;
    }
    formData.choices = filledChoices;
    const res = await axios.post("/create_question/", formData);
    window.location.href = "/";
  };

  return (
    <PopupOverlay onClick={handleClosePopup}>
      <PopupContent onClick={(event) => event.stopPropagation()}>
        <div className="container mt-12">
          <div className="form-group">
            <label htmlFor="title">タイトル</label>
            <input
              required
              value={formData.title}
              onInput={handleChange}
              name="title"
              className="form-control"
              placeholder="タイトルを入力してください"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">説明欄</label>
            <textarea
              value={formData.explanation}
              onInput={handleChange}
              name="explanation"
              className="form-control"
              placeholder="説明を入力してください"
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="options">選択肢</label>
            {formData.choices.map((choice, idx) => (
              <input
                required
                name="choice"
                data-index={idx}
                key={idx}
                value={choice}
                onInput={handleChange}
                className="form-control"
                placeholder="選択肢を入力してください"
              />
            ))}
          </div>
          <FlexBox>
            <RoundButton onClick={(event) => handleChange(event, "plus")}>
              <PlusIcon></PlusIcon>
            </RoundButton>
            {formData.choices.length > 2 && (
              <RoundButton onClick={(event) => handleChange(event, "minus")}>
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
            {/* </div> */}
            {/* </div> */}
          </FlexBox>
        </div>
      </PopupContent>
    </PopupOverlay>
  );
};

export default QuestionForm;
