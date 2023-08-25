import React, { useState } from "react";
import axios from "axios";
import ReactLoading from "react-loading";

const ChatGPT = () => {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      prompt: input,
      length: 50,
      temperature: 0.7,
    };

    const config = {
      headers: {
        Authorization:
          "Bearer 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",
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.post(
        "https://api.openai.com/v1/completions",
        data,
        config
      );
      setResponse(res.data.choices[0].text);
      setInput("");
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type your message here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>

      {loading && (
        <ReactLoading type="bars" color="#333" height={50} width={50} />
      )}

      {response && <p>{response}</p>}
    </div>
  );
};

export default ChatGPT;
