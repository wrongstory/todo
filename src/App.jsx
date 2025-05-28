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

import { useEffect, useRef, useState } from 'react';
import './App.css';

const HeadLine = () => {
  return <h1>Todo List is now on your BukitList!</h1>;
};

const Wisesaying = () => {
  return <h3>{<Advice />}</h3>;
};

function App() {
  // 서버에서 data 받아옴
  const [isLoading, data] = useFetch('http://localhost:3000/todo');
  // 화면 렌더
  const [todo, setTodo] = useState([]);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [time, setTime] = useState(0);
  const [isTimer, setIsTimer] = useState(false);

  useEffect(() => {
    if (currentTodo) {
      fetch(`http://localhost:3000/todo/${currentTodo}`, {
        method: 'PATCH',
        body: JSON.stringify({
          time: todo.find((el) => el.id === currentTodo).time + 1,
        }),
      })
        .then((res) => res.json())
        .then((res) =>
          setTodo((prev) =>
            prev.map((el) => (el.id === currentTodo ? res : el))
          )
        );
    }
  }, [time]);

  useEffect(() => {
    setTime(0);
  }, [isTimer]);
  useEffect(() => {
    if (data) setTodo(data);
  }, [isLoading]);

  return (
    <>
      <header>
        <div className="clock-box">
          <Clock />
        </div>
        <div>
          <Wisesaying />
        </div>
        <HeadLine />
      </header>
      <main>
        <nav className="nav-bar">
          <div className="nav-left">
            <input className="todo-input" />
            <button className="search-btn">조회</button>
          </div>
          <div className="nav-right">
            <ToggleTimer
              isTimer={isTimer}
              setIsTimer={setIsTimer}
              time={time}
              setTime={setTime}
            />
          </div>
        </nav>
        <MainList
          todo={todo}
          setTodo={setTodo}
          setCurrentTodo={setCurrentTodo}
          currentTodo={currentTodo}
        />
        <hr />
        <InputTodo setTodo={setTodo} />
      </main>
      <hr />
      <footer>Create by. L</footer>
    </>
  );
}
// =======================================================================
// function
// =======================================================================

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setInterval(() => {
      setTime(new Date());
    }, 1000);
  }, []);

  return <div>{time.toLocaleTimeString()}</div>;
};

const ToggleTimer = ({ isTimer, setIsTimer, time, setTime }) => {
  return (
    <div className="toggle-timer">
      <button
        className="toggle-btn"
        onClick={() => setIsTimer((prev) => !prev)}
      >
        {isTimer ? '스톱워치로 변경' : '타이머로 변경'}
      </button>
      {isTimer ? (
        <Timer time={time} setTime={setTime} />
      ) : (
        <StopWatch time={time} setTime={setTime} />
      )}
    </div>
  );
};

const formatTime = (secondes) => {
  const hour = String(Math.floor(secondes / 3600)).padStart(2, '0');
  const min = String(Math.floor((secondes % 3600) / 60)).padStart(2, '0');
  const sec = String(secondes % 60).padStart(2, '0');

  const timeString = `${hour}:${min}:${sec}`;

  return timeString;
};

const StopWatch = ({ time, setTime }) => {
  // 시작. 정지. 초기화
  const [isOn, setIsOn] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isOn === true) {
      const timerId = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
      timerRef.current = timerId;
    } else {
      clearInterval(timerRef.current);
    }
  }, [isOn]);

  return (
    <div>
      {formatTime(time)}
      <button onClick={() => setIsOn((prev) => !prev)}>
        {isOn ? '끄기' : '켜기'}
      </button>
      <button
        onClick={() => {
          setTime(0);
          setIsOn(false);
        }}
      >
        리셋
      </button>
    </div>
  );
};

const useFetch = (url) => {
  const [isLoaing, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setIsLoading(false);
      });
  }, [url]);
  return [isLoaing, data];
};

const Advice = () => {
  const [isLoaing, data] = useFetch(
    'https://korean-advice-open-api.vercel.app/api/advice'
  );

  return (
    <>
      {!isLoaing && (
        <div className="advice-box">
          <div className="message">"{data.message}"</div>
          <div className="author">- {data.author}</div>
        </div>
      )}
    </>
  );
};

const Timer = ({ time, setTime }) => {
  const [startTime, setStartTime] = useState(0);
  const [isOn, setIsOn] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isOn && time > 0) {
      const timerId = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
      timerRef.current = timerId;
    } else if (!isOn || time == 0) {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isOn, time]);

  return (
    <div>
      <div>
        {time ? formatTime(time) : formatTime(startTime)}
        <button
          onClick={() => {
            setIsOn(true);
            setTime(time ? time : startTime);
          }}
        >
          시작
        </button>
        <button onClick={() => setIsOn(false)}>몀춤</button>
        <button
          onClick={() => {
            setTime(0);
            setStartTime(0);
            setIsOn(false);
          }}
        >
          리셋
        </button>
      </div>

      <input
        type="range"
        value={startTime}
        min="0"
        max="3600"
        step="30"
        onChange={(event) => setStartTime(Number(event.target.value))}
      />
    </div>
  );
};

function MainList({ todo, setTodo, setCurrentTodo, currentTodo }) {
  return (
    <table className="todo-table">
      <thead>
        <tr>
          <th>번 호</th>
          <th>할 일</th>
          <th>소요시간</th>
          <th>기능</th>
        </tr>
      </thead>
      <tbody>
        {todo.map((el, index) => (
          <tr key={el.id} className={currentTodo === el.id ? 'current' : ''}>
            <Todo
              index={index + 1}
              todo={el}
              setTodo={setTodo}
              setCurrentTodo={setCurrentTodo}
              currentTodo={currentTodo}
            />
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Todo({ index, todo, setTodo, setCurrentTodo }) {
  return (
    <>
      <td>{index}</td>
      <td>{todo.content}</td>
      <td>{formatTime(todo.time)}</td>
      <td>
        <button onClick={() => setCurrentTodo(todo.id)}>선택</button>
        <button>수정</button>
        <button
          onClick={() => {
            fetch(`http://localhost:3000/todo/${todo.id}`, {
              method: 'DELETE',
            }).then((res) => {
              if (res.ok) {
                setTodo((prev) => prev.filter((el) => el.id !== todo.id));
              }
            });
          }}
        >
          삭제
        </button>
      </td>
    </>
  );
}

function InputTodo({ setTodo }) {
  const inputRef = useRef(null);
  const addTodo = () => {
    const newTodo = {
      // JSON 은 요청 보내면 id 만들어주기때문에 id를 따로 정의할 필요 없음.
      // id: Number(new Date()),
      // inputRef 에 current 를 찍어서 DOM 주소를 가져온 다음 DOM 요소의 value 를 가져옴
      content: inputRef.current.value,
      time: 0,
    };
    fetch('http://localhost:3000/todo', {
      method: 'POST',
      body: JSON.stringify(newTodo),
    })
      .then((res) => res.json())
      .then((res) => setTodo((prev) => [...prev, res]));
  };
  return (
    <>
      <input ref={inputRef} />
      <button onClick={addTodo}>추가</button>
    </>
  );
}
export default App;
