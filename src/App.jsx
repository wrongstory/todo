// 프로젝트 최소 요구 사항
// 1. Todo 생성 / 조회 / 수정 / 삭제 (CRUD) 기능 구현
// 2. 현재 시간 표시, 타이머, 스톱워치 중 하나 이상의 기능을 구현
// 3. 랜덤 명언을 표시할 수 있는 컴포넌트 생성
// 4. useState, useEffect, useRef 를 각각 한번 이상 사용

{
  /* <Bonus>
  json-server를 사용해 Todo 정보를 파일로 저장
  Custom Hook 을 만들고 사용 */
}

import { useRef, useState } from 'react';
import './App.css';

const HeadLine = () => {
  return <h1>Todo List is now on your BukitList!</h1>;
};

function App() {
  const [todo, setTodo] = useState([
    {
      id: Number(new Date()),
      content: '안녕하세요',
    },
  ]);
  return (
    <>
      <header>
        <HeadLine />
      </header>
      <nav>
        <input />
        <button>조회</button>
      </nav>
      <hr />
      <main>
        <h2>It's your Todo List!!</h2>
        <span>번호</span>
        <span>내용</span>
        <span>기능</span>
        <hr />
        <MainList todo={todo} setTodo={setTodo} />
        <hr />
        <InputTodo setTodo={setTodo} />
      </main>
      <hr />
      <footer>Create by. L</footer>
    </>
  );

  function MainList({ todo, setTodo }) {
    return (
      <ul>
        {todo.map((el) => (
          <Todo todo={el} setTodo={setTodo} />
        ))}
      </ul>
    );
  }

  function Todo({ todo, setTodo }) {
    return (
      <li key={todo.id}>
        {todo.content}
        <button>수정</button>
        <button
          onClick={() => {
            setTodo((prev) => prev.filter((el) => el.id !== todo.id));
          }}
        >
          삭제
        </button>
      </li>
    );
  }

  function InputTodo({ setTodo }) {
    const inputRef = useRef(null);
    const addTodo = () => {
      const newTodo = {
        id: Number(new Date()),
        // inputRef 에 current 를 찍어서 DOM 주소를 가져온 다음 DOM 요소의 value 를 가져옴
        content: inputRef.current.value,
      };
      setTodo((prev) => [...prev, newTodo]);
    };
    return (
      <>
        <input ref={inputRef} />
        <button onClick={addTodo}>추가</button>
      </>
    );
  }
}

export default App;
