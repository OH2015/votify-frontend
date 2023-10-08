import React, { useCallback, useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Choice from "./Choice";
import Comment from "./Comment";
import axios from "axios";
import { API_URL } from "../config";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

const QuestionContainer = styled.div`
  background-color: #f5f5f5;
  margin-bottom: 20px;
  width: 100%;
  border: gray 1px solid;
  border-radius: 5px;
  padding: 5px;
  box-shadow: 3px 3px 3px;
`;
const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;
const QuestionTitle = styled.h3`
  text-align: left;
`;
const Explanation = styled.div`
  text-align: left;
`;
const CopyText = styled.input`
  position: absolute;
  left: -9999px;
`;

const CopyButton = styled.button`
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 15px;
  text-align: right;
`;
const CommentToggle = styled.button`
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 15px;
  &:hover {
    cursor: pointer;
  }
`;
const CommentForm = styled.div`
  padding-bottom: 10px;
  padding-top: 10px;
  border-bottom: solid gray 1px;
  display: flex;
  align-items: center;
`;
const Draft = styled.textarea`
  width: calc(100% - 150px);
  height: 28px;
  resize: none;
  overflow: hidden;
  margin-right: 30px;
`;
const CommentButton = styled.button`
  width: 100px;
`;

// 投稿コンポーネント
const Post = ({
  id,
  title,
  explanation,
  choices: ini_choices,
  author,
  setIsLoading,
  userId,
  voted,
}) => {
  // 選択肢のリストをステートとして保持
  const [choices, setChoices] = useState(ini_choices);
  const [copied, setCopied] = useState(false);
  const [opend, setOpend] = useState(false); // コメント表示/非表示
  const [commentList, setCommentList] = useState([]); // コメントのリスト
  const inputRef = useRef(null);
  const ref = useRef(null);

  // URL取得
  const urlText = `${window.location.hostname}/?question_id=${id}`;

  // 初期処理
  useEffect(() => {
    const getCommentList = async () => {
      // コメント取得
      const result = await axios.get(
        `${API_URL}/api/comment/?question_id=${id}`,
        { withCredentials: true }
      );
      setCommentList(result.data);
    };
    getCommentList();
    if (voted) {
      choices.forEach((choice) => {
        if (choice.id == voted["choice"]) {
          choice.vote_id = voted["vote"];
        }
      });
      setChoices(choices);
    }
  }, []);

  // 選択肢が押下された時の処理
  const choiceClickHandler = async (choice_id) => {
    try {
      // 選択された選択肢
      const choice = choices.find((e) => e.id == choice_id);
      // 投票済みの選択肢
      const posted = choices.find((e) => e.vote_id);
      setIsLoading(true);

      // 選択済みなら解除
      if (choice.vote_id) {
        await axios.delete(`${API_URL}/api/vote/${choice.vote_id}/`, {
          withCredentials: true,
        });
        choice.vote_id = null; // vote_idをリセット
        choice.votes -= 1; // 得票数-1
      } else {
        // 投票先にPOST
        const res = await axios.post(
          `${API_URL}/api/vote/`,
          {
            question: id,
            choice: choice_id,
            user: null,
          },
          { withCredentials: true }
        );
        // 帰ってきたvote_idをセット
        choice.vote_id = res.data.id;
        choice.votes += 1; // 得票数+1

        // 既に選択済みのPOSTをDELETE
        if (posted) {
          posted.vote_id = null; // vote_idをリセット
          posted.votes -= 1; // 得票数-1
        }
      }

      // 選択肢のリストを上書き
      setChoices([...choices]);

      setIsLoading(false);
    } catch (error) {
      // axios失敗時
      alert("通信に失敗しました");
      setIsLoading(false);
    }
  };

  // 得票率を計算して返却
  const getProgress = useCallback((votes) => {
    const sum = choices.reduce((sum, el) => sum + el.votes, 0);
    return (sum ? votes / sum : 0) * 100;
  }, []);

  // クリップボードにリンクをコピーする処理
  const copyUrl = () => {
    inputRef.current.select();
    document.execCommand("Copy");
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  // コメント表示/非表示切り替え処理
  const toggleClickHandler = () => {
    setOpend(!opend);
  };
  // 投稿削除処理
  const deleteClickHandler = async () => {
    if (window.confirm("この投稿を削除してもよろしいですか？")) {
      await axios.delete(`${API_URL}/api/question/${id}/`, {
        withCredentials: true,
      });
      window.location.href = "/";
    }
  };
  // コメント削除処理
  const handleCommentDelete = (deletedCommentId) => {
    setCommentList(
      commentList.filter((comment) => comment.id !== deletedCommentId)
    );
  };
  // コメント入力欄の大きさ制御
  const autoResize = () => {
    const draft = ref.current;
    draft.style.height = "28px";
    draft.style.height = `${draft.scrollHeight}px`;
  };
  // コメント投稿処理
  const submit_comment = async () => {
    const draft = ref.current;
    if (userId === 0) {
      alert("コメントするにはログインが必要です");
      return;
    }
    if (draft.value === "") return;

    // コメントをPOST送信
    const result = await axios.post(
      `${API_URL}/api/comment/`,
      {
        question: id,
        text: draft.value,
        user_id: userId,
      },
      { withCredentials: true }
    );
    draft.value = "";
    autoResize();

    setCommentList(commentList.concat(result.data));
    setOpend(true);
  };

  return (
    <QuestionContainer>
      <QuestionHeader>
        <QuestionTitle>{title}</QuestionTitle>
        <CopyText ref={inputRef} value={urlText} readOnly />
        <CopyButton onClick={copyUrl}>
          <i className="fas fa-copy"></i>
          {copied ? "Copied!" : "Copy URL"}
        </CopyButton>
      </QuestionHeader>
      <Explanation>{explanation}</Explanation>
      {choices.map((choice) => {
        return (
          <div key={choice.id} onClick={() => choiceClickHandler(choice.id)}>
            <Choice {...choice} progress={getProgress(choice.votes)} />
          </div>
        );
      })}

      <CommentToggle onClick={toggleClickHandler}>
        コメント({commentList.length})
      </CommentToggle>
      {userId === author.id && (
        <CommentToggle onClick={deleteClickHandler}>削除</CommentToggle>
      )}

      {opend && (
        <>
          <CommentForm>
            <Draft maxLength={1000} ref={ref} onInput={autoResize} />
            <CommentButton className="btn btn-primary" onClick={submit_comment}>
              送信
            </CommentButton>
          </CommentForm>
          {commentList.map((comment) => (
            <Comment
              key={comment.id}
              {...comment}
              userId={userId}
              onDelete={handleCommentDelete}
            />
          ))}
        </>
      )}
    </QuestionContainer>
  );
};

export default Post;
